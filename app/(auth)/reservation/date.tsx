import { useReservation } from '@/contexts/ReservationContext';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button, Card, useTheme } from 'react-native-paper';

export default function Date() {
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>
          Select a Date
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
          Choose your preferred date
        </Text>
      </View>

      <Card style={styles.calendarCard}>
        <Card.Content style={styles.calendarContent}>
          <Calendar
            onDayPress={(day) => setSelected(day.dateString)}
            markedDates={
              selected ? { 
                [selected]: { 
                  selected: true, 
                  selectedColor: theme.colors.primary,
                  selectedTextColor: theme.colors.onPrimary
                } 
              } : {}
            }
            minDate={today}
            theme={{
              selectedDayBackgroundColor: theme.colors.primary,
              selectedDayTextColor: theme.colors.onPrimary,
              todayTextColor: theme.colors.primary,
              arrowColor: theme.colors.primary,
              monthTextColor: theme.colors.onBackground,
              textMonthFontSize: 20,
              textMonthFontWeight: '600',
              textDayFontSize: 16,
              dayTextColor: theme.colors.onBackground,
              textDayHeaderFontSize: 14,
              textDayHeaderFontWeight: '500',
              textSectionTitleColor: theme.colors.onSurfaceVariant,
              textDisabledColor: theme.colors.outline,
              backgroundColor: theme.colors.surface,
              calendarBackground: theme.colors.surface,
            }}
            style={styles.calendar}
          />
        </Card.Content>
      </Card>

      {selected && (
        <Card style={styles.selectionCard}>
          <Card.Content style={styles.selectionContent}>
            <View style={styles.selectedInfo}>
              <Text style={[styles.selectedLabel, { color: theme.colors.onSurfaceVariant }]}>
                Selected Date:
              </Text>
              <Text style={[styles.selectedDate, { color: theme.colors.onBackground }]}>
                {dayjs(selected).format('dddd, MMMM D, YYYY')}
              </Text>
            </View>
            <Button 
              mode="contained" 
              onPress={handleNext}
              style={styles.nextButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Continue to Time Selection
            </Button>
          </Card.Content>
        </Card>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingHorizontal: 20,
    paddingBottom: 20
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  title: { 
    fontSize: 24,
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    textAlign: 'center',
    marginVertical: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textAlign: 'center',
  },
  calendarCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  calendarContent: {
    padding: 0,
  },
  calendar: {
    borderRadius: 16,
    padding: 8,
  },
  selectionCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectionContent: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  selectedInfo: {
    marginBottom: 20,
    alignItems: 'center',
  },
  selectedLabel: {
    fontSize: 14,
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    marginBottom: 4,
    textAlign: 'center',
  },
  selectedDate: {
    fontSize: 18,
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    textAlign: 'center',
  },
  nextButton: {
    borderRadius: 12,
    elevation: 2,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
  },
});