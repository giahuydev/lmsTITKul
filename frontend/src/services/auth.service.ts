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
  tokenType: string;
  expiresIn: number;
  user: UserResponse;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    return response.data;
  }
};
