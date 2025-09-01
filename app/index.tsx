import FormTextFields from "@/components/FormTextFields";
import LoadingModal from "@/components/LoadingModal";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";

export default function Index() {
  const theme = useTheme();
  const router = useRouter();
  const { login, isLoading } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Dialog state
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");

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
      router.replace("/home");
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
