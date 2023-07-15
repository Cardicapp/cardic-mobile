import Colors from 'CardicApp/src/theme/Colors';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import AppText, { AppBoldText } from '../AppText/AppText';
import { Values } from 'CardicApp/src/lib';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Category } from 'CardicApp/src/types/category';

interface Props {
  name: string;
  rate?: string;
  cta?: string;
}

export default ({ name, rate, cta }: Props) => {
  return (
    <TouchableOpacity
      onPress={() => {
        // props.navigation.navigate('/wallet');
      }}
      style={{
        marginTop: heightPercentageToDP(1),
        // height: 96,
        width: '45%',
        // backgroundColor: Colors.CardicGreyBgOne,
        // alignSelf: 'center',
        // flexDirection: 'row',
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
          // borderRadius: 100,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.Primary,
        }}>
      </View>
      <View
        style={{
          justifyContent: 'center'
        }}>
        <AppText
          style={{
            color: Colors.HomeBlack,
          }}>
          {name}
        </AppText>
        {
          rate ?
            <AppBoldText
              style={{
                color: Colors.HomeBlack,
                fontSize: RFPercentage(2.8),
                marginTop: 3,
              }}>
              {rate}
            </AppBoldText> : undefined
        }
      </View>
      {
        cta ?
          <AppText
            style={{
              marginLeft: 'auto',
              alignSelf: 'center',
              color: Colors.CardicBlueOne
            }}
          >{cta}</AppText> : undefined
      }
    </TouchableOpacity>
  )
}