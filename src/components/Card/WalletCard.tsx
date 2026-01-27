import React, { useState } from 'react';
import {
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
  ImageBackground,
} from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import Colors from 'CardicApp/src/theme/Colors';
import AppText, { AppBoldText } from '../AppText/AppText';
import { useTheme } from 'CardicApp/src/hooks';

type NavProp = StackNavigationProp<ApplicationStackParamList>;

interface CardicCardThreeProps {
  top?: string;
  bottom?: string;
  showIcon?: boolean;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

const WalletCard = ({
  top,
  bottom,
  showIcon = true,
  onPress,
  containerStyle,
}: CardicCardThreeProps) => {
  const [open, setOpen] = useState(false);
  const navigation = useNavigation<NavProp>();
  const { Images } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{ marginTop: heightPercentageToDP(2) }}
    >
      <ImageBackground
        source={Images.cardicBgIcon2}
        resizeMode="cover"
        imageStyle={{ borderRadius: 16 }}
        style={[
          {
            width: '90%',
            alignSelf: 'center',
            borderRadius: 16,
            overflow: 'hidden',
          },
          containerStyle,
        ]}
      >
        {/* GLASS OVERLAY */}
        <View
          style={{
            backgroundColor: 'rgba(4, 4, 4, 0.12)',
            paddingHorizontal: 16,
            paddingVertical: heightPercentageToDP(1),
            borderRadius: 16,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.25)',
          }}
        >
          {/* TOP ROW */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View>
              <AppText style={{ color: Colors.White }}>
                {top}
              </AppText>

              <AppBoldText
                style={{
                  color: Colors.White,
                  fontSize: RFPercentage(4),
                  marginTop: 4,
                }}
              >
                {open ? bottom : '***'}
              </AppBoldText>
            </View>

            {showIcon && (
              <Entypo
                onPress={() => setOpen(!open)}
                name={open ? 'eye' : 'eye-with-line'}
                size={RFPercentage(2.8)}
                color={Colors.White}
                style={{ marginLeft: 'auto' }}
              />
            )}
          </View>

          {/* ACTION BUTTONS */}
          <View
            style={{
              flexDirection: 'row',
              gap: 20,
              marginTop: 60,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                backgroundColor: Colors.IconLemonTwo,
                paddingVertical: 10,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
              onPress={() => navigation.navigate('WithdrawScreen')}
            >
              <Ionicons
                name="remove-circle-outline"
                size={20}
                color={Colors.Black}
              />
              <AppText style={{ color: Colors.Black, fontWeight: '600' }}>
                Withdraw
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.7)',
                paddingVertical: 10,
                borderRadius: 20,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
              }}
              onPress={() => navigation.navigate('RateCalculatorScreen')}
            >
              <Ionicons
                name="calculator-outline"
                size={20}
                color={Colors.White}
              />
              <AppText style={{ color: Colors.White }}>
                Rate Calculator
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default WalletCard;
