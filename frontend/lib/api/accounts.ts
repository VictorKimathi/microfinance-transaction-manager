// ============================================
// Account Management API Service
// ============================================

import { api } from "./client";
import {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  AccountQueryParams,
  SuccessResponse,
} from "@/lib/types";

export const accountApi = {
  /**
   * Get all accounts for a specific user
   * GET /accounts/user/{userId}
   */
  getUserAccounts: async (
    userId: number,
    params?: AccountQueryParams
  ): Promise<Account[]> => {
    return api.get<Account[]>(`/accounts/user/${userId}`, params);
  },

  /**
   * Get single account details
   * GET /accounts/{accountId}
   */
  getAccount: async (accountId: number): Promise<Account> => {
    return api.get<Account>(`/accounts/${accountId}`);
  },

  /**
   * Create new account (Admin only)
   * POST /accounts
   */
  createAccount: async (data: CreateAccountRequest): Promise<Account> => {
    return api.post<Account>("/accounts", data);
  },

  /**
   * Update account details (Admin only)
   * PUT /accounts/{accountId}
   */
  updateAccount: async (
    accountId: number,
    data: UpdateAccountRequest
  ): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/accounts/${accountId}`, data);
  },

  /**
   * Close/delete account (Admin only)
   * DELETE /accounts/{accountId}
   * Note: Balance must be zero before closing
   */
  closeAccount: async (accountId: number): Promise<SuccessResponse> => {
    return api.delete<SuccessResponse>(`/accounts/${accountId}`);
  },

  /**
   * Get account balance
   * GET /accounts/{accountId}/balance
   */
  getAccountBalance: async (accountId: number): Promise<{ balance: number }> => {
    const account = await api.get<Account>(`/accounts/${accountId}`);
    return { balance: account.balance };
  },

  /**
   * Get active accounts for a user
   * GET /accounts/user/{userId}?status=ACTIVE
   */
  getActiveAccounts: async (userId: number): Promise<Account[]> => {
    return api.get<Account[]>(`/accounts/user/${userId}`, {
      status: "ACTIVE",
    });
  },

  /**
   * Get pending accounts for a user
   * GET /accounts/user/{userId}?status=PENDING
   */
  getPendingAccounts: async (userId: number): Promise<Account[]> => {
    return api.get<Account[]>(`/accounts/user/${userId}`, {
      status: "PENDING",
    });
  },

  /**
   * Suspend account (Admin only)
   * PUT /accounts/{accountId}
   */
  suspendAccount: async (accountId: number): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/accounts/${accountId}`, {
      status: "SUSPENDED",
    });
  },

  /**
   * Activate account (Admin only)
   * PUT /accounts/{accountId}
   */
  activateAccount: async (accountId: number): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/accounts/${accountId}`, {
      status: "ACTIVE",
    });
  },
};
