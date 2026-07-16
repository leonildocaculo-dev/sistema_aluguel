import { create } from 'zustand';
import Cookies from 'js-cookie';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role_id: number;
  role?: {
    id: number;
    name: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  checkAuth: () => void;
}

const initialToken = typeof window !== 'undefined' ? Cookies.get('auth_token') || null : null;

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: initialToken,
  isAuthenticated: !!initialToken,
  setAuth: (user, token) => {
    Cookies.set('auth_token', token, { expires: 7, secure: true, sameSite: 'strict' });
    set({ user, token, isAuthenticated: true });
  },
  setUser: (user) => {
    set({ user });
  },
  logout: () => {
    Cookies.remove('auth_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
  checkAuth: () => {
    const token = Cookies.get('auth_token');
    if (token) {
      set({ token, isAuthenticated: true });
    } else {
      set({ user: null, token: null, isAuthenticated: false });
    }
  }
}));
