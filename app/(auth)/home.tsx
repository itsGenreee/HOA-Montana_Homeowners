import { useReservationService } from "@/services/ReservationService";
import { lightTheme } from "@/theme";
import { ReservationQRCode } from "@/utils/QrCodeGenerator";
import dayjs from "dayjs";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Platform, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from "react-native";
import { Button, Card, Chip, Divider, Modal, Portal, Surface, Text } from "react-native-paper";

type Reservation = {
  id: number;
  user_id: number;
  facility: string;
  facility_id: number;
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
  const [refreshing, setRefreshing] = useState(false);

  const sortReservations = (reservations: Reservation[]): Reservation[] => {
    return reservations.sort((a, b) => {
      const statusPriority: Record<string, number> = {
        'pending': 1,
        'confirmed': 2,
        'checked_in': 3,
        'canceled': 4
      };
      
      const statusA = statusPriority[a.status] || 999;
      const statusB = statusPriority[b.status] || 999;
      
      if (statusA !== statusB) {
        return statusA - statusB;
      }
      
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) {
        return dateCompare;
      }
      
      return a.start_time.localeCompare(b.start_time);
    });
  };

  const fetchReservations = async () => {
    try {
      const data = await getUserReservations();
      const sortedReservations = sortReservations(data);
      setReservations(sortedReservations);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReservations();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchReservations();
    } catch (error) {
      console.error("Failed to refresh reservations:", error);
    } finally {
      setRefreshing(false);
    }
  }, []);

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
      case "canceled":
        return "CANCELED";
      default:
        return status.toUpperCase();
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return { 
          chip: { backgroundColor: lightTheme.colors.secondaryContainer }, 
          text: { color: lightTheme.colors.onSecondaryContainer } 
        };
      case "confirmed":
        return { 
          chip: { backgroundColor: lightTheme.colors.primaryContainer }, 
          text: { color: lightTheme.colors.onPrimaryContainer } 
        };
      case "checked_in":
        return { 
          chip: { backgroundColor: lightTheme.colors.tertiaryContainer }, 
          text: { color: lightTheme.colors.onTertiaryContainer } 
        };
      case "canceled":
        return { 
          chip: { backgroundColor: lightTheme.colors.errorContainer }, 
          text: { color: lightTheme.colors.onErrorContainer } 
        };
      default:
        return { 
          chip: { backgroundColor: lightTheme.colors.surfaceVariant }, 
          text: { color: lightTheme.colors.onSurfaceVariant } 
        };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "clock-outline";
      case "confirmed":
        return "check-circle-outline";
      case "checked_in":
        return "map-marker-check-outline";
      case "canceled":
        return "cancel";
      default:
        return "help-circle-outline";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.headerSurface} elevation={1}>
        <Text variant="headlineMedium" style={styles.header}>
          My Reservations
        </Text>
      </Surface>
      
      {reservations.length === 0 ? (
        <Surface style={styles.emptyState} elevation={1}>
          <View style={styles.emptyContent}>
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No Reservations
            </Text>
            <Text variant="bodyMedium" style={styles.emptyText}>
              You don't have any reservations yet.
            </Text>
            <Button 
              mode="contained" 
              onPress={onRefresh}
              style={styles.refreshButton}
              icon="refresh"
              contentStyle={styles.buttonContent}
            >
              Refresh
            </Button>
          </View>
        </Surface>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[lightTheme.colors.primary]}
              tintColor={lightTheme.colors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {reservations.map((item) => {
            const start = dayjs(`${item.date.split("T")[0]}T${item.start_time}`);
            const end = dayjs(`${item.date.split("T")[0]}T${item.end_time}`);
            const statusStyle = getStatusStyle(item.status);
            const isActionable = item.status === "confirmed";

            return (
              <Card 
                key={item.id} 
                style={[
                  styles.card,
                  isActionable && styles.actionableCard
                ]} 
                onPress={() => openQrModal(item)}
                mode="elevated"
                elevation={2}
              >
                <Card.Content style={styles.cardContent}>
                  {/* Facility name */}
                  <Text variant="titleLarge" style={styles.facility}>
                    {item.facility || "Unknown Facility"}
                  </Text>

                  <Divider style={styles.divider} />

                  {/* Date and Time */}
                  <View style={styles.timeContainer}>
                    <View style={styles.timeRow}>
                      <Text variant="bodyMedium" style={styles.timeLabel}>
                        Date:
                      </Text>
                      <Text variant="bodyMedium" style={styles.timeValue}>
                        {start.format("MMMM D, YYYY")}
                      </Text>
                    </View>
                    <View style={styles.timeRow}>
                      <Text variant="bodyMedium" style={styles.timeLabel}>
                        Time:
                      </Text>
                      <Text variant="bodyMedium" style={styles.timeValue}>
                        {start.format("h:mm A")} - {end.format("h:mm A")}
                      </Text>
                    </View>
                  </View>

                  {/* Status Chip */}
                  <View style={styles.statusContainer}>
                    <Chip
                      icon={getStatusIcon(item.status)}
                      style={[styles.statusChip, statusStyle.chip]}
                      textStyle={[styles.statusText, statusStyle.text]}
                      compact
                    >
                      {getStatusDisplay(item.status)}
                    </Chip>
                  </View>

                  {/* Status-specific messages */}
                  {item.status === "pending" && (
                    <Surface style={styles.messageSurface} elevation={0}>
                      <Text variant="bodySmall" style={styles.pendingMessage}>
                        Please confirm your reservation at the HOA office
                      </Text>
                    </Surface>
                  )}

                  {item.status === "confirmed" && (
                    <Surface style={styles.messageSurface} elevation={0}>
                      <Text variant="bodySmall" style={styles.confirmedMessage}>
                        Tap to view QR code for facility access
                      </Text>
                    </Surface>
                  )}

                  {item.status === "canceled" && (
                    <Surface style={styles.messageSurface} elevation={0}>
                      <Text variant="bodySmall" style={styles.canceledMessage}>
                        This reservation has been canceled
                      </Text>
                    </Surface>
                  )}
                </Card.Content>
              </Card>
            );
          })}
        </ScrollView>
      )}

      {/* QR Code Modal */}
      <Portal>
        <Modal 
          visible={visible} 
          onDismiss={closeQrModal} 
          contentContainerStyle={styles.modal}
        >
          <Surface style={styles.modalSurface} elevation={4}>
            {selectedReservation && (
              <View style={styles.modalContent}>
                <Text variant="titleLarge" style={styles.modalTitle}>
                  Reservation QR Code
                </Text>
                
                <Divider style={styles.modalDivider} />
                
                <Text variant="bodyMedium" style={styles.modalSubtitle}>
                  Show this code at the facility to check in
                </Text>
                
                <View style={styles.qrContainer}>
                  <ReservationQRCode
                    reservation={{
                      reservation_token: selectedReservation.reservation_token,
                      digital_signature: selectedReservation.digital_signature,
                    }}
                    size={280}
                  />
                </View>

                <Text variant="bodySmall" style={styles.modalNote}>
                  Facility: {selectedReservation.facility}
                </Text>
                <Text variant="bodySmall" style={styles.modalNote}>
                  Date: {dayjs(selectedReservation.date.split("T")[0]).format("MMMM D, YYYY")}
                </Text>
                <Text variant="bodySmall" style={styles.modalNote}>
                  Time: {selectedReservation.start_time} - {selectedReservation.end_time}
                </Text>

                <Button 
                  mode="contained" 
                  onPress={closeQrModal} 
                  style={styles.closeButton}
                  contentStyle={styles.buttonContent}
                >
                  Close
                </Button>
              </View>
            )}
          </Surface>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: lightTheme.colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  headerSurface: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: lightTheme.colors.primaryContainer,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  header: { 
    color: lightTheme.colors.onPrimaryContainer,
    textAlign: 'center',
  },
  scroll: { 
    padding: 20,
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: lightTheme.colors.surface,
  },
  actionableCard: {
    borderLeftWidth: 4,
    borderLeftColor: lightTheme.colors.primary,
  },
  cardContent: {
    paddingVertical: 16,
  },
  facility: { 
    marginBottom: 12,
    color: lightTheme.colors.onSurface,
  },
  divider: {
    marginBottom: 12,
    backgroundColor: lightTheme.colors.outlineVariant,
  },
  timeContainer: {
    marginBottom: 12,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timeLabel: {
    color: lightTheme.colors.onSurfaceVariant,
    fontWeight: '500',
  },
  timeValue: {
    color: lightTheme.colors.onSurface,
    fontWeight: '400',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  statusChip: {
    borderRadius: 8,
  },
  statusText: {
    fontWeight: "bold",
    fontSize: 12,
  },
  messageSurface: {
    backgroundColor: lightTheme.colors.surfaceVariant,
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  pendingMessage: {
    color: lightTheme.colors.onSecondaryContainer,
    textAlign: 'center',
  },
  confirmedMessage: {
    color: lightTheme.colors.onPrimaryContainer,
    textAlign: 'center',
  },
  canceledMessage: {
    color: lightTheme.colors.onErrorContainer,
    textAlign: 'center',
  },
  emptyState: {
    margin: 20,
    borderRadius: 16,
    backgroundColor: lightTheme.colors.surface,
    padding: 32,
  },
  emptyContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginBottom: 8,
    color: lightTheme.colors.onSurface,
    textAlign: 'center',
  },
  emptyText: {
    marginBottom: 24,
    color: lightTheme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  refreshButton: {
    borderRadius: 8,
  },
  modal: {
    padding: 20,
  },
  modalSurface: {
    borderRadius: 16,
    padding: 24,
    backgroundColor: lightTheme.colors.surface,
  },
  modalContent: {
    alignItems: "center",
  },
  modalTitle: {
    marginBottom: 8,
    color: lightTheme.colors.onSurface,
    textAlign: 'center',
  },
  modalDivider: {
    width: '100%',
    marginBottom: 16,
    backgroundColor: lightTheme.colors.outlineVariant,
  },
  modalSubtitle: {
    marginBottom: 24,
    color: lightTheme.colors.onSurfaceVariant,
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: lightTheme.colors.outlineVariant,
  },
  modalNote: {
    color: lightTheme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: 4,
  },
  closeButton: {
    marginTop: 20,
    borderRadius: 8,
    width: '100%',
  },
  buttonContent: {
    paddingVertical: 6,
  },
});