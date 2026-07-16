import { api } from '../lib/axios';

export interface LoginPayload {
  username?: string;
  emailOrPhone?: string;
  password: string;
}

export interface UserResponse {
  userId: number;
  username: string;
  role: string;
  status: string;
  firstName?: string;
  lastName?: string;
  requirePasswordChange?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    return response.data;
  },
  forgotPassword: async (payload: { email: string }) => {
    const response = await api.post('/auth/forgot-password', payload);
    return response.data;
  },
  resetPassword: async (payload: { email: string; otp: string; newPassword: string }) => {
    const response = await api.post('/auth/reset-password', payload);
    return response.data;
  },
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', { oldPassword, newPassword });
    return response.data;
  },
  requestChangePasswordOtp: async (oldPassword: string) => {
    const response = await api.post('/auth/change-password/request-otp', { oldPassword });
    return response.data;
  },
  confirmChangePassword: async (otp: string, newPassword: string) => {
    const response = await api.post('/auth/change-password/confirm', { otp, newPassword });
    return response.data;
  }
};
