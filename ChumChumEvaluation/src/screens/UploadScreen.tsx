import React from 'react';
import { View, Text, Button } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const UploadScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'UploadScreen'>>();
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>アップロード画面</Text>
            <Button title='EVALUATE' onPress={() => navigation.navigate('LoadingScreen')} />
        </View>
    )
}

export default UploadScreen;