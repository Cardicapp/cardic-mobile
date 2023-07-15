import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import LoadingGradient from 'CardicApp/src/components/LoadingGradient/LoadingGradient';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import { Values } from 'CardicApp/src/lib';
import Colors from 'CardicApp/src/theme/Colors';
import { Category } from 'CardicApp/src/types/category';
import { SubCategory } from 'CardicApp/src/types/sub-category';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  // @ts-ignore
  PlaceholderContainer,
  // @ts-ignore
  Placeholder,
} from 'react-native-loading-placeholder';
import { heightPercentageToDP } from 'react-native-responsive-screen';
interface Props {
  navigation: any;
}

const SubCategoriesScreen = (props: Props) => {
  const {
  } = props;

  const [subCategories, setSubCategories] = useState<SubCategory[]>([
    {
      "id": 1,
      "name": "Itunes 100 USD",
      "nairaRate": 500,
      "createdAt": "2023-04-09T03:41:40.088Z",
      "updatedAt": "2023-04-09T03:41:40.088Z",
      "deletedAt": null,
      "category": {
          "id": 3,
          "name": "Itunes",
          "createdAt": "2023-04-09T03:26:44.017Z",
          "updatedAt": "2023-04-09T03:26:44.017Z",
          "deletedAt": null,
          "photo": {
              "id": "8de71c71-7fa7-4b0f-b3d8-404332fcb2e6",
              "name": "Itunes",
              "fileName": "2b7a53ad-1623-4855-924e-2ee1df133ae6.jpg",
              "path": "http://res.cloudinary.com/sammxin/image/upload/v1681014403/cardic-server/files/vhz3xwfgaoyhhgv2jsqk.jpg",
          },
          "status": {
              "id": 1,
              "name": "Active",
          },
      },
      "status": {
          "id": 1,
          "name": "Active",
      },
  }
  ])

  useEffect(() => {
  }, []);

  const refresh = () => {

  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={refresh}
              colors={[Colors.Primary]}
            />
          }
          data={subCategories}
          renderItem={({ item }) =>
            <GCCardOne
              name={item.name}
              cta=''
            rate={`${Values.NairaSymbol}${item.nairaRate}/${Values.DollarSymbol}`}
            />}
          ListHeaderComponent={
            <SimpleBackHeader
              text="Sub Categories"
              showBack={false}
              showMenu={true}
            />}
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

export default SubCategoriesScreen
