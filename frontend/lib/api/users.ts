// ============================================
// User Management API Service
// ============================================

import { api } from "./client";
import {
  User,
  UpdateUserRequest,
  ApproveUserRequest,
  SuspendUserRequest,
  PaginatedUsersResponse,
  UsersQueryParams,
  SuccessResponse,
} from "@/lib/types";

export const userApi = {
  /**
   * Get user profile by ID
   * GET /users/{userId}
   */
  getUserProfile: async (userId: number): Promise<User> => {
    return api.get<User>(`/users/${userId}`);
  },

  /**
   * Get all users with pagination and filtering (Admin only)
   * GET /users
   */
  getAllUsers: async (
    params?: UsersQueryParams
  ): Promise<PaginatedUsersResponse> => {
    return api.get<PaginatedUsersResponse>("/users", params);
  },

  /**
   * Update user profile
   * PUT /users/{userId}
   */
  updateUserProfile: async (
    userId: number,
    data: UpdateUserRequest
  ): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/users/${userId}`, data);
  },

  /**
   * Approve pending user registration (Admin only)
   * PUT /users/{userId}/approve
   */
  approveUser: async (
    userId: number,
    data: ApproveUserRequest
  ): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/users/${userId}/approve`, data);
  },

  /**
   * Reject pending user registration (Admin only)
   * PUT /users/{userId}/reject
   */
  rejectUser: async (
    userId: number,
    reason: string
  ): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/users/${userId}/reject`, { reason });
  },

  /**
   * Suspend user account (Admin only)
   * PUT /users/{userId}/suspend
   */
  suspendUser: async (
    userId: number,
    data: SuspendUserRequest
  ): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/users/${userId}/suspend`, data);
  },

  /**
   * Unsuspend/reactivate user account (Admin only)
   * PUT /users/{userId}/unsuspend
   */
  unsuspendUser: async (userId: number): Promise<SuccessResponse> => {
    return api.put<SuccessResponse>(`/users/${userId}/unsuspend`);
  },

  /**
   * Delete user (soft delete - Admin only)
   * DELETE /users/{userId}
   */
  deleteUser: async (userId: number): Promise<SuccessResponse> => {
    return api.delete<SuccessResponse>(`/users/${userId}`);
  },

  /**
   * Get pending user approvals (Admin only)
   * GET /users?status=PENDING
   */
  getPendingApprovals: async (): Promise<PaginatedUsersResponse> => {
    return api.get<PaginatedUsersResponse>("/users", { status: "PENDING" });
  },

  /**
   * Search users by name or email (Admin only)
   * GET /users?search=query
   */
  searchUsers: async (query: string): Promise<PaginatedUsersResponse> => {
    return api.get<PaginatedUsersResponse>("/users", { search: query });
  },
};
