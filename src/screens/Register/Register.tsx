import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
import Utils from 'CardicApp/src/lib/utils/Utils';
import Colors from 'CardicApp/src/theme/Colors';
import React, { MutableRefObject, useRef, useState } from 'react';
import { Image, SafeAreaView, View, TextInput, ScrollView } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP, heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import ButtonOne from 'CardicApp/src/components/ButtonOne';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthState, setAuthState, setAuthToken, setUserInfo } from 'CardicApp/src/store/auth';
import routes from 'CardicApp/src/lib/network/routes';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import Toast from 'react-native-toast-message';
import ConfirmModal from 'CardicApp/src/components/Modal/ConfirmModal';
import AntDesign from 'react-native-vector-icons/AntDesign';


interface State {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  showSuccessModal: boolean;
  showPassword: boolean;
  confirmPassword: string;
}

interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
  showToast: any,
  register: (data: any) => void,
  loading: boolean,
}
const Register = (props: Props) => {
  const [pageState, setPageState] = useState<State>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    showSuccessModal: false,
    showPassword: false,
  })
  const [loading, setLoading] = useState(false)
  const emailRef: MutableRefObject<TextInput | null> | null = useRef(null);
  const passwordRef: MutableRefObject<TextInput | null> | null = useRef(null);
  const confirmPasswordRef: MutableRefObject<TextInput | null> | null = useRef(null);
  const userNameRef: MutableRefObject<TextInput | null> | null = useRef(null);
  const firstNameRef: MutableRefObject<TextInput | null> | null = useRef(null);
  const lastNameRef: MutableRefObject<TextInput | null> | null = useRef(null);

  const signup = async () => {
    const result = validateForm(true);
    if (!result) {
      setLoading(true)
      const { email, password, firstName, lastName, userName } = pageState;
      let formdata = {
        email,
        password,
        firstName,
        lastName,
        userName,
      }
      try {
        const res = await axiosExtended.post(routes.userRegisterEmail, formdata)
        if (res.status === 201) {
          setPageState({
            ...pageState,
            showSuccessModal: true,
          })
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

  const showToast = (msg: string, theme = 'error') => { // TOAST types = success, error, info
    Toast.show({
      type: theme,
      text1: msg,
    });
  }

  const validateForm = (react: boolean = false) => {
    const {
      email, firstName, lastName, userName, password, confirmPassword
    } = pageState;

    if (!email) {
      if (react) setTimeout(() => {
        emailRef?.current?.focus();
      }, 0)
      return "Email is required";
    }

    if (!firstName) {
      if (react) setTimeout(() => {
        firstNameRef?.current?.focus();
      }, 0)
      return "First Name is required";
    }

    if (!lastName) {
      if (react) setTimeout(() => {
        lastNameRef?.current?.focus();
      }, 0)
      return "Last Name is required";
    }

    if (!userName) {
      if (react) setTimeout(() => {
        userNameRef?.current?.focus();
      }, 0)
      return "Username is required";
    }

    if (!Utils.validateEmail(email)
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

    if (password.length < 8) {
      if (react) setTimeout(() => {
        passwordRef?.current?.focus();
      }, 100);
      return "Password is too short";
    }

    if(!Utils.containsUpperCase(password)){
      if (react) setTimeout(() => {
        passwordRef?.current?.focus();
      }, 100);
      return "Password should contain at least one uppercase character";
    }

    if(!Utils.containsSpecialChar(password)){
      if (react) setTimeout(() => {
        passwordRef?.current?.focus();
      }, 100);
      return`Password should contain at least one special character. eg. !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]`;
    }

    if(!Utils.checkForNumber(password)){
      if (react) setTimeout(() => {
        passwordRef?.current?.focus();
      }, 100);
      return`Password should contain at least one numeric character`;
    }

    if (password != confirmPassword) {
      if (react) setTimeout(() => {
        confirmPasswordRef?.current?.focus();
      }, 100);
      return "Passwords do not match";
    }
    return null;

  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.White,
        flex: 1,
      }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{
          paddingBottom: 20,
          backgroundColor: Colors.White,
        }}
      >
        <SimpleBackHeader
          text="Register"
          showBack={true}
          showMenu={false}
        />

        <AppText style={{
          color: Colors.Primary,
          fontWeight: '700',
          marginLeft: 10,
        }}>Sign Up</AppText>


        <View
          style={{
            justifyContent: "center",
            marginTop: 20,
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
            onSubmitEditing={() => signup()}
            containerStyle={{
              marginTop: 0,
              paddingHorizontal: 10,
            }}
          />
          <TextInputOne
            inputRef={(ref) => {
              // @ts-ignore
              firstNameRef.current = ref;
            }}
            headText="First Name"
            value={pageState.firstName}
            labelStyle={{
              fontWeight: 'bold',
            }}
            onChange={(value => setPageState({ ...pageState, firstName: value }))}
            onSubmitEditing={() => signup()}
            containerStyle={{
              marginTop: 0,
              paddingHorizontal: 10,
            }}
          />
          <TextInputOne
            inputRef={(ref) => {
              // @ts-ignore
              lastNameRef.current = ref;
            }}
            headText="Last Name"
            value={pageState.lastName}
            labelStyle={{
              fontWeight: 'bold',
            }}
            onChange={(value => setPageState({ ...pageState, lastName: value }))}
            onSubmitEditing={() => signup()}
            containerStyle={{
              marginTop: 0,
              paddingHorizontal: 10,
            }}
          />
          <TextInputOne
            inputRef={(ref) => {
              // @ts-ignore
              userNameRef.current = ref;
            }}
            headText="Username"
            placeholder="eg cardic_user"
            value={pageState.userName}
            labelStyle={{
              fontWeight: 'bold',
            }}
            onChange={(value => setPageState({ ...pageState, userName: value }))}
            onSubmitEditing={() => signup()}
            containerStyle={{
              marginTop: 0,
              paddingHorizontal: 10,
            }}
          />
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
            onSubmitEditing={() => signup()}
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

          <TextInputOne
            inputRef={(ref) => {
              // @ts-ignore
              confirmPasswordRef.current = ref;
            }}
            headText="Confirm Password"
            value={pageState.confirmPassword}
            labelStyle={{
              fontWeight: 'bold',
            }}
            onChange={(value => setPageState({ ...pageState, confirmPassword: value }))}
            onSubmitEditing={() => signup()}
            secureTextEntry={true}
            containerStyle={{
              paddingHorizontal: 10,
            }}
          />
        </View>
      </ScrollView>

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
              signup();
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


        <ConfirmModal
          icon={
            <View style={{
              height: heightPercentageToDP(8), aspectRatio: 1, borderRadius: 100, backgroundColor: Colors.Primary,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <AntDesign
                name="check"
                size={RFPercentage(3)}
                color={Colors.White}
              />
            </View>
          }
          isVisible={pageState.showSuccessModal}
          showCancel={false}
          proceedText={`Continue`}
          onClose={() => setPageState({
            ...pageState,
            showSuccessModal: false
          })}
          onProceed={() => {
            setPageState({
              ...pageState,
              showSuccessModal: false
            })
            props.navigation.reset({
              index: 1,
              routes: [
                { name: 'Login' },
              ],
            });
          }}
          title="Congratulations 🎉"
          content='Signup completed successfully'
        />


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
//         register: (data: any) => dispatch(actions.register(data)),

//     };
// };
// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(Register);

export default Register;