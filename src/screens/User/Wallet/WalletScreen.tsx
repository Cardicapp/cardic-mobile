import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Colors from 'CardicApp/src/theme/Colors';
import { Values } from 'CardicApp/src/lib';
import Utils from 'CardicApp/src/lib/utils/Utils';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import CardicCard from 'CardicApp/src/components/Card/CardicCard';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import { selectAuthState } from 'CardicApp/src/store/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import { Balance, Bank, LocalBank, Transaction, Wallet } from 'CardicApp/src/types/wallet';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import { TransactionTypeEnum, UserRoleEnum } from 'CardicApp/src/types/enums';
import queryString from 'query-string';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import CustomModal from 'CardicApp/src/components/Modal/CustomModal';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
import TextContainer from 'CardicApp/src/components/TextContainer/TextContainer';
import SelectBankModal from 'CardicApp/src/components/Modal/SelectBankModal';
import AntDesign from 'react-native-vector-icons/AntDesign'
import ConfirmModal from 'CardicApp/src/components/Modal/ConfirmModal';


interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
}

const WalletScreen = (props: Props) => {

  const authState = useSelector(selectAuthState);
  const [wallet, setWallet] = useState<Wallet>();
  const balance: Balance | undefined = wallet?.balances.length ? wallet.balances[0] : undefined;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [loadingTranx, setLoadingTranx] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [showWithdrawalSuccessModal, setShowWithdrawalSuccessModal] = useState(false)
  const [banks, setBanks] = useState<Bank[]>([])
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showBanksModal, setShowBanksModal] = useState(false)
  const pageIndexRef = useRef(1);
  const [form, setForm] = useState<{
    amount: string;
    bank?: Bank;
    tx_ref: string;
    didFail: boolean;
  }>({
    amount: '',
    bank: undefined,
    tx_ref: '',
    didFail: false,
  })

  const getBanks = async () => {
    try {
      setLoadingBanks(true)
      const res = await axiosExtended.get(`${routes.banks}/user/${authState.user?.id}`);
      if (res.status === 200) {
        const banks: Bank[] = res.data;
        if (banks && banks.length) {
          setBanks(banks);
        }
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingBanks(false)
    }
  }

  const validateForm = () => {
    if (!(parseFloat(form.amount) > 0)) {
      return "Amount is required"
    }
    if (!form.bank) {
      return "Select Bank"
    }
    return null;
  }



  const withdraw = async () => {
    if (validateForm() != null || withdrawing) return;
    try {
      setWithdrawing(true)
      const reference = `${Date.now()}-${authState.user?.id}`;
      if (!form.didFail) {
        setForm({
          ...form,
          tx_ref: reference
        })
      }
      let payload = {
        bank: {
          id: form.bank?.id,
        },
        amount: parseFloat(form.amount),
        tx_ref: form.didFail ? form.tx_ref : reference,
      }
      const res = await axiosExtended.post(`${routes.wallet}/withdraw`, payload);
      if (res.status === 200) {
        setForm({
          amount: '',
          bank: undefined,
          tx_ref: '',
          didFail: false,
        })
        setShowWithdrawalSuccessModal(true)
        setShowWithdrawModal(false)
        refresh();
      }
    } catch (e) {
      console.error(e)
      console.log(JSON.stringify(e, null, 5))
      setForm({
        ...form,
        didFail: true,
      })
    } finally {
      setWithdrawing(false)
    }
  }

  const getWalletInfo = async () => {
    try {
      setLoading(true)
      const walletRes = await axiosExtended.get(`${routes.wallet}/info/${authState.user?.id}`);
      if (walletRes.status === 200) {
        setWallet(walletRes.data);
      }
    } catch (e) {
      console.error(e)
      console.log(JSON.stringify(e, null, 5))
    } finally {
      setLoading(false)
    }
  }
  const getBalanceTransactions = async (cb?: any) => {
    try {
      setLoadingTranx(true)
      const query = {
        page: pageIndexRef.current,
        limit: 10
      }
      const tranxRes = await axiosExtended.get(`${routes.wallet}/balance/transactions/${balance?.id}?${queryString.stringify(query)}`);
      if (tranxRes.status === 200) {
        const trx: Transaction[] = tranxRes.data.data;
        if (trx.length) {
          let newTrx: Transaction[] = [...transactions, ...trx].map<Transaction>(t => ({ ...t, timestamp: new Date(t.createdAt).valueOf() }))
          newTrx = Utils.uniqueBy<Transaction>(newTrx, (tx) => tx.id.toString());
          newTrx = newTrx.sort((a, b) => Utils.compare<Transaction>(a, b, "timestamp")).reverse();
          setTransactions(newTrx);
        }
        cb & cb(trx)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingTranx(false)
    }
  }
  useEffect(() => {
    getWalletInfo();
    getBanks();
  }, [])

  useEffect(() => {
    if (wallet) {
      loadTranx();
    }
  }, [wallet])

  const refresh = () => {
    pageIndexRef.current = 1;
    getWalletInfo();
    if (balance)
      loadTranx();
  };

  const loadTranx = () => {
    getBalanceTransactions((trans: any[]) => {
      if (trans && trans.length) {
        pageIndexRef.current = pageIndexRef.current + 1;
      }
    });
  }

  const [scrolling, setScrolling] = useState<boolean>(false);

  const onEndReached = () => {
    if (scrolling || !balance) {
      return;
    }
    getBalanceTransactions((trans: any[]) => {
      if (trans && trans.length) {
        pageIndexRef.current = pageIndexRef.current + 1;
      }
    });
  };


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <FlatList
        contentContainerStyle={{
          paddingBottom: '20%'
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading || loadingTranx}
            onRefresh={refresh}
            colors={[Colors.Primary]}
          />
        }
        data={transactions}
        renderItem={({ item: i }) => {
          const isCredit = [TransactionTypeEnum.credit].includes(i.transactionType?.id ?? 0)
          return (
            <GCCardOne
              name={moment(i.tx_date).format('DD ddd MMM YYYY hh:mma')}
              rate={`${isCredit ? '+' : '-'}${Values.NairaSymbol}${Utils.currencyFormat(i.amount, 0)}`}
              cta={`Current balance: ${Values.NairaSymbol}${Utils.currencyFormat(i.currentBalance, 0)}`}
              showImage={false}
              ctaStyle={{
                color: Colors.GreyText,
                fontSize: RFPercentage(1.6)
              }}
              nameStyle={{
                fontSize: RFPercentage(1.7)
              }}
              rateStyle={isCredit ? {
                // Credit style
                color: Colors.Primary
              } : {
                // Debit style
                color: Colors.Red
              }}
            />
          )
        }}
        ListHeaderComponent={
          <View
            style={{
              backgroundColor: Colors.White,
              paddingBottom: 5,
            }}>
            {/* <AppText style={{ textAlign: 'center', fontSize: RFPercentage(4), marginTop: '5%' }}>
              {balance?.currency.currencyCode}</AppText> */}
            <AppBoldText style={{ textAlign: 'center', fontSize: RFPercentage(4), marginTop: '8%' }}>{balance?.currency.currencyCode == "USD" ? Values.DollarSymbol : Values.NairaSymbol}{Utils.currencyFormat(balance?.amount ?? 0, 0)}</AppBoldText>

            <View
              style={{
                marginTop: 25,
                marginBottom: 10,
                paddingHorizontal: 10,
                alignItems: 'center',
              }}>
              <CardicCard
                centered={true}
                onPress={() => {
                  setShowWithdrawModal(true)
                }}
                text="Withdraw"
                icon={
                  <MaterialCommunityIcons name={'cash'} size={RFPercentage(3.5)} color={Colors.Primary} />
                }
                containerStyle={{
                  width: widthPercentageToDP(30),
                  aspectRatio: 1,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                marginTop: heightPercentageToDP(2),
              }}>
              <AppBoldText
                style={{
                  fontSize: RFPercentage(1.9),
                  color: Colors.HomeBlack,
                }}>
                Transactions
              </AppBoldText>
            </View>
          </View>
        }

        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll={true}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => setScrolling(true)}
        onMomentumScrollEnd={() => setScrolling(false)}
      />

      <CustomModal
        autoClose={false}
        isVisible={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        title="Withdraw"
        titleStyle={{
          marginTop: 5,
        }}
        content="Enter withdrawal amount"
        contentStyle={{
          fontWeight: '400',
          fontSize: 13,
          marginTop: heightPercentageToDP(0.8),
          lineHeight: 18,
          marginVertical: 0,
        }}

        actions={[
          {
            element: (
              <TextInputOne
                value={`${form.amount}`}
                onChange={val => setForm({ ...form, amount: val })}
                containerStyle={{
                  width: '95%',
                  alignSelf: 'center'
                }}
                placeholder={`${Values.NairaSymbol}5,000`}
                keyboardType='number-pad'
              />
            )
          },
          {
            element: (
              <TextContainer
                rightChild={
                  loadingBanks ?
                    <ActivityIndicator />
                    : undefined
                }
                containerStyle={{
                  width: '95%',
                  height: heightPercentageToDP(6),
                  alignSelf: 'center',
                  alignItems: 'flex-start',
                }}
                child={<AppText
                  props={{ numberOfLines: 1 }}
                  style={{
                    fontSize: RFPercentage(2),
                    color: form.bank ? Colors.Black : Colors.PlaceHolder,
                    overflow: 'hidden',
                  }}>{form.bank ? `${form.bank.accountNo} - ${Utils.shortenText(form.bank.bankName, 25, '')}` : "Select Bank"}</AppText>}
                onPress={() => {
                  if (!loadingBanks) {
                    setShowBanksModal(true)
                    getBanks();
                  }

                }}
              />
            )
          },
          {
            text: 'Proceed',
            onPress: () => {
              withdraw();
            },
            containerStyle: {
              backgroundColor: validateForm() == null ? Colors.Primary : Colors.CardicGreyBgOne,
              marginTop: 10,
              width: '95%',
            },
            textStyle: {
              color: Colors.White,
            },
          },
          {
            text: 'Cancel',
            onPress: () => setShowWithdrawModal(false),
            containerStyle: {
              backgroundColor: Colors.White,
              width: '95%',
            },
            textStyle: {
              color: Colors.Black,
            },
          },

        ]}
      />

      <SelectBankModal
        isVisible={showBanksModal}
        banks={banks}
        onClose={() => setShowBanksModal(false)}
        onSelect={val => {
          setForm({
            ...form,
            bank: val
          });
        }}
      />
      <ConfirmModal
        icon={
          <View style={{
            height: heightPercentageToDP(8), aspectRatio: 1, borderRadius: 100, backgroundColor: Colors.Primary,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <AntDesign
              name="check"
              size={RFPercentage(3)}
              color={Colors.White}
            />
          </View>
        }
        isVisible={showWithdrawalSuccessModal}
        showCancel={false}
        proceedText={`Continue`}
        onClose={() => {
          setShowWithdrawalSuccessModal(false)
        }}
        onProceed={() => {
          setShowWithdrawalSuccessModal(false)
        }}
        title="Withdrawal successful"
      />
    </SafeAreaView>
  );
};

export default WalletScreen;

