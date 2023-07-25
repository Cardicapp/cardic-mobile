import GCCardTwo from 'CardicApp/src/components/Card/GCCardTwo';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import { setTradeForm } from 'CardicApp/src/store/trade';
import Colors from 'CardicApp/src/theme/Colors';
import { Category } from 'CardicApp/src/types/category';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { useDispatch } from 'react-redux';

interface Props {
  navigation: any;
}

const CategoriesScreen = (props: Props) => {
  const {
  } = props;

  const dispatch = useDispatch();
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false);

  const getCategories = async () => {
    try {
      setLoading(true)
      const res = await axiosExtended.get(`${routes.categories}`);
      if (res.status === 200) {
        const cats = res.data.data;
        setCategories(cats)
      }
    } catch (e) {
      console.error(e)
      console.log(JSON.stringify(e, null, 5))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <FlatList
        numColumns={2}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={getCategories}
            colors={[Colors.Primary]}
          />
        }
        data={categories}
        renderItem={({ item, index }) =>
          <GCCardTwo
            key={index}
            top={item.name}
            image={item.photo.path}
            onPress={() => {
              dispatch(setTradeForm({category: item}))
              props.navigation.push("CreateTradeScreen")
            }}
          />}
        ListHeaderComponent={
          <SimpleBackHeader
            // centered={false} 
            text="Select Gift Card"
            showBack={false}
            showMenu={true}
          />}
        stickyHeaderIndices={[0]}
        stickyHeaderHiddenOnScroll={true}

      />

    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
  },
  placeholder: {
    height: 8,
    marginTop: 6,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#eeeeee',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
});

export default CategoriesScreen
