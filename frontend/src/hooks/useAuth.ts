import { create } from 'zustand';
import { Usuario, TokenResponse } from '../types/models';
import { login as loginApi, logout as logoutApi } from '../api/auth';

interface AuthState {
  user: Usuario | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('access_token'),
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response: TokenResponse = await loginApi(email, password);
      localStorage.setItem('access_token', response.access_token);
      set({ token: response.access_token, loading: false });
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Login failed', loading: false });
    }
  },

  logout: () => {
    logoutApi();
    set({ user: null, token: null });
  },
}));
