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

// @ts-ignore  -- onChange, value are incompatible
export interface TextInputOneProps extends TextInputProps {
    containerStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    inputStyle?: StyleProp<TextStyle>;
    headText?: string;
    value: string;
    inputRef?: (ref: TextInput) => void | undefined;
    onChange?: (value: string) => void;
    onChangeMaskText?: (formatted: string, extracted?: string) => void;
    keyboardType?: KeyboardType;
    onSubmitEditing?: () => void;
    maxLength?: number;
    secureTextEntry?: boolean;
    editable?: boolean;
    icon?: any;
    onPressIcon?: () => void;
    placeholder?: string;
    mask?: string;
    autoFocus?: boolean;
    multiline?: boolean;
    numberOfLines?: number;
    formatAmount?: boolean;
}

const TextInputOne = (props: TextInputOneProps) => {
    const { formatAmount = false, } = props;
    const [active, setActive] = useState(false);
    // @ts-ignore
    let amount = parseFloat(props.value)//.format();
    // @ts-ignore
    if (amount == 'NaN') amount = '';
    else amount = `${amount}`;


    return (
        <View
            style={[
                {
                    alignItems: 'center',
                    marginTop: 20,
                    marginHorizontal: 20,
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
                    
                        <TextInput
                            ref={props.inputRef}
                            value={formatAmount ? amount : props.value}
                            onFocus={() => setActive(true)}
                            onBlur={() => setActive(false)}
                            onChangeText={(text) => {
                                if (formatAmount) {
                                    let value = Utils.stripString(text, ',')
                                    props.onChange && props.onChange(value);
                                } else {
                                    props.onChange && props.onChange(text);
                                }
                            }}
                            keyboardType={props.keyboardType}
                            placeholder={props.placeholder}
                            onSubmitEditing={props.onSubmitEditing}
                            style={[
                                defaultStyle.root,
                                styles.inputRoot,
                                props.inputStyle,
                                active
                                    ? {
                                        borderColor: '#7594FB',
                                    }
                                    : {
                                        borderColor: '#CBCBCB',
                                    },
                            ]}
                            placeholderTextColor={Colors.PlaceHolder}
                            maxLength={props.maxLength}
                            secureTextEntry={props.secureTextEntry}
                            editable={props.editable}
                            autoFocus={props.autoFocus}
                            multiline={props.multiline}
                            numberOfLines={props.numberOfLines}
                        />

                    {props.icon && (
                        <TouchableOpacity
                            style={{
                                position: 'absolute',
                                right: 10,
                                top: '30%',
                            }}
                            onPress={() => {
                                props.onPressIcon && props.onPressIcon();
                            }}>
                            {props.icon}
                        </TouchableOpacity>
                    )}
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
        borderRadius: 2,
        color: Colors.Black,
        backgroundColor: Colors.GreyOne,
        paddingHorizontal: 10,
    },
});

export default TextInputOne;
