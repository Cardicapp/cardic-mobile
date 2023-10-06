import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

export async function requestNotificationPermission() {
    console.log("Requesting permission...")
    if (Platform.OS == 'android') {
        const res = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS)
        const enabled = res === 'granted';
        // if (enabled) {
            console.log('Authorization status:', enabled);
        // } else console.log("Not authorized");
    } else if (Platform.OS == 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        // if (enabled) {
            console.log('Authorization status:', authStatus);
        // } else console.log("Not authorized");
    }

}