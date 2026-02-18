import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import Colors from 'CardicApp/src/theme/Colors';
import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ColorSpace } from 'react-native-reanimated';

const RateCalculatorScreen = () => {
  const [activeTab, setActiveTab] = React.useState<'giftcard' | 'crypto'>(
    'giftcard'
  );
  const [showOptions, setShowOptions] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<string | null>(null);
  const [amount, setAmount] = React.useState('');

  const giftcards = ['Amazon', 'iTunes', 'Steam', 'Google Play'];
  const crypto = ['Bitcoin', 'Ethereum', 'USDT'];

  const rate = 50;

  const formattedAmount = amount.replace(/[^0-9]/g, '');

  const estimatedPayout =
    formattedAmount.length > 0
      ? Number(formattedAmount) * rate
      : '';

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <SimpleBackHeader text="" showBack showMenu={false} />

      {/* TITLE */}
      <View style={styles.titleContainer}>
        <AppBoldText style={styles.title}>Rate Calculator</AppBoldText>
        <AppText style={styles.subtitle}>
          Check live giftcards and crypto rates
        </AppText>
      </View>

      {/* ENTER AMOUNT */}
      <AppText style={styles.label}>Enter Amount</AppText>
      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        placeholder="Enter Amount"
        value={formattedAmount}
        onChangeText={setAmount}
      />

      {/* TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => {
            setActiveTab('giftcard');
            setSelectedType(null);
          }}
        >
          <AppText
            style={[
              styles.tabText,
              activeTab === 'giftcard' && styles.activeTab,
            ]}
          >
            Select Giftcard
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setActiveTab('crypto');
            setSelectedType(null);
          }}
        >
          <AppText
            style={[
              styles.tabText,
              activeTab === 'crypto' && styles.activeTab,
            ]}
          >
            Choose Crypto
          </AppText>
        </TouchableOpacity>
      </View>

      {/* SELECT TYPE */}
      <TouchableOpacity
        style={styles.selectBox}
        onPress={() => setShowOptions(!showOptions)}
      >
        <AppText style={styles.selectText}>
          {selectedType ||
            (activeTab === 'giftcard'
              ? 'Select Giftcard Type'
              : 'Choose Crypto Token')}
        </AppText>
        <Ionicons
          name={showOptions ? 'caret-up-outline' : 'caret-down-outline'}
          size={18}
          color="#9AC23C"
        />
      </TouchableOpacity>

      {/* OPTIONS */}
      {showOptions && (
        <View style={styles.dropdown}>
          {(activeTab === 'giftcard' ? giftcards : crypto).map(
            (item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedType(item);
                  setShowOptions(false);
                }}
              >
                <AppText style={styles.dropdownText}>{item}</AppText>
              </TouchableOpacity>
            )
          )}
        </View>
      )}

      {/* ESTIMATED PAYOUT */}
      <AppText style={[styles.label, { marginTop: 20 }]}>
        Estimated Payout
      </AppText>
      <View style={styles.input}>
        <AppText style={styles.payoutText}>
          {estimatedPayout ? `₦${estimatedPayout.toLocaleString()}` : ''}
        </AppText>
      </View>

      {/* RATE */}
      <AppText style={styles.rateText}>
        Current Rate: <AppBoldText>${rate}</AppBoldText>
      </AppText>

      {/* FOOTER BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={!amount || !selectedType}
          style={[
            styles.proceedBtn,
            {
              backgroundColor:
                amount && selectedType ? Colors.Primary : '#BDBDBD',
            },
          ]}
        >
          <AppText style={styles.btnText}>Proceed</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RateCalculatorScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: 20,
  },

  titleContainer: {
    marginBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    color: Colors.Black,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.Black,
    marginTop: 6,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.Black,
    marginBottom: 6,
  },

  input: {
    height: 50,
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginBottom: 20,
  },

  payoutText: {
    fontSize: 14,
    color: Colors.Black,
  },

  tabContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 10,
  },

  tabText: {
    fontSize: 14,
    color: Colors.Black,
    fontWeight: '600',
  },

  activeTab: {
    color: Colors.Primary,
  },

  selectBox: {
    height: 50,
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  selectText: {
    fontSize: 14,
    color: '#555',
  },

  dropdown: {
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  dropdownText: {
    fontSize: 14,
    color: '#333',
  },

  rateText: {
    fontSize: 14,
    color: '#000',
    marginTop: 10,
  },

  footer: {
    marginTop: 'auto',
    marginBottom: 20,
  },

  proceedBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
