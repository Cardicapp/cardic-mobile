import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import {
    useGetTradeMessagesQuery,
    useSendMessageMutation,
    useUploadTradeImageMutation,
    useGetTradeByIdQuery
} from '../../../services/modules/trades';
import AppText, { AppBoldText } from '../../../components/AppText/AppText';
import Colors from '../../../theme/Colors';



const TradeChatScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { tradeId } = route.params || {};

    const [message, setMessage] = useState('');

    // API Hooks
    const { data: messages = [] } = useGetTradeMessagesQuery(tradeId, { skip: !tradeId });
    const { data: trade } = useGetTradeByIdQuery(tradeId, { skip: !tradeId });
    const [sendMessage] = useSendMessageMutation();
    const [uploadImage] = useUploadTradeImageMutation();

    const tradeStatus = trade?.status; // 'success' | 'failure' | 'ongoing'

    const handleSend = async () => {
        if (!message.trim() || !tradeId) return;

        try {
            await sendMessage({ tradeId, text: message }).unwrap();
            setMessage('');
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const handleAttach = async () => {
        if (!tradeId) return;
        const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 1 });
        if (result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const formData = new FormData();
            formData.append('image', {
                uri: asset.uri,
                type: asset.type,
                name: asset.fileName,
            });

            try {
                await uploadImage({ tradeId, formData }).unwrap();
            } catch (err) {
                console.error("Failed to upload image", err);
            }
        }
    };

    const renderMessage = ({ item }: any) => {
        if (item.type === 'system') {
            return (
                <View style={styles.systemMessageContainer}>
                    <View style={styles.systemMessageBubble}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="ellipsis-horizontal" size={16} color="#FFF" />
                        </View>
                        <AppBoldText style={styles.systemMessageText}>{item.text}</AppBoldText>
                    </View>
                </View>
            );
        }

        const isMe = item.sender === 'me';
        return (
            <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.otherMessageRow]}>
                {!isMe && (
                    <Image
                        source={{ uri: 'https://via.placeholder.com/40' }} // Avatar placeholder
                        style={styles.avatarSmall}
                    />
                )}
                <View style={[styles.bubble, isMe ? styles.myBubble : styles.otherBubble]}>
                    {item.type === 'image' ? (
                        <Image source={{ uri: item.image }} style={styles.messageImage} />
                    ) : (
                        <AppText style={styles.messageText}>{item.text}</AppText>
                    )}
                    <AppText style={styles.timeText}>{item.time}</AppText>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.headerProfile}>
                    <View>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/40' }}
                            style={styles.headerAvatar}
                        />
                        <View style={styles.onlineDot} />
                    </View>

                    <View>
                        <AppBoldText style={styles.headerName}>Greg Orangeman</AppBoldText>
                        <AppText style={styles.headerStatus}>Online</AppText>
                    </View>
                </View>

                <AppText style={styles.headerDate}>Nov 10,2025</AppText>
            </View>

            {/* CHAT LIST */}
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.chatList}
                showsVerticalScrollIndicator={false}
            />

            {/* STATUS CARD */}
            {tradeStatus === 'success' && (
                <View style={styles.statusCardSuccess}>
                    <View style={styles.statusIconSuccess}>
                        <Ionicons name="add" size={20} color="#FFF" />
                    </View>
                    <AppText style={styles.statusText}>
                        Your trade was successful, your cardic wallet has been credited.
                    </AppText>
                </View>
            )}

            {tradeStatus === 'failure' && (
                <View style={styles.statusCardFailure}>
                    <View style={styles.statusIconFailure}>
                        <Ionicons name="close" size={20} color="#FFF" />
                    </View>
                    <AppText style={styles.statusText}>
                        Your trade failed. Please check the details and try again.
                    </AppText>
                </View>
            )}

            {/* INPUT AREA */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachBtn} onPress={handleAttach}>
                        <Ionicons name="image-outline" size={24} color="#888" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message..."
                        placeholderTextColor="#999"
                        value={message}
                        onChangeText={setMessage}
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                        <Ionicons name="send" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default TradeChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFF',
        // borderBottomWidth: 1,
        // borderBottomColor: '#F0F0F0',
    },
    backBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#000',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    headerProfile: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#DDD',
    },
    onlineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2DBD5F',
        position: 'absolute',
        bottom: 0,
        right: 10,
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    headerName: {
        fontSize: 16,
        color: '#000',
    },
    headerStatus: {
        fontSize: 12,
        color: '#2DBD5F',
    },
    headerDate: {
        fontSize: 12,
        color: '#888',
    },
    chatList: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        paddingTop: 10,
    },
    messageRow: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    myMessageRow: {
        justifyContent: 'flex-end',
    },
    otherMessageRow: {
        justifyContent: 'flex-start',
    },
    avatarSmall: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 8,
        backgroundColor: '#DDD',
    },
    bubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
    },
    myBubble: {
        backgroundColor: '#F0FCD4', // Lime color
        borderBottomRightRadius: 4,
    },
    otherBubble: {
        backgroundColor: '#E0FAEB', // Light Green
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 14,
        color: '#000',
        lineHeight: 20,
    },
    messageImage: {
        width: 150,
        height: 200,
        borderRadius: 8,
    },
    timeText: {
        fontSize: 10,
        color: '#666',
        alignSelf: 'flex-end',
        marginTop: 4,
    },
    systemMessageContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    systemMessageBubble: {
        backgroundColor: '#E0FAEB',
        borderRadius: 8,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        borderWidth: 1,
        borderColor: '#B0EEC3',
    },
    iconCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#2DBD5F', // Green for processed
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    systemMessageText: {
        fontSize: 14,
        color: '#000',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#F5F5F5',
        borderTopWidth: 1,
        borderTopColor: '#EEE',
        borderRadius: 20,
        margin: 20,
    },
    attachBtn: {
        padding: 5,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#000',
        maxHeight: 100,
    },
    sendBtn: {
        width: 40,
        height: 40,
        backgroundColor: '#000',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
    },
    /* STATUS CARDS */
    statusCardSuccess: {
        backgroundColor: '#E0FAEB',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#B0EEC3',
    },
    statusCardFailure: {
        backgroundColor: '#FFE5E5',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 20,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFB3B3',
    },
    statusIconSuccess: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#00AA00', // Green
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    statusIconFailure: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#FF3B30', // Red
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    statusText: {
        flex: 1,
        fontSize: 13,
        color: '#000',
        lineHeight: 18,
    },
});
