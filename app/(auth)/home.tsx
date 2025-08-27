import { useReservationService } from "@/services/ReservationService";
import dayjs from "dayjs";
import { useFocusEffect } from 'expo-router';
import { useCallback          , useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

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
      <View>
        <Text style={styles.header}>My Reservations</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        {reservations.map((item) => {
          const start = dayjs(`${item.date.split("T")[0]}T${item.start_time}`);
          const end = dayjs(`${item.date.split("T")[0]}T${item.end_time}`);
          return (
            <View key={item.id} style={styles.card}>
              <Text style={styles.date}>{start.format("MMMM D, YYYY")}</Text>
              <Text style={styles.time}>
                {start.format("h:mm A")} - {end.format("h:mm A")}
              </Text>
              <Text style={styles.facility}>{item.facility}</Text>
              <Text style={[styles.status, item.status === "pending" ? styles.pending : styles.confirmed]}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9f9f9" },
  scroll: { paddingBottom: 20 },
  header: {
    fontSize: 20,
    marginVertical: 10,
    padding: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  date: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  time: { fontSize: 14, color: "#555", marginBottom: 4 },
  facility: { fontSize: 15, fontWeight: "500", marginBottom: 4 },
  status: { fontSize: 12, fontWeight: "bold", paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, alignSelf: "flex-start" },
  pending: { backgroundColor: "#FFE1B0", color: "#AA6C39" },
  confirmed: { backgroundColor: "#D4EDDA", color: "#155724" },
});
