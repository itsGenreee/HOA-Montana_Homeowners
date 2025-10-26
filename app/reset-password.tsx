import FormTextFields from '@/components/FormTextFields';
import LoadingModal from '@/components/LoadingModal';
import ForgotPasswordService from '@/services/ForgotPasswordService';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function ResetPasswordScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { token, email } = useLocalSearchParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      showDialog('Error', 'Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      showDialog('Error', 'Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      showDialog('Error', 'Passwords do not match');
      return;
    }

    if (!token || !email || typeof token !== 'string' || typeof email !== 'string') {
      showDialog('Error', 'Invalid reset data. Please restart the process.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await ForgotPasswordService.resetPassword({
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      if (response.status === 'success') {
        showDialog('Success', 'Your password has been reset successfully!');
        // Clear form
        setPassword('');
        setConfirmPassword('');
      } else {
        showDialog('Error', response.message || 'Failed to reset password.');
      }
    } catch (error: any) {
      showDialog('Error', error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    hideDialog();
    // Navigate to login screen after successful reset
    router.replace('/');
  };

  const handleBack = () => {
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
              onPress={handleBack}
              compact
              style={styles.backButton}
              labelStyle={[styles.backButtonText, { color: theme.colors.primary }]}
            >
              Back
            </Button>
          </View>

          {/* Brand Header */}
          <View style={styles.brandContainer}>
            <Text variant="headlineMedium" style={[styles.appName, { color: theme.colors.onBackground }]}>
              HOA Montaña
            </Text>
            <Text variant="bodyLarge" style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}>
              Create New Password
            </Text>
          </View>

          {/* Reset Password Card */}
          <Card style={styles.formCard}>
            <Card.Content style={styles.formContent}>
              
              <Text variant="titleLarge" style={[styles.formTitle, { color: theme.colors.onBackground }]}>
                New Password
              </Text>
              
              <Text variant="bodyMedium" style={[styles.formSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                Create a strong, new password for your account
              </Text>

              <View style={styles.formFields}>
                <FormTextFields
                  label="New Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Enter new password"
                  style={styles.input}
                  rightIcon={showPassword ? 'eye-off' : 'eye'}
                  onRightIconPress={() => setShowPassword(!showPassword)}
                />
                
                <FormTextFields
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirm new password"
                  style={styles.input}
                  rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              </View>

              <Button
                mode="contained"
                onPress={handleResetPassword}
                disabled={isLoading || !password || !confirmPassword}
                style={styles.resetButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon="lock-reset"
              >
                Reset Password
              </Button>

              {/* Password Requirements */}
              <View style={styles.requirementsContainer}>
                <Text variant="bodySmall" style={[styles.requirementsTitle, { color: theme.colors.onSurfaceVariant }]}>
                  Password Requirements:
                </Text>
                <Text variant="bodySmall" style={[styles.requirement, { color: password.length >= 8 ? theme.colors.primary : theme.colors.onSurfaceVariant }]}>
                  ✓ At least 8 characters long
                </Text>
                <Text variant="bodySmall" style={[styles.requirement, { color: password === confirmPassword && confirmPassword ? theme.colors.primary : theme.colors.onSurfaceVariant }]}>
                  ✓ Passwords match
                </Text>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Modal */}
      <LoadingModal visible={isLoading} message="Resetting password..." />

      {/* Dialog */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={dialogTitle === 'Success' ? handleSuccessDialogClose : hideDialog} style={styles.dialog}>
          <Dialog.Title style={styles.dialogTitle}>{dialogTitle}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium" style={styles.dialogMessage}>
              {dialogMessage}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button 
              onPress={dialogTitle === 'Success' ? handleSuccessDialogClose : hideDialog} 
              style={styles.dialogButton}
              labelStyle={styles.dialogButtonText}
            >
              {dialogTitle === 'Success' ? 'Go to Login' : 'OK'}
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
  },
  backButton: {
    alignSelf: 'flex-start',
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
  requirementsContainer: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  requirementsTitle: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    marginBottom: 8,
    fontSize: 12,
  },
  requirement: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    fontSize: 11,
    marginBottom: 4,
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