import AppText from 'CardicApp/src/components/AppText/AppText';
import ButtonOne from 'CardicApp/src/components/ButtonOne';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import InfoRow from 'CardicApp/src/components/InfoRow/InfoRow';
import LoadingGradient from 'CardicApp/src/components/LoadingGradient/LoadingGradient';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import { Values } from 'CardicApp/src/lib';
import Utils from 'CardicApp/src/lib/utils/Utils';
import Colors from 'CardicApp/src/theme/Colors';
import { Category } from 'CardicApp/src/types/category';
import { SubCategory } from 'CardicApp/src/types/sub-category';
import { Trade } from 'CardicApp/src/types/trade';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
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
interface Props {
  navigation: any;
}

const TradeSummaryScreen
  = (props: Props) => {
    const {
    } = props;

    const tradeDetail: Trade = {
      "amount": 250,
      "comment": "With E-Code",
      "user": {
        "id": 2
      },
      "subCategory": {
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
            "__entity": "FileEntity"
          },
          "status": {
            "id": 1,
            "name": "Active",
            "__entity": "Status"
          },
          "__entity": "Category"
        },
        "status": {
          "id": 1,
          "name": "Active",
          "__entity": "Status"
        },
        "__entity": "SubCategory"
      },
      "status": {
        "id": 1
      },
      "totalPaid": null,
      "assignedAt": null,
      "deletedAt": null,
      "id": 1,
      "createdAt": "2023-06-08T12:31:45.024Z",
      "updatedAt": "2023-06-08T12:31:45.024Z"
    }

    const [loading, setLoading] = useState(false);

    const refresh = () => {

    };

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        <SimpleBackHeader
          text="Summary"
          showBack={false}
          showMenu={true}
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
          />
          <InfoRow
            title='Category Name:'
            value='Amazon'
          />
          <InfoRow
            title='Sub Category:'
            value='Amazon USD $100'
          />
          <InfoRow
            title='Rate:'
            value='N550/$'
          />
          <InfoRow
            title='Category:'
            value='Amazon'
          />
           <InfoRow
            title='No of Cards:'
            value='3'
          />
          <InfoRow
            title='Total Return:'
            value={`${Values.NairaSymbol}${Utils.currencyFormat(30000)}`}
          />

        </ScrollView>
        <ButtonOne
          text="Start Trade"
          onPress={() => {
            // submit();
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
            backgroundColor: loading ? Colors.SlightlyShyGrey : Colors.Primary,
          }}
        />
      </SafeAreaView>
    );
  };


export default TradeSummaryScreen

