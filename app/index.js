import 'react-native-gesture-handler';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React, { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';
import { useUser } from '@clerk/clerk-expo';
import DashboardScreen from './screens/index';
import LogoutScreen from './screens/logout';
import SkillsScreen from './screens/skills';
import jobstatus from './screens/jobstatus';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Profile header */}
      <View style={styles.profileSection}>
        <Image
          source={{ uri: user?.imageUrl || 'https://ui-avatars.com/api/?name=User' }}
          style={styles.avatar}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.profileName} numberOfLines={1}>
            {user?.fullName || 'User'}
          </Text>
          <Text style={styles.profileEmail} numberOfLines={1}>
            {user?.primaryEmailAddress?.emailAddress || ''}
          </Text>
        </View>
      </View>

      {/* Nav items */}
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Logout button */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => props.navigation.navigate('Logout')}
      >
        <Text style={styles.logoutText}>🚪 Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const Home = () => {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const checkAuthStatus = async () => {
      const sessionId = await AsyncStorage.getItem('clerk_session_id');
      if (!sessionId) {
        router.replace('/login');
      }
    };
    checkAuthStatus();
  }, [router]);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Drawer.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: COLORS.lightWhite },
          drawerActiveTintColor: COLORS.primary,
          drawerInactiveTintColor: '#888',
          drawerLabelStyle: { fontSize: 14, fontWeight: '600' },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="Home"
          component={DashboardScreen}
          options={{
            drawerLabel: '🏠  Home',
            headerRight: () => (
              <View style={{ marginRight: 14 }}>
                <Image
                  source={{ uri: user?.imageUrl || 'https://ui-avatars.com/api/?name=User' }}
                  style={styles.headerAvatar}
                />
              </View>
            ),
            headerTitle: "",
          }}
        />
        <Drawer.Screen
          name="JobStatus"
          component={jobstatus}
          options={{
            drawerLabel: '📋  My Applications',
            headerTitle: "",
          }}
        />
        <Drawer.Screen
          name="MySkills"
          component={SkillsScreen}
          options={{
            drawerLabel: '⚡  My Skills',
            headerTitle: "My Skills",
            headerStyle: { backgroundColor: COLORS.lightWhite },
          }}
        />
        <Drawer.Screen
          name="Logout"
          component={LogoutScreen}
          options={{
            drawerItemStyle: { display: 'none' },
            headerTitle: "",
          }}
        />
      </Drawer.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
  profileEmail: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  logoutBtn: {
    margin: 16,
    padding: 14,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0e0e0',
  },
});

export default Home;
