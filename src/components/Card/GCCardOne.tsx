import Colors from 'CardicApp/src/theme/Colors';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import AppText, { AppBoldText } from '../AppText/AppText';
import { Values } from 'CardicApp/src/lib';
import { RFPercentage } from 'react-native-responsive-fontsize';


export default () => {
    return(
        <TouchableOpacity
              onPress={() => {
                // props.navigation.navigate('/wallet');
              }}
              style={{
                marginTop: heightPercentageToDP(1),
                // height: 96,
                width: '90%',
                backgroundColor: Colors.CardicGreyBgOne,
                alignSelf: 'center',
                flexDirection: 'row',
                paddingHorizontal: 15,
                paddingVertical: heightPercentageToDP(1),
                borderRadius: 4,
              }}>
              <View
                style={{
                  height: heightPercentageToDP(5),
                  aspectRatio: 1,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Colors.Primary,
                }}>
              </View>
              <View
                style={{
                  marginLeft: 16,
                }}>
                <AppText
                  style={{
                    color: Colors.HomeBlack,
                  }}>
                  Amazon Gift Card
                </AppText>
                <AppBoldText
                  style={{
                    color: Colors.HomeBlack,
                    fontSize: RFPercentage(3),
                    marginTop: 3,
                  }}>
                  {Values.NairaSymbol}550/{Values.DollarSymbol}1
                  {/* {Utils.currencyFormat(wallet.balance || 0, 2)} */}
                </AppBoldText>
              </View>

              <AppText
              style={{
                marginLeft: 'auto',
                alignSelf: 'center',
                color: Colors.CardicBlueOne
              }}
              >Trade</AppText>
            </TouchableOpacity>
    )
}