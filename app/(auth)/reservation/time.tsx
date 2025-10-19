import { useAuth } from "@/contexts/AuthContext"; // Assuming you have an AuthContext
import { useReservation } from "@/contexts/ReservationContext";
import AvailabilityService from "@/services/AvailabilityService";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button, Card, useTheme } from "react-native-paper";

export default function Time() {
  const { facility_id, date, setStartTime, setEndTime, setFacilityFee, setDiscountedFee } = useReservation();
  const { user } = useAuth(); // Get user info to check verification status
  const router = useRouter();
  const theme = useTheme();

  const [slots, setSlots] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  // Check if user is verified (adjust this based on your user object structure)
  const isUserVerified = user?.status === 1// Adjust based on your user schema

  useEffect(() => {
    const fetchAvailability = async () => {
      if (facility_id && date) {
        try {
          const data = await AvailabilityService.getAvailability(facility_id, date);
          
          // Process the slots - parse 12-hour format with AM/PM
          const processed = data.map((slot: any) => {
            // Create a base date from the selected date
            const baseDate = new Date(date);
            
            // Parse 12-hour format with AM/PM (e.g., "1:00 PM")
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
            
            // Create Date objects with the correct date and time
            const start = new Date(baseDate);
            start.setHours(startTime.hours, startTime.minutes, 0, 0);
            
            const end = new Date(baseDate);
            end.setHours(endTime.hours, endTime.minutes, 0, 0);
            
            // Determine which fee to display based on user verification
            const displayFee = isUserVerified ? slot.discounted_fee : slot.fee;
            
            return {
              ...slot,
              start, // Full Date object with correct date and time
              end,   // Full Date object with correct date and time
              label: `${slot.start_time} - ${slot.end_time}`,
              displayFee, // The fee to display based on user status
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
  }, [facility_id, date, isUserVerified]); // Add isUserVerified to dependencies

  const handleNext = () => {
    if (selected) {
      // Store the actual Date objects and appropriate fee
      setStartTime(selected.start);
      setEndTime(selected.end);
      
      // Use discounted fee if user is verified, otherwise use regular fee
      if (isUserVerified) {
        setFacilityFee(selected.discounted_fee);
        setDiscountedFee(selected.discounted_fee);
      } else {
        setFacilityFee(selected.fee);
        setDiscountedFee(selected.fee); // Or set to null/0 if no discount
      }
      
      router.replace("./summary");
    }
  };

  const renderSlot = ({ item }: { item: any }) => {
    const isSelected = selected === item;
    return (
      <Card
        style={[
          styles.card,
          { backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface },
          !item.available && { backgroundColor: "#e5e7eb" },
        ]}
        onPress={() => item.available && setSelected(item)}
        disabled={!item.available}
      >
        <View style={styles.cardContent}>
          <Text
            style={[
              styles.cardText,
              { color: isSelected ? "#fff" : theme.colors.onSurface },
              !item.available && { color: "#9ca3af" },
            ]}
          >
            {item.label}
          </Text>

          {/* Show fee only if slot is available */}
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
            <Text style={{ color: "red" }}>Reserved</Text>
          )}
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>
        Select a Time Slot
      </Text>

      {isUserVerified && (
        <View style={[styles.discountBanner, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text style={[styles.discountText, { color: theme.colors.onPrimaryContainer }]}>
            ✓ Verified user discount applied
          </Text>
        </View>
      )}

      <FlatList
        data={slots}
        keyExtractor={(item, index) => item.id || `${item.start_time}-${index}`}
        renderItem={renderSlot}
        contentContainerStyle={styles.list}
      />

      {selected && (
        <View style={styles.nextContainer}>
          <Text style={[styles.selectedText, { color: theme.colors.onBackground }]}>
            Selected: {selected.label}
          </Text>
          <Text style={[styles.selectedText, { color: theme.colors.onBackground }]}>
            Fee: ₱{selected.displayFee}
            {selected.isDiscounted && (
              <Text style={[styles.originalFee, { color: theme.colors.onBackground }]}>
                {" "}(Originally ₱{selected.fee})
              </Text>
            )}
          </Text>
          <Button mode="contained" onPress={handleNext}>
            Next
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, fontWeight: "600", textAlign: "center", marginVertical: 20 },
  discountBanner: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  discountText: {
    fontSize: 14,
    fontWeight: '500',
  },
  list: { paddingBottom: 20 },
  card: {
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
  },
  cardContent: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  cardText: { fontSize: 16, fontWeight: "500" },
  feeContainer: {
    alignItems: 'flex-end',
  },
  feeText: { 
    fontSize: 14,
    fontWeight: '500',
  },
  discountedFee: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981', // Green color for discounted price
  },
  originalFee: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  discountBadge: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  nextContainer: {
    marginTop: 20,
    alignItems: "center",
    gap: 12,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "500",
  },
});