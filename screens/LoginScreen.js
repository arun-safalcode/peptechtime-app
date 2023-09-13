import React, { useState } from 'react';
import { View, TextInput,Text, Button, Alert,Image ,StyleSheet} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Octicons } from '@expo/vector-icons';

import Logo from '../assets/logo.png';
import { useNavigation } from '@react-navigation/native';
const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();


  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'https://peptechtime.com/wp-json/jwt-auth/v1/token',
        {
          username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // If the login is successful, response.data should contain the user data, including the authentication token
      const authToken = response.data.token;

      // You can now store the authToken in AsyncStorage or Redux for further API requests
      // For simplicity, we'll just display an alert with the token
      Alert.alert('Authentication Successful', 'Login successful.');
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={styles.topHeader}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
        >
          <View  style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Octicons name="chevron-left" size={24} color="black" />
              <Text style={{fontSize:16, fontWeight:'bold'}}> वापस</Text>
          </View>
          
        </TouchableOpacity>
      </View>
      <View style={styles.logo}>
          <Image source={Logo} />        
      </View>
      <View style={styles.form}>
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={(text) => setUsername(text)}
            style={styles.inputfield}
          />
          <TextInput
            placeholder="Password"
            value={password}
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
            style={styles.inputfield}
          />
          <Button title="Login" onPress={handleLogin} color="#990F0F" />


          
        </View>
      
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 100,
  },
  form:{
    margin:40,
  },
  inputfield:{
    marginBottom:20,
    fontSize:18,
    borderColor: "#C0C0C0",
    borderBottomWidth: 1
  },
  submit: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFB3B6',
    borderRadius: 25,
    margin: 2,
    color: '#990F0F',
    fontSize: 24,
    fontWeight: 'normal'
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    
    elevation: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  }
});


export default LoginScreen;
