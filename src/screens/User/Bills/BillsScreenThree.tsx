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

const nameMap = {
  electricity: "Electricity",
  television: "Television",
  telco: "Airtime/Data"
}

const BillsScreenThree = (props: Props) => {
  const {
  } = props;

  const dispatch = useDispatch();
  const [products, setProducts] = useState<{
    desc: string;
    id: string;
    name: string;
    sector: string;
  }[]>([])
  // console.log("Products", products)
  const [loading, setLoading] = useState(false);
  const billState = useSelector(selectBillState);

  const getProducts = async () => {
    try {
      setLoading(true)
      const res = await axiosExtended.get(`${routes.bills}/operators/${billState.form.operatorID}/?bill=${billState.form.bill}`);
      if (res.status === 200) {
        const data = res.data;
        setProducts(data)
      }
    } catch (e) {
      console.error(e)
      console.log(JSON.stringify(e, null, 5))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProducts();
  }, []);
  // console.log("Product", products)
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={getProducts}
            colors={[Colors.Primary]}
          />
        }
        data={products}
        renderItem={({ item }) =>
          <GCCardOne
            // name={item}
            rate={item.name}
            rateStyle={{
              fontSize: RFPercentage(2.1)
            }}
            onPress={() => {
              dispatch(setBillForm({
                ...billState.form,
                productId: item.id,
                product: item,
              }));
              props.navigation.push("BillSummaryScreen")
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

export default BillsScreenThree
