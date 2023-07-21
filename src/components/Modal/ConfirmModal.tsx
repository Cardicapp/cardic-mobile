import Colors from 'CardicApp/src/theme/Colors';
import React from 'react';
import { View } from 'react-native';
import Modal from 'react-native-modal';
import {  widthPercentageToDP as wp } from 'react-native-responsive-screen';
import AppText from '../AppText/AppText';
import ButtonOne from '../ButtonOne';
// import Colors from '../shared/Theme/Colors';
// import AppText from './AppText';
// import ButtonOne from './ButtonOne';
interface Props {
    isVisible: boolean,
    showCancel?: boolean,
    onProceed(): void,
    proceedText: string,
    cancelText?: string,
    onClose(): void,
    title?: string,
    content?: string,
    icon?: React.ReactNode,
    loading?: boolean,
}

const ConfirmModal = (props: Props) => {
    const {
        isVisible, onClose,
        proceedText, onProceed,
        title, content,
        cancelText, icon,
        showCancel = true,
        loading = false,

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
                        // height: 396,
                        width: wp(80),
                        borderRadius: 10,
                        paddingVertical: 10,
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
                        title && (<AppText style={{
                            paddingHorizontal: wp(15),
                            marginTop: 20,
                            fontSize: 18,
                            textAlign: 'center',
                            lineHeight: 25
                        }}>
                            {title}
                        </AppText>)
                    }
                    {
                        content && (
                            <AppText style={{
                                fontWeight: '700',
                                fontSize: 20,
                                marginTop: 20,
                                textAlign: 'center',
                                paddingHorizontal: wp(10)
                            }}>
                                {content}
                            </AppText>
                        )
                    }


                    <View style={{
                        paddingHorizontal: wp(10),
                        marginTop: 30,
                        width: '100%',
                    }}>
                        <ButtonOne
                            text={proceedText || "Continue"}
                            onPress={() => {
                                onProceed();
                            }}
                            containerStyle={{
                                backgroundColor: Colors.Primary,
                            }}
                            loading={loading}
                        />

                    </View>
                    {
                        showCancel && (
                            <View style={{
                                marginHorizontal: 20,
                                marginTop: 5,
                            }}>
                                <ButtonOne
                                    text={cancelText || "Cancel"}
                                    onPress={() => {
                                        onClose();
                                    }}
                                    containerStyle={{
                                        backgroundColor: Colors.White,
                                    }}
                                    textStyle={{
                                        color: Colors.SweetBlack,
                                    }}
                                />
                            </View>
                        )
                    }

                </View>
            </View>

        </Modal>
    );
}

export default ConfirmModal;