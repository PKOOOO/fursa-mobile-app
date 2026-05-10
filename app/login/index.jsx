import { View, Image, Text, StyleSheet, Dimensions, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { COLORS } from '../../constants';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => { void WebBrowser.coolDownAsync(); };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await AsyncStorage.getItem('clerk_session_id');
        if (session) router.replace('/home');
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    checkSession();
  }, [router]);

  const onPress = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/', { scheme: 'acme' }),
      });

      if (createdSessionId) {
        await AsyncStorage.setItem('clerk_session_id', createdSessionId);
        await setActive({ session: createdSessionId });
        router.replace('/');
      }
    } catch (err) {
      console.error('OAuth error', JSON.stringify(err, null, 2));
      Alert.alert('Sign In Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [startOAuthFlow, router, isLoading]);

  const { height: screenHeight } = Dimensions.get('window');

  return (
    <View style={styles.container}>
      {/* Top curved background */}
      <View style={[styles.topBg, { height: screenHeight * 0.52 }]}>
        <Image
          source={require('../../assets/images/fursa-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Bottom card */}
      <View style={styles.card}>
        <View style={styles.pill} />

        <Text style={styles.title}>Looking for your next opportunity?</Text>
        <Text style={styles.subtitle}>
          Your gateway to job opportunities in Mombasa. Find your perfect hustle today.
        </Text>

        {/* Feature bullets */}
        <View style={styles.features}>
          {['Browse hundreds of local jobs', 'Track your applications live', 'Match jobs to your skills with Hustle Score'].map((f) => (
            <View key={f} style={styles.featureRow}>
              <View style={styles.featureDot} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={onPress}
          style={({ pressed }) => [styles.button, isLoading && styles.buttonDisabled, pressed && styles.buttonPressed]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <View style={styles.buttonInner}>
              <Text style={styles.buttonText}>Continue with Google</Text>
            </View>
          )}
        </Pressable>

        <Text style={styles.footerNote}>
          By continuing, you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBg: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logo: {
    width: '55%',
    height: '45%',
  },
  card: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 28,
  },
  pill: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 10,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    lineHeight: 20,
    marginBottom: 24,
  },
  features: { marginBottom: 28, gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.tertiary,
  },
  featureText: { fontSize: 14, color: '#555', fontWeight: '500' },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonPressed: { opacity: 0.85 },
  buttonInner: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  footerNote: {
    fontSize: 11,
    color: '#bbb',
    textAlign: 'center',
    lineHeight: 16,
  },
});
