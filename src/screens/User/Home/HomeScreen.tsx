import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import Colors from 'CardicApp/src/theme/Colors';
import { Values } from 'CardicApp/src/lib';
import Utils from 'CardicApp/src/lib/utils/Utils';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import CardicCard from 'CardicApp/src/components/Card/CardicCard';
import BlogIcon from 'CardicApp/src/components/Icons/BlogIcon';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import { selectAuthState, setUserInfo } from 'CardicApp/src/store/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { ApplicationStackParamList } from 'CardicApp/@types/navigation';
import { User } from 'CardicApp/src/types/user';
import { Wallet } from 'CardicApp/src/types/wallet';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import { StatusEnum, UserRoleEnum } from 'CardicApp/src/types/enums';
import WalletCard from 'CardicApp/src/components/Card/WalletCard';
import { Category } from 'CardicApp/src/types/category';
import queryString from 'query-string';
import { setTradeForm } from 'CardicApp/src/store/trade';
import messaging from '@react-native-firebase/messaging';
import { requestNotificationPermission } from 'CardicApp/src/services/notifications/permission';
import Swiper from 'react-native-swiper';
import Toast from 'react-native-toast-message';
import { routeNameRef } from 'CardicApp/src/navigators/Application';
import { setBillForm } from 'CardicApp/src/store/bill';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from 'CardicApp/src/hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Coin from 'CardicApp/src/theme/assets/images/coin.png';
import Banner from 'CardicApp/src/theme/assets/images/banner.png';
import CompleteKYCNotice from './CompleteKyc';

interface Props {
  navigation: StackNavigationProp<ApplicationStackParamList, keyof ApplicationStackParamList, undefined>;
}

const HomeScreen = (props: Props) => {

  const dispatch = useDispatch();
  const authState = useSelector(selectAuthState);
  const [wallet, setWallet] = useState<Wallet>();
  const [popularCards, setPopularCards] = useState<Category[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingCards, setLoadingCards] = useState(false);

  useEffect(() => {
    requestNotificationPermission();
    // Get the device token
    messaging()
      .getToken()
      .then(token => {
        return updateUser({
          fcmToken: token
        });
      });
    // If using other push notification providers (ie Amazon SNS, etc)
    // you may need to get the APNs token instead for iOS:
    // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }
    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
      updateUser({
        fcmToken: token
      });
    });
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async msg => {
      // Alert.alert('A new FCM message arrived!', JSON.stringify(msg));
      if (routeNameRef.current !== "TradeDetailScreen") {
        Toast.show({
          // @ts-ignore
          type: msg.data?.type ?? "info",
          text1: msg.notification?.title,
          text2: msg.notification?.body,
        });
      }
    });

    return unsubscribe;
  }, []);

  const updateUser = async (payload: any) => {
    if (!authState.user) console.log("User not logged in. Can not register user")
    // console.log("Registering token...")
    try {
      const res = await axiosExtended.patch(`${routes.users}/${authState.user?.id}`, payload)
      if (res.status === 200) {
        // console.log("FCM token saved")
      }
    } catch (e) {
      console.log(JSON.stringify(e, null, 5))
    }
  }

  const getUserInfo = async () => {
    try {
      setLoading(true)
      const res = await axiosExtended.get(`${routes.users}/${authState.user?.id}`);
      if (res.status === 200) {
        const usr = res.data;
        dispatch(setUserInfo(usr))
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

  const getPopularGiftCards = async () => {
    try {
      setLoadingCards(true)
      let payload = {
        page: 1,
        limit: 5,
        status: StatusEnum.active,
      }
      const res = await axiosExtended.get(`${routes.categories}?${queryString.stringify(payload)}`);
      if (res.status === 200) {
        const cats = res.data.data;
        setPopularCards(cats)
      }
    } catch (e) {
      console.error(e)
      console.log(JSON.stringify(e, null, 5))
    } finally {
      setLoadingCards(false)
    }
  }
  useEffect(() => {
    loadPage();
  }, [])

  const loadPage = () => {
    getUserInfo();
    getPopularGiftCards();
  };

  const {
    Images
  } = useTheme()


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadPage}
            colors={[Colors.Primary]}
          />
        }
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginTop: 10,
            marginBottom: 15,
          }}
        >
          {/* Avatar */}
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            onPress={() => {
              // @ts-ignore
              props.navigation.navigate('ProfileScreen');
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                flexDirection: 'row',
                backgroundColor: Colors.IconGrey,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <FontAwesome5 name="user" size={18} color={Colors.Black} />

            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <AppText
                style={{
                  fontSize: RFPercentage(2),
                  color: Colors.Black,
                }}
              >Welcome</AppText>
              <AppBoldText
                style={{
                  fontSize: RFPercentage(2.5),
                  color: Colors.Black,
                }}
              >
                {authState.user?.firstName}
              </AppBoldText>
            </View>

          </TouchableOpacity>


          {/* Notification */}
          <TouchableOpacity
            onPress={() => {
              // @ts-ignore
              props.navigation.navigate("NotificationScreen");
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: Colors.IconGrey,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="notifications-outline" size={20} color={Colors.Black} />
            </View>
          </TouchableOpacity>
        </View>


        {
          wallet?.balances
            ?.filter(w => w.currency.currencyCode === 'NGN')
            .map((w, i) => (
              <WalletCard
                key={i}
                containerStyle={{
                  backgroundColor: Colors.Primary,
                }}
                // onPress={() => {
                //   // @ts-ignore
                //   props.navigation.navigate("Wallet");
                // }}
                // top={`Wallet (${w.currency.currencyCode})`}
                bottom={`${Values.NairaSymbol} ${Utils.currencyFormat(w.amount, 0)}`}
              />
            ))
        }


/* ================= KYC NOTICE ================= */
        {
          // authState.user?.kycStatus !== StatusEnum.approved && (
          <CompleteKYCNotice
            onPress={() => {
              // @ts-ignore
              props.navigation.navigate('KycScreen');
            }}
          />
          // )
        }

        {/* <View
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
        </View> */}

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
            containerStyle={{
              backgroundColor: Colors.LemonYellow,
              borderRadius: 12,
              elevation: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              // @ts-ignore
              props.navigation.push('CategoriesScreen');
            }}
            text="Trade GiftCard"
            textStyle={{
              color: Colors.Black,
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 8,

            }}
            icon={
              <Image
                source={Images.artboard1}
                style={{
                  width: 58,
                  height: 58,
                  resizeMode: 'contain',
                }}
              />
            }
            iconContainerStyle={{
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />

          <CardicCard
            key="1"
            containerStyle={{
              backgroundColor: Colors.CardGrey,
              borderRadius: 12,
              elevation: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              // @ts-ignore
              props.navigation.push('CategoriesScreen');
            }}
            text="Trade Crypto"
            textStyle={{
              color: Colors.White,
              textAlign: 'center',
              marginTop: 8,
              marginBottom: 8,
            }}
            icon={
              <Image
                source={Images.artboard2}
                style={{
                  width: 58,
                  height: 58,
                  resizeMode: 'contain',
                }}
              />
            }
          // iconContainerStyle={{
          //   width: 44,
          //   height: 44,
          //   borderRadius: 22,
          //   alignItems: 'center',
          //   justifyContent: 'center',
          // }}
          />


        </View>

        <Swiper
          height={160}
          containerStyle={{
            marginTop: 30,
          }}
          showsPagination
          // autoplay
          // autoplayTimeout={4}
          dotStyle={{
            width: 30,
            height: 5,
            borderRadius: 5,
            marginHorizontal: 3,
            backgroundColor: Colors.PrimaryBGLight,
          }}
          activeDotStyle={{
            width: 30,
            height: 5,
            borderRadius: 5,
            marginHorizontal: 3,
            backgroundColor: Colors.Primary,
          }}
          dotColor={Colors.Primary}
          activeDotColor={Colors.PrimaryBGLight}
        >
          {/* Slide 1 */}
          <View
            style={{
              // marginTop: 20,
              marginHorizontal: 20,
              backgroundColor: Colors.Black,
              borderRadius: 20,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                // borderRadius: 25,
                // backgroundColor: '#FFD700',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={Coin}
                style={{
                  width: 100,
                  height: 100,
                  marginRight: 9,
                  resizeMode: 'contain',
                }}
              />
            </View>

            <View style={{ flex: 1, gap: 5 }}>
              <AppBoldText style={{ color: Colors.White }}>
                Refer and Earn
              </AppBoldText>

              <AppText style={{ color: Colors.White, fontSize: 10 }}>
                Refer a friend to earn points once they make a transaction
              </AppText>

              <TouchableOpacity style={{ marginTop: 8 }}>
                <AppText style={{ color: Colors.White, fontSize: 12, fontWeight: 'bold' }}>
                  Learn More →
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Slide 2 (example) */}
          <View
            style={{
              marginHorizontal: 20,
              backgroundColor: Colors.LiveRateCalculator,
              borderRadius: 20,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 15,
            }}
          >


            <View style={{ flex: 1, gap: 5 }}>
              <AppBoldText style={{ color: Colors.White, fontWeight: 'bold' }}>
                Live Rate Calculator
              </AppBoldText>

              <AppText style={{ color: Colors.White, fontSize: 12 }}>
                Check updated giftcard and crypto rates
              </AppText>

              <TouchableOpacity style={{ marginTop: 8 }}>
                <AppText style={{ color: Colors.White, fontSize: 12, fontWeight: 'bold' }}>
                  Learn More →
                </AppText>
              </TouchableOpacity>
            </View>
            <View
              style={{
                width: 50,
                height: 50,
                // borderRadius: 25,
                // backgroundColor: '#9CFF2E',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Image
                source={Banner}
                style={{
                  width: 108,
                  height: 108,
                  resizeMode: 'contain',
                }}
              />
            </View>
          </View>
        </Swiper>

        {/* {
          loading || popularCards.length ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                marginTop: heightPercentageToDP(2),
                marginBottom: 5,
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
                  // @ts-ignore
                  props.navigation.push('CategoriesScreen');
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
          ) : undefined
        }

        {
          popularCards && popularCards.length ? popularCards.map((c, i) =>
            <GCCardOne
              key={i}
              name={c.name}
              cta='Trade'
              image={c.photo.path}
              // rate={`${Values.NairaSymbol} ${Utils.currencyFormat(t.amount, 0)}`}
              onPress={() => {
                dispatch(setTradeForm({ category: c }));
                // @ts-ignore
                props.navigation.push("CreateTradeScreen");
              }}
              containerStyle={{
                backgroundColor: Colors.PrimaryBGLight,
              }}
            />) :
            loading ?
              <AppText
                style={{
                  textAlign: 'center',
                  letterSpacing: 0,
                  marginTop: '1%',
                }}>
                Loading...
              </AppText>
              : undefined

        } */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

