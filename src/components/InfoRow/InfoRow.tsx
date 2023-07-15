import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native';
import AppText from '../AppText/AppText';


interface InfoRowProps {
    title: string;
    value: string;
    containerStyle?: StyleProp<ViewStyle>;
}
const InfoRow = ({ title, value, containerStyle }: InfoRowProps) => {
    return (
        <View
            style={[{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 10,
                marginBottom: 5,
            }, containerStyle]}>
            <AppText>{title}</AppText>
            <AppText>{value}</AppText>
        </View>
    )
}

export default InfoRow;