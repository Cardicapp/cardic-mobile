
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
        backgroundColor: Colors.White,
        flex: 1,
        // justifyContent: 'flex-start',
        // alignItems: 'center',

      }}>


      <Swiper
        style={{

        }}
        // showsButtons={false}
        dotColor={Colors.Primary}
        activeDotColor={Colors.PrimaryBGLight}
      // autoplay={true}
      >
        <OnboardingPage
          titleText='Fast and seamless transaction'
          description='Enjoy fast transactions and seamless whenever you need to.'
          image={Images.onboarding1}
        />
        <ImageBackground
          source={Images.cardicBgIcon}
          resizeMode='cover'
          style={{
            flex: 1,
            justifyContent: 'center',
            height: heightPercentageToDP(100),
            backgroundColor: Colors.Primary,
          }}>
          <OnboardingPage
            titleText='Best rates and easy cashouts'
            description='Buy and sell  at  the best and affordable rates and get instant cash out.'
            titleStyle={{
              color: Colors.White,
            }}
            descriptionStyle={{
              color: Colors.White,
            }}
            image={Images.onboarding2}
            pageStyle={{
              backgroundColor: undefined,
            }}
          />
        </ImageBackground>

        <OnboardingPage
          titleText='Easily Buy data and airtime'
          description='Buy data and airtime at any time of the day'
          image={Images.onboarding3}
          showProceedButton={true}
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
          width: 360,
          marginTop: 30,
        }, imageStyle]}
        resizeMode='contain'
      />
      <AppBoldText style={[{
        color: Colors.Primary,
        marginTop: 5,
        fontSize: 18
      }, titleStyle]}>{titleText}</AppBoldText>
      <AppText style={[{
        color: Colors.Black,
        marginTop: 15,
        fontSize: 14,
        textAlign: 'center',
        paddingHorizontal: "10%",
      }, descriptionStyle]}>{description}</AppText>
      {
        showProceedButton ?
          <View style={{
            paddingHorizontal: Platform.OS == 'android' ? '10%' : 20,
            marginTop: 'auto',
            width: '50%',
            marginBottom: "20%"
          }}>
            <ButtonOne
              text={"Open Cardic"}
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

          </View>
          : <View />
      }

    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: Colors.White,
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
})

export default Onboarding;