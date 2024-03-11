import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import { Values } from 'CardicApp/src/lib';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import Utils from 'CardicApp/src/lib/utils/Utils';
import { selectAuthState } from 'CardicApp/src/store/auth';
import { setSelectedTrade } from 'CardicApp/src/store/trade';
import Colors from 'CardicApp/src/theme/Colors';
import { TradeStatusEnum } from 'CardicApp/src/types/enums';
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

const TradeHistoryScreen = (props: Props) => {
  const {
  } = props;

  const dispatch = useDispatch();
  const pageIndex = useRef(1);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(false);
  const authState = useSelector(selectAuthState);
  const user = authState.user;

  const getTrades = async (data: any, fn: (trades: Trade[]) => void) => {
    if (loading) return;
    try {
      setLoading(true)
      let payload = {
        ...data,
        // status: 0, // 1 = ongoing/pending trades. 2 = completed trades
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
    }, trades => {
      if (trades.length) {
        setAllTrades([...allTrades, ...trades])
        pageIndex.current = pageIndex.current + 1;
      }
    });
  }

  const refresh = () => {
    pageIndex.current = 1;
    getTrades({
      page: pageIndex.current,
      limit: 20,
    }, trades => {
      if (trades.length){
        setAllTrades(trades)
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
      contentContainerStyle={{
        paddingBottom: 20,
      }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refresh}
            colors={[Colors.Primary]}
          />
        }
        data={allTrades}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => setScrolling(true)}
        onMomentumScrollEnd={() => setScrolling(false)}
        renderItem={({ item }) => {
          const rejected = [TradeStatusEnum.rejected].includes(item.status.id);
          const ongoing = [TradeStatusEnum.created, TradeStatusEnum.active].includes(item.status.id);
          return (
            <GCCardOne
              name={item.subCategory.name}
              cta={rejected ? 'Rejected' : ongoing ? `Ongoing` : `${Values.NairaSymbol}${Utils.currencyFormat(item.totalPaid, 0)} paid`}
              rate={`${Values.NairaSymbol}${Utils.currencyFormat(item.amount, 0)}`}
              image={item.subCategory.category.photo.path}
              onPress={() => {
                dispatch(setSelectedTrade(item))
                props.navigation.push('TradeDetailScreen');
              }}
              ctaStyle={{
                color: rejected ? Colors.Red : ongoing ? Colors.GreyText : Colors.Primary,
              }}
              containerStyle={{
                backgroundColor: Colors.PrimaryBGLight,
              }}
            />
          )
        }}
        ListHeaderComponent={
          <SimpleBackHeader
            text="Trade History"
            showBack={true}
            showMenu={false}
          />}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll={true}
      />
    </SafeAreaView>
  );
};

export default TradeHistoryScreen
