import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import AppText, { AppBoldText } from '@/components/AppText/AppText';
import SimpleBackHeader from '@/components/SimpleBackHeader';
import Colors from '@/theme/Colors';
import File from 'CardicApp/src/theme/assets/images/File.png';

import { MainParamsList } from '@/@types/navigation';
import SellCryptoModal from './SellCryptoModal';
import SelectNetworkModal from './SelectNetworkModal';

type RouteProps = RouteProp<MainParamsList, 'CryptoAsset'>;

const CryptoAssetScreen = () => {
    const route = useRoute<RouteProps>();
    const navigation = useNavigation();
    const { asset } = route.params;
    const [showSellModal, setShowSellModal] = React.useState(false);
    const [showReceiveModal, setShowReceiveModal] = React.useState(false);


    return (
        <SafeAreaView style={styles.container}>
            <SimpleBackHeader text="" showBack />

            {/* TITLE */}
            <AppBoldText style={styles.title}>
                {asset.symbol === 'BTC' ? 'Bitcoin' : asset.name}
            </AppBoldText>

            {/* BALANCE CARD */}
            <View style={[styles.balanceCard, { borderColor: asset.border }]}>
                <View style={styles.balanceHeader}>
                    <Image source={asset.image} style={styles.coinIcon} />
                    <AppText style={styles.balanceLabel}>
                        {asset.symbol} Balance
                    </AppText>
                </View>

                <View style={styles.balanceRow}>
                    <View>
                        <AppBoldText style={styles.cryptoAmount}>
                            0.0000
                        </AppBoldText>
                        <AppText style={styles.fiatAmount}>
                            $0.00
                        </AppText>
                    </View>

                    <View style={styles.priceBox}>
                        <AppBoldText style={styles.price}>
                            {asset.price}
                        </AppBoldText>

                        <View style={styles.percentRow}>
                            <Ionicons
                                name="caret-up"
                                size={14}
                                color="#2DBD5F"
                            />
                            <AppText style={styles.percent}>
                                (0%)
                            </AppText>
                        </View>
                    </View>
                </View>
            </View>

            {/* ACTION BUTTONS */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => setShowSellModal(true)}>
                    <Ionicons
                        name="arrow-up-circle-outline"
                        size={20}
                        color="#FF3B30"
                    />
                    <AppText style={styles.actionText}>
                        Sell
                    </AppText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} onPress={() => setShowReceiveModal(true)}>
                    <Ionicons
                        name="arrow-down-circle-outline"
                        size={20}
                        color="#2DBD5F"
                    />
                    <AppText style={styles.actionText}>
                        Receive
                    </AppText>
                </TouchableOpacity>
            </View>

            {/* TRANSACTIONS TAB */}
            <TouchableOpacity style={styles.transactionsTab}>
                <AppText style={styles.transactionsText}>
                    Transactions
                </AppText>
            </TouchableOpacity>

            {/* EMPTY STATE */}
            <View style={styles.emptyState}>
                <Image
                    source={File}
                    style={styles.folderImage}
                />

                <AppBoldText style={styles.emptyTitle}>
                    No completed trade
                </AppBoldText>

                <AppText style={styles.emptySub}>
                    Completed crypto trades will appear here
                </AppText>
            </View>

            <SellCryptoModal
                visible={showSellModal}
                onClose={() => setShowSellModal(false)}
                symbol="BTC"
            />

            <SelectNetworkModal
                visible={showReceiveModal}
                onClose={() => setShowReceiveModal(false)}
                asset={asset}
            />

        </SafeAreaView>
    );
};

export default CryptoAssetScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
    },

    title: {
        fontSize: 22,
        marginVertical: 20,
        color: '#000',
    },

    /* BALANCE CARD */
    balanceCard: {
        backgroundColor: '#FFF6E5',
        borderRadius: 16,
        padding: 18,
        borderWidth: 1.5,
    },

    balanceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },

    coinIcon: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
    },

    balanceLabel: {
        fontSize: 14,
        color: '#000',
    },

    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },

    cryptoAmount: {
        fontSize: 26,
        color: '#000',
    },

    fiatAmount: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },

    priceBox: {
        alignItems: 'flex-end',
    },

    price: {
        fontSize: 14,
        color: '#000',
    },

    percentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },

    percent: {
        fontSize: 12,
        color: '#2DBD5F',
    },

    /* ACTION BUTTONS */
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },

    actionBtn: {
        flex: 1,
        height: 48,
        backgroundColor: '#F1F1F1',
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginHorizontal: 6,
    },

    actionText: {
        fontSize: 14,
        color: '#000',
    },

    /* TRANSACTIONS TAB */
    transactionsTab: {
        alignSelf: 'flex-start',
        backgroundColor: '#000',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 6,
        marginTop: 28,
    },

    transactionsText: {
        fontSize: 12,
        color: '#FFF',
    },

    /* EMPTY STATE */
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 60,
    },

    folderImage: {
        width: 110,
        height: 110,
        resizeMode: 'contain',
        marginBottom: 20,
    },

    emptyTitle: {
        fontSize: 18,
        color: '#000',
        marginBottom: 6,
    },

    emptySub: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center',
    },
});
