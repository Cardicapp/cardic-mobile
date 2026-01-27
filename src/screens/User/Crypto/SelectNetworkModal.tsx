import React from 'react';
import { StyleSheet, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import AppText, { AppBoldText } from '../../../components/AppText/AppText';
import Colors from '../../../theme/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

interface SelectNetworkModalProps {
    visible: boolean;
    onClose: () => void;
    asset: any;
}

const SelectNetworkModal = ({ visible, onClose, asset }: SelectNetworkModalProps) => {
    const navigation = useNavigation();

    // Mock networks based on asset
    const networks = [
        { id: '1', name: `${asset?.name} (${asset?.symbol})`, code: asset?.symbol },
        // Add dummy networks for demo if needed, usually BTC is just BTC
        // { id: '2', name: 'BEP20', code: 'BSC' }, 
        // { id: '3', name: 'ERC20', code: 'ETH' },
    ];

    const handleSelect = (network: any) => {
        onClose();
        // @ts-ignore
        navigation.navigate('ReceiveCryptoScreen', { asset, network });
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.backdrop} onPress={onClose} />

                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <AppBoldText style={styles.title}>Select Network</AppBoldText>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.warningBox}>
                        <Ionicons name="alert-circle-outline" size={20} color="#E09F1F" />
                        <AppText style={styles.warningText}>
                            Ensure the network you choose matches the sender’s network to avoid losing assets.
                        </AppText>
                    </View>

                    <AppText style={styles.label}>Choose Network</AppText>

                    <FlatList
                        data={networks}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.networkItem} onPress={() => handleSelect(item)}>
                                <AppText style={styles.networkName}>{item.name}</AppText>
                                <Ionicons name="chevron-forward" size={18} color="#666" />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default SelectNetworkModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: 300,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
    },
    warningBox: {
        backgroundColor: '#FFF8E6',
        padding: 12,
        borderRadius: 8,
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    warningText: {
        fontSize: 12,
        color: '#666',
        flex: 1,
        lineHeight: 18,
    },
    label: {
        fontSize: 14,
        color: '#888',
        marginBottom: 10,
    },
    networkItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    networkName: {
        fontSize: 16,
        color: '#000',
    },
});
