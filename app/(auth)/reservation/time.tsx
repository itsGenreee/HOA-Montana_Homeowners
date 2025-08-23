import { useReservation } from "@/contexts/ReservationContext";
import { useRouter } from "expo-router";
import { Button, SafeAreaView, StyleSheet, Text } from "react-native";

export default function Time() {
  const router = useRouter();
  const { setStartTime, setEndTime  } = useReservation();

  return (
    <SafeAreaView style={styles.container}>
      <Text>Select a Time</Text>

      <Text>1:00 PM - 2:00 PM</Text>
      <Button
        title="Noon"
        onPress={() => {
          setStartTime("1:00 PM");
          setEndTime("2:00 PM");
          router.replace("./summary");
        }}
      />
      
      <Text>2:00 PM - 3:00 PM</Text>
      <Button
        title="Afternoon"
        onPress={() => {
          setStartTime("2:00 PM");
          setEndTime("3:00 PM");
          router.replace("./summary");
        }}
      />
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
