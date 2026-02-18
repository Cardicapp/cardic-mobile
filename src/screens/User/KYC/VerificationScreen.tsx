import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors from 'CardicApp/src/theme/Colors';
import { useNavigation } from '@react-navigation/native';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import { useRef } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { MainParamsList } from '../../../../@types/navigation';


type Method = 'email' | 'phone';
type Step = 'select' | 'phone' | 'otp';

const EmailPhoneVerificationScreen = () => {
    const navigation = useNavigation<StackNavigationProp<MainParamsList>>();
    const [method, setMethod] = useState<Method>('email');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const inputs = useRef<(TextInput | null)[]>([]);

    const [step, setStep] = useState<Step>('select');
    const [phone, setPhone] = useState('');


    const handleOtpChange = (value: string, index: number) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputs.current[index + 1]?.focus();
        }

        if (!value && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            {/* BACK BUTTON */}
            <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={18} color={Colors.White} />
            </TouchableOpacity>
            {/* HEADER */}
            <Text style={styles.title}>Email and Phone Number Verification</Text>
            <Text style={styles.subtitle}>
                Verify your identity by submitting your ID number, for secure
                verification.
            </Text>

            {/* METHOD SELECTION */}
            {step === 'select' && (
                <View style={styles.cardWrapper}>
                    {/* EMAIL */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            setMethod('email');
                        }}
                    >
                        <View style={styles.cardLeft}>
                            <Ionicons name="mail-outline" size={22} color={Colors.Black} />
                            <Text style={styles.cardText}>Email Verification</Text>
                        </View>

                        <Ionicons
                            name={
                                method === 'email'
                                    ? 'radio-button-on'
                                    : 'radio-button-off'
                            }
                            size={22}
                            color={method === 'email' ? Colors.Primary : Colors.BorderGrey}
                        />
                    </TouchableOpacity>

                    {/* PHONE */}
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => {
                            setMethod('phone');
                        }}
                    >
                        <View style={styles.cardLeft}>
                            <Ionicons name="call-outline" size={22} color={Colors.Black} />
                            <Text style={styles.cardText}>Phone Number Verification</Text>
                        </View>

                        <Ionicons
                            name={
                                method === 'phone'
                                    ? 'radio-button-on'
                                    : 'radio-button-off'
                            }
                            size={22}
                            color={method === 'phone' ? Colors.Primary : Colors.BorderGrey}
                        />
                    </TouchableOpacity>
                </View>
            )}

            {/* EMAIL CONTENT */}
            {/* {method === 'email' && step === 'select' && (
                <View style={styles.content}>
                    <TouchableOpacity style={styles.primaryBtn}>
                        <Text style={styles.primaryBtnText}>
                            Send Verification Email
                        </Text>
                    </TouchableOpacity>
                </View>
            )} */}

            {/* PHONE FORM */}
            {method === 'phone' && step === 'select' && (
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Verify Phone Number</Text>
                    <AppText>A code will be sent to your number</AppText>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter phone number"
                        keyboardType="phone-pad"
                        value={phone}
                        onChangeText={setPhone}
                    />

                    <TouchableOpacity
                        style={styles.primaryBtn}
                        onPress={() => setStep('otp')}
                    >
                        <Text style={styles.primaryBtnText}>Send OTP</Text>
                    </TouchableOpacity>
                </View>
            )}


            {/* OTP SCREEN */}
            {step === 'otp' && (
                <View style={styles.content}>
                    <Text style={styles.sectionTitle}>Verify OTP</Text>
                    <Text style={styles.infoText}>
                        Please enter the 6-digit code sent to your phone number.
                    </Text>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={ref => (inputs.current[index] = ref)}
                                style={styles.otpInput}
                                keyboardType="number-pad"
                                maxLength={1}
                                value={digit}
                                onChangeText={value => handleOtpChange(value, index)}
                            />
                        ))}
                    </View>

                    <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('IdentityVerificationScreen')}>
                        <Text style={styles.primaryBtnText}>Verify OTP</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.resend}>
                        <AppText>Didn't get a code?  <Text style={styles.resendText}>Resend</Text> </AppText>

                    </TouchableOpacity>
                </View>
            )}

        </SafeAreaView>
    );
};

export default EmailPhoneVerificationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
        padding: 20,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: Colors.Black,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    title: {
        fontSize: RFPercentage(2.8),
        fontWeight: '700',
        color: Colors.Black,
        marginBottom: 8,
        marginTop: 50,
    },

    subtitle: {
        fontSize: RFPercentage(1.9),
        color: Colors.GreyText,
        marginBottom: 30,
    },

    cardWrapper: {
        gap: 15,
    },

    card: {
        backgroundColor: Colors.CardGrey,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    cardText: {
        fontSize: RFPercentage(2),
        fontWeight: '600',
        color: Colors.Black,
    },

    content: {
        marginTop: 30,
    },

    sectionTitle: {
        fontSize: RFPercentage(2.3),
        fontWeight: '700',
        marginBottom: 12,
        color: Colors.Black,
    },

    infoText: {
        fontSize: RFPercentage(1.8),
        color: Colors.GreyText,
        marginBottom: 20,
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: Colors.BorderGrey,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: RFPercentage(1.9),
        marginBottom: 20,
    },

    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
    },

    otpInput: {
        width: 48,
        height: 52,
        borderWidth: 1,
        borderColor: Colors.BorderGrey,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: RFPercentage(2.4),
        fontWeight: '700',
        color: Colors.Black,
    },

    primaryBtn: {
        backgroundColor: Colors.Primary,
        height: 54,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },

    primaryBtnText: {
        color: Colors.White,
        fontSize: RFPercentage(2),
        fontWeight: '700',
    },

    resend: {
        marginTop: 15,
        alignItems: 'center',
    },

    resendText: {
        color: Colors.Primary,
        fontSize: RFPercentage(1.7),
        fontWeight: '600',
    },
});
