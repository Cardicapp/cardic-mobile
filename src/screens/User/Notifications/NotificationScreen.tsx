import React, { useState } from 'react';
import moment from 'moment';
import {
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import Colors from '@/theme/Colors';
import AppText, { AppBoldText } from '@/components/AppText/AppText';
import axiosExtended from 'CardicApp/src/lib/network/axios-extended';
import routes from 'CardicApp/src/lib/network/routes';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Notification {
    id: number;
    title: string;
    message: string;
    date: string;
    read: boolean;
}

const NotificationsScreen = () => {
    const navigation = useNavigation();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] =
        useState<'notification' | 'inbox'>('notification');

    React.useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const res = await axiosExtended.get(routes.notifications);
            if (res.status === 200) {
                setNotifications(res.data.data || []);
            }
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setIsLoading(false);
        }
    };

    const renderNotification = ({ item }: { item: Notification }) => (
        <View style={styles.notificationCard}>
            <AppBoldText>{item.title}</AppBoldText>
            <AppText style={styles.message}>{item.message}</AppText>
            <AppText style={styles.date}>
                {moment(item.date).fromNow()}
            </AppText>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* BACK BUTTON */}
            <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={18} color={Colors.White} />
            </TouchableOpacity>

            {/* HEADER */}
            <AppBoldText style={styles.title}>Notifications & Inbox</AppBoldText>

            <FlatList
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchNotifications} />
                }
                data={activeTab === 'notification' ? notifications : []}
                keyExtractor={(i) => i.id.toString()}
                renderItem={renderNotification}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons
                            name="emoticon-neutral-outline"
                            size={90}
                            color="#D9D9D9"
                        />
                        <AppBoldText style={styles.emptyText}>
                            {activeTab === 'notification'
                                ? 'You do not have any notifications at the moment'
                                : 'You do not have any inbox at the moment'}
                        </AppBoldText>
                    </View>
                }
                ListHeaderComponent={
                    <>
                        {/* TABS */}
                        <View style={styles.tabRow}>
                            <TouchableOpacity
                                style={[
                                    styles.tabBtn,
                                    activeTab === 'notification' && styles.activeTab,
                                ]}
                                onPress={() => setActiveTab('notification')}
                            >
                                <AppBoldText
                                    style={[
                                        styles.tabText,
                                        activeTab === 'notification' && styles.activeTabText,
                                    ]}
                                >
                                    Notification
                                </AppBoldText>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.tabBtn,
                                    activeTab === 'inbox' && styles.activeTab,
                                ]}
                                onPress={() => setActiveTab('inbox')}
                            >
                                <AppBoldText
                                    style={[
                                        styles.tabText,
                                        activeTab === 'inbox' && styles.activeTabText,
                                    ]}
                                >
                                    Inbox
                                </AppBoldText>
                            </TouchableOpacity>
                        </View>

                        {/* INBOX CARD */}
                        {activeTab === 'inbox' && (
                            <>
                                {/* Inbox UI can live here later */}
                            </>
                        )}
                    </>
                }
            />
        </SafeAreaView>
    );
};

export default NotificationsScreen;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1, backgroundColor: '#fff', paddingHorizontal: 20,
    },

    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: Colors.Black,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 50,
        marginTop: 10,
    },

    title: {
        fontSize: RFPercentage(2.8),
        fontWeight: '700',
        color: Colors.Black,
        marginBottom: 15,
    },



    /* HEADER */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
    },

    /* TABS */
    tabRow: { flexDirection: 'row', padding: 2, gap: 10 },
    tabBtn: {
        flex: 1,
        backgroundColor: '#E6E6E6',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    activeTab: { backgroundColor: '#000' },
    tabText: { color: '#000' },
    activeTabText: { color: '#fff' },

    /* NOTIFICATION CARD */
    notificationCard: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    message: { color: '#555', marginTop: 14 },
    date: { color: '#999', fontSize: 12, marginTop: 8 },

    /* EMPTY STATE */
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginTop: 150,
    },
    emptyText: {
        marginTop: 20,
        color: '#777',
        textAlign: 'center',
        fontSize: 14,
        lineHeight: 20,
    },
});
