import Colors from 'CardicApp/src/theme/Colors';
import React from 'react';
import { Image, TouchableOpacity, View } from "react-native";
import AppText from '../AppText/AppText';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { TradeChat } from 'CardicApp/src/types/chat';
import { TradeChatTypeEnum } from 'CardicApp/src/types/enums';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectAuthState } from 'CardicApp/src/store/auth';
import { widthPercentageToDP } from 'react-native-responsive-screen';

interface ChatMessageProps {
    chat: TradeChat;
    onClickImage?: (chat: TradeChat, index: number) => void;
}
const ChatMessage = ({ chat, onClickImage }: ChatMessageProps) => {
    const { user } = useSelector(selectAuthState);

    const isMine = chat?.from?.id == user?.id;
    const timeAgo = moment(chat.createdAt).fromNow(); //eg. 1 day, 2 hours
    const radius = 20;

    return (
        <View
            style={{
                marginBottom: 5,
                paddingHorizontal: 7,
            }}>

            <View
                style={{
                    padding: 10,
                    // marginHorizontal: 7,
                    maxWidth: '70%',
                    backgroundColor: Colors.Primary,
                    // borderRadius: 20,
                    borderTopLeftRadius: isMine ? radius : 0,
                    borderTopRightRadius: isMine ? 0 : radius,
                    borderBottomRightRadius: radius,
                    borderBottomLeftRadius: radius,
                    alignSelf: isMine ? "flex-end" : 'flex-start',
                }}>
                {
                    chat.type.id == TradeChatTypeEnum.text ?
                        <AppText style={{
                            color: Colors.White,
                        }}>{chat.message}</AppText> :
                        chat.images?.map((im, index) =>
                            <TouchableOpacity
                                onPress={() => onClickImage && onClickImage(chat, index)}
                                style={{
                                    marginBottom: 10,
                                }}>
                                <Image
                                    style={{
                                        // marginBottom: 10,
                                        width: widthPercentageToDP(50),
                                        aspectRatio: 1,
                                    }}
                                    source={{ uri: im.path.replace('http','https') }}
                                    resizeMode='contain'
                                />
                            </TouchableOpacity>)

                }
            </View>
            <AppText style={{
                color: Colors.Black,
                textAlign: isMine ? 'right' : 'left',
                paddingHorizontal: 5,
                marginTop: 1,
                fontSize: RFPercentage(1.4),
            }}>{timeAgo}</AppText>
        </View>

    )
}

export default ChatMessage;