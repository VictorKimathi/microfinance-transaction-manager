# 📚 API Quick Reference Guide

## Import Statements

```typescript
// Import all API services
import {
  authApi,
  userApi,
  accountApi,
  transactionApi,
  loanApi,
  repaymentApi,
  notificationApi,
  reportApi
} from '@/lib/api';

// Import types
import type {
  User,
  Account,
  Transaction,
  Loan,
  Repayment,
  Notification,
  LoginResponse
} from '@/lib/types';

// Import hooks
import {
  useAuth,
  useUser,
  useUserAccounts,
  useAccountTransactions,
  useUserLoans,
  useUserDashboard,
  useDeposit,
  useWithdraw
} from '@/lib/hooks/useApi';

// Import context
import { useAuthContext } from '@/lib/context/AuthContext';
```

---

## Authentication

```typescript
// Login
const response = await authApi.login({ email, password });

// Register
await authApi.register({ name, email, phone, password });

// Logout
await authApi.logout();

// Check authentication
const isAuth = authApi.isAuthenticated();

// Get current user
const user = authApi.getCurrentUser();
```

---

## User Management

```typescript
// Get user profile
const user = await userApi.getUserProfile(userId);

// Update profile
await userApi.updateUserProfile(userId, { name, phone });

// Get all users (Admin)
const users = await userApi.getAllUsers({ page: 1, limit: 10 });

// Approve user (Admin)
await userApi.approveUser(userId, { status: 'ACTIVE' });

// Suspend user (Admin)
await userApi.suspendUser(userId, { reason: 'Reason here' });
```

---

## Accounts

```typescript
// Get user accounts
const accounts = await accountApi.getUserAccounts(userId);

// Get single account
const account = await accountApi.getAccount(accountId);

// Create account (Admin)
await accountApi.createAccount({ userId, accountType: 'SAVINGS' });

// Get balance
const { balance } = await accountApi.getAccountBalance(accountId);

// Close account (Admin)
await accountApi.closeAccount(accountId);
```

---

## Transactions

```typescript
// Get account transactions
const transactions = await transactionApi.getAccountTransactions(accountId);

// Make deposit
await transactionApi.deposit(accountId, amount, description);

// Make withdrawal
await transactionApi.withdraw(accountId, amount, description);

// Transfer
await transactionApi.transfer(fromId, toId, amount, description);

// Get recent transactions
const recent = await transactionApi.getRecentTransactions(accountId, 10);

// Reverse transaction (Admin)
await transactionApi.reverseTransaction(transactionId);
```

---

## Loans

```typescript
// Request loan
await loanApi.requestLoan({
  userId,
  amount: 10000,
  interestRate: 0.05,
  repaymentPeriodMonths: 12
});

// Get user loans
const loans = await loanApi.getUserLoans(userId);

// Get single loan
const loan = await loanApi.getLoan(loanId);

// Approve loan (Admin)
await loanApi.approveLoan(loanId, {
  approvedAmount: 10000,
  approvalNotes: 'Approved'
});

// Reject loan (Admin)
await loanApi.rejectLoan(loanId, {
  rejectionReason: 'Insufficient credit'
});

// Disburse loan (Admin)
await loanApi.disburseLoan(loanId, { accountId });

// Calculate interest
const interest = loanApi.calculateLoanInterest(10000, 0.05, 12);
```

---

## Repayments

```typescript
// Make repayment
await repaymentApi.makeRepayment({
  loanId,
  amount: 1000,
  method: 'BANK_TRANSFER',
  reference: 'REF123'
});

// Get loan repayments
const repayments = await repaymentApi.getLoanRepayments(loanId);

// Verify repayment (Admin)
await repaymentApi.verifyRepayment(repaymentId);

// Reverse repayment (Admin)
await repaymentApi.reverseRepayment(repaymentId);

// Get total repaid
const total = await repaymentApi.getTotalRepaid(loanId);
```

---

## Notifications

```typescript
// Get user notifications
const notifications = await notificationApi.getUserNotifications(userId);

// Get unread notifications
const unread = await notificationApi.getUnreadNotifications(userId);

// Mark as read
await notificationApi.markAsRead(notificationId);

// Mark all as read
await notificationApi.markAllAsRead(userId);

// Get unread count
const count = await notificationApi.getUnreadCount(userId);

// Delete notification
await notificationApi.deleteNotification(notificationId);
```

---

## Reports

```typescript
// Get user dashboard
const dashboard = await reportApi.getUserDashboard(userId);

// Get admin dashboard
const adminDashboard = await reportApi.getAdminDashboard();

// Get account statement
const statement = await reportApi.getAccountStatement(accountId, {
  startDate: '2026-01-01',
  endDate: '2026-01-31'
});

// Get loan statement
const loanStatement = await reportApi.getLoanStatement(loanId);

// Get monthly statement
const monthly = await reportApi.getMonthlyAccountStatement(accountId, 2026, 1);

// Export as PDF
const pdfBlob = await reportApi.exportAccountStatement(accountId, 'pdf');
```

---

## React Hooks

```typescript
// Authentication
const { user, isAuthenticated, login, logout } = useAuth();

// User data
const { data: user, loading, error } = useUser(userId);

// Accounts
const { data: accounts } = useUserAccounts(userId);
const { data: account } = useAccount(accountId);

// Transactions
const { data: transactions } = useAccountTransactions(accountId);
const { data: recent } = useRecentTransactions(accountId, 10);

// Loans
const { data: loans } = useUserLoans(userId);
const { data: loan } = useLoan(loanId);

// Notifications
const { data: notifications } = useUserNotifications(userId);
const { count } = useUnreadCount(userId);

// Dashboard
const { data: dashboard } = useUserDashboard(userId);
const { data: adminDashboard } = useAdminDashboard();

// Mutations
const { mutate: deposit, loading } = useDeposit();
const { mutate: withdraw } = useWithdraw();
const { mutate: requestLoan } = useRequestLoan();
```

---

## Error Handling

```typescript
try {
  await accountApi.getUserAccounts(userId);
} catch (error) {
  const apiError = error as ApiError;
  
  switch (apiError.statusCode) {
    case 400:
      console.log('Validation error:', apiError.errors);
      break;
    case 401:
      console.log('Unauthorized');
      router.push('/login');
      break;
    case 403:
      console.log('Forbidden');
      break;
    case 404:
      console.log('Not found');
      break;
    case 0:
      console.log('Network error');
      break;
    default:
      console.log('Error:', apiError.message);
  }
}
```

---

## TypeScript Types

```typescript
// User types
User, UserStatus, UserRole, RegisterRequest, LoginRequest, LoginResponse

// Account types
Account, AccountType, AccountStatus, CreateAccountRequest

// Transaction types
Transaction, TransactionType, TransactionStatus, CreateTransactionRequest

// Loan types
Loan, LoanStatus, CreateLoanRequest, ApproveLoanRequest

// Repayment types
Repayment, RepaymentMethod, RepaymentStatus, CreateRepaymentRequest

// Notification types
Notification, NotificationStatus, NotificationType

// Report types
AccountStatement, LoanStatement, UserDashboard, AdminDashboard

// Common types
ApiError, SuccessResponse
```

---

## Enums

```typescript
// User
UserStatus: PENDING, ACTIVE, SUSPENDED
UserRole: client, admin

// Account
AccountType: SAVINGS, CURRENT
AccountStatus: ACTIVE, PENDING, SUSPENDED, CLOSED

// Transaction
TransactionType: DEPOSIT, WITHDRAWAL, TRANSFER, REPAYMENT
TransactionStatus: COMPLETED, PENDING, REVERSED, FAILED

// Loan
LoanStatus: PENDING, APPROVED, REJECTED, DISBURSED, REPAYING, COMPLETED

// Repayment
RepaymentMethod: BANK_TRANSFER, MOBILE_MONEY, CASH, CARD
RepaymentStatus: COMPLETED, PENDING, VERIFIED, FAILED

// Notification
NotificationStatus: UNREAD, READ, ARCHIVED
NotificationType: ACCOUNT_APPROVED, LOAN_APPROVED, LOAN_REJECTED, PAYMENT_RECEIVED, CUSTOM
```

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

---

## Testing Commands

```javascript
// Browser console
await window.testApi.testConnectivity();
await window.testApi.runAllTests();
await window.testApi.testAuth();
await window.testApi.testAccounts(1);
```

---

## Common Patterns

### Protected Route

```tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";

export default function ProtectedPage() {
  const router = useRouter();

  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      router.push("/auth/login");
    }
  }, []);

  return <div>Protected Content</div>;
}
```

### Data Fetching with Loading

```tsx
const { data, loading, error, refetch } = useUserAccounts(userId);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
if (!data) return <NoData />;

return <AccountList accounts={data} onRefresh={refetch} />;
```

### Form Submission

```tsx
const [formData, setFormData] = useState({ amount: 0, description: '' });
const { mutate, loading, error } = useDeposit();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await mutate({ accountId, ...formData });
    alert('Success!');
  } catch (err) {
    alert(err.message);
  }
};
```

---

## File Structure

```
lib/
├── api/
│   ├── client.ts          # Base API client
│   ├── auth.ts            # Auth endpoints
│   ├── users.ts           # User endpoints
│   ├── accounts.ts        # Account endpoints
│   ├── transactions.ts    # Transaction endpoints
│   ├── loans.ts           # Loan endpoints
│   ├── repayments.ts      # Repayment endpoints
│   ├── notifications.ts   # Notification endpoints
│   ├── reports.ts         # Report endpoints
│   └── index.ts           # Main export
├── types/
│   └── index.ts           # Type definitions
├── hooks/
│   └── useApi.ts          # React hooks
├── context/
│   └── AuthContext.tsx    # Auth context
└── utils/
    └── apiTester.ts       # Testing utilities
```

---

**Quick Tip:** All APIs return Promises and can be used with `async/await` or `.then()/.catch()`

