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
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  // @ts-ignore
  PlaceholderContainer,
  // @ts-ignore
  Placeholder,
} from 'react-native-loading-placeholder';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';
import { RFPercentage } from 'react-native-responsive-fontsize';
interface Props {
  navigation: any;
}

const TradeSummaryScreen
  = (props: Props) => {
    const {
    } = props;

    const [showConfirmStartTrade, setShowConfirmStartTrade] = useState(false);
    const [showTradeStarted, setShowTradeStarted] = useState(false);

    const dispatch = useDispatch();
    const { form } = useSelector(selectTradeState);
    const calculatedAmount = Utils.calculateRate(form.subCategory?.nairaRate, parseInt(form?.noOfCards ?? 0), form?.subCategory?.amount ?? 0)
    const isValidForm = form?.noOfCards && parseInt(form?.noOfCards) > 0 && form?.subCategory;

    const [loading, setLoading] = useState(false);

    const startTrade = async () => {
      try {
        setLoading(true)
        let payload = {
          "subCategory": {
            "id": form.subCategory.id,
          },
          // "comment": "With E-Code",
          "noOfCards": form.noOfCards,
        }
        const res = await axiosExtended.post(`${routes.trade}/start`, payload);
        if (res.status === 201) {
          const trade = res.data
          dispatch(setSelectedTrade(trade));
          if(Platform.OS == "ios") {
            setShowConfirmStartTrade(false);
            setTimeout(() => setShowTradeStarted(true) , 2000)
          } else {
            setShowTradeStarted(true)
          }
        }
      } catch (e) {
        console.error(e)
        console.log(JSON.stringify(e, null, 5))
      } finally {
        setLoading(false)
        // setShowConfirmStartTrade(false);
      }
    };

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SimpleBackHeader
          text="Summary"
          showBack={true}
          showMenu={false}
        />
        <ScrollView
          contentContainerStyle={{
            paddingTop: 10
          }}>
          <View
            style={{
              height: heightPercentageToDP(20),
              aspectRatio: 1.2,
              borderRadius: 5,
              backgroundColor: Colors.Primary,
              alignSelf: 'center',
              marginBottom: 10,
            }}
          >
            <Image
              source={{
                uri: form?.category.photo.path.replace('http','https')
              }}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </View>
          <InfoRow
            title='Category Name:'
            value={form?.category.name}
          />
          <InfoRow
            title='Sub Category:'
            value={form?.subCategory.name}
          />
          <InfoRow
            title='Rate:'
            value={`N${Utils.currencyFormat(form?.subCategory.nairaRate, 0)}/$`}
          />
          <InfoRow
            title='No of Cards:'
            value={form?.noOfCards}
          />
          <InfoRow
            title='Total Return:'
            value={`${Values.NairaSymbol}${Utils.currencyFormat(calculatedAmount, 0)}`}
          />

        </ScrollView>
        <ButtonOne
          text="Start Trade"
          onPress={() => {
            setShowConfirmStartTrade(true)
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
            backgroundColor: loading || !isValidForm ? Colors.SlightlyShyGrey : Colors.Primary,
          }}
        />
        <ConfirmModal
          isVisible={showConfirmStartTrade}
          proceedText={`Yes, I am sure.`}
          onClose={() => setShowConfirmStartTrade(false)}
          onProceed={() => {
            startTrade();
          }}
          loading={loading}
          title="Are you sure you want to start trade?"
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
          isVisible={showTradeStarted}
          showCancel={false}
          proceedText={`Continue`}
          onClose={() => setShowTradeStarted(false)}
          onProceed={() => {
            setShowTradeStarted(false)
            props.navigation.reset({
              index: 1,
              routes: [
                { name: 'BottomTab' },
                { name: 'TradeDetailScreen' }
              ],
            });
          }}
          title="You have successfully started a trade"
        />
      </SafeAreaView>
    );
  };


export default TradeSummaryScreen

