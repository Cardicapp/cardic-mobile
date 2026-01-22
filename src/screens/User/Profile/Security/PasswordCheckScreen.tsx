import React, { useState } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { StackActions, useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../../../theme/Colors';
import AppText, { AppBoldText } from '../../../../components/AppText/AppText';
import { RFPercentage } from 'react-native-responsive-fontsize';

const PasswordCheckScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { nextScreen } = route.params as any;
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleConfirm = () => {
        if (!password) {
            setError('Please enter your password');
            return;
        }
        setLoading(true);
        // Mock verification
        setTimeout(() => {
            setLoading(false);
            navigation.dispatch(StackActions.replace(nextScreen as string));
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={20} color={Colors.White} />
                </TouchableOpacity>
                {/* <AppBoldText style={styles.headerTitle}>Confirm Password</AppBoldText> */}
                <View style={{ width: 36 }} />
            </View>

            <View style={styles.content}>
                <AppBoldText style={styles.headerTitle}>Confirm Password</AppBoldText>  
                <AppText style={styles.label}>Password</AppText>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={(t) => {
                        setPassword(t);
                        setError('');
                    }}
                />
                {!!error && <AppText style={styles.error}>{error}</AppText>}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.button} onPress={handleConfirm} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <AppBoldText style={styles.buttonText}>Confirm</AppBoldText>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default PasswordCheckScreen;

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
    headerTitle: { fontSize: 18, marginBottom: 40 },
    content: { flex: 1, padding: 20, paddingTop: 40 },
    label: { fontSize: 14, color: '#666', marginBottom: 5, fontWeight: 'bold' },
    input: {
        borderWidth: 1, borderColor: '#ddd', borderRadius: 10,
        padding: 15, fontSize: 16, backgroundColor: '#f9f9f9',
    },
    error: { color: 'red', marginTop: 10, fontSize: 12 },
    footer: { padding: 20 },
    button: {
        backgroundColor: Colors.Primary, height: 50, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16 },
});
