import { useReservation } from "@/contexts/ReservationContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card, TouchableRipple, useTheme } from "react-native-paper";

export default function Facility() {
  const router = useRouter();
  const { facility, setFacility } = useReservation();
  const [selected, setSelected] = useState<string | null>(facility);
  const theme = useTheme();

  const options = [
    "Basketball Court 1",
    "Basketball Court 2",
    "Tennis Court",
    "Event Place",
  ];

  const handleNext = () => {
    if (selected) {
      setFacility(selected);
      router.replace("./date");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.header, { color: theme.colors.onBackground }]}>
        Select a Facility
      </Text>
      <View style={styles.grid}>
        {options.map((option) => {
          const isSelected = selected === option;
          return (
            <Card
              key={option}
              style={[styles.card, isSelected && { backgroundColor: theme.colors.primary }]}
            >
              <TouchableRipple
                onPress={() => setSelected(option)}
                rippleColor="rgba(0, 0, 0, 0.1)"
                borderless
                style={styles.touchable}
              >
                <Text style={[styles.cardText, isSelected && { color: "#fff", fontWeight: "600" }]}>
                  {option}
                </Text>
              </TouchableRipple>
            </Card>
          );
        })}
      </View>

      {selected && (
        <View style={styles.nextContainer}>
          <Text style={[styles.selectedText, { color: theme.colors.onBackground }]}>
            Selected: {selected}
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
