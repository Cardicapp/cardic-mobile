import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
} from 'react-native';
import {
  heightPercentageToDP,
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import Utils from 'CardicApp/src/lib/utils/Utils';
import routes from 'CardicApp/src/lib/network/routes';
import Toast from 'react-native-toast-message';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import AppText from 'CardicApp/src/components/AppText/AppText';
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import CustomModal from 'CardicApp/src/components/Modal/CustomModal';
import Colors from 'CardicApp/src/theme/Colors';
import { RFPercentage } from 'react-native-responsive-fontsize';
import AntDesign from 'react-native-vector-icons/AntDesign'
import ButtonOne from 'CardicApp/src/components/ButtonOne';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import { setUserInfo } from 'CardicApp/src/store/auth';
import { useNavigation } from '@react-navigation/native';

interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
  formdata: any;
  route: any;
}

interface State {
  pin: string;
  confirmPin: string;
  loading: boolean;
  showSuccessModal: boolean;
  showResendSuccessModal: boolean;
}
const CreateTransactionPin = (props: Props) => {
  const [state, setState] = useState<State>({
    pin: '',
    confirmPin: '',
    loading: false,
    showSuccessModal: false,
    showResendSuccessModal: false,
  });

  const dispatch = useDispatch();
  const navigator = useNavigation();
  const onSuccessModalClose = () => {
    setState({ ...state, showSuccessModal: false });
    navigator.goBack();
  };

  const submit = () => {
    const result = validate();
    if (!result) {
      setupPin();
    } else {
      showToast(result);
    }
  };

 

  const validate = () => {
    if (!state.pin) {
      return 'PIN is required';
    }
    if (state.pin.length != 4 || !Utils.isNumber(state.pin)) {
      return 'PIN is not valid';
    }

    if (state.pin != state.confirmPin) {
      return 'PINs do not match';
    }
    return null;
  };

  const setupPin = async () => {
    setState({ ...state, loading: true });
    try {
      let formdata = {
        pin: state.pin,
      };
      const res = await axiosExtended.post(`${routes.users}/pin`, formdata);
      if (res.status == 201) {
        const user = res.data;
        dispatch(setUserInfo({
          ...user,
          hasWithdrawalPin: true
        }));
        setState({ ...state, showSuccessModal: true, loading: false })
        return;
      }
      setState({ ...state, loading: false })
      showToast("Unable to add pin");
    } catch (e) {
      setState({ ...state, loading: false });
      showToast(Utils.handleError(e));
      console.log(e);
    }
  };

  const showToast = (msg: string, theme = 'error') => { // TOAST types = success, error, info
    Toast.show({
      type: theme,
      text1: msg,
    });
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        justifyContent: 'center',
        flex: 1,
      }}>
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          flex: 1,
        }}>
        {/* <Image
          source={Images.BgTwo}
          style={{
            height: 550,
            width: wp(100),
            alignSelf: 'center',
          }}
        /> */}
      </View>
      <SimpleBackHeader
        style={{
          backgroundColor: 'transparent',
        }}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: wp(5),
          paddingBottom: 20,
        }}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled">
        <View>
          <AppText
            style={{
              color: '#1D1D1B',
              fontWeight: '600',
              fontSize: RFPercentage(3.5),
            }}>
            {`Create Transaction Pin`}
          </AppText>
          <AppText
            style={{
              color: '#4F575E',
              fontWeight: '400',
              // fontSize: 16,
              marginTop: 12,
              marginBottom: 56,
            }}>
            {`You need this pin to withdraw money from your wallet. It’s a secret pin, please do not share!`}
          </AppText>
          <AppText
            style={{
              color: '#0C1014',
              fontWeight: '400',
              // fontSize: 16,
            }}>
            Enter transaction pin
          </AppText>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: wp(100),
              marginTop: 10,
              marginBottom: 35,
            }}>
            <SmoothPinCodeInput
              mask={
                <View
                  style={{
                    height: 45,
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 6,
                    // backgroundColor: '#f5f5f5',
                  }}>
                  <View
                    style={{
                      height: 10,
                      aspectRatio: 1,
                      borderRadius: 20,
                      justifyContent: 'space-around',
                      backgroundColor: Colors.Primary,
                    }}></View>
                </View>
              }
              cellStyle={{
                justifyContent: 'space-between',
                borderWidth: 0.5,
                borderRadius: 6,
                borderColor: Colors.Primary,
                backgroundColor: '#f5f5f5',
                height: 45,
                width: 40,
                left: 30,
                marginRight: 24,
              }}
              cellStyleFocused={{
                borderWidth: 1,
                borderColor: Colors.Primary,
              }}
              textStyle={{
                fontSize: 24,
              }}
              textStyleFocused={{
                color: Colors.Primary,
              }}
              value={state.pin}
              password={true}
              codeLength={4}
              onTextChange={(pin: any) => {
                if (pin.length <= 4) {
                  setState({ ...state, pin });
                }
              }}
            />
          </View>

          <AppText>
            Confirm transaction pin
          </AppText>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: wp(70),
              marginTop: 20,
            }}>
            <SmoothPinCodeInput
              mask={
                <View
                  style={{
                    height: 45,
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 6,
                  }}>
                  <View
                    style={{
                      height: 10,
                      aspectRatio: 1,
                      borderRadius: 20,
                      justifyContent: 'space-around',
                      backgroundColor: Colors.Primary,
                    }}></View>
                </View>
              }
              cellStyle={{
                justifyContent: 'space-between',
                borderWidth: 0.5,
                borderRadius: 6,
                borderColor: '#f5f5f5',
                backgroundColor: '#f5f5f5',
                height: 45,
                width: 40,
                left: 30,
                marginRight: 24,
              }}
              cellStyleFocused={{
                borderWidth: 1,
                borderColor: Colors.Primary,
              }}
              textStyle={{
                fontSize: 24,
              }}
              textStyleFocused={{
                color: Colors.Primary,
              }}
              value={state.confirmPin}
              password={true}
              codeLength={4}
              onTextChange={(pin: any) => {
                if (pin.length <= 4) {
                  setState({ ...state, confirmPin: pin });
                }
              }}
            />
          </View>
        </View>


      </ScrollView>
      <ButtonOne
        onPress={() => {
          submit();
        }}
        text="Create Transaction Pin"
        loading={state.loading}
        containerStyle={{
          backgroundColor:
            validate() == null
              ? Colors.Primary
              : Colors.SlightlyShyGrey,
              marginBottom: 10,
              width: '95%',
              alignSelf: 'center',
        }}
      />

      <CustomModal
        isVisible={state.showSuccessModal}
        onClose={onSuccessModalClose}
        content="Transaction pin added successfully"
        contentStyle={{
          fontWeight: '400',
          fontSize: 13,
          marginTop: heightPercentageToDP(0.8),
          lineHeight: 18,
          marginVertical: 0,
        }}
        icon={
          <View style={{
            height: heightPercentageToDP(8), aspectRatio: 1, borderRadius: 100, backgroundColor: Colors.Primary,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <AntDesign
              name="check"
              size={RFPercentage(3)}
              color={Colors.White}
            />
          </View>
        }
        actions={[
          {
            text: 'Continue',
            onPress: onSuccessModalClose,
            containerStyle: {
              backgroundColor: Colors.White,
            },
            textStyle: {
              color: Colors.Black,
            },
          },

        ]}
      />
    </SafeAreaView>
  );
}

export default CreateTransactionPin;
