import FormTextFields from "@/components/FormTextFields";
import LoadingModal from "@/components/LoadingModal";
import { useAuth } from "@/contexts/AuthContext";
import { retrieveToken } from "@/utils/TokenStorage";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { Button, Card, Dialog, Portal, Text, useTheme } from "react-native-paper";

export default function Index() {
  const router = useRouter();
  const { login, isLoading, user, me } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Dialog state
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

  const theme = useTheme();

  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const token = await retrieveToken();
        if (token) {
          await me();
        }
      } catch (error) {
        console.log('No valid token found:', error);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, []);

  useEffect(() => {
    if (!checkingAuth && user) {
      router.replace("/home");
    }
  }, [user, checkingAuth, router]);

  const showDialog = (title: string, message: string) => {
    setDialogTitle(title);
    setDialogMessage(message);
    setDialogVisible(true);
  };

  const hideDialog = () => setDialogVisible(false);

  async function handleLogin() {
    if (!email || !password) {
      showDialog("Error", "Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      showDialog("Success", "Login Successful!");
    } catch (error: any) {
      showDialog("Login Failed", error.message || "Something went wrong");
      if (__DEV__) console.log("Full login error:", error);
    }
  }

  const handleRegistrationRedirect = () => {
    router.push('/registration');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Brand Header Section */}
        <View style={styles.brandContainer}>
          <Text variant="headlineMedium" style={[styles.appName, { color: theme.colors.onBackground }]}>
            HOA Montaña
          </Text>
          <Text variant="bodyLarge" style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>
            Community Facility Reservations
          </Text>
        </View>

        {/* Login Form Card */}
        <Card style={styles.formCard}>
          <Card.Content style={styles.formContent}>
            <Text variant="titleLarge" style={[styles.formTitle, { color: theme.colors.onBackground }]}>
              Login
            </Text>
            <Text variant="bodyMedium" style={[styles.formSubtitle, { color: theme.colors.onSurfaceVariant }]}>
              Sign in to your account
            </Text>

            <View style={styles.formFields}>
              <FormTextFields
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="Enter your email"
                style={styles.input}
              />
              <FormTextFields
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholder="Enter your password"
                style={styles.input}
              />
            </View>

            {/* Updated Forgot Password Link */}
            <View style={styles.forgotPasswordContainer}>
              <Link href={'/forgot'} asChild>
                <Button 
                  mode="text" 
                  compact
                  onPress={() => router.push('/forgot')}
                  style={styles.forgotPasswordButton}
                  labelStyle={[styles.forgotPasswordText, { color: theme.colors.primary }]}
                >
                  Forgot Password?
                </Button>
              </Link>
            </View>

            <Button 
              mode="contained"
              onPress={handleLogin}
              disabled={isLoading}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Sign In
            </Button>

            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
              <Text variant="bodySmall" style={[styles.dividerText, { color: theme.colors.onSurfaceVariant }]}>
                New to HOA Montaña?
              </Text>
              <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />
            </View>

            <Button 
              mode="outlined"
              onPress={handleRegistrationRedirect}
              style={styles.registerButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.registerButtonLabel}
            >
              Create Account
            </Button>
          </Card.Content>
        </Card>

        {/* Footer */}
        <View style={styles.footer}>
          <Text variant="bodySmall" style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
            Your Community, Your Space
          </Text>
        </View>
      </ScrollView>

      {/* Loading modal */}
      <LoadingModal visible={isLoading} message="Logging in..." />

      {/* Paper Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>{dialogTitle}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.dialogMessage}>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog} style={styles.dialogButton}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 20,
  },
  logoText: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    fontSize: 28,
  },
  appName: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.8,
  },
  formCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 20,
  },
  formContent: {
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  formTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 32,
  },
  formFields: {
    gap: 16,
    marginBottom: 16, // Reduced to accommodate forgot password
  },
  input: {
    marginBottom: 0,
  },
  // New styles for forgot password
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  forgotPasswordButton: {
    alignSelf: 'center',
  },
  forgotPasswordText: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    fontSize: 14,
  },
  loginButton: {
    borderRadius: 12,
    elevation: 2,
    marginBottom: 24,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    paddingHorizontal: 12,
    opacity: 0.7,
  },
  registerButton: {
    borderRadius: 12,
    borderWidth: 1.5,
  },
  registerButtonLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    fontStyle: 'italic',
    opacity: 0.7,
  },
  dialog: {
    borderRadius: 16,
  },
  dialogTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
  },
  dialogMessage: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
  },
  dialogButton: {
    borderRadius: 8,
  },
});