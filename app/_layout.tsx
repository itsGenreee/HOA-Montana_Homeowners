import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AuthProvider } from '@/contexts/AuthContext';
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { theme } from '../theme';


// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  

  // Custom Fonts
  const [fontsLoaded, fontError] = useFonts({
    'Satoshi-Black': require('@/assets/fonts/Satoshi-Black.ttf'),
    'Satoshi-Bold': require('@/assets/fonts/Satoshi-Bold.ttf'),
    'Satoshi-Italic': require('@/assets/fonts/Satoshi-Italic.ttf'),
    'Satoshi-Light': require('@/assets/fonts/Satoshi-Light.ttf'),
    'Satoshi-Medium': require('@/assets/fonts/Satoshi-Medium.ttf'),
    'Satoshi-Regular': require('@/assets/fonts/Satoshi-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Wait for fonts to load
        if (fontsLoaded || fontError) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // Optional: minimal loading time
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, [fontsLoaded, fontError]);

  // Show nothing while loading (splash screen will remain visible)
  if (!appIsReady || (!fontsLoaded && !fontError)) {
    return null;
  }

  return (
    <ErrorBoundary>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="registration" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="forgot" />
            <Stack.Screen name="otp-verification" />
            <Stack.Screen name="reset-password" />
          </Stack>
        </AuthProvider>
      </PaperProvider>
    </ErrorBoundary>
  );
}