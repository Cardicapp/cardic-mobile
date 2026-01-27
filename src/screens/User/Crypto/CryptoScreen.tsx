import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import AppText, { AppBoldText } from '../../../components/AppText/AppText';
import Colors from '../../../theme/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { selectAuthState } from '../../../store/auth';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';



const CryptoScreen = ({ navigation }: any) => {
  const { user } = useSelector(selectAuthState);
  const isKycApproved = (user as any)?.kycStatus === 'approved';

  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (isKycApproved) {
      fetchWallets();
    }
  }, [isKycApproved]);

  const fetchWallets = async () => {
    setIsLoading(true);
    try {
      const res = await axiosExtended.get(routes.wallet);
      if (res.status === 200) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch wallets', err);
    } finally {
      setIsLoading(false);
    }
  };

  const cryptoBalances = data?.summary || { usd: '$0.00', btc: '0.00000', change: '+$0(0%)' };
  const cryptoAssets = data?.wallets || [];

  const renderAsset = ({ item }: any) => (
    <View
      style={[
        styles.assetCard,
        { backgroundColor: item.bg, borderColor: item.border },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate('TokenScreen', { asset: item })}
      >
        <View style={styles.assetTop}>
          <View style={styles.assetPriceContainer}>
            <AppBoldText style={styles.assetSymbol}>
              {item.symbol}
            </AppBoldText>
            <AppText style={styles.assetName}>{item.name}</AppText>
          </View>

          <View style={styles.assetPriceContainer2}>
            <AppText style={styles.assetPrice}>
              {item.price}
            </AppText>
            <AppText style={styles.assetChange}>
              {item.change}
            </AppText>
          </View>

        </View>
      </TouchableOpacity>






      <View style={styles.assetBottom}>
        <Image
          source={
            item.imageUrl ? { uri: item.imageUrl } :
              item.symbol === 'BTC' ? require('@/theme/assets/images/BTC.png') :
                item.symbol === 'ETH' ? require('@/theme/assets/images/ETH.png') :
                  item.symbol === 'USDT' ? require('@/theme/assets/images/Usdt.png') :
                    item.symbol === 'LTC' ? require('@/theme/assets/images/LTC.png') :
                      item.symbol === 'TRX' ? require('@/theme/assets/images/TRX.png') :
                        require('@/theme/assets/images/coin.png')
          }
          style={styles.assetIcon}
        />
        <View style={styles.assetBalanceContainer}>
          <AppText style={styles.balanceLabel}>Balance</AppText>
          <AppBoldText style={styles.assetBalance}>
            {item.balance}
          </AppBoldText>
        </View>

      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* BALANCE CARD or KYC BANNER */}
      {isKycApproved ? (
        <View style={styles.balanceCard}>
          <AppText style={styles.totalLabel}>Total Balance</AppText>

          <View style={styles.topRow}>
            <View style={styles.valueRow}>
              <AppBoldText style={styles.usdValue}>
                {cryptoBalances.usd}
              </AppBoldText>

              <View style={styles.usdPill}>
                <AppText style={styles.usdText}>USD</AppText>
              </View>
            </View>

            <View style={styles.timeBox}>
              <AppText style={styles.timeText}>24 hrs</AppText>
              <Ionicons name="chevron-up" size={14} color="#000" />
            </View>
          </View>

          <AppText style={styles.percentChange}>
            {cryptoBalances.change}
          </AppText>

          <View style={styles.bottomRow}>
            <View style={styles.valueRow}>
              <AppBoldText style={styles.btcValue}>
                {cryptoBalances.btc}
              </AppBoldText>

              <View style={styles.btcPill}>
                <AppText style={styles.btcText}>BTC</AppText>
              </View>
            </View>

            <View style={styles.miniStats}>
              <AppText>$0.00</AppText>
              <Ionicons name="trending-up" size={16} />
              <AppText>$0.00</AppText>
            </View>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.kycBanner}
          onPress={() => navigation.navigate('KycScreen')}
        >
          <Ionicons name="warning-outline" size={24} color="#FFF" />
          <View style={{ flex: 1 }}>
            <AppBoldText style={styles.kycTitle}>KYC Required</AppBoldText>
            <AppText style={styles.kycDesc}>Complete your verification to view balances.</AppText>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      )}

      {/* ASSETS */}
      <FlatList
        data={cryptoAssets}
        renderItem={renderAsset}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default CryptoScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },

  /* BALANCE CARD */
  balanceCard: {
    borderWidth: 1.5,
    borderColor: '#B7FF3C',
    borderRadius: 18,
    padding: 18,
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: '#F5FFE6',
  },

  totalLabel: {
    fontSize: 13,
    color: '#000',
    marginBottom: 6,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  usdValue: {
    fontSize: 24,
    color: '#000',
  },

  usdPill: {
    backgroundColor: '#3CDB3C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  usdText: {
    fontSize: 11,
    color: '#000',
    fontWeight: '600',
  },

  percentChange: {
    fontSize: 13,
    color: '#2DBD5F',
    marginTop: 4,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  btcValue: {
    fontSize: 14,
    color: '#000',
  },

  btcPill: {
    backgroundColor: '#FFB703',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },

  btcText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#000',
  },

  miniStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  timeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  timeText: {
    fontSize: 13,
    color: '#000',
    fontWeight: '600',
  },

  /* ASSET CARDS */
  assetCard: {
    width: '48%',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },

  assetPriceContainer: {
    // alignItems: 'center',
    gap: 1,
  },
  assetPriceContainer2: {
    alignItems: 'center',
    gap: 2,
  },

  assetTop: {
    flexDirection: 'row',
    paddingHorizontal: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  assetSymbol: {
    fontSize: 15,
    color: '#000',
  },

  assetPrice: {
    fontSize: 12,
    color: '#000',
  },

  assetName: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
  },

  assetIcon: {
    width: 34,
    height: 34,
    resizeMode: 'contain',
    marginVertical: 12,
  },

  assetBottom: {
    marginTop: 86,
    flexDirection: 'row',
    paddingHorizontal: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  balanceLabel: {
    fontSize: 11,
    color: '#555',
  },

  assetBalanceContainer: {
    // flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  assetBalance: {
    fontSize: 18,
    color: '#000',
    marginTop: 2,
  },

  assetChange: {
    fontSize: 11,
    color: '#2DBD5F',
    marginTop: 2,
  },

  /* KYC BANNER */
  kycBanner: {
    backgroundColor: '#FF3B30', // Red color
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  kycTitle: {
    color: '#FFF',
    fontSize: 16,
  },
  kycDesc: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.9,
  },
});
