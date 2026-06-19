import { create } from 'zustand';

export interface User {
  userId: number;
  username: string;
  role: string;
  status: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatarUrl?: string;
  requirePasswordChange?: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null,
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ token, user });
  },
  updateUser: (updatedUser) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUser));
      return { user: newUser };
    });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  },
}));
