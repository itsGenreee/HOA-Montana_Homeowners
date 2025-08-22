import { AuthProvider } from '@/contexts/AuthContext';
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="registration" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </AuthProvider>
  );
}
