import AppText from 'CardicApp/src/components/AppText/AppText';
import ButtonOne from 'CardicApp/src/components/ButtonOne';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import LoadingGradient from 'CardicApp/src/components/LoadingGradient/LoadingGradient';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import TextContainer from 'CardicApp/src/components/TextContainer/TextContainer';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
import { Values } from 'CardicApp/src/lib';
import Colors from 'CardicApp/src/theme/Colors';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import ChatMessage from 'CardicApp/src/components/Chat/ChatMessage';
import InfoRow from 'CardicApp/src/components/InfoRow/InfoRow';
import Utils from 'CardicApp/src/lib/utils/Utils';


interface Props {
  navigation: any;
}

const TradeDetailScreen
  = (props: Props) => {
    const {
    } = props;

    const [showDetail, setShowDetail] = useState(true);

    const [loading, setLoading] = useState(false);

    const refresh = () => {

    };

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>

        <FlatList
          style={{
            backgroundColor: Colors.ChatBg,
          }}
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={refresh}
              colors={[Colors.Primary]}
            />
          }
          data={[{}, {}]}
          renderItem={({ item, index }) =>
            <ChatMessage />
          }
          ListHeaderComponentStyle={{
            marginBottom: 10,
            backgroundColor: Colors.White,
          }}
          ListHeaderComponent={
            <View>
              <SimpleBackHeader
                text="Trade Status: Ongoing"
                showBack={false}
                showMenu={false}
                centered={false}
                actions={[
                  <TouchableOpacity>
                    <Feather
                      name="x"
                      color={Colors.Primary}
                      size={RFPercentage(2.8)}
                    />
                  </TouchableOpacity>

                ]}
                style={{
                  // backgroundColor: Colors.Primary
                }}
                textStyle={{
                  color: Colors.Black,
                }}
                textContainerStyle={{
                  marginLeft: 0,
                }}
                iconColor={Colors.White}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}>
                <TouchableOpacity
                  onPress={() => setShowDetail(!showDetail)}
                  style={{
                    padding: 10,
                    marginHorizontal: 7,
                    maxWidth: '70%',
                    backgroundColor: Colors.PrimaryBGLight,
                    borderRadius: 20,
                    alignSelf: "flex-start",
                    marginBottom: 5,
                  }}>
                  <AppText style={{
                    color: Colors.Primary,
                  }}>Transaction Details</AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowDetail(!showDetail)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    aspectRatio: 1,
                  }}>
                  <Feather
                    name={showDetail ? "chevron-up" : "chevron-down"}
                    color={Colors.Primary}
                    size={RFPercentage(2.8)}
                  />
                </TouchableOpacity>
              </View>
              {
                showDetail ? (
                  <View
                    style={{
                      // height: 200,
                      width: '100%',
                      padding: 5,
                    }}>
                    <InfoRow
                      title='Transaction ID'
                      value='#367527635'
                      containerStyle={{
                        marginBottom: 10
                      }}
                    />
                    <InfoRow
                      title='Name of Gift card'
                      value='Amazon'
                      containerStyle={{
                        marginBottom: 10
                      }}
                    />
                    <InfoRow
                      title='Subcategory'
                      value='Amazon UK 100$'
                      containerStyle={{
                        marginBottom: 10
                      }}
                    />
                    <InfoRow
                      title='No. of Gift Cards'
                      value='2'
                      containerStyle={{
                        marginBottom: 10
                      }}
                    />
                    <InfoRow
                      title='Est. Amount'
                      value={`${Values.NairaSymbol}${Utils.currencyFormat(2300)}`}
                      containerStyle={{
                        marginBottom: 10
                      }}
                    />

                  </View>
                ) : undefined
              }
            </View>

          }
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}

        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 5,
            marginBottom: 10,
          }}>
          <View
            style={{
              padding: 12,
              // marginHorizontal: 7,
              backgroundColor: Colors.Primary,
              borderRadius: 5,
              alignSelf: "flex-end",
              // marginBottom: 5,

            }}>
            <Entypo
              name="attachment"
              color={Colors.White}
              size={RFPercentage(2.8)}
            />
          </View>
          <TextInputOne
            value=''
            placeholder='Type message here...'
            containerStyle={{
              width: '88%',
              alignSelf: 'center',
              marginTop: 0,
              // backgroundColor: 'blue'
            }}
            inputStyle={{
              // backgroundColor: 'red'
            }}
          />
        </View>

      </SafeAreaView>
    );
  };

export default TradeDetailScreen

