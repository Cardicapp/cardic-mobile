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

// function HomeScreen() {
//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text>Home!</Text>
//         </View>
//     );
// }

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator

      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'ios-information-circle'
              : 'ios-information-circle-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'ios-list' : 'ios-list-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.Primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={TradeDetailScreen} options={{ tabBarBadge: 3, tabBarBadgeStyle: tabBarStyle }} />
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