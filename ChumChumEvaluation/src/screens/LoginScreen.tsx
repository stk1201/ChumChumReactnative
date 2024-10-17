import React from 'react';
import { View, Text, Button } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'LoginScreen'>>();
    return (
        <View>
            <Text>ログイン画面</Text>
            <Button title='ログイン' onPress={() => navigation.navigate('HomeScreen')} />
        </View>
    )
}

export default HomeScreen;