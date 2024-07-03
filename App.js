import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";
import { auth } from "./firebase"; // Import the auth instance from firebase.js
import LoginScreen from "./Screens/LoginScreen";
import SignUpScreen from "./Screens/SignUpScreen";
import FillCity from "./Screens/FillCity";
import ProfileScreen from "./Screens/ProfileScreen";
import HotelScreen from "./Screens/HotelScreen";
import HomeScreen from "./Screens/HomeScreen";
import TestScreen from "./Screens/TestScreen";
import TrainDetail from "./Screens/TrainDetail";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from expo/vector-icons
import { TranslationProvider } from './translation/TranslationContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
    <Stack.Navigator>
      {/* <Stack.Screen name="TestScreen" options={{ headerShown: false }} component={TestScreen} /> */}
      <Stack.Screen name="HomeScreen" options={{ headerShown: false }} component={HomeScreen} />
      <Stack.Screen name="FillCity"  component={FillCity} />
      <Stack.Screen name="Train Details"  component={TrainDetail} />
    </Stack.Navigator>
);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setTimeout(() => {
        setIsLoading(false); // Set loading to false when authentication is done
      }, 1500);

      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    // Cleanup function
    return unsubscribe;
  }, []);

  const logout = () => {
    auth
      .signOut()
      .then(() => {
        // Sign-out successful.
        console.log("user Logged Out");
        setIsLoggedIn(false); // Update the isLoggedIn state
      })
      .catch((error) => {
        // An error happened.
        console.error("Error during logout:", error);
      });
  };

  // If the app is still loading, display the splash screen
  if (isLoading) {
    return (
      <LottieView
        source={require("./assets/LoadingAnimation.json")}
        style={{ flex: 1 }}
        autoPlay
        loop
      />
    );
  }

  return (
    <TranslationProvider>
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === "Home" ) {
                iconName = "home";
              }
              else if (route.name === "Hotels") {
                iconName = "business";
              }
               else if (route.name === "Profile") {
                iconName = "person";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "black",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarHideOnKeyboard: true,
            tabBarShowLabel:false,
            
          })
        }
        
        >
          <Tab.Screen name={"Home"} options={{ headerShown: false }} component={HomeStack} />
          <Tab.Screen name="Hotels" options={{ headerShown: false }} component={HotelScreen}/>
          <Tab.Screen name="Profile" options={{ headerShown: false }}>
            {() => <ProfileScreen logout={logout} />}
          </Tab.Screen>
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
            component={LoginScreen}
          />
          <Stack.Screen
            name="SignUp"
            options={{ headerShown: false }}
            component={SignUpScreen}
          />
        </Stack.Navigator>
      )}
      <Toast />
    </NavigationContainer>
    </TranslationProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    paddingTop: 5,
    backgroundColor: "white", // Background color of the tab bar
    borderTopColor: "lightgray", // Border color
  },
  tabBarLabel: {
    fontSize: 16, // Font size of the tab labels
    fontWeight: "bold", // Font weight of the tab labels
  },
});

export default App;
