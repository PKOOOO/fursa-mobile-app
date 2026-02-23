import { View, Image, Text, StyleSheet, Dimensions, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { COLORS } from '../../constants';
import * as WebBrowser from 'expo-web-browser';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if the user is signed in, if not, redirect to login screen
    const checkSession = async () => {
      try {
        const session = await checkIfUserIsSignedIn();
        if (session) {
          router.replace('/home');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    checkSession();
  }, [router]);

  const checkIfUserIsSignedIn = async () => {
    try {
      const session = await AsyncStorage.getItem('clerk_session_id');
      return session != null;
    } catch (error) {
      console.error('Error checking session in AsyncStorage:', error);
      return false; // Return false if there is an error
    }
  };

  const onPress = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/', { scheme: 'acme' }),
      });

      if (createdSessionId) {
        console.log('User signed in, session created:', createdSessionId);

        // Store the session in AsyncStorage
        await AsyncStorage.setItem('clerk_session_id', createdSessionId);

        // Set the active session
        await setActive({ session: createdSessionId });

        // Redirect to home page after successful login
        router.replace('/');
      } else {
        // Handle MFA or further sign-in/sign-up logic
        if (signIn) {
          console.log('Sign-in process, handle MFA');
        } else if (signUp) {
          console.log('Sign-up process');
        }
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
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/fursa-logo.png')}
          style={[styles.logo, { height: screenHeight * 0.3 }]} // 30% of screen height
        />
      </View>

      {/* Text Content */}
      <View style={styles.textContainer}>
        <Text style={styles.text}>Looking for your next opportunity?</Text>
        <Text style={styles.text2}>Your gateway to job opportunities in Mombasa</Text>
      </View>
      <Pressable onPress={onPress} style={[styles.button, isLoading && styles.buttonDisabled]} disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttontext}>Join the movement</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 150,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 100,
  },
  logo: {
    width: '60%',
    resizeMode: 'contain',
  },
  textContainer: {
    alignItems: 'center',
    display: 'flex',
    paddingTop: 10,
  },
  text: {
    fontSize: 30,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
  },
  text2: {
    fontSize: 20,
    color: '#808080',
    textAlign: 'center',
  },
  button: {
    padding: 10,
    marginTop: 100,
    width: '90%',
    borderRadius: 14,
    backgroundColor: COLORS.blue,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttontext: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '800',
  },
});
