'use client';
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { AuthState, User } from '@/types';

interface AuthContextValue extends AuthState {
  setAuth: (state: Partial<AuthState>) => void;
  logout: () => void;
}

const defaultAuth: AuthState = {
  isLoggedIn: false,
  user: null,
  balance: 0,
  messageCount: 0,
  tierValue: 0,
};

const AuthContext = createContext<AuthContextValue>({
  ...defaultAuth,
  setAuth: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuthState] = useState<AuthState>(defaultAuth);

  const setAuth = useCallback((partial: Partial<AuthState>) => {
    setAuthState((prev) => ({ ...prev, ...partial }));
  }, []);

  const logout = useCallback(() => {
    setAuthState(defaultAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
