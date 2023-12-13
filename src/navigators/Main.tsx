import React from 'react';
import { Example } from '../screens';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../screens/Login/Login';
import BottomTab from './BottomTab';
import TradeDetailScreen from '../screens/User/Trade/TradeDetailScreen';
import CategoriesScreen from '../screens/User/Categories/CategoriesScreen';
import SubCategoriesScreen from '../screens/User/Categories/SubCategoriesScreen';
import TradeSummaryScreen from '../screens/User/Trade/TradeSummaryScreen';
import CreateTradeScreen from '../screens/User/Trade/CreateTradeScreen';
import OngoingTradeListScreen from '../screens/User/Trade/OngoingTradeListScreen';
import CompletedTradeListScreen from '../screens/User/Trade/CompletedTradeListScreen';
import TradeHistoryScreen from '../screens/User/Trade/TradeHistoryScreen';
import WalletScreen from '../screens/User/Wallet/WalletScreen';
import Register from '../screens/Register/Register';
import CreateWithdrawalPin from '../screens/User/WithdrawalPin/CreateWithdrawalPin';
import SettingsScreen from '../screens/User/Settings/SettingsScreen';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';

const Stack = createStackNavigator();

// @refresh reset
const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="Home" component={Example} />
      <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />
      <Stack.Screen name="TradeDetailScreen" component={TradeDetailScreen} />
      <Stack.Screen name="SubCategoriesScreen" component={SubCategoriesScreen} />
      <Stack.Screen name="TradeSummaryScreen" component={TradeSummaryScreen} />
      <Stack.Screen name="CreateTradeScreen" component={CreateTradeScreen} />
      <Stack.Screen name="OngoingTradeListScreen" component={OngoingTradeListScreen} />
      <Stack.Screen name="CompletedTradeListScreen" component={CompletedTradeListScreen} />
      <Stack.Screen name="TradeHistoryScreen" component={TradeHistoryScreen} />
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="CreateWithdrawalPin" component={CreateWithdrawalPin} />


    </Stack.Navigator>
  );
};

export default MainNavigator;
