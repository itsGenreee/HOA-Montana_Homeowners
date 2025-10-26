import { useAuth } from "@/contexts/AuthContext";
import { useReservation } from "@/contexts/ReservationContext";
import AvailabilityService from "@/services/AvailabilityService";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { Button, Card, useTheme } from "react-native-paper";

export default function Time() {
  const { facility_id, date, setStartTime, setEndTime, setFacilityFee, setDiscountedFee } = useReservation();
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const [slots, setSlots] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  const isUserVerified = user?.status === 1;
  const isEventPlace = facility_id === 3;

  useEffect(() => {
    const fetchAvailability = async () => {
      if (facility_id && date) {
        try {
          const data = await AvailabilityService.getAvailability(facility_id, date);
          
          const processed = data.map((slot: any) => {
            const baseDate = new Date(date);
            
            const parse12HourTime = (timeStr: string) => {
              const [time, period] = timeStr.split(' ');
              const [hours, minutes] = time.split(':').map(Number);
              
              let hours24 = hours;
              if (period === 'PM' && hours !== 12) {
                hours24 = hours + 12;
              } else if (period === 'AM' && hours === 12) {
                hours24 = 0;
              }
              
              return { hours: hours24, minutes };
            };
            
            const startTime = parse12HourTime(slot.start_time);
            const endTime = parse12HourTime(slot.end_time);
            
            const start = new Date(baseDate);
            start.setHours(startTime.hours, startTime.minutes, 0, 0);
            
            const end = new Date(baseDate);
            end.setHours(endTime.hours, endTime.minutes, 0, 0);
            
            const displayFee = isUserVerified ? slot.discounted_fee : slot.fee;
            
            return {
              ...slot,
              start,
              end,
              label: `${slot.start_time} - ${slot.end_time}`,
              displayFee,
              isDiscounted: isUserVerified && slot.discounted_fee < slot.fee,
            };
          });

          setSlots(processed);
        } catch (error) {
          console.error("Failed to fetch availability:", error);
        }
      }
    };

    fetchAvailability();
  }, [facility_id, date, isUserVerified]);

  const handleNext = () => {
    if (selected) {
      setStartTime(selected.start);
      setEndTime(selected.end);
      
      if (isUserVerified) {
        setFacilityFee(selected.discounted_fee);
        setDiscountedFee(selected.discounted_fee);
      } else {
        setFacilityFee(selected.fee);
        setDiscountedFee(selected.fee);
      }
      
      router.replace("./summary");
    }
  };

  // Custom UI for Event Place (2 time blocks)
  const renderEventPlaceSlot = (item: any, index: number) => {
    const isSelected = selected === item;
    const isMorning = item.start_time.includes('AM');
    const blockType = isMorning ? "Morning Block" : "Evening Block";
    const blockDescription = isMorning 
      ? "Perfect for daytime events" 
      : "Ideal for evening celebrations";

    return (
      <Card
        style={[
          styles.eventPlaceCard,
          { backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface },
          !item.available && { backgroundColor: "#f8f9fa" },
        ]}
        onPress={() => item.available && setSelected(item)}
        disabled={!item.available}
      >
        <Card.Content style={styles.eventPlaceContent}>
          <View style={styles.blockHeader}>
            <View style={styles.blockTypeContainer}>
              <Text style={[
                styles.blockType,
                { color: isSelected ? "#fff" : theme.colors.primary }
              ]}>
                {blockType}
              </Text>
              <Text style={[
                styles.blockDescription,
                { color: isSelected ? "#fff" : theme.colors.onSurfaceVariant }
              ]}>
                {blockDescription}
              </Text>
            </View>
            
            {item.available ? (
              <View style={styles.feeContainer}>
                {item.isDiscounted && (
                  <Text style={[styles.originalFee, { color: isSelected ? "#fff" : "#9ca3af" }]}>
                    ₱{item.fee}
                  </Text>
                )}
                <Text
                  style={[
                    styles.eventPlaceFee,
                    { color: isSelected ? "#fff" : theme.colors.onSurface },
                    item.isDiscounted && styles.discountedFee,
                  ]}
                >
                  ₱{item.displayFee}
                </Text>
                {item.isDiscounted && (
                  <Text style={[styles.discountBadge, { color: isSelected ? "#fff" : theme.colors.primary }]}>
                    Discounted
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.unavailableContainer}>
                <Text style={styles.unavailableLabel}>Reserved</Text>
              </View>
            )}
          </View>

          <View style={styles.timeContainer}>
            <Text style={[
              styles.eventPlaceTime,
              { color: isSelected ? "#fff" : theme.colors.onBackground }
            ]}>
              {item.label}
            </Text>
            <Text style={[
              styles.duration,
              { color: isSelected ? "#fff" : theme.colors.onSurfaceVariant }
            ]}>
              5 hours duration
            </Text>
          </View>

          {!item.available && (
            <Text style={[
              styles.unavailableText,
              { color: isSelected ? "#fff" : "#9ca3af" }
            ]}>
              This time block is already reserved
            </Text>
          )}
        </Card.Content>
      </Card>
    );
  };

  // Original UI for Tennis Court and Basketball Court
  const renderRegularSlot = ({ item }: { item: any }) => {
    const isSelected = selected === item;
    return (
      <Card
        style={[
          styles.card,
          { backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface },
          !item.available && { backgroundColor: "#f3f4f6" },
        ]}
        onPress={() => item.available && setSelected(item)}
        disabled={!item.available}
      >
        <View style={styles.cardContent}>
          <View style={styles.timeInfo}>
            <Text
              style={[
                styles.cardText,
                { color: isSelected ? "#fff" : theme.colors.onSurface },
                !item.available && { color: "#9ca3af" },
              ]}
            >
              {item.label}
            </Text>
            {!item.available && (
              <Text style={styles.unavailableText}>Unavailable</Text>
            )}
          </View>

          {item.available ? (
            <View style={styles.feeContainer}>
              {item.isDiscounted && (
                <Text style={[styles.originalFee, { color: isSelected ? "#fff" : "#9ca3af" }]}>
                  ₱{item.fee}
                </Text>
              )}
              <Text
                style={[
                  styles.feeText,
                  { color: isSelected ? "#fff" : theme.colors.onSurface },
                  item.isDiscounted && styles.discountedFee,
                ]}
              >
                ₱{item.displayFee}
              </Text>
              {item.isDiscounted && (
                <Text style={[styles.discountBadge, { color: isSelected ? "#fff" : theme.colors.primary }]}>
                  Discounted
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.unavailableContainer}>
              <Text style={styles.unavailableLabel}>Reserved</Text>
            </View>
          )}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.onBackground }]}>
            {isEventPlace ? "Select Time Block" : "Select a Time Slot"}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
            {isEventPlace 
              ? "Choose your preferred time block for the event" 
              : "Choose your preferred time for the event"
            }
          </Text>
        </View>

        {isUserVerified && (
          <Card style={[styles.discountBanner, { backgroundColor: theme.colors.primaryContainer }]}>
            <Card.Content style={styles.discountContent}>
              <Text style={[styles.discountText, { color: theme.colors.onPrimaryContainer }]}>
                ✓ Verified user discount applied
              </Text>
            </Card.Content>
          </Card>
        )}

        {isEventPlace ? (
          // Custom layout for Event Place
          <View style={styles.eventPlaceContainer}>
            {slots.map((slot, index) => (
              <View key={slot.id || `${slot.start_time}-${index}`} style={styles.eventPlaceSlot}>
                {renderEventPlaceSlot(slot, index)}
              </View>
            ))}
          </View>
        ) : (
          // Regular slots layout
          <View style={styles.regularSlotsContainer}>
            {slots.map((slot, index) => (
              <View key={slot.id || `${slot.start_time}-${index}`} style={styles.regularSlot}>
                {renderRegularSlot({ item: slot })}
              </View>
            ))}
          </View>
        )}

        {/* Spacer to ensure content doesn't get hidden behind the selection card */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed selection card at the bottom */}
      {selected && (
        <View style={styles.selectionContainer}>
          <Card style={styles.selectionCard}>
            <Card.Content style={styles.selectionContent}>
              <View style={styles.selectedInfo}>
                <Text style={[styles.selectedLabel, { color: theme.colors.onSurfaceVariant }]}>
                  {isEventPlace ? "Selected Time Block:" : "Selected Time:"}
                </Text>
                <Text style={[styles.selectedTime, { color: theme.colors.onBackground }]}>
                  {selected.label}
                </Text>
                <Text style={[styles.selectedFee, { color: theme.colors.onBackground }]}>
                  Fee: ₱{selected.displayFee}
                  {selected.isDiscounted && (
                    <Text style={[styles.originalFeeLarge, { color: theme.colors.onSurfaceVariant }]}>
                      {" "}(Originally ₱{selected.fee})
                    </Text>
                  )}
                </Text>
              </View>
              <Button 
                mode="contained" 
                onPress={handleNext}
                style={styles.nextButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Continue to Summary
              </Button>
            </Card.Content>
          </Card>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100, // Extra padding for the fixed selection card
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  title: { 
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textAlign: 'center',
  },
  discountBanner: {
    marginBottom: 24,
    borderRadius: 12,
  },
  discountContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  discountText: {
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    textAlign: 'center',
  },
  eventPlaceContainer: {
    marginBottom: 20,
  },
  eventPlaceSlot: {
    marginBottom: 16,
  },
  regularSlotsContainer: {
    marginBottom: 20,
  },
  regularSlot: {
    marginBottom: 8,
  },
  eventPlaceCard: {
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 140,
  },
  eventPlaceContent: {
    padding: 0,
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  blockTypeContainer: {
    flex: 1,
  },
  blockType: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    marginBottom: 4,
  },
  blockDescription: {
    fontSize: 14,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  eventPlaceTime: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 4,
  },
  duration: {
    fontSize: 14,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textAlign: 'center',
  },
  eventPlaceFee: {
    fontSize: 20,
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    textAlign: 'right',
  },
  // Regular Facility Styles
  card: {
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardContent: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
  },
  timeInfo: {
    flex: 1,
  },
  cardText: { 
    fontSize: 16,
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
  },
  unavailableText: {
    fontSize: 12,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  feeContainer: {
    alignItems: 'flex-end',
  },
  feeText: { 
    fontSize: 16,
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
  },
  discountedFee: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    color: '#10b981',
  },
  originalFee: {
    fontSize: 12,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  originalFeeLarge: {
    fontSize: 14,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    fontSize: 10,
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    marginTop: 4,
  },
  unavailableContainer: {
    alignItems: 'flex-end',
  },
  unavailableLabel: {
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    color: '#ef4444',
  },
  selectionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  selectionCard: {
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectionContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  selectedInfo: {
    marginBottom: 20,
    alignItems: 'center',
  },
  selectedLabel: {
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    marginBottom: 4,
    textAlign: 'center',
  },
  selectedTime: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
  },
  selectedFee: {
    fontSize: 16,
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    textAlign: 'center',
  },
  nextButton: {
    borderRadius: 12,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
  },
  bottomSpacer: {
    height: 120, // Space for the fixed selection card
  },
});