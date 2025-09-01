import LoadingModal from '@/components/LoadingModal'; // <- Import your LoadingModal
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Divider, Text, useTheme } from 'react-native-paper';

const Profile = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleLogout = async () => {
    setLoading(true); // show loading modal
    setLoadingMessage("Logging out...");

    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error("Logout failed:", error);
      setLoadingMessage("Logout failed");
      setTimeout(() => setLoading(false), 1500); // hide after showing message briefly
      return;
    }
  };

  const getStatusText = () => {
    if (user?.status === 1) return 'Verified';
    if (user?.status === 2) return 'Pending Verification';
    return 'Unverified';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content style={{ alignItems: 'center' }}>
          <Avatar.Text
            size={100}
            label={`${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`}
            style={{ backgroundColor: theme.colors.primary, marginBottom: 16 }}
          />

          <Text variant="titleLarge" style={{ color: theme.colors.onBackground, marginBottom: 4 }}>
            {user?.first_name} {user?.last_name}
          </Text>

          <Text variant="bodyMedium" style={{ color: theme.colors.outline, marginBottom: 8 }}>
            {user?.email}
          </Text>

          <Divider style={{ width: '60%', marginVertical: 12, backgroundColor: theme.colors.outline }} />

          <Text variant="bodyMedium" style={{ color: theme.colors.outline, fontWeight: '500' }}>
            Account Status: {getStatusText()}
          </Text>

          <Button
            mode="contained"
            onPress={handleLogout}
            buttonColor={theme.colors.error}
            textColor={theme.colors.onError}
            style={{ marginTop: 24, width: '80%', borderRadius: 12, paddingVertical: 8 }}
          >
            Logout
          </Button>
        </Card.Content>
      </Card>

      {/* Loading modal for logout */}
      <LoadingModal visible={loading} message={loadingMessage} />
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 16,
    elevation: 4,
    paddingVertical: 20,
  },
});
