import { AuthProvider } from '@/contexts/AuthContext';
import { Stack } from "expo-router";
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from '../theme';

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="registration" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </AuthProvider>
    </PaperProvider>
  );
}
