import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleProp,
  StyleSheet,
  Switch,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import ReactNativeBiometrics from 'react-native-biometrics';

import Colors from '@/theme/Colors';
import AppText, { AppBoldText, BoldFontFamily } from '@/components/AppText/AppText';
import SimpleBackHeader from '@/components/SimpleBackHeader';
import ConfirmModal from '@/components/Modal/ConfirmModal';

import axiosExtended from '@/lib/network/axios-extended';
import routes from '@/lib/network/routes';

import {
  selectAuthState,
  setAuthToken,
  setUserInfo,
  userLogout,
} from '@/store/auth';

const frontendHost = Config.FRONTEND_HOST;

const SettingsScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuthState);

  const [changingPassword, setChangingPassword] = useState(false);
  const [changingPin, setChangingPin] = useState(false);
  const [showConfirmChangePasswordModal, setShowConfirmChangePasswordModal] = useState(false);
  const [showConfirmChangePinModal, setShowConfirmChangePinModal] = useState(false);

  /* ---------------- LOGOUT ---------------- */
  const logout = () => {
    Alert.alert('Logout?', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Yes, Logout', style: 'destructive', onPress: proceed },
    ]);
  };

  const proceed = () => {
    dispatch(setUserInfo(null));
    dispatch(setAuthToken(null));
    dispatch(userLogout());
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  /* ---------------- HELPERS ---------------- */
  const updateUser = async (payload: any, cb: (res: any) => void) => {
    try {
      const res = await axiosExtended.patch(`${routes.users}/${user?.id}`, payload);
      cb(res.status === 200 ? res.data : false);
    } catch {
      cb(false);
    }
  };

  const forgotPassword = async () => {
    setChangingPassword(true);
    try {
      await axiosExtended.post(`${routes.auth}/forgot/password`, {
        email: user?.email,
      });
      Toast.show({ type: 'success', text1: 'Check your email for instructions' });
    } finally {
      setChangingPassword(false);
    }
  };

  const forgotPin = async () => {
    setChangingPin(true);
    try {
      await axiosExtended.post(`${routes.auth}/forgot/pin`, {
        email: user?.email,
      });
      Toast.show({ type: 'success', text1: 'Check your email for instructions' });
    } finally {
      setChangingPin(false);
    }
  };

  const promptFingerprint = async () => {
    const rnBiometrics = new ReactNativeBiometrics();
    const res = await rnBiometrics.simplePrompt({
      promptMessage: 'Authenticate with biometrics',
    });
    return res.success ? null : res.error;
  };

  return (
    <SafeAreaView style={styles.container}>
      <SimpleBackHeader text="" showBack={false} />

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* LOGIN & SECURITY */}
        <AppBoldText style={styles.sectionTitle}>Settings</AppBoldText>
        <AppBoldText style={styles.sectionText}>Login and Security</AppBoldText>

        <SettingsCard>
          <SettingItem
            text="Change Password"
            icon="lock"
            onPress={() => setShowConfirmChangePasswordModal(true)}
            rightItem={changingPassword && <ActivityIndicator color={Colors.Primary} />}
          />

          <SettingItem
            text="Change Pin"
            icon="key"
            onPress={() => setShowConfirmChangePinModal(true)}
            rightItem={changingPin && <ActivityIndicator color={Colors.Primary} />}
          />

          <SettingItem
            text="Biometric Authentication"
            icon="fingerprint"
            onPress={() => {}}
            rightItem={
              <Switch
                value={user?.isBiometricsEnabled}
                onChange={async () => {
                  if (!user?.isBiometricsEnabled) {
                    const err = await promptFingerprint();
                    if (err) {
                      Toast.show({ type: 'error', text1: err });
                      return;
                    }
                  }
                  updateUser(
                    { isBiometricsEnabled: !user?.isBiometricsEnabled },
                    async (res) => {
                      if (res) {
                        dispatch(setUserInfo(res));
                        await EncryptedStorage.setItem(
                          'isBiometricsEnabled',
                          res.isBiometricsEnabled.toString()
                        );
                      }
                    }
                  );
                }}
              />
            }
          />
        </SettingsCard>

        {/* MORE INFORMATION */}
        <AppBoldText style={styles.sectionText}>More Information</AppBoldText>

        <SettingsCard>
          <SettingItem
            text="Support"
            icon="message-circle"
            onPress={() => Linking.openURL('https://cardicapp.com/contact')}
          />

          <SettingItem
            text="Terms and Condition"
            icon="file-text"
            onPress={() => Linking.openURL(`${frontendHost}/privacypolicy`)}
          />

          <SettingItem
            text="Delete Profile"
            icon="trash"
            iconColor={Colors.Red}
            textStyle={{ color: Colors.Red }}
            onPress={() => Linking.openURL('https://cardicapp.com/delete-account')}
          />
        </SettingsCard>

        {/* LOGOUT */}
        <View style={styles.logoutWrap}>
          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <AppBoldText style={{ color: '#FFF' }}>Log Out</AppBoldText>
          </TouchableOpacity>
        </View>

        {/* SOCIAL */}
        <View style={styles.socialWrap}>
          <AppText style={styles.followText}>Follow us on</AppText>
          <View style={styles.socialRow}>
            <Ionicons name="logo-instagram" size={22} color={Colors.Primary} />
            <Ionicons name="logo-twitter" size={22} color={Colors.Primary} />
            <Ionicons name="paper-plane" size={22} color={Colors.Primary} />
          </View>
        </View>
      </ScrollView>

      {/* MODALS */}
      <ConfirmModal
        isVisible={showConfirmChangePasswordModal}
        title="Change Password?"
        content="A mail will be sent to your inbox. Continue?"
        proceedText="Continue"
        onClose={() => setShowConfirmChangePasswordModal(false)}
        onProceed={() => {
          setShowConfirmChangePasswordModal(false);
          forgotPassword();
        }}
      />

      <ConfirmModal
        isVisible={showConfirmChangePinModal}
        title="Change PIN?"
        content="A mail will be sent to your inbox. Continue?"
        proceedText="Continue"
        onClose={() => setShowConfirmChangePinModal(false)}
        onProceed={() => {
          setShowConfirmChangePinModal(false);
          forgotPin();
        }}
      />
    </SafeAreaView>
  );
};

/* ---------------- COMPONENTS ---------------- */

const SettingsCard = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.card}>{children}</View>
);

interface SettingItemProps {
  text: string;
  textStyle?: StyleProp<TextStyle>;
  rightItem?: React.ReactNode;
  onPress: () => void;
  icon?: string;
  iconColor?: string;
}

const SettingItem = ({
  text,
  onPress,
  rightItem,
  textStyle,
  icon,
  iconColor = Colors.Primary,
}: SettingItemProps) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.leftRow}>
      {icon && (
        <View style={styles.iconWrap}>
          <Feather name={icon} size={16} color={iconColor} />
        </View>
      )}
      <AppText style={[styles.settingText, textStyle]}>{text}</AppText>
    </View>

    {rightItem ?? <AntDesign name="right" size={16} color={Colors.Primary} />}
  </TouchableOpacity>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },

  sectionTitle: {
    marginLeft: '5%',
    marginTop: 20,
    marginBottom: 10,
    fontSize: RFPercentage(4.2),
  },
  sectionText: {
    marginLeft: '5%',
    marginTop: 20,
    marginBottom: 10,
    fontSize: RFPercentage(2.2),
  },

  card: {
    backgroundColor: '#F1F1F1',
    marginHorizontal: '5%',
    borderRadius: 14,
    paddingVertical: 6,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E9FFD6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  settingText: {
    fontSize: RFPercentage(2),
  },

  logoutWrap: {
    paddingHorizontal: '5%',
    marginTop: 30,
  },

  logoutBtn: {
    backgroundColor: '#000',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },

  socialWrap: {
    alignItems: 'center',
    marginTop: 25,
  },

  followText: {
    fontSize: RFPercentage(1.7),
    marginBottom: 10,
  },

  socialRow: {
    flexDirection: 'row',
    gap: 16,
  },
});

export default SettingsScreen;
