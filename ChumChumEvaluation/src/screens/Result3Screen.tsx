import React, {useContext, useState, useRef} from 'react';
import { View, Text, Button, StyleSheet, Dimensions, TextInput} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ResultStocker } from '../context/ResultStocker';
import { LineChart } from 'react-native-chart-kit';
import Config from 'react-native-config';
import ViewShot, { captureRef } from 'react-native-view-shot';
import axios from 'axios';
import * as AWS from 'aws-sdk';

const Result3Screen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Result3Screen'>>();

    const resultStocker = useContext(ResultStocker);
    const graphData = resultStocker?.result?.graphData;

    const [musicName, setMusicName] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [resultId, setResultId] = useState<string>('');
    const viewGraphShotRef = useRef(null);

    const saveResult = async () => {
        if(musicName){
            let graphBuffer: any;

            try{
                const graphUri = await captureRef( viewGraphShotRef, {
                    format: 'png',
                    quality: 1.0,
                })
                const graphResponse = await fetch(graphUri);
                const graphBlob = await graphResponse.blob();
                const graphArrayBuffer = await graphBlob.arrayBuffer();
                graphBuffer = Buffer.from(graphArrayBuffer);
            } catch (error) {
                console.error('グラフのキャプチャに失敗しました', error);
            }

            const url = Config.SAVE_RESULT_API || '';
            const resultJson = getJson();

            try{
                const response = await axios.post(url, resultJson, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200 && response.data) {
                    console.log("API Response: ", response.data);
                    const body = JSON.parse(response.data.body);
                    const resultIdInt = body.ResultID;
                    setResultId(resultIdInt.toString());
    
                    console.error('Dynamoへの保存に成功しました。');
                    if (resultStocker?.result?.userImageData[0]) {
                        saveImage(0, base64ToBuffer(resultStocker.result.userImageData[0]));
                    }
                    if (resultStocker?.result?.originalImageData[0]) {
                        saveImage(1, base64ToBuffer(resultStocker.result.originalImageData[0]));
                    }
                    if (resultStocker?.result?.userImageData[1]) {
                        saveImage(2, base64ToBuffer(resultStocker.result.userImageData[1]));
                    }
                    if (resultStocker?.result?.originalImageData[0]) {
                        saveImage(3, base64ToBuffer(resultStocker.result.originalImageData[0]));
                    }
                    saveImage(4, graphBuffer);
                } else {
                    console.error('Dynamoへの保存に失敗しました。');
                }

            } catch (error) {
                console.error('保存に失敗しました。', error);
            }
        }else{
            setErrorMessage('曲名を入力してください。');
        }
    };

    const getJson = (): string => {
        return JSON.stringify({
            UserID: "0",//ユーザーIDは仮で0
            MusicName: musicName,
            UserBestShot: "userbestshot_url",
            OriginalBestShot: "originalbestshot_url",
            UserWorstShot: "userworstshot_url",
            OriginalWorstShot: "originalworstshot",
            Score: resultStocker?.result?.totalScore !== undefined ? Math.floor(resultStocker.result.totalScore) : 0,
            Rank: resultStocker?.result?.rank,
            Graph: "graph_url"
        });
    }

    const saveImage = async (flag: number, image: Buffer) => {
        const BUCKET_NAME = Config.S3_BUCKET_NAME as string;
        const IDENTITY_POOL_ID = Config.S3_IDENTITY_POOL_ID as string;
        let fileName: string;

        switch (flag) {
            case 0:
                fileName = `${resultId}_user_best_shot.png`;
                break;
            case 1:
                fileName = `${resultId}_original_best_shot.png`;
                break;
            case 2:
                fileName = `${resultId}_user_worst_shot.png`;
                break;
            case 3:
                fileName = `${resultId}_original_worst_shot.png`;
                break;
            case 4:
                fileName = `${resultId}_graph.png`;
                break;
            default:
                throw new Error("Invalid flag value: " + flag);
        }

        // Configure AWS credentials
        AWS.config.update({
            region: 'ap-northeast-1',
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: IDENTITY_POOL_ID,
            }),
        });

        const s3 = new AWS.S3();

        try {
            const params = {
                Bucket: BUCKET_NAME,
                Key: fileName,
                Body: image,
                ContentType: 'image/png'
            };

            const data = await s3.upload(params).promise();
            console.log(data);
            console.error('S3への保存に成功しました。');
        } catch (error) {
            console.error('S3への保存に失敗しました。');
        }
    }
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>結果3画面</Text>
            {/* グラフの描画 */}
            <ViewShot ref={viewGraphShotRef} options={{ format: 'png', quality: 1.0 }}>
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
            <View style={styles.row}>
                <Button title='保存' onPress={saveResult} />
                <Button title='削除' onPress={() => navigation.navigate('HomeScreen')} />
            </View>
            
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
    return Buffer.from(base64.split(',')[1], 'base64');
}

export default Result3Screen;