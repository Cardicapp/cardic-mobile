import React, { useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  // Animated
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useDispatch, useSelector } from 'react-redux';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Colors from 'CardicApp/src/theme/Colors';
import { Values } from 'CardicApp/src/lib';
import Utils from 'CardicApp/src/lib/utils/Utils';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import CardicCard from 'CardicApp/src/components/Card/CardicCard';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import { selectAuthState } from 'CardicApp/src/store/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import { Trade } from 'CardicApp/src/types/trade';
import queryString from 'query-string';
import { setSelectedTrade } from 'CardicApp/src/store/trade';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
// @ts-ignore
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import * as Animatable from 'react-native-animatable';

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
  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      loadTrades()
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [props.navigation]);

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
        {/* <CardicCardThree
          top={`Trade Total (${Values.NairaSymbol})`}
          bottom={`${1000}`}
          showIcon={false}
        /> */}
        <View
          style={{
            marginTop: 25,
            marginBottom: 10,
            paddingHorizontal: 10,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
          {/* <CardicCard
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
          /> */}
          <CardicCard
            key="0"
            containerStyle={{
              backgroundColor: Colors.PrimaryLightBg,
              elevation: 0,
            }}
            onPress={() => {
              props.navigation.push('CategoriesScreen');
            }}
            text="Sell Gift Cards"
            textStyle={{
              color: Colors.Primary,
            }}
            icon={
              <Fontisto
                name={"credit-card"}
                size={RFPercentage(2)}
                color={Colors.White}
              />
            }
            iconContainerStyle={{
              backgroundColor: Colors.Primary,
            }}
          />

          <CardicCard
            key="1"
            containerStyle={{
              backgroundColor: Colors.PurpleLight,
              elevation: 0,
            }}
            onPress={() => {
              props.navigation.push('TradeHistoryScreen');
            }}
            text="View Trade History"
            textStyle={{
              color: Colors.Purple,
            }}
            icon={
              <FontAwesome5
                name={"chart-bar"}
                size={RFPercentage(3)}
                color={Colors.White}
              />
            }
            iconContainerStyle={{
              backgroundColor: Colors.Purple,
              elevation: 0,

            }}
          />
        </View>
        <View
          style={{
            marginTop: 25,
            marginBottom: 10,
            paddingHorizontal: 10,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
          <CardicCard
            key="2"
            text="Ongoing Trades"
            containerStyle={{
              backgroundColor: Colors.OrangeLight,
              elevation: 0,
            }}
            onPress={() => {
              props.navigation.push('OngoingTradeListScreen');
            }}
            textStyle={{
              color: Colors.Orange,
            }}
            icon={
              <Animatable.View
              iterationCount={'infinite'}
              duration={1000}
              easing={'linear'}
              animation={{
                from: {
                  transform: [{ rotate: '00deg'}]
                },
                to: {
                  transform: [{ rotate: '360deg'}]
                }
              }}>
                <AntDesign
                  name={"loading1"}
                  size={RFPercentage(3)}
                  color={Colors.White}
                  style={{

                  }}
                />
              </Animatable.View>
            }
            iconContainerStyle={{
              backgroundColor: Colors.Orange,
              elevation: 0,

            }}
          />

          <CardicCard
            key="3"
            containerStyle={{
              backgroundColor: Colors.BlueLight,
              elevation: 0,
            }}
            onPress={() => {
              props.navigation.push('CompletedTradeListScreen');
            }}
            text="Completed Trades"
            textStyle={{
              color: Colors.Blue,
            }}
            icon={
              <FontAwesome6
                name={"handshake-simple"}
                size={RFPercentage(3)}
                color={Colors.White}
              />
            }
            iconContainerStyle={{
              backgroundColor: Colors.Blue,
              elevation: 0,

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
              props.navigation.push('OngoingTradeListScreen');
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
              containerStyle={{
                backgroundColor: Colors.PrimaryBGLight,
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
              props.navigation.push('CompletedTradeListScreen');
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
              containerStyle={{
                backgroundColor: Colors.PrimaryBGLight,
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

