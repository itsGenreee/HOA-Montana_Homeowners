import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import * as Notifications from 'expo-notifications';
import { Stack } from "expo-router";
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from '../theme';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  return (
    <NotificationProvider>   
      <PaperProvider theme={theme}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="registration" />
            <Stack.Screen name="(auth)" />
          </Stack>
        </AuthProvider>
      </PaperProvider>
    </NotificationProvider>
  );
}
