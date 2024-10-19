import React, {useState} from 'react';
import { View, Text, Button } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import {launchImageLibrary} from 'react-native-image-picker';

const UploadScreen: React.FC = () => {
    const [userVideoUri, setUserVideoUri] = useState(null);
    const [originalVideoUri, setOriginalVideoUri] = useState(null);

    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'UploadScreen'>>();
    
    //ユーザ動画の取得
    const selectUserVideo = () => {
        let options = {
            mediaType: "video",
        };
    
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled video picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                setUserVideoUri(response.assets[0].uri);
            }
        });
    };

    const selectOriginalVideo = () => {
        let options = {
            mediaType: "video",
        };
    
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled video picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                setOriginalVideoUri(response.assets[0].uri);
            }
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>アップロード画面</Text>

            <Text>ユーザ動画</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>{userVideoUri}</Text>
                <Button title='#REF' onPress={selectUserVideo} />
            </View>

            <Text>オリジナル動画</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>{originalVideoUri}</Text>
                <Button title='#REF' onPress={selectOriginalVideo} />
            </View>

            <Button title='EVALUATE' onPress={() => navigation.navigate('LoadingScreen')} />
        </View>
    )
}

export default UploadScreen;