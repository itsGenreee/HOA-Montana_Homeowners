import { useAuth } from "@/contexts/AuthContext";
import { useReservation } from "@/contexts/ReservationContext";
import { Button, SafeAreaView, StyleSheet, Text } from "react-native";

export default function Summary() {
  const { facility, date, start_time, end_time } = useReservation();
  const {user} = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Text>Name: {user?.first_name} {user?.last_name}</Text>
      <Text>Reservation Summary</Text>
      <Text>Facility: {facility}</Text>
      <Text>Date: {date}</Text>
      <Text>Time: {start_time} - {end_time}</Text>

      <Button title="Confirm" onPress={() => alert("Reservation Confirmed!")} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
