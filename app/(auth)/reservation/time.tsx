import { useReservation } from "@/contexts/ReservationContext";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Time() {
  const router = useRouter();
  const { setStartTime, setEndTime } = useReservation();

  // Generate slots dynamically (8 AM - 8 PM)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 13; hour < 21; hour++) { // 1 PM (13) to 8 PM (20)
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

  const handleSelect = (slot: any) => {
    setStartTime(slot.start);
    setEndTime(slot.end);
    router.replace("./summary");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Time</Text>
      <FlatList
        data={timeSlots}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.slot} onPress={() => handleSelect(item)}>
            <Text style={styles.slotText}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, marginVertical: 20, fontWeight: "bold" },
  slot: {
    padding: 16,
    marginVertical: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    width: 250,
    alignItems: "center",
  },
  slotText: { fontSize: 16 },
});
