import FormTextFields from '@/components/FormTextFields';
import LoadingModal from '@/components/LoadingModal';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { saveToken } from '@/utils/TokenStorage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Dialog, Portal, Text } from 'react-native-paper';

const Registration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const { setUser } = useAuth();
  const router = useRouter();

  const showDialog = (message: string) => {
    setDialogMessage(message);
    setDialogVisible(true);
  };
  const hideDialog = () => setDialogVisible(false);

  async function handleRegister() {
    if (!firstName || !lastName || !email || !password || !confirmedPassword) {
      showDialog("Please fill in all fields");
      return;
    }
    if (password !== confirmedPassword) {
      showDialog("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      showDialog("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    showDialog("Creating your account...");

    try {
      const response = await api.post('/register', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        password_confirmation: confirmedPassword
      });

      const { user, token } = response.data;
      if (__DEV__) console.log(response.data);

      // Save token & update context
      await saveToken(token);
      setUser(user);

      // Update dialog message
      setDialogMessage("Registration successful!");
    } catch (error: any) {
      setDialogMessage(
        error.response?.data?.message || 
        error.message || 
        "Registration failed"
      );
      if (__DEV__) console.log("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDialogOk = () => {
    hideDialog();
    if (dialogMessage === "Registration successful!") {
      router.replace('/home');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text variant="headlineSmall" style={styles.header}>
          Create an Account
        </Text>

        <FormTextFields label='First Name:' value={firstName} onChangeText={setFirstName} autoCapitalize='words' placeholder="Enter your first name" editable={!isLoading} />
        <FormTextFields label='Last Name:' value={lastName} onChangeText={setLastName} autoCapitalize='words' placeholder="Enter your last name" editable={!isLoading} />
        <FormTextFields label='Email:' value={email} onChangeText={setEmail} autoCapitalize='none' keyboardType='email-address' placeholder="Enter your email" editable={!isLoading} />
        <FormTextFields label="Password:" value={password} onChangeText={setPassword} autoCapitalize='none' secureTextEntry placeholder="At least 8 characters" editable={!isLoading} />
        <FormTextFields label="Confirm Password:" value={confirmedPassword} onChangeText={setConfirmedPassword} autoCapitalize='none' secureTextEntry placeholder="Re-enter your password" editable={!isLoading} />

        <Button mode="contained" onPress={handleRegister} disabled={isLoading} style={styles.button}>
          Register
        </Button>
      </View>

      {/* Loading modal */}
      <LoadingModal visible={isLoading} message="Creating your account..." />

      {/* Dialog for messages */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Notice</Dialog.Title>
          <Dialog.Content style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {isLoading && <ActivityIndicator />}
            <Text>{dialogMessage}</Text>
          </Dialog.Content>
          {!isLoading && (
            <Dialog.Actions>
              <Button onPress={handleDialogOk}>OK</Button>
            </Dialog.Actions>
          )}
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  formContainer: { padding: 20, gap: 16 },
  header: { marginVertical: 16, fontWeight: 'bold' },
  button: { marginTop: 16 },
});
