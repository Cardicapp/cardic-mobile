import Colors from 'CardicApp/src/theme/Colors';
import React from 'react';
import {Text, StyleSheet, StyleProp, TextStyle, Platform} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

export const RegularFontFamily = "Raleway-Regular";
export const BoldFontFamily = "Raleway-Bold";
interface Props {
    children: any,
    style?: StyleProp<TextStyle>,
    props?: any;
}
const AppText = ({children, style, props } : Props) => (
    <Text style={[defaultStyle.root, style,]} {...props}>
        {children}
    </Text>
);

export default AppText;


export const AppBoldText = ({children, style, props } : Props) => (
    <Text style={[defaultStyle.bold, style,]} {...props}>
        {children}
    </Text>
);

const style: StyleProp<TextStyle> = {
    color: Colors.TextPrimary,
    fontSize: RFPercentage(Platform.OS == 'android' ? 1.8 : 1.6),
    letterSpacing: .3,
}

export const defaultStyle = StyleSheet.create({
    root: {
        fontWeight: '400',
        fontFamily: RegularFontFamily,
        ...style,
    },
    bold: {
        fontWeight: '500',
        fontFamily: BoldFontFamily,
        ...style,
    },
});