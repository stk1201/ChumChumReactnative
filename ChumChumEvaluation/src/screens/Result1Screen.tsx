import React, {useState} from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const Result1Screen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Result1Screen'>>();
    const route = useRoute<RouteProp<RootStackParamList, "Result1Screen">>();
    const results = route.params.results;

    const eachTimeScore = results.eachTimeScore;
    const userImageData = results.userImageData;
    const originalImageData = results.originalImageData;

    // デバッグ用のコンソールログを追加
    console.log('Each Time Score:', eachTimeScore);
    console.log('User Image:', userImageData[0]);
    console.log('Original Image:', originalImageData[0]);
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>結果1画面</Text>
            
            <Text>Pose Estimation Results:</Text>
            {eachTimeScore && eachTimeScore.map((score, index) => (
                <Text key={index}>Time {index}: {score}</Text>
            ))}

            <Button title='NEXT' onPress={() => navigation.navigate('Result2Screen')} />
        </View>
    )
}

export default Result1Screen;