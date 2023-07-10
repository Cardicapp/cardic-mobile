import React from 'react';
import { TouchableOpacity, ActivityIndicator, View, StyleProp, TextStyle, ViewStyle, ActivityIndicatorProps } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import AppText from '../AppText/AppText';
import Dimensions from 'CardicApp/src/theme/Dimensions';
import Colors from 'CardicApp/src/theme/Colors';

interface Props {
    text: string,
    onPress(): void,
    loading?: boolean
    textStyle?: StyleProp<TextStyle>,
    containerStyle?: StyleProp<ViewStyle>,
    outerStyle?: StyleProp<ViewStyle>,
    disabled?: boolean,
    loaderProps?: ActivityIndicatorProps,
}
const ButtonOne = (props: Props) => {
    const { text, onPress, loading, textStyle, outerStyle, disabled = false, } = props;
    return (
        <TouchableOpacity
        disabled={disabled}
            style={[{

            }, outerStyle]}
            onPress={() => !loading && onPress()}
        >
            <View

                style={[{
                    width: "100%",
                    paddingVertical: Dimensions.buttonVPadding,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    backgroundColor: Colors.PrimaryBlack,
                }, props.containerStyle]}
            >

                {
                    loading ? (
                        <ActivityIndicator
                            size={20}
                            color={Colors.White}
                            {...props.loaderProps}
                        />
                    ) : (
                            <AppText
                                style={[{
                                    fontSize: RFPercentage(2.2),
                                    color: Colors.White,
                                }, textStyle]}
                            >
                                {text}
                            </AppText>
                        )
                }




            </View>
        </TouchableOpacity>
    );
}

export default ButtonOne;
