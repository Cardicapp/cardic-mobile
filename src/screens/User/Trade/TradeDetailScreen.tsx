import AppText from 'CardicApp/src/components/AppText/AppText';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
import { Values } from 'CardicApp/src/lib';
import Colors from 'CardicApp/src/theme/Colors';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  KeyboardAvoidingView
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import ChatMessage from 'CardicApp/src/components/Chat/ChatMessage';
import InfoRow from 'CardicApp/src/components/InfoRow/InfoRow';
import Utils from 'CardicApp/src/lib/utils/Utils';
import { useDispatch, useSelector } from 'react-redux';
import { selectTradeState, setSelectedTrade } from 'CardicApp/src/store/trade';
import { TradeChat } from 'CardicApp/src/types/chat';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import queryString from 'query-string';
import { TradeChatTypeEnum, TradeStatusEnum, UserRoleEnum } from 'CardicApp/src/types/enums';
import { io } from "socket.io-client";
import TradeEvents from 'CardicApp/src/lib/enums/trade-events.enum';
import Config from "react-native-config";
import { selectAuthState } from 'CardicApp/src/store/auth';
import { Asset, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CustomModal from 'CardicApp/src/components/Modal/CustomModal';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Trade } from 'CardicApp/src/types/trade';
// import ImageViewer from 'react-native-image-zoom-viewer';
import { CameraRoll } from "@react-native-camera-roll/camera-roll";
import * as RNFS from 'react-native-fs';
import SimpleToast from 'react-native-simple-toast';
import ImageView from "react-native-image-viewing";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
    const [showDetail, setShowDetail] = useState(true);
    const [messages, setMessages] = useState<TradeChat[]>([])
    const pageIndex = useRef(1);
    const chatsRef = useRef<FlatList<TradeChat>>(null);
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({
      text: '',
      images: []
    });
    const [showTradeSuccessModal, setShowTradeSuccessModal] = useState(false);
    const [showTradeFailedModal, setShowTradeFailedModal] = useState(false);

    const [showImageOptions, setShowImageOptions] = useState(false)
    const [currentImage, setCurrentImage] = useState(0);
    const [images, setImages] = useState<any[]>([]);
    const [isViewerOpen, setIsViewerOpen] = useState(false);

    const dispatch = useDispatch();


    const closeImageViewer = () => {
      setCurrentImage(0);
      setIsViewerOpen(false);
    };

    const fetchMessages = async (fn: any = undefined, optionalParams?: any) => {
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
        scrollToBottom(false, 500);
      });
      const socketRes = setupWebsocket();
      return () => {
        socketRes && socketRes();
      }
    }, [])

    const openCamera = async () => {
      const result = await launchCamera({
        mediaType: 'photo',
      });
      processImageResponse(result);
    }

    const openGallery = async () => {
      const result = await launchImageLibrary({
        mediaType: 'photo',
      });
      processImageResponse(result);
    }

    const processImageResponse = (res: ImagePickerResponse) => {
      if (!res.didCancel) {
        const assets = res.assets?.map(a => ({ ...a, base64: undefined }))
        sendMessage(TradeChatTypeEnum.image, assets)
      }
    }

    const createFormData = (type: TradeChatTypeEnum, images: Asset[]) => {
      const data = new FormData();

      if (images && images.length) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i]
          data.append('images', {
            name: image.fileName,
            type: image.type,
            uri:
              Platform.OS === 'android'
                ? image.uri
                : image.uri?.replace('file://', ''),
          },
            //@ts-ignore
            'file',
          )
        }
      }
      data.append('message', message.text);
      data.append('tradeId', trade?.id.toString());
      data.append('typeId', type.toString());
      return data;
    };
    const sendMessage = async (type: TradeChatTypeEnum = TradeChatTypeEnum.text, images?: Asset[]) => {
      setSubmitting(true)
      // @ts-ignore
      let payload = createFormData(type, images);
      try {
        const res = await axiosExtended.post(`${routes.trade}/chat`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
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

    const scrollToBottom = (animated = true, delay = 0) => {
      setTimeout(() => chatsRef.current?.scrollToEnd({ animated }), delay)
    }

    const setupWebsocket = () => {
      // @ts-ignore
      const socket = io(baseURL);
      socket.on(`${TradeEvents.chatAdded}:${trade?.id}`, onMessageAdded)
      socket.on(`${TradeEvents.tradeAccepted}:${trade?.id}`, onTradeAccepted)
      socket.on(`${TradeEvents.tradeRejected}:${trade?.id}`, onTradeRejected)
      return () => {
        socket.removeAllListeners(`${TradeEvents.chatAdded}:${trade?.id}`)
        socket.removeAllListeners(`${TradeEvents.tradeAccepted}:${trade?.id}`)
        socket.removeAllListeners(`${TradeEvents.tradeRejected}:${trade?.id}`)
      }
    }

    const onMessageAdded = (chat: any) => {
      if (chat.from?.id != user?.id)
        fetchMessages(() => {
          setTimeout(scrollToBottom, 500);
        });
    }

    const onTradeAccepted = (trade: Trade) => {
      dispatch(setSelectedTrade(trade));
      setShowTradeSuccessModal(true);
    }

    const onTradeRejected = (trade: Trade) => {
      dispatch(setSelectedTrade(trade));
      setShowTradeFailedModal(true);
    }


    async function hasAndroidPermission() {
      const getCheckPermissionPromise = () => {
        // @ts-ignore
        if (Platform.Version >= 33) {
          return Promise.all([
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
          ]).then(
            ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
              hasReadMediaImagesPermission && hasReadMediaVideoPermission,
          );
        } else {
          return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        }
      };

      const hasPermission = await getCheckPermissionPromise();
      if (hasPermission) {
        return true;
      }
      const getRequestPermissionPromise = () => {
        // @ts-ignore
        if (Platform.Version >= 33) {
          return PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          ]).then(
            (statuses) =>
              statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
              PermissionsAndroid.RESULTS.GRANTED &&
              statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
              PermissionsAndroid.RESULTS.GRANTED,
          );
        } else {
          return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE).then((status) => status === PermissionsAndroid.RESULTS.GRANTED);
        }
      };

      return await getRequestPermissionPromise();
    }

    async function savePicture(uri: any) {
      if (Platform.OS === "android" && !(await hasAndroidPermission())) {
        return;
      }
      let imagePath = `${RNFS.DocumentDirectoryPath}/${new Date().toISOString()}.jpg`.replace(/:/g, '-');
      try {
        const res = await RNFS.downloadFile({
          fromUrl: uri,
          toFile: imagePath,
        }).promise
        // console.log('The file downloaded to ', res.statusCode)
        try {
          await CameraRoll.saveAsset(imagePath)
          showToast('Image saved successfully')
        } catch (err) {
          // console.error("CameraRoll", err)
          showToast('Failed to save image')
        }
      } catch (err: any) {
        console.log('ERROR: image file write failed!!!');
        console.log(err.message, err.code);
        showToast('Failed to download image')
        return
      }
    };

    function showToast(msg: string) {
      if (Platform.OS == 'android') {
        SimpleToast.show(msg, 3000)
      } else {
        SimpleToast.showWithGravity(msg, SimpleToast.SHORT, SimpleToast.BOTTOM)
      }
    }

    const renderInput = () => {
      return (
        [UserRoleEnum.admin].includes(user?.role.id ?? -1) || [TradeStatusEnum.created, TradeStatusEnum.active].includes(trade?.status.id) ?
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              // marginBottom: 10,
            }}
            keyboardVerticalOffset={heightPercentageToDP(7)}
          >
            <TouchableOpacity
              onPress={() => setShowImagePicker(true)}
              style={{
                padding: 12,
                backgroundColor: Colors.Primary,
                borderRadius: 5,
                alignSelf: "flex-end",
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
                marginBottom: 0,
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
          </KeyboardAvoidingView>
          : undefined
      );
    }

    const renderHeader = () => {
      return (
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
                  value={trade?.subCategory.name ? `${trade?.subCategory.name} (${trade?.subCategory.minAmount} - ${trade?.subCategory.maxAmount})` : ''}
                  containerStyle={{
                    marginBottom: 10
                  }}
                />
                <InfoRow
                  title='Card Amount'
                  value={`N${Utils.currencyFormat(trade?.cardAmount ?? 0, 0)}`}
                  containerStyle={{
                    marginBottom: 10
                  }}
                />
                <InfoRow
                  title='Rate'
                  value={`${Values.NairaSymbol}${Utils.currencyFormat(trade?.currentRate ?? 0, 0)}/${Values.DollarSymbol}`}
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
      );
    }

    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: Colors.White,
        }}>
        {/* {
          Platform.OS == 'ios' ?
            <>
              {renderHeader()}
              <KeyboardAwareScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                contentContainerStyle={{
                  paddingBottom: 20,
                  backgroundColor: Colors.White,
              }}
              >
                {
                  messages.map((m, index) => {
                    return (
                      <ChatMessage
                        key={m.id}
                        chat={m}
                        onClickImage={(chat, index) => {
                          setCurrentImage(index)
                          setImages(chat.images?.map(i => {
                            return {
                              uri: i.path.replace('http', 'https'),
                            }
                          }) ?? [])
                          setShowImageOptions(true);
                          // setIsViewerOpen(true)
                        }}
                      />
                    );
                  })
                }
              </KeyboardAwareScrollView>
            </>
            : undefined
        } */}
        {/* {renderInput()} */}

        <FlatList
          // inverted={true}
          keyExtractor={(item) => item.id.toString()}
          ref={chatsRef}
          style={{
            // backgroundColor: Colors.ChatBg,
            // backgroundColor: 'red'
          }}
          data={messages}
          renderItem={({ item, index }) =>
            <ChatMessage
              key={item.id}
              chat={item}
              onClickImage={(chat, index) => {
                setCurrentImage(index)
                setImages(chat.images?.map(i => {
                  return {
                    uri: i.path.replace('http', 'https'),
                  }
                }) ?? [])
                setShowImageOptions(true);
                // setIsViewerOpen(true)
              }}
            />
          }
          ListHeaderComponentStyle={{
            marginBottom: 10,
            backgroundColor: Colors.White,
          }}
          ListHeaderComponent={renderHeader()}
          stickyHeaderIndices={[0]}
        // ListFooterComponent={Platform.OS == 'ios' ? renderInput() : undefined}
        // ListFooterComponentStyle={{
        //   backgroundColor: 'red',
        //   // marginTop: heightPercentageToDP(75),
        //   position: 'absolute',
        //   bottom: 0,
        //   // height: 300
        // }}
        />
        {
          // Platform.OS == 'android' 
          // true
          // ? 
          renderInput()
          // : undefined
        }

        <CustomModal
          isVisible={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          autoClose={true}
          title="Share Gift Card"
          titleStyle={{
            marginTop: 5,
          }}
          content="Select a photo or open the camera"
          contentStyle={{
            fontWeight: '400',
            fontSize: 13,
            marginTop: heightPercentageToDP(0.8),
            lineHeight: 18,
            marginVertical: 0,
          }}
          icon={
            <View
              style={{
                height: 63,
                aspectRatio: 1,
                backgroundColor: Colors.Primary,
                borderRadius: 100,
              }}
            />
          }
          actions={[
            {
              text: 'Camera',
              onPress: openCamera,
              containerStyle: {
                backgroundColor: Colors.Primary,
              },
            },
            {
              text: 'Gallery',
              onPress: openGallery,
              containerStyle: {
                backgroundColor: Colors.White,
              },
              textStyle: {
                color: Colors.Black,
              },
            },

          ]}
        />

        <CustomModal
          isVisible={showTradeSuccessModal}
          onClose={() => setShowTradeSuccessModal(false)}
          content="Trade Completed Successfully"
          contentStyle={{
            fontWeight: '400',
            fontSize: 13,
            marginTop: heightPercentageToDP(0.8),
            lineHeight: 18,
            marginVertical: 0,
          }}
          icon={
            <View style={{
              height: heightPercentageToDP(8), aspectRatio: 1, borderRadius: 100, backgroundColor: Colors.Primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <AntDesign
                name="check"
                size={RFPercentage(3)}
                color={Colors.White}
              />
            </View>
          }
          actions={[
            {
              text: 'Proceed to Dashboard',
              onPress: () => {
                props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'BottomTab' }]
                })
              },
              containerStyle: {
                backgroundColor: Colors.Primary,
                marginTop: 10
              },
            },
            {
              text: 'Close',
              onPress: () => setShowTradeSuccessModal(false),
              containerStyle: {
                backgroundColor: Colors.White,
              },
              textStyle: {
                color: Colors.Black,
              },
            },

          ]}
        />

        <CustomModal
          isVisible={showTradeFailedModal}
          onClose={() => setShowTradeFailedModal(false)}
          content="Trade Failed"
          contentStyle={{
            fontWeight: '400',
            fontSize: 13,
            marginTop: heightPercentageToDP(0.8),
            lineHeight: 18,
            marginVertical: 0,
          }}
          icon={
            <View style={{
              height: heightPercentageToDP(8), aspectRatio: 1, borderRadius: 100, backgroundColor: Colors.Red,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <Feather
                name="x"
                color={Colors.White}
                size={RFPercentage(3)}
              />
            </View>
          }
          actions={[
            {
              text: 'Close',
              onPress: () => setShowTradeFailedModal(false),
              containerStyle: {
                backgroundColor: Colors.White,
              },
              textStyle: {
                color: Colors.Black,
                marginTop: 10
              },
            },

          ]}
        />

        <ImageViewerModal
          currentIndex={currentImage}
          visible={isViewerOpen}
          images={images}
          transparent={true}
          onClose={closeImageViewer}
          onSave={(uri) => {
            savePicture(uri)
          }}
          onChange={(index) => setCurrentImage(index)}
        />

        <CustomModal
          isVisible={showImageOptions}
          onClose={() => setShowImageOptions(false)}
          // content=""
          // contentStyle={{
          //   fontWeight: '400',
          //   fontSize: 13,
          //   marginTop: heightPercentageToDP(0.8),
          //   lineHeight: 18,
          //   marginVertical: 0,
          // }}

          actions={[
            {
              text: 'Open',
              onPress: () => {

                if (Platform.OS == 'ios') {
                  setShowImageOptions(false)
                  setTimeout(() => setIsViewerOpen(true), 2000)
                } else {
                  setIsViewerOpen(true)
                }

              },
              containerStyle: {
                backgroundColor: Colors.Primary,
                marginTop: 10
              },
            },
            {
              text: 'Save Image',
              onPress: () => {
                savePicture(images[currentImage].uri)
              },
              containerStyle: {
                backgroundColor: Colors.Primary,
                marginTop: 10
              },
            },
            {
              text: 'Cancel',
              onPress: () => setShowImageOptions(false),
              containerStyle: {
                backgroundColor: Colors.White,
              },
              textStyle: {
                color: Colors.Black,
              },
            },

          ]}
        />


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

interface ImageViewerModalProps {
  visible: boolean;
  currentIndex: number;
  images: any[];
  transparent: boolean;
  onClose: () => void;
  onSave?: (uri: string) => void;
  onChange: (index: number) => void;
}

const ImageViewerModal = (props: ImageViewerModalProps) => {
  const {
    currentIndex,
    images,
    visible,
    transparent,
    onClose,
    onSave,
    onChange
  } = props;
  return (
    <ImageView
      images={images}
      imageIndex={currentIndex}
      visible={visible}
      onRequestClose={() => onClose()}
      onImageIndexChange={onChange}
      swipeToCloseEnabled={true}
      HeaderComponent={() => {
        return (
          <SafeAreaView
            style={{
              flexDirection: 'row',
              paddingTop: 10,
              paddingRight: '3%',
              alignItems: 'center',
              justifyContent: 'flex-end'
            }}>
            <TouchableOpacity
              onPress={() => {
                onSave && onSave(images[currentIndex].uri)
              }}
              accessibilityHint='Save'
              style={{
                marginRight: '2%',
              }}>
              <AntDesign
                name="save"
                size={RFPercentage(3)}
                color={Colors.White}
                style={{
                  // backgroundColor: Colors.Primary,
                  padding: 5,
                  borderRadius: 50,
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              accessibilityHint='Close'
              onPress={() => {
                onClose()
              }}
              style={{
                // backgroundColor: Colors.Primary,
              }}
            >
              <AntDesign
                name="close"
                size={RFPercentage(3)}
                color={Colors.White}
                style={{
                  // backgroundColor: Colors.Primary,
                  padding: 5,
                  borderRadius: 50,
                }}
              />
            </TouchableOpacity>
          </SafeAreaView>
        )
      }}
    />
  )

}

export default TradeDetailScreen

