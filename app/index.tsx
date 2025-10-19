import FormTextFields from "@/components/FormTextFields";
import LoadingModal from "@/components/LoadingModal";
import { useAuth } from "@/contexts/AuthContext";
import { theme } from "@/theme";
import { retrieveToken } from "@/utils/TokenStorage";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";

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

  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        // First check if we have a token before calling me()
        const token = await retrieveToken();
        if (token) {
          await me(); // Only call me() if we have a token
        }
      } catch (error) {
        // Token is invalid or doesn't exist, stay on login page
        console.log('No valid token found:', error);
      } finally {
        setCheckingAuth(false); // Auth check complete
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
      // REMOVED: router.replace("/home") - Let the useEffect handle navigation
    } catch (error: any) {
      showDialog("Login Failed", error.message || "Something went wrong");
      if (__DEV__) console.log("Full login error:", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <FormTextFields
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Enter your email"
        />
        <FormTextFields
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
        />

        <Button 
          mode="contained"
          onPress={handleLogin}
          disabled={isLoading}>
          Login
        </Button>

        <Link
        href="/registration" 
        style={[styles.link, {color: theme.colors.primary}]}>
          Create an account
        </Link>
      </View>

      {/* Loading modal */}
      <LoadingModal visible={isLoading} message="Logging in..." />

      {/* Paper Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>{dialogTitle}</Dialog.Title>
          <Dialog.Content>
            <Text>{dialogMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
  },
  formContainer: {
    padding: 20,
    gap: 16,
  },
  link: {
    marginTop: 20,
    textAlign: "center",
  },
});