import React, {useState} from 'react';
import { View, Text, Button } from 'react-native';

//画面遷移に必要
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const UserScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'HomeScreen'>>();
    const route = useRoute<RouteProp<RootStackParamList, "HomeScreen">>();


    return (
        <View>
            <Text>ホーム画面</Text>
            <Button title='ログアウト' onPress={() => navigation.navigate('LoginScreen')} />
        </View>
    )
}

export default UserScreen;