import { useReservation } from "@/contexts/ReservationContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card, TouchableRipple, useTheme } from "react-native-paper";

export default function Facility() {
  const router = useRouter();
  const { facility_id, setFacilityId } = useReservation(); // ✅ use facility_id now
  const [selected, setSelected] = useState<number | null>(facility_id);
  const theme = useTheme();

  // Map facilities by id
  const options = [
    { id: 1, name: "Tennis Court" },
    { id: 2, name: "Basketball Court" },
    { id: 3, name: "Event Place" },
  ];

  const handleNext = () => {
    if (selected !== null) {
      setFacilityId(selected); // ✅ save id in context

      if (selected === 3) {
        // If Event Place is selected, go to amenities
        router.replace("./amenities");
      } else {
        // Otherwise, go to date selection
        router.replace("./date");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: theme.colors.onBackground }]}>
        Select a Facility
      </Text>
      <View style={styles.grid}>
        {options.map((option) => {
          const isSelected = selected === option.id;
          return (
            <Card
              key={option.id}
              style={[
                styles.card,
                isSelected && { backgroundColor: theme.colors.primary },
              ]}
            >
              <TouchableRipple
                onPress={() => setSelected(option.id)}
                rippleColor="rgba(0, 0, 0, 0.1)"
                borderless
                style={styles.touchable}
              >
                <Text
                  style={[
                    styles.cardText,
                    isSelected && { color: "#fff", fontWeight: "600" },
                  ]}
                >
                  {option.name}
                </Text>
              </TouchableRipple>
            </Card>
          );
        })}
      </View>

      {selected !== null && (
        <View style={styles.nextContainer}>
          <Text
            style={[
              styles.selectedText,
              { color: theme.colors.onBackground },
            ]}
          >
            Selected:{" "}
            {options.find((o) => o.id === selected)?.name ?? "Unknown"}
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
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    marginVertical: 8,
    borderRadius: 16,
    elevation: 4,
  },
  touchable: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
    textAlign: "center",
  },
  nextContainer: {
    marginTop: 24,
    alignItems: "center",
    gap: 12,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
