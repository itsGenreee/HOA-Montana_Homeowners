import { useRouter } from "expo-router";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
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
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
});
