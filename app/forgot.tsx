import FormTextFields from '@/components/FormTextFields';
import LoadingModal from '@/components/LoadingModal';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Card,
  Dialog,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';

export default function ForgotPasswordScreen() {
    const router = useRouter();
    const theme = useTheme();
    
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Dialog state
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');

    const showDialog = (title: string, message: string) => {
        setDialogTitle(title);
        setDialogMessage(message);
        setDialogVisible(true);
    };

    const hideDialog = () => setDialogVisible(false);

    const handleSendResetLink = async () => {
        // Show feature unavailable message
        showDialog(
            'Feature Temporarily Unavailable', 
            'Password reset functionality is currently under maintenance. Please contact community support for immediate assistance with password recovery.'
        );
        return;
    };

    const handleBackToLogin = () => {
        router.back();
    };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Back Button - Now aligned to left */}
          <View style={styles.backButtonContainer}>
            <Button
              mode="text"
              icon="arrow-left"
              onPress={handleBackToLogin}
              compact
              style={styles.backButton}
              labelStyle={[styles.backButtonText, { color: theme.colors.primary }]}
            >
              Back to Login
            </Button>
          </View>

          {/* Brand Header Section */}
          <View style={styles.brandContainer}>
            <Text variant="headlineMedium" style={[styles.appName, { color: theme.colors.onBackground }]}>
              HOA Montaña
            </Text>
            <Text variant="bodyLarge" style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>
              Reset Your Password
            </Text>
          </View>

          {/* Forgot Password Form Card */}
          <Card style={styles.formCard}>
            <Card.Content style={styles.formContent}>
              <View style={styles.headerIcon}>
                <Text style={[styles.iconText, { color: theme.colors.error }]}>
                  🔧
                </Text>
              </View>
              
              {/* Maintenance Notice */}
              <Card style={[styles.maintenanceCard, { backgroundColor: theme.colors.errorContainer }]}>
                <Card.Content style={styles.maintenanceContent}>
                  <Text variant="titleSmall" style={[styles.maintenanceTitle, { color: theme.colors.onErrorContainer }]}>
                    ⚠️ Under Maintenance
                  </Text>
                  <Text variant="bodySmall" style={[styles.maintenanceMessage, { color: theme.colors.onErrorContainer }]}>
                    Password reset is temporarily unavailable. Our team is working to restore this feature.
                  </Text>
                </Card.Content>
              </Card>
              
              <Text variant="titleLarge" style={[styles.formTitle, { color: theme.colors.onBackground }]}>
                Forgot Password?
              </Text>
              
              <Text variant="bodyMedium" style={[styles.formSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                This feature is currently undergoing maintenance. Please contact support for assistance.
              </Text>

              <View style={styles.formFields}>
                <FormTextFields
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Enter your registered email"
                  style={[styles.input, { opacity: 0.6 }]}
                  disabled={true}
                />
              </View>

              <Button
                mode="contained"
                onPress={handleSendResetLink}
                disabled={true}
                style={[styles.resetButton, { backgroundColor: theme.colors.surfaceDisabled }]}
                contentStyle={styles.buttonContent}
                labelStyle={[styles.buttonLabel, { color: theme.colors.onSurfaceDisabled }]}
                icon="tooltip-account"
              >
                Send Reset Link (Unavailable)
              </Button>

              {/* Help Text */}
              <View style={styles.helpContainer}>
                <Text variant="bodySmall" style={[styles.helpText, { color: theme.colors.onSurfaceVariant }]}>
                  📞 For immediate assistance, please visit the administration office or call community support.
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Support Section */}
          <View style={styles.supportContainer}>
            <Text variant="bodyMedium" style={[styles.supportText, { color: theme.colors.error }]}>
              🔒 Password reset temporarily disabled - Contact support
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Modal - Keep but it won't show since we're not loading */}
      <LoadingModal visible={isLoading} message="Sending reset link..." />

      {/* Success/Error Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={hideDialog} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>{dialogTitle}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.dialogMessage}>
              {dialogMessage}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={hideDialog} 
              style={styles.dialogButton}
              labelStyle={styles.dialogButtonText}
            >
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  backButtonContainer: {
    marginBottom: 20,
    // Removed alignItems: 'center' to allow left alignment
  },
  backButton: {
    alignSelf: 'flex-start', // Changed from 'center' to 'flex-start'
  },
  backButtonText: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    fontSize: 14,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
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
    opacity: 0.8,
  },
  formCard: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 20,
  },
  formContent: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerIcon: {
    marginBottom: 16,
  },
  iconText: {
    fontSize: 48,
  },
  // Maintenance Card Styles
  maintenanceCard: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 12,
  },
  maintenanceContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  maintenanceTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 8,
  },
  maintenanceMessage: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 18,
  },
  formTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 12,
  },
  formSubtitle: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  formFields: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  input: {
    marginBottom: 0,
  },
  resetButton: {
    borderRadius: 12,
    elevation: 2,
    marginBottom: 24,
    width: '100%',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    fontSize: 16,
  },
  helpContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  helpText: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 16,
  },
  supportContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(211, 47, 47, 0.1)',
  },
  supportText: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    textAlign: 'center',
  },
  dialog: {
    borderRadius: 16,
  },
  dialogTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '400',
  },
  dialogMessage: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    lineHeight: 20,
  },
  dialogButton: {
    borderRadius: 8,
  },
  dialogButtonText: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
  },
});