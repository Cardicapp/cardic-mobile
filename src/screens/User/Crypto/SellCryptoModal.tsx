import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText, { AppBoldText } from '@/components/AppText/AppText';
import Colors from '@/theme/Colors';
import SimpleBackHeader from '@/components/SimpleBackHeader';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamList } from '../../../@types/navigation';

interface Props {
    visible: boolean;
    onClose: () => void;
    symbol: string;
}

const SellCryptoModal = ({ visible, onClose, symbol }: Props) => {
    const [sellAmount, setSellAmount] = useState('');
  const navigation = useNavigation<StackNavigationProp<ApplicationStackParamList>>();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <SimpleBackHeader text="" showBack />

                        <View style={styles.headerTitle}>
                            <Ionicons
                                name="logo-bitcoin"
                                size={18}
                                color="#F7931A"
                            />
                            <AppBoldText style={styles.title}>
                                How much do you want to sell?
                            </AppBoldText>
                        </View>
                    </View>

                    <AppText style={styles.subtitle}>
                        <AppText style={{ color: Colors.Primary }}>$1</AppText> is the minimum
                        sell amount accepted, your cardic wallet will be credited instantly
                    </AppText>

                    {/* YOU SELL */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <AppText>You Sell</AppText>
                            <AppText style={styles.usd}>$ USD</AppText>
                        </View>

                        <View style={styles.inputRow}>
                            <TouchableOpacity style={styles.maxBtn}>
                                <AppText style={styles.maxText}>
                                    Select Maximum
                                </AppText>
                            </TouchableOpacity>

                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="00.00"
                                value={sellAmount}
                                onChangeText={setSellAmount}
                            />
                        </View>

                        <AppText style={styles.available}>
                            Available - $0.00
                        </AppText>
                    </View>

                    {/* YOU GET */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <AppText>You Get</AppText>
                            <AppText style={styles.ngn}>₦ NGN</AppText>
                        </View>

                        <View style={styles.getBox}>
                            <AppBoldText style={styles.getValue}>
                                00.00
                            </AppBoldText>
                        </View>

                        <AppText style={styles.approx}>
                            approx - 0.00005 {symbol}
                        </AppText>
                    </View>

                    {/* INFO */}
                    <View style={styles.infoBox}>
                        <AppText style={styles.infoText}>
                            Crypto prices can fluctuate quickly. The amount you receive after
                            coin is sold is based on the current market rate at the time of
                            completing your transaction.
                        </AppText>
                    </View>

                    {/* BUTTON */}
                    <TouchableOpacity style={styles.sellBtn} onPress={() => navigation.navigate('CryptoTransactionPin')}>
                        <AppBoldText style={styles.sellText}>
                            Sell {symbol}
                        </AppBoldText>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default SellCryptoModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
    },

    container: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        minHeight: '90%',
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    title: {
        fontSize: 16,
    },

    subtitle: {
        width: '85%',
        fontSize: 13,
        color: Colors.Black,
        fontWeight: '600',
        marginVertical: 16,
        marginBottom: 16,
        alignSelf: 'center',
    },

    card: {
        backgroundColor: '#F1F1F1',
        borderColor: '#E0E0E0',
        borderWidth: 2,
        borderRadius: 14,
        padding: 14,
        marginBottom: 26,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    usd: {
        color: '#FF9500',
    },

    ngn: {
        color: Colors.Primary,
    },

    inputRow: {
        flexDirection: 'row',
        gap: 10,
    },

    maxBtn: {
        backgroundColor: '#CFFF3D',
        paddingHorizontal: 14,
        justifyContent: 'center',
        borderRadius: 10,
    },

    maxText: {
        fontSize: 12,
        fontWeight: '600',
    },

    input: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 44,
        textAlign: 'right',
        fontSize: 16,
    },

    available: {
        fontSize: 12,
        color: '#555',
        marginTop: 6,
        textAlign: 'right',
    },

    getBox: {
        backgroundColor: '#FFF',
        height: 44,
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },

    getValue: {
        fontSize: 16,
        textAlign: 'right',
    },

    approx: {
        fontSize: 12,
        color: '#555',
        marginTop: 6,
        textAlign: 'right',
    },

    infoBox: {
        backgroundColor: '#E9FBE9',
        borderColor: '#d1f8d1ff',
        borderWidth: 2,
        borderRadius: 10,
        padding: 12,
        marginBottom: 70,
    },

    infoText: {
        fontSize: 12,
        color: '#2E7D32',
    },

    sellBtn: {
        height: 54,
        backgroundColor: Colors.Primary,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },

    sellText: {
        color: '#FFF',
        fontSize: 16,
    },
});
