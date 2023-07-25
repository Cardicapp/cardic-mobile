import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Colors from 'CardicApp/src/theme/Colors';
import { Values } from 'CardicApp/src/lib';
import Utils from 'CardicApp/src/lib/utils/Utils';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import CardicCard from 'CardicApp/src/components/Card/CardicCard';
import BlogIcon from 'CardicApp/src/components/Icons/BlogIcon';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import { selectAuthState } from 'CardicApp/src/store/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import { User } from 'CardicApp/src/types/user';
import { Wallet } from 'CardicApp/src/types/wallet';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import { UserRoleEnum } from 'CardicApp/src/types/enums';
import CardicCardThree from 'CardicApp/src/components/Card/CardicCardThree';

interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
}

const HomeScreen = (props: Props) => {

  const authState = useSelector(selectAuthState);
  const [user, setUser] = useState<User>();
  const [wallet, setWallet] = useState<Wallet>();

  const [loading, setLoading] = useState(false);

  const getUserInfo = async () => {
    try {
      setLoading(true)
      const res = await axiosExtended.get(`${routes.users}/${authState.user?.id}`);
      if (res.status === 200) {
        setUser(res.data);
        const usr = res.data;
        if (usr.role.id == UserRoleEnum.user) {
          const walletRes = await axiosExtended.get(`${routes.wallet}/info/${usr.id}`);
          if (walletRes.status === 200) {
            setWallet(walletRes.data);
          }
        }
      }
    } catch (e) {
      console.error(e)
      console.log(JSON.stringify(e, null, 5))
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getUserInfo();
  }, [])

  const refresh = () => {
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <ScrollView
        // refreshControl={
        //   <RefreshControl
        //     // refreshing={false}
        //     // onRefresh={refresh}
        //     colors={[Colors.Primary]}
        //   />
        // }
        >

        {
          wallet?.balances.map(w => <CardicCardThree
              onPress={() => {
                props.navigation.navigate("Wallet");
              }}
            top={`Wallet (${w.currency.currencyCode})`}
            bottom={`${w.currency.currencyCode == "USD" ? Values.DollarSymbol : Values.NairaSymbol} ${Utils.currencyFormat(w.amount, 0)}`}
          />)
        }


        <View
          style={{
            marginTop: 42,
            paddingHorizontal: 20,
          }}>
          <AppBoldText
            style={{
              fontSize: RFPercentage(2),
            }}>
            What would you like to do today?
          </AppBoldText>
        </View>

        <View
          style={{
            marginTop: 25,
            marginBottom: 10,
            paddingHorizontal: 10,
            // paddingTop: 10,
            // paddingBottom: 10,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}>
          <CardicCard
            key="0"
            onPress={() => {
              props.navigation.push('CategoriesScreen');
            }}
            text="Trade Gift Cards"
            icon={
              <BlogIcon
                pathProps={{
                  fill: Colors.Primary,
                  scale: 1.1,
                }}
              />
            }
          />

          <CardicCard
            key="1"
            onPress={() => props.navigation.navigate('Wallet')}
            text="View Wallet"
            description=""
            icon={
              <BlogIcon
                pathProps={{
                  fill: Colors.Primary,
                  scale: 1.1,
                }}
              />
            }
          />

        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: heightPercentageToDP(2),
          }}>
          <AppBoldText
            style={{
              fontSize: RFPercentage(1.9),
              color: Colors.HomeBlack,
            }}>
            Popular gift cards
          </AppBoldText>

          <TouchableOpacity
            onPress={() => {
              // props.navigation.navigate('/learn');
            }}>
            <AppText
              style={{
                textDecorationLine: 'underline',
                color: Colors.Primary,
                letterSpacing: 0,
              }}>
              See All
            </AppText>
          </TouchableOpacity>
        </View>
        <GCCardOne />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

