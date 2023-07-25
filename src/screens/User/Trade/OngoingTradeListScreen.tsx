import ButtonOne from 'CardicApp/src/components/ButtonOne';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import { Values } from 'CardicApp/src/lib';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import Utils from 'CardicApp/src/lib/utils/Utils';
import { selectAuthState } from 'CardicApp/src/store/auth';
import { selectTradeState, setSelectedTrade, setTradeForm } from 'CardicApp/src/store/trade';
import Colors from 'CardicApp/src/theme/Colors';
import { Trade } from 'CardicApp/src/types/trade';
import queryString from 'query-string';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
interface Props {
  route: any;
  navigation: any;
}

const OngoingTradeListScreen = (props: Props) => {
  const {
  } = props;

  const dispatch = useDispatch();
  const tradeState = useSelector(selectTradeState);
  const pageIndex = useRef(1);
  const [ongoingTrades, setOngoingTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const authState = useSelector(selectAuthState);
  const user = authState.user;
  const getTrades = async (data: any, fn: (trades: Trade[]) => void) => {
    if(loading) return;
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

  const loadTrades = () => {
    getTrades({
      page: pageIndex.current,
      limit: 20,
      status: 1, // 1 = ongoing/pending trades. 2 = completed trades
    }, trades => {
      if (trades.length) {
        setOngoingTrades([...ongoingTrades, ...trades])
        pageIndex.current = pageIndex.current + 1;
      }
    });
  }

  const refresh = () => {
    pageIndex.current = 1;
    getTrades({
      page: pageIndex.current,
      limit: 20,
      status: 1, // 1 = ongoing/pending trades. 2 = completed trades
    }, trades => {
      if (trades.length){
        setOngoingTrades(trades)
        pageIndex.current = pageIndex.current + 1;
      }
    });
  }

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      refresh()
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation]);

  const [scrolling, setScrolling] = useState<boolean>(false);

  const onEndReached = () => {
    if (scrolling) {
      return;
    }
    loadTrades();
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            colors={[Colors.Primary]}
          />
        }
        data={ongoingTrades}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => setScrolling(true)}
        onMomentumScrollEnd={() => setScrolling(false)}
        renderItem={({ item }) =>
          <GCCardOne
            name={item.subCategory.name}
            cta="Continue"
            rate={`${Values.NairaSymbol}${Utils.currencyFormat(item.amount, 0)}`}
            image={item.subCategory.category.photo.path}
            onPress={() => {
              dispatch(setSelectedTrade(item))
              props.navigation.push('TradeDetailScreen');
            }}
            selected={item.id === tradeState.form?.subCategory?.id}
          />}
        ListHeaderComponent={
          <SimpleBackHeader
            text="Ongoing Trades"
            showBack={true}
            showMenu={false}
          />}
      />
    </SafeAreaView>
  );
};

export default OngoingTradeListScreen
