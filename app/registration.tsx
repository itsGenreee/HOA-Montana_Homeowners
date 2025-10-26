import FormTextFields from '@/components/FormTextFields';
import LoadingModal from '@/components/LoadingModal';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/utils/api';
import { saveToken } from '@/utils/TokenStorage';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { TextInput as RNTextInput, SafeAreaView, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ActivityIndicator, Button, Card, Dialog, Portal, Text, useTheme } from 'react-native-paper';

const Registration = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  // Refs for input fields
  const lastNameRef = useRef<RNTextInput>(null);
  const addressRef = useRef<RNTextInput>(null);
  const emailRef = useRef<RNTextInput>(null);
  const passwordRef = useRef<RNTextInput>(null);
  const confirmPasswordRef = useRef<RNTextInput>(null);
  const scrollViewRef = useRef<any>(null);

  const { setUser } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const showDialog = (message: string) => {
    setDialogMessage(message);
    setDialogVisible(true);
  };
  const hideDialog = () => setDialogVisible(false);

  const focusNextField = (nextRef: React.RefObject<RNTextInput>) => {
    nextRef.current?.focus();
  };

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
        address: address,
        email: email,
        password: password,
        password_confirmation: confirmedPassword
      });

      const { user, token } = response.data;
      if (__DEV__) console.log(response.data);

      await saveToken(token);
      setUser(user);
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

  const handleLoginRedirect = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        extraScrollHeight={50} // Increased for better visibility
        keyboardOpeningTime={0}
        enableResetScrollToCoords={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        enableAutomaticScroll={true}
        extraHeight={100} // Additional buffer
      >
        <View style={styles.headerContainer}>
          <Text variant="headlineMedium" style={[styles.title, { color: theme.colors.onBackground }]}>
            Create Account
          </Text>
          <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            Join us and start making reservations
          </Text>
        </View>

        <Card style={styles.formCard}>
          <Card.Content style={styles.formContent}>
            <View style={styles.formSection}>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
                Personal Information
              </Text>
              
              <FormTextFields 
                label='First Name *' 
                value={firstName} 
                onChangeText={setFirstName} 
                autoCapitalize='words' 
                placeholder="Enter your first name" 
                editable={!isLoading}
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => focusNextField(lastNameRef)}
              />
              <FormTextFields 
                ref={lastNameRef}
                label='Last Name *' 
                value={lastName} 
                onChangeText={setLastName} 
                autoCapitalize='words' 
                placeholder="Enter your last name" 
                editable={!isLoading}
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => focusNextField(addressRef)}
              />
              <FormTextFields 
                ref={addressRef}
                label='Address' 
                value={address} 
                onChangeText={setAddress} 
                autoCapitalize='words' 
                placeholder="Enter your address" 
                editable={!isLoading}
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => focusNextField(emailRef)}
              />
            </View>

            <View style={styles.formSection}>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
                Account Details
              </Text>
              
              <FormTextFields 
                ref={emailRef}
                label='Email *' 
                value={email} 
                onChangeText={setEmail} 
                autoCapitalize='none' 
                keyboardType='email-address' 
                placeholder="Enter your email" 
                editable={!isLoading}
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => focusNextField(passwordRef)}
              />
              <FormTextFields 
                ref={passwordRef}
                label="Password *" 
                value={password} 
                onChangeText={setPassword} 
                autoCapitalize='none' 
                secureTextEntry 
                placeholder="At least 8 characters" 
                editable={!isLoading}
                style={styles.input}
                returnKeyType="next"
                onSubmitEditing={() => focusNextField(confirmPasswordRef)}
              />
              <FormTextFields 
                ref={confirmPasswordRef}
                label="Confirm Password *" 
                value={confirmedPassword} 
                onChangeText={setConfirmedPassword} 
                autoCapitalize='none' 
                secureTextEntry 
                placeholder="Re-enter your password" 
                editable={!isLoading}
                style={styles.input}
                returnKeyType="done"
                onSubmitEditing={handleRegister}
              />
            </View>

            <View style={styles.requirements}>
              <Text variant="bodySmall" style={[styles.requirementText, { color: theme.colors.onSurfaceVariant }]}>
                * Required fields
              </Text>
              <Text variant="bodySmall" style={[styles.requirementText, { color: theme.colors.onSurfaceVariant }]}>
                • Password must be at least 8 characters long
              </Text>
            </View>

            <Button 
              mode="contained" 
              onPress={handleRegister} 
              disabled={isLoading} 
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Create Account
            </Button>
          </Card.Content>
        </Card>

        <Card style={styles.loginCard}>
          <Card.Content style={styles.loginContent}>
            <Text variant="bodyMedium" style={[styles.loginText, { color: theme.colors.onSurfaceVariant }]}>
              Already have an account?
            </Text>
            <Button 
              mode="text" 
              onPress={handleLoginRedirect}
              style={styles.loginButton}
              labelStyle={styles.loginButtonLabel}
            >
              Sign In
            </Button>
          </Card.Content>
        </Card>
      </KeyboardAwareScrollView>

      {/* Loading modal */}
      <LoadingModal visible={isLoading} message="Creating your account..." />

      {/* Dialog for messages */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>Notice</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            {isLoading && <ActivityIndicator size="small" style={styles.loader} />}
            <Text variant="bodyMedium" style={styles.dialogMessage}>{dialogMessage}</Text>
          </Dialog.Content>
          {!isLoading && (
            <Dialog.Actions>
              <Button onPress={handleDialogOk} style={styles.dialogButton}>
                OK
              </Button>
            </Dialog.Actions>
          )}
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  title: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  formContent: {
    paddingVertical: 8,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  requirements: {
    marginBottom: 24,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  requirementText: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    marginBottom: 4,
  },
  registerButton: {
    borderRadius: 12,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    fontSize: 16,
  },
  loginCard: {
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loginText: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    marginRight: 8,
  },
  loginButton: {
    margin: 0,
  },
  loginButtonLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
  },
  dialog: {
    borderRadius: 16,
  },
  dialogTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
  },
  dialogContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dialogMessage: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    flex: 1,
  },
  dialogButton: {
    borderRadius: 8,
  },
  loader: {
    marginRight: 8,
  },
});