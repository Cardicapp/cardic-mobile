import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
import Utils from 'CardicApp/src/lib/utils/Utils';
import Colors from 'CardicApp/src/theme/Colors';
import React, { MutableRefObject, useRef, useState } from 'react';
import { SafeAreaView, View, TextInput, } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Toast from 'react-native-toast-message';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonOne from 'CardicApp/src/components/ButtonOne';
import routes from 'CardicApp/src/lib/network/routes';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';


interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
  showToast: any,
  loading: boolean,
}
const ForgotPassword = (props: Props) => {
  const [pageState, setPageState] = useState({
    email: ""
  })
  const [loading, setLoading] = useState(false)
  const emailRef: MutableRefObject<TextInput | null> | null = useRef(null);

  const forgotPassword = async () => {
    const result = validateForm(true);
    if (!result) {
      setLoading(true)
      const { email } = pageState;
      let formdata = {
        email
      }
      try {
        const res = await axiosExtended.post(`${routes.auth}/forgot/password`, formdata)
        if (res.status === 200) {
          Toast.show({
            type: 'success',
            text1: "Request successfully.",
            text2: "Check your mailbox for futher instructions (Check spam folder)",
          });
          props.navigation.pop();
        }
      } catch (err) {
        console.log(err)
        console.log(JSON.stringify(err, null, 6))

      } finally {
        setLoading(false)
      }
    }
    else showToast(result);
  }

  const validateForm = (react: boolean = false) => {
    const {
      email,
    } = pageState;

    if (!email) {
      if (react) setTimeout(() => {
        emailRef?.current?.focus();
      }, 0)
      return "Email is required";
    }

    if (!Utils.validateEmail(email)
    ) {
      if (react) setTimeout(() => {
        emailRef?.current?.focus();
      }, 0)
      return "Invalid email address"
    }

    return null;

  }

  const showToast = (msg: string, theme = 'error') => { // TOAST types = success, error, info
    Toast.show({
      type: theme,
      text1: msg,
    });
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.White,
        flex: 1,
      }}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{
          paddingBottom: 20,
          backgroundColor: Colors.White,
        }}
      >
        <SimpleBackHeader
          showBack={true}
          showMenu={false}
        />

        <View
          style={{
            marginLeft: wp(2),
            marginTop: 60,
            marginBottom: 20,
          }}>
          {/* <AppText style={{
            marginTop: 80,
            color: Colors.Primary,
            fontWeight: '700'
          }}>Sign In</AppText> */}

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <View>
              <AppBoldText
                style={{
                  fontSize: 24,
                  marginBottom: 5,
                }}
              >
                Let's Get Started!
              </AppBoldText>
              <AppText
                style={{
                  fontSize: 16,
                }}
              >
                Please enter the email address linked to your account
              </AppText>

            </View>

            <View style={{
              height: wp(20),
            }}>
              {/* <Image
                                    source={Images.Iffy}
                                    resizeMode="contain"
                                    style={{
                                        height: wp(17),
                                        aspectRatio: 1,
                                        alignSelf: 'center',
                                        borderRadius: 100,
                                    }}
                                /> */}
            </View>
          </View>
        </View>


        <View
          style={{
            justifyContent: "center",
            marginTop: 10,
          }}>

          <TextInputOne
            inputRef={(ref) => {
              // @ts-ignore
              emailRef.current = ref;
            }}
            headText="Email Address"
            placeholder="Your Email Address here"
            value={pageState.email}
            labelStyle={{
              fontWeight: 'bold',
            }}
            onChange={(value => setPageState({ ...pageState, email: value }))}
            onSubmitEditing={() => forgotPassword()}
            containerStyle={{
              marginTop: 0,
              paddingHorizontal: 10,
            }}
          />
        </View>
      </KeyboardAwareScrollView>

      <View style={{
        marginTop: 'auto',
        paddingBottom: 20,
        paddingTop: 10,
        backgroundColor: Colors.White,
      }}>
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <ButtonOne
            onPress={() => {
              forgotPassword();
            }}
            text="Submit"
            textStyle={{
              fontSize: RFPercentage(2.2),
            }}
            loading={loading}
            containerStyle={{
              backgroundColor: validateForm() == null ? Colors.Primary : Colors.SlightlyShyGrey,

            }}
            outerStyle={{
              width: '100%',
            }}
          />
        </View>


      </View>


    </SafeAreaView>
  );
}


export default ForgotPassword;