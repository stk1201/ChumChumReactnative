import React, {useContext, useState} from 'react';
import { View, Text, Button, Image, StyleSheet, TextInput } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import {UserStocker} from '../context/UserStocker';
import Config from 'react-native-config';
import axios from 'axios';

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'LoginScreen'>>();

    const [mailAddress, setMailAddress] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const userStocker = useContext(UserStocker);

    const login = async() => {
        if (!mailAddress || !password) {
            setErrorMessage('メールアドレスとパスワードを入力してください');
            return;
        }

        // ログイン処理
        const url = Config.LOGIN_API || '';
        const json = getJson();

         // 送信するJSONデータをコンソールに出力
         console.log("Sending JSON:", json);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify({ body: JSON.stringify(json) }),
            });

            // レスポンスデータを解析
            const responseData = await response.json();

            console.log("API Response:", responseData);

            // ログイン成功時の処理
            if (response.ok) {
                const body = JSON.parse(responseData.body);
                const userData = body.user_data;
                const userId = userData.user_id;
                const userName = userData.user_name;

                if(userStocker){
                    userStocker.setUser({
                        userId: userId,
                        emailAddress: mailAddress,
                    });

                    //ホーム画面に遷移
                    navigation.navigate('HomeScreen');
                }
            }
        } catch (error) {
            console.error('ログインに失敗しました', error);
            setErrorMessage('ログインに失敗しました');
        }
    };

    const getJson = (): object => {
        return {
            email_address: mailAddress,
            password: password,
        };
    };
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../assets/title2.png')} style={styles.titleImage} resizeMode="contain"/>

            {/* ログインの入力フォーム */}
            <TextInput
                style={styles.input}
                placeholder="メールアドレス入力"
                value={mailAddress}
                onChangeText={setMailAddress}
            />
            <TextInput
                style={styles.input}
                placeholder="パスワード入力"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />

            <Button title="ログイン" onPress={(login)} />
            <Button title="新規登録" onPress={() => navigation.navigate('RegisterScreen')} />
            
            {/* エラーメッセージ */}
            {errorMessage && (
                <Text style={{ color: 'red', marginTop: 20 }}>{errorMessage}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    titleImage: {
        width: 300,
        height: 300,
        marginVertical: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 10,
        width: '80%',
    },
});

export default LoginScreen;