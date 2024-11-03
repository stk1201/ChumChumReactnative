import React, {useContext, useState} from 'react';
import { View, Text, Button, StyleSheet, Dimensions, TextInput} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ResultStocker } from '../context/ResultStocker';
import { LineChart } from 'react-native-chart-kit';

const Result3Screen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Result3Screen'>>();

    const resultStocker = useContext(ResultStocker);
    const graphData = resultStocker?.result?.graphData;

    const [musicName, setMusicName] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const saveResult = () => {
        if(musicName){

        }else{
            setErrorMessage('曲名を入力してください。');
        }
    };
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>結果3画面</Text>
            {/* グラフの描画 */}
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

export default Result3Screen;