import { useRouter } from 'expo-router';
import React from 'react';
import { Button, SafeAreaView, StyleSheet } from 'react-native';

const Index = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <Button
        title='Make a reservation'
        onPress={() => {
          router.push('/reservation/facility')
        }}
      />
    </SafeAreaView>
  )
}

export default Index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});