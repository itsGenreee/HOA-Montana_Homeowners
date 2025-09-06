import { useAuth } from "@/contexts/AuthContext";
import { useReservation } from "@/contexts/ReservationContext";
import { useReservationService } from "@/services/ReservationService";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Dialog, Divider, Portal, Text } from "react-native-paper";

export default function Summary() {
  const reservationService = useReservationService();
  const { facility_id, date, start_time, end_time, fee, resetReservation } = useReservation();
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");

  const formatDate = (d: Date | null) => (d ? dayjs(d).format("MMMM D, YYYY") : "N/A");
  const formatTime = (d: Date | null) => (d ? dayjs(d).format("h:mm A") : "N/A");

  const showDialog = (message: string) => {
    setDialogMessage(message);
    setDialogVisible(true);
  };
  const hideDialog = () => setDialogVisible(false);

  const handleReservation = async () => {
    if (!user || !facility_id || !date || !start_time || !end_time) {
      showDialog("Missing reservation details!");
      return;
    }

    // Show loading dialog immediately
    setLoading(true);
    showDialog("Processing reservation...");

    try {
      await reservationService.create({
        user_id: user.id,
        facility_id, // Use facility_id instead of facility
        date,
        start_time,
        end_time,
        fee,
      });

      resetReservation();
      setDialogMessage("Reservation Confirmed!");
    } catch (error) {
      console.error("Reservation creation failed:", error);
      setDialogMessage("Failed to create reservation.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOk = () => {
    hideDialog();
    // Redirect only if reservation succeeded
    if (dialogMessage === "Reservation Confirmed!") {
      router.replace('/reservation')
      router.replace("/(auth)/home");
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>Reservation Summary</Text>

        <View style={styles.content}>
          <View style={styles.row}>
            <Text variant="titleMedium">Name:</Text>
            <Text>{user?.first_name} {user?.last_name}</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="titleMedium">Facility ID:</Text>
            <Text>{facility_id}</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="titleMedium">Date:</Text>
            <Text>{formatDate(date)}</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="titleMedium">Time:</Text>
            <Text>{formatTime(start_time)} - {formatTime(end_time)}</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="titleMedium">Fee:</Text>
            <Text>₱{fee || "N/A"}</Text>
          </View>
          <Divider style={styles.divider} />

          <Button
            mode="contained"
            onPress={handleReservation}
            style={styles.button}
            contentStyle={{ paddingVertical: 8 }}
          >
            Confirm
          </Button>
        </View>

        <Portal>
          <Dialog visible={dialogVisible} onDismiss={hideDialog}>
            <Dialog.Title>Notice</Dialog.Title>
            <Dialog.Content style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              {loading && <ActivityIndicator />}
              <Text>{dialogMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              {!loading && <Button onPress={handleDialogOk}>OK</Button>}
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  title: { fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  content: { width: "100%", maxWidth: 400, gap: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  divider: { backgroundColor: "#ccc" },
  button: { marginTop: 20 },
});