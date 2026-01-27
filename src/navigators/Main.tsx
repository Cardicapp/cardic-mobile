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
import Pin from '../screens/Pin/Pin';
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
import WithdrawScreen from '../screens/User/Withdraw/WithdrawScreen';
import ConfirmPinScreen from '../screens/User/WithdrawalPin/TransactionPin';
import RateCalculatorScreen from '../screens/User/RateCalculator/RateCalculator';
import TradeGiftCardScreen from '../screens/User/TradeGiftCard/TradeGiftCard';
import TokenScreen from '../screens/User/Crypto/TokenScreen';
import CryptoTransactionPin from '../screens/User/Crypto/CryptoTransactionPin';
import ChangePasswordScreen from '../screens/ChangePassword/ChangePasswordScreen';
import KycScreen from '../screens/User/KYC/KycScreen';
import VerificationScreen from '../screens/User/KYC/VerificationScreen';
import IdentityVerificationScreen from '../screens/User/KYC/IdentityVerification';
import NotificationsScreen from '../screens/User/Notifications/NotificationScreen';
import ProfileScreen from '../screens/User/Profile/ProfileScreen';
import ViewDetailScreen from '../screens/User/Profile/Edit/ViewDetailScreen';
import ChangeEmailScreen from '../screens/User/Profile/Edit/ChangeEmailScreen';
import ChangePhoneNumberScreen from '../screens/User/Profile/Edit/ChangePhoneNumberScreen';
import ChangeUsernameScreen from '../screens/User/Profile/Edit/ChangeUsernameScreen';
import PasswordCheckScreen from '../screens/User/Profile/Security/PasswordCheckScreen';
import OtpVerificationScreen from '../screens/User/Profile/Security/OtpVerificationScreen';
import SuccessScreen from '../screens/User/Profile/Security/SuccessScreen';
import ReceiveCryptoScreen from '../screens/User/Crypto/ReceiveCryptoScreen';
import TradeChatScreen from '../screens/User/Trade/TradeChatScreen';
const Stack = createStackNavigator();

// @refresh reset
const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Pin" component={Pin} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="NotificationScreen" component={NotificationsScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ViewDetailScreen" component={ViewDetailScreen} />
      <Stack.Screen name="ChangeEmailScreen" component={ChangeEmailScreen} />
      <Stack.Screen name="ChangePhoneNumberScreen" component={ChangePhoneNumberScreen} />
      <Stack.Screen name="ChangeUsernameScreen" component={ChangeUsernameScreen} />
      <Stack.Screen name="PasswordCheckScreen" component={PasswordCheckScreen} />
      <Stack.Screen name="OtpVerificationScreen" component={OtpVerificationScreen} />
      <Stack.Screen name="SuccessScreen" component={SuccessScreen} />
      <Stack.Screen name="ReceiveCryptoScreen" component={ReceiveCryptoScreen} />
      <Stack.Screen name="TradeChatScreen" component={TradeChatScreen} />
      <Stack.Screen name="CategoriesScreen" component={CategoriesScreen} />
      <Stack.Screen name="WithdrawScreen" component={WithdrawScreen} />
      <Stack.Screen name="KycScreen" component={KycScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      <Stack.Screen name="IdentityVerificationScreen" component={IdentityVerificationScreen} />
      <Stack.Screen name="TradeDetailScreen" component={TradeDetailScreen} />
      <Stack.Screen name="TradeGiftCard" component={TradeGiftCardScreen} />
      <Stack.Screen name="TokenScreen" component={TokenScreen} />
      <Stack.Screen name="CryptoTransactionPin" component={CryptoTransactionPin} />
      <Stack.Screen name="SubCategoriesScreen" component={SubCategoriesScreen} />
      <Stack.Screen name="TradeSummaryScreen" component={TradeSummaryScreen} />
      <Stack.Screen name="CreateTradeScreen" component={CreateTradeScreen} />
      <Stack.Screen name="OngoingTradeListScreen" component={OngoingTradeListScreen} />
      <Stack.Screen name="CompletedTradeListScreen" component={CompletedTradeListScreen} />
      <Stack.Screen name="TradeHistoryScreen" component={TradeHistoryScreen} />
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="CreateTransactionPin" component={CreateTransactionPin} />
      <Stack.Screen name="RateCalculatorScreen" component={RateCalculatorScreen} />
      <Stack.Screen name="ConfirmPin" component={ConfirmPinScreen} />
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
