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
  View,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Entypo from 'react-native-vector-icons/Entypo';


interface Props {
  navigation: any;
}

const CreateTradeScreen
  = (props: Props) => {
    const {
    } = props;

    const [form, setForm] = useState({
      subCategory: 0,
      noOfCards: 0,
      potentialReturn: 0
    })

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
                color: form.subCategory ? Colors.Black : Colors.PlaceHolder,
                overflow: 'hidden',
                // textAlign: 'left'
              }}>Select Sub Category</AppText>}
            onPress={() => {
              // this.setState({ showStatePicker: true });
            }}
          />
          <TextInputOne
            value=''
            placeholder='No. of Gift Cards'
            containerStyle={{
              width: '95%',
              alignSelf: 'center',
            }}
            inputStyle={{
              // backgroundColor: 'red'
            }}
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
              props={{ numberOfLines: 1 }}
              style={{
                fontSize: RFPercentage(2),
                color: form.subCategory ? Colors.Black : Colors.Black,
                overflow: 'hidden',
              }}>{Values.NairaSymbol} 0.00</AppText>}
            onPress={() => {
              // this.setState({ showStatePicker: true });
            }}
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

