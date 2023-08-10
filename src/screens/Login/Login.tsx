import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
import Utils from 'CardicApp/src/lib/utils/Utils';
import Colors from 'CardicApp/src/theme/Colors';
import React, { MutableRefObject, useRef, useState } from 'react';
import { Image, SafeAreaView, View, TouchableOpacity, TextInput, ActivityIndicator, Platform, DevSettings, } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
// import Images from '../../shared/Images';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
// import AppText, { AppBoldText } from '../../components/AppText';
// import Colors from '../../shared/Theme/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import TextInputOne from '../../components/TextInputOne';
// import ButtonOne from '../../components/ButtonOne';
// import * as actions from '../../store/actions/index';
// import { connect } from 'react-redux';
// import { ShecludedState } from '../../store/root.reducer';
// import Utils from '../../shared/Utils';
// import EncryptedStorage from 'react-native-encrypted-storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
// import { RFPercentage } from 'react-native-responsive-fontsize';
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
        console.error(err)
        console.error(JSON.stringify(err, null, 6))
      } finally {
        setLoading(false)
      }
    }
    else showToast(result);
  }

  const showToast = (msg: string, theme = 'danger') => {
    // props.showToast([msg], {
    //   duration: 2000, theme,
    // });
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

    // if (password.length < 8) {
    //   if (react) setTimeout(() => {
    //     passwordRef?.current?.focus();
    //   }, 100);
    //   return "Password is too short";
    // }
    return null;

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


  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.White,
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
          paddingBottom: 20,
          backgroundColor: Colors.White,
        }}
      >

        <View
          style={{
            marginLeft: wp(2),
            marginTop: 80,
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
                }}
              >
                Sign In
              </AppBoldText>
              {/* {
                                    // @ts-ignore
                                    props.userData ? (
                                        <AppBoldText
                                            style={{
                                                fontSize: 24,
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {
                                                // @ts-ignore  -- onChange, value are incompatible
                                                state.userData && state.userData['first_name'] && state.userData['first_name']
                                            }
                                        </AppBoldText>
                                    ) : (
                                        <AppBoldText
                                            style={{
                                                fontSize: 24,
                                            }}
                                        >
                                            Stranger
                                        </AppBoldText>
                                    )
                                } */}

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
                  placeholder="Your Email Address here"
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
          {/* <TextInputOne
                            inputRef={(ref) => {
                                // @ts-ignore
                                emailRef = ref;
                            }}
                            headText="Email Address"
                            placeholder="Your Email Address here"
                            value={state.email}
                            labelStyle={{
                                fontWeight: 'bold',
                            }}
                            onChange={(value => setState({ email: value }))}
                            onSubmitEditing={() => login()}
                            containerStyle={{
                                marginTop: 0,
                            }}
                        /> */}
          <TextInputOne
            inputRef={(ref) => {
              // @ts-ignore
              passwordRef.current = ref;
            }}
            headText="Password"
            placeholder="Your Password here"
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
              marginLeft: wp(4),
              marginTop: hp(1),

            }}
            onPress={() => {
              props.navigation.push("/forgot-password-email")
            }}>
            <AppText
              style={{
                // textAlign: 'center',
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
        <View
          style={{
            paddingHorizontal: 20,
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <ButtonOne
            onPress={() => {
              login();
            }}
            text="Login"
            textStyle={{
              fontSize: RFPercentage(2.2),
            }}
            loading={loading}
            containerStyle={{
              backgroundColor: validateForm() == null ? Colors.Primary : Colors.SlightlyShyGrey,

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
        {
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
        }





      </View>


    </SafeAreaView>
  );
}



// const mapStateToProps = (state: ShecludedState) => {
//     return {
//         loading: state.uiReducer.loginLoading,
//         userData: state.appReducer.userData,
//     };
// };
// const mapDispatchToProps = (dispatch: any) => {
//     return {
//         showToast: (messages: string[], options: any) =>
//             dispatch(actions.showToast(messages, options)),
//         login: (data: any) => dispatch(actions.login(data)),

//     };
// };
// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(Login);

export default Login;