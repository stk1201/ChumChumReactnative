import React from 'react';
import { View, Text, Button} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const HistoryScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'HistoryScreen'>>();

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>履歴検索画面</Text>
            <Button title='Home' onPress={() => navigation.navigate('HomeScreen')} />
        </View>
    )
}

export default HistoryScreen;