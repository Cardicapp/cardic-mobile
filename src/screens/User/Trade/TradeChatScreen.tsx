import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Image,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    PermissionsAndroid,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import Colors from 'CardicApp/src/theme/Colors';
import { useNavigation } from '@react-navigation/native';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import { useDispatch, useSelector } from 'react-redux';
import { selectTradeState, setSelectedTrade } from 'CardicApp/src/store/trade';
import { selectAuthState } from 'CardicApp/src/store/auth';
import { TradeChat } from 'CardicApp/src/types/chat';
import { TradeChatTypeEnum, TradeStatusEnum, UserRoleEnum } from 'CardicApp/src/types/enums';
import queryString from 'query-string';
import Utils from 'CardicApp/src/lib/utils/Utils';
import { io } from "socket.io-client";
import TradeEvents from 'CardicApp/src/lib/enums/trade-events.enum';
import Config from "react-native-config";
import { Asset, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import CustomModal from 'CardicApp/src/components/Modal/CustomModal';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import moment from 'moment';

const baseURL = Config.API_URL;

const TradeChatScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { user } = useSelector(selectAuthState);
    const { selectedTrade: trade } = useSelector(selectTradeState);

    const [messages, setMessages] = useState<TradeChat[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [showImagePicker, setShowImagePicker] = useState(false);

    const pageIndex = useRef(1);
    const chatsRef = useRef<FlatList>(null);

    useEffect(() => {
        fetchMessages(() => {
            scrollToBottom(false, 500);
        });
        const socketRes = setupWebsocket();
        return () => {
            socketRes && socketRes();
        };
    }, []);

    const fetchMessages = async (fn: any = undefined, optionalParams?: any) => {
        if (!trade?.id) return;
        setLoadingMessages(true);
        let payload = {
            page: pageIndex.current,
            limit: 50,
            ...optionalParams
        };
        try {
            const res = await axiosExtended.get(`${routes.trade}/chat/${trade?.id}?${queryString.stringify(payload)}`);
            if (res.status === 200) {
                let newChats: TradeChat[] = res.data?.data || [];
                let chats = processMessages(newChats);
                setMessages(chats);
                fn && fn(chats);
            }
        } catch (e) {
            console.log("Fetch Error", e);
        } finally {
            setLoadingMessages(false);
        }
    };

    const processMessages = (newChats: TradeChat[]) => {
        let chats: TradeChat[] = [...messages, ...newChats].map(c => ({
            ...c,
            createdAt: new Date(c.createdAt),
            updatedAt: new Date(c.updatedAt)
        }));
        chats = Utils.uniqueBy<TradeChat>(chats, (chat) => chat.id.toString());
        chats = chats.sort((a, b) => Utils.compare<TradeChat>(a, b, "createdAt"));
        return chats;
    };

    const setupWebsocket = () => {
        const socket = io(baseURL);
        socket.on(`${TradeEvents.chatAdded}:${trade?.id}`, onMessageAdded);
        socket.on(`${TradeEvents.tradeAccepted}:${trade?.id}`, onTradeUpdated);
        socket.on(`${TradeEvents.tradeRejected}:${trade?.id}`, onTradeUpdated);
        return () => {
            socket.removeAllListeners(`${TradeEvents.chatAdded}:${trade?.id}`);
            socket.removeAllListeners(`${TradeEvents.tradeAccepted}:${trade?.id}`);
            socket.removeAllListeners(`${TradeEvents.tradeRejected}:${trade?.id}`);
        };
    };

    const onMessageAdded = (chat: any) => {
        if (chat.from?.id !== user?.id) {
            fetchMessages(() => {
                setTimeout(scrollToBottom, 500);
            });
        }
    };

    const onTradeUpdated = (updatedTrade: any) => {
        dispatch(setSelectedTrade(updatedTrade));
    };

    const scrollToBottom = (animated = true, delay = 0) => {
        setTimeout(() => chatsRef.current?.scrollToEnd({ animated }), delay);
    };

    const sendMessage = async (type: TradeChatTypeEnum = TradeChatTypeEnum.text, assets?: Asset[]) => {
        if (!messageText.trim() && type === TradeChatTypeEnum.text) return;
        setSubmitting(true);

        const data = new FormData();
        if (assets && assets.length) {
            assets.forEach(asset => {
                data.append('images', {
                    name: asset.fileName,
                    type: asset.type,
                    uri: Platform.OS === 'android' ? asset.uri : asset.uri?.replace('file://', ''),
                } as any);
            });
        }
        data.append('message', messageText);
        data.append('tradeId', trade?.id.toString());
        data.append('typeId', type.toString());

        try {
            const res = await axiosExtended.post(`${routes.trade}/chat`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.status === 201) {
                setMessageText('');
                fetchMessages(() => {
                    setTimeout(scrollToBottom, 500);
                });
            }
        } catch (e) {
            console.log(e);
        } finally {
            setSubmitting(false);
        }
    };

    const openCamera = async () => {
        const result = await launchCamera({ mediaType: 'photo' });
        if (!result.didCancel && result.assets) {
            sendMessage(TradeChatTypeEnum.image, result.assets);
        }
    };

    const openGallery = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        if (!result.didCancel && result.assets) {
            sendMessage(TradeChatTypeEnum.image, result.assets);
        }
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={20} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.headerInfo}>
                <Image
                    source={require('CardicApp/src/theme/assets/images/Artboard.png')}
                    style={styles.avatar}
                />
                <View style={styles.headerText}>
                    <AppBoldText style={styles.adminName}>Admin</AppBoldText>
                    <AppText style={styles.onlineStatus}>Online</AppText>
                </View>
            </View>

            <AppText style={styles.headerDate}>
                {moment(trade?.createdAt).format('MMM DD, YYYY')}
            </AppText>
        </View>
    );

    const renderItem = ({ item }: { item: TradeChat }) => {
        const isMe = item.from?.id === user?.id;
        const isAdmin = [UserRoleEnum.admin].includes(item.from?.role.id);

        return (
            <View style={[styles.messageRow, isMe ? styles.rowMe : styles.rowAdmin]}>
                {!isMe && (
                    <Image
                        source={require('CardicApp/src/theme/assets/images/Artboard.png')}
                        style={styles.bubbleAvatar}
                    />
                )}
                <View style={[
                    styles.bubble,
                    isMe ? styles.bubbleMe : styles.bubbleAdmin
                ]}>
                    {item.type.id === TradeChatTypeEnum.image && item.images?.map((img, idx) => (
                        <Image
                            key={idx}
                            source={{ uri: img.path.replace('http', 'https') }}
                            style={styles.msgImage}
                        />
                    ))}
                    {item.message ? (
                        <AppText style={styles.msgText}>{item.message}</AppText>
                    ) : null}
                    <AppText style={styles.msgTime}>
                        {moment(item.createdAt).format('h.mm a')}
                    </AppText>
                </View>
            </View>
        );
    };

    const renderStatus = () => {
        let statusText = "";
        let icon = "ellipsis-horizontal-circle";

        switch (trade?.status?.id) {
            case TradeStatusEnum.active:
                statusText = "This trade is now being processed";
                break;
            case TradeStatusEnum.completed:
                statusText = "Trade Completed Successfully";
                icon = "checkmark-circle";
                break;
            case TradeStatusEnum.rejected:
                statusText = "Trade Rejected";
                icon = "close-circle";
                break;
            default:
                statusText = "Awaiting response";
        }

        return (
            <View style={styles.statusBox}>
                <Ionicons name={icon} size={24} color="#0A8F08" />
                <AppBoldText style={styles.statusText}>{statusText}</AppBoldText>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}

            <FlatList
                ref={chatsRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListFooterComponent={renderStatus()}
                showsVerticalScrollIndicator={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TouchableOpacity onPress={() => setShowImagePicker(true)}>
                            <Ionicons name="image-outline" size={24} color="#999" />
                        </TouchableOpacity>
                        <TextInput
                            placeholder="Type a message..."
                            style={styles.input}
                            value={messageText}
                            onChangeText={setMessageText}
                        />
                        <TouchableOpacity
                            style={styles.sendBtn}
                            onPress={() => sendMessage()}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#FFF" size="small" />
                            ) : (
                                <Ionicons name="send" size={20} color="#FFF" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            <CustomModal
                isVisible={showImagePicker}
                onClose={() => setShowImagePicker(false)}
                autoClose={true}
                title="Share Image"
                actions={[
                    { text: 'Camera', onPress: openCamera, containerStyle: { backgroundColor: Colors.Primary } },
                    { text: 'Gallery', onPress: openGallery, containerStyle: { backgroundColor: Colors.White }, textStyle: { color: Colors.Black } },
                ]}
            />
        </SafeAreaView>
    );
};

export default TradeChatScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 0,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
        flex: 1,
    },
    avatar: { width: 40, height: 40, borderRadius: 20 },
    headerText: { marginLeft: 10 },
    adminName: { fontSize: 16, color: '#000' },
    onlineStatus: { fontSize: 12, color: '#0A8F08' },
    headerDate: { fontSize: 13, color: '#999' },

    listContent: { paddingHorizontal: 20, paddingBottom: 20 },
    messageRow: { flexDirection: 'row', marginVertical: 8, maxWidth: '85%' },
    rowMe: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
    rowAdmin: { alignSelf: 'flex-start' },
    bubbleAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8, alignSelf: 'flex-start' },

    bubble: {
        padding: 12,
        borderRadius: 14,
        position: 'relative',
    },
    bubbleMe: {
        backgroundColor: '#F5FFD2', // Yellowish-green
        borderTopRightRadius: 2,
    },
    bubbleAdmin: {
        backgroundColor: '#E7FCE8', // Light green
        borderTopLeftRadius: 2,
    },
    msgText: { fontSize: 15, color: '#333', lineHeight: 20 },
    msgTime: {
        fontSize: 10,
        color: '#999',
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    msgImage: {
        width: 200,
        height: 150,
        borderRadius: 10,
        marginBottom: 5,
    },

    statusBox: {
        backgroundColor: '#E7FCE8',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#C2EBC4',
    },
    statusText: { marginLeft: 10, fontSize: 15, color: '#000' },

    inputContainer: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 10 : 20,
        backgroundColor: '#FFF',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F1F1',
        borderRadius: 15,
        paddingHorizontal: 15,
        height: 54,
    },
    input: {
        flex: 1,
        marginHorizontal: 10,
        fontSize: 15,
        color: '#000',
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
