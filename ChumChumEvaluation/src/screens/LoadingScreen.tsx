import React, {useState} from 'react';
import { View, Text, Button } from 'react-native';

import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const LoadingScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'LoadingScreen'>>();
    const route = useRoute<RouteProp<RootStackParamList, "LoadingScreen">>();

    const [userVideoPath, setUserVideoPath] = useState<String>(route.params.userVideoPath);
    const [originalVideoPath, setOriginalVideoPath] = useState<String>(route.params.originalVideoPath);
    
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>ローディング画面</Text>
            <Text>ユーザ動画パス：{userVideoPath}</Text>
            <Text>オリジナル動画パス：{originalVideoPath}</Text>
            <Button title='RESULT' onPress={() => navigation.navigate('Result1Screen')} />
        </View>
    )
}

export default LoadingScreen;