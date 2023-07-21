import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import AppText, {AppBoldText} from '../../components/AppText';
// import SaveIcon from '../../icons/SaveIcon';
// import LoanIcon from '../../icons/LoanIcon';
// import CommunityIcon from '../../icons/CommunityIcon';
// import BlogIcon from '../../icons/BlogIcon';
// import SheCard from '../../components/SheCard';
import { connect, useDispatch, useSelector } from 'react-redux';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Colors from 'CardicApp/src/theme/Colors';
import { Values } from 'CardicApp/src/lib';
import Utils from 'CardicApp/src/lib/utils/Utils';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import CardicCard from 'CardicApp/src/components/Card/CardicCard';
import BlogIcon from 'CardicApp/src/components/Icons/BlogIcon';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import { AuthState, selectAuthState } from 'CardicApp/src/store/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import { User } from 'CardicApp/src/types/user';
import { Wallet } from 'CardicApp/src/types/wallet';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import { UserRoleEnum } from 'CardicApp/src/types/enums';
import CardicCardThree from 'CardicApp/src/components/Card/CardicCardThree';
import { Trade } from 'CardicApp/src/types/trade';
import queryString from 'query-string';
import { setSelectedTrade } from 'CardicApp/src/store/trade';
// import SimpleBackHeader from '../../components/SimpleBackHeader';
// import PushNotification from 'react-native-push-notification';

interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
}

const TradeHomePageScreen = (props: Props) => {
  const dispatch = useDispatch();
  const authState = useSelector(selectAuthState);
  const user = authState.user;

  const [ongoingTrades, setOngoingTrades] = useState<Trade[]>([]);
  const [completedTrades, setCompletedTrades] = useState<Trade[]>([]);

  const [loading, setLoading] = useState(false);

  const getTrades = async (data: any, fn: (trades: Trade[]) => void) => {
    try {
      setLoading(true)
      let payload = {
        ...data,
        // status: 1, // 1 = ongoing/pending trades. 2 = completed trades
      }
      const res = await axiosExtended.get(`${routes.trade}/user/${user?.id}?${queryString.stringify(payload)}`);
      if (res.status === 200) {
        fn && fn(res.data.data);
      }
    } catch (e) {
      console.error(e)
      console.log(JSON.stringify(e, null, 5))
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    loadTrades()
  }, [])

  const loadTrades = () => {
    getTrades({
      page: 1,
      limit: 4,
      status: 1, // 1 = ongoing/pending trades. 2 = completed trades
    }, trades => {
      setOngoingTrades(trades)
    });
    getTrades({
      page: 1,
      limit: 4,
      status: 2, // 1 = ongoing/pending trades. 2 = completed trades
    }, trades => {
      setCompletedTrades(trades)
    });
  };

  let totalPersonalAmount = 0;
  let totalGroupAmount = 0;
  // props.groupSavings.forEach((e) => (totalGroupAmount += e['balance'] || 0));
  // props.personalSavings.forEach(
  //   (e) => (totalPersonalAmount += e['balance'] || 0),
  // );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: '5%'
        }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadTrades}
            colors={[Colors.Primary]}
          />
        }>
        <CardicCardThree
          top={`Trade Total (${Values.NairaSymbol})`}
          bottom={`${1000}`}
          showIcon={false}
        />
        <View
          style={{
            marginTop: 25,
            marginBottom: 10,
            paddingHorizontal: 10,
            // paddingTop: 10,
            // paddingBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
          <CardicCard
            key="0"
            onPress={() => {
              props.navigation.push('CategoriesScreen');
            }}
            text="Start New Trade"
            icon={
              <BlogIcon
                pathProps={{
                  fill: Colors.Primary,
                  scale: 1.1,
                }}
              />
            }
          />

          <CardicCard
            key="1"
            // onPress={() => props.navigation.navigate('/learn')}
            text="View Trade History"
            description=""
            icon={
              <BlogIcon
                pathProps={{
                  fill: Colors.Primary,
                  scale: 1.1,
                }}
              />
            }
          />

        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: heightPercentageToDP(2),
            marginBottom: '1%'
          }}>
          <AppBoldText
            style={{
              fontSize: RFPercentage(1.9),
              color: Colors.HomeBlack,
            }}>
            Ongoing trades
          </AppBoldText>

          <TouchableOpacity
            onPress={() => {
              // props.navigation.navigate('/learn');
            }}>
            <AppText
              style={{
                textDecorationLine: 'underline',
                color: Colors.Primary,
                letterSpacing: 0,
              }}>
              See All
            </AppText>
          </TouchableOpacity>
        </View>
        {
          ongoingTrades && ongoingTrades.length ? ongoingTrades.map(t =>
            <GCCardOne
              name={t.subCategory.name}
              cta='Open'
              image={t.subCategory.category.photo.path}
              rate={`${Values.NairaSymbol} ${Utils.currencyFormat(t.amount, 0)}`}
              onPress={() => {
                dispatch(setSelectedTrade(t));
                props.navigation.push('TradeDetailScreen');
              }}
            />) :
            <AppText
              style={{
                textAlign: 'center',
                letterSpacing: 0,
                marginTop: '1%',
              }}>
              {loading ? 'Loading...' : 'No Ongoing Trades'}
            </AppText>
        }
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: heightPercentageToDP(2),
            marginBottom: '1%'
          }}>
          <AppBoldText
            style={{
              fontSize: RFPercentage(1.9),
              color: Colors.HomeBlack,
            }}>
            Completed trades
          </AppBoldText>

          <TouchableOpacity
            onPress={() => {
              // props.navigation.navigate('/learn');
            }}>
            <AppText
              style={{
                textDecorationLine: 'underline',
                color: Colors.Primary,
                letterSpacing: 0,
              }}>
              See All
            </AppText>
          </TouchableOpacity>
        </View>
        {
          completedTrades && completedTrades.length ? completedTrades.map(t =>
            <GCCardOne
              name={t.subCategory.name}
              cta='Open'
              image={t.subCategory.category.photo.path}
              rate={`${Values.NairaSymbol} ${Utils.currencyFormat(t.amount, 0)}`}
              onPress={() => {
                dispatch(setSelectedTrade(t));
                props.navigation.push('TradeDetailScreen');
              }}
            />) :
            <AppText
              style={{
                textAlign: 'center',
                letterSpacing: 0,
                marginTop: '1%',
              }}>
              {loading ? 'Loading...' : 'No Completed Trades'}
            </AppText>
        }
      </ScrollView>
    </SafeAreaView >
  );
};

export default TradeHomePageScreen;

