import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';

export type RootStackParamList = {
  LoginScreen: undefined;
  HomeScreen: undefined;
}

const Stack = createNativeStackNavigator();

export default class HelloWorldApp extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen name="LoginScreen" component={LoginScreen}/>
          <Stack.Screen name="HomeScreen" component={HomeScreen}/>
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
