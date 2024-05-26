import ButtonOne from 'CardicApp/src/components/ButtonOne';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
import { Values } from 'CardicApp/src/lib';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import { selectBillState, setBillForm } from 'CardicApp/src/store/bill';
import { selectTradeState, setTradeForm } from 'CardicApp/src/store/trade';
import Colors from 'CardicApp/src/theme/Colors';
import { Category } from 'CardicApp/src/types/category';
import { SubCategory } from 'CardicApp/src/types/sub-category';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import Dropdown from 'react-native-input-select';
import CustomDropdownSelect from 'CardicApp/src/components/CustomDropdownSelect';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';

interface Props {
  route: any;
  navigation: any;
}

const nameMap = {
  electricity: "Electricity",
  television: "Television",
  telco: "Airtime/Data"
}

const ElectricityScreen = (props: Props) => {
  const {
  } = props;

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [meterType, setMeterType] = useState('');
  const [meterNumber, setMeterNumber] = useState('');
  const [disco, setDisco] = useState('');


  const validateForm = () => {
    if (!disco) return "Disco is required";
    if (!meterType) return "Meter type is required"
    if (!meterNumber) return "Meter number is required"
    if (!amount) return "Amount is required";
    return null;
  }

  const proceed = async () => {
    try {
      setLoading(true)
      let payload = {
        meter_number: meterNumber,
        meter_type: meterType,
        amount: parseFloat(amount),
        service: disco
      }
      const res = await axiosExtended.post(`${routes.bills}/electricity/validate`, payload);
      if (res.status == 200 && res.data['status'] == true) {
        const data = res.data.message.details;
        dispatch(setBillForm({
          meter_number: meterNumber,
          meter_type: meterType,
          amount: amount,
          service: disco,
          customer_name: data.customer_name,
          info: data.info,
          product_code: data.product_code,
        }));
        props.navigation.push("ElectricityBillSummary");
      } else {
        Toast.show({
          type: 'error',
          text1: "Error!",
          text2: "Unable to validate meter number. Please check and try again",
        })
      }
    } catch (e) {
      console.error(e)
      console.log(JSON.stringify(e, null, 5));
      Toast.show({
        type: 'error',
        text1: "Error!",
        text2: "Connection failed",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <SimpleBackHeader
        text="Electricity"
        showBack={true}
        showMenu={false}
      />

      <KeyboardAwareScrollView>
        <CustomDropdownSelect
          containerStyle={{
            marginHorizontal: "3%",
            marginBottom: 0
          }}
          headText='Disco'
          value={disco}
          placeholder="Select an option..."
          options={[
            { label: 'IKEDC', value: 'IKEDC' },
            { label: 'AEDC', value: 'AEDC' },
            { label: 'EEDC', value: 'EEDC' },
            { label: 'IBEDC', value: 'IBEDC' },
            { label: 'EKEDC', value: 'EKEDC' },
            { label: 'PHEDC', value: 'PHEDC' },
            { label: 'KEDCO', value: 'KEDCO' },
          ]}
          onChange={(val) => {
            setDisco(val)
          }}
        />

        <CustomDropdownSelect
          containerStyle={{
            marginHorizontal: "3%",
            marginBottom: 0
          }}
          headText='Meter Type'
          value={meterType}
          placeholder="Select an option..."
          options={[
            { label: 'Prepaid', value: 'Prepaid' },
            { label: 'Postpaid', value: 'Postpaid' },
          ]}
          onChange={(val) => {
            setMeterType(val)
          }}
        />

        <TextInputOne
          onChange={(value) => {
            const val = value
            setMeterNumber(val);
          }}
          value={meterNumber}
          headText='Meter number'
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
            if (val) {
              setAmount(val);
            } else {
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
        loading={loading}
        containerStyle={{
          backgroundColor: loading || validateForm() != null ? Colors.SlightlyShyGrey : Colors.Primary,
        }}
      />

    </SafeAreaView>
  );
};

export default ElectricityScreen
