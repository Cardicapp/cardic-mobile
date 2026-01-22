import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import Colors from 'CardicApp/src/theme/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import File from 'CardicApp/src/theme/assets/images/File.png';
import CashImng from 'CardicApp/src/theme/assets/images/Cashimg.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useGetTradesQuery } from '../../../services/modules/trades';

interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
}

const GiftCardScreen = (props: Props) => {
  const { data: trades, isLoading } = useGetTradesQuery();

  // Filter trades for display
  const ongoingTrade = trades?.find((t: any) => t.status === 'ongoing'); // Adjust based on actual status enums
  const historyData = trades?.filter((t: any) => t.status !== 'ongoing') || [];

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
        <View style={styles.ongoingCard}>
          <View style={styles.ongoingHeader}>
            <AppBoldText style={styles.ongoingLabel}>Ongoing</AppBoldText>
            <AppText style={styles.ongoingDate}>Nov 10, 2025</AppText>
          </View>

          <View style={styles.ongoingBody}>
            <View style={styles.avatar} />
            <View>
              <AppBoldText>Greg Orangeman</AppBoldText>
              <AppText style={styles.online}>Online</AppText>
              <AppText style={styles.hold}>
                Less than a minute ago, please hold
              </AppText>
            </View>
          </View>

          <AppBoldText style={styles.tradeTitle}>
            USA SEPHORA (100-500)
          </AppBoldText>
        </View>
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
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.historyCard}>
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
              </View>
            )}
          />
        </>
      )}
    </SafeAreaView>
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
  ongoingCard: {
    backgroundColor: '#D9FF7A',
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
  },

  ongoingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  ongoingLabel: {
    color: '#1A7F00',
  },

  ongoingDate: {
    fontSize: 12,
  },

  ongoingBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#999',
    marginRight: 10,
  },

  online: {
    color: 'green',
    fontSize: 12,
  },

  hold: {
    fontSize: 11,
  },

  tradeTitle: {
    marginTop: 10,
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
