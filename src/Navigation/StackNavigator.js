import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginForm from '../Login/LoginForm';
import DisplayDataPage from '../Login/DisplayDataPage';

const Stack = createStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginForm">
        <Stack.Screen name="LoginForm" component={LoginForm} />
        <Stack.Screen name="DisplayDataPage" component={DisplayDataPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
