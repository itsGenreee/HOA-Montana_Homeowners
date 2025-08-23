import { useReservation } from "@/contexts/ReservationContext";
import { useRouter } from "expo-router";
import { Button, SafeAreaView, StyleSheet, Text } from "react-native";

export default function Facility() {
  const router = useRouter();
  const { setFacility } = useReservation();

  return (
    <SafeAreaView style={styles.container}>
      <Text>Select a Facility</Text>

      <Button title="Basketball" onPress={() => 
        {setFacility("Gym")
        router.replace("./date")}} />

      <Button title="Gym" onPress={() => 
        {setFacility("Pool")
         router.replace("./date")}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});