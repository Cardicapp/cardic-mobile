import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import GCCardTwo from 'CardicApp/src/components/Card/GCCardTwo';
import LoadingGradient from 'CardicApp/src/components/LoadingGradient/LoadingGradient';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import { Values } from 'CardicApp/src/lib';
import Colors from 'CardicApp/src/theme/Colors';
import { Category } from 'CardicApp/src/types/category';
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

const CategoriesScreen = (props: Props) => {
  const {
  } = props;

  const [categories, setCategories] = useState<Category[]>([
    {
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
    {
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
        numColumns={2}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refresh}
            colors={[Colors.Primary]}
          />
        }
        data={categories}
        renderItem={({ item, index }) =>
          <GCCardTwo
            key={index}
            name={item.name}
            cta=''
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
