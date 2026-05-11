import React, { useContext, useRef, useState } from 'react';
import { View, Text, Button, Dimensions, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ResultStocker } from '../context/ResultStocker';
import {UserStocker} from '../context/UserStocker';
import { LineChart } from 'react-native-chart-kit';
import Config from 'react-native-config';
import ViewShot, { captureRef } from 'react-native-view-shot';
import axios from 'axios';
import { S3, CognitoIdentityCredentials } from 'aws-sdk';
import { Buffer } from 'buffer';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

const Result3Screen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Result3Screen'>>();

    const resultStocker = useContext(ResultStocker);
    const graphData = resultStocker?.result?.graphData;
    const userStocker = useContext(UserStocker);
    const userId = userStocker?.user?.userId;

    const [musicName, setMusicName] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const viewShotRef = useRef(null);

    const saveResult = async () => {
        if (musicName) {
            try {
                const graphUri = await captureRef(viewShotRef, {
                    format: 'png',
                    quality: 1.0,
                });
                // グラフ画像を一時ファイルとして保存
                const filePath = `${RNFS.DocumentDirectoryPath}/graph.png`;
                //既存ファイルの削除
                await RNFS.unlink(filePath).catch(() => {});
                console.log('一時ファイルを削除しました:', filePath);
                //ファイルの保存
                await RNFS.copyFile(graphUri, filePath);

                // ファイルをBufferに変換
                const graphBase64 = await RNFS.readFile(filePath, 'base64');
                if (!graphBase64) {
                    throw new Error('Failed to read the graph file as base64.');
                }
                const graphBuffer = Buffer.from(graphBase64, 'base64');

                const url = Config.SAVE_RESULT_API || '';
                const resultJson = getJson();

                try {
                    const response = await axios.post(url, resultJson, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.status === 200 && response.data) {
                        console.log('API Response: ', response.data);
                        console.log('結果の保存に成功しました。');
                        if (resultStocker?.result?.userImageData[0]) {
                            saveImage(0, base64ToBuffer(resultStocker.result.userImageData[0]));
                        }
                        if (resultStocker?.result?.originalImageData[0]) {
                            saveImage(1, base64ToBuffer(resultStocker.result.originalImageData[0]));
                        }
                        if (resultStocker?.result?.userImageData[1]) {
                            saveImage(2, base64ToBuffer(resultStocker.result.userImageData[1]));
                        }
                        if (resultStocker?.result?.originalImageData[1]) {
                            saveImage(3, base64ToBuffer(resultStocker.result.originalImageData[1]));
                        }
                        saveImage(4, graphBuffer);

                        // 一時ファイルの削除
                        await RNFS.unlink(filePath);
                        console.log('一時ファイルを削除しました:', filePath);

                    } else {
                        console.log('Dynamoへの保存に失敗しました。');
                    }

                } catch (error) {
                    console.error('保存に失敗しました。', error);
                }
            } catch (error) {
                console.error('グラフのキャプチャに失敗しました', error);
            }
        }else{
            setErrorMessage('曲名を入力してください。');
        }
    };

    const getJson = (): string => {
        return JSON.stringify({
            UserID: userId,
            MusicName: musicName,
            UserBestShot: 'userbestshot_url',
            OriginalBestShot: 'originalbestshot_url',
            UserWorstShot: 'userworstshot_url',
            OriginalWorstShot: 'originalworstshot',
            Score: resultStocker?.result?.totalScore !== undefined ? Math.floor(resultStocker.result.totalScore) : 0,
            Rank: resultStocker?.result?.rank,
            Graph: 'graph_url',
        });
    };

    const saveImage = async (flag: number, image: Buffer) => {
        const BUCKET_NAME = Config.S3_BUCKET_NAME as string;
        const IDENTITY_POOL_ID = Config.S3_IDENTITY_POOL_ID as string;
        let fileName: string;

        switch (flag) {
            case 0:
                fileName = `${userId}_user_best_shot.png`;
                break;
            case 1:
                fileName = `${userId}_original_best_shot.png`;
                break;
            case 2:
                fileName = `${userId}_user_worst_shot.png`;
                break;
            case 3:
                fileName = `${userId}_original_worst_shot.png`;
                break;
            case 4:
                fileName = `${userId}_graph.png`;
                break;
            default:
                throw new Error('Invalid flag value: ' + flag);
        }

        try {
            // Bufferから一時的な画像ファイルを作成
            const tempFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
            await RNFS.writeFile(tempFilePath, image.toString('base64'), 'base64');

            // 画像を圧縮
            const compressedImage = await ImageResizer.createResizedImage(
                tempFilePath, // 入力画像のパス
                1024, // 最大幅
                1024, // 最大高さ
                'PNG', // 出力形式
                80, // 圧縮品質
            );
            console.log('Compressed Image:', compressedImage);

            // 圧縮後の画像をBufferとして読み込む
            const compressedImageBuffer = await RNFS.readFile(compressedImage.uri, 'base64');
            const imageBuffer = Buffer.from(compressedImageBuffer, 'base64');
            console.log('Compressed Buffer:', imageBuffer);


            // Cognitoで認証情報を取得
            const credentials = new CognitoIdentityCredentials({
                IdentityPoolId: IDENTITY_POOL_ID,
            });

            const s3Client = new S3({
                credentials: new CognitoIdentityCredentials({
                    IdentityPoolId: IDENTITY_POOL_ID,
                }),
                region: 'ap-northeast-1', // リージョンを明示的に指定
            });
            await credentials.getPromise(); // 認証情報を取得

            // 認証情報を出力
            console.log('Identity ID:', credentials.identityId);
            console.log('Access Key ID:', credentials.accessKeyId);
            console.log('Secret Access Key:', credentials.secretAccessKey);
            console.log('Session Token:', credentials.sessionToken);

            // S3にアップロード
            const uploadParams = {
                Bucket: BUCKET_NAME,
                Key: fileName,
                Body: imageBuffer,
            };
            await s3Client.putObject(uploadParams).promise();


            // アップロードしたファイルのURLを取得
            const uploadedUrl = s3Client.getSignedUrl('getObject', {
                Bucket: BUCKET_NAME,
                Key: fileName,
            });

            console.log('S3へのアップロード成功:', uploadedUrl);
            // 一時ファイルの削除
            await RNFS.unlink(tempFilePath);
            console.log('一時ファイルを削除しました:', tempFilePath);
        } catch (error) {
            console.error('S3への保存に失敗しました。');
        }
    }
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>結果3画面</Text>

            <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
                {graphData && (
                    <LineChart
                        data={graphData}
                        width={Dimensions.get('window').width - 40} // グラフの幅
                        height={220} // グラフの高さ
                        yAxisSuffix=""
                        yAxisInterval={1}
                        fromZero={true}
                        chartConfig={{
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            decimalPlaces: 2, // 小数点以下の桁数
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: '6',
                                strokeWidth: '2',
                            },
                        }}
                        bezier // ベジエ曲線を使用
                        style={styles.chartStyle}
                    />
                )}
            </ViewShot>

            {/* 曲名の入力フォーム */}
            <TextInput
                style={styles.input}
                placeholder="タイトル入力"
                value={musicName}
                onChangeText={setMusicName}
            />

            <Button title="保存" onPress={saveResult} />
            <Button title="削除" onPress={() => navigation.navigate('HomeScreen')} />

            {/* エラーメッセージ */}
            {errorMessage && (
                <Text style={{ color: 'red', marginTop: 20 }}>{errorMessage}</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    chartStyle: {
        marginVertical: 8,
        borderRadius: 16,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 10,
        width: '80%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 5,
    },
});

function base64ToBuffer(base64: string): Buffer {
    const base64String = base64.includes(',') ? base64.split(',')[1] : base64;
    return Buffer.from(base64String, 'base64');
}

export default Result3Screen;