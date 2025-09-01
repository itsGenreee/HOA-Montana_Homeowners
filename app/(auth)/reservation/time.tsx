import { useReservation } from "@/contexts/ReservationContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Button, Card, useTheme } from "react-native-paper";

export default function Time() {
  const router = useRouter();
  const { setStartTime, setEndTime } = useReservation();
  const theme = useTheme();
  const [selectedSlot, setSelectedSlot] = useState<any>(null);

  // Generate slots dynamically (1 PM - 8 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 13; hour < 21; hour++) {
      const start = new Date();
      start.setHours(hour, 0, 0, 0);
      const end = new Date();
      end.setHours(hour + 1, 0, 0, 0);

      const formatTime = (date: Date) =>
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

      slots.push({
        label: `${formatTime(start)} - ${formatTime(end)}`,
        start,
        end,
      });
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleNext = () => {
    if (selectedSlot) {
      setStartTime(selectedSlot.start);
      setEndTime(selectedSlot.end);
      router.replace("./summary");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>Select a Time</Text>

      <FlatList
        data={timeSlots}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Card
            style={[
              styles.card,
              { backgroundColor: selectedSlot === item ? theme.colors.primary : theme.colors.surface },
            ]}
            onPress={() => setSelectedSlot(item)}
          >
            <Card.Content>
              <Text
                style={[
                  styles.slotText,
                  { color: selectedSlot === item ? "#fff" : theme.colors.onSurface },
                ]}
              >
                {item.label}
              </Text>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {selectedSlot && (
        <View style={styles.nextContainer}>
          <Text style={[styles.selectedText, { color: theme.colors.onBackground }]}>
            Selected: {selectedSlot.label}
          </Text>
          <Button mode="contained" onPress={handleNext}>
            Next
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, marginVertical: 20, fontWeight: "bold" },
  card: {
    marginVertical: 6,
    borderRadius: 12,
    width: 250,
    alignSelf: "center",
    elevation: 2,
  },
  slotText: { fontSize: 16, textAlign: "center" },
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
