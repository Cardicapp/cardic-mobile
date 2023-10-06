import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors from 'CardicApp/src/theme/Colors';
import Utils from 'CardicApp/src/lib/utils/Utils';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthState, setAuthToken, setUserInfo } from 'CardicApp/src/store/auth';
import { useNavigation } from '@react-navigation/native';
import { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';

interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
}

const SettingsScreen = (props: Props) => {
  const dispatch = useDispatch();
  const {user} = useSelector(selectAuthState)

  const logout = () => {
    Alert.alert('Logout?', 'Are you sure to leave Cardic?', [
      {
        text: 'Yes Proceed',
        style: 'destructive',
        onPress: () => proceed(),
      },
      {
        text: 'Cancel',
        style: 'cancel',
        // If the user confirmed, then we dispatch the action we blocked earlier
        // This will continue the action that had triggered the removal of the screen
        onPress: () => { },
      },
    ]);
  };

  const proceed = async () => {
    await serverLogout();
    dispatch(setUserInfo(null));
    dispatch(setAuthToken(null));
    props.navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Login',
        }
      ]
    })
  }
  const serverLogout = async () => {
    try {
      const res = await axiosExtended.post(`${routes.auth}/logout`)
      if (res.status === 200) return true;
    } catch(e) {
      console.error(e);
      return false;
    }
  }


  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // const [showErrorModal, setShowErrorModal] = useState(false);
  const [hasWithdrawalPin, setHasWithdrawalPin] = useState(false);
  const [hasCheckedPin, setHasCheckedPin] = useState(false);

  // const showToast = (message: string) => {
  //   props.showToast([message], {
  //     theme: 'success',
  //     duration: 2000,
  //   });
  // };

  // const startZendeskChat = () => {
  //   const userData = props.userData;
  //   const fullName = userData.first_name + ' ' + userData.last_name;
  //   ZendeskChat.startChat({
  //     name: fullName,
  //     email: userData['email'],
  //     phone: userData['phone_no'],
  //     // tags: ["tag1", "tag2"],
  //     // department: "End User",
  //     // The behaviorFlags are optional, and each default to 'true' if omitted
  //     behaviorFlags: {
  //       showAgentAvailability: true,
  //       showChatTranscriptPrompt: true,
  //       showPreChatForm: false,
  //       showOfflineForm: true,
  //     },
  //     // The preChatFormOptions are optional & each defaults to "optional" if omitted
  //     preChatFormOptions: {
  //       name: !fullName ? 'required' : 'optional',
  //       email: 'optional',
  //       phone: 'optional',
  //       department: 'optional',
  //     },
  //     localizedDismissButtonTitle: 'Dismiss',
  //     messagingOptions: {
  //       botName: 'Shecluded',
  //     },
  //   });
  // };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <SimpleBackHeader
        text="Settings"
        showBack={false}
        actions={[
          // loading ? <ActivityIndicator color={Colors.Primary} /> : undefined,
        ]}
      />

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 10,
        }}>
        <AppBoldText
          style={{
            marginLeft: '5%',
            marginTop: heightPercentageToDP(2),
            fontSize: RFPercentage(2.5),
            color: Colors.Primary,
          }}>
          Profile Settings
        </AppBoldText>
        {/* <SettingItem
          text="Edit Profile"
          onPress={() => {
            props.navigation.push('/profile-page');
          }}
        /> */}
        <SettingItem
          text="Change Password"
          onPress={() => {
            // sendToken();
            // props.navigation.push('/change-passwword');
          }}
        />
        {user?.hasWithdrawalPin ? (
          <SettingItem
            text="Change Withdrawal PIN"
            onPress={() => {
              props.navigation.push('/initiate-change-pin');
            }}
          />
        ) : (
          <SettingItem
            text="Setup Withdrawal PIN"
            onPress={() => {
              props.navigation.push('CreateWithdrawalPin');
            }}
          />
        )}
        {/* <SettingItem
          text="Notifications"
          onPress={() => {
            props.navigation.push('/notification-settings');
          }}
        /> */}

        <AppBoldText
          style={{
            marginLeft: '5%',
            marginTop: heightPercentageToDP(4),
            fontSize: RFPercentage(2.5),
            color: Colors.Primary,
          }}>
          Preferences
        </AppBoldText>
        {/* <SettingItem
          text="Our Story"
          onPress={() => {
            props.navigation.push('/about-us');
          }}
          rightItem={
            <AntDesign
              name="right"
              color={'#999999'}
              size={RFPercentage(2.8)}
              style={{
                marginRight: '1%',
              }}
            />
          }
        /> */}
        <SettingItem
          text="Privacy Policy"
          onPress={() => {
            // props.navigation.push('/privacy-policy');
          }}
          rightItem={
            <AntDesign
              name="right"
              color={'#999999'}
              size={RFPercentage(2.8)}
              style={{
                marginRight: '1%',
              }}
            />
          }
        />
        {/* <SettingItem
          text="FAQ & Support"
          onPress={() => {
            props.navigation.push('/faq');
          }}
          rightItem={
            <AntDesign
              name="right"
              color={'#999999'}
              size={RFPercentage(2.8)}
              style={{
                marginRight: '1%',
              }}
            />
          }
        /> */}

        {/* <SettingItem
          text="Terms of Service"
          onPress={() => {
            props.navigation.push('/terms');
          }}
          rightItem={
            <AntDesign
              name="right"
              color={'#999999'}
              size={RFPercentage(2.8)}
              style={{
                marginRight: '1%',
              }}
            />
          }
        /> */}
        {/* <AppBoldText
          style={{
            marginLeft: '5%',
            marginTop: hp(4),
            fontSize: RFPercentage(2.5),
            color: Colors.Primary,
          }}>
          Support
        </AppBoldText>

        <SettingItem
          text="Help"
          onPress={() => {
            props.navigation.push('/contact-us');
          }}
          rightItem={
            <AntDesign
              name="right"
              color={'#999999'}
              size={RFPercentage(2.8)}
              style={{
                marginRight: '1%',
              }}
            />
          }
        />
        <SettingItem
          text="Contact Us"
          onPress={() => {
            props.navigation.push('/contact-us');
          }}
          rightItem={
            <AntDesign
              name="right"
              color={'#999999'}
              size={RFPercentage(2.8)}
              style={{
                marginRight: '1%',
              }}
            />
          }
        />
        <SettingItem
          text="Chat with Support"
          onPress={() => {
            startZendeskChat();
          }}
          rightItem={
            <AntDesign
              name="right"
              color={'#999999'}
              size={RFPercentage(2.8)}
              style={{
                marginRight: '1%',
              }}
            />
          }
        /> */}

        <SettingItem
          text="Sign Out"
          onPress={() => {
            logout();
          }}
          rightItem={
            <AntDesign
              name="logout"
              color={Colors.Primary}
              size={RFPercentage(2.8)}
              style={{
                marginRight: '1%',
              }}
            />
          }
        />
      </ScrollView>

      {/* <CustomModal
        isVisible={showErrorModal}
        onClose={() => {
          setShowErrorModal(false);
        }}
        content={errorMessage || 'Could not process request. Please try again'}
        contentStyle={{
          fontWeight: '400',
          fontSize: 13,
          marginTop: 8,
          lineHeight: 18,
          marginVertical: 0,
          marginBottom: 10,
        }}
        icon={
          <View
            style={{
              height: 63,
              aspectRatio: 1,
              backgroundColor: 'rgba(255, 3, 139, 0.97)',
              borderRadius: 100,
            }}
          />
        }
        actions={[
          {
            text: 'Continue',
            onPress: () => { },
            containerStyle: {
              backgroundColor: Colors.White,
            },
            textStyle: {
              color: Colors.Black,
              fontSize: RFPercentage(2),
            },
          },
        ]}
      /> */}
    </SafeAreaView>
  );
};

export interface SettingItemProps {
  text: string;
  rightItem?: React.ReactNode;
  onPress: () => void;
}

export const SettingItem = (props: SettingItemProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={props.onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '5%',
        marginTop: heightPercentageToDP(0.6),
        height: heightPercentageToDP(5),
      }}>
      <AppBoldText
        style={{
          fontSize: RFPercentage(2.1),
        }}>
        {props.text}
      </AppBoldText>
      {props.rightItem ? props.rightItem : undefined}
    </TouchableOpacity>
  );
};

export default SettingsScreen;
