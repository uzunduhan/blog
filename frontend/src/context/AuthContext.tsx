import { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, AuthResponse } from '../types/auth';
import { setLogoutCallback } from '../api/axios';

interface AuthContextType {
  user: AuthUser | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    if (token && username && role) return { token, username, role };
    return null;
  });

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
  }, []);

  const login = useCallback((data: AuthResponse) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
    setUser({ token: data.token, username: data.username, role: data.role });
  }, []);

  useEffect(() => {
    setLogoutCallback(logout);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAdmin: user?.role === 'Admin',
        isAuthenticated: user !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
