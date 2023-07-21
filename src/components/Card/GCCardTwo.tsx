import Colors from 'CardicApp/src/theme/Colors';
import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import AppText, { AppBoldText } from '../AppText/AppText';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface Props {
  top: string;
  bottom?: string;
  image?: string;
  onPress?: () => void;
}

export default ({ top, bottom, image, onPress }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginTop: heightPercentageToDP(1),
        width: '45%',
        alignItems: 'center',
        marginLeft: widthPercentageToDP(3.3),
        paddingHorizontal: 15,
        paddingVertical: heightPercentageToDP(1),
        borderRadius: 4,
      }}>
      <View
        style={{
          height: heightPercentageToDP(15),
          aspectRatio: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.Primary,
        }}>
          <Image  
          source={{uri: image}}
          style={{
            height: '100%',
            width: '100%',
          }}
          />
      </View>
      <View
        style={{
          justifyContent: 'center'
        }}>
        <AppText
          style={{
            color: Colors.HomeBlack,
          }}>
          {top}
        </AppText>
        {
          bottom ?
            <AppBoldText
              style={{
                color: Colors.HomeBlack,
                fontSize: RFPercentage(2.5),
                marginTop: 1,
                alignSelf: 'center',
              }}>
              {bottom}
            </AppBoldText> : undefined
        }
      </View>
    </TouchableOpacity>
  )
}