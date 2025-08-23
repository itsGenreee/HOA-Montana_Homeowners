import { useReservation } from "@/contexts/ReservationContext";
import { useRouter } from "expo-router";
import { Button, SafeAreaView, StyleSheet, Text } from "react-native";

export default function Date() {
  const router = useRouter();
  const { setDate } = useReservation();

  return (
    <SafeAreaView style={styles.container}>
      <Text>Select a Date</Text>

      <Button
        title="Today"
        onPress={() => {
          setDate("Today");
          router.replace("./time");
        }}
      />
      <Button
        title="Tomorrow"
        onPress={() => {
          setDate("Tomorrow");
          router.replace("./time");
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
