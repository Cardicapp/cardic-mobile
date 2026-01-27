import React, { useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import Colors from 'CardicApp/src/theme/Colors';
import SimpleBackHeader from 'CardicApp/src/components/SimpleBackHeader';

const PIN_LENGTH = 4;

const CreatePinScreen = () => {
    const [pin, setPin] = useState<string[]>([]);
    const [confirmPin, setConfirmPin] = useState<string[]>([]);
    const [step, setStep] = useState<'pin' | 'confirm'>('pin');
    const [error, setError] = useState('');

    const activePin = step === 'pin' ? pin : confirmPin;

    const handlePress = (value: string) => {
        setError('');

        if (step === 'pin') {
            if (pin.length < PIN_LENGTH) {
                const updated = [...pin, value];
                setPin(updated);

                if (updated.length === PIN_LENGTH) {
                    setTimeout(() => {
                        setStep('confirm');
                    }, 300);
                }
            }
        } else {
            if (confirmPin.length < PIN_LENGTH) {
                const updated = [...confirmPin, value];
                setConfirmPin(updated);

                if (updated.length === PIN_LENGTH) {
                    validatePins(updated);
                }
            }
        }
    };

    const handleDelete = () => {
        if (step === 'confirm') {
            setConfirmPin(confirmPin.slice(0, -1));
        } else {
            setPin(pin.slice(0, -1));
        }
    };

    const validatePins = (enteredConfirmPin: string[]) => {
        if (pin.join('') !== enteredConfirmPin.join('')) {
            setError('PINs do not match');
            setConfirmPin([]);
        }
    };

    const canProceed =
        step === 'confirm' && confirmPin.length === PIN_LENGTH && !error;

    return (
        <SafeAreaView style={styles.container}>

            <SimpleBackHeader
                showBack={true}
                showMenu={false}
            />
            <View style={styles.content}>
                {/* Title */}
                <Text style={styles.title}>
                    {step === 'pin' ? 'Create PIN' : 'Confirm PIN'}
                </Text>

                {/* Helper text */}
                <Text style={styles.subtitle}>
                    {step === 'pin'
                        ? 'Create a PIN to protect your data and prevent unauthorized access'
                        : 'Enter PIN again to confirm'}
                </Text>

                {/* PIN Boxes */}
                <View style={styles.pinContainer}>
                    {Array.from({ length: PIN_LENGTH }).map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.pinBox
                            ]}
                        > {activePin[index] ? <View style={styles.dot} /> : null}</View>
                    ))}
                </View>

                {error ? <Text style={styles.error}>{error}</Text> : null}

                {/* Keypad */}
                <View style={styles.keypad}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <Key
                            key={num}
                            label={num.toString()}
                            onPress={() => handlePress(num.toString())}
                        />
                    ))}

                    <View style={styles.keySpacer} />

                    <Key label="0" onPress={() => handlePress('0')} />

                    <Key label="⌫" onPress={handleDelete} />
                </View>

                {/* Next Button */}
                <TouchableOpacity
                    disabled={!canProceed}
                    style={[
                        styles.nextButton,
                        canProceed && styles.nextButtonActive,
                    ]}
                    onPress={() => {
                        const finalPin = pin.join('');
                        console.log('PIN SET:', finalPin);
                        // save pin or navigate next
                    }}
                >
                    <Text style={styles.nextText}>Next</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

const Key = ({
    label,
    onPress,
}: {
    label: string;
    onPress: () => void;
}) => (
    <TouchableOpacity style={styles.key} onPress={onPress}>
        <Text style={styles.keyText}>{label}</Text>
    </TouchableOpacity>
);

export default CreatePinScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
        paddingTop: 10,

    },

    content: {
        alignItems: 'center',
        marginTop: 30,
        gap: 20,
    },

    title: {
        color: Colors.Black,
        fontSize: 18,
        fontWeight: '600',
        marginTop: 20,
    },

    subtitle: {
        color: Colors.Black,
        fontSize: 14,
        textAlign: 'center',
        marginTop: 6,
        paddingHorizontal: 30,
    },


    pinContainer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 30,
    },

    pinBox: {
        width: 32,
        height: 32,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: '#666',
        backgroundColor: Colors.IconGrey,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.4,
    },

    pinBoxFilled: {
        opacity: 1,
        color: Colors.White,
        borderColor: '#FFFFFF',
    },

    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.Primary,
    },

    error: {
        color: '#FF4D4F',
        marginTop: 10,
        fontSize: 14,
    },

    keypad: {
        width: '60%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 20,
    },

    key: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: Colors.IconGrey,
        justifyContent: 'center',
        alignItems: 'center',
    },

    keyText: {
        color: Colors.Black,
        fontSize: 22,
        fontWeight: '600',
    },

    keySpacer: {
        width: 70,
        height: 70,
    },

    nextButton: {
        width: '90%',
        height: 50,
        borderRadius: 10,
        backgroundColor: '#BDBDBD',
        justifyContent: 'center',
        alignItems: 'center',
    },

    nextButtonActive: {
        backgroundColor: Colors.Primary,
    },

    nextText: {
        color: Colors.White,
        fontSize: 16,
        fontWeight: '600',
    },
});
