import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import AppText, {AppBoldText} from '../../components/AppText';
// import SaveIcon from '../../icons/SaveIcon';
// import LoanIcon from '../../icons/LoanIcon';
// import CommunityIcon from '../../icons/CommunityIcon';
// import BlogIcon from '../../icons/BlogIcon';
// import SheCard from '../../components/SheCard';
import { connect, useSelector } from 'react-redux';
// import {ShecludedState} from '../../store/root.reducer';
// import * as actions from '../../store/actions/index';
import {
  // @ts-ignore
  PlaceholderContainer,
  // @ts-ignore
  Placeholder,
} from 'react-native-loading-placeholder';
// import Values from '../../shared/Values';
// import Utils from '../../shared/Utils';
// import {LoadingGradient} from '../Loan/LoanLoader';
// import {LearnItem} from '../Learn/LearnHome';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Colors from 'CardicApp/src/theme/Colors';
import { Values } from 'CardicApp/src/lib';
import Utils from 'CardicApp/src/lib/utils/Utils';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import CardicCard from 'CardicApp/src/components/Card/CardicCard';
import BlogIcon from 'CardicApp/src/components/Icons/BlogIcon';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import { AuthState, selectAuthState } from 'CardicApp/src/store/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import { User } from 'CardicApp/src/types/user';
import { Wallet } from 'CardicApp/src/types/wallet';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import { UserRoleEnum } from 'CardicApp/src/types/enums';
import CardicCardThree from 'CardicApp/src/components/Card/CardicCardThree';
// import SimpleBackHeader from '../../components/SimpleBackHeader';
// import PushNotification from 'react-native-push-notification';

interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;

  // loadingPersonalSavings: boolean;
  // loadingGroupSavings: boolean;
  // loadingCourses: boolean;
  // loadingCourseCategories: boolean;
  // wallet: any;
  // loadingWallet: boolean;
  // groupSavings: any[];
  // personalSavings: any[];
  // courses: any[];
  // getPersonalSavings: () => void;
  // getGroupSavings: () => void;
  // getCourseCategories: (
  //   cb?: any,
  //   errCb?: any,
  //   shouldLoadCourses?: boolean,
  // ) => void;
  // loadWallet: () => void;
  // toggleMenu: () => void;
  // selectCourse: (course: any) => void;
  // navigation: any;
  // showToast: (messages: string[], options?: any) => void;
  // route: any;
  // userData: any;
  // notifications: any[];
  // loadNotifications: () => void;
}

const HomeScreen = (props: Props) => {
  const {
    // wallet = {
    //   balance: 0,
    // },
  } = props;

  const authState = useSelector(selectAuthState);
  // console.log("authState", authState)


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
          console.log("Before wallet call")
          const walletRes = await axiosExtended.get(`${routes.wallet}/info/${usr.id}`);
          console.log("Wallet res", walletRes)
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
    // props.getPersonalSavings();
    // props.getGroupSavings();
    // props.loadWallet();
    // props.loadNotifications();
    // getCourses();
  };

  let totalPersonalAmount = 0;
  let totalGroupAmount = 0;
  // props.groupSavings.forEach((e) => (totalGroupAmount += e['balance'] || 0));
  // props.personalSavings.forEach(
  //   (e) => (totalPersonalAmount += e['balance'] || 0),
  // );
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <PlaceholderContainer
        style={styles.placeholderContainer}
        // animatedComponent={<LoadingGradient />}
        duration={1000}
        delay={1000}
        loader={new Promise((resolve) => { })}>
        {/* <SimpleBackHeader
          centered={false}
          text={`Hey ${
            props.userData &&
            // @ts-ignore
            (props.userData.first_name || '')
          } 😀️`}
          textStyle={{
            fontSize: RFPercentage(2.2),
          }}
          textContainerStyle={{
            marginTop: 0,
          }}
          style={{
            paddingBottom: 0,
          }}
          showMenu={true}
          showBack={false}
          showDefaultActions={true}
        /> */}

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={false
                // props.loadingGroupSavings ||
                // props.loadingPersonalSavings ||
                // props.loadingWallet
              }
              onRefresh={refresh}
              colors={[Colors.Primary]}
            />
          }>
          {
            //props.loadingWallet 
            false ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-evenly',
                  width: '90%',
                  alignSelf: 'center',
                }}>
                <Placeholder
                  style={[
                    styles.placeholder,
                    {
                      width: '20%',
                      aspectRatio: 1,
                      height: 80,
                      alignSelf: 'center',
                      marginTop: heightPercentageToDP(2),
                      borderRadius: 5,
                    },
                  ]}
                />
                <Placeholder
                  style={[
                    styles.placeholder,
                    {
                      width: '70%',
                      height: 80,
                      alignSelf: 'center',
                      marginTop: heightPercentageToDP(2),
                      borderRadius: 5,
                    },
                  ]}
                />
              </View>
            ) : (
              <>
                {
                  wallet?.balances.map(w => <CardicCardThree
                    top={`Wallet (${w.currency.currencyCode})`}
                    bottom={`${w.currency.currencyCode == "USD" ? Values.DollarSymbol : Values.NairaSymbol} ${Utils.currencyFormat(w.amount, 0)}`}
                  />)
                }
              </>
            )}


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
              // onPress={() => props.navigation.navigate('/learn')}
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

          {
            //props.loadingCourseCategories || props.loadingCourses
            false ? (
              <Placeholder
                style={[
                  styles.placeholder,
                  {
                    width: '90%',
                    height: 20,
                    alignSelf: 'center',
                    marginTop: heightPercentageToDP(2),
                    borderRadius: 20,
                  },
                ]}
              />
            ) :
              // props.courses.length > 0 
              true ? (
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
              ) : undefined}
          <GCCardOne />
          <GCCardOne />
          <GCCardOne />
          <GCCardOne />
          <GCCardOne />
          <GCCardOne />
          <GCCardOne />
        </ScrollView>
      </PlaceholderContainer>
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

export default HomeScreen;

