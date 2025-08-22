import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  //For debugging only
  if (!user) {
    return (
      <View style={styles.center}>
        <Text>No user data found.</Text>
        <Button title="Go to Login" onPress={() => router.replace('/')} />
      </View>
    );
  }

  //Implement this after remove the debugging
/*   if (!user) {
    return <Redirect href="../" />;
  } */

  return (
    <SafeAreaView style={styles.center}>
      <Text style={styles.title}>Welcome, {user.first_name} {user.last_name}!</Text>
      <Text>Email: {user.email}</Text>
      <Text>
        Status: {user.status === 1 ? 'Verified' : 
                 user.status === 2 ? 'Pending Verification' : 
                 'Unverified'}
      </Text>
      
      <Button 
        title="Logout"
        onPress={async () => {
          await logout();
          router.replace('/');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  }
});
