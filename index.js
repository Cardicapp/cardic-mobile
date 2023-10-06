/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import { Notifications } from 'react-native-notifications';

Notifications.ios.cancelAllLocalNotifications();


// Register background handler
messaging().setBackgroundMessageHandler(async msg => {
    console.log('Message handled in the background!', msg);
    // let payload = {}
    // if (msg.messageType == 'message') {
    //     payload = {
    //         body: 'New message!!',
    //         title: "Trade",
    //         // silent: false,
    //         // category: "SOME_CATEGORY",
    //         // userInfo: { },
    //         // @ts-ignore
    //         fireDate: new Date(),
    //     }
    // } else if (msg.messageType == 'notification') {
    //     payload = {
    //         body: msg.notification.body,
    //         title: msg.notification.title,
    //         // silent: false,
    //         // category: "SOME_CATEGORY",
    //         // userInfo: { },
    //         // @ts-ignore
    //         fireDate: new Date(),
    //     }
    // }

    // Notifications.postLocalNotification({
    //     title: msg.notification.title,
    //     body: msg.notification.body,
    // });
});
AppRegistry.registerComponent(appName, () => App);
