import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from 'CardicApp/src/theme/Colors';

const KycScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            {/* BACK BUTTON */}
            <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={18} color={Colors.White} />
            </TouchableOpacity>

            {/* ILLUSTRATION */}
            <View style={styles.imageWrapper}>
                <Image
                    source={require('@/theme/assets/images/KYC.png')}
                    style={styles.image}
                />
            </View>

            {/* CONTENT */}
            <View style={styles.content}>
                <Text style={styles.title}>Verify your identity</Text>

                <Text style={styles.subtitle}>
                    As a part of the KYC (Know Your Customer) process, verify the basic
                    details below to upgrade profile.
                </Text>

                {/* REQUIREMENTS BOX */}
                <View style={styles.requirementBox}>
                    <Text style={styles.bullet}>• Verify your BVN or NIN for Nigerians</Text>
                    <Text style={styles.bullet}>• Email Verification</Text>
                    <Text style={styles.bullet}>• Phone Number Verification</Text>
                </View>

                {/* LEARN MORE */}
                <TouchableOpacity style={styles.learnMore}>
                    <Ionicons name="information-circle-outline" size={16} color={Colors.Red} />
                    <Text style={styles.learnMoreText}>Learn More</Text>
                </TouchableOpacity>
            </View>

            {/* CTA */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        // @ts-ignore
                        navigation.navigate('VerificationScreen');
                    }}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default KycScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
        paddingHorizontal: 20,
    },

    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: Colors.Black,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    imageWrapper: {
        alignItems: 'center',
        marginTop: 30,
    },

    image: {
        width: 180,
        height: 180,
        resizeMode: 'contain',
        marginBottom: 20,
    },

    content: {
        marginTop: 30,
    },

    title: {
        fontSize: RFPercentage(2.8),
        fontWeight: '700',
        color: Colors.Black,
        marginBottom: 10,
    },

    subtitle: {
        fontSize: RFPercentage(1.9),
        color: Colors.Black,
        lineHeight: 22,
        marginBottom: 20,
    },

    requirementBox: {
        marginTop: 30,
        borderWidth: 1,
        borderColor: Colors.BorderGrey,
        borderRadius: 12,
        padding: 15,
    },

    bullet: {
        fontSize: RFPercentage(1.8),
        color: Colors.Black,
        marginBottom: 8,
    },

    learnMore: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 14,
        gap: 6,
    },

    learnMoreText: {
        color: Colors.Red,
        fontSize: RFPercentage(1.7),
    },

    footer: {
        marginTop: 'auto',
        paddingBottom: 20,
    },

    button: {
        backgroundColor: Colors.Primary,
        height: 54,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonText: {
        color: Colors.White,
        fontSize: RFPercentage(2.2),
        fontWeight: '700',
    },
});
