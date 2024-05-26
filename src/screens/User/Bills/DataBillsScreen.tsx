
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


const DataBillsScreen = (props: Props) => {
  const {
  } = props;

  const dispatch = useDispatch();
  const [bouquets, setBouquets] = useState<{
    name: string;
    plan_code: string;
    amount: string;
  }[]>([])
  const [loading, setLoading] = useState(false);
  const [loadingBouquets, setLoadingBouquets] = useState(false);
  const [plan, setPlan] = useState('');
  const [recipient, setRecipient] = useState('');
  const [network, setNetwork] = useState('');

  const networks = [
    { label: 'MTN', value: 'MTN' },
    { label: 'Glo', value: 'Glo' },
    { label: 'Airtel', value: 'Airtel' },
    { label: '9mobile', value: '9mobile' },
  ];

  const validateForm = () => {
    if (!network) return "Network is required";
    if (!plan) return "Select a plan"
    if (!recipient) return "Phone no is required"
    return null;
  }

  const proceed = async () => {

    dispatch(setBillForm({
      recipient,
      plan,
      bouquet: bouquets.find(b => b.plan_code == plan),
      network,
    }));
    props.navigation.push("DataBillsSummaryScreen");
  }
  const getDataPlans = async (network: string) => {
    try {
      setLoadingBouquets(true)
      const res = await axiosExtended.get(`${routes.bills}/data/lookup?network=${network}`);
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
        text="Data Bundle"
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
          options={networks}
          onChange={(val) => {
            setNetwork(val);
            getDataPlans(val);
          }}
        />

        <CustomDropdownSelect
          containerStyle={{
            marginHorizontal: "3%",
            marginBottom: 0
          }}
          headText='Plans'
          value={plan}
          placeholder={loadingBouquets ? "Please wait..." : "Select an option..."}
          options={bouquets.map(b => ({
            label: b.name,
            value: b.plan_code
          }))}
          onChange={(val) => {
            setPlan(val)
          }}
        />

        <TextInputOne
          onChange={(value) => {
            setRecipient(value);
          }}
          value={recipient}
          headText='Phone no'
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


export default DataBillsScreen;
