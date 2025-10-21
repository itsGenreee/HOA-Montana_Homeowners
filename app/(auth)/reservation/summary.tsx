import { useAuth } from "@/contexts/AuthContext";
import { useReservation } from "@/contexts/ReservationContext";
import { useReservationService } from "@/services/ReservationService";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, Dialog, Divider, Portal, Text, useTheme } from "react-native-paper";

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
  const theme = useTheme();

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

  const estimatedTotal = Number(facility_fee) + (isEventPlace ? Number(calculateAmenitiesTotal()) : 0);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>Reservation Summary</Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Review your reservation details before confirming
          </Text>
        </View>

        <Card style={styles.summaryCard}>
          <Card.Content>
            {/* User Information */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>Personal Information</Text>
              <View style={styles.row}>
                <Text variant="bodyMedium" style={styles.label}>Name:</Text>
                <Text variant="bodyMedium" style={styles.value}>
                  {user?.first_name} {user?.last_name}
                </Text>
              </View>
              <Divider style={styles.divider} />
            </View>

            {/* Facility Details */}
            <View style={styles.section}>
              <Text variant="titleMedium" style={styles.sectionTitle}>Facility Details</Text>
              <View style={styles.row}>
                <Text variant="bodyMedium" style={styles.label}>Facility:</Text>
                <Text variant="bodyMedium" style={styles.value}>{getFacilityName()}</Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.row}>
                <Text variant="bodyMedium" style={styles.label}>Date:</Text>
                <Text variant="bodyMedium" style={styles.value}>{formatDate(date)}</Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.row}>
                <Text variant="bodyMedium" style={styles.label}>Time:</Text>
                <Text variant="bodyMedium" style={styles.value}>
                  {formatTime(start_time)} - {formatTime(end_time)}
                </Text>
              </View>
              <Divider style={styles.divider} />

              <View style={styles.row}>
                <Text variant="bodyMedium" style={styles.label}>Facility Fee:</Text>
                <Text variant="bodyMedium" style={styles.feeValue}>
                  ₱{facility_fee?.toLocaleString() || 0}
                </Text>
              </View>
            </View>

            {/* Event Details - Only for Event Place */}
            {isEventPlace && (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Event Details</Text>
                <View style={styles.row}>
                  <Text variant="bodyMedium" style={styles.label}>Event Type:</Text>
                  <Text variant="bodyMedium" style={styles.value}>{event_type || "N/A"}</Text>
                </View>
                <Divider style={styles.divider} />

                <View style={styles.row}>
                  <Text variant="bodyMedium" style={styles.label}>Guest Count:</Text>
                  <Text variant="bodyMedium" style={styles.value}>
                    {guest_count ? guest_count.toLocaleString() : "N/A"}
                  </Text>
                </View>
              </View>
            )}

            {/* Amenities Section - ONLY for Event Place */}
            {isEventPlace && hasAmenities && (
              <View style={styles.section}>
                <Text variant="titleMedium" style={styles.sectionTitle}>Selected Amenities</Text>
                
                {chair_quantity && chair_price && (
                  <View style={styles.amenityRow}>
                    <Text variant="bodyMedium" style={styles.amenityName}>Chair ×{chair_quantity}</Text>
                    <Text variant="bodyMedium" style={styles.amenityPrice}>
                      ₱{(chair_quantity * chair_price).toLocaleString()}
                    </Text>
                  </View>
                )}
                
                {table_quantity && table_price && (
                  <View style={styles.amenityRow}>
                    <Text variant="bodyMedium" style={styles.amenityName}>Table ×{table_quantity}</Text>
                    <Text variant="bodyMedium" style={styles.amenityPrice}>
                      ₱{(table_quantity * table_price).toLocaleString()}
                    </Text>
                  </View>
                )}
                
                {videoke && videoke_price && (
                  <View style={styles.amenityRow}>
                    <Text variant="bodyMedium" style={styles.amenityName}>Videoke</Text>
                    <Text variant="bodyMedium" style={styles.amenityPrice}>
                      ₱{videoke_price.toLocaleString()}
                    </Text>
                  </View>
                )}
                
                {projector && projector_price && (
                  <View style={styles.amenityRow}>
                    <Text variant="bodyMedium" style={styles.amenityName}>Projector Set</Text>
                    <Text variant="bodyMedium" style={styles.amenityPrice}>
                      ₱{projector_price.toLocaleString()}
                    </Text>
                  </View>
                )}
                
                {brides_room && brides_room_price && (
                  <View style={styles.amenityRow}>
                    <Text variant="bodyMedium" style={styles.amenityName}>Brides Room</Text>
                    <Text variant="bodyMedium" style={styles.amenityPrice}>
                      ₱{brides_room_price.toLocaleString()}
                    </Text>
                  </View>
                )}
                
                {island_garden && island_garden_price && (
                  <View style={styles.amenityRow}>
                    <Text variant="bodyMedium" style={styles.amenityName}>Island Garden</Text>
                    <Text variant="bodyMedium" style={styles.amenityPrice}>
                      ₱{island_garden_price.toLocaleString()}
                    </Text>
                  </View>
                )}

                <Divider style={styles.thickDivider} />
                <View style={styles.amenityTotalRow}>
                  <Text variant="titleMedium" style={styles.amenityTotalLabel}>Amenities Total:</Text>
                  <Text variant="titleMedium" style={styles.amenityTotalValue}>
                    ₱{calculateAmenitiesTotal().toLocaleString()}
                  </Text>
                </View>
              </View>
            )}

            {/* Total Section */}
            <View style={styles.totalSection}>
              <Divider style={styles.thickDivider} />
              <View style={styles.totalRow}>
                <Text variant="titleLarge" style={styles.totalLabel}>Estimated Total:</Text>
                <Text variant="headlineSmall" style={styles.totalValue}>
                  ₱{estimatedTotal.toLocaleString()}
                </Text>
              </View>
              <Text variant="bodySmall" style={styles.noteText}>
                *Final total will be confirmed by the server
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleReservation}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Reservation"}
        </Button>

        <Portal>
          <Dialog visible={dialogVisible} onDismiss={hideDialog} style={styles.dialog}>
            <Dialog.Title style={styles.dialogTitle}>Notice</Dialog.Title>
            <Dialog.Content style={styles.dialogContent}>
              {loading && <ActivityIndicator size="small" style={styles.loader} />}
              <Text variant="bodyMedium" style={styles.dialogMessage}>{dialogMessage}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              {!loading && (
                <Button onPress={handleDialogOk} style={styles.dialogButton}>
                  OK
                </Button>
              )}
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 10,
    paddingBottom: 10
  },
  container: { 
    flex: 1, 
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 20,
  },
  title: { 
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textAlign: 'center',
    color: '#666',
  },
  summaryCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    marginBottom: 16,
    color: '#1f2937',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  label: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    color: '#374151',
  },
  value: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textAlign: 'right',
  },
  feeValue: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    color: '#059669',
    textAlign: 'right',
  },
  amenityRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingVertical: 6,
  },
  amenityName: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
  },
  amenityPrice: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    color: '#374151',
  },
  amenityTotalRow: {
    flexDirection: "row", 
    justifyContent: "space-between", 
    paddingVertical: 8,
    marginTop: 8,
  },
  amenityTotalLabel: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
  },
  amenityTotalValue: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    color: '#059669',
  },
  totalSection: {
    marginTop: 8,
  },
  totalRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    paddingVertical: 16,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
  },
  totalValue: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    color: '#059669',
  },
  noteText: {
    color: "#666",
    fontStyle: "italic",
    textAlign: "center",
    marginTop: 8,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
  },
  divider: { 
    backgroundColor: "#e5e7eb", 
    height: 1,
    marginVertical: 4,
  },
  thickDivider: {
    backgroundColor: "#d1d5db",
    height: 2,
    marginVertical: 8,
  },
  button: { 
    marginBottom: 40,
    borderRadius: 12,
    elevation: 2,
  },
  buttonContent: { 
    paddingVertical: 8,
  },
  buttonLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    fontSize: 16,
  },
  dialog: {
    borderRadius: 16,
  },
  dialogTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
  },
  dialogContent: {
    flexDirection: "row", 
    alignItems: "center", 
    gap: 12,
  },
  dialogMessage: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    flex: 1,
  },
  dialogButton: {
    borderRadius: 8,
  },
  loader: {
    marginRight: 8,
  },
});