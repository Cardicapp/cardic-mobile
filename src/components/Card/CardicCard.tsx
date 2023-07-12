import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Colors from 'CardicApp/src/theme/Colors';
import { AppBoldText } from '../AppText/AppText';



interface CardicCardProps {
    text: string,
    description?: string,
    icon?: any,
    onPress?: () => void,
}
const CardicCard = (props: CardicCardProps) => {
    const {
        text,
        icon
    } = props;
    return (
        <TouchableWithoutFeedback
            onPress={() => props.onPress && props.onPress()}


        >
            <View
                style={{
                    width: wp(45),
                    marginHorizontal: 5,
                    borderRadius: 5,
                    backgroundColor: Colors.White,
                    shadowColor: 'grey',
                    shadowOffset: {
                        height: 0,
                        width: 0,
                    },
                    elevation: 2,
                    shadowOpacity: .3,
                    shadowRadius: 4,
                    padding: 10
                }}>
                <View
                    style={{
                        height: heightPercentageToDP(6),
                        aspectRatio: 1,
                        borderRadius: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: Colors.CardicGreyBgOne,
                        shadowColor: 'grey',
                        shadowOpacity: .3,
                        shadowRadius: 3,
                        elevation: 2,
                        marginTop: 20,
                    }}>
                    {
                        icon && icon
                    }
                </View>
                {
                    text && (
                        <AppBoldText
                            style={{
                                marginTop: 20,
                                fontSize: RFPercentage(2),
                                marginLeft: 5,
                                color: Colors.Primary,
                            }}>{text}</AppBoldText>
                    )
                }

            </View>
        </TouchableWithoutFeedback>
    );
}


export default CardicCard;