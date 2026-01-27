import * as React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/User/Home/HomeScreen';
import Colors from '../theme/Colors';
import { createStackNavigator } from '@react-navigation/stack';
import TradeHomePageScreen from '../screens/User/Trade/TradeHomePage/TradeHomePageScreen';
import WalletScreen from '../screens/User/Wallet/WalletScreen';
import SettingsScreen from '../screens/User/Settings/SettingsScreen';
import { RegularFontFamily } from '../components/AppText/AppText';
import GiftCardScreen from '../screens/User/GiftCard/GiftCardScreen';
import CryptoScreen from '../screens/User/Crypto/CryptoScreen';



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
          } else if (route.name === 'Crypto') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'GiftCard') {
            iconName = focused ? 'gift' : 'gift-outline';
          }


          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.White,
        tabBarInactiveTintColor: Colors.IconLemon,
        tabBarStyle: {
          backgroundColor: Colors.Primary,
          borderTopWidth: 0,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeNavigator}
        options={{
          tabBarLabelStyle: tabBarStyle
        }}
      />

      <Tab.Screen name="GiftCard" component={GiftCardScreen}
        options={{
          tabBarLabelStyle: tabBarStyle
        }}
      />

      <Tab.Screen name="Crypto" component={CryptoScreen}
        options={{
          tabBarLabelStyle: tabBarStyle
        }}
      />

      <Tab.Screen name="Wallet" component={WalletScreen}
        options={{
          tabBarLabelStyle: tabBarStyle
        }}
      />

      {/* <Tab.Screen name="Trades" component={TradeHomePageScreen} 
      options={{
        tabBarLabelStyle: tabBarStyle
      }}
      /> */}
      <Tab.Screen name="Settings" component={SettingsScreen}
        options={{
          tabBarLabelStyle: tabBarStyle
        }}
      />

    </Tab.Navigator>
  );
}

const tabBarStyle: StyleProp<TextStyle> = {
  // backgroundColor: Colors.Primary,
  // color: Colors.White,
  // borderWidth: 1,
  // borderColor: Colors.White,
  fontFamily: RegularFontFamily
}

const tabBarOptions = { tabBarBadgeStyle: tabBarStyle }