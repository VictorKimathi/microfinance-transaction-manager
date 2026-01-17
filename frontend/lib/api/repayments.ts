// ============================================
// Repayment Management API Service
// ============================================

import { api } from "./client";
import {
  Repayment,
  CreateRepaymentRequest,
  UpdateRepaymentRequest,
  RepaymentQueryParams,
  SuccessResponse,
} from "@/lib/types";

export const repaymentApi = {
  /**
   * Make a loan repayment
   * POST /repayments
   */
  makeRepayment: async (data: CreateRepaymentRequest): Promise<Repayment> => {
    return api.post<Repayment>("/repayments", data);
  },

  /**
   * Get all repayments for a specific loan
   * GET /repayments/loan/{loanId}
   */
  getLoanRepayments: async (
    loanId: number,
    params?: RepaymentQueryParams
  ): Promise<Repayment[]> => {
    return api.get<Repayment[]>(`/repayments/loan/${loanId}`, params);
  },

  /**
   * Get single repayment details
   * GET /repayments/{repaymentId}
   */
  getRepayment: async (repaymentId: number): Promise<Repayment> => {
    return api.get<Repayment>(`/repayments/${repaymentId}`);
  },

  /**
   * Update repayment status (Admin only)
   * PUT /repayments/{repaymentId}
   */
  updateRepayment: async (
    repaymentId: number,
    data: UpdateRepaymentRequest
  ): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/repayments/${repaymentId}`, data);
  },

  /**
   * Reverse/cancel repayment (Admin only)
   * DELETE /repayments/{repaymentId}
   */
  reverseRepayment: async (repaymentId: number): Promise<SuccessResponse> => {
    return api.delete<SuccessResponse>(`/repayments/${repaymentId}`);
  },

  /**
   * Verify repayment (Admin only)
   * PUT /repayments/{repaymentId}
   */
  verifyRepayment: async (repaymentId: number): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/repayments/${repaymentId}`, {
      status: "VERIFIED",
    });
  },

  /**
   * Get recent repayments for a loan
   * GET /repayments/loan/{loanId}?limit=10
   */
  getRecentRepayments: async (
    loanId: number,
    limit: number = 10
  ): Promise<Repayment[]> => {
    return api.get<Repayment[]>(`/repayments/loan/${loanId}`, { limit });
  },

  /**
   * Get repayment history with pagination
   * GET /repayments/loan/{loanId}?page={page}&limit={limit}
   */
  getRepaymentHistory: async (
    loanId: number,
    page: number = 1,
    limit: number = 20
  ): Promise<Repayment[]> => {
    return api.get<Repayment[]>(`/repayments/loan/${loanId}`, {
      page,
      limit,
    });
  },

  /**
   * Get total amount repaid for a loan
   */
  getTotalRepaid: async (loanId: number): Promise<number> => {
    const repayments = await api.get<Repayment[]>(
      `/repayments/loan/${loanId}`
    );
    return repayments.reduce(
      (total, repayment) =>
        repayment.status === "COMPLETED" ? total + repayment.amount : total,
      0
    );
  },

  /**
   * Get pending repayments for verification (Admin only)
   * GET /repayments?status=PENDING
   */
  getPendingRepayments: async (): Promise<Repayment[]> => {
    return api.get<Repayment[]>("/repayments", { status: "PENDING" });
  },

  /**
   * Make bank transfer repayment
   */
  makeBankTransferRepayment: async (
    loanId: number,
    amount: number,
    reference: string
  ): Promise<Repayment> => {
    return api.post<Repayment>("/repayments", {
      loanId,
      amount,
      method: "BANK_TRANSFER",
      reference,
    });
  },

  /**
   * Make mobile money repayment
   */
  makeMobileMoneyRepayment: async (
    loanId: number,
    amount: number,
    reference: string
  ): Promise<Repayment> => {
    return api.post<Repayment>("/repayments", {
      loanId,
      amount,
      method: "MOBILE_MONEY",
      reference,
    });
  },

  /**
   * Make cash repayment
   */
  makeCashRepayment: async (
    loanId: number,
    amount: number,
    reference: string
  ): Promise<Repayment> => {
    return api.post<Repayment>("/repayments", {
      loanId,
      amount,
      method: "CASH",
      reference,
    });
  },
};
