import { 
  StyleSheet, 
  SafeAreaView, 
  View, 
  Button, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import FormTextFields from '@/components/FormTextFields';
import { useState } from 'react';
import api from '@/utils/api';
import { useAuth } from '@/contexts/AuthContext';
import { saveToken } from '@/utils/TokenStorage';
import { useRouter } from 'expo-router';

const Registration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useAuth(); // make sure your AuthContext exposes this
  const router = useRouter();

  async function handleRegister() {
    if (!firstName || !lastName || !email || !password || !confirmedPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    if (password !== confirmedPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/register', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        password_confirmation: confirmedPassword
      });

      const { user, token } = response.data;
      if (__DEV__) {
        console.log(response.data);
      }

      // Save token & update context
      await saveToken(token);
      setUser(user);

      // Redirect to home
      router.replace('/home');

    } catch (error: any) {
      Alert.alert(
        "Error", 
        error.response?.data?.message || 
        error.message || 
        "Registration failed"
      );
      if (__DEV__) console.log("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <FormTextFields 
          label='First Name:'
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize='words'
          placeholder="Enter your first name"
          editable={!isLoading}
        />
        <FormTextFields 
          label='Last Name:'
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize='words'
          placeholder="Enter your last name"
          editable={!isLoading}
        />
        <FormTextFields 
          label='Email:'
          value={email}
          onChangeText={setEmail}
          autoCapitalize='none'
          keyboardType='email-address'
          placeholder="Enter your email"
          editable={!isLoading}
        />
        <FormTextFields 
          label="Password:"
          value={password}
          onChangeText={setPassword}
          autoCapitalize='none'
          secureTextEntry
          placeholder="At least 8 characters"
          editable={!isLoading}
        />
        <FormTextFields 
          label="Confirm Password:"
          value={confirmedPassword}
          onChangeText={setConfirmedPassword}
          autoCapitalize='none'
          secureTextEntry
          placeholder="Re-enter your password"
          editable={!isLoading}
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
        ) : (
          <Button title="Register" onPress={handleRegister} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    padding: 20,
  },
  loader: {
    marginTop: 20,
    alignSelf: 'center',
  }
});
