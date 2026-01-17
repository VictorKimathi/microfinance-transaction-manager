// ============================================
// API Client Configuration
// ============================================

import { ApiError } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

// Token management
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("authToken", token);
    } else {
      localStorage.removeItem("authToken");
    }
  }
};

export const getAuthToken = (): string | null => {
  if (authToken) return authToken;
  
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("authToken");
  }
  
  return authToken;
};

export const clearAuthToken = () => {
  setAuthToken(null);
};

// Request configuration interface
interface RequestConfig extends RequestInit {
  params?: Record<string, any>;
}

// Build query string from params
const buildQueryString = (params?: Record<string, any>): string => {
  if (!params) return "";
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

// Main API client function
export const apiClient = async <T = any>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> => {
  const { params, ...fetchConfig } = config;
  
  const url = `${API_BASE_URL}${endpoint}${buildQueryString(params)}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  
  // Merge existing headers if any
  if (fetchConfig.headers) {
    Object.entries(fetchConfig.headers).forEach(([key, value]) => {
      headers[key] = String(value);
    });
  }
  
  // Add authorization header if token exists
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers,
    });
    
    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      clearAuthToken();
      // Redirect to login if on client side
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      throw new Error("Unauthorized - please login again");
    }
    
    // Parse response
    const data = await response.json().catch(() => null);
    
    // Handle error responses
    if (!response.ok) {
      const error: ApiError = {
        message: data?.message || response.statusText || "An error occurred",
        statusCode: response.status,
        errors: data?.errors,
      };
      throw error;
    }
    
    return data as T;
  } catch (error: any) {
    // Re-throw ApiError objects
    if (error.statusCode) {
      throw error;
    }
    
    // Handle network errors
    throw {
      message: error.message || "Network error occurred",
      statusCode: 0,
    } as ApiError;
  }
};

// Convenience methods for different HTTP methods
export const api = {
  get: <T = any>(endpoint: string, params?: Record<string, any>) =>
    apiClient<T>(endpoint, { method: "GET", params }),
  
  post: <T = any>(endpoint: string, body?: any, params?: Record<string, any>) =>
    apiClient<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      params,
    }),
  
  put: <T = any>(endpoint: string, body?: any, params?: Record<string, any>) =>
    apiClient<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      params,
    }),
  
  delete: <T = any>(endpoint: string, params?: Record<string, any>) =>
    apiClient<T>(endpoint, { method: "DELETE", params }),
  
  patch: <T = any>(endpoint: string, body?: any, params?: Record<string, any>) =>
    apiClient<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
      params,
    }),
};

// Export API base URL for reference
export { API_BASE_URL };
