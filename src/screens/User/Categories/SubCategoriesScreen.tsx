import ButtonOne from 'CardicApp/src/components/ButtonOne';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import { Values } from 'CardicApp/src/lib';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
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
import { useDispatch, useSelector } from 'react-redux';
interface Props {
  route: any;
  navigation: any;
}

const SubCategoriesScreen = (props: Props) => {
  const {
  } = props;

  const dispatch = useDispatch();
  const tradeState = useSelector(selectTradeState);
  const categoryId = tradeState.form?.category?.id;
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(false);

  const getSubCategories = async () => {
    try {
      setLoading(true)
      const res = await axiosExtended.get(`${routes.allSubCategories}/${categoryId}`);
      if (res.status === 200) {
        const cats = res.data.data;
        setSubCategories(cats)
      }
    } catch (e) {
      console.error(e)
      console.log(JSON.stringify(e, null, 5))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSubCategories();
  }, []);

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
            onRefresh={getSubCategories}
            colors={[Colors.Primary]}
          />
        }
        data={subCategories}
        renderItem={({ item }) =>
          <GCCardOne
            name={`${item.name} ${item.minAmount} - ${item.maxAmount}`}
            cta='Trade'
            rate={`${Values.NairaSymbol}${item.nairaRate}/${Values.DollarSymbol}`}
            image={item.category.photo.path}
            onPress={() => {
              dispatch(setTradeForm({ ...tradeState.form, subCategory: item }))
            }}
            selected={item.id === tradeState.form?.subCategory?.id}
          />}
        ListHeaderComponent={
          <SimpleBackHeader
            text="Select Sub-Category"
            showBack={true}
            showMenu={false}
          />}
      />
      <ButtonOne
        text="Continue"
        onPress={() => {
          if (tradeState.form?.subCategory?.id)
            props.navigation.pop();
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
          backgroundColor: loading || !tradeState.form?.subCategory?.id ? Colors.SlightlyShyGrey : Colors.Primary,
        }}
      />
    </SafeAreaView>
  );
};

export default SubCategoriesScreen
