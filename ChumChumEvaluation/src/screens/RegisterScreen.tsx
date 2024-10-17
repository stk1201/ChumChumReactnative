import React from 'react';
import { View, Text, Button } from 'react-native';

//画面遷移に必要
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const RegisterScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'RegisterScreen'>>();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>ホーム画面</Text>
            <Button title="REGISTER" onPress={() => navigation.navigate('HomeScreen')} />
        </View>
    )
}

export default RegisterScreen;