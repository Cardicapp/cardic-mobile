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
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';



type NavProp = StackNavigationProp<ApplicationStackParamList>;


/* CONSTANTS */
const MIN_AMOUNT = 200;
const MAX_AMOUNT = 500000;

const formatAmount = (value: string) => {
  const number = value.replace(/[^0-9]/g, '');
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const WithdrawScreen = () => {
    const navigation = useNavigation<NavProp>();
  
  const [showBanks, setShowBanks] = React.useState(false);
  const [selectedBank, setSelectedBank] = React.useState<string | null>(null);
  const [accountNumber, setAccountNumber] = React.useState('');
  const [amount, setAmount] = React.useState('');
  const [errors, setErrors] = React.useState({
    accountNumber: '',
    amount: '',
  });

  const banks = ['Access Bank', 'GTBank', 'First Bank', 'UBA'];

  /* FORM VALIDATION */
  const isFormValid =
    selectedBank &&
    accountNumber.length >= 10 &&
    Number(amount) >= MIN_AMOUNT &&
    Number(amount) <= MAX_AMOUNT &&
    !errors.accountNumber &&
    !errors.amount;

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <SimpleBackHeader text="" showBack showMenu={false} />

      {/* TITLE */}
      <View style={styles.titleContainer}>
        <AppBoldText style={styles.title}>Naira Wallet</AppBoldText>
        <AppText style={styles.subtitle}>
          Choose from saved banks
        </AppText>
      </View>

      {/* FROM */}
      <View style={styles.rowBetween}>
        <AppText style={styles.label}>From</AppText>
        <AppText style={styles.value}>Cardic wallet - ₦0</AppText>
      </View>

      {/* SAVED BANKS */}
      <AppText style={styles.label}>Saved Banks</AppText>

      <TouchableOpacity
        style={styles.selectBox}
        onPress={() => setShowBanks(!showBanks)}
      >
        <AppText style={styles.selectAppText}>
          {selectedBank || 'Select Account'}
        </AppText>
        <Ionicons
          name={showBanks ? 'caret-up-outline' : 'caret-down-outline'}
          size={18}
          color="#9AC23C"
        />
      </TouchableOpacity>

      {/* BANK OPTIONS */}
      {showBanks && (
        <View style={styles.dropdown}>
          {banks.map((bank, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedBank(bank);
                setShowBanks(false);
              }}
            >
              <AppText style={styles.dropdownText}>{bank}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ACCOUNT NUMBER */}
      {selectedBank && (
        <>
          <AppText style={[styles.label, { marginTop: 16 }]}>
            Account Number
          </AppText>

          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Enter account number"
            value={accountNumber}
            maxLength={12}
            onChangeText={(text) => {
              const digits = text.replace(/[^0-9]/g, '');
              setAccountNumber(digits);

              setErrors(prev => ({
                ...prev,
                accountNumber:
                  digits.length < 10
                    ? 'Account number must be at least 10 digits'
                    : '',
              }));
            }}
          />

          {!!errors.accountNumber && (
            <AppText style={styles.errorText}>
              {errors.accountNumber}
            </AppText>
          )}
        </>
      )}

      {/* AMOUNT */}
      <View style={[styles.rowBetween, { marginTop: 20 }]}>
        <AppText style={styles.label}>Enter Amount</AppText>
        <AppText style={styles.charge}>Charge: 100 NGN</AppText>
      </View>

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={formatAmount(amount)}
        onChangeText={(text) => {
          const raw = text.replace(/,/g, '').replace(/[^0-9]/g, '');
          const numericValue = Number(raw);

          setAmount(raw);

          let error = '';
          if (numericValue < MIN_AMOUNT) {
            error = `Minimum is ₦${MIN_AMOUNT}`;
          } else if (numericValue > MAX_AMOUNT) {
            error = `Maximum is ₦${MAX_AMOUNT.toLocaleString()}`;
          }

          setErrors(prev => ({ ...prev, amount: error }));
        }}
      />

      {!!errors.amount && (
        <AppText style={styles.errorText}>
          {errors.amount}
        </AppText>
      )}

      <View style={styles.rowBetween}>
        <AppText style={styles.hint}>Min: 200 NGN</AppText>
        <AppText style={styles.hint}>Max: 500,000 NGN</AppText>
      </View>

      {/* FOOTER BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={!isFormValid}
          onPress={() => navigation.navigate('ConfirmPin')}
          style={[
            styles.disabledBtn,
            {
              backgroundColor: isFormValid
                ? Colors.Primary
                : '#BDBDBD',
            },
          ]}
        >
          <AppText style={styles.btnAppText}>Proceed</AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WithdrawScreen;

/* STYLES */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
  },

  titleContainer: {
    marginBottom: 50,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
    color: '#000',
  },

  subtitle: {
    fontSize: 20,
    color: '#666',
    marginTop: 6,
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 6,
  },

  value: {
    fontSize: 14,
    color: '#000',
  },

  rowBetween: {
    flexDirection: 'row',
    marginBottom: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectBox: {
    height: 50,
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  selectAppText: {
    fontSize: 14,
    color: '#555',
  },

  dropdown: {
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    marginTop: 6,
    overflow: 'hidden',
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

  input: {
    height: 50,
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 6,
  },

  charge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },

  hint: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.Black,
  },

  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },

  footer: {
    marginTop: 'auto',
    marginBottom: 20,
  },

  disabledBtn: {
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnAppText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
