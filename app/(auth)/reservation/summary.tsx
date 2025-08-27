import LoadingModal from "@/components/LoadingModal"; // Import your loading modal
import { useAuth } from "@/contexts/AuthContext";
import { useReservation } from "@/contexts/ReservationContext";
import { useReservationService } from "@/services/ReservationService";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, SafeAreaView, StyleSheet, Text } from "react-native";

export default function Summary() {
  const reservationService = useReservationService();
  const { facility, date, start_time, end_time, resetReservation } = useReservation();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const formatDate = (d: Date | null) =>
    d
      ? dayjs(d).format("MMMM D, YYYY") // Example: June 1, 2003
      : "N/A";

  const formatTime = (d: Date | null) =>
    d ? dayjs(d).format("h:mm A") : "N/A"; // Example: 1:00 PM

  const handleConfirm = async () => {
    if (!user || !facility || !date || !start_time || !end_time) {
      Alert.alert("Error", "Missing reservation details!");
      return;
    }

    setLoading(true);

    try {
      const reservation = await reservationService.create({
        user_id: user.id,
        facility,
        date,
        start_time,
        end_time,
        fee: null,
      });

      if (__DEV__) {
        console.log("Reservation Details:", reservation);
      }

      Alert.alert("Success", "Reservation Confirmed!");

      resetReservation();
      router.replace("/home"); // Navigate back to home or reservations list
    } catch (error) {
      console.error("Reservation creation failed:", error);
      Alert.alert("Error", "Failed to create reservation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Name: {user?.first_name} {user?.last_name}</Text>
      <Text style={styles.title}>Reservation Summary</Text>
      <Text>Facility: {facility}</Text>
      <Text>Date: {formatDate(date)}</Text>
      <Text>Time: {formatTime(start_time)} - {formatTime(end_time)}</Text>

      <Button
        title="Confirm"
        onPress={handleConfirm}
        disabled={loading}
      />

      {/* Show loading modal when loading */}
      <LoadingModal visible={loading} message="Processing reservation..." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginVertical: 16,
    fontWeight: "bold",
  },
});
