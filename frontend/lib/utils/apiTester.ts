// ============================================
// API Testing Utilities
// For testing API endpoints during development
// ============================================

import {
  authApi,
  userApi,
  accountApi,
  transactionApi,
  loanApi,
  repaymentApi,
  notificationApi,
  reportApi,
} from "@/lib/api";

export class ApiTester {
  /**
   * Test authentication endpoints
   */
  static async testAuth() {
    console.log("=== Testing Authentication APIs ===");

    try {
      // Test registration
      console.log("1. Testing registration...");
      const registerData = {
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        phone: "+254712345678",
        password: "testpassword123",
      };
      const registeredUser = await authApi.register(registerData);
      console.log("✓ Registration successful:", registeredUser);

      // Test login
      console.log("2. Testing login...");
      const loginResponse = await authApi.login({
        email: registerData.email,
        password: registerData.password,
      });
      console.log("✓ Login successful:", loginResponse);

      // Test authentication check
      console.log("3. Testing authentication check...");
      const isAuth = authApi.isAuthenticated();
      console.log("✓ Is authenticated:", isAuth);

      return { success: true, userId: loginResponse.userId };
    } catch (error: any) {
      console.error("✗ Auth test failed:", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Test user management endpoints
   */
  static async testUsers(userId: number) {
    console.log("\n=== Testing User Management APIs ===");

    try {
      // Get user profile
      console.log("1. Testing get user profile...");
      const user = await userApi.getUserProfile(userId);
      console.log("✓ User profile:", user);

      // Update user profile
      console.log("2. Testing update user profile...");
      const updateResult = await userApi.updateUserProfile(userId, {
        name: "Updated Test User",
        phone: "+254712345679",
      });
      console.log("✓ Profile updated:", updateResult);

      return { success: true };
    } catch (error: any) {
      console.error("✗ User test failed:", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Test account endpoints
   */
  static async testAccounts(userId: number) {
    console.log("\n=== Testing Account APIs ===");

    try {
      // Get user accounts
      console.log("1. Testing get user accounts...");
      const accounts = await accountApi.getUserAccounts(userId);
      console.log("✓ User accounts:", accounts);

      if (accounts.length > 0) {
        const accountId = accounts[0].accountId;

        // Get single account
        console.log("2. Testing get single account...");
        const account = await accountApi.getAccount(accountId);
        console.log("✓ Single account:", account);

        // Get account balance
        console.log("3. Testing get account balance...");
        const balance = await accountApi.getAccountBalance(accountId);
        console.log("✓ Account balance:", balance);

        return { success: true, accountId };
      }

      return { success: true, accountId: null };
    } catch (error: any) {
      console.error("✗ Account test failed:", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Test transaction endpoints
   */
  static async testTransactions(accountId: number) {
    console.log("\n=== Testing Transaction APIs ===");

    try {
      // Make deposit
      console.log("1. Testing deposit...");
      const deposit = await transactionApi.deposit(
        accountId,
        1000,
        "Test deposit"
      );
      console.log("✓ Deposit successful:", deposit);

      // Get account transactions
      console.log("2. Testing get transactions...");
      const transactions = await transactionApi.getAccountTransactions(
        accountId
      );
      console.log("✓ Transactions:", transactions);

      // Get recent transactions
      console.log("3. Testing get recent transactions...");
      const recentTx = await transactionApi.getRecentTransactions(accountId, 5);
      console.log("✓ Recent transactions:", recentTx);

      return { success: true };
    } catch (error: any) {
      console.error("✗ Transaction test failed:", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Test loan endpoints
   */
  static async testLoans(userId: number) {
    console.log("\n=== Testing Loan APIs ===");

    try {
      // Request loan
      console.log("1. Testing loan request...");
      const loan = await loanApi.requestLoan({
        userId,
        amount: 10000,
        interestRate: 0.05,
        repaymentPeriodMonths: 12,
      });
      console.log("✓ Loan requested:", loan);

      // Get user loans
      console.log("2. Testing get user loans...");
      const loans = await loanApi.getUserLoans(userId);
      console.log("✓ User loans:", loans);

      // Calculate loan details
      console.log("3. Testing loan calculations...");
      const interest = loanApi.calculateLoanInterest(10000, 0.05, 12);
      const totalRepayment = loanApi.calculateTotalRepayment(10000, 0.05, 12);
      const monthlyPayment = loanApi.calculateMonthlyPayment(10000, 0.05, 12);
      console.log("✓ Loan calculations:", {
        interest,
        totalRepayment,
        monthlyPayment,
      });

      return { success: true, loanId: loan.loanId };
    } catch (error: any) {
      console.error("✗ Loan test failed:", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Test notification endpoints
   */
  static async testNotifications(userId: number) {
    console.log("\n=== Testing Notification APIs ===");

    try {
      // Get user notifications
      console.log("1. Testing get notifications...");
      const notifications = await notificationApi.getUserNotifications(userId);
      console.log("✓ Notifications:", notifications);

      // Get unread count
      console.log("2. Testing get unread count...");
      const unreadCount = await notificationApi.getUnreadCount(userId);
      console.log("✓ Unread count:", unreadCount);

      return { success: true };
    } catch (error: any) {
      console.error("✗ Notification test failed:", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Test reporting endpoints
   */
  static async testReports(userId: number, accountId: number) {
    console.log("\n=== Testing Report APIs ===");

    try {
      // Get user dashboard
      console.log("1. Testing get user dashboard...");
      const dashboard = await reportApi.getUserDashboard(userId);
      console.log("✓ User dashboard:", dashboard);

      // Get account statement
      console.log("2. Testing get account statement...");
      const statement = await reportApi.getAccountStatement(accountId);
      console.log("✓ Account statement:", statement);

      return { success: true };
    } catch (error: any) {
      console.error("✗ Report test failed:", error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Run all tests
   */
  static async runAllTests() {
    console.log("🚀 Starting comprehensive API tests...\n");

    // Test auth
    const authResult = await this.testAuth();
    if (!authResult.success) {
      console.error("⚠️ Auth tests failed. Stopping tests.");
      return;
    }

    const userId = authResult.userId!;

    // Test users
    await this.testUsers(userId);

    // Test accounts
    const accountResult = await this.testAccounts(userId);
    const accountId = accountResult.accountId;

    // Test transactions (if account exists)
    if (accountId) {
      await this.testTransactions(accountId);
    }

    // Test loans
    await this.testLoans(userId);

    // Test notifications
    await this.testNotifications(userId);

    // Test reports (if account exists)
    if (accountId) {
      await this.testReports(userId, accountId);
    }

    console.log("\n✅ All API tests completed!");
  }

  /**
   * Test API connectivity
   */
  static async testConnectivity() {
    console.log("Testing API connectivity...");
    
    try {
      await authApi.login({
        email: "test@example.com",
        password: "test",
      });
    } catch (error: any) {
      if (error.statusCode === 401) {
        console.log("✓ API is reachable (authentication failed as expected)");
        return true;
      } else if (error.statusCode === 0) {
        console.error("✗ API is unreachable (network error)");
        return false;
      }
    }
    
    return true;
  }
}

// Export a function to run tests from browser console
if (typeof window !== "undefined") {
  (window as any).testApi = ApiTester;
}
