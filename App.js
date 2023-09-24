import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SearchScreen from "./screens/SearchScreen";
import Home from "./screens/Home";
import Details from "./screens/Details";
import LoginScreen from "./screens/LoginScreen";
import Register from "./screens/Register";
import Video from "./screens/Video";
import { AntDesign, Feather,Ionicons  } from '@expo/vector-icons';
// import registerNNPushToken, { getPushDataObject } from 'native-notify';
import { Permissions } from 'expo';
import { Notifications } from 'expo';


import { View,Text } from "react-native";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 60,
    background: "#990F0F"
  }
}


const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, statusBarHidden:true}}>
      <Stack.Screen
        name="HomeScreen"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};


const App = () => {
  // registerNNPushToken(9590, 'RIjT7ppebM4Hcf4PrfRDcP');
  // const pushDataObject = getPushDataObject();



  const [hideSplashScreen, setHideSplashScreen] = React.useState(true);
  const [fontsLoaded, error] = useFonts({
    Poppins_black: require("./assets/fonts/Poppins_black.ttf"),
    Nunito_extrabold: require("./assets/fonts/Nunito_extrabold.ttf"),
  });

  if (!fontsLoaded && !error) {
    return null;
  }
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer style={{ flex: 1 }}>
          {hideSplashScreen ? (
            <Tab.Navigator screenOptions={screenOptions}>
              <Tab.Screen name="Home" component={HomeStack}
                options={{
                  tabBarIcon: ({ focused }) => {
                    return (
                      <View style={{ alignItems: "center", justifyContent: "center" }} >
                        <Ionicons name="home-outline" size={24} color={focused ? "#990F0F" : "black"} />
                        <Text style={{fontSize:12,color:focused?"#990F0F":"black", fontWeight:'bold'}} >होम</Text>
                      </View>
                    )

                  }
                }}
              />
              <Tab.Screen name="Video" component={Video}
                options={{
                  tabBarIcon: ({ focused }) => {
                    return (
                      <View style={{ alignItems: "center", justifyContent: "center" }} >
                        <Feather name="video" size={24}
                          color={focused ? "#990F0F" : "black"}
                        />
                        <Text style={{fontSize:12,color:focused?"#990F0F":"black", fontWeight:'bold'}} >विडियो</Text>
                      </View>
                    )

                  }
                }}
              />
              <Tab.Screen name="Search" component={SearchScreen}
                options={{
                  tabBarIcon: ({ focused }) => {
                    return (
                      <View style={{ alignItems: "center", justifyContent: "center" }} >
                        <AntDesign name="search1" size={24}
                          color={focused ? "#990F0F" : "black"}
                        />
                        <Text style={{fontSize:12,color:focused?"#990F0F":"black", fontWeight:'bold'}} >सर्च</Text>
                      </View>
                    )
                  }
                }}
              />
            </Tab.Navigator>
          ) : null}
        </NavigationContainer>
      </GestureHandlerRootView>
    </>
  );
};
export default App;
