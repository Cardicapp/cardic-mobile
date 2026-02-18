import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import Colors from '@/theme/Colors';
import AppText, { AppBoldText } from '@/components/AppText/AppText';
import GCCardOne from '@/components/Card/GCCardOne';
import CustomModal from '@/components/Modal/CustomModal';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import SelectBankModal from '@/components/Modal/SelectBankModal';
import TextInputOne from '@/components/TextInputOne';
import TextContainer from '@/components/TextContainer/TextContainer';

import { selectAuthState } from '@/store/auth';
import axiosExtended from '@/lib/network/axios-extended';
import routes from '@/lib/network/routes';
import Utils from '@/lib/utils/Utils';
import { TransactionTypeEnum } from '@/types/enums';
import { Balance, Bank, Transaction, Wallet } from '@/types/wallet';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';


interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
}

const WalletScreen = (props: Props) => {
  const authState = useSelector(selectAuthState);
  const navigation = useNavigation();

  const cryptoBalances = {
    usd: '$0.00',
    btc: '0.00000',
    change: '+$0(0%)',
  };


  const [wallet, setWallet] = useState<Wallet>();
  const balance: Balance | undefined = wallet?.balances?.[0];

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingTranx, setLoadingTranx] = useState(false);

  const [activeTab, setActiveTab] = useState<'fiat' | 'crypto'>('fiat');
  const [activeFilter, setActiveFilter] =
    useState<'all' | 'success' | 'pending' | 'failed'>('all');

  const [showBalance, setShowBalance] = useState(true);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showBanksModal, setShowBanksModal] = useState(false);
  const [showWithdrawalSuccessModal, setShowWithdrawalSuccessModal] = useState(false);

  const [banks, setBanks] = useState<Bank[]>([]);
  const pageIndexRef = useRef(1);

  const [form, setForm] = useState({
    amount: '',
    bank: undefined as Bank | undefined,
    pin: '',
  });

  /* ---------------- API ---------------- */

  const getWalletInfo = async () => {
    try {
      setLoading(true);
      const res = await axiosExtended.get(`${routes.wallet}/info/${authState.user?.id}`);
      if (res.status === 200) setWallet(res.data);
    } finally {
      setLoading(false);
    }
  };

  const getBanks = async () => {
    const res = await axiosExtended.get(`${routes.banks}/user/${authState.user?.id}`);
    if (res.status === 200) setBanks(res.data);
  };

  const getTransactions = async () => {
    if (!balance) return;
    setLoadingTranx(true);
    const res = await axiosExtended.get(
      `${routes.wallet}/balance/transactions/${balance.id}?page=${pageIndexRef.current}&limit=10`
    );
    if (res.status === 200) setTransactions(res.data.data);
    setLoadingTranx(false);
  };

  useEffect(() => {
    getWalletInfo();
    getBanks();
  }, []);

  useEffect(() => {
    if (wallet && activeTab === 'fiat') getTransactions();
  }, [wallet, activeTab]);

  /* ---------------- WITHDRAW ---------------- */

  const withdraw = async () => {
    if (!form.amount || !form.bank || !form.pin) return;
    try {
      await axiosExtended.post(`${routes.wallet}/withdraw`, {
        amount: Number(form.amount),
        bank: { id: form.bank.id },
        pin: form.pin,
        tx_ref: `${Date.now()}`,
      });
      setShowWithdrawModal(false);
      setShowWithdrawalSuccessModal(true);
      setForm({ amount: '', bank: undefined, pin: '' });
      getWalletInfo();
    } catch (e) {
      Toast.show({ type: 'error', text1: Utils.handleError(e) });
    }
  };

  /* ---------------- TRANSACTION ITEM ---------------- */

  const renderTransaction = ({ item }: { item: Transaction }) => {
    const isCredit = item.transactionType?.id === TransactionTypeEnum.credit;
    return (
      <GCCardOne
        name={moment(item.createdAt).format('ddd MMM YYYY hh:mma')}
        rate={`${isCredit ? '+' : '-'}₦${Utils.currencyFormat(item.amount, 0)}`}
        cta={`Balance ₦${Utils.currencyFormat(item.currentBalance, 0)}`}
        rateStyle={{ color: isCredit ? Colors.Primary : Colors.Red }}
        containerStyle={{
          backgroundColor: isCredit ? Colors.PrimaryBGLight : Colors.OrangeLight,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={loading || loadingTranx} onRefresh={getWalletInfo} />
        }
        data={activeTab === 'fiat' ? transactions : []}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderTransaction}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="emoticon-neutral-outline"
              size={70}
              color="#D9D9D9"
            />
            <AppBoldText style={styles.emptyText}>
              {activeTab === 'fiat'
                ? 'You do not have any Naira transactions at the moment'
                : 'No completed crypto trade'}
            </AppBoldText>
          </View>
        }
        ListHeaderComponent={
          <View>
            {/* TABS */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'fiat' && styles.activeTab]}
                onPress={() => setActiveTab('fiat')}
              >
                <AppBoldText style={styles.tabText}>Fiat</AppBoldText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tabBtn, activeTab === 'crypto' && styles.activeTab]}
                onPress={() => setActiveTab('crypto')}
              >
                <AppBoldText style={styles.tabText}>Crypto</AppBoldText>
              </TouchableOpacity>
            </View>

            {/* FIAT CARD */}
            {activeTab === 'fiat' && (
              <>
                <View style={styles.balanceCard}>
                  <View style={styles.balanceTop}>
                    <AppText style={{ color: '#fff' }}>₦</AppText>
                    <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                      <Entypo
                        name={showBalance ? 'eye' : 'eye-with-line'}
                        size={18}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>

                  <AppBoldText style={styles.balanceAmount}>
                    {showBalance
                      ? Utils.currencyFormat(balance?.amount ?? 0, 2)
                      : '••••'}
                  </AppBoldText>

                  {/* ACTION BUTTONS */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.withdrawBtn}
                      onPress={() => props.navigation.navigate('WithdrawScreen')}                    >
                      <AppBoldText>Withdraw</AppBoldText>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.rateBtn} onPress={() => props.navigation.navigate('RateCalculatorScreen')}>
                      <MaterialCommunityIcons name="calculator" size={18} color="#fff" />
                      <AppBoldText style={{ color: '#fff' }}>
                        Rate Calculator
                      </AppBoldText>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* FILTERS */}
                <View style={styles.filterRow}>
                  {(['all', 'success', 'pending', 'failed'] as const).map((f) => {
                    const isActive = activeFilter === f;

                    const bgColor = {
                      all: Colors.Black,
                      success: Colors.Primary,
                      pending: Colors.Yellow,
                      failed: Colors.Red,
                    }[f];

                    return (
                      <TouchableOpacity
                        key={f}
                        style={[
                          styles.filterBtn,
                          {
                            backgroundColor: isActive ? bgColor : '#EFEFEF',
                          },
                        ]}
                        onPress={() => setActiveFilter(f)}
                      >
                        <AppText
                          style={{
                            color: isActive ? Colors.White : Colors.Black,
                            fontWeight: '600',
                          }}
                        >
                          {f.toUpperCase()}
                        </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </View>

              </>
            )}

            {/* CRYPTO CARD */}
            {activeTab === 'crypto' && (
              <>
                <View style={styles.balanceCardCrypto}>
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

                {/* FILTERS */}
                <View style={styles.filterRow}>
                  {(['all', 'success', 'pending', 'failed'] as const).map((f) => {
                    const isActive = activeFilter === f;

                    const bgColor = {
                      all: Colors.Black,
                      success: Colors.Primary,
                      pending: Colors.Yellow,
                      failed: Colors.Red,
                    }[f];

                    return (
                      <TouchableOpacity
                        key={f}
                        style={[
                          styles.filterBtn,
                          {
                            backgroundColor: isActive ? bgColor : '#EFEFEF',
                          },
                        ]}
                        onPress={() => setActiveFilter(f)}
                      >
                        <AppText
                          style={{
                            color: isActive ? Colors.White : Colors.Black,
                            fontWeight: '600',
                          }}
                        >
                          {f.toUpperCase()}
                        </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>


            )}
          </View>
        }
      />

      {/* MODALS */}
      <CustomModal
        isVisible={showWithdrawModal}
        title="Withdraw"
        onClose={() => setShowWithdrawModal(false)}
        actions={[
          {
            element: (
              <TextInputOne
                placeholder="Amount"
                keyboardType="number-pad"
                value={form.amount}
                onChange={(v) => setForm({ ...form, amount: v })}
              />
            ),
          },
          {
            element: (
              <TextContainer
                child={<AppText>{form.bank?.bankName || 'Select Bank'}</AppText>}
                onPress={() => setShowBanksModal(true)}
              />
            ),
          },
          {
            element: (
              <TextInputOne
                placeholder="PIN"
                secureTextEntry
                value={form.pin}
                onChange={(v) => setForm({ ...form, pin: v })}
              />
            ),
          },
          {
            text: 'Proceed',
            onPress: withdraw,
            containerStyle: { backgroundColor: Colors.Primary },
            textStyle: { color: '#fff' },
          },
        ]}
      />

      <SelectBankModal
        isVisible={showBanksModal}
        banks={banks}
        onClose={() => setShowBanksModal(false)}
        onSelect={(b) => setForm({ ...form, bank: b })}
      />

      <ConfirmModal
        isVisible={showWithdrawalSuccessModal}
        title="Withdrawal successful"
        proceedText="Continue"
        onProceed={() => setShowWithdrawalSuccessModal(false)}
      />
    </SafeAreaView>
  );
};

export default WalletScreen;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  tabRow: { flexDirection: 'row', padding: 16, gap: 10 },
  tabBtn: {
    flex: 1,
    backgroundColor: '#E6E6E6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  activeTab: { backgroundColor: '#000' },
  tabText: { color: '#fff' },

  balanceCard: {
    backgroundColor: '#D59B16',
    borderBottomColor: Colors.Yellow,
    borderBottomWidth: 5,
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  balanceTop: { flexDirection: 'row', justifyContent: 'space-between' },
  balanceAmount: { fontSize: 32, color: '#fff', marginVertical: 10 },

  actionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  withdrawBtn: {
    flex: 1,
    backgroundColor: '#FFE27A',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  rateBtn: {
    flex: 1,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 20,
  },

  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  filterBtn: {
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: '#D0F0C0',
  },

  cryptoCard: {
    backgroundColor: '#F1FFE6',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#9FE870',
    padding: 16,
    margin: 16,
  },
  /* BALANCE CARD */
  balanceCardCrypto: {
    borderWidth: 1.5,
    borderColor: '#B7FF3C',
    borderRadius: 18,
    padding: 16,
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

  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  // usdText: { fontSize: 22 },
  usdBadge: { backgroundColor: '#12B76A', borderRadius: 6, paddingHorizontal: 6 },
  btcBadge: { backgroundColor: '#FEC84B', borderRadius: 6, paddingHorizontal: 6 },
  badgeText: { fontSize: 11 },
  greenText: { color: '#12B76A', marginVertical: 4 },
  timeFrame: { position: 'absolute', right: 16, top: 16 },

  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { marginTop: 16, color: '#777', textAlign: 'center' },
});
