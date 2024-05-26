import ButtonOne from 'CardicApp/src/components/ButtonOne';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
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

interface Props {
  route: any;
  navigation: any;
}

export const billerNameMap = {
  electricity: "Electricity",
  television: "Television",
  telco: "Airtime/Data"
}

const BillsScreenOne = (props: Props) => {

  const bills = [
    {
      name: "Electricity",
      onTap: () => {
        props.navigation.push("ElectricityScreen");
      },
    },
    {
      name: "Cable TV",
      onTap: () => {
        props.navigation.push("TVBillsScreen");
      },
    },
    {
      name: "Airtime",
      onTap: () => {
        props.navigation.push("AirtimeScreen");
      },
    },
    {
      name: "Data Bundle",
      onTap: () => {
        props.navigation.push("DataBillsScreen");
      },
    },
    {
      name: "Sport Betting",
      onTap: () => {
        props.navigation.push("SportsBettingScreen");
      },
    }
  ]

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <FlatList
        data={bills}
        renderItem={({ item }) =>
          <GCCardOne
            // name={item}
            image=''
            rate={item.name}
            rateStyle={{
              fontSize: RFPercentage(2.1)
            }}
            onPress={() => {
             item.onTap && item.onTap();
            }}
          />}
        ListHeaderComponent={
          <SimpleBackHeader
            text="Bill Payments"
            showBack={true}
            showMenu={false}
          />}
      />

    </SafeAreaView>
  );
};

export default BillsScreenOne
