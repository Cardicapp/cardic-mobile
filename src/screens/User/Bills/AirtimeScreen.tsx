import ButtonOne from 'CardicApp/src/components/ButtonOne';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import { setBillForm } from 'CardicApp/src/store/bill';
import Colors from 'CardicApp/src/theme/Colors';
import { useGetBillersQuery, useCreateBillPaymentMutation } from '../../../services/modules/bills';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-native-input-select';
import CustomDropdownSelect from 'CardicApp/src/components/CustomDropdownSelect';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import Utils from 'CardicApp/src/lib/utils/Utils';

interface Props {
  route: any;
  navigation: any;
}

const AirtimeScreen = (props: Props) => {
  const {
  } = props;

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [meterType, setMeterType] = useState('');
  const [phone, setPhone] = useState('');
  const [network, setNetwork] = useState('');


  const { data: billers = [] } = useGetBillersQuery('airtime');
  const [createPayment, { isLoading: isPaying }] = useCreateBillPaymentMutation();

  const networkOptions = billers.map((b: any) => ({
    label: b.label || b.name,
    value: b.value || b.id,
  }));

  const validateForm = () => {
    if (!network) return "Network is required";
    if (!phone) return "Phone number is required"
    if (!amount) return "Amount is required";
    if (!Utils.isNumber(amount)) return "Invalid amount"
    if (parseInt(amount) < 50) return "Amount must be a minimum of N50"
    return null;
  }

  const proceed = async () => {
    try {
      await createPayment({
        recipient: phone,
        amount,
        network
      }).unwrap();

      dispatch(setBillForm({
        recipient: phone,
        amount: amount,
        network: network,
      }));
      props.navigation.push("AirtimeBillsSummaryScreen");
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: "Payment Failed",
        text2: "Please try again later"
      });
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <SimpleBackHeader
        text="Airtime"
        showBack={true}
        showMenu={false}
      />

      <KeyboardAwareScrollView>
        <CustomDropdownSelect
          containerStyle={{
            marginHorizontal: "3%",
            marginBottom: 0
          }}
          headText='Network'
          value={network}
          placeholder="Select an option..."
          options={networkOptions.length > 0 ? networkOptions : [
            { label: 'Loading networks...', value: '' }
          ]}
          onChange={(val) => {
            setNetwork(val)
          }}
        />


        <TextInputOne
          onChange={(value) => {
            const val = value
            setPhone(val);
          }}
          value={phone}
          headText='Phone number'
          keyboardType='number-pad'
          onSubmitEditing={() => {

          }}
          inputStyle={{
            fontSize: 12,
            width: "100%",
            borderRadius: 5,
            color: Colors.Black,
            paddingHorizontal: 15,
            paddingVertical: 8,
            marginTop: 0,
          }}
          containerStyle={{
            marginHorizontal: "3%",
            marginBottom: 10,
          }}

          placeholderTextColor={Colors.Black}
        />


        <TextInputOne
          onChange={(value) => {
            const val = value
            if (parseInt(val) > 0) {
              setAmount(val);
            }
          }}
          value={amount}
          headText='Amount'
          placeholder="Amount"
          keyboardType='number-pad'
          onSubmitEditing={() => {

          }}
          inputStyle={{
            fontSize: 12,
            width: "100%",
            borderRadius: 5,
            color: Colors.Black,
            paddingHorizontal: 15,
            paddingVertical: 8,
            marginTop: 0,
          }}
          containerStyle={{
            marginHorizontal: "3%",
            marginBottom: 10,
          }}

          placeholderTextColor={Colors.Black}
        />
      </KeyboardAwareScrollView>

      <ButtonOne
        text="Continue"
        textStyle={{
          fontSize: RFPercentage(2)
        }}
        onPress={() => {
          const valRes = validateForm();
          if (valRes == null)
            proceed();
          else Toast.show({
            type: 'error',
            text1: "Error",
            text2: valRes
          });
        }}
        outerStyle={{
          marginTop: 'auto',
          width: '95%',
          alignSelf: 'center',
          paddingTop: 10,
          marginBottom: 20,
        }}
        loading={loading || isPaying}
        containerStyle={{
          backgroundColor: (loading || isPaying) || validateForm() != null ? Colors.SlightlyShyGrey : Colors.Primary,
        }}
      />

    </SafeAreaView>
  );
};

export default AirtimeScreen
