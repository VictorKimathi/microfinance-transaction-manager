# Microfinance Manager - Backend API Integration

This directory contains the complete backend API integration layer for the Microfinance Manager application.

## 📁 Structure

```
lib/
├── api/
│   ├── client.ts         # Base API client with JWT authentication
│   ├── auth.ts           # Authentication endpoints
│   ├── users.ts          # User management endpoints
│   ├── accounts.ts       # Account management endpoints
│   ├── transactions.ts   # Transaction endpoints
│   ├── loans.ts          # Loan management endpoints
│   ├── repayments.ts     # Repayment endpoints
│   ├── notifications.ts  # Notification endpoints
│   ├── reports.ts        # Reporting and statement endpoints
│   └── index.ts          # Main export file
└── types/
    └── index.ts          # TypeScript type definitions
```

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### 2. Import and Use

```typescript
import { authApi, userApi, accountApi } from '@/lib/api';

// Login
const response = await authApi.login({
  email: 'user@example.com',
  password: 'password123'
});

// Get user profile
const user = await userApi.getUserProfile(response.userId);

// Get user accounts
const accounts = await accountApi.getUserAccounts(response.userId);
```

## 📚 API Services

### Authentication Service (`authApi`)

```typescript
// Register new user
await authApi.register({
  name: "John Doe",
  email: "john@example.com",
  phone: "+254712345678",
  password: "securepass123"
});

// Login
const loginResponse = await authApi.login({
  email: "john@example.com",
  password: "securepass123"
});

// Logout
await authApi.logout();

// Refresh token
await authApi.refreshToken(refreshToken);

// Check authentication status
const isAuth = authApi.isAuthenticated();
```

### User Management Service (`userApi`)

```typescript
// Get user profile
const user = await userApi.getUserProfile(userId);

// Get all users (Admin only)
const users = await userApi.getAllUsers({
  page: 1,
  limit: 10,
  status: 'ACTIVE',
  search: 'john'
});

// Update user profile
await userApi.updateUserProfile(userId, {
  name: "John Updated",
  phone: "+254712345679"
});

// Approve user (Admin only)
await userApi.approveUser(userId, { status: 'ACTIVE' });

// Suspend user (Admin only)
await userApi.suspendUser(userId, {
  reason: "Unusual activity detected"
});

// Delete user (Admin only)
await userApi.deleteUser(userId);
```

### Account Management Service (`accountApi`)

```typescript
// Get user accounts
const accounts = await accountApi.getUserAccounts(userId);

// Get specific account
const account = await accountApi.getAccount(accountId);

// Create account (Admin only)
await accountApi.createAccount({
  userId: 1,
  accountType: 'SAVINGS'
});

// Update account (Admin only)
await accountApi.updateAccount(accountId, {
  status: 'SUSPENDED'
});

// Close account (Admin only)
await accountApi.closeAccount(accountId);

// Get account balance
const { balance } = await accountApi.getAccountBalance(accountId);
```

### Transaction Service (`transactionApi`)

```typescript
// Get account transactions
const transactions = await transactionApi.getAccountTransactions(accountId, {
  type: 'DEPOSIT',
  startDate: '2026-01-01',
  endDate: '2026-01-31',
  page: 1,
  limit: 20
});

// Get single transaction
const transaction = await transactionApi.getTransaction(transactionId);

// Make deposit
await transactionApi.deposit(accountId, 1000, "Initial deposit");

// Make withdrawal
await transactionApi.withdraw(accountId, 200, "ATM withdrawal");

// Make transfer
await transactionApi.transfer(fromAccountId, toAccountId, 500, "Transfer");

// Get recent transactions
const recent = await transactionApi.getRecentTransactions(accountId, 10);

// Reverse transaction (Admin only)
await transactionApi.reverseTransaction(transactionId);
```

### Loan Management Service (`loanApi`)

```typescript
// Request loan
await loanApi.requestLoan({
  userId: 1,
  amount: 10000,
  interestRate: 0.05,
  repaymentPeriodMonths: 12
});

// Get user loans
const loans = await loanApi.getUserLoans(userId, {
  status: 'APPROVED'
});

// Get single loan
const loan = await loanApi.getLoan(loanId);

// Approve loan (Admin only)
await loanApi.approveLoan(loanId, {
  approvedAmount: 10000,
  approvalNotes: "Approved based on credit history"
});

// Reject loan (Admin only)
await loanApi.rejectLoan(loanId, {
  rejectionReason: "Insufficient credit score"
});

// Disburse loan (Admin only)
await loanApi.disburseLoan(loanId, {
  accountId: 1
});

// Get pending loans (Admin only)
const pendingLoans = await loanApi.getPendingLoans();

// Calculate loan interest
const interest = loanApi.calculateLoanInterest(10000, 0.05, 12);

// Calculate monthly payment
const monthlyPayment = loanApi.calculateMonthlyPayment(10000, 0.05, 12);
```

### Repayment Service (`repaymentApi`)

```typescript
// Make repayment
await repaymentApi.makeRepayment({
  loanId: 1,
  amount: 1000,
  method: 'BANK_TRANSFER',
  reference: 'TRF20260114001'
});

// Get loan repayments
const repayments = await repaymentApi.getLoanRepayments(loanId, {
  page: 1,
  limit: 20
});

// Get single repayment
const repayment = await repaymentApi.getRepayment(repaymentId);

// Verify repayment (Admin only)
await repaymentApi.verifyRepayment(repaymentId);

// Reverse repayment (Admin only)
await repaymentApi.reverseRepayment(repaymentId);

// Make bank transfer repayment
await repaymentApi.makeBankTransferRepayment(loanId, 1000, 'REF123');

// Make mobile money repayment
await repaymentApi.makeMobileMoneyRepayment(loanId, 1000, 'MM123');

// Get total repaid
const totalRepaid = await repaymentApi.getTotalRepaid(loanId);
```

### Notification Service (`notificationApi`)

```typescript
// Get user notifications
const notifications = await notificationApi.getUserNotifications(userId, {
  status: 'UNREAD'
});

// Get single notification
const notification = await notificationApi.getNotification(notificationId);

// Mark as read
await notificationApi.markAsRead(notificationId);

// Mark all as read
await notificationApi.markAllAsRead(userId);

// Get unread count
const count = await notificationApi.getUnreadCount(userId);

// Delete notification
await notificationApi.deleteNotification(notificationId);

// Send custom notification (Admin only)
await notificationApi.sendCustomNotification(userId, "System maintenance scheduled");
```

### Reporting Service (`reportApi`)

```typescript
// Get account statement
const statement = await reportApi.getAccountStatement(accountId, {
  startDate: '2026-01-01',
  endDate: '2026-01-31'
});

// Get loan statement
const loanStatement = await reportApi.getLoanStatement(loanId);

// Get user dashboard
const dashboard = await reportApi.getUserDashboard(userId);

// Get admin dashboard
const adminDashboard = await reportApi.getAdminDashboard();

// Get monthly statement
const monthly = await reportApi.getMonthlyAccountStatement(accountId, 2026, 1);

// Get yearly statement
const yearly = await reportApi.getYearlyAccountStatement(accountId, 2026);

// Export statement as PDF
const pdfBlob = await reportApi.exportAccountStatement(accountId, 'pdf', {
  startDate: '2026-01-01',
  endDate: '2026-01-31'
});
```

## 🔐 Authentication Flow

The API client automatically handles JWT token management:

1. **Login**: Token is automatically stored after successful login
2. **Requests**: Token is automatically included in all API requests
3. **Expiration**: Automatically redirects to login on 401 errors
4. **Logout**: Token is automatically cleared

## 🛠️ Error Handling

All API calls throw errors with the following structure:

```typescript
interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

// Usage
try {
  await authApi.login(credentials);
} catch (error: any) {
  console.error(error.message);
  console.error(error.statusCode);
  console.error(error.errors);
}
```

## 📝 TypeScript Types

All API requests and responses are fully typed. Import types from:

```typescript
import {
  User,
  Account,
  Transaction,
  Loan,
  Repayment,
  Notification,
  UserStatus,
  AccountType,
  TransactionType,
  LoanStatus
} from '@/lib/types';
```

## 🔄 React Hooks Usage

Example custom hook for fetching data:

```typescript
import { useState, useEffect } from 'react';
import { userApi, User } from '@/lib/api';

export function useUser(userId: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    userApi.getUserProfile(userId)
      .then(setUser)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [userId]);

  return { user, loading, error };
}
```

## 🔍 API Client Configuration

### Base URL

Set in `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### Custom Headers

Modify `lib/api/client.ts` to add custom headers:

```typescript
const headers: HeadersInit = {
  "Content-Type": "application/json",
  "X-Custom-Header": "value",
  ...fetchConfig.headers,
};
```

## 📋 Best Practices

1. **Always handle errors**: Wrap API calls in try-catch blocks
2. **Use TypeScript types**: Import and use the provided types
3. **Check authentication**: Use `authApi.isAuthenticated()` before accessing protected routes
4. **Logout on errors**: Clear tokens and redirect on authentication failures
5. **Loading states**: Always show loading indicators during API calls
6. **Pagination**: Use pagination for large datasets
7. **Caching**: Consider using SWR or React Query for data caching

## 🧪 Testing

Example test with Jest:

```typescript
import { authApi } from '@/lib/api';

jest.mock('@/lib/api/client', () => ({
  api: {
    post: jest.fn()
  }
}));

describe('authApi', () => {
  it('should login successfully', async () => {
    const mockResponse = {
      token: 'mock-token',
      userId: 1,
      name: 'Test User',
      role: 'client',
      status: 'ACTIVE'
    };
    
    (api.post as jest.Mock).mockResolvedValue(mockResponse);
    
    const result = await authApi.login({
      email: 'test@example.com',
      password: 'password'
    });
    
    expect(result).toEqual(mockResponse);
  });
});
```

## 📖 Additional Resources

- [API Documentation](docs/api-documentation.md)
- [Backend Repository](link-to-backend-repo)
- [Postman Collection](link-to-postman-collection)

## 🤝 Contributing

When adding new endpoints:

1. Add types to `lib/types/index.ts`
2. Create/update service file in `lib/api/`
3. Export from `lib/api/index.ts`
4. Update this README with usage examples

## 📄 License

Copyright © 2026 Victor Kimathi
