import React from 'react';
import { View, Text, Button } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'LoginScreen'>>();
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>ログイン画面</Text>
            <Button title='LOGIN' onPress={() => navigation.navigate('HomeScreen')} />
            <Button title='REGISTER' onPress={() => navigation.navigate('RegisterScreen')} />
        </View>
    )
}

export default LoginScreen;