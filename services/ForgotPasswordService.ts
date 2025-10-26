// services/ForgotPasswordService.ts
import api from '@/utils/api';

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ApiResponse {
  status: 'success' | 'error';
  message: string;
  errors?: Record<string, string[]>;
}

class ForgotPasswordService {
  /**
   * Send password reset link to email
   */
  async sendResetLink(email: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/password/send-link', { email });
      return response.data;
    } catch (error: any) {
      // Re-throw the error to let the component handle it
      throw error;
    }
  }

    async verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse> {
    try {
      const response = await api.post('/password/verify-otp', data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    try {
      const response = await api.post('/password/reset-password', data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Validate reset token (optional - if you want to add this feature later)
   */
  async validateResetToken(token: string, email: string): Promise<ApiResponse> {
    try {
      const response = await api.post('/password/validate-token', { token, email });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
}

export default new ForgotPasswordService();