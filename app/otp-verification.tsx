import LoadingModal from '@/components/LoadingModal';
import ForgotPasswordService from '@/services/ForgotPasswordService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
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
  TextInput,
  useTheme,
} from 'react-native-paper';

export default function OTPVerificationScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { email } = useLocalSearchParams();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  
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

  const handleOtpChange = (text: string, index: number) => {
    // Only allow numbers
    const numericText = text.replace(/[^0-9]/g, '');
    
    const newOtp = [...otp];
    newOtp[index] = numericText;
    setOtp(newOtp);

    // Auto-focus next input
    if (numericText && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (numericText && index === 5) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 6) {
        handleVerifyOtp(fullOtp);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

const handleVerifyOtp = async (otpCode?: string) => {
  const otpToVerify = otpCode || otp.join('');
  
  if (otpToVerify.length !== 6) {
    showDialog('Error', 'Please enter the complete 6-digit code');
    return;
  }

  if (!email || typeof email !== 'string') {
    showDialog('Error', 'Email not found. Please restart the reset process.');
    return;
  }

  setIsLoading(true);
  try {
    // ✅ Now we actually verify the OTP with the backend
    const response = await ForgotPasswordService.verifyOtp({
      email: email,
      otp: otpToVerify
    });

    if (response.status === 'success') {
      // OTP is valid, navigate to reset password screen
      router.push({
        pathname: '/reset-password',
        params: { 
          token: otpToVerify,
          email: email 
        }
      });
    } else {
      showDialog('Error', response.message || 'Invalid OTP. Please try again.');
    }
  } catch (error: any) {
    showDialog('Error', error.message || 'Invalid OTP. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
  const handleResendOtp = async () => {
    if (!email || typeof email !== 'string') {
      showDialog('Error', 'Email not found.');
      return;
    }

    setIsLoading(true);
    try {
      await ForgotPasswordService.sendResetLink(email);
      showDialog('Success', 'A new OTP has been sent to your email.');
      setOtp(['', '', '', '', '', '']); // Clear OTP fields
      inputRefs.current[0]?.focus(); // Focus first input
    } catch (error: any) {
      showDialog('Error', error.message || 'Failed to resend OTP.');
    } finally {
      setIsLoading(false);
    }
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
              Verify Your Code
            </Text>
          </View>

          {/* OTP Verification Card */}
          <Card style={styles.formCard}>
            <Card.Content style={styles.formContent}>
              
              <Text variant="titleLarge" style={[styles.formTitle, { color: theme.colors.onBackground }]}>
                Enter Verification Code
              </Text>
              
              <Text variant="bodyMedium" style={[styles.formSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                We sent a 6-digit code to {email}
              </Text>

              {/* OTP Input Fields - Now Centered */}
              <View style={styles.otpContainer}>
                <View style={styles.otpInputsWrapper}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={ref => inputRefs.current[index] = ref}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      maxLength={1}
                      style={[
                        styles.otpInput,
                        { 
                          backgroundColor: theme.colors.surfaceVariant,
                          borderColor: digit ? theme.colors.primary : theme.colors.outline,
                          color: theme.colors.onSurface
                        }
                      ]}
                      contentStyle={styles.otpContent}
                      textColor={theme.colors.onSurface}
                      mode="outlined"
                      dense
                    />
                  ))}
                </View>
              </View>

              <Button
                mode="contained"
                onPress={() => handleVerifyOtp()}
                disabled={isLoading || otp.join('').length !== 6}
                style={styles.verifyButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                icon="check-circle"
              >
                Verify Code
              </Button>

              {/* Resend OTP */}
              <View style={styles.resendContainer}>
                <Text variant="bodyMedium" style={[styles.resendText, { color: theme.colors.onSurfaceVariant }]}>
                  Didn't receive the code?
                </Text>
                <Button
                  mode="text"
                  onPress={handleResendOtp}
                  disabled={isLoading}
                  labelStyle={[styles.resendButtonText, { color: theme.colors.primary }]}
                  compact
                >
                  Resend OTP
                </Button>
              </View>

              {/* Help Text */}
              <View style={styles.helpContainer}>
                <Text variant="bodySmall" style={[styles.helpText, { color: theme.colors.onSurfaceVariant }]}>
                  💡 Make sure to check your spam folder if you don't see the email.
                </Text>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Loading Modal */}
      <LoadingModal visible={isLoading} message="Verifying code..." />

      {/* Dialog */}
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
  otpContainer: {
    width: '100%',
    marginBottom: 32,
    alignItems: 'center', // Center the wrapper horizontally
  },
  otpInputsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the inputs within the wrapper
    gap: 10, // Reduced gap for better centering
    width: '100%', // Take full width
    maxWidth: 320, // Limit maximum width
  },
  otpInput: {
    width: 50, // Slightly wider
    height: 60, // Slightly taller
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  otpContent: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 0, // Remove horizontal padding
    paddingVertical: 0, // Remove vertical padding
  },
  verifyButton: {
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
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  resendText: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    marginRight: 8,
  },
  resendButtonText: {
    fontFamily: 'Satoshi-Medium',
    fontWeight: '400',
    fontSize: 14,
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