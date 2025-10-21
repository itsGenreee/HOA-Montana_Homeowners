import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';


export default function Splash() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      {/* Background Pattern */}
      <View style={styles.backgroundPattern}>
        <View style={[styles.circle, styles.circle1, { backgroundColor: theme.colors.primaryContainer }]} />
        <View style={[styles.circle, styles.circle2, { backgroundColor: theme.colors.primaryContainer }]} />
        <View style={[styles.circle, styles.circle3, { backgroundColor: theme.colors.primaryContainer }]} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* App Logo/Brand */}
        <View style={styles.logoContainer}>
          <View style={[styles.logo, { backgroundColor: theme.colors.onPrimary }]}>
            <Text style={[styles.logoText, { color: theme.colors.primary }]}>
              HM
            </Text>
          </View>
        </View>

        {/* App Name */}
        <Text 
          variant="headlineLarge" 
          style={[styles.appName, { color: theme.colors.onPrimary }]}
        >
          HOA Montaña
        </Text>
        
        {/* Tagline */}
        <Text 
          variant="bodyLarge" 
          style={[styles.tagline, { color: theme.colors.onPrimary }]}
        >
          Community Facility Reservations
        </Text>

        {/* Loading Indicator */}
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="large" 
            color={theme.colors.onPrimary} 
            style={styles.loader}
          />
          <Text 
            variant="bodyMedium" 
            style={[styles.loadingText, { color: theme.colors.onPrimary }]}
          >
            Loading...
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text 
          variant="bodySmall" 
          style={[styles.footerText, { color: theme.colors.onPrimary }]}
        >
          Your Community, Your Space
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundPattern: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle: {
    position: 'absolute',
    borderRadius: 500,
    opacity: 0.1,
  },
  circle1: {
    width: 300,
    height: 300,
    top: -100,
    right: -100,
  },
  circle2: {
    width: 200,
    height: 200,
    bottom: -50,
    left: -50,
  },
  circle3: {
    width: 150,
    height: 150,
    top: '40%',
    left: '60%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoText: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    fontSize: 24,
  },
  appName: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 48,
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loader: {
    marginBottom: 12,
  },
  loadingText: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    opacity: 0.8,
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    opacity: 0.7,
    fontStyle: 'italic',
  },
});