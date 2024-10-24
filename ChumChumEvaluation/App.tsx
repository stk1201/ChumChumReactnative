import React, { Component } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import UploadScreen from './src/screens/UploadScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import Result1Screen from './src/screens/Result1Screen';
import Result2Screen from './src/screens/Result2Screen';
import Result3Screen from './src/screens/Result3Screen';

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  HomeScreen: undefined;
  HistoryScreen: undefined;
  UploadScreen: undefined;
  LoadingScreen: {userVideoPath: string, originalVideoPath: string};
  Result1Screen: {results: any};
  Result2Screen: undefined;
  Result3Screen: undefined;
}

const Stack = createNativeStackNavigator();

export default class HelloWorldApp extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen name="LoginScreen" component={LoginScreen}/>
          <Stack.Screen name="RegisterScreen" component={RegisterScreen}/>
          <Stack.Screen name="HomeScreen" component={HomeScreen}/>
          <Stack.Screen name="HistoryScreen" component={HistoryScreen}/>
          <Stack.Screen name="UploadScreen" component={UploadScreen}/>
          <Stack.Screen name="LoadingScreen" component={LoadingScreen}/>
          <Stack.Screen name="Result1Screen" component={Result1Screen}/>
          <Stack.Screen name="Result2Screen" component={Result2Screen}/>
          <Stack.Screen name="Result3Screen" component={Result3Screen}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
