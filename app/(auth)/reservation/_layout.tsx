import { ReservationProvider } from "@/contexts/ReservationContext";
import { Stack } from "expo-router";

const ReservationLayout = () => {
  return (
    <ReservationProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index"/>
          <Stack.Screen name="facility"/>
          <Stack.Screen name="date"/>
          <Stack.Screen name="time"/>
          <Stack.Screen name="summary"/>
        </Stack>
    </ReservationProvider>
  )
}

export default ReservationLayout