
import Colors from 'CardicApp/src/theme/Colors';
import React from 'react';
import { Image, ImageBackground, ImageStyle, Platform, SafeAreaView, StyleProp, StyleSheet, TextStyle, View, ViewStyle, } from 'react-native';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from 'CardicApp/src/hooks';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import Swiper from 'react-native-swiper'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import ButtonOne from 'CardicApp/src/components/ButtonOne';
import { useNavigation } from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';


interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
}
const Onboarding = (props: Props) => {
  const {
    Images,
  } = useTheme();
  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.Black,
        flex: 1,
        // justifyContent: 'flex-start',
        // alignItems: 'center',

      }}>


      <Swiper
        style={{

        }}
        // showsButtons={false}
        dotStyle={{
          width: 30,
          height: 5,
          borderRadius: 5,
          marginHorizontal: 3,
          backgroundColor: Colors.Primary,
        }}
        activeDotStyle={{
          width: 30,
          height: 5,
          borderRadius: 5,
          marginHorizontal: 3,
          backgroundColor: Colors.PrimaryBGLight,
        }}
        dotColor={Colors.Primary}
        activeDotColor={Colors.PrimaryBGLight}
        paginationStyle={{
          top: Platform.OS === 'android' ? 40 : 60,
          bottom: undefined,
        }}
      // autoplay={true}
      >
        <OnboardingPage
          titleText='Gift Cards to Cash'
          description='Trade your gift cards for instant value. Fast payouts, great rates, and a smooth experience every time.'
          image={Images.onboarding1}
          showProceedButton={true}
        />
        <OnboardingPage
          titleText='Buy and Sell crypto'
          description='Explore top crypto tokens. Simple, secure, and built for everyone.'
          // titleStyle={{
          //   color: Colors.White,
          // }}
          // descriptionStyle={{
          //   color: Colors.White,
          // }}
          image={Images.onboarding2}
          // pageStyle={{
          //   backgroundColor: undefined,
          // }}
          showProceedButton={true}
        />

        <OnboardingPage
          titleText='Start Trading in Seconds'
          description='Create your free account or log in to continue your journey.'
          image={Images.onboarding3}
          titleStyle={{
            color: Colors.Black,
          }}
          descriptionStyle={{
            color: Colors.Black,
          }}
          showProceedButton={true}
          pageStyle={{
            backgroundColor: Colors.White,
          }}
        />
      </Swiper>
    </SafeAreaView>
  );
}

interface OnboardingPageProps {
  pageStyle?: StyleProp<ViewStyle>;
  image: any;
  imageStyle?: StyleProp<ImageStyle>;
  backgroundImage?: any;
  backgroundImageStyle?: StyleProp<ImageStyle>;
  titleText: string;
  titleStyle?: StyleProp<TextStyle>;
  description: string;
  descriptionStyle?: StyleProp<TextStyle>;
  showProceedButton?: boolean;
}

const OnboardingPage = (props: OnboardingPageProps) => {
  const {
    image, imageStyle, backgroundImage, backgroundImageStyle, titleText, description, pageStyle,
    titleStyle, descriptionStyle, showProceedButton = false,
  } = props;
  const { navigate, reset } = useNavigation()
  const onProceed = () => {
    EncryptedStorage.setItem("seenOnboarding", 'true');
    reset({
      index: 0,
      routes: [
        {
          // @ts-ignore
          name: 'Main',
        }
      ]
    })
  }
  return (
    <View
      style={[styles.page, pageStyle]}>

      <Image
        source={image}
        style={[{
          height: 360,
          width: '100%',
          marginTop: 60,
        }, imageStyle]}
        resizeMode='contain'
      />
      <AppBoldText style={[{
        color: Colors.White,
        marginTop: 5,
        fontSize: 28
      }, titleStyle]}>{titleText}</AppBoldText>
      <AppText style={[{
        color: Colors.White,
        marginTop: 15,
        marginBottom: 80,
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: "10%",
      }, descriptionStyle]}>{description}</AppText>
      {
        showProceedButton ?
          <View style={{
            paddingHorizontal: Platform.OS == 'android' ? '10%' : 20,
            marginTop: 'auto',
            width: '100%',
            marginBottom: "20%",
            flex: 1,
            gap: 10,
          }}>
            <ButtonOne
              text={"Create an account"}
              textStyle={{
                color: Colors.White,
                fontWeight: 'bold'
              }}
              onPress={() => {
                onProceed();
              }}
              containerStyle={{
                backgroundColor: Colors.Primary,
              }}
            />
            <ButtonOne
              text={"Log In"}
              textStyle={{
                color: Colors.Primary,
                fontWeight: 'bold'
              }}
              onPress={() => {
                onProceed();
              }}
              containerStyle={{
                backgroundColor: Colors.White,
                borderColor: Colors.Primary,
                borderWidth: 1,
              }}
            />

          </View>
          : <View />
      }

    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: Colors.Black,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
})

export default Onboarding;