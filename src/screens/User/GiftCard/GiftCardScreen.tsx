import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { Svg, Defs, LinearGradient as SvgGradient, Stop, Rect } from 'react-native-svg';
import { RFPercentage } from 'react-native-responsive-fontsize';
import moment from 'moment';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import Colors from 'CardicApp/src/theme/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import File from 'CardicApp/src/theme/assets/images/File.png';
import CashImng from 'CardicApp/src/theme/assets/images/Cashimg.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthState } from 'CardicApp/src/store/auth';
import { setSelectedTrade } from 'CardicApp/src/store/trade';
import queryString from 'query-string';

interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
}

const GiftCardScreen = (props: Props) => {
  const { user } = useSelector(selectAuthState);
  const dispatch = useDispatch();
  const [ongoingTrades, setOngoingTrades] = React.useState<any[]>([]);
  const [historyTrades, setHistoryTrades] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (user?.id) {
      fetchTrades(1, setOngoingTrades);
      fetchTrades(2, setHistoryTrades);
    }
  }, [user?.id]);

  const fetchTrades = async (status: number, setter: (data: any[]) => void) => {
    setIsLoading(true);
    try {
      const query = queryString.stringify({
        page: 1,
        limit: 20,
        status: status,
      });
      const res = await axiosExtended.get(`${routes.trade}/user/${user?.id}?${query}`);
      if (res.status === 200) {
        setter(res.data.data || []);
      }
    } catch (err) {
      console.error(`Failed to fetch trades for status ${status}`, err);
    } finally {
      setIsLoading(false);
    }
  };

  const ongoingTrade = ongoingTrades?.[0]; // Show the most recent ongoing
  const historyData = historyTrades || [];

  const hasOngoingTrade = !!ongoingTrade;
  const hasHistory = historyData.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER TEXT */}
      <AppText style={styles.smallTitle}>Would you like to</AppText>

      {/* SELL CARD CTA */}
      <TouchableOpacity
        style={styles.sellCard}
        activeOpacity={0.8}
        onPress={() => props.navigation.navigate('TradeGiftCard')}
      >
        <Image
          source={CashImng}
          style={styles.sellIcon}
        />

        <View style={{ flex: 1 }}>
          <AppBoldText style={styles.sellTitle}>
            Sell Gift Card
          </AppBoldText>
          <AppText style={styles.sellSub}>
            Get the highest rates possible
          </AppText>
        </View>

        <Ionicons
          name="caret-forward-outline"
          size={18}
          color="#9AC23C"
        />
      </TouchableOpacity>


      {/* ONGOING TRADE */}
      {hasOngoingTrade && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            dispatch(setSelectedTrade(ongoingTrade));
            props.navigation.navigate('TradeChatScreen');
          }}
          style={styles.ongoingContainer}
        >
          <View style={styles.svgWrapper}>
            <Svg height="100%" width="100%">
              <Defs>
                <SvgGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#D9FF7A" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#9AC23C" stopOpacity="1" />
                </SvgGradient>
              </Defs>
              <Rect width="100%" height="100%" fill="url(#grad)" rx={20} ry={20} />
            </Svg>
          </View>

          <View style={styles.ongoingContent}>
            <View style={styles.ongoingTopRow}>
              <View>
                <AppBoldText style={styles.ongoingLabel}>Ongoing</AppBoldText>
                <AppText style={styles.ongoingDate}>
                  {moment(ongoingTrade?.createdAt).format('MMM DD, YYYY')}
                </AppText>
              </View>

              <View style={styles.adminBadge}>
                <Image
                  source={require('CardicApp/src/theme/assets/images/Artboard.png')}
                  style={styles.adminAvatar}
                />
                <View style={styles.adminInfo}>
                  <AppBoldText style={styles.adminName}>Admin</AppBoldText>
                  <AppText style={styles.onlineStatus}>Online</AppText>
                  <AppText style={styles.holdText}>Less than a minute ago, please hold</AppText>
                </View>
              </View>
            </View>

            <View style={styles.ongoingBottomRow}>
              <View style={styles.cardIndicator}>
                {ongoingTrade?.subCategory?.category?.photo?.path ? (
                  <Image
                    source={{ uri: ongoingTrade.subCategory.category.photo.path.replace('http', 'https') }}
                    style={styles.cardIndicatorIcon}
                  />
                ) : (
                  <View style={styles.cardIndicatorPlaceholder} />
                )}
              </View>
              <AppBoldText style={styles.tradeTitle}>
                {ongoingTrade?.subCategory?.name || 'Trade'}
              </AppBoldText>
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* EMPTY STATE */}
      {!hasOngoingTrade && !hasHistory && (
        <View style={styles.emptyState}>
          <Image
            source={File}
            style={styles.emptyImage}
            resizeMode="contain"
          />

          <AppBoldText style={styles.emptyTitle}>
            No completed trade
          </AppBoldText>

          <AppText style={styles.emptySubtitle}>
            Completed giftcard trades will appear here
          </AppText>
        </View>
      )}

      {/* HISTORY */}
      {hasHistory && (
        <>
          <TouchableOpacity style={styles.historyBtn}>
            <AppText style={styles.historyText}>History</AppText>
          </TouchableOpacity>

          <FlatList
            data={historyData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.historyCard}
                onPress={() => {
                  dispatch(setSelectedTrade(item));
                  props.navigation.navigate('TradeChatScreen');
                }}
              >
                <View style={styles.historyLeft}>
                  <View style={styles.historyIcon} />
                  <View>
                    <AppBoldText>{item.subCategory?.name || 'Trade'}</AppBoldText>
                    <AppText style={styles.historyDate}>
                      {item.createdAt || 'N/A'}
                    </AppText>
                  </View>
                </View>

                <View>
                  <AppBoldText style={styles.amount}>
                    ₦{item.totalPaid}
                  </AppBoldText>
                  <AppText style={styles.usd}>
                    ${item.amount}
                  </AppText>
                </View>
              </TouchableOpacity>
            )}
            horizontal={false}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}
    </SafeAreaView >
  );
};

export default GiftCardScreen;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: 20,
  },

  smallTitle: {
    marginTop: 10,
    color: '#333',
  },

  /* SELL CARD */
  sellCard: {
    backgroundColor: '#0A8F08',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  sellIcon: {
    width: 56,
    height: 56,
    marginRight: 12,
  },

  sellTitle: {
    color: '#fff',
    fontSize: 16,
  },

  sellSub: {
    color: '#E6FFE6',
    fontSize: 12,
  },

  /* ONGOING */
  ongoingContainer: {
    marginTop: 15,
    height: 160, // Fixed height to manage SVG overlay properly
    borderRadius: 20,
    overflow: 'hidden',
  },

  svgWrapper: {
    ...StyleSheet.absoluteFillObject,
  },

  ongoingContent: {
    flex: 1,
    padding: 20,
  },

  ongoingTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderRadius: 20,
  },

  ongoingLabel: {
    color: '#1A7F00',
    fontSize: 18,
  },

  ongoingDate: {
    fontSize: RFPercentage(2),
    color: '#444',
    marginTop: 5,
  },

  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 15,
  },

  adminAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  adminInfo: {
    marginLeft: 10,
  },

  adminName: {
    fontSize: 15,
    color: '#000',
  },

  onlineStatus: {
    color: '#0A8F08',
    fontSize: 11,
  },

  holdText: {
    fontSize: 9,
    color: '#333',
    marginTop: 2,
  },

  ongoingBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  cardIndicator: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardIndicatorIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },

  cardIndicatorPlaceholder: {
    width: 24,
    height: 24,
    backgroundColor: '#333',
    borderRadius: 12,
  },

  tradeTitle: {
    marginLeft: 18,
    fontSize: RFPercentage(2.4),
    color: '#000',
  },

  /* EMPTY STATE */
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },

  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  emptySubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.Black,
    textAlign: 'center',
    // paddingHorizontal: 20,
  },

  /* HISTORY */
  historyBtn: {
    backgroundColor: '#BDBDBD',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginVertical: 10,
  },

  historyText: {
    color: '#fff',
    fontSize: 12,
  },

  historyCard: {
    backgroundColor: '#F1F1F1',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#999',
    marginRight: 10,
  },

  historyDate: {
    fontSize: 12,
    color: '#666',
  },

  amount: {
    textAlign: 'right',
  },

  usd: {
    fontSize: 12,
    textAlign: 'right',
  },
});
