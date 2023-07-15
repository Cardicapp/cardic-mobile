import Colors from 'CardicApp/src/theme/Colors';
import React from 'react';
import { View } from "react-native";
import AppText from '../AppText/AppText';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface ChatMessageProps {
    title: string;
    value: string;
}
const ChatMessage = ({ title, value }: ChatMessageProps) => {
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
                    borderRadius: 20,
                    alignSelf: "flex-end",
                }}>
                <AppText style={{
                    color: Colors.White,
                }}>Hello there</AppText>
            </View>
            <AppText style={{
                    color: Colors.Black,
                    textAlign: 'right',
                    paddingHorizontal: 5,
                    fontSize: RFPercentage(1.4),
                }}>1h ago</AppText>
        </View>

    )
}

export default ChatMessage;