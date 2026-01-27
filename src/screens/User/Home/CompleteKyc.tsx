import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import AppText, { AppBoldText } from '@/components/AppText/AppText';
import Colors from '@/theme/Colors';

const CompleteKYCNotice = ({ onPress }: { onPress?: () => void }) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={styles.container}>
        {/* LEFT CONTENT */}
        <View style={styles.textContainer}>
          <AppBoldText style={styles.title}>Complete KYC</AppBoldText>

          <AppText style={styles.description}>
            Provide your information to help us verify your identity and keep
            your account secure.
          </AppText>

          <AppText style={styles.cta}>
            Finish your KYC to continue using all features.
          </AppText>
        </View>

        {/* RIGHT IMAGE */}
        <Image
          source={require('@/theme/assets/images/KYC.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  );
};

export default CompleteKYCNotice;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F4F4F4',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
  },

  textContainer: {
    flex: 1,
    paddingRight: 10,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.Primary,
    marginBottom: 6,
  },

  description: {
    fontSize: 10,
    width: '130%',
    color: '#444',
    lineHeight: 14,
    marginBottom: 20,
  },

  cta: {
    fontSize: 10,
    color: Colors.Primary,
    width: '130%',
  },

  image: {
    width: 150,
    height: 150,
    marginLeft: 26,
  },
});
