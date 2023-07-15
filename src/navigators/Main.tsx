import React from 'react';
import { Example } from '../screens';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login/Login';
import BottomTab from './BottomTab';
import TradeDetailScreen from '../screens/User/Trade/TradeDetailScreen';

const Stack = createStackNavigator();

// @refresh reset
const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={TradeDetailScreen} />
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="Login" component={Login} />
      {/* <Stack.Screen name="Home" component={Example} /> */}

    </Stack.Navigator>
  );
};

export default MainNavigator;
