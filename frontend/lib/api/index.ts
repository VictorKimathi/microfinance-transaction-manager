// ============================================
// Main API Export
// ============================================

// Export all API services
export { authApi } from "./auth";
export { userApi } from "./users";
export { accountApi } from "./accounts";
export { transactionApi } from "./transactions";
export { loanApi } from "./loans";
export { repaymentApi } from "./repayments";
export { notificationApi } from "./notifications";
export { reportApi } from "./reports";

// Export API client utilities
export {
  api,
  apiClient,
  setAuthToken,
  getAuthToken,
  clearAuthToken,
  API_BASE_URL,
} from "./client";

// Re-export all types
export * from "@/lib/types";
