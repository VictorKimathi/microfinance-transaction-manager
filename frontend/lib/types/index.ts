// ============================================
// Type Definitions for Microfinance Manager API
// ============================================

// ============================================
// Common Enums
// ============================================

export enum UserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum UserRole {
  CLIENT = "client",
  ADMIN = "admin",
}

export enum AccountType {
  SAVINGS = "SAVINGS",
  CURRENT = "CURRENT",
}

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  PENDING = "PENDING",
  SUSPENDED = "SUSPENDED",
  CLOSED = "CLOSED",
}

export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRANSFER = "TRANSFER",
  REPAYMENT = "REPAYMENT",
}

export enum TransactionStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  REVERSED = "REVERSED",
  FAILED = "FAILED",
}

export enum LoanStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  DISBURSED = "DISBURSED",
  REPAYING = "REPAYING",
  COMPLETED = "COMPLETED",
}

export enum RepaymentMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  MOBILE_MONEY = "MOBILE_MONEY",
  CASH = "CASH",
  CARD = "CARD",
}

export enum RepaymentStatus {
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  FAILED = "FAILED",
}

export enum NotificationStatus {
  UNREAD = "UNREAD",
  READ = "READ",
  ARCHIVED = "ARCHIVED",
}

export enum NotificationType {
  ACCOUNT_APPROVED = "ACCOUNT_APPROVED",
  LOAN_APPROVED = "LOAN_APPROVED",
  LOAN_REJECTED = "LOAN_REJECTED",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  CUSTOM = "CUSTOM",
}

// ============================================
// User Types
// ============================================

export interface User {
  userId: number;
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  role: UserRole;
  registrationDate: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  name: string;
  role: UserRole;
  status: UserStatus;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
}

export interface ApproveUserRequest {
  status: UserStatus.ACTIVE;
}

export interface SuspendUserRequest {
  reason: string;
}

export interface PaginatedUsersResponse {
  total: number;
  page: number;
  limit: number;
  users: User[];
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  status?: UserStatus;
  role?: UserRole;
  search?: string;
}

// ============================================
// Account Types
// ============================================

export interface Account {
  accountId: number;
  userId: number;
  balance: number;
  accountType: AccountType;
  status: AccountStatus;
  createdAt: string;
  lastTransactionDate?: string;
}

export interface CreateAccountRequest {
  userId: number;
  accountType: AccountType;
}

export interface UpdateAccountRequest {
  status: AccountStatus;
}

export interface AccountQueryParams {
  status?: AccountStatus;
}

// ============================================
// Transaction Types
// ============================================

export interface Transaction {
  transactionId: number;
  accountId: number;
  type: TransactionType;
  amount: number;
  timestamp: string;
  description: string;
  status: TransactionStatus;
  referenceNumber?: string;
}

export interface CreateTransactionRequest {
  accountId: number;
  type: TransactionType;
  amount: number;
  description: string;
}

export interface UpdateTransactionRequest {
  status: TransactionStatus;
}

export interface TransactionQueryParams {
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// ============================================
// Loan Types
// ============================================

export interface Loan {
  loanId: number;
  userId: number;
  amount: number;
  interestRate: number;
  repaymentPeriodMonths: number;
  status: LoanStatus;
  requestDate: string;
  startDate: string | null;
  dueDate: string | null;
  principalBalance?: number;
  totalRepaid?: number;
}

export interface CreateLoanRequest {
  userId: number;
  amount: number;
  interestRate: number;
  repaymentPeriodMonths: number;
}

export interface ApproveLoanRequest {
  approvedAmount: number;
  approvalNotes: string;
}

export interface RejectLoanRequest {
  rejectionReason: string;
}

export interface DisburseLoanRequest {
  accountId: number;
}

export interface UpdateLoanRequest {
  status: LoanStatus;
}

export interface LoanQueryParams {
  status?: LoanStatus;
}

// ============================================
// Repayment Types
// ============================================

export interface Repayment {
  repaymentId: number;
  loanId: number;
  amount: number;
  timestamp: string;
  method: RepaymentMethod;
  reference: string;
  status: RepaymentStatus;
  remainingBalance?: number;
  receiptNumber?: string;
}

export interface CreateRepaymentRequest {
  loanId: number;
  amount: number;
  method: RepaymentMethod;
  reference: string;
}

export interface UpdateRepaymentRequest {
  status: RepaymentStatus;
}

export interface RepaymentQueryParams {
  page?: number;
  limit?: number;
}

// ============================================
// Notification Types
// ============================================

export interface Notification {
  notificationId: number;
  userId: number;
  type: NotificationType;
  message: string;
  sentAt: string;
  status: NotificationStatus;
  relatedId: number | null;
}

export interface CreateNotificationRequest {
  userId: number;
  type: NotificationType;
  message: string;
  relatedId?: number | null;
}

export interface UpdateNotificationRequest {
  status: NotificationStatus;
}

export interface NotificationQueryParams {
  status?: NotificationStatus;
  type?: NotificationType;
}

// ============================================
// Report Types
// ============================================

export interface AccountStatement {
  accountId: number;
  accountType: AccountType;
  statementPeriod: string;
  openingBalance: number;
  closingBalance: number;
  totalDeposits: number;
  totalWithdrawals: number;
  transactions: StatementTransaction[];
}

export interface StatementTransaction {
  date: string;
  description: string;
  debit: number | null;
  credit: number | null;
  balance: number;
}

export interface LoanStatement {
  loanId: number;
  userId: number;
  loanAmount: number;
  interestRate: number;
  disburseDate: string;
  dueDate: string;
  principalRepaid: number;
  principalBalance: number;
  interestAccrued: number;
  totalRepaid: number;
  status: LoanStatus;
  repayments: LoanStatementRepayment[];
}

export interface LoanStatementRepayment {
  date: string;
  amount: number;
  method: RepaymentMethod;
}

export interface UserDashboard {
  userId: number;
  totalAccountBalance: number;
  accountCount: number;
  activeLoans: number;
  totalLoanBalance: number;
  recentTransactions: Transaction[];
  pendingApprovals: number;
}

export interface AdminDashboard {
  totalUsers: number;
  activeUsers: number;
  pendingApprovals: number;
  totalLoans: number;
  activeLoans: number;
  totalDisbursed: number;
  totalRepaid: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  userId: number;
}

export interface StatementQueryParams {
  startDate?: string;
  endDate?: string;
  format?: "json" | "pdf";
}

// ============================================
// API Response Types
// ============================================

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface SuccessResponse<T = any> {
  message: string;
  data?: T;
}
