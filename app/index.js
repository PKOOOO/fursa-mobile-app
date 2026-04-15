import 'react-native-gesture-handler';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React, { useEffect } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, icons } from '../constants';
import { useUser } from '@clerk/clerk-expo';
import DashboardScreen from './screens/index';
import LogoutScreen from './screens/logout';
import jobstatus from './screens/jobstatus';

const Home = () => {
  const router = useRouter();
  const { user } = useUser(); // Fetch user data

  // Check if the user is logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      const sessionId = await AsyncStorage.getItem('clerk_session_id');
      if (!sessionId) {
        router.replace('/login'); // Redirect to login if no session is found
      }
    };
    checkAuthStatus();
  }, [router]);

  const Drawer = createDrawerNavigator();

  // Custom Drawer Content
  // Custom Drawer Content
const CustomDrawerContent = (props) => {
  const { navigation } = props;  // Destructure navigation from props

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Drawer Items */}
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Button at the Bottom */}
      <TouchableOpacity
        style={{
          padding: 15,
          backgroundColor: COLORS.button,
          marginBottom: 20,
          width: 200,
          borderRadius: 8,
          marginLeft: 50,
          alignItems: 'center',
        }}
        onPress={() => {
          navigation.navigate('Logout');  // Navigate to LogoutScreen instead of 'Logout'
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};


  return (
    <View style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Drawer.Navigator
        screenOptions={{
          headerShadowVisible: false, // Disable header shadow globally
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="Home"
          component={DashboardScreen}
          options={{
            headerRight: () => (
              // Display user's profile image if available
              <View style={{ marginRight: 10 }}>
                <Image
                  source={{ uri: user?.imageUrl || icons.user }} // Show profile image or fallback
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: 'grey',
                  }}
                />
              </View>
            ),
            headerTitle: "", // To hide the default header title
          }}
        />
        <Drawer.Screen
          name="JobStatus"
          component={jobstatus}
          options={{
            headerTitle: "",
          }}
        />
        <Drawer.Screen
          name="Logout"
          component={LogoutScreen}
          options={{
            headerTitle: "",
          }}
        />
      </Drawer.Navigator>
    </View>
  );
};

export default Home;


// import 'react-native-gesture-handler';
// import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
// import React, { useEffect } from 'react';
// import { View, SafeAreaView, Image, Text, TouchableOpacity } from 'react-native';
// import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { COLORS, icons } from '../constants';
// import { useUser } from '@clerk/clerk-expo';
// import DashboardScreen from './screens/index';
// import LogoutScreen from './screens/logout';
// import jobstatus from './screens/jobstatus';

// const Home = () => {
//   const router = useRouter();
//   const { user } = useUser(); // Fetch user data

//   // Check if the user is logged in
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       const sessionId = await AsyncStorage.getItem('clerk_session_id');
//       if (!sessionId) {
//         router.replace('/login'); // Redirect to login if no session is found
//       }
//     };
//     checkAuthStatus();
//   }, [router]);

//   const Drawer = createDrawerNavigator();

//   // Custom Drawer Content
//   const CustomDrawerContent = (props) => {
//     return (
//       <SafeAreaView style={{ flex: 1 }}>
//         {/* Drawer Items */}
//         <DrawerContentScrollView {...props}>
//           <DrawerItemList {...props} />
//         </DrawerContentScrollView>

//         {/* Button at the Bottom */}
//         <TouchableOpacity
//           style={{
//             padding: 16,
//             backgroundColor: COLORS.primary,
//             marginBottom: 20,
//             borderRadius: 8,
//             alignItems: 'center',
//           }}
//           onPress={() => {
//             router.push('/settings'); // Navigate to settings screen or desired action
//           }}
//         >
//           <Text style={{ color: 'white', fontWeight: 'bold' }}>Logout</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
//       <Drawer.Navigator
//         screenOptions={{
//           headerShadowVisible: false, // Disable header shadow globally
//         }}
//         drawerContent={(props) => <CustomDrawerContent {...props} />}
//       >
//         <Drawer.Screen
//           name="Home"
//           component={DashboardScreen}
//           options={{
//             headerRight: () => (
//               // Display user's profile image if available
//               <View style={{ marginRight: 10 }}>
//                 <Image
//                   source={{ uri: user?.imageUrl || icons.user }} // Show profile image or fallback
//                   style={{
//                     width: 40,
//                     height: 40,
//                     borderRadius: 20,
//                     backgroundColor: 'grey',
//                   }}
//                 />
//               </View>
//             ),
//             headerTitle: "", // To hide the default header title
//           }}
//         />
//         <Drawer.Screen
//           name="JobStatus"
//           component={jobstatus}
//           options={{
//             headerTitle: "",
//           }}
//         />
//         <Drawer.Screen
//           name="Logout"
//           component={LogoutScreen}
//           options={{
//             headerTitle: "",
//           }}
//         />
//       </Drawer.Navigator>
//     </SafeAreaView>
//   );
// };

// export default Home;