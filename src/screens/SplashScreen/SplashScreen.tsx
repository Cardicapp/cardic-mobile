
import Colors from 'CardicApp/src/theme/Colors';
import React, { useEffect } from 'react';
import { Image, SafeAreaView, } from 'react-native';
import { useDispatch } from 'react-redux';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from 'CardicApp/src/hooks';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';


interface State {

}

interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
}
const SplashScreen = (props: Props) => {
  const { navigate } = useNavigation();
  const {
    Images,
    darkMode: isDark,
  } = useTheme();
  useEffect(() => {
    setTimeout(() => {
      checkIsSeen();
    }, 2000)
  }, []);
  const checkIsSeen = async () => {
    const seenOnboarding = await EncryptedStorage.getItem("seenOnboarding");
    if (seenOnboarding == "true") {
      // @ts-ignore
      return navigate("Main");
    } else {
      // @ts-ignore
      return navigate("Onboarding");
    }
  }
  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.White,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={Images.appIcon}
        style={{
          height: 200,
          width: 200,
        }}
        resizeMode='contain'
      />


    </SafeAreaView>
  );
}

export default SplashScreen;