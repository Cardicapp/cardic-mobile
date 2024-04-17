import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
import Utils from 'CardicApp/src/lib/utils/Utils';
import Colors from 'CardicApp/src/theme/Colors';
import React, { MutableRefObject, useRef, useState } from 'react';
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

  // componentDidMount() {
  // EncryptedStorage.getItem("user_data").then(val => {
  //     if (val) {
  //         const data = JSON.parse(val);
  //         setState({ userData: data, useExistingEmail: true, });
  //     }
  // });

  // ReactNativeBiometrics.isSensorAvailable()
  //     .then((resultObject) => {
  //         const { available, biometryType } = resultObject;
  //         if (available) {
  //             EncryptedStorage.getItem("user_password").then(val => {
  //                 if (val) {
  //                     setState({ 
  //                         biometricPassword: val, 
  //                         isSensorAvailable: true, 
  //                         biometryType: biometryType,

  //                     }, () => {
  //                         promptFingerprint();
  //                     });
  //                 }
  //             });
  //         }
  //         // setState({ isSensorAvailable: available, biometryType: biometryType })
  //     });

  // }

  // onSuccessModalClose = () => {
  //     setState({ showSuccessModal: false });
  // }

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
          dispatch(setAuthToken(res.data.token))
          props.navigation.reset({
            index: 0,
            routes: [{
              name: 'BottomTab',
            }],
          });
        }
      } catch (err) {
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
  // promptFingerprint = async () => {
  // const res = await ReactNativeBiometrics.simplePrompt({
  //     promptMessage: "Login to shecluded with your biometrics",
  // });
  // if(res.success){
  //     const userData = state.userData;
  //     if(userData){
  //         let formdata = {
  //             email: userData['email'], 
  //             password: state.biometricPassword
  //         }
  //         props.login(formdata);
  //     }
  // } else {

  // }
  // }

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
        height: heightPercentageToDP(100),
        backgroundColor: Colors.Primary,
      }}>
      <SafeAreaView
        style={{
          backgroundColor: undefined, // Colors.White,
          flex: 1,
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
          contentContainerStyle={{
            // paddingBottom: 20,
            // backgroundColor: Colors.White,
          }}
        >

          <View
            style={{
              padding: '5%',
              marginTop: '15%',
            }}>
            {/* <AppText style={{
            marginTop: 80,
            color: Colors.Primary,
            fontWeight: '700'
          }}>Sign In</AppText> */}

            <View style={{
              // flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <AppBoldText
                style={{
                  fontSize: RFPercentage(4.5),
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
              paddingTop: '15%',
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
                      }}>{pageState.userData['email']}</AppBoldText>
                    <TouchableOpacity
                      style={{
                        // marginLeft: wp(4),
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
                    // placeholder="Your Email Address here"
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
              // placeholder="Your Password here"
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
                width: '40%',
                // backgroundColor: 'red',
                alignSelf: 'flex-end'
              }}
              onPress={() => {
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







        </KeyboardAwareScrollView>

        <View style={{
          marginTop: 'auto',
          paddingBottom: 20,
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
              // justifyContent: 'space-between',
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
                // backgroundColor: validateForm() == null ? Colors.Primary : Colors.SlightlyShyGrey,

              }}
              outerStyle={{
                width: pageState.isSensorAvailable ? '78%' : '100%',
              }}
            />
            {
              pageState.isSensorAvailable ? (
                <TouchableOpacity
                  onPress={() => {
                    // promptFingerprint();
                  }}
                  style={{
                    backgroundColor: Colors.Primary,
                    borderRadius: 5,
                    width: '20%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>

                  {/* {

                    state.biometryType == ReactNativeBiometrics.TouchID ? (
                            <MaterialCommunityIcons
                                name="fingerprint"
                                color={Colors.White}
                                size={RFPercentage(4)}
                            />
                        ) : state.biometryType == ReactNativeBiometrics.FaceID ? (
                            <Ionicons
                                name="ios-scan-circle"
                                color={Colors.White}
                                size={RFPercentage(4)}
                            />
                        ) : state.biometryType == ReactNativeBiometrics.Biometrics ? (
                            <MaterialCommunityIcons
                                name="fingerprint"
                                color={Colors.White}
                                size={RFPercentage(3.7)}
                            />
                        ) : undefined
                } */}

                </TouchableOpacity>
              ) : undefined
            }

          </View>
          {/* {
            keyboardVisible ?
              undefined
              : (
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                  onPress={() => {
                    props.
                      navigation.push("Register")
                  }}>
                  <AppBoldText
                    style={{
                      textAlign: 'center',
                      fontSize: RFPercentage(2),
                      color: Colors.Primary,
                    }}
                  >
                    Register
                  </AppBoldText>
                </TouchableOpacity>
              )
          } */}





        </View>


      </SafeAreaView>
    </ImageBackground>
  );
}

export default Login;