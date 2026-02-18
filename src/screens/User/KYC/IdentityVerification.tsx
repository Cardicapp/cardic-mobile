import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from 'CardicApp/src/theme/Colors';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import { useNavigation } from '@react-navigation/native';


type Method = 'bank' | 'nin';

const IdentityVerificationScreen = () => {
    const [method, setMethod] = useState<Method>('bank');
    const navigation = useNavigation();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bvnOrNin, setBvnOrNin] = useState('');
    const [dob, setDob] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={18} color={Colors.White} />
            </TouchableOpacity>
            {/* HEADER */}
            <Text style={styles.title}>Identity Verification</Text>
            <Text style={styles.subtitle}>
                Verify your identity using your personal details
            </Text>

            {/* TOGGLE */}
            <View style={styles.toggleRow}>
                <TouchableOpacity
                    style={[styles.toggleBtn, method === 'bank' && styles.activeToggle]}
                    onPress={() => setMethod('bank')}
                >
                    <Ionicons
                        name="card-outline"
                        size={18}
                        color={method === 'bank' ? Colors.White : Colors.Black}
                    />
                    <Text
                        style={[
                            styles.toggleText,
                            method === 'bank' && styles.activeToggleText,
                        ]}
                    >
                        Bank Verification
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.toggleBtn, method === 'nin' && styles.activeToggle]}
                    onPress={() => setMethod('nin')}
                >
                    <Ionicons
                        name="id-card-outline"
                        size={18}
                        color={method === 'nin' ? Colors.White : Colors.Black}
                    />
                    <Text
                        style={[
                            styles.toggleText,
                            method === 'nin' && styles.activeToggleText,
                        ]}
                    >
                        NIN Verification
                    </Text>
                </TouchableOpacity>
            </View>

            {/* FORM */}
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>
                    {method === 'bank' ? 'Bank Verification' : 'National Identity Number'}
                </Text>

                {/* FIRST & LAST NAME */}
                <View>
                    <AppBoldText style={styles.label}>Full Name</AppBoldText>
                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                            keyboardType="default"
                            maxLength={15}
                        />

                        <TextInput
                            style={[styles.input, styles.halfInput]}
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>
                    <AppText style={styles.label1}>Enter according to how it is on your ID</AppText>

                </View>

                {/* BVN OR NIN */}
                <AppBoldText style={styles.label}>Enter BVN or NIN</AppBoldText>
                <TextInput
                    style={styles.input}
                    placeholder={method === 'bank' ? 'Enter BVN' : 'Enter NIN'}
                    keyboardType="number-pad"
                    maxLength={method === 'bank' ? 11 : 11}
                    value={bvnOrNin}
                    onChangeText={setBvnOrNin}
                />

                {/* DATE OF BIRTH */}
                <AppBoldText style={styles.label}>Date of Birth</AppBoldText>

                <TextInput
                    style={styles.input}
                    placeholder="Date of Birth (DD/MM/YYYY)"
                    value={dob}
                    onChangeText={setDob}
                />

                <TouchableOpacity style={styles.primaryBtn}>
                    <Text style={styles.primaryBtnText}>
                        {method === 'bank' ? 'Verify BVN' : 'Verify NIN'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default IdentityVerificationScreen;

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
        marginBottom: 50,
    },

    title: {
        fontSize: RFPercentage(2.8),
        fontWeight: '700',
        color: Colors.Black,
    },

    subtitle: {
        fontSize: RFPercentage(1.9),
        color: Colors.GreyText,
        marginTop: 5,
    },

    toggleRow: {
        flexDirection: 'row',
        marginTop: 25,
        gap: 10,
    },

    toggleBtn: {
        flex: 1,
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.BorderGrey,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },

    activeToggle: {
        backgroundColor: Colors.Primary,
        borderColor: Colors.Primary,
    },

    toggleText: {
        fontSize: RFPercentage(1.7),
        color: Colors.Black,
        fontWeight: '600',
    },

    activeToggleText: {
        color: Colors.White,
    },

    content: {
        marginTop: 35,
    },

    sectionTitle: {
        fontSize: RFPercentage(2.3),
        fontWeight: '700',
        marginBottom: 15,
        color: Colors.Black,
    },

    label: {
        fontSize: RFPercentage(1.9),
        color: Colors.Black,
        marginBottom: 5,
    },
    label1: {
        fontSize: RFPercentage(1.9),
        color: Colors.GreyText,
        marginTop: -15,
        marginBottom: 15,
    },

    row: {
        flexDirection: 'row',
        gap: 10,
    },

    input: {
        height: 52,
        borderWidth: 1,
        borderColor: Colors.BorderGrey,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: RFPercentage(1.9),
        marginBottom: 15,
    },

    halfInput: {
        flex: 1,
    },

    primaryBtn: {
        backgroundColor: Colors.Primary,
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    primaryBtnText: {
        color: Colors.White,
        fontSize: RFPercentage(2),
        fontWeight: '700',
    },
});
