import { useReservationService } from "@/services/ReservationService";
import dayjs from "dayjs";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { Card, Chip, Text } from "react-native-paper";

type Reservation = {
  id: number;
  facility: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
};

export default function Home() {
  const { getUserReservations } = useReservationService();
  const [reservations, setReservations] = useState<Reservation[]>([]);

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
    }, [getUserReservations])
  );

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
            <Card key={item.id} style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.date}>
                  {start.format("MMMM D, YYYY")}
                </Text>
                <Text variant="bodyMedium" style={styles.time}>
                  {start.format("h:mm A")} - {end.format("h:mm A")}
                </Text>
                <Text variant="bodyLarge" style={styles.facility}>
                  {item.facility}
                </Text>
                <Chip
                  style={[
                    styles.statusChip,
                    isPending ? styles.pending : styles.confirmed,
                  ]}
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
});
