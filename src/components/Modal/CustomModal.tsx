import Colors from 'CardicApp/src/theme/Colors';
import React, { useState } from 'react';
import { Image, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import Modal from 'react-native-modal';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AppText, { AppBoldText } from '../AppText/AppText';
import ButtonOne from '../ButtonOne';
export interface CustomModalAction {
    text?: string,
    onPress?: () => void,
    containerStyle?: StyleProp<ViewStyle>,
    textStyle?: StyleProp<TextStyle>,
    element?: React.ReactNode,
    loading?: boolean,

}

interface Props {
    isVisible: boolean,
    onClose(): void,
    title?: string,
    content?: string,
    footer?: string,
    icon?: React.ReactNode,
    actions: CustomModalAction[],
    titleStyle?: StyleProp<TextStyle>,
    contentStyle?: StyleProp<TextStyle>,
    footerStyle?: StyleProp<TextStyle>,
    horizontal?: boolean,
    autoClose?: boolean,
}

const CustomModal = (props: Props) => {
    const {
        isVisible, onClose,
        title, content, footer, icon,
        actions, contentStyle, titleStyle, footerStyle, horizontal = false,
        autoClose = true,
    } = props;

    return (
        <Modal
            isVisible={isVisible}
            backdropColor="rgba(0,0,0, .2)"
            animationIn="fadeInUp"
            animationOut="fadeOut"
            onBackdropPress={onClose}
        >

            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View
                    style={{
                        width: wp(80),
                        borderRadius: 10,
                        paddingVertical: 20,
                        backgroundColor: Colors.White,
                        alignItems: 'center'
                    }}>

                    {
                        icon && (
                            <View style={{
                                marginTop: 20,
                                alignItems: 'center',
                            }}>
                                {
                                    icon
                                }
                            </View>
                        )
                    }



                    {
                        title && (<AppBoldText style={[{
                            paddingHorizontal: wp(5),
                            marginTop: 20,
                            fontSize: 18,
                            textAlign: 'center',
                            lineHeight: 25
                        }, titleStyle]}>
                            {title}
                        </AppBoldText>)
                    }
                    {
                        content && (
                            <AppText style={[{
                                // fontSize: 20,
                                marginVertical: 20,
                                textAlign: 'center',
                                paddingHorizontal: wp(10)
                            }, contentStyle]}>
                                {content}
                            </AppText>
                        )
                    }
                    {
                        footer && (
                            <AppBoldText style={[{
                                fontSize: 20,
                                marginTop: 5,
                                textAlign: 'center',
                            }, footerStyle]}>
                                {footer}
                            </AppBoldText>
                        )
                    }
                    <View style={{
                        flexDirection: horizontal ? 'row' : 'column',
                        marginTop: horizontal ? 20 : 0,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {
                            actions && actions.filter(act => act !== undefined).map((action, index) => <View key={index} style={{
                                marginHorizontal: horizontal ? 0 : 20,
                                marginTop: horizontal ? 0 : 10,
                                width: horizontal ? "40%" : '100%',
                                // backgroundColor: 'green',
                            }}>
                                {
                                    action.element ? action.element
                                        : <ButtonOne
                                            text={action ? action.text : "Submit"}
                                            onPress={() => {
                                                autoClose && onClose && onClose();
                                                action.onPress && action.onPress();
                                            }}
                                            containerStyle={[{ width: horizontal ? "90%" : '80%', }, action.containerStyle]}
                                            textStyle={action.textStyle}
                                            loading={action.loading}
                                        />
                                }

                            </View>)
                        }
                    </View>


                </View>
            </View>

        </Modal>
    );
}

export default CustomModal;