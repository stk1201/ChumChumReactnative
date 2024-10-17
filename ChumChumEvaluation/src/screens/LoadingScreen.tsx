import React from 'react';
import { View, Text, Button } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const LoadingScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'LoadingScreen'>>();
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>ローディング画面</Text>
            <Button title='RESULT' onPress={() => navigation.navigate('Result1Screen')} />
        </View>
    )
}

export default LoadingScreen;