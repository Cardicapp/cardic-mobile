import Colors from 'CardicApp/src/theme/Colors';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import AppText, { AppBoldText } from '../AppText/AppText';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Values } from 'CardicApp/src/lib';
import AntDesign from 'react-native-vector-icons/AntDesign';



interface CardicCardThreeProps {
  top?: string;
  bottom?: string;
  image?: any;
  showIcon?: boolean;
}
const CardicCardThree: (props: CardicCardThreeProps) => React.ReactNode = ({
  top, bottom, image, showIcon = true
}) => {
  return <TouchableOpacity
    onPress={() => {
      // props.navigation.navigate('/wallet');
    }}
    style={{
      marginTop: heightPercentageToDP(2),
      // height: 96,
      width: '90%',
      backgroundColor: Colors.CardicGreyBgOne,
      alignSelf: 'center',
      flexDirection: 'row',
      paddingHorizontal: 15,
      paddingVertical: heightPercentageToDP(3.5),
      borderRadius: 4,
    }}>
    <View
      style={{
        height: heightPercentageToDP(4),
        aspectRatio: 1,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: image ? 'transparent' : Colors.Primary,
        // shadowColor: 'grey',
        // elevation: 5,
      }}>
      {image}
    </View>
    <View
      style={{
        marginLeft: 16,
      }}>
      <AppText
        style={{
          color: Colors.HomeBlack,
        }}>
        {top}
      </AppText>
      <AppBoldText
        style={{
          color: Colors.HomeBlack,
          fontSize: RFPercentage(3),
          marginTop: 3,
        }}>
        {bottom}
      </AppBoldText>
    </View>
    {
      showIcon ? (
        <AntDesign
          name="right"
          size={RFPercentage(2.5)}
          color={Colors.Primary}
          style={{
            marginLeft: 'auto',
            alignSelf: 'center',
          }} />
      ) : undefined
    }

  </TouchableOpacity>;
}


export default CardicCardThree;