import ButtonOne from 'CardicApp/src/components/ButtonOne';
import InfoRow from 'CardicApp/src/components/InfoRow/InfoRow';
import ConfirmModal from 'CardicApp/src/components/Modal/ConfirmModal';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import Colors from 'CardicApp/src/theme/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { selectBillState } from 'CardicApp/src/store/bill';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
import Toast from 'react-native-toast-message';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import Utils from 'CardicApp/src/lib/utils/Utils';
interface Props {
  navigation: any;
}

const TVBillsSummaryScreen
  = (props: Props) => {
    const {
    } = props;

    const [showConfirm, setShowConfirmPurchase] = useState(false);
    const [showPurchaseComplete, setShowPurchaseComplete] = useState(false);
    const dispatch = useDispatch();
    const { form } = useSelector(selectBillState);
    const [loading, setLoading] = useState(false);
    const [pin, setPin] = useState('');
    const [vendData, setVendData] = useState();

    const makePurchase = async () => {
      try {
        setLoading(true)
        let payload = {
          account: form.account,
          plan_id: form.plan_id,
          service: form.service,
          pin,
        }
        const res = await axiosExtended.post(`${routes.bills}/tv/payment`, payload);
        if (res.status === 200) {
          setVendData(res.data);
          setShowPurchaseComplete(true)
        }
      } catch (e) {
        // console.error(e)
        console.log(JSON.stringify(e, null, 5))
        const errorMsg = Utils.handleError(e);
        if (errorMsg) {
          Toast.show({
            type: 'error',
            text1: "Error!",
            text2: errorMsg
          });
        }

      } finally {
        setLoading(false)
        setShowConfirmPurchase(false);
      }
    };

    const validateForm = () => {
      if (!pin) return "PIN is required";
      return null;
    }

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SimpleBackHeader
          text="Payment Summary"
          showBack={true}
          showMenu={false}
        />
        <ScrollView
          contentContainerStyle={{
            paddingTop: 20
          }}>
          <InfoRow
            title='Network:'
            value={form.network_name}
          />
          <InfoRow
            title='Subscription Plan:'
            value={form.info.currentBouquet}
          />
          <InfoRow
            title='Smartcard Number:'
            value={form.info.accountNumber}
          />
          <InfoRow
            title='Amount:'
            value={`N${Utils.currencyFormat(form?.info.currentBouquetPlan.amount, 0)}`}
          />
          <InfoRow
            title='Customer name:'
            value={form?.customer_name}
          />

          <TextInputOne
            maxLength={4}
            value={pin}
            onChange={val => setPin(val)}
            secureTextEntry={true}
            containerStyle={{
              width: '95%',
              alignSelf: 'center',
              marginBottom: 0,
              marginTop: 30
            }}
            placeholder={`PIN`}
            headText='Enter transaction PIN'
            keyboardType='number-pad'
          />
        </ScrollView>
        <ButtonOne
          text="Confirm"
          onPress={() => {
            const valRes = validateForm();
            if (valRes == null)
              setShowConfirmPurchase(true)
            else {
              Toast.show({
                type: "error",
                text1: "Error!",
                text2: valRes
              })
            }
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
        <ConfirmModal
          isVisible={showConfirm}
          proceedText={`Yes, I am sure.`}
          onClose={() => setShowConfirmPurchase(false)}
          onProceed={() => {
            setShowConfirmPurchase(false)
            makePurchase();
          }}
          loading={loading}
          title={`Are you sure you want to make this purchase for N${Utils.currencyFormat(form?.info.currentBouquetPlan.amount, 0)}?`}
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
              ],
            });
          }}
          title="Congratulations, television bill payment was sucessful."
          // content={`Token: ${vendData ? vendData['CreditToken'] : ""}`}
        />
      </SafeAreaView>
    );
  };


export default TVBillsSummaryScreen

