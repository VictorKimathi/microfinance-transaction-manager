// ============================================
// Reporting and Statement API Service
// ============================================

import { api } from "./client";
import {
  AccountStatement,
  LoanStatement,
  UserDashboard,
  AdminDashboard,
  StatementQueryParams,
} from "@/lib/types";

export const reportApi = {
  /**
   * Get account mini-statement
   * GET /reports/statement/account/{accountId}
   */
  getAccountStatement: async (
    accountId: number,
    params?: StatementQueryParams
  ): Promise<AccountStatement> => {
    return api.get<AccountStatement>(
      `/reports/statement/account/${accountId}`,
      params
    );
  },

  /**
   * Get loan statement
   * GET /reports/statement/loan/{loanId}
   */
  getLoanStatement: async (
    loanId: number,
    params?: StatementQueryParams
  ): Promise<LoanStatement> => {
    return api.get<LoanStatement>(
      `/reports/statement/loan/${loanId}`,
      params
    );
  },

  /**
   * Get user dashboard summary
   * GET /reports/dashboard/{userId}
   */
  getUserDashboard: async (userId: number): Promise<UserDashboard> => {
    return api.get<UserDashboard>(`/reports/dashboard/${userId}`);
  },

  /**
   * Get admin dashboard summary
   * GET /reports/admin/dashboard
   */
  getAdminDashboard: async (): Promise<AdminDashboard> => {
    return api.get<AdminDashboard>("/reports/admin/dashboard");
  },

  /**
   * Get account statement for date range
   * GET /reports/statement/account/{accountId}?startDate={startDate}&endDate={endDate}
   */
  getAccountStatementByDateRange: async (
    accountId: number,
    startDate: string,
    endDate: string
  ): Promise<AccountStatement> => {
    return api.get<AccountStatement>(
      `/reports/statement/account/${accountId}`,
      {
        startDate,
        endDate,
      }
    );
  },

  /**
   * Get account statement as PDF
   * GET /reports/statement/account/{accountId}?format=pdf
   */
  getAccountStatementPDF: async (
    accountId: number,
    params?: StatementQueryParams
  ): Promise<Blob> => {
    const response = await fetch(
      `/reports/statement/account/${accountId}?format=pdf${params?.startDate ? `&startDate=${params.startDate}` : ""}${params?.endDate ? `&endDate=${params.endDate}` : ""}`
    );
    return response.blob();
  },

  /**
   * Get loan statement as PDF
   * GET /reports/statement/loan/{loanId}?format=pdf
   */
  getLoanStatementPDF: async (loanId: number): Promise<Blob> => {
    const response = await fetch(
      `/reports/statement/loan/${loanId}?format=pdf`
    );
    return response.blob();
  },

  /**
   * Get monthly account statement
   */
  getMonthlyAccountStatement: async (
    accountId: number,
    year: number,
    month: number
  ): Promise<AccountStatement> => {
    const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];

    return api.get<AccountStatement>(
      `/reports/statement/account/${accountId}`,
      {
        startDate,
        endDate,
      }
    );
  },

  /**
   * Get yearly account statement
   */
  getYearlyAccountStatement: async (
    accountId: number,
    year: number
  ): Promise<AccountStatement> => {
    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    return api.get<AccountStatement>(
      `/reports/statement/account/${accountId}`,
      {
        startDate,
        endDate,
      }
    );
  },

  /**
   * Get all user accounts summary
   * GET /reports/accounts/user/{userId}
   */
  getUserAccountsSummary: async (
    userId: number
  ): Promise<{
    totalBalance: number;
    accountCount: number;
    accounts: Array<{
      accountId: number;
      accountType: string;
      balance: number;
      status: string;
    }>;
  }> => {
    return api.get(`/reports/accounts/user/${userId}`);
  },

  /**
   * Get user loans summary
   * GET /reports/loans/user/{userId}
   */
  getUserLoansSummary: async (
    userId: number
  ): Promise<{
    totalLoans: number;
    activeLoans: number;
    totalBorrowed: number;
    totalRepaid: number;
    totalOutstanding: number;
  }> => {
    return api.get(`/reports/loans/user/${userId}`);
  },

  /**
   * Get admin statistics
   * GET /reports/admin/statistics
   */
  getAdminStatistics: async (): Promise<{
    totalUsers: number;
    activeUsers: number;
    totalAccounts: number;
    totalBalance: number;
    totalLoans: number;
    totalDisbursed: number;
    totalRepaid: number;
    totalOutstanding: number;
  }> => {
    return api.get("/reports/admin/statistics");
  },

  /**
   * Get transaction summary for account
   */
  getAccountTransactionSummary: async (
    accountId: number,
    startDate?: string,
    endDate?: string
  ): Promise<{
    totalDeposits: number;
    totalWithdrawals: number;
    totalTransfers: number;
    netFlow: number;
    transactionCount: number;
  }> => {
    return api.get(`/reports/transactions/account/${accountId}`, {
      startDate,
      endDate,
    });
  },

  /**
   * Export account statement
   */
  exportAccountStatement: async (
    accountId: number,
    format: "pdf" | "csv" | "excel",
    params?: StatementQueryParams
  ): Promise<Blob> => {
    const response = await fetch(
      `/reports/statement/account/${accountId}/export?format=${format}${params?.startDate ? `&startDate=${params.startDate}` : ""}${params?.endDate ? `&endDate=${params.endDate}` : ""}`
    );
    return response.blob();
  },

  /**
   * Get recent activity for admin
   */
  getRecentActivity: async (limit: number = 20): Promise<any[]> => {
    return api.get("/reports/admin/activity", { limit });
  },
};
