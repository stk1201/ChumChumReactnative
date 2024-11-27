import React, {useState, useContext} from 'react';
import { View, Text, Button, Image, StyleSheet, TextInput } from 'react-native';

//画面遷移に必要
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import {UserStocker} from '../context/UserStocker';
import Config from 'react-native-config';
import axios from 'axios';

const RegisterScreen: React.FC = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'RegisterScreen'>>();

    const [userName, setUserName] = React.useState<string>('');
    const [mailAddress, setMailAddress] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [confirmPassword, setConfirmPassword] = React.useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const userStocker = useContext(UserStocker);

    const creatAccount = async() => {
        if (!userName || !mailAddress || !password || !confirmPassword) {
            setErrorMessage('全ての項目を入力してください');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('パスワードが一致しません');
            return;
        }
        //新規登録処理
        const url = Config.CREATE_ACCOUNT_API || '';
        const resultJson = getJson();

        try{
            const response = await axios.post(url, resultJson, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // アカウント作成成功時の処理
            if (response.status === 200 && response.data) {
                console.log('API Response: ', response.data);
                const body = JSON.parse(response.data.body);
                const userId = body.user_id;

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

    const getJson = (): string => {
        return JSON.stringify({
            email_address: mailAddress,
            password: password,
            user_name: userName,
        });
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../assets/title2.png')} style={styles.titleImage} resizeMode="contain"/>
            {/* 新規登録の入力フォーム */}
            <TextInput
                style={styles.input}
                placeholder="ユーザーネーム"
                value={userName}
                onChangeText={setUserName}
                secureTextEntry={true}
            />
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
            <TextInput
                style={styles.input}
                placeholder="確認用パスワード入力"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
            />

            <Button title="新規登録" onPress={(creatAccount)} />
            <Button title="戻る" onPress={() => navigation.navigate('LoginScreen')} />
            
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

export default RegisterScreen;