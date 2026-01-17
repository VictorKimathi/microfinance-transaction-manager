# 🚀 Backend Integration Implementation Guide

This guide will help you integrate the backend API structure into your Next.js application.

## 📋 Table of Contents

1. [Setup Instructions](#setup-instructions)
2. [Configuration](#configuration)
3. [Usage in Components](#usage-in-components)
4. [Authentication Flow](#authentication-flow)
5. [Error Handling](#error-handling)
6. [Testing](#testing)
7. [Best Practices](#best-practices)

---

## 1. Setup Instructions

### Step 1: Install Dependencies

No additional dependencies are required. The structure uses native `fetch` API.

### Step 2: Configure Environment Variables

Create `.env.local` in the root directory:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

### Step 3: Wrap Your App with AuthProvider

Update your root layout (`app/layout.tsx`):

```tsx
import { AuthProvider } from "@/lib/context/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

---

## 2. Configuration

### API Base URL

The API base URL is configured in `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

For production, update this to your production API URL.

### Authentication Token Management

Token management is automatic:
- **Storage**: JWT tokens are stored in `localStorage`
- **Auto-inject**: Tokens are automatically included in all API requests
- **Auto-clear**: Tokens are cleared on logout or 401 errors
- **Auto-redirect**: Redirects to login on authentication failures

---

## 3. Usage in Components

### Method 1: Using React Hooks (Recommended)

```tsx
"use client";

import { useAuth, useUserDashboard, useDeposit } from "@/lib/hooks/useApi";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const { data: dashboard, loading, error } = useUserDashboard(user?.userId || 0);
  const { mutate: deposit, loading: depositLoading } = useDeposit();

  const handleDeposit = async () => {
    try {
      await deposit({
        accountId: 1,
        amount: 1000,
        description: "Deposit"
      });
      alert("Success!");
    } catch (err) {
      alert("Failed!");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Total Balance: {dashboard?.totalAccountBalance}</h1>
      <button onClick={handleDeposit} disabled={depositLoading}>
        Make Deposit
      </button>
    </div>
  );
}
```

### Method 2: Using API Services Directly

```tsx
"use client";

import { useState, useEffect } from "react";
import { accountApi } from "@/lib/api";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    accountApi.getUserAccounts(1)
      .then(setAccounts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {accounts.map(account => (
        <div key={account.accountId}>
          {account.accountType}: {account.balance}
        </div>
      ))}
    </div>
  );
}
```

### Method 3: Using Auth Context

```tsx
"use client";

import { useAuthContext } from "@/lib/context/AuthContext";

export default function LoginPage() {
  const { login, loading, isAuthenticated } = useAuthContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({
        email: "user@example.com",
        password: "password"
      });
      // Redirect to dashboard
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
    </form>
  );
}
```

---

## 4. Authentication Flow

### Login Flow

```tsx
import { authApi } from "@/lib/api";

// 1. User submits login form
const response = await authApi.login({
  email: "user@example.com",
  password: "password123"
});

// 2. Token is automatically stored
// 3. User data is saved
authApi.setCurrentUser(response);

// 4. Redirect to dashboard
router.push("/dashboard");
```

### Protected Routes

Create a middleware or use in components:

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
  }, [router]);

  return <div>Protected Content</div>;
}
```

### Logout Flow

```tsx
import { authApi } from "@/lib/api";

const handleLogout = async () => {
  await authApi.logout();
  // Tokens and user data are automatically cleared
  router.push("/auth/login");
};
```

---

## 5. Error Handling

### API Errors

All API calls throw errors with this structure:

```typescript
interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}
```

### Global Error Handling

```tsx
import { ApiError } from "@/lib/types";

try {
  await accountApi.createAccount(data);
} catch (error) {
  const apiError = error as ApiError;
  
  if (apiError.statusCode === 401) {
    // Unauthorized - redirect to login
    router.push("/auth/login");
  } else if (apiError.statusCode === 403) {
    // Forbidden - show permission error
    alert("You don't have permission");
  } else if (apiError.statusCode === 400) {
    // Validation error
    console.log(apiError.errors);
  } else {
    // Generic error
    alert(apiError.message);
  }
}
```

### Network Error Handling

```tsx
try {
  await userApi.getUserProfile(userId);
} catch (error) {
  const apiError = error as ApiError;
  
  if (apiError.statusCode === 0) {
    // Network error - API unreachable
    alert("Cannot connect to server");
  }
}
```

---

## 6. Testing

### Test API Connectivity

Open browser console and run:

```javascript
// Test if API is reachable
await window.testApi.testConnectivity();

// Run all API tests
await window.testApi.runAllTests();

// Test specific endpoints
await window.testApi.testAuth();
await window.testApi.testAccounts(1);
```

### Unit Testing

Example with Jest:

```typescript
import { authApi } from "@/lib/api";
import { api } from "@/lib/api/client";

jest.mock("@/lib/api/client");

describe("authApi", () => {
  it("should login successfully", async () => {
    const mockResponse = {
      token: "test-token",
      userId: 1,
      name: "Test User",
      role: "client",
      status: "ACTIVE"
    };

    (api.post as jest.Mock).mockResolvedValue(mockResponse);

    const result = await authApi.login({
      email: "test@example.com",
      password: "password"
    });

    expect(result).toEqual(mockResponse);
    expect(api.post).toHaveBeenCalledWith("/auth/login", {
      email: "test@example.com",
      password: "password"
    });
  });
});
```

---

## 7. Best Practices

### ✅ DO

1. **Use TypeScript types**
   ```typescript
   import { User, Account } from "@/lib/types";
   
   const user: User = await userApi.getUserProfile(1);
   ```

2. **Handle loading states**
   ```tsx
   const { data, loading, error } = useUserDashboard(userId);
   
   if (loading) return <LoadingSpinner />;
   if (error) return <ErrorMessage message={error} />;
   ```

3. **Use React hooks for data fetching**
   ```typescript
   const { data: accounts } = useUserAccounts(userId);
   ```

4. **Implement proper error boundaries**
   ```tsx
   <ErrorBoundary fallback={<ErrorPage />}>
     <DashboardPage />
   </ErrorBoundary>
   ```

5. **Use environment variables**
   ```typescript
   const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
   ```

### ❌ DON'T

1. **Don't hardcode tokens**
   ```typescript
   // ❌ Bad
   const token = "hardcoded-token";
   
   // ✅ Good
   const token = getAuthToken();
   ```

2. **Don't ignore errors**
   ```typescript
   // ❌ Bad
   accountApi.getUserAccounts(userId);
   
   // ✅ Good
   try {
     await accountApi.getUserAccounts(userId);
   } catch (error) {
     handleError(error);
   }
   ```

3. **Don't make unnecessary API calls**
   ```typescript
   // ❌ Bad - fetches on every render
   useEffect(() => {
     fetchData();
   });
   
   // ✅ Good - fetches only when userId changes
   useEffect(() => {
     fetchData();
   }, [userId]);
   ```

4. **Don't expose sensitive data**
   ```typescript
   // ❌ Bad
   console.log("Password:", password);
   
   // ✅ Good
   console.log("Login attempt for:", email);
   ```

---

## 📖 Additional Examples

### Complete Login Component

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-6">Login</h1>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
```

### Complete Transaction Component

```tsx
"use client";

import { useState } from "react";
import { useAccountTransactions, useDeposit, useWithdraw } from "@/lib/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TransactionsPage({ accountId }: { accountId: number }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  
  const { data: transactions, loading, refetch } = useAccountTransactions(accountId);
  const { mutate: deposit, loading: depositLoading } = useDeposit();
  const { mutate: withdraw, loading: withdrawLoading } = useWithdraw();

  const handleDeposit = async () => {
    try {
      await deposit({
        accountId,
        amount: parseFloat(amount),
        description
      });
      setAmount("");
      setDescription("");
      refetch(); // Refresh transaction list
      alert("Deposit successful!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleWithdraw = async () => {
    try {
      await withdraw({
        accountId,
        amount: parseFloat(amount),
        description
      });
      setAmount("");
      setDescription("");
      refetch();
      alert("Withdrawal successful!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Make Transaction</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleDeposit}
              disabled={depositLoading || !amount}
            >
              {depositLoading ? "Processing..." : "Deposit"}
            </Button>
            
            <Button
              onClick={handleWithdraw}
              disabled={withdrawLoading || !amount}
              variant="outline"
            >
              {withdrawLoading ? "Processing..." : "Withdraw"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        
        <div className="space-y-2">
          {transactions?.map((tx) => (
            <div
              key={tx.transactionId}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-semibold">{tx.type}</p>
                <p className="text-sm text-gray-600">{tx.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(tx.timestamp).toLocaleString()}
                </p>
              </div>
              <p
                className={`font-bold ${
                  tx.type === "DEPOSIT" ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.type === "DEPOSIT" ? "+" : "-"}
                KES {tx.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
```

---

## 🎯 Next Steps

1. ✅ Configure environment variables
2. ✅ Wrap app with `AuthProvider`
3. ✅ Implement login/register pages
4. ✅ Create protected routes
5. ✅ Build dashboard using hooks
6. ✅ Implement transaction flows
7. ✅ Add error handling
8. ✅ Test API integration

---

## 📞 Support

For issues or questions:
- Check the [API README](./README.md)
- Review type definitions in `lib/types/index.ts`
- Use browser console: `window.testApi.runAllTests()`

---

**Author:** Victor Kimathi  
**Date:** January 2026  
**Version:** 1.0.0
