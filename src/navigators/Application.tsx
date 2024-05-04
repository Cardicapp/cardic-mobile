import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { Startup } from '../screens';
import { useTheme } from '../hooks';
import MainNavigator from './Main';
// import { useFlipper } from '@react-navigation/devtools';
import { ApplicationStackParamList } from '../../@types/navigation';
import Onboarding from '../screens/Onboarding/Onboarding';
import SplashScreen from '../screens/SplashScreen/SplashScreen';

const Stack = createStackNavigator<ApplicationStackParamList>();

export const routeNameRef = React.createRef();

// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;

  const navigationRef = useNavigationContainerRef();

  // useFlipper(navigationRef);

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer
        theme={NavigationTheme}
        ref={navigationRef}
        // @ts-ignore
        onReady={() => routeNameRef.current = navigationRef.current.getCurrentRoute().name}
        onStateChange={() => {
          const previousRouteName = routeNameRef.current
          // @ts-ignore
          const currentRouteName = navigationRef.current.getCurrentRoute().name

          if (previousRouteName !== currentRouteName) {
            // Do something here with it
          }

          // Save the current route name for later comparision
          // @ts-ignore
          routeNameRef.current = currentRouteName
        }}
      >
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* <Stack.Screen name="Startup" component={Startup} /> */}
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="Onboarding" component={Onboarding} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default ApplicationNavigator;
