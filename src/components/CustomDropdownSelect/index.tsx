import React, { useState } from 'react';
import {
    View,
    Platform,
    StyleProp,
    ViewStyle,
    TextInputProps,
    KeyboardType,
    TouchableOpacity,
    TextStyle,
    StyleSheet,
} from 'react-native';
import {
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { TextInput } from 'react-native-gesture-handler';
import Colors from 'CardicApp/src/theme/Colors';
import Dimensions from 'CardicApp/src/theme/Dimensions';
import AppText, { defaultStyle } from '../AppText/AppText';
import Utils from 'CardicApp/src/lib/utils/Utils';
import DropdownSelect from 'react-native-input-select';

// @ts-ignore  -- onChange, value are incompatible
export interface CustomDropdownSelectProps {
    containerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    inputStyle?: StyleProp<TextStyle>;
    headText?: string;
    value: string;
    options: { label: string, value: string }[];
    onChange?: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    primaryColor?: string;
}

const CustomDropdownSelect = (props: CustomDropdownSelectProps) => {

    return (
        <View
            style={[
                {
                    alignItems: 'center',
                    marginBottom: 20,
                },
                props.containerStyle,
            ]}>
            <View
                style={{
                    width: '100%',
                    alignItems: 'flex-start',
                }}>
                {props.headText && (
                    <AppText
                        style={[
                            {
                                fontSize: Dimensions.headerDescription,
                                marginBottom: hp(1),
                                color: Colors.Label,
                            },
                            props.labelStyle,
                        ]}>
                        {props.headText}
                    </AppText>
                )}

                <View
                    style={{
                        width: '100%',
                    }}>
                    <DropdownSelect
                        disabled={props.disabled}
                        // @ts-ignore
                        dropdownStyle={
                            {
                                ...defaultStyle.root,
                                ...styles.inputRoot,
                                // @ts-ignore
                                ...(props.inputStyle ? props.inputStyle : {}),
                                ...{
                                    borderColor: '#CBCBCB',
                                },
                            }
                        }
                        placeholder={props.placeholder}
                        options={props.options}
                        selectedValue={props.value}
                        // @ts-ignore
                        onValueChange={(value) => props.onChange && props.onChange(value)}
                        primaryColor={props.primaryColor ?? 'green'}
                        placeholderStyle={{
                            color: Colors.PlaceHolder
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputRoot: {
        fontSize: RFPercentage(2),
        width: '100%',
        minHeight: Platform.OS == 'ios' ? hp(6) : undefined,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.BorderColor,
        color: Colors.Black,
        backgroundColor: Colors.InputBgTwo,
        paddingHorizontal: 10,
    },
});

export default CustomDropdownSelect;
