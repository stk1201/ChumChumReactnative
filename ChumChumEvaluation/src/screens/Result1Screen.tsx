import React from 'react';
import { View, Text, Button } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const Result1Screen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Result1Screen'>>();
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>結果1画面</Text>
            <Button title='NEXT' onPress={() => navigation.navigate('Result2Screen')} />
        </View>
    )
}

export default Result1Screen;