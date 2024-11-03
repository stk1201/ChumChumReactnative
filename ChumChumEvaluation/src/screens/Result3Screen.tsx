import React, {useContext} from 'react';
import { View, Text, Button, StyleSheet, Dimensions } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ResultStocker } from '../context/ResultStocker';
import { LineChart } from 'react-native-chart-kit';

const Result3Screen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Result3Screen'>>();

    const resultStocker = useContext(ResultStocker);
    const graphData = resultStocker?.result?.graphData;
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>結果3画面</Text>

            {graphData && (
                <LineChart
                    data={graphData}
                    width={Dimensions.get('window').width - 40} // グラフの幅
                    height={220} // グラフの高さ
                    chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#fb8c00',
                        backgroundGradientTo: '#ffa726',
                        decimalPlaces: 2, // 小数点以下の桁数
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#ffa726',
                        },
                    }}
                    bezier // ベジエ曲線を使用
                    style={styles.chartStyle}
                />
            )}


            <Button title='HOME' onPress={() => navigation.navigate('HomeScreen')} />
        </View>
    )
}

const styles = StyleSheet.create({
    chartStyle: {
        marginVertical: 8,
        borderRadius: 16,
    },
});

export default Result3Screen;