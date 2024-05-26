
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

interface Props {
  route: any;
  navigation: any;
}


const TVBillsScreen = (props: Props) => {
  const {
  } = props;

  const dispatch = useDispatch();
  const [bouquets, setBouquets] = useState<{
    id: string;
    name: string;
    amount: number;
    priceOptions: any[];
  }[]>([])
  const [loading, setLoading] = useState(false);
  const [loadingBouquets, setLoadingBouquets] = useState(false);
  const { form } = useSelector(selectBillState);
  const [plan, setPlan] = useState('');
  const [smartcardNo, setSmartcardNo] = useState('');
  const [service, setService] = useState('');

  const networks = [
    { label: 'Startimes', value: 'Startimes' },
    { label: 'DSTV', value: 'DSTV' },
    { label: 'GOTV', value: 'GOTV' },
    { label: 'Showmax', value: 'DSTVSHOWMAX' },
  ];

  const validateForm = () => {
    if (!service) return "Network is required";
    if (!plan) return "Subscription plan is required"
    if (!smartcardNo) return "Smartcard number is required"
    return null;
  }

  const proceed = async () => {
    try {
      setLoading(true)
      let payload = {
        account: smartcardNo,
        plan_id: plan,
        service: service,
      }
      const res = await axiosExtended.post(`${routes.bills}/tv/validate`, payload);
      console.log("Validate res: ", res)
      if (res.status == 200) {
        const data = res.data.message.details;
        dispatch(setBillForm({
          account: smartcardNo,
          plan_id: plan,
          service: service,
          network_name: networks.find(n => n.value == service)?.label,
          customer_name: data.customer_name,
          info: data.info,
        }));
        props.navigation.push("TVBillsSummaryScreen");
      } else {
        Toast.show({
          type: 'error',
          text1: "Error!",
          text2: "Unable to validate smartcard number. Please check and try again",
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
  const getBouquets = async (service: string) => {
    try {
      setLoadingBouquets(true)
      const res = await axiosExtended.get(`${routes.bills}/bouquets?service=${service}`);
      if (res.status === 200) {
        const data = res.data;
        setBouquets(data);
      }
    } catch (e) {
      console.error(e)
      console.log(JSON.stringify(e, null, 5))
    } finally {
      setLoadingBouquets(false)
    }
  }


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <SimpleBackHeader
        text="Cable TV"
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
          value={service}
          placeholder="Select an option..."
          options={networks}
          onChange={(val) => {
            setService(val);
            getBouquets(val);
          }}
        />

        <CustomDropdownSelect
          containerStyle={{
            marginHorizontal: "3%",
            marginBottom: 0
          }}
          headText='Subscription plan'
          value={plan}
          placeholder={loadingBouquets ? "Please wait..." : "Select an option..."}
          options={bouquets.map(b => ({
            label: b.name,
            value: b.id
          }))}
          onChange={(val) => {
            setPlan(val)
          }}
        />

        <TextInputOne
          onChange={(value) => {
            setSmartcardNo(value);
          }}
          value={smartcardNo}
          headText='Smart card number'
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


export default TVBillsScreen;
