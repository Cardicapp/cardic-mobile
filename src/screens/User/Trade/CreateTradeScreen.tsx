import AppText from 'CardicApp/src/components/AppText/AppText';
import ButtonOne from 'CardicApp/src/components/ButtonOne';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import TextContainer from 'CardicApp/src/components/TextContainer/TextContainer';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
import { Values } from 'CardicApp/src/lib';
import Utils from 'CardicApp/src/lib/utils/Utils';
import { selectTradeState, setTradeForm } from 'CardicApp/src/store/trade';
import Colors from 'CardicApp/src/theme/Colors';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useDispatch, useSelector } from 'react-redux';

interface Props {
  navigation: any;
}

const CreateTradeScreen
  = (props: Props) => {
    const {
    } = props;

    const dispatch = useDispatch();
    const tradeState = useSelector(selectTradeState);
    const [form, setForm] = useState({
      subCategory: 0,
      noOfCards: 0,
      potentialReturn: 0
    })
    
    const calculatedAmount = Utils.calculateRate(tradeState.form.subCategory?.nairaRate, parseInt(tradeState.form?.noOfCards ?? 0), tradeState.form?.subCategory?.amount ?? 0)
    const isValidForm = tradeState.form?.noOfCards && parseInt(tradeState.form?.noOfCards) > 0  && tradeState.form?.subCategory;
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SimpleBackHeader
          text="Trade"
          showBack={false}
          showMenu={true}
          centered={false}
          style={{
            backgroundColor: Colors.Primary
          }}
          textStyle={{
            color: Colors.White
          }}
          iconColor={Colors.White}
        />
        <ScrollView
          contentContainerStyle={{
            paddingTop: 10
          }}>
          <TextContainer
            rightChild={
              <View
                style={{
                  height: heightPercentageToDP(3.5),
                  aspectRatio: 1,
                  borderRadius: 5,
                  backgroundColor: Colors.Primary,
                }} />
              // <Entypo
              //   name="chevron-down"
              //   color={Colors.Primary}
              //   size={15}
              // />
            }
            containerStyle={{
              width: '95%',
              height: heightPercentageToDP(6),
              alignSelf: 'center',
              alignItems: 'flex-start',
            }}
            child={<AppText
              props={{ numberOfLines: 1 }}
              style={{
                fontSize: RFPercentage(2),
                color: tradeState.form.subCategory?.name ? Colors.Black : Colors.PlaceHolder,
                overflow: 'hidden',
              }}>{tradeState.form.subCategory?.name ? tradeState.form.subCategory.name : "Select Sub Category"}</AppText>}
            onPress={() => {
              props.navigation.push("SubCategoriesScreen")
            }}
          />
          <TextInputOne
            value={tradeState.form?.noOfCards}
            placeholder='No. of Gift Cards'
            containerStyle={{
              width: '95%',
              alignSelf: 'center',
            }}
            onChange={(val) => dispatch(setTradeForm({ ...tradeState.form, noOfCards: val }))}
          />
          <TextContainer
            rightChild={
              <AppText
                style={{
                  fontSize: RFPercentage(1.3),
                  top: '90%'
                }}>
                Calculated amount
              </AppText>
            }
            containerStyle={{
              width: '95%',
              height: heightPercentageToDP(6),
              alignSelf: 'center',
              alignItems: 'flex-start',
              marginTop: 20,
            }}
            child={<AppText
              style={{
                fontSize: RFPercentage(2),
                overflow: 'hidden',
              }}>{Values.NairaSymbol} {Utils.currencyFormat(calculatedAmount, 0)}</AppText>}
          />

        </ScrollView>
        <ButtonOne
          text="Start Trade"
          onPress={() => {
            if(isValidForm){
              props.navigation.push("TradeSummaryScreen")
            }
          }}
          outerStyle={{
            marginTop: 'auto',
            width: '95%',
            alignSelf: 'center',
            paddingTop: 10,
            marginBottom: 20,
          }}
          containerStyle={{
            backgroundColor: !isValidForm ? Colors.SlightlyShyGrey : Colors.Primary,
          }}
        />
      </SafeAreaView>
    );
  };

interface InfoRowProps {
  title: string;
  value: string;
}
const InfoRow = ({ title, value }: InfoRowProps) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginBottom: 5,
      }}>
      <AppText>{title}</AppText>
      <AppText>{value}</AppText>
    </View>
  )
}
export default CreateTradeScreen

