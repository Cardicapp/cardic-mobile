import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../../../theme/Colors';
import AppText, { AppBoldText } from '../../../../components/AppText/AppText';

const ChangePhoneNumberScreen = () => {
    const navigation = useNavigation();
    const [phone, setPhone] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={20} color={Colors.White} />
                </TouchableOpacity>
                <AppBoldText style={styles.headerTitle}>Change Phone Number</AppBoldText>
                <View style={{ width: 36 }} />
            </View>

            <View style={styles.content}>
                <AppText style={styles.label}>Enter your new phone number</AppText>
                <TextInput
                    style={styles.input}
                    placeholder="08012345678"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('OtpVerificationScreen' as never)}
                >
                    <AppBoldText style={styles.buttonText}>Proceed</AppBoldText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ChangePhoneNumberScreen;

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
    content: { flex: 1, padding: 20, paddingTop: 40 },
    label: { fontSize: 14, color: '#666', marginBottom: 15 },
    input: {
        borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
        padding: 15, fontSize: 16, backgroundColor: '#f9f9f9',
    },
    footer: { padding: 20 },
    button: {
        backgroundColor: Colors.Primary, height: 50, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16 },
});
