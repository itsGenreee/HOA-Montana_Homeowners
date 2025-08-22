import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text } from 'react-native';

const Profile = () => {
    const router = useRouter();
    const { user, logout } = useAuth();

    return (
    <SafeAreaView style={styles.container}>
        <Text>Profile</Text>
        <Text>{user?.first_name} {user?.last_name}</Text>
        <Text>Email: {user?.email}</Text>
        <Text>Account Status: {user?.status === 1 ? 'Verified' : 
                 user?.status === 2 ? 'Pending Verification' : 
                 'Unverified'}</Text>
        <Button 
            title="Logout"
            onPress={async () => {
            await logout();
            router.replace('/');
            }}
        />
    </SafeAreaView>
  )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",

    }
})