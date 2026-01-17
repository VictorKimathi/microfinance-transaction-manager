// ============================================
// Authentication API Service
// ============================================

import { api, setAuthToken, clearAuthToken } from "./client";
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  SuccessResponse,
} from "@/lib/types";

export const authApi = {
  /**
   * Register a new user (client)
   * POST /auth/register
   */
  register: async (data: RegisterRequest): Promise<User> => {
    return api.post<User>("/auth/register", data);
  },

  /**
   * Login user and get JWT token
   * POST /auth/login
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", credentials);
    // Store token after successful login
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  /**
   * Logout user and invalidate token
   * POST /auth/logout
   */
  logout: async (): Promise<SuccessResponse> => {
    try {
      const response = await api.post<SuccessResponse>("/auth/logout");
      return response;
    } finally {
      // Always clear token on logout, even if request fails
      clearAuthToken();
    }
  },

  /**
   * Refresh JWT token
   * POST /auth/refresh
   */
  refreshToken: async (
    refreshToken: string
  ): Promise<RefreshTokenResponse> => {
    const response = await api.post<RefreshTokenResponse>("/auth/refresh", {
      refreshToken,
    });
    // Update stored token
    if (response.token) {
      setAuthToken(response.token);
    }
    return response;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("authToken");
  },

  /**
   * Get current user data from storage
   */
  getCurrentUser: (): LoginResponse | null => {
    if (typeof window === "undefined") return null;
    const userData = localStorage.getItem("currentUser");
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Store current user data
   */
  setCurrentUser: (user: LoginResponse): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  },

  /**
   * Clear current user data
   */
  clearCurrentUser: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("currentUser");
    }
  },
};
