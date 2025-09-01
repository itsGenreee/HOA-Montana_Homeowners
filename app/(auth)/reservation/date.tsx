import { useReservation } from '@/contexts/ReservationContext';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button, useTheme } from 'react-native-paper';

export default function DatePickerScreen() {
  const { setDate } = useReservation();
  const router = useRouter();
  const theme = useTheme();

  const today = dayjs().format('YYYY-MM-DD'); 
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (selected) {
      const selectedDate = dayjs(selected).toDate();
      setDate(selectedDate);
      router.replace('./time');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={[styles.title, { color: theme.colors.onBackground }]}>
        Select a Date
      </Text>

      <Calendar
        onDayPress={(day) => setSelected(day.dateString)}
        markedDates={
          selected ? { [selected]: { selected: true, selectedColor: theme.colors.primary } } : {}
        }
        minDate={today}
        theme={{
          selectedDayBackgroundColor: theme.colors.primary,
          todayTextColor: theme.colors.primary,
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.onBackground,
          textMonthFontSize: 20,
          textDayFontSize: 16,
          dayTextColor: theme.colors.onBackground,
          textDayHeaderFontWeight: '600',
        }}
      />

      {selected && (
        <View style={styles.nextContainer}>
          <Text style={[styles.selectedText, { color: theme.colors.onBackground }]}>
            Selected: {dayjs(selected).format('MMMM D, YYYY')}
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
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
  nextContainer: {
    marginTop: 20,
    alignItems: 'center',
    gap: 12,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
