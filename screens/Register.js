import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('https://peptechtime.com/wp-json/wp/v2/users/register', {
        username,
        email,
        password,
      });

      // If the registration is successful, response.data should contain the user data, including the authentication token
      const authToken = response.data.token;

      // You can now store the authToken in AsyncStorage or Redux for further API requests
      // For simplicity, we'll just display an alert with the token
      Alert.alert('Registration Successful', 'User registered successfully.');
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      Alert.alert('Registration Failed', 'Error during registration. Please try again.');
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
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
    </SafeAreaView>
  );
};

export default Register;
