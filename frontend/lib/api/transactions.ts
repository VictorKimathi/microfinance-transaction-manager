// ============================================
// Transaction Management API Service
// ============================================

import { api } from "./client";
import {
  Transaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  TransactionQueryParams,
  SuccessResponse,
} from "@/lib/types";

export const transactionApi = {
  /**
   * Get all transactions for an account
   * GET /transactions/account/{accountId}
   */
  getAccountTransactions: async (
    accountId: number,
    params?: TransactionQueryParams
  ): Promise<Transaction[]> => {
    return api.get<Transaction[]>(`/transactions/account/${accountId}`, params);
  },

  /**
   * Get single transaction details
   * GET /transactions/{transactionId}
   */
  getTransaction: async (transactionId: number): Promise<Transaction> => {
    return api.get<Transaction>(`/transactions/${transactionId}`);
  },

  /**
   * Create new transaction (deposit, withdrawal, transfer)
   * POST /transactions
   */
  createTransaction: async (
    data: CreateTransactionRequest
  ): Promise<Transaction> => {
    return api.post<Transaction>("/transactions", data);
  },

  /**
   * Update transaction status (Admin only)
   * PUT /transactions/{transactionId}
   */
  updateTransaction: async (
    transactionId: number,
    data: UpdateTransactionRequest
  ): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/transactions/${transactionId}`, data);
  },

  /**
   * Cancel/reverse transaction (Admin only)
   * DELETE /transactions/{transactionId}
   */
  reverseTransaction: async (
    transactionId: number
  ): Promise<SuccessResponse> => {
    return api.delete<SuccessResponse>(`/transactions/${transactionId}`);
  },

  /**
   * Make a deposit
   * POST /transactions
   */
  deposit: async (
    accountId: number,
    amount: number,
    description: string
  ): Promise<Transaction> => {
    return api.post<Transaction>("/transactions", {
      accountId,
      type: "DEPOSIT",
      amount,
      description,
    });
  },

  /**
   * Make a withdrawal
   * POST /transactions
   */
  withdraw: async (
    accountId: number,
    amount: number,
    description: string
  ): Promise<Transaction> => {
    return api.post<Transaction>("/transactions", {
      accountId,
      type: "WITHDRAWAL",
      amount,
      description,
    });
  },

  /**
   * Make a transfer
   * POST /transactions
   */
  transfer: async (
    fromAccountId: number,
    toAccountId: number,
    amount: number,
    description: string
  ): Promise<Transaction> => {
    return api.post<Transaction>("/transactions", {
      accountId: fromAccountId,
      type: "TRANSFER",
      amount,
      description: `Transfer to account ${toAccountId}: ${description}`,
    });
  },

  /**
   * Get transactions by type
   * GET /transactions/account/{accountId}?type={type}
   */
  getTransactionsByType: async (
    accountId: number,
    type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER" | "REPAYMENT"
  ): Promise<Transaction[]> => {
    return api.get<Transaction[]>(`/transactions/account/${accountId}`, {
      type,
    });
  },

  /**
   * Get transactions by date range
   * GET /transactions/account/{accountId}?startDate={startDate}&endDate={endDate}
   */
  getTransactionsByDateRange: async (
    accountId: number,
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> => {
    return api.get<Transaction[]>(`/transactions/account/${accountId}`, {
      startDate,
      endDate,
    });
  },

  /**
   * Get recent transactions
   * GET /transactions/account/{accountId}?limit=10
   */
  getRecentTransactions: async (
    accountId: number,
    limit: number = 10
  ): Promise<Transaction[]> => {
    return api.get<Transaction[]>(`/transactions/account/${accountId}`, {
      limit,
    });
  },

  /**
   * Get transaction history with pagination
   * GET /transactions/account/{accountId}?page={page}&limit={limit}
   */
  getTransactionHistory: async (
    accountId: number,
    page: number = 1,
    limit: number = 20
  ): Promise<Transaction[]> => {
    return api.get<Transaction[]>(`/transactions/account/${accountId}`, {
      page,
      limit,
    });
  },
};
