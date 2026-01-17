// ============================================
// Example Component: User Dashboard
// Demonstrates how to use the API hooks
// ============================================

"use client";

import { useEffect } from "react";
import {
  useAuth,
  useUserDashboard,
  useUserAccounts,
  useRecentTransactions,
  useActiveLoans,
  useUnreadNotifications,
  useUnreadCount,
  useDeposit,
  useRequestLoan,
} from "@/lib/hooks/useApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardExample() {
  const { user, isAuthenticated, logout } = useAuth();
  
  // Fetch dashboard data
  const { data: dashboard, loading: dashboardLoading, error: dashboardError } = 
    useUserDashboard(user?.userId || 0);
  
  // Fetch accounts
  const { data: accounts, loading: accountsLoading } = 
    useUserAccounts(user?.userId || 0);
  
  // Fetch recent transactions for first account
  const { data: transactions } = useRecentTransactions(
    accounts?.[0]?.accountId || 0,
    5
  );
  
  // Fetch active loans
  const { data: loans } = useActiveLoans(user?.userId || 0);
  
  // Fetch notifications
  const { data: notifications } = useUnreadNotifications(user?.userId || 0);
  const { count: unreadCount } = useUnreadCount(user?.userId || 0);
  
  // Mutations
  const { mutate: deposit, loading: depositLoading } = useDeposit();
  const { mutate: requestLoan, loading: loanLoading } = useRequestLoan();

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Please Login</h2>
          <Button>Go to Login</Button>
        </Card>
      </div>
    );
  }

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6 text-red-600">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{dashboardError}</p>
        </Card>
      </div>
    );
  }

  const handleDeposit = async () => {
    try {
      await deposit({
        accountId: accounts?.[0]?.accountId,
        amount: 1000,
        description: "Deposit via dashboard",
      });
      alert("Deposit successful!");
    } catch (error: any) {
      alert(`Deposit failed: ${error.message}`);
    }
  };

  const handleRequestLoan = async () => {
    try {
      await requestLoan({
        userId: user?.userId,
        amount: 10000,
        interestRate: 0.05,
        repaymentPeriodMonths: 12,
      });
      alert("Loan request submitted!");
    } catch (error: any) {
      alert(`Loan request failed: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
        <div className="flex gap-2 items-center">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            {unreadCount} Notifications
          </span>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      {/* Dashboard Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Total Balance</h3>
          <p className="text-2xl font-bold">
            KES {dashboard?.totalAccountBalance.toLocaleString()}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Accounts</h3>
          <p className="text-2xl font-bold">{dashboard?.accountCount}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Active Loans</h3>
          <p className="text-2xl font-bold">{dashboard?.activeLoans}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm text-gray-600 mb-2">Loan Balance</h3>
          <p className="text-2xl font-bold">
            KES {dashboard?.totalLoanBalance.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Accounts */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Your Accounts</h2>
        {accountsLoading ? (
          <p>Loading accounts...</p>
        ) : (
          <div className="space-y-3">
            {accounts?.map((account) => (
              <div
                key={account.accountId}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <p className="font-semibold">{account.accountType} Account</p>
                  <p className="text-sm text-gray-600">
                    Account #{account.accountId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">
                    KES {account.balance.toLocaleString()}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      account.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {account.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 flex gap-2">
          <Button onClick={handleDeposit} disabled={depositLoading}>
            {depositLoading ? "Processing..." : "Make Deposit"}
          </Button>
          <Button variant="outline">Withdraw</Button>
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="space-y-2">
          {transactions?.map((transaction) => (
            <div
              key={transaction.transactionId}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-semibold">{transaction.type}</p>
                <p className="text-sm text-gray-600">
                  {new Date(transaction.timestamp).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-500">
                  {transaction.description}
                </p>
              </div>
              <p
                className={`font-bold ${
                  transaction.type === "DEPOSIT"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "DEPOSIT" ? "+" : "-"}KES{" "}
                {transaction.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Active Loans */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Active Loans</h2>
        <div className="space-y-3">
          {loans?.map((loan) => (
            <div
              key={loan.loanId}
              className="flex justify-between items-center border-b pb-3"
            >
              <div>
                <p className="font-semibold">
                  Loan #{loan.loanId} - {loan.status}
                </p>
                <p className="text-sm text-gray-600">
                  {loan.repaymentPeriodMonths} months @{" "}
                  {(loan.interestRate * 100).toFixed(1)}% interest
                </p>
                <p className="text-xs text-gray-500">
                  Due: {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : "N/A"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">
                  KES {loan.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">
                  Balance: KES {loan.principalBalance?.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button onClick={handleRequestLoan} disabled={loanLoading}>
            {loanLoading ? "Processing..." : "Request New Loan"}
          </Button>
        </div>
      </Card>

      {/* Notifications */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Recent Notifications</h2>
        <div className="space-y-2">
          {notifications?.slice(0, 5).map((notification) => (
            <div
              key={notification.notificationId}
              className="flex justify-between items-start border-b pb-2"
            >
              <div className="flex-1">
                <p className="font-semibold">{notification.type}</p>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {new Date(notification.sentAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`ml-2 px-2 py-1 text-xs rounded ${
                  notification.status === "UNREAD"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {notification.status}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
