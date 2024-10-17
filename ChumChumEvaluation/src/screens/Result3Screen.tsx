import React from 'react';
import { View, Text, Button } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const Result3Screen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Result3Screen'>>();
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>結果3画面</Text>
            <Button title='HOME' onPress={() => navigation.navigate('HomeScreen')} />
        </View>
    )
}

export default Result3Screen;