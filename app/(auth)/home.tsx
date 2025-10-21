import { useReservationService } from "@/services/ReservationService";
import { ReservationQRCode } from "@/utils/QrCodeGenerator";
import dayjs from "dayjs";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from "react-native";
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

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return "PENDING";
      case "confirmed":
        return "CONFIRMED";
      case "checked_in":
        return "CHECKED IN";
      default:
        return status.toUpperCase();
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return { chip: styles.pending, text: styles.pendingText };
      case "confirmed":
        return { chip: styles.confirmed, text: styles.confirmedText };
      case "checked_in":
        return { chip: styles.checkedIn, text: styles.checkedInText };
      default:
        return { chip: styles.pending, text: styles.pendingText };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        My Reservations
      </Text>
      
      {reservations.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            No reservations found
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {reservations.map((item) => {
            const start = dayjs(`${item.date.split("T")[0]}T${item.start_time}`);
            const end = dayjs(`${item.date.split("T")[0]}T${item.end_time}`);
            const statusStyle = getStatusStyle(item.status);

            return (
              <Card 
                key={item.id} 
                style={styles.card} 
                onPress={() => openQrModal(item)}
              >
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
                    style={[styles.statusChip, statusStyle.chip]}
                    textStyle={[styles.statusText, statusStyle.text]}
                    compact
                  >
                    {getStatusDisplay(item.status)}
                  </Chip>

                  {/* QR Code Hint for confirmed reservations */}
                  {item.status === "confirmed" && (
                    <Text variant="bodySmall" style={styles.qrHint}>
                      Tap to view QR code
                    </Text>
                  )}
                </Card.Content>
              </Card>
            );
          })}
        </ScrollView>
      )}

      {/* QR Code Modal */}
      <Portal>
        <Modal visible={visible} onDismiss={closeQrModal} contentContainerStyle={styles.modal}>
          {selectedReservation && (
            <View style={{ alignItems: "center" }}>
              <Text variant="titleMedium" style={{ marginBottom: 16 }}>
                Reservation QR Code
              </Text>
              <Text variant="bodyMedium" style={{ marginBottom: 8, textAlign: 'center' }}>
                Show this code at the facility to check in
              </Text>
              <ReservationQRCode
                reservation={{
                  reservation_token: selectedReservation.reservation_token,
                  digital_signature: selectedReservation.digital_signature,
                }}
                size={300}
              />

              <Button 
                mode="contained" 
                onPress={closeQrModal} 
                style={{ marginTop: 16 }}
              >
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
  container: { 
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  scroll: { 
    paddingBottom: 20 
  },
  header: { 
    marginVertical: 16,
  },
  card: { 
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  date: { 
    marginBottom: 4, 
    fontWeight: "bold" 
  },
  time: { 
    marginBottom: 4, 
    color: "#555" 
  },
  facility: { 
    marginBottom: 8, 
    fontWeight: "500" 
  },
  statusChip: { 
    alignSelf: "flex-start",
    marginTop: 8,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  pending: { 
    backgroundColor: "#FFE1B0" 
  },
  pendingText: { 
    color: "#AA6C39" 
  },
  confirmed: { 
    backgroundColor: "#D4EDDA" 
  },
  confirmedText: { 
    color: "#155724" 
  },
  checkedIn: { 
    backgroundColor: "#D1ECF1" 
  },
  checkedInText: { 
    color: "#0C5460" 
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  qrHint: {
    marginTop: 8,
    color: "#666",
    fontStyle: "italic",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
  },
});