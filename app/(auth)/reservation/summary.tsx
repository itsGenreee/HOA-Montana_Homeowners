import { useAuth } from "@/contexts/AuthContext";
import { useReservation } from "@/contexts/ReservationContext";
import { useReservationService } from "@/services/ReservationService";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Dialog, Divider, Portal, Text } from "react-native-paper";

export default function Summary() {
  const reservationService = useReservationService();
  const { 
    facility_id, 
    date, 
    start_time, 
    end_time, 
    facility_fee,
    event_type, guest_count,
    chair_quantity, chair_price,
    table_quantity, table_price,
    videoke, videoke_price,
    projector, projector_price,
    brides_room, brides_room_price,
    island_garden, island_garden_price,
    resetReservation 
  } = useReservation();
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

  // Calculate total amenities cost (for display only)
  const calculateAmenitiesTotal = () => {
    let total = 0;
    if (chair_quantity && chair_price) total += chair_quantity * chair_price;
    if (table_quantity && table_price) total += table_quantity * table_price;
    if (videoke && videoke_price) total += videoke * videoke_price;
    if (projector && projector_price) total += projector * projector_price;
    if (brides_room && brides_room_price) total += brides_room * brides_room_price;
    if (island_garden && island_garden_price) total += island_garden * island_garden_price;
    return total;
  };

  // Check if it's an event place (facility_id 3)
  const isEventPlace = facility_id === 3;
  
  // Check if any amenities were selected (only for event place)
  const hasAmenities = isEventPlace && (chair_quantity || table_quantity || videoke || projector || brides_room || island_garden);

  const handleReservation = async () => {
    if (!user || !facility_id || !date || !start_time || !end_time) {
      showDialog("Missing reservation details!");
      return;
    }

    setLoading(true);
    showDialog("Processing reservation...");

    try {

      console.log(event_type);
      console.log(guest_count);
      console.log(facility_id);
      console.log(date);
      console.log(start_time);
      console.log(end_time);
      await reservationService.create({
        event_type,
        guest_count,
        facility_id,
        date,
        start_time,
        end_time,
        // REMOVED: fee: grandTotal, ← Server calculates this!
      });

      resetReservation();
      setDialogMessage("Reservation Confirmed!");
    } catch (error: any) {
      console.error("Reservation creation failed:", error);
      setDialogMessage(error.response?.data?.message || "Failed to create reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOk = () => {
    hideDialog();
    if (dialogMessage === "Reservation Confirmed!") {
      router.replace('/(auth)/reservation')
      router.replace('/(auth)/home');
    }
  };

  // Get facility name based on ID
  const getFacilityName = () => {
    switch(facility_id) {
      case 1: return "Tennis Court";
      case 2: return "Basketball Court";
      case 3: return "Event Place";
      default: return `Facility #${facility_id}`;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>Reservation Summary</Text>

        <View style={styles.content}>
          <View style={styles.row}>
            <Text variant="titleMedium">Name:</Text>
            <Text>{user?.first_name} {user?.last_name}</Text>
          </View>
          <Divider style={styles.divider} />

          <View style={styles.row}>
            <Text variant="titleMedium">Facility:</Text>
            <Text>{getFacilityName()}</Text>
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
            <Text variant="titleMedium">Facility Fee:</Text>
            <Text> {`₱${facility_fee?.toLocaleString() || 0}`} </Text>
          </View>
          <Divider style={styles.divider} />

          {/* Amenities Section - ONLY for Event Place */}
          {isEventPlace && hasAmenities && (
            <>
            <View style={styles.row}>
              <Text variant="titleMedium">Event Type:</Text>
              <Text>{event_type || "N/A"}</Text>
            </View>
            <Divider style={styles.divider} />

            <View style={styles.row}>
              <Text variant="titleMedium">Guest Count:</Text>
              <Text>{guest_count ? guest_count.toLocaleString() : "N/A"}</Text>
            </View>
            <Divider style={styles.divider} />
              <Text variant="titleMedium" style={styles.sectionTitle}>Selected Amenities:</Text>
              
              {chair_quantity && chair_price && (
                <View style={styles.amenityRow}>
                  <Text>Chair ×{chair_quantity}</Text>
                  <Text>₱{(chair_quantity * chair_price).toLocaleString()}</Text>
                </View>
              )}
              
              {table_quantity && table_price && (
                <View style={styles.amenityRow}>
                  <Text>Table ×{table_quantity}</Text>
                  <Text>₱{(table_quantity * table_price).toLocaleString()}</Text>
                </View>
              )}
              
              {videoke && videoke_price && (
                <View style={styles.amenityRow}>
                  <Text>Videoke</Text>
                  <Text>₱{videoke_price.toLocaleString()}</Text>
                </View>
              )}
              
              {projector && projector_price && (
                <View style={styles.amenityRow}>
                  <Text>Projector Set</Text>
                  <Text>₱{projector_price.toLocaleString()}</Text>
                </View>
              )}
              
              {brides_room && brides_room_price && (
                <View style={styles.amenityRow}>
                  <Text>Brides Room</Text>
                  <Text>₱{brides_room_price.toLocaleString()}</Text>
                </View>
              )}
              
              {island_garden && island_garden_price && (
                <View style={styles.amenityRow}>
                  <Text>Island Garden</Text>
                  <Text>₱{island_garden_price.toLocaleString()}</Text>
                </View>
              )}

              <View style={styles.amenityRow}>
                <Text variant="titleMedium">Amenities Total:</Text>
                <Text variant="titleMedium">₱{calculateAmenitiesTotal().toLocaleString()}</Text>
              </View>
              <Divider style={styles.divider} />
            </>
          )}

          {/* Grand Total - Display only (server calculates actual total) */}
          <View style={styles.totalRow}>
            <Text variant="titleLarge">Estimated Total:</Text>
            <Text variant="titleLarge">
              ₱{(
              Number(facility_fee) +
              (isEventPlace ? Number(calculateAmenitiesTotal()) : 0)
            ).toLocaleString()}
            </Text>
          </View>
          
          <Text variant="bodySmall" style={styles.noteText}>
            *Final total will be confirmed by the server
          </Text>
          
          <Divider style={styles.divider} />

          <Button
            mode="contained"
            onPress={handleReservation}
            style={styles.button}
            contentStyle={{ paddingVertical: 8 }}
            disabled={loading}
          >
            {loading ? "Processing..." : "Confirm Reservation"}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 20 },
  title: { fontWeight: "bold", marginBottom: 20, textAlign: "center", marginTop: 20 },
  content: { width: "100%", maxWidth: 400, gap: 16, marginBottom: 40 },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  amenityRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingVertical: 6,
    paddingLeft: 8 
  },
  totalRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingVertical: 12,
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginTop: 8
  },
  sectionTitle: { 
    marginTop: 16, 
    marginBottom: 8,
    fontWeight: "bold" 
  },
  noteText: {
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 4,
  },
  divider: { backgroundColor: "#ccc", marginVertical: 4 },
  button: { marginTop: 24, marginBottom: 40 },
});