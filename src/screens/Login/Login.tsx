import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
import Utils from 'CardicApp/src/lib/utils/Utils';
import Colors from 'CardicApp/src/theme/Colors';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Image, SafeAreaView, View, TouchableOpacity, TextInput, ImageBackground, } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP, heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import ReactNativeBiometrics from 'react-native-biometrics'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ButtonOne from 'CardicApp/src/components/ButtonOne';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthState, setAuthState, setAuthToken, setUserInfo } from 'CardicApp/src/store/auth';
import routes from 'CardicApp/src/lib/network/routes';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import { ApplicationScreenProps, ApplicationStackParamList } from 'CardicApp/@types/navigation';
import { NavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from 'CardicApp/src/hooks';
import EncryptedStorage from 'react-native-encrypted-storage';
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics'


interface UserData {
  firstName?: string,
  lastName?: string,
}
interface State {
  email: string,
  password: string,
  verifyingPhone: boolean,
  showSuccessModal: boolean,
  showPassword: boolean,
  userData?: UserData,
  keyboardVisible: boolean,
  isSensorAvailable: boolean,
  biometryType?: string,
  biometricPassword?: string,
  useExistingEmail: boolean,
}

interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
  showToast: any,
  login: (data: any) => void,
  loading: boolean,
}
const Login = (props: Props) => {
  const auth = useSelector(selectAuthState);
  const dispatch = useDispatch();

  const [pageState, setPageState] = useState<State>({
    email: "",
    password: "",
    verifyingPhone: false,
    showSuccessModal: false,
    showPassword: false,
    userData: undefined,
    keyboardVisible: false,
    isSensorAvailable: false,
    biometryType: undefined,
    biometricPassword: "",
    useExistingEmail: false,
  })
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false)
  const emailRef: MutableRefObject<TextInput | null> | null = useRef(null);
  const passwordRef: MutableRefObject<TextInput | null> | null = useRef(null);
  const [biometrics, setBiometrics] = useState<{
    email?: string;
    password?: string;
    isSensorAvailable: boolean;
    biometryType?: string;
    userEnabled?: boolean;
  }>({
    email: '',
    password: '',
    isSensorAvailable: false,
    biometryType: '',
    userEnabled: false,
  });

  useEffect(() => {
    checkBiometrics();
  }, []);
  const checkBiometrics = async () => {
    const rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true
    })

    const { biometryType, available, error } = await rnBiometrics.isSensorAvailable();
    console.log(biometryType, available, error);
    console.log(biometrics);
    if (available) {
      setBiometrics({
        isSensorAvailable: available, biometryType: biometryType,
      });
      const enabled = await EncryptedStorage.getItem('isBiometricsEnabled');
      if(enabled == 'true'){
        setBiometrics({
          ...biometrics,
          userEnabled: true,
        })
      }
      const password = await EncryptedStorage.getItem("userPassword");
      if (password) {
        setBiometrics({
          ...biometrics,
          password: password,
        })
      }
      const email = await EncryptedStorage.getItem("userEmail");
      if (email) {
        setBiometrics({
          ...biometrics,
          email: email,
        })
      }
    }
  }

  const login = async () => {
    const result = validateForm(true);
    if (!result) {
      setLoading(true)
      const { email, password, useExistingEmail, userData } = pageState;
      let formdata = {
        // email: useExistingEmail && userData ? userData['email'] : email,
        email,
        password
      }
      try {
        const res = await axiosExtended.post(routes.userLoginEmail, formdata)
        if (res.status === 200) {
          dispatch(setUserInfo(res.data.user));
          dispatch(setAuthToken(res.data.token));
          if (res.data.isBiometricsEnabled) {
            await EncryptedStorage.setItem('userEmail', email);
            await EncryptedStorage.setItem('userPassword', password);
            await EncryptedStorage.setItem('isBiometricsEnabled', 'true');
          }
          props.navigation.reset({
            index: 0,
            routes: [{
              // @ts-ignore
              name: 'BottomTab',
            }],
          });
        }
      } catch (err: any) {
        console.log(err)
        console.log(JSON.stringify(err, null, 6))
        if (err.response && err.response.status == 417) {
          // showToast('Account not yet activated. Please check your mailbox for the activation link.')
          Toast.show({
            type: 'error',
            text1: 'Account not yet activated',
            text2: 'Please check your mailbox for the activation link.'
          });
        } else {
          showToast('Unable to login. Confirm credentials and try again')
        }
      } finally {
        setLoading(false)
      }
    }
    else showToast(result);
  }

  const validateForm = (react: boolean = false) => {
    const {
      email, password, useExistingEmail
    } = pageState;

    if (!email && useExistingEmail == false) {
      if (react) setTimeout(() => {
        emailRef?.current?.focus();
      }, 0)
      return "Email is required";
    }

    if (!Utils.validateEmail(email) // && useExistingEmail == false
    ) {
      if (react) setTimeout(() => {
        emailRef?.current?.focus();
      }, 0)
      return "Invalid email address"
    }

    if (!password) {
      if (react) setTimeout(() => {
        passwordRef?.current?.focus();
      }, 100);

      return "Password is required";
    }
    return null;

  }

  const showToast = (msg: string, theme = 'error') => { // TOAST types = success, error, info
    Toast.show({
      type: theme,
      text1: msg,
    });
  }
  const promptFingerprint = async () => {
    const rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true
    })
    const res = await rnBiometrics.simplePrompt({
      promptMessage: "Login to Cardic with your biometrics",
    });
    if (res.success) {
      if (biometrics.isSensorAvailable) {
        let formdata = {
          email: biometrics.email,
          password: biometrics.password
        }
        props.login(formdata);
      }
    } else {

    }
  }

  const {
    Images
  } = useTheme()
  return (
    <ImageBackground
      source={Images.cardicBgIcon2}
      resizeMode='cover'
      style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.Primary,
      }}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        onKeyboardDidShow={() => {
          setKeyboardVisible(true)
        }}
        onKeyboardDidHide={() => {
          setKeyboardVisible(false)
        }}
      >

        <View
          style={{
            padding: '5%',
            paddingTop: '15%',
          }}>
          <View style={{
            justifyContent: 'space-between',
          }}>
            <AppBoldText
              style={{
                fontSize: RFPercentage(3.5),
                color: Colors.White,
              }}
            >
              Welcome
            </AppBoldText>
            <AppText
              style={{
                fontSize: RFPercentage(2.5),
                color: Colors.White,
                marginTop: 20,
              }}
            >
              Enter your details
            </AppText>

          </View>
        </View>


        <View
          style={{
            justifyContent: "center",
            marginTop: '10%',
            paddingTop: '10%',
            paddingBottom: '25%',
            backgroundColor: Colors.White,
          }}>
          {
            pageState.useExistingEmail && pageState.userData ?
              (
                <View
                  style={{
                    paddingHorizontal: "5%",
                  }}>
                  <AppBoldText
                    style={{
                      fontSize: RFPercentage(2.5)
                      // @ts-ignore
                    }}>{pageState.userData['email']}</AppBoldText>
                  <TouchableOpacity
                    style={{
                      marginTop: hp(1),
                    }}
                    onPress={() => {
                      setPageState({ ...pageState, useExistingEmail: false })
                    }}>
                    <AppText
                      style={{
                        textAlign: 'right',
                        fontSize: RFPercentage(2),
                        color: Colors.Primary,
                      }}
                    >
                      Change account
                    </AppText>
                  </TouchableOpacity>
                </View>

              ) :
              (
                <TextInputOne
                  inputRef={(ref) => {
                    // @ts-ignore
                    emailRef.current = ref;
                  }}
                  headText="Email Address"
                  keyboardType='email-address'
                  value={pageState.email}
                  labelStyle={{
                    fontWeight: 'bold',
                  }}
                  onChange={(value => setPageState({ ...pageState, email: value }))}
                  onSubmitEditing={() => login()}
                  containerStyle={{
                    marginTop: 0,
                    paddingHorizontal: 10,
                  }}
                />
              )
          }
          <TextInputOne
            inputRef={(ref) => {
              // @ts-ignore
              passwordRef.current = ref;
            }}
            headText="Password"
            value={pageState.password}
            labelStyle={{
              fontWeight: 'bold',
            }}
            onChange={(value => setPageState({ ...pageState, password: value }))}
            onSubmitEditing={() => login()}
            secureTextEntry={!pageState.showPassword}
            icon={(<Ionicons
              name={pageState.showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color={Colors.Black}
            />)}
            onPressIcon={() => {
              setPageState({ ...pageState, showPassword: !pageState.showPassword })
            }}
            containerStyle={{
              paddingHorizontal: 10,
            }}
          />

          <TouchableOpacity
            style={{
              marginRight: wp(4),
              width: '60%',
              alignSelf: 'flex-end'
            }}
            onPress={() => {
              // @ts-ignore
              props.navigation.push("ForgotPassword")
            }}>
            <AppText
              style={{
                textAlign: 'right',
                fontSize: RFPercentage(2),
                color: Colors.Primary,
              }}
            >
              I forgot my password
            </AppText>
          </TouchableOpacity>
        </View>
        <View style={{
          paddingBottom: '50%',
          paddingTop: 10,
          backgroundColor: Colors.White,
        }}>
          <AppText
            style={{
              textAlign: 'center',
              marginBottom: '2%',
            }}>Don't have an account, <AppText
              props={{
                onPress: () => {
                  // @ts-ignore
                  props.navigation.push("Register")
                }
              }}
              style={{
                color: Colors.Primary,
                alignSelf: 'center',
              }}>create one</AppText></AppText>
          <View
            style={{
              paddingHorizontal: 20,
              flexDirection: 'row',
              width: '100%',
            }}>
            <ButtonOne
              onPress={() => {
                login();
              }}
              text="Log In"
              textStyle={{
                fontSize: RFPercentage(2.2),
              }}
              loading={loading}
              containerStyle={{
                backgroundColor: Colors.Primary,
              }}
              outerStyle={{
                width: biometrics.isSensorAvailable && biometrics.userEnabled ? '85%' : '100%',
              }}
            />
            {
              biometrics.isSensorAvailable && biometrics.userEnabled ? (
                <TouchableOpacity
                  onPress={() => {
                    promptFingerprint();
                  }}
                  style={{
                    backgroundColor: Colors.Primary,
                    borderRadius: 5,
                    width: '15%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 5
                  }}>

                  {

                    biometrics.biometryType == BiometryTypes.TouchID ? (
                      <MaterialCommunityIcons
                        name="fingerprint"
                        color={Colors.White}
                        size={RFPercentage(3.5)}
                      />
                    ) : biometrics.biometryType == BiometryTypes.FaceID ? (
                      <Ionicons
                        name="scan-circle"
                        color={Colors.White}
                        size={RFPercentage(3.5)}
                      />
                    ) : biometrics.biometryType == BiometryTypes.Biometrics ? (
                      <MaterialCommunityIcons
                        name="fingerprint"
                        color={Colors.White}
                        size={RFPercentage(3.5)}
                      />
                    ) : undefined
                  }

                </TouchableOpacity>
              ) : undefined
            }
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
}

export default Login;