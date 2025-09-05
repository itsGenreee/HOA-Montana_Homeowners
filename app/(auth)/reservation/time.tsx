import { useReservation } from "@/contexts/ReservationContext";
import AvailabilityService from "@/services/AvailabilityService"; // default import (see fix below)
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button, Card, useTheme } from "react-native-paper";

export default function Time() {
  const { facility_id, date, setStartTime, setEndTime, setFee } = useReservation();
  const router = useRouter();
  const theme = useTheme();

  const [slots, setSlots] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (facility_id && date) {
        try {
          const data = await AvailabilityService.getAvailability(facility_id, date);
          setSlots(data);
        } catch (error) {
          console.error("Failed to fetch availability:", error);
        }
      }
    };

    fetchAvailability();
  }, [facility_id, date]);

  const handleNext = () => {
    if (selected) {
      // Save chosen slot into ReservationContext
      const today = dayjs(date).format("YYYY-MM-DD");
      setStartTime(dayjs(`${today} ${selected.start_time}`).toDate());
      setEndTime(dayjs(`${today} ${selected.end_time}`).toDate());
      setFee(selected.fee);

      router.replace("./confirm"); // go to confirmation page
    }
  };

  const renderSlot = ({ item }: { item: any }) => {
    const isSelected = selected === item;
    return (
      <Card
        style={[
          styles.card,
          isSelected && { backgroundColor: theme.colors.primary },
          !item.available && { backgroundColor: "#e5e7eb" },
        ]}
        onPress={() => item.available && setSelected(item)}
      >
        <View style={styles.cardContent}>
          <Text
            style={[
              styles.cardText,
              isSelected && { color: "#fff", fontWeight: "600" },
              !item.available && { color: "#9ca3af" },
            ]}
          >
            {item.start_time} - {item.end_time}
          </Text>
          <Text
            style={[
              styles.feeText,
              isSelected && { color: "#fff" },
              !item.available && { color: "#9ca3af" },
            ]}
          >
            ₱{item.fee}
          </Text>
          {!item.available && <Text style={{ color: "red" }}>Reserved</Text>}
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
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderSlot}
        contentContainerStyle={styles.list}
      />

      {selected && (
        <View style={styles.nextContainer}>
          <Text style={[styles.selectedText, { color: theme.colors.onBackground }]}>
            Selected: {selected.start_time} - {selected.end_time}
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
  cardContent: { flexDirection: "row", justifyContent: "space-between" },
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
