import { NavigatorScreenParams } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

export type MainParamsList = {
  Home: undefined;
  TradeGiftCard: { card: any };
  IdentityVerificationScreen: undefined;
  VerificationScreen: undefined;
};

export type ApplicationStackParamList = {
  Startup: undefined;
  Main: NavigatorScreenParams<MainParamsList>;
  Onboarding: NavigatorScreenParams<MainParamsList>;
  SplashScreen: NavigatorScreenParams<any>;
};

export type ApplicationScreenProps =
  StackScreenProps<ApplicationStackParamList>;
