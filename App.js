const Stack = createNativeStackNavigator();
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SearchScreen from "./screens/SearchScreen";
import Home from "./screens/Home";
import Details from "./screens/Details";
import LoginScreen from "./screens/LoginScreen";
import Register from "./screens/Register";
import registerNNPushToken, { getPushDataObject } from 'native-notify';

const App = () => {  
  registerNNPushToken(9590, 'RIjT7ppebM4Hcf4PrfRDcP');
  const pushDataObject = getPushDataObject();

  // useEffect(() => {
  //   Alert.alert(pushDataObject)
  // }, [pushDataObject]);

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
          <NavigationContainer>
            {hideSplashScreen ? (
              <Stack.Navigator screenOptions={{ headerShown: true }}>
                <Stack.Screen 
                name="Home" 
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
            ) : null}
          </NavigationContainer>
        </GestureHandlerRootView>
    </>
  );
};
export default App;
