import React from 'react';
import { View, Text, Button } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const Result2Screen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Result2Screen'>>();
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>結果2画面</Text>
            <Button title='NEXT' onPress={() => navigation.navigate('Result3Screen')} />
        </View>
    )
}

export default Result2Screen;