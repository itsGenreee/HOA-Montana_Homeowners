import LoadingModal from '@/components/LoadingModal';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, RefreshControl, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, IconButton, Text, useTheme } from 'react-native-paper';

const Profile = () => {
  const { user, logout, me } = useAuth(); // Add me from context
  const router = useRouter();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false); // Add refresh state

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await me(); // This will fetch fresh user data
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    } finally {
      setRefreshing(false);
    }
  };


  const handleLogout = async () => {
    setLoading(true);
    setLoadingMessage("Logging out...");

    try {
      await logout();
      router.replace('/');
    } catch (error) {
      console.error("Logout failed:", error);
      setLoadingMessage("Logout failed");
      setTimeout(() => setLoading(false), 1500);
      return;
    }
  };

  const getStatusText = () => {
    if (user?.status === 1) return 'Verified';
    if (user?.status === 2) return 'Pending Verification';
    return 'Unverified';
  };

  const getStatusColor = () => {
    if (user?.status === 1) return '#10b981'; // Green for verified
    if (user?.status === 2) return '#f59e0b'; // Amber for pending
    return '#ef4444'; // Red for unverified
  };

  const getStatusIcon = () => {
    if (user?.status === 1) return 'check-circle';
    if (user?.status === 2) return 'clock';
    return 'alert-circle';
  };

  const getInitials = () => {
    return `${user?.first_name?.[0] ?? ''}${user?.last_name?.[0] ?? ''}`.toUpperCase();
  };

  const getMemberSince = () => {
    if (!user?.created_at) return 'N/A';
    const date = new Date(user.created_at);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header Section with Refresh Button */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Avatar.Text
              size={120}
              label={getInitials()}
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
              labelStyle={styles.avatarLabel}
            />
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <IconButton
                icon={getStatusIcon()}
                size={12}
                iconColor="#fff"
                style={styles.statusIcon}
              />
            </View>
          </View>
          
          <Text variant="headlineMedium" style={[styles.userName, { color: theme.colors.onBackground }]}>
            {user?.first_name} {user?.last_name}
          </Text>
          
          <Text variant="bodyLarge" style={[styles.userEmail, { color: theme.colors.onSurfaceVariant }]}>
            {user?.email}
          </Text>

        </View>

        {/* Account Status Card */}
        <Card style={styles.statusCard}>
          <Card.Content style={styles.statusContent}>
            <View style={styles.statusHeader}>
              <IconButton
                icon={getStatusIcon()}
                size={24}
                iconColor={getStatusColor()}
              />
              <View style={styles.statusTextContainer}>
                <Text variant="titleMedium" style={styles.statusTitle}>
                  Account Status
                </Text>
                <Text variant="bodyMedium" style={[styles.statusValue, { color: getStatusColor() }]}>
                  {getStatusText()}
                </Text>
              </View>
            </View>
            
            {user?.status === 1 && (
              <Text variant="bodySmall" style={[styles.statusDescription, { color: theme.colors.onSurfaceVariant }]}>
                ✓ Your account is fully verified and eligible for discounts
              </Text>
            )}
            {user?.status === 2 && (
              <Text variant="bodySmall" style={[styles.statusDescription, { color: theme.colors.onSurfaceVariant }]}>
                ⏳ Your verification is being processed. This usually takes 24-48 hours.
              </Text>
            )}
            {(!user?.status || user?.status === 0) && (
              <Text variant="bodySmall" style={[styles.statusDescription, { color: theme.colors.onSurfaceVariant }]}>
                Admin will verify your account if you are a community member of HOA Montaña.
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Profile Information Card */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              Profile Information
            </Text>
            
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text variant="bodyMedium" style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                  First Name
                </Text>
                <Text variant="bodyLarge" style={[styles.infoValue, { color: theme.colors.onBackground }]}>
                  {user?.first_name || 'N/A'}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text variant="bodyMedium" style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Last Name
                </Text>
                <Text variant="bodyLarge" style={[styles.infoValue, { color: theme.colors.onBackground }]}>
                  {user?.last_name || 'N/A'}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text variant="bodyMedium" style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Address
                </Text>
                <Text variant="bodyLarge" style={[styles.infoValue, { color: theme.colors.onBackground }]}>
                  {user?.address || 'N/A'}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text variant="bodyMedium" style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Email Address
                </Text>
                <Text variant="bodyLarge" style={[styles.infoValue, { color: theme.colors.onBackground }]}>
                  {user?.email || 'N/A'}
                </Text>
              </View>
              
              <View style={styles.infoItem}>
                <Text variant="bodyMedium" style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Member Since
                </Text>
                <Text variant="bodyLarge" style={[styles.infoValue, { color: theme.colors.onBackground }]}>
                  {getMemberSince()}
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Quick Actions Card */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: theme.colors.onBackground }]}>
              Quick Actions
            </Text>
            
            <View style={styles.actionsGrid}>
              <Button
                mode="outlined"
                onPress={() => router.push('/(auth)/home')}
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
                labelStyle={styles.actionButtonLabel}
                icon="calendar-clock"
              >
                My Reservations
              </Button>
              
              <Button
                mode="outlined"
                onPress={() => router.push('/(auth)/reservation')}
                style={styles.actionButton}
                contentStyle={styles.actionButtonContent}
                labelStyle={styles.actionButtonLabel}
                icon="home"
              >
                Make Reservation
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Logout Section */}
        <Card style={styles.logoutCard}>
          <Card.Content>
            <Button
              mode="contained"
              onPress={handleLogout}
              buttonColor={theme.colors.error}
              textColor={theme.colors.onError}
              style={styles.logoutButton}
              contentStyle={styles.logoutButtonContent}
              labelStyle={styles.logoutButtonLabel}
              icon="logout"
            >
              Logout
            </Button>
            
            <Text variant="bodySmall" style={[styles.logoutNote, { color: theme.colors.onSurfaceVariant }]}>
              You'll need to sign in again to access your account
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Loading modal for logout and refresh */}
      <LoadingModal visible={loading} message={loadingMessage} />
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarLabel: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    fontSize: 36,
  },
  statusBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statusIcon: {
    margin: 0,
    width: 24,
    height: 24,
  },
  userName: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 12,
  },
  refreshButton: {
    marginTop: 8,
  },
  refreshButtonLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    fontSize: 14,
  },
  statusCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  statusContent: {
    paddingVertical: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    marginBottom: 2,
  },
  statusValue: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
  },
  statusDescription: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    marginTop: 8,
    lineHeight: 18,
  },
  infoCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    marginBottom: 20,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    marginBottom: 4,
  },
  infoLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    marginBottom: 4,
    fontSize: 14,
  },
  infoValue: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    fontSize: 16,
  },
  actionsCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 20,
  },
  actionsGrid: {
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    borderWidth: 1.5,
  },
  actionButtonContent: {
    paddingVertical: 8,
  },
  actionButtonLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    fontSize: 14,
  },
  logoutCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logoutButton: {
    borderRadius: 12,
    elevation: 2,
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
  logoutButtonLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    fontSize: 16,
  },
  logoutNote: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});