import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Toast from 'react-native-toast-message';
import { RFPercentage } from 'react-native-responsive-fontsize';

import Colors from '@/theme/Colors';
import AppText, { AppBoldText } from '@/components/AppText/AppText';
import SimpleBackHeader from '@/components/SimpleBackHeader';
import TextInputOne from 'CardicApp/src/components/TextInputOne';
import Button from '@/components/buttons/Button';

import axiosExtended from '@/lib/network/axios-extended';
import routes from '@/lib/network/routes';

interface FormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}


const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('New password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
        .required('Confirm your new password'),
});

const ChangePasswordScreen = ({ navigation }: any) => {
    const [loading, setLoading] = useState(false);

    const submit = async (values: FormValues) => {
        setLoading(true);
        try {
            await axiosExtended.post(`${routes.auth}/change/password`, {
                oldPassword: values.currentPassword,
                newPassword: values.newPassword,
            });

            Toast.show({
                type: 'success',
                text1: 'Password changed successfully',
            });

            navigation.goBack();
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: error?.response?.data?.message || 'Unable to change password',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <SimpleBackHeader text="Change Password" />

            <Formik
                initialValues={{
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }}
                validationSchema={ChangePasswordSchema}
                onSubmit={submit}
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                }) => (
                    <View style={styles.form}>
                        <AppText style={styles.subtitle}>
                            Enter your current password and set a new one
                        </AppText>

                        {/* CURRENT PASSWORD */}
                        <View style={styles.inputGroup}>
                            <TextInputOne
                                label="Current Password"
                                placeholder="Enter current password"
                                secureTextEntry
                                value={values.currentPassword}
                                onChangeText={handleChange('currentPassword')}
                                onBlur={handleBlur('currentPassword')}
                                error={touched.currentPassword ? errors.currentPassword : ''}
                            />

                            <AppText style={styles.helperText}>
                                Enter your current password to set a new password
                            </AppText>
                        </View>



                        {/* NEW PASSWORD */}
                        <TextInputOne
                            label="New Password"
                            placeholder="Enter new password"
                            secureTextEntry
                            value={values.newPassword}
                            onChangeText={handleChange('newPassword')}
                            onBlur={handleBlur('newPassword')}
                            error={touched.newPassword ? errors.newPassword : ''}
                        />

                        {/* CONFIRM PASSWORD */}
                        <TextInputOne
                            label="Confirm New Password"
                            placeholder="Re-enter new password"
                            secureTextEntry
                            value={values.confirmPassword}
                            onChangeText={handleChange('confirmPassword')}
                            onBlur={handleBlur('confirmPassword')}
                            error={touched.confirmPassword ? errors.confirmPassword : ''}
                        />

                        {/* SUBMIT */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleSubmit()}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <AppBoldText style={styles.buttonText}>
                                    Change Password
                                </AppBoldText>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </Formik>
        </SafeAreaView>
    );
};

export default ChangePasswordScreen;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.White,
    },

    form: {
        paddingHorizontal: '5%',
        marginTop: 20,
    },

    inputGroup: {
        marginBottom: 20,
    },

    helperText: {
        fontSize: 12,
        color: '#8E8E93',
        marginTop: -16,
    },

    subtitle: {
        fontSize: RFPercentage(1.9),
        color: Colors.Grey,
        marginBottom: 20,
    },

    button: {
        backgroundColor: Colors.Primary,
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 300,
    },

    buttonText: {
        color: '#fff',
        fontSize: RFPercentage(2),
    },
});
