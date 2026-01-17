// ============================================
// Loan Management API Service
// ============================================

import { api } from "./client";
import {
  Loan,
  CreateLoanRequest,
  ApproveLoanRequest,
  RejectLoanRequest,
  DisburseLoanRequest,
  UpdateLoanRequest,
  LoanQueryParams,
  SuccessResponse,
} from "@/lib/types";

export const loanApi = {
  /**
   * Request a new loan
   * POST /loans
   */
  requestLoan: async (data: CreateLoanRequest): Promise<Loan> => {
    return api.post<Loan>("/loans", data);
  },

  /**
   * Get all loans for a specific user
   * GET /loans/user/{userId}
   */
  getUserLoans: async (
    userId: number,
    params?: LoanQueryParams
  ): Promise<Loan[]> => {
    return api.get<Loan[]>(`/loans/user/${userId}`, params);
  },

  /**
   * Get single loan details
   * GET /loans/{loanId}
   */
  getLoan: async (loanId: number): Promise<Loan> => {
    return api.get<Loan>(`/loans/${loanId}`);
  },

  /**
   * Approve loan (Admin only)
   * PUT /loans/{loanId}/approve
   */
  approveLoan: async (
    loanId: number,
    data: ApproveLoanRequest
  ): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/loans/${loanId}/approve`, data);
  },

  /**
   * Reject loan (Admin only)
   * PUT /loans/{loanId}/reject
   */
  rejectLoan: async (
    loanId: number,
    data: RejectLoanRequest
  ): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/loans/${loanId}/reject`, data);
  },

  /**
   * Disburse approved loan (Admin only)
   * POST /loans/{loanId}/disburse
   */
  disburseLoan: async (
    loanId: number,
    data: DisburseLoanRequest
  ): Promise<SuccessResponse> => {
    return api.post<SuccessResponse>(`/loans/${loanId}/disburse`, data);
  },

  /**
   * Update loan status (Admin only)
   * PUT /loans/{loanId}
   */
  updateLoan: async (
    loanId: number,
    data: UpdateLoanRequest
  ): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/loans/${loanId}`, data);
  },

  /**
   * Close/complete loan (Admin only)
   * DELETE /loans/{loanId}
   * Note: Balance must be fully repaid
   */
  closeLoan: async (loanId: number): Promise<SuccessResponse> => {
    return api.delete<SuccessResponse>(`/loans/${loanId}`);
  },

  /**
   * Get pending loan requests (Admin only)
   * GET /loans?status=PENDING
   */
  getPendingLoans: async (): Promise<Loan[]> => {
    return api.get<Loan[]>("/loans", { status: "PENDING" });
  },

  /**
   * Get approved loans (Admin only)
   * GET /loans?status=APPROVED
   */
  getApprovedLoans: async (): Promise<Loan[]> => {
    return api.get<Loan[]>("/loans", { status: "APPROVED" });
  },

  /**
   * Get active loans for a user
   * GET /loans/user/{userId}?status=REPAYING
   */
  getActiveLoans: async (userId: number): Promise<Loan[]> => {
    return api.get<Loan[]>(`/loans/user/${userId}`, { status: "REPAYING" });
  },

  /**
   * Get completed loans for a user
   * GET /loans/user/{userId}?status=COMPLETED
   */
  getCompletedLoans: async (userId: number): Promise<Loan[]> => {
    return api.get<Loan[]>(`/loans/user/${userId}`, { status: "COMPLETED" });
  },

  /**
   * Get all loans (Admin only)
   * GET /loans
   */
  getAllLoans: async (params?: LoanQueryParams): Promise<Loan[]> => {
    return api.get<Loan[]>("/loans", params);
  },

  /**
   * Calculate loan interest
   */
  calculateLoanInterest: (
    principal: number,
    interestRate: number,
    months: number
  ): number => {
    // Simple interest calculation: P * R * T
    return principal * interestRate * (months / 12);
  },

  /**
   * Calculate total loan repayment amount
   */
  calculateTotalRepayment: (
    principal: number,
    interestRate: number,
    months: number
  ): number => {
    const interest = principal * interestRate * (months / 12);
    return principal + interest;
  },

  /**
   * Calculate monthly payment
   */
  calculateMonthlyPayment: (
    principal: number,
    interestRate: number,
    months: number
  ): number => {
    const totalRepayment = principal + principal * interestRate * (months / 12);
    return totalRepayment / months;
  },
};
