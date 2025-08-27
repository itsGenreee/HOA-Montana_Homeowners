import { useAuth } from "@/contexts/AuthContext";
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Redirect, Tabs } from "expo-router";

export default function AuthLayout() {
    const { user } = useAuth();

    if (!user) {
    return <Redirect href="../index" />;
   }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "black",   // active color
        tabBarInactiveTintColor: "gray", // inactive (dimmer) color
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ 
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="reservation"
        options={{ 
          title: "Reservation",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="calendar-plus-o" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{ 
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
