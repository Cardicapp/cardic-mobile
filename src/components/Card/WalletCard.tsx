import Colors from 'CardicApp/src/theme/Colors';
import React, { useState } from 'react';
import { StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import AppText, { AppBoldText } from '../AppText/AppText';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Values } from 'CardicApp/src/lib';
import Entypo from 'react-native-vector-icons/Entypo';



interface CardicCardThreeProps {
  top?: string;
  bottom?: string;
  showIcon?: boolean;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>,
  icon?: React.ReactNode,
}
const WalletCard: (props: CardicCardThreeProps) => React.ReactNode = ({
  top, bottom, showIcon = true, onPress, containerStyle
}) => {
  const [open, setOpen] = useState(false);
  return <TouchableOpacity
    onPress={onPress}
    style={[{
      marginTop: heightPercentageToDP(2),
      // height: 96,
      width: '90%',
      backgroundColor: Colors.CardicGreyBgOne,
      alignSelf: 'center',
      flexDirection: 'row',
      paddingHorizontal: 15,
      paddingVertical: heightPercentageToDP(3.5),
      borderRadius: 10,
    }, containerStyle]}>
    <View
      style={{
        marginLeft: 16,
      }}>
      <AppText
        style={{
          color: Colors.White,
        }}>
        {top}
      </AppText>
      <AppBoldText
        style={{
          color: Colors.White,
          fontSize: RFPercentage(3),
          marginTop: 3,
        }}>
        {open ? bottom : '*******'}
      </AppBoldText>
    </View>
    {
      showIcon ?
        <Entypo
          onPress={() => {
            setOpen(!open)
          }}
          name={open ? 'eye' : 'eye-with-line'}
          size={RFPercentage(2.8)}
          color={Colors.White}
          style={{
            marginLeft: 'auto',
            alignSelf: 'center',
          }} /> : undefined
    }

  </TouchableOpacity>;
}


export default WalletCard;