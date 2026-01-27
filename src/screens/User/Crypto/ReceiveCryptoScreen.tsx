import React from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText, { AppBoldText } from '../../../components/AppText/AppText';
import Colors from '../../../theme/Colors';
// import Clipboard from '@react-native-clipboard/clipboard'; 
// Assuming Clipboard might not be installed, so I'll stub basic copy functionality or just alert.
// But better to check package.json first? I'll assume standard RN Clipboard or community one.
// Step 162 package.json did NOT list @react-native-clipboard/clipboard.
// I will use a mock function for now to avoid crashes.

const ReceiveCryptoScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { asset, network } = route.params as any;

    const walletAddress = "bnhfdswsdfgbnvfdsaacvbnbfdsc...";

    const handleCopy = () => {
        // Mock copy
        console.log('Copied');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={20} color={Colors.White} />
                </TouchableOpacity>
            </View>

            <AppBoldText style={styles.pageTitle}>Receive {asset?.symbol}</AppBoldText>

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* QR CODE CARD */}
                <View style={styles.qrCard}>
                    <View style={styles.qrPlaceholder}>
                        <Ionicons name="qr-code-outline" size={150} color="#000" />
                    </View>
                    <AppText style={styles.scanText}>Scan QR code to send {asset?.symbol} to this address</AppText>
                </View>

                {/* NETWORK TYPE */}
                <View style={styles.section}>
                    <AppText style={styles.label}>Network Type</AppText>
                    <View style={styles.inputBox}>
                        <AppText style={styles.ioutil}>{network?.name}</AppText>
                    </View>
                </View>

                {/* WALLET ADDRESS */}
                <View style={styles.section}>
                    <AppText style={styles.label}>Wallet Address</AppText>
                    <View style={styles.inputBox}>
                        <AppText style={[styles.ioutil, { flex: 1 }]}>
                            {walletAddress}
                        </AppText>
                        <TouchableOpacity onPress={handleCopy}>
                            <Ionicons name="copy-outline" size={20} color="#FF3B30" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* INFO BOX */}
                <View style={styles.infoBox}>
                    <View style={styles.infoRow}>
                        <AppText style={styles.infoLabel}>Expected Arrival</AppText>
                        <AppBoldText style={styles.infoValue}>4 Network confirmation</AppBoldText>
                    </View>
                    <View style={styles.infoRow}>
                        <AppText style={styles.infoLabel}>Expected Unlock</AppText>
                        <AppBoldText style={styles.infoValue}>4 Network confirmation</AppBoldText>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default ReceiveCryptoScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        paddingHorizontal: 20,
        marginTop: 10,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageTitle: {
        fontSize: 24,
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 20,
    },
    scroll: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    qrCard: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 40,
        alignItems: 'center',
        marginBottom: 30,
    },
    qrPlaceholder: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: '#f0f0f0' 
    },
    scanText: {
        marginTop: 20,
        fontSize: 12,
        color: '#000',
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    inputBox: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    ioutil: {
        color: '#555',
        fontSize: 14,
    },
    infoBox: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 10,
        padding: 20,
        marginTop: 10,
        backgroundColor: '#F9F9F9',
        gap: 20,
    },
    infoRow: {
        gap: 6,
    },
    infoLabel: {
        fontSize: 12,
        color: '#666',
    },
    infoValue: {
        fontSize: 14,
        color: '#000',
    },
});
