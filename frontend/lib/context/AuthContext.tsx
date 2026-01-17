// ============================================
// Auth Context Provider for Global State
// ============================================

"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi } from "@/lib/api";
import type { LoginResponse, RegisterRequest, LoginRequest } from "@/lib/types";

interface AuthContextType {
  user: LoginResponse | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<any>;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = () => {
      const currentUser = authApi.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await authApi.login(credentials);
    authApi.setCurrentUser(response);
    setUser(response);
    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      authApi.clearCurrentUser();
      setUser(null);
    }
  };

  const register = async (data: RegisterRequest) => {
    return await authApi.register(data);
  };

  const refreshAuth = () => {
    const currentUser = authApi.getCurrentUser();
    setUser(currentUser);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
