import AppText from 'CardicApp/src/components/AppText/AppText';
import ButtonOne from 'CardicApp/src/components/ButtonOne';
import GCCardOne from 'CardicApp/src/components/Card/GCCardOne';
import LoadingGradient from 'CardicApp/src/components/LoadingGradient/LoadingGradient';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import TextContainer from 'CardicApp/src/components/TextContainer/TextContainer';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
import { Values } from 'CardicApp/src/lib';
import Colors from 'CardicApp/src/theme/Colors';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import ChatMessage from 'CardicApp/src/components/Chat/ChatMessage';
import InfoRow from 'CardicApp/src/components/InfoRow/InfoRow';
import Utils from 'CardicApp/src/lib/utils/Utils';
import { useSelector } from 'react-redux';
import { selectTradeState } from 'CardicApp/src/store/trade';
import { TradeChat } from 'CardicApp/src/types/chat';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import queryString from 'query-string';
import { TradeChatTypeEnum, TradeStatusEnum } from 'CardicApp/src/types/enums';
import { io } from "socket.io-client";
import TradeEvents from 'CardicApp/src/lib/enums/trade-events.enum';
import Config from "react-native-config";
import { selectAuthState } from 'CardicApp/src/store/auth';

const baseURL = Config.API_URL;



interface Props {
  navigation: any;
}

const TradeDetailScreen
  = (props: Props) => {
    const {
    } = props;
    const { user } = useSelector(selectAuthState);
    const { selectedTrade: trade } = useSelector(selectTradeState);
    const [showDetail, setShowDetail] = useState(false);
    const [messages, setMessages] = useState<TradeChat[]>([])
    const pageIndex = useRef(1);
    const chatsRef = useRef<FlatList<TradeChat>>(null);

    const [loadingMessages, setLoadingMessages] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({
      text: '',
      images: []
    });

    const fetchMessages = async (fn: any = undefined, optionalParams?: any) => {
      console.log("fetchMessages Called")
      setLoadingMessages(true)
      let payload = {
        page: pageIndex.current,
        limit: 20,
        ...optionalParams
      };
      try {
        const res = await axiosExtended.get(`${routes.trade}/chat/${trade?.id}?${queryString.stringify(payload)}`);
        if (res.status === 200) {
          let newChats: TradeChat[] = res.data?.data;
          let chats = processMessages(newChats);
          setMessages(chats)
          fn && fn(chats);
        }
      } catch (e) {
        console.log(e)
      } finally {
        setLoadingMessages(false)
      }
    }

    const processMessages = (newChats: TradeChat[], removeDuplicate: boolean = true) => {
      let chats: TradeChat[] = [...messages, ...newChats].map(c => ({ ...c, createdAt: new Date(c.createdAt), updatedAt: new Date(c.updatedAt), }));
      if (removeDuplicate) chats = Utils.uniqueBy<TradeChat>(chats, (chat) => chat.id.toString());
      chats = chats.sort((a, b) => Utils.compare<TradeChat>(a, b, "createdAt"))
      return chats;
    }


    useEffect(() => {
      fetchMessages(() => {
        scrollToBottom();
      });
      const socketRes = setupWebsocket();
      return () => {
        socketRes && socketRes();
      }
    }, [])
    console.log("Messages length", messages.length)

    const refresh = () => {

    };

    const createFormData = (type: TradeChatTypeEnum, images: any[]) => {
      const data = new FormData();

      if (images && images.length) {
        for (let i = 0; i < images.length; i++) {
          data.append('images', images[i])
        }
      }
      data.append('message', message.text);
      data.append('tradeId', trade?.id.toString());
      data.append('typeId', type.toString());
      return data;
    };
    const sendMessage = async (type: TradeChatTypeEnum = TradeChatTypeEnum.text, images?: any[]) => {
      setSubmitting(true)
      // @ts-ignore
      let payload = createFormData(type, images);
      try {
        const res = await axiosExtended.post(`${routes.trade}/chat`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log("Res", res)
        if (res.status === 201) {
          setMessage({ images: [], text: '' })
          fetchMessages(() => {
            setTimeout(scrollToBottom, 500);
          });
        }
      } catch (e) {
        console.log(e)
      } finally {
        setSubmitting(false)
      }
    }

    const scrollToBottom = () => {
      setTimeout(() => chatsRef.current?.scrollToEnd({ animated: true }), 1000)
    }

    const setupWebsocket = () => {
      const socket = io(baseURL);
      socket.on(`${TradeEvents.chatAdded}:${trade?.id}`, onMessageAdded)
      return () => {
        socket.off(`${TradeEvents.chatAdded}:${trade?.id}`, onMessageAdded)
        socket.removeAllListeners(`${TradeEvents.chatAdded}:${trade?.id}`)
      }
    }

    const onMessageAdded = (chat: any) => {
      // console.log("Messages:", messages.length)
      // setMessages([...messages, chat]);
      if (chat.from?.id != user?.id)
        fetchMessages(() => {
          setTimeout(scrollToBottom, 500);
        });

    }

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>

        <FlatList
          ref={chatsRef}
          style={{
            backgroundColor: Colors.ChatBg,
          }}
          refreshControl={
            <RefreshControl
              refreshing={loadingMessages}
              onRefresh={refresh}
              colors={[Colors.Primary]}
            />
          }
          data={messages}
          renderItem={({ item, index }) =>
            <ChatMessage
              key={item.id}
              chat={item}
            />
          }
          ListHeaderComponentStyle={{
            marginBottom: 10,
            backgroundColor: Colors.White,
          }}
          ListHeaderComponent={
            <View>
              <SimpleBackHeader
                text={`Trade Status: ${renderStatus(trade?.status.id)}`}
                showBack={false}
                showMenu={false}
                centered={false}
                actions={[
                  <TouchableOpacity
                    onPress={() => props.navigation.pop()}
                  >
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
              <TouchableOpacity
                onPress={() => setShowDetail(!showDetail)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between'
                }}>
                <View
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
                </View>

                <View
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
                </View>
              </TouchableOpacity>
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
                      value={`#${trade?.id}`}
                      containerStyle={{
                        marginBottom: 10
                      }}
                    />
                    <InfoRow
                      title='Name of Gift card'
                      value={trade?.subCategory.category.name ?? ''}
                      containerStyle={{
                        marginBottom: 10
                      }}
                    />
                    <InfoRow
                      title='Sub Category'
                      value={trade?.subCategory.name ?? ''}
                      containerStyle={{
                        marginBottom: 10
                      }}
                    />
                    <InfoRow
                      title='No. of Gift Cards'
                      value={`${trade?.noOfCards}`}
                      containerStyle={{
                        marginBottom: 10
                      }}
                    />
                    <InfoRow
                      title='Est. Amount'
                      value={`${Values.NairaSymbol} ${Utils.currencyFormat(trade?.amount ?? 0)}`}
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
          <TouchableOpacity
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
          </TouchableOpacity>
          <TextInputOne
            value={message.text}
            placeholder='Type message here...'
            containerStyle={{
              width: '75%',
              alignSelf: 'center',
              marginTop: 0,
              // backgroundColor: 'blue'
            }}
            inputStyle={{
              // backgroundColor: 'red'
            }}
            onChange={(val) => {
              setMessage({
                ...message,
                text: val
              })
            }}
          />
          <TouchableOpacity
            style={{
              padding: 12,
              backgroundColor: Colors.Primary,
              borderRadius: 5,
              alignSelf: "flex-end",
            }}
            onPress={() => message.text && !submitting && sendMessage(TradeChatTypeEnum.text)}
          >
            {
              submitting ?
                <ActivityIndicator
                  size={RFPercentage(2.8)}
                  color={Colors.White}
                /> :
                <Feather
                  name="send"
                  size={RFPercentage(2.8)}
                  color={Colors.White}
                />
            }


          </TouchableOpacity>
        </View>

      </SafeAreaView >
    );
  };

const renderStatus = (status: TradeStatusEnum) => {
  switch (status) {
    case TradeStatusEnum.created:
    case TradeStatusEnum.active:
      return 'Ongoing'
    case TradeStatusEnum.accepted:
      return 'Accepted'
    case TradeStatusEnum.rejected:
      return 'Rejected'

    default:
      break;
  }
}

export default TradeDetailScreen

