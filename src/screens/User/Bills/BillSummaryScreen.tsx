import AppText from 'CardicApp/src/components/AppText/AppText';
import ButtonOne from 'CardicApp/src/components/ButtonOne';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import InfoRow from 'CardicApp/src/components/InfoRow/InfoRow';
import LoadingGradient from 'CardicApp/src/components/LoadingGradient/LoadingGradient';
import ConfirmModal from 'CardicApp/src/components/Modal/ConfirmModal';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import { Values } from 'CardicApp/src/lib';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import Utils from 'CardicApp/src/lib/utils/Utils';
import { selectTradeState, setSelectedTrade } from 'CardicApp/src/store/trade';
import Colors from 'CardicApp/src/theme/Colors';
import { Category } from 'CardicApp/src/types/category';
import { SubCategory } from 'CardicApp/src/types/sub-category';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { selectBillState } from 'CardicApp/src/store/bill';
import { billerNameMap } from './BillsScreenOne';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
interface Props {
  navigation: any;
}

const BillSummaryScreen
  = (props: Props) => {
    const {
    } = props;

    const [showConfirm, setShowConfirmPurchase] = useState(false);
    const [showPurchaseComplete, setShowPurchaseComplete] = useState(false);
    const [amount, setAmount] = useState('');
    const [deviceNumber, setDeviceNumber] = useState('');
    const dispatch = useDispatch();
    const { form } = useSelector(selectBillState);
    const calculatedAmount = Utils.calculateRate(form.subCategory?.nairaRate, parseInt(form?.noOfCards ?? 0), form?.subCategory?.amount ?? 0)
    const isValidForm = form?.noOfCards && parseInt(form?.noOfCards) > 0 && form?.subCategory;

    const [loading, setLoading] = useState(false);

    const makePurchase = async () => {
      try {
        setLoading(true)
        let payload = {
          "amount": form?.product.meta.fee ? parseFloat(form?.product.meta.fee) : parseFloat(amount),
          "product_id": form.productId,
          "operator_id": form.operatorID,
          "account_id": "",
          "device_details": {
            "meter_type": "",
            "device_number": "",
            "beneficiary_msisdn": deviceNumber
          }
        }
        const res = await axiosExtended.post(`${routes.bills}/payment`, payload);
        if (res.status === 201) {
          const trade = res.data;
          dispatch(setSelectedTrade(trade));
          setShowPurchaseComplete(true)
        }
      } catch (e) {
        console.error(e)
        console.log(JSON.stringify(e, null, 5))
      } finally {
        setLoading(false)
        setShowConfirmPurchase(false);
      }
    };

    const validateForm = () => {
      if (!amount) return "Amount is required";
      if (!deviceNumber) return "Device number is required";
      return null;
    }

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SimpleBackHeader
          text="Bill Payment"
          showBack={true}
          showMenu={false}
        />
        <ScrollView
          contentContainerStyle={{
            paddingTop: 20
          }}>
          <InfoRow
            title='Category Name:'
            value={billerNameMap[form?.bill]}
          />
          <InfoRow
            title='Biller Name:'
            value={form?.operatorName}
          />
          <InfoRow
            title='Product:'
            value={form?.product.name}
          />
          {
            form?.product.meta.fee ? 
            <InfoRow
            title='Fee:'
            value={form?.product.meta.fee}
          /> : undefined
          }
          

          {
            form?.product.meta.fee ? undefined :
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
                  marginTop: 20,
                }}
                containerStyle={{
                  marginHorizontal: "3%",
                  marginBottom: 10
                }}

                placeholderTextColor={Colors.Black}
              />
          }
          <TextInputOne
            onChange={(value) => {
              setDeviceNumber(value);
            }}
            value={deviceNumber}
            placeholder="Device Number"
            onSubmitEditing={() => {

            }}
            inputStyle={{
              fontSize: 12,
              width: "100%",
              borderRadius: 5,
              color: Colors.Black,
              paddingHorizontal: 15,
              paddingVertical: 8,
              // marginBottom: 10,
            }}
            containerStyle={{
              marginHorizontal: "3%",
              marginTop: 5,
            }}

            placeholderTextColor={Colors.Black}
          />
          {/* <InfoRow
            title='Description:'
            value={`N${Utils.currencyFormat(form?.subCategory.nairaRate, 0)}/$`}
          /> */}
          {/* <InfoRow
            title='No of Cards:'
            value={form?.noOfCards}
          />
          <InfoRow
            title='Total Return:'
            value={`${Values.NairaSymbol}${Utils.currencyFormat(calculatedAmount, 0)}`}
          /> */}

        </ScrollView>
        <ButtonOne
          text="Confirm"
          onPress={() => {
            setShowConfirmPurchase(true)
          }}
          outerStyle={{
            marginTop: 'auto',
            width: '95%',
            alignSelf: 'center',
            paddingTop: 10,
            marginBottom: 20,
          }}
          // loading={loading}
          containerStyle={{
            backgroundColor: loading || validateForm() != null ? Colors.SlightlyShyGrey : Colors.Primary,
          }}
        />
        <ConfirmModal
          isVisible={showConfirm}
          proceedText={`Yes, I am sure.`}
          onClose={() => setShowConfirmPurchase(false)}
          onProceed={() => {
            makePurchase();
          }}
          loading={loading}
          title="Are you sure you want to make this purchase?"
        />
        <ConfirmModal
          icon={
            <View style={{
              height: heightPercentageToDP(8), aspectRatio: 1, borderRadius: 100, backgroundColor: Colors.Primary,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <AntDesign
                name="check"
                size={RFPercentage(3)}
                color={Colors.White}
              />
            </View>
          }
          isVisible={showPurchaseComplete}
          showCancel={false}
          proceedText={`Continue`}
          onClose={() => setShowPurchaseComplete(false)}
          onProceed={() => {
            setShowPurchaseComplete(false)
            props.navigation.reset({
              index: 0,
              routes: [
                { name: 'BottomTab' },
                // { name: 'TradeDetailScreen' }
              ],
            });
          }}
          title="Congratulations, bill payment was sucessful."
        />
      </SafeAreaView>
    );
  };


export default BillSummaryScreen

