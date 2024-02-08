import Colors from 'CardicApp/src/theme/Colors';
import React from 'react';
import { Image, StyleProp, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import AppText, { AppBoldText } from '../AppText/AppText';
import { Values } from 'CardicApp/src/lib';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Category } from 'CardicApp/src/types/category';

interface Props {
  name: string;
  rate?: string;
  cta?: string;
  image?: string;
  onPress?: () => void;
  selected?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  ctaStyle?: StyleProp<TextStyle>;
  rateStyle?: StyleProp<TextStyle>;
  nameStyle?: StyleProp<TextStyle>;
  showImage?: boolean;
}

export default ({ name, rate, cta, image, onPress, selected, containerStyle, nameStyle, ctaStyle, rateStyle, showImage = true }: Props) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[{
        marginTop: heightPercentageToDP(1),
        // height: 96,
        width: '90%',
        backgroundColor: Colors.CardicGreyBgOne,
        alignSelf: 'center',
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: heightPercentageToDP(1),
        borderRadius: 4,
        borderWidth: selected ? 2 : 0,
        borderColor: selected ? Colors.Primary : 'transparent',
      }, containerStyle]}>
      {
        showImage ?
          <View
            style={{
              height: heightPercentageToDP(5),
              aspectRatio: 1,
              borderRadius: 100,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.Primary,
              overflow: 'hidden'
            }}>
            <Image
              source={{ uri: image }}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </View>
          : undefined
      }

      <View
        style={{
          marginLeft: showImage ? 16 : 0,
          justifyContent: 'center'
        }}>
        {
          name && <AppText
          style={[{
            color: Colors.HomeBlack,
          }, nameStyle]}>
          {name}
        </AppText>
        }
        {
          rate ?
            <AppBoldText
              style={[{
                color: Colors.HomeBlack,
                fontSize: RFPercentage(2.8),
                marginTop: 3,
              }, rateStyle]}>
              {rate}
            </AppBoldText> : undefined
        }
      </View>
      {
        cta ?
          <AppText
            style={[{
              marginLeft: 'auto',
              alignSelf: 'center',
              color: Colors.Primary
            }, ctaStyle]}
          >{cta}</AppText> : undefined
      }
    </TouchableOpacity>
  )
}