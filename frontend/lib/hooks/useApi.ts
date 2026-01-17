// ============================================
// Custom React Hooks for API Integration
// ============================================

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  authApi,
  userApi,
  accountApi,
  transactionApi,
  loanApi,
  repaymentApi,
  notificationApi,
  reportApi,
} from "@/lib/api";
import type {
  User,
  Account,
  Transaction,
  Loan,
  Repayment,
  Notification,
  UserDashboard,
  AdminDashboard,
  LoginResponse,
} from "@/lib/types";

// ============================================
// Generic API Hook
// ============================================

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// ============================================
// Authentication Hooks
// ============================================

export function useAuth() {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authApi.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    authApi.setCurrentUser(response);
    setUser(response);
    return response;
  };

  const logout = async () => {
    await authApi.logout();
    authApi.clearCurrentUser();
    setUser(null);
  };

  const register = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    return await authApi.register(data);
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };
}

// ============================================
// User Hooks
// ============================================

export function useUser(userId: number) {
  return useApi<User>(() => userApi.getUserProfile(userId), [userId]);
}

export function useUsers(params?: any) {
  return useApi(() => userApi.getAllUsers(params), [params]);
}

// ============================================
// Account Hooks
// ============================================

export function useUserAccounts(userId: number) {
  return useApi<Account[]>(() => accountApi.getUserAccounts(userId), [userId]);
}

export function useAccount(accountId: number) {
  return useApi<Account>(() => accountApi.getAccount(accountId), [accountId]);
}

// ============================================
// Transaction Hooks
// ============================================

export function useAccountTransactions(accountId: number, params?: any) {
  return useApi<Transaction[]>(
    () => transactionApi.getAccountTransactions(accountId, params),
    [accountId, params]
  );
}

export function useTransaction(transactionId: number) {
  return useApi<Transaction>(
    () => transactionApi.getTransaction(transactionId),
    [transactionId]
  );
}

export function useRecentTransactions(accountId: number, limit: number = 10) {
  return useApi<Transaction[]>(
    () => transactionApi.getRecentTransactions(accountId, limit),
    [accountId, limit]
  );
}

// ============================================
// Loan Hooks
// ============================================

export function useUserLoans(userId: number, params?: any) {
  return useApi<Loan[]>(() => loanApi.getUserLoans(userId, params), [
    userId,
    params,
  ]);
}

export function useLoan(loanId: number) {
  return useApi<Loan>(() => loanApi.getLoan(loanId), [loanId]);
}

export function useActiveLoans(userId: number) {
  return useApi<Loan[]>(() => loanApi.getActiveLoans(userId), [userId]);
}

export function usePendingLoans() {
  return useApi<Loan[]>(() => loanApi.getPendingLoans(), []);
}

// ============================================
// Repayment Hooks
// ============================================

export function useLoanRepayments(loanId: number, params?: any) {
  return useApi<Repayment[]>(
    () => repaymentApi.getLoanRepayments(loanId, params),
    [loanId, params]
  );
}

export function useRepayment(repaymentId: number) {
  return useApi<Repayment>(
    () => repaymentApi.getRepayment(repaymentId),
    [repaymentId]
  );
}

// ============================================
// Notification Hooks
// ============================================

export function useUserNotifications(userId: number, params?: any) {
  return useApi<Notification[]>(
    () => notificationApi.getUserNotifications(userId, params),
    [userId, params]
  );
}

export function useUnreadNotifications(userId: number) {
  return useApi<Notification[]>(
    () => notificationApi.getUnreadNotifications(userId),
    [userId]
  );
}

export function useUnreadCount(userId: number) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationApi
      .getUnreadCount(userId)
      .then(setCount)
      .finally(() => setLoading(false));
  }, [userId]);

  return { count, loading };
}

// ============================================
// Dashboard Hooks
// ============================================

export function useUserDashboard(userId: number) {
  return useApi<UserDashboard>(() => reportApi.getUserDashboard(userId), [
    userId,
  ]);
}

export function useAdminDashboard() {
  return useApi<AdminDashboard>(() => reportApi.getAdminDashboard(), []);
}

// ============================================
// Mutation Hook (for POST/PUT/DELETE operations)
// ============================================

interface UseMutationResult<T> {
  mutate: (data?: any) => Promise<T>;
  loading: boolean;
  error: string | null;
  data: T | null;
}

export function useMutation<T>(
  apiCall: (data?: any) => Promise<T>
): UseMutationResult<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const mutate = async (mutationData?: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(mutationData);
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message || "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, data };
}

// ============================================
// Example Mutation Hooks
// ============================================

export function useDeposit() {
  return useMutation<Transaction>(
    ({ accountId, amount, description }: any) =>
      transactionApi.deposit(accountId, amount, description)
  );
}

export function useWithdraw() {
  return useMutation<Transaction>(
    ({ accountId, amount, description }: any) =>
      transactionApi.withdraw(accountId, amount, description)
  );
}

export function useRequestLoan() {
  return useMutation<Loan>((data: any) => loanApi.requestLoan(data));
}

export function useMakeRepayment() {
  return useMutation<Repayment>((data: any) => repaymentApi.makeRepayment(data));
}

export function useMarkNotificationAsRead() {
  return useMutation<any>((notificationId: number) =>
    notificationApi.markAsRead(notificationId)
  );
}
