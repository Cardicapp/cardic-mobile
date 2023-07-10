import { RFPercentage } from "react-native-responsive-fontsize";
import { Platform } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
const isIOS = Platform.OS === 'ios';
export default {
    buttonVPadding: heightPercentageToDP(1.8),
    headerDescription : isIOS ? RFPercentage(1.8) : RFPercentage(2.1),
}