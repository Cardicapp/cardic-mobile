import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
    Image,
    TextInput,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import Colors from '../../../theme/Colors';
import AppText, { AppBoldText } from '../../../components/AppText/AppText';
import { selectAuthState } from '../../../store/auth';
import { UserRoleEnum, StatusEnum } from '../../../types/enums';
import { ApplicationStackParamList } from '../../../../@types/navigation';

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { user } = useSelector(selectAuthState);

    const isVerified = (user as any)?.kycStatus === 'approved';

    const renderField = (label: string, value: string) => (
        <View style={styles.fieldRow}>
            <AppText style={styles.fieldLabel}>{label}</AppText>
            <AppBoldText style={styles.fieldValue}>{value}</AppBoldText>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={20} color={Colors.White} />
                </TouchableOpacity>
                <AppBoldText style={styles.headerTitle}>Profile</AppBoldText>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll}>
                {/* PROFILE CARD */}
                <View style={styles.profileCard}>
                    {/* Fake Gradient Layers */}
                    <View style={styles.gradientLayerOne} />
                    <View style={styles.gradientLayerTwo} />

                    {/* CONTENT */}
                    <View style={styles.profileContent}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person" size={50} color="#fff" />
                            <View style={styles.cameraIcon}>
                                <Ionicons name="camera" size={12} color="#fff" />
                            </View>
                        </View>

                        <View>
                            <AppBoldText style={styles.profileName}>
                                {user?.firstName} {user?.lastName}
                            </AppBoldText>

                            <AppText style={styles.profileHandle}>
                                @{user?.username || 'user'}
                            </AppText>

                            <TouchableOpacity
                                style={styles.kycRow}
                                onPress={() =>
                                    !isVerified && navigation.navigate('KycScreen' as never)
                                }
                            >
                                {isVerified ? (
                                    <View style={styles.verifiedBadge}>
                                        <MaterialCommunityIcons
                                            name="check-decagram"
                                            color="green"
                                            size={14}
                                        />
                                        <AppText style={styles.verifiedText}>Verified</AppText>
                                    </View>
                                ) : (
                                    <AppText style={styles.completeKyc}>Complete KYC</AppText>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


                <AppText style={styles.sectionTitle}>
                    Fill in details and complete verification
                </AppText>

                {/* DETAILS FORM */}
                <View style={styles.formContainer}>
                    {renderField('First Name', user?.firstName || '')}
                    <View style={styles.divider} />

                    {renderField('Last Name', user?.lastName || '')}
                    <View style={styles.divider} />

                    {renderField('Date of Birth', '16 May, 1990')}
                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.fieldRow}
                        onPress={() => (navigation as any).navigate('ViewDetailScreen', {
                            title: 'Phone Number',
                            value: user?.phoneNumber || '08012345678',
                            type: 'phone'
                        })}
                    >
                        <AppText style={styles.fieldLabel}>Phone Number</AppText>
                        <View style={styles.row}>
                            <AppBoldText style={styles.fieldValue}>{user?.phoneNumber || '08012345678'}</AppBoldText>
                            <Ionicons name="chevron-forward" size={16} color="#000" />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.fieldRow}
                        onPress={() => (navigation as any).navigate('ViewDetailScreen', {
                            title: 'Email Address',
                            value: user?.email || '',
                            type: 'email'
                        })}
                    >
                        <AppText style={styles.fieldLabel}>Email Address</AppText>
                        <View style={styles.row}>
                            <AppBoldText style={styles.fieldValue}>{user?.email || ''}</AppBoldText>
                            <Ionicons name="chevron-forward" size={16} color="#000" />
                        </View>
                    </TouchableOpacity>
                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.fieldRow}
                        onPress={() => (navigation as any).navigate('ViewDetailScreen', {
                            title: 'Username',
                            value: user?.username || 'Obinox',
                            type: 'username'
                        })}
                    >
                        <AppText style={styles.fieldLabel}>Username</AppText>
                        <View style={styles.row}>
                            <AppBoldText style={styles.fieldValue}>{user?.username || 'Obinox'}</AppBoldText>
                            <Ionicons name="chevron-forward" size={16} color="#000" />
                        </View>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scroll: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 10,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileCard: {
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        gap: 16,
        height: 120,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#A020F0', // Purple
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    gradientLayerOne: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#1DB954',
    },

    gradientLayerTwo: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#81F73F',
        opacity: 0.6,
    },

    profileContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    profileName: {
        color: '#fff',
        fontSize: 18,
    },
    profileHandle: {
        color: '#fff',
        fontSize: 12,
        opacity: 0.8,
    },
    kycRow: {
        marginTop: 6,
    },
    completeKyc: {
        color: 'red',
        fontSize: 12,
        fontWeight: 'bold',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#E6F9E6',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    verifiedText: {
        color: 'green',
        fontSize: 10,
        fontWeight: 'bold',
    },
    sectionTitle: {
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 16,
        color: '#666',
        fontSize: 12,
    },
    formContainer: {
        borderWidth: 1.5,
        borderColor: '#000',
        borderRadius: 16,
        padding: 16,
    },
    fieldRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#000',
    },
    fieldValue: {
        fontSize: 13,
        color: '#000',
    },
    divider: {
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    }
});
