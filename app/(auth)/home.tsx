import { useReservationService } from "@/services/ReservationService";
import { ReservationQRCode } from "@/utils/QrCodeGenerator";
import dayjs from "dayjs";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Modal, Portal, Text } from "react-native-paper";

type Reservation = {
  id: number;
  user_id: number;            // required for signature verification
  facility: string;           // facility name (display)
  facility_id: number;        // required for signature verification
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  reservation_token: string;
  digital_signature: string;
};


export default function Home() {
  const { getUserReservations } = useReservationService();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [visible, setVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchReservations = async () => {
        try {
          const data = await getUserReservations();
          setReservations(data);
        } catch (error) {
          console.error("Failed to fetch reservations:", error);
        }
      };
      fetchReservations();
    }, [])
  );

  const openQrModal = (reservation: Reservation) => {
    if (reservation.status === "confirmed") {
      setSelectedReservation(reservation);
      setVisible(true);
    }
  };

  const closeQrModal = () => {
    setVisible(false);
    setSelectedReservation(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        My Reservations
      </Text>
      <ScrollView contentContainerStyle={styles.scroll}>
        {reservations.map((item) => {
          const start = dayjs(`${item.date.split("T")[0]}T${item.start_time}`);
          const end = dayjs(`${item.date.split("T")[0]}T${item.end_time}`);
          const isPending = item.status === "pending";

          return (
            <Card key={item.id} style={styles.card} onPress={() => openQrModal(item)}>
              <Card.Content>
                {/* Facility name */}
                <Text variant="titleLarge" style={styles.facility}>
                  {item.facility || "Unknown Facility"}
                </Text>

                {/* Date and Time */}
                <Text variant="titleMedium" style={styles.date}>
                  {start.format("MMMM D, YYYY")}
                </Text>
                <Text variant="bodyMedium" style={styles.time}>
                  {start.format("h:mm A")} - {end.format("h:mm A")}
                </Text>

                {/* Status Chip */}
                <Chip
                  style={[styles.statusChip, isPending ? styles.pending : styles.confirmed]}
                  textStyle={isPending ? styles.pendingText : styles.confirmedText}
                  compact
                >
                  {item.status.toUpperCase()}
                </Chip>
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>

      {/* QR Code Modal */}
      <Portal>
        <Modal visible={visible} onDismiss={closeQrModal} contentContainerStyle={styles.modal}>
          {selectedReservation && (
            <View style={{ alignItems: "center" }}>
              <Text variant="titleMedium" style={{ marginBottom: 16 }}>
                Reservation QR Code
              </Text>
              <ReservationQRCode
                reservation={{
                  reservation_token: selectedReservation.reservation_token,
                  digital_signature: selectedReservation.digital_signature,
                }}
                size={300}
              />

              <Button mode="contained" onPress={closeQrModal} style={{ marginTop: 16 }}>
                Close
              </Button>
            </View>
          )}
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  scroll: { paddingBottom: 20 },
  header: { marginVertical: 16 },
  card: { marginBottom: 16 },
  date: { marginBottom: 4, fontWeight: "bold" },
  time: { marginBottom: 4, color: "#555" },
  facility: { marginBottom: 8, fontWeight: "500" },
  statusChip: { alignSelf: "flex-start" },
  pending: { backgroundColor: "#FFE1B0" },
  pendingText: { color: "#AA6C39", fontWeight: "bold" },
  confirmed: { backgroundColor: "#D4EDDA" },
  confirmedText: { color: "#155724", fontWeight: "bold" },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 12,
    alignItems: "center",
  },
});
