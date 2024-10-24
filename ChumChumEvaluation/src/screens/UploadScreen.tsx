import React, { useState } from 'react';
import {View, Text, Button } from 'react-native';
import { launchImageLibrary, MediaType } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

const UploadScreen: React.FC = () => {
    const [userVideoPath, setUserVideoPath] = useState<string | null>(null);
    const [originalVideoPath, setOriginalVideoPath] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'UploadScreen'>>();

    const selectUserVideo = () => {
        let options = {
            mediaType: 'video' as MediaType,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled video picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                if (response.assets && response.assets[0].uri) {
                    setUserVideoPath(response.assets[0].uri);
                } else {
                    console.log('No video URI found');
                }
            }
        });
    };

    const selectOriginalVideo = () => {
        let options = {
            mediaType: 'video' as MediaType,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('Original cancelled video picker');
            } else if (response.errorMessage) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                if (response.assets && response.assets[0].uri) {
                    setOriginalVideoPath(response.assets[0].uri);
                } else {
                    console.log('No video URI found');
                }
            }
        });
    };

    const moveToLoadingScreen = () => {
        if(userVideoPath && originalVideoPath) {
            navigation.navigate('LoadingScreen',
                { userVideoPath: userVideoPath, originalVideoPath: originalVideoPath });
        } else {
            setErrorMessage('動画を選択してください。');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>アップロード画面</Text>
            <Text>ユーザ動画</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>{userVideoPath}</Text>
                <Button title='#REF' onPress={selectUserVideo} />
            </View>
            <Text>オリジナル動画</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text>{originalVideoPath}</Text>
                <Button title='#REF' onPress={selectOriginalVideo} />
            </View>

            <Button title='EVALUATE' onPress={moveToLoadingScreen} />

            {errorMessage && (
                <Text style={{ color: 'red', marginTop: 20 }}>{errorMessage}</Text>
            )}
        </View>
    );
};

export default UploadScreen;