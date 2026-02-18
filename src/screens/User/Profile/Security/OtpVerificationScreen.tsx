import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../../../theme/Colors';
import AppText, { AppBoldText } from '../../../../components/AppText/AppText';

const OtpVerificationScreen = () => {
    const navigation = useNavigation();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigation.navigate('SuccessScreen' as never);
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={20} color={Colors.White} />
                </TouchableOpacity>
                <AppBoldText style={styles.headerTitle}>Verification</AppBoldText>
                <View style={{ width: 36 }} />
            </View>

            <View style={styles.content}>
                <AppText style={styles.label}>Enter the 4-digit code sent to your email/phone</AppText>
                <TextInput
                    style={styles.input}
                    placeholder="0000"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={otp}
                    onChangeText={setOtp}
                    textAlign="center"
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading || otp.length < 4}>
                    {loading ? <ActivityIndicator color="#fff" /> : <AppBoldText style={styles.buttonText}>Verify</AppBoldText>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default OtpVerificationScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, marginTop: 10,
    },
    backBtn: {
        width: 36, height: 36, borderRadius: 10, backgroundColor: '#000',
        alignItems: 'center', justifyContent: 'center',
    },
    headerTitle: { fontSize: 18 },
    content: { flex: 1, padding: 20, paddingTop: 40, alignItems: 'center' },
    label: { fontSize: 14, color: '#666', marginBottom: 30, textAlign: 'center' },
    input: {
        borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
        padding: 15, fontSize: 24, backgroundColor: '#f9f9f9',
        width: 150, letterSpacing: 10,
    },
    footer: { padding: 20 },
    button: {
        backgroundColor: Colors.Primary, height: 50, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16 },
});
