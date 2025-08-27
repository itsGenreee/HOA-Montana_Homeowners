import { useReservation } from '@/contexts/ReservationContext';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function DatePickerScreen() {
  const { setDate } = useReservation();
  const router = useRouter();
  
  const today = dayjs().format('YYYY-MM-DD'); // use dayjs to get today
  const [selected, setSelected] = useState(today);

  const onDayPress = (day: any) => {
    setSelected(day.dateString);

    // Use dayjs to create a Date object or format it
    const selectedDate = dayjs(day.dateString).toDate(); // convert to JS Date
    setDate(selectedDate);

    // Optional: if you want to log formatted date
    console.log('Selected Date:', dayjs(selectedDate).format('MMMM D, YYYY'));

    router.replace('./time');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Select a Date</Text>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{ [selected]: { selected: true, selectedColor: '#00adf5' } }}
        minDate={today}
        theme={{
          selectedDayBackgroundColor: '#00adf5',
          todayTextColor: '#00adf5',
          arrowColor: '#00adf5',
          monthTextColor: '#000',
          textMonthFontSize: 20,
          textDayFontSize: 16,
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, textAlign: 'center', marginBottom: 20 },
});
