import { useRouter } from "expo-router";
import { SafeAreaView, StyleSheet } from "react-native";
import { Button, Text } from "react-native-paper";

export default function ReservationIndex() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={{ marginBottom: 20 }}>
        Make a New Reservation
      </Text>
      <Button mode="contained" onPress={() => router.push("/reservation/facility")}>
        Start Reservation
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
});
