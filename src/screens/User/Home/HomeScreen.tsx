import React, {useEffect, useState} from 'react';
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
import {connect} from 'react-redux';
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
import {RFPercentage} from 'react-native-responsive-fontsize';
import {heightPercentageToDP} from 'react-native-responsive-screen';
import Colors from 'CardicApp/src/theme/Colors';
import { Values } from 'CardicApp/src/lib';
import Utils from 'CardicApp/src/lib/utils/Utils';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import CardicCard from 'CardicApp/src/components/Card/CardicCard';
import BlogIcon from 'CardicApp/src/components/Icons/BlogIcon';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
// import SimpleBackHeader from '../../components/SimpleBackHeader';
// import PushNotification from 'react-native-push-notification';

interface Props {
  navigation: any;
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

  // const [updatedWallet, setUpdatedWallet] = useState(false);
  // const [updatedSavings, setUpdatedSavings] = useState(false);
  // const [updatedLearn, setUpdatedLearn] = useState(false);

  useEffect(() => {
    // if (!updatedWallet) {
    //   props.loadWallet();
    //   setUpdatedWallet(true);
    // }
    // if (!updatedSavings) {
    //   props.getPersonalSavings();
    //   props.getGroupSavings();
    //   setUpdatedSavings(true);
    // }

    // if (!updatedLearn) {
    //   getCourses();
    // }
    // props.loadNotifications();
  }, []);

  const getCourses = (shouldLoadCourses: boolean = true) => {
    // props.getCourseCategories(null, null, shouldLoadCourses);
  };

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
        loader={new Promise((resolve) => {})}>
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
            <TouchableOpacity
              onPress={() => {
                // props.navigation.navigate('/wallet');
              }}
              style={{
                marginTop: heightPercentageToDP(2),
                // height: 96,
                width: '90%',
                backgroundColor: Colors.CardicGreyBgOne,
                alignSelf: 'center',
                flexDirection: 'row',
                paddingHorizontal: 15,
                paddingVertical: heightPercentageToDP(3.5),
                borderRadius: 4,
              }}>
              <View
                style={{
                  height: heightPercentageToDP(4),
                  aspectRatio: 1,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Colors.Primary,
                  // shadowColor: 'grey',
                  // elevation: 5,
                }}>
                {/* <SaveIcon
                  height={RFPercentage(2)}
                  width={RFPercentage(2)}
                  pathOneProps={{
                    fill: Colors.White,
                  }}
                  pathTwoProps={{
                    fill: Colors.White,
                  }}
                  style={{
                    marginBottom: 3,
                  }}
                /> */}
              </View>
              <View
                style={{
                  marginLeft: 16,
                }}>
                <AppText
                  style={{
                    color: Colors.HomeBlack,
                  }}>
                  Wallet
                </AppText>
                <AppBoldText
                  style={{
                    color: Colors.HomeBlack,
                    fontSize: RFPercentage(3),
                    marginTop: 3,
                  }}>
                  {Values.NairaSymbol}{' '}
                  {/* {Utils.currencyFormat(wallet.balance || 0, 2)} */}
                </AppBoldText>
              </View>

              <AntDesign
                name="right"
                size={RFPercentage(2.5)}
                color={Colors.Primary}
                style={{
                  marginLeft: 'auto',
                  alignSelf: 'center',
                  // marginBottom: 'auto',
                }}
              />
            </TouchableOpacity>
          )}

          {
          // props.loadingGroupSavings || props.loadingPersonalSavings 
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
          ) : totalGroupAmount + totalPersonalAmount > 0 ? (
            <TouchableOpacity
              onPress={() => {
                // props.navigation.navigate('/save');
              }}
              style={{
                marginTop: 5,
                // height: 96,
                width: '90%',
                backgroundColor: Colors.SavingsLightPrimary,
                alignSelf: 'center',
                flexDirection: 'row',
                paddingHorizontal: 15,
                paddingVertical: heightPercentageToDP(3.5),
                borderRadius: 4,
              }}>
              <View
                style={{
                  height: heightPercentageToDP(4),
                  aspectRatio: 1,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Colors.Primary,
                  // shadowColor: 'grey',
                  // elevation: 5,
                }}>
                {/* <SaveIcon
                  height={RFPercentage(2)}
                  width={RFPercentage(2)}
                  pathOneProps={{
                    fill: Colors.White,
                  }}
                  pathTwoProps={{
                    fill: Colors.White,
                  }}
                /> */}
              </View>
              <View
                style={{
                  marginLeft: 16,
                }}>
                <AppText
                  style={{
                    color: Colors.HomeBlack,
                  }}>
                  You have saved
                </AppText>
                <AppBoldText
                  style={{
                    color: Colors.HomeBlack,
                    fontSize: RFPercentage(3),
                    marginTop: 3,
                  }}>
                  {Values.NairaSymbol}{' '}
                  {Utils.currencyFormat(
                    totalGroupAmount + totalPersonalAmount,
                    2,
                  )}
                </AppBoldText>
              </View>

              <AntDesign
                name="right"
                size={18}
                color={Colors.Primary}
                style={{
                  marginLeft: 'auto',
                  alignSelf: 'center',
                  marginBottom: 20,
                }}
              />
            </TouchableOpacity>
          ) : undefined}

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
                // props.navigation.navigate('/save');
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

export default HomeScreen // connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
