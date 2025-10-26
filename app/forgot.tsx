import FormTextFields from '@/components/FormTextFields';
import LoadingModal from '@/components/LoadingModal';
import ForgotPasswordService from '@/services/ForgotPasswordService';
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
    if (!email) {
        showDialog('Error', 'Please enter your email address');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showDialog('Error', 'Please enter a valid email address');
        return;
    }

    setIsLoading(true);
    try {
        const response = await ForgotPasswordService.sendResetLink(email);
        
        // Stop loading immediately
        setIsLoading(false);
        
        if (response.status === 'success') {
        // Use replace instead of push to avoid going back to loading screen
        router.replace({
            pathname: '/otp-verification',
            params: { email: email }
        });
        } else {
        showDialog('Error', response.message || 'Something went wrong.');
        }
    } catch (error: any) {
        setIsLoading(false); // Stop loading on error too
        showDialog('Error', error.message);
    }
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
          {/* Back Button */}
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
                <Text style={[styles.iconText, { color: theme.colors.primary }]}>
                  🔒
                </Text>
              </View>
              
              <Text variant="titleLarge" style={[styles.formTitle, { color: theme.colors.onBackground }]}>
                Forgot Password?
              </Text>
              
              <Text variant="bodyMedium" style={[styles.formSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>

              <View style={styles.formFields}>
                <FormTextFields
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="Enter your registered email"
                  style={styles.input}
                  leftIcon="email"
                />
              </View>

              <Button
                mode="contained"
                onPress={handleSendResetLink}
                disabled={isLoading}
                style={styles.resetButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon="send"
              >
                Send Reset Link
              </Button>

              {/* Help Text */}
              <View style={styles.helpContainer}>
                <Text variant="bodySmall" style={[styles.helpText, { color: theme.colors.onSurfaceVariant }]}>
                  💡 Remember to check your spam folder if you don't see the email in your inbox.
                </Text>
              </View>
            </Card.Content>
          </Card>

          {/* Support Section */}
          <View style={styles.supportContainer}>
            <Text variant="bodyMedium" style={[styles.supportText, { color: theme.colors.onSurfaceVariant }]}>
              Need help? Contact community support.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Modal */}
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
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'center',
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
  },
  supportText: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    fontStyle: 'italic',
    opacity: 0.7,
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