import FormTextFields from "@/components/FormTextFields";
import LoadingModal from "@/components/LoadingModal";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, SafeAreaView, StyleSheet, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { login, isLoading } = useAuth(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      Alert.alert("Success", "Login Successful!");
      router.replace("/home");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
      if (__DEV__) console.log("Full login error:", error);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <FormTextFields
          label="Email Address:"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Enter your email"
        />
        <FormTextFields
          label="Password:"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
        />

        <Button
          title="Login"
          onPress={handleLogin}
          disabled={isLoading}
        />

        <Link href="/registration" style={styles.link}>
          Create an account
        </Link>
      </View>

      {/* Loading modal instead of ActivityIndicator inline */}
      <LoadingModal visible={isLoading} message="Logging in..." />
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
    color: "blue",
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
