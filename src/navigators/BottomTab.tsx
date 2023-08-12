import * as React from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/User/Home/HomeScreen';
import CategoriesScreen from '../screens/User/Categories/CategoriesScreen';
import Colors from '../theme/Colors';
import SubCategoriesScreen from '../screens/User/Categories/SubCategoriesScreen';
import TradeSummaryScreen from '../screens/User/Trade/TradeSummaryScreen';
import CreateTradeScreen from '../screens/User/Trade/CreateTradeScreen';
import TradeDetailScreen from '../screens/User/Trade/TradeDetailScreen';
import { createStackNavigator } from '@react-navigation/stack';
import TradeHomePageScreen from '../screens/User/Trade/TradeHomePage/TradeHomePageScreen';
import WalletScreen from '../screens/User/Wallet/WalletScreen';
import SettingsScreen from '../screens/User/Settings/SettingsScreen';



const Stack = createStackNavigator();

// @refresh reset
const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Trades') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          }


          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.Primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator}
        // options={{ tabBarBadge: 3, tabBarBadgeStyle: tabBarStyle }}
      />
      <Tab.Screen name="Wallet" component={WalletScreen} />

      <Tab.Screen name="Trades" component={TradeHomePageScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />

    </Tab.Navigator>
  );
}

const tabBarStyle: StyleProp<TextStyle> = {
  backgroundColor: Colors.Primary,
  color: Colors.White,
  borderWidth: 1,
  borderColor: Colors.White,
}