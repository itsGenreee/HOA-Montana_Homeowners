import { useReservation } from "@/contexts/ReservationContext";
import AvailabilityService from "@/services/AvailabilityService";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button, Card, useTheme } from "react-native-paper";

export default function Time() {
  const { facility_id, date, setStartTime, setEndTime, setFacilityFee } = useReservation();
  const router = useRouter();
  const theme = useTheme();

  const [slots, setSlots] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

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
            
            return {
              ...slot,
              start, // Full Date object with correct date and time
              end,   // Full Date object with correct date and time
              label: `${slot.start_time} - ${slot.end_time}`,
            };
          });

          setSlots(processed);
        } catch (error) {
          console.error("Failed to fetch availability:", error);
        }
      }
    };

    fetchAvailability();
  }, [facility_id, date]);

  const handleNext = () => {
    if (selected) {
      // Store the actual Date objects
      setStartTime(selected.start);
      setEndTime(selected.end);
      setFacilityFee(selected.fee);
      
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
            <Text
              style={[
                styles.feeText,
                { color: isSelected ? "#fff" : theme.colors.onSurface },
              ]}
            >
              ₱{item.fee}
            </Text>
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
            Fee: ₱{selected.fee}
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
  title: { fontSize: 20, fontWeight: "600", textAlign: "center", marginBottom: 20 },
  list: { paddingBottom: 20 },
  card: {
    marginVertical: 6,
    borderRadius: 12,
    padding: 16,
  },
  cardContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardText: { fontSize: 16, fontWeight: "500" },
  feeText: { fontSize: 14 },
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