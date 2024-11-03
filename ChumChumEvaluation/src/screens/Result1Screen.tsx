import React, {useContext} from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ResultStocker } from '../context/ResultStocker';

const Result1Screen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Result1Screen'>>();

    const resultStocker = useContext(ResultStocker);
    const totalScore = resultStocker?.result?.totalScore;
    const rank = resultStocker?.result?.rank;
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>結果1画面</Text>
            
            <Text>あなたの点数は…</Text>
            <Text>{totalScore !== undefined ? Math.floor(totalScore) : 'スコアがありません'}</Text>
            <Text>あなたは</Text>
            <Text>{rank !== undefined ? rank : 'ランクがありません'}</Text>
            
            <Button title='NEXT' onPress={() => navigation.navigate('Result2Screen')} />
        </View>
    )
}

export default Result1Screen;