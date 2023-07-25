import React, { ReactNode, useEffect, useState } from 'react';
import {
  Platform,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
// import RootNavigator from '../RootNavigator';
import Entypo from 'react-native-vector-icons/Entypo';
import { connect } from 'react-redux';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Utils from 'CardicApp/src/lib/utils/Utils';
import Colors from 'CardicApp/src/theme/Colors';
import { AppBoldText } from '../AppText/AppText';
import { useNavigation, useNavigationContainerRef } from '@react-navigation/native';

interface Props {
  text?: string;
  showBack?: boolean;
  showMenu?: boolean;
  showDefaultActions?: boolean;
  actions?: ReactNode[];
  centered?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  textContainerStyle?: StyleProp<ViewStyle>;
  toggleMenu?: () => void;
  // notifications: any[];
}
const SimpleBackHeader = (props: Props) => {
  const {
    showBack = true,
    showMenu = false,
    actions,
    centered = true,
    text = '',
    showDefaultActions = false,
    iconColor = '',
  } = props;

  const textString = Utils.shortenText(text, 27);
  const bgColor = props.style?.backgroundColor ?? "white"

  //   const [hasUnread, setHasUnread] = useState(false);

  //   useEffect(() => {
  // for (let i = 0; i < props.notifications.length; i++) {
  //   const not = props.notifications[i];
  //   if (not['is_read'] == false) {
  //     setHasUnread(true);
  //     break;
  //   }
  // }
  //   }, [props.notifications]);

  const navigation = useNavigation();

  return (
    <View
      style={[
        {
          backgroundColor: Colors.White,
          paddingBottom: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 15,
          marginBottom: 20,
          paddingLeft: 10,
          paddingRight: 10,
        },
        props.style,
      ]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {showBack == false && showMenu ? (
          <TouchableOpacity
            style={{
              top: 0,
              zIndex: 2
            }}
            onPress={() => {
              // props.toggleMenu();
            }}>
            <Entypo name="menu" color={iconColor || Colors.Primary} size={RFPercentage(3.5)} />
          </TouchableOpacity>
        ) : undefined}
        {showBack ? (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <AntDesign
              name="left"
              color={iconColor || Colors.Primary}
              size={RFPercentage(2.8)}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {centered == false ? (
          <View
            style={[
              {
                marginLeft: widthPercentageToDP(8),
                marginTop: 3,
                // backgroundColor: 'red'
                // width: '70%',
              },
              props.textContainerStyle,
            ]}>
            {props.text && (
              <AppBoldText
                style={[
                  {
                    fontSize: RFPercentage(2.4),
                  },
                  props.textStyle,
                ]}>
                {textString}
              </AppBoldText>
            )}
          </View>
        ) : (
          <View />
        )}
      </View>

      {centered ? (
        <View
          style={{
            // position: 'absolute',
            // width: widthPercentageToDP(100),
            // top: Platform.OS == 'android' ? '20%' : '30%',
            // zIndex: 1,
            marginRight: 'auto',
            marginLeft: 'auto',
            // backgroundColor: bgColor
          }}>
          {props.text && (
            <AppBoldText
              style={[
                {
                  fontSize: RFPercentage(2.4),
                  textAlign: 'center',
                },
                props.textStyle,
              ]}>
              {textString}
            </AppBoldText>
          )}
        </View>
      ) : (
        <View />
      )}

      {actions != undefined && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          {actions}
        </View>
      )}
      {showDefaultActions && (!actions || actions.length == 0) ? (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            // backgroundColor: 'red',
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              //   RootNavigator.push('/profile-page');
            }}>
            <FontAwesome5
              style={{
                marginRight: '2%',
              }}
              name="user-circle"
              size={RFPercentage(2.8)}
            />
          </TouchableWithoutFeedback>

          {/* <NotificationIcon
            onPress={() => RootNavigator.push('/notifications')}
            // @ts-ignore
            iconProps={{
              size: RFPercentage(2.8),
            }}
            showUnread={hasUnread}
          /> */}
        </View>
      ) : undefined}
    </View>
  );
};



export default SimpleBackHeader;
