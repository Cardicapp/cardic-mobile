import React from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../../../theme/Colors';
import AppText, { AppBoldText } from '../../../../components/AppText/AppText';

const SuccessScreen = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <MaterialCommunityIcons name="check-circle" size={80} color={Colors.Primary} />
                <AppBoldText style={styles.title}>Success!</AppBoldText>
                <AppText style={styles.message}>Your profile has been updated successfully.</AppText>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('ProfileScreen' as never)}
                >
                    <AppBoldText style={styles.buttonText}>Done</AppBoldText>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default SuccessScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    title: { fontSize: 24, marginTop: 20, marginBottom: 10 },
    message: { fontSize: 14, color: '#666', textAlign: 'center' },
    footer: { padding: 20 },
    button: {
        backgroundColor: Colors.Primary, height: 50, borderRadius: 12,
        justifyContent: 'center', alignItems: 'center',
    },
    buttonText: { color: '#fff', fontSize: 16 },
});
