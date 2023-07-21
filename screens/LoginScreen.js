import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

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
    <SafeAreaView>
      <View>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          placeholder="Password"
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        <Button title="Login" onPress={handleLogin} />
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
