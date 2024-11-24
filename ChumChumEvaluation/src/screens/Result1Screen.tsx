import React, {useContext} from 'react';
import { View, Button, Image, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { ResultStocker } from '../context/ResultStocker';

const Result1Screen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Result1Screen'>>();

    const resultStocker = useContext(ResultStocker);
    const totalScore = resultStocker?.result?.totalScore;
    const rank = resultStocker?.result?.rank;

    const getRankImage = () => {
        switch (rank) {
            case 'god':
                return require('../assets/god.png');
            case 'center':
                return require('../assets/center.png');
            case 'backdancer':
                return require('../assets/backdancer.png');
            case 'practice':
                return require('../assets/practice.png');
            default:
                return require('../assets/practice.png');
        }
    };
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            
            <Text>あなたの点数は…</Text>
            <Text>{totalScore !== undefined ? Math.floor(totalScore) : 'スコアがありません'}</Text>
            <Text>あなたは</Text>
            <Image source={getRankImage()} style={styles.rankImage} resizeMode="contain"/>
            
            <Button title='NEXT' onPress={() => navigation.navigate('Result2Screen')} />
        </View>
    )
}

const styles = StyleSheet.create({
    rankImage: {
        width: 150,
        height: 150,
        marginVertical: 10,
    },
});

export default Result1Screen;