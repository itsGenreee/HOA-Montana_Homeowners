import { useAuth } from "@/contexts/AuthContext";
import { ReservationProvider } from "@/contexts/ReservationContext";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { Redirect, Tabs } from "expo-router";
import { useTheme } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";


export default function AuthLayout() {
  const { user } = useAuth();
  const theme = useTheme();

  if (!user) {
    return <Redirect href="../index" />;
  }

  return (
    <SafeAreaProvider>
    <ReservationProvider>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: "rgba(0,0,0,0.4)",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface, // surface gives a card-like look
          borderTopWidth: 0.5,
          borderTopColor: theme.colors.outline,
          elevation: 3, // subtle shadow on Android
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size + 2} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="reservation"
        options={{
          title: "Reservation",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar-plus-o" size={size + 2} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size + 2} color={color} />
          ),
        }}
      />
    </Tabs>
    </ReservationProvider>
    </SafeAreaProvider>

  );
}
