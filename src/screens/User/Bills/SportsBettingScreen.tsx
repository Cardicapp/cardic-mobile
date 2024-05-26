
// }
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
import queryString from 'query-string';
import Utils from 'CardicApp/src/lib/utils/Utils';

interface Props {
  route: any;
  navigation: any;
}


const SportsBettingScreen = (props: Props) => {
  const {
  } = props;

  const dispatch = useDispatch();
  const [providers, setProviders] = useState<{
    id: string;
    title: string;
  }[]>([])
  const [loading, setLoading] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [provider, setProvider] = useState('');
  const [amount, setAmount] = useState('');

  const validateForm = () => {
    if (!provider) return "Select a betting provider";
    if (!recipient) return "Phone no is required";
    if (!amount) return "Amount is required";
    if(!Utils.isNumber(amount)) return "Invalid amount";
    if(parseInt(amount) < 100) return "Amount can not be less than N100";
    if(parseInt(amount) > 50000) return "Amount can not be more than N50,000";
    return null;
  }

  const proceed = async () => {

    try {
      setLoading(true)
      let payload = {
        bet_id: provider,
        customer_id: recipient
      }
      const query = queryString.stringify(payload);
      const res = await axiosExtended.get(`${routes.bills}/betting/validate?${query}`);
      if (res.status == 200) {
        const data = res.data;
        dispatch(setBillForm({
          customer_name: data.customer_name,
          recipient,
          provider,
          providerName: providers.find(p => p.id == provider)?.title,
          amount,
        }));
        props.navigation.push("SportsBettingSummaryScreen");
      } else {
        Toast.show({
          type: 'error',
          text1: "Error!",
          text2: "Unable to validate Betting account. Please check and try again",
        })
      }
    } catch (e) {
      console.error(e)
      const errorMsg = Utils.handleError(e);
      Toast.show({
        type: 'error',
        text1: "Error!",
        text2: errorMsg,
      })
    } finally {
      setLoading(false)
    }
  }

  const getProviders = async () => {
    try {
      setLoadingProviders(true)
      const res = await axiosExtended.get(`${routes.bills}/betting/list`);
      if (res.status === 200) {
        const data = res.data;
        setProviders(data);
      }
    } catch (e) {
      console.error(e)
      console.log(JSON.stringify(e, null, 5))
    } finally {
      setLoadingProviders(false)
    }
  }

  useEffect(() => {
    getProviders();
  }, []);


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <SimpleBackHeader
        text="Sports Betting"
        showBack={true}
        showMenu={false}
      />

      <KeyboardAwareScrollView>
        <CustomDropdownSelect
          containerStyle={{
            marginHorizontal: "3%",
            marginBottom: 0
          }}
          headText='Betting Provider'
          value={provider}
          placeholder={loadingProviders ? "Please wait..." : "Select an option..."}
          options={providers.map(b => ({
            label: b.title,
            value: b.id
          }))}
          onChange={(val) => {
            setProvider(val);
            // getDataPlans(val);
          }}
        />
        <TextInputOne
          onChange={(value) => {
            setRecipient(value);
          }}
          value={recipient}
          headText='Account ID / Phone no'
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
            setAmount(value);
          }}
          value={amount}
          headText='Amount'
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
            marginTop: 5,
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


export default SportsBettingScreen;
