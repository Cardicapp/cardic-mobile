import React from 'react';
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
import CreateTransactionPin from '../screens/User/WithdrawalPin/CreateTransactionPin';
import SettingsScreen from '../screens/User/Settings/SettingsScreen';
import ForgotPassword from '../screens/ForgotPassword/ForgotPassword';
import BillsScreenOne from '../screens/User/Bills/BillsScreenOne';
import BillsScreenTwo from '../screens/User/Bills/BillsScreenTwo';
import BillsScreenThree from '../screens/User/Bills/BillsScreenThree';
import BillSummaryScreen from '../screens/User/Bills/BillSummaryScreen';
import ElectricityScreen from '../screens/User/Bills/ElectricityScreen';
import ElectricityBillSummary from '../screens/User/Bills/ElectricityBillSummaryScreen';
import TVBillsScreen from '../screens/User/Bills/TVBillsScreen';
import TVBillsSummaryScreen from '../screens/User/Bills/TVBillsSummaryScreen';
import AirtimeScreen from '../screens/User/Bills/AirtimeScreen';
import AirtimeBillsSummaryScreen from '../screens/User/Bills/AirtimeBillsSummaryScreen';
import DataBillsScreen from '../screens/User/Bills/DataBillsScreen';
import DataBillsSummaryScreen from '../screens/User/Bills/DataBillsSummaryScreen';
import SportsBettingScreen from '../screens/User/Bills/SportsBettingScreen';
import SportsBettingSummaryScreen from '../screens/User/Bills/SportsBettingSummaryScreen';
import PersonalInformationScreen from '../screens/User/Settings/PersonalInformationScreen';

const Stack = createStackNavigator();

// @refresh reset
const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />
      <Stack.Screen name="TradeDetailScreen" component={TradeDetailScreen} />
      <Stack.Screen name="SubCategoriesScreen" component={SubCategoriesScreen} />
      <Stack.Screen name="TradeSummaryScreen" component={TradeSummaryScreen} />
      <Stack.Screen name="CreateTradeScreen" component={CreateTradeScreen} />
      <Stack.Screen name="OngoingTradeListScreen" component={OngoingTradeListScreen} />
      <Stack.Screen name="CompletedTradeListScreen" component={CompletedTradeListScreen} />
      <Stack.Screen name="TradeHistoryScreen" component={TradeHistoryScreen} />
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="CreateTransactionPin" component={CreateTransactionPin} />
      <Stack.Screen name="BillsScreenOne" component={BillsScreenOne} />
      <Stack.Screen name="BillsScreenTwo" component={BillsScreenTwo} />
      <Stack.Screen name="BillsScreenThree" component={BillsScreenThree} />
      <Stack.Screen name="BillSummaryScreen" component={BillSummaryScreen} />
      <Stack.Screen name="ElectricityScreen" component={ElectricityScreen} />
      <Stack.Screen name="ElectricityBillSummary" component={ElectricityBillSummary} />
      <Stack.Screen name="TVBillsScreen" component={TVBillsScreen} />
      <Stack.Screen name="TVBillsSummaryScreen" component={TVBillsSummaryScreen} />
      <Stack.Screen name="AirtimeScreen" component={AirtimeScreen} />
      <Stack.Screen name="AirtimeBillsSummaryScreen" component={AirtimeBillsSummaryScreen} />
      <Stack.Screen name="DataBillsScreen" component={DataBillsScreen} />
      <Stack.Screen name="DataBillsSummaryScreen" component={DataBillsSummaryScreen} />
      <Stack.Screen name="SportsBettingScreen" component={SportsBettingScreen} />
      <Stack.Screen name="SportsBettingSummaryScreen" component={SportsBettingSummaryScreen} />
      <Stack.Screen name="PersonalInformationScreen" component={PersonalInformationScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;
