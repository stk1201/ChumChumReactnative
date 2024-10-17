import React from 'react';
import { View, Text, Button } from 'react-native';

//画面遷移に必要
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'HomeScreen'>>();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>ホーム画面</Text>
            <Button title='EVALUATE' onPress={() => navigation.navigate('UploadScreen')} />
            <Button title='HISTORY' onPress={() => navigation.navigate('HistoryScreen')} />
            <Button title='LOGOUT' onPress={() => navigation.navigate('LoginScreen')} />
        </View>
    )
}

export default HomeScreen;