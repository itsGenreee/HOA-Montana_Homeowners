import { useReservation } from "@/contexts/ReservationContext";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Facility() {
  const router = useRouter();
  const { facility, setFacility } = useReservation();

  const options = [
    "Basketball Court 1",
    "Basketball Court 2",
    "Tennis Court",
    "Event Place",
  ];

  const handleSelect = (option: string) => {
    setFacility(option);
    router.replace("./date");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Facility</Text>
      <View style={styles.grid}>
        {options.map((option) => (
          <Pressable
            key={option}
            onPress={() => handleSelect(option)}
            style={({ pressed }) => [
              styles.card,
              facility === option && styles.selectedCard,
              pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text
              style={[
                styles.cardText,
                facility === option && styles.selectedText,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    padding: 20,
    marginVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  selectedCard: {
    backgroundColor: "#3b82f6",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    textAlign: "center",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "600",
  },
});
