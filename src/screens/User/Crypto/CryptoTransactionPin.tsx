import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import AppText, { AppBoldText } from 'CardicApp/src/components/AppText/AppText';
import Colors from 'CardicApp/src/theme/Colors';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PIN_LENGTH = 4;

const ConfirmPinScreen = () => {
    const [pin, setPin] = useState('');

    const handlePress = (value: string) => {
        if (pin.length < PIN_LENGTH) {
            setPin(prev => prev + value);
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
    };

    const isComplete = pin.length === PIN_LENGTH;

    return (
        <SafeAreaView style={styles.container}>
            <SimpleBackHeader showBack showMenu={false} text="" />

            {/* TITLE */}
            <View style={styles.header}>
                <AppBoldText style={styles.title}>Enter PIN</AppBoldText>
                <AppText style={styles.subtitle}>
                    Enter Cardic pin to confirm transactionn
                </AppText>
            </View>

            {/* PIN DOTS */}
            <View style={styles.pinContainer}>
                {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.pinDot,
                            pin[index] ? styles.filledDot : undefined,
                        ]}
                    />
                ))}
            </View>

            {/* KEYPAD */}
            <View style={styles.keypad}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <TouchableOpacity
                        key={num}
                        style={styles.key}
                        onPress={() => handlePress(String(num))}
                    >
                        <AppBoldText style={styles.keyText}>
                            {num}
                        </AppBoldText>
                    </TouchableOpacity>
                ))}

                <View style={styles.key} />

                <TouchableOpacity
                    style={styles.key}
                    onPress={() => handlePress('0')}
                >
                    <AppBoldText style={styles.keyText}>0</AppBoldText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.key}
                    onPress={handleDelete}
                >
                    <Ionicons
                        name="backspace-outline"
                        size={26}
                        color={Colors.Black}
                    />
                </TouchableOpacity>
            </View>

            {/* CONFIRM BUTTON */}
            <View style={styles.footer}>
                <TouchableOpacity
                    disabled={!isComplete}
                    style={[
                        styles.confirmBtn,
                        {
                            backgroundColor: isComplete
                                ? Colors.Primary
                                : '#BDBDBD',
                        },
                    ]}
                >
                    <AppBoldText style={styles.confirmText}>
                        Confirm
                    </AppBoldText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ConfirmPinScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
        paddingHorizontal: 20,
    },

    header: {
        marginTop: 20,
        alignItems: 'center',
    },

    title: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.Black,
    },

    subtitle: {
        fontSize: 14,
        color: '#777',
        marginTop: 6,
        textAlign: 'center',
    },

    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 40,
    },

    pinDot: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: '#CCC',
        backgroundColor: 'transparent',
    },

    filledDot: {
        backgroundColor: Colors.Black,
        borderColor: Colors.Black,
    },

    keypad: {
        marginTop: 50,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    key: {
        width: '30%',
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#F2F2F2',
    },

    keyText: {
        fontSize: 20,
        color: Colors.Black,
        fontWeight: '600',
    },

    footer: {
        marginTop: 'auto',
        marginBottom: 30,
    },

    confirmBtn: {
        height: 54,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },

    confirmText: {
        color: Colors.White,
        fontSize: 16,
        fontWeight: '600',
    },
});
