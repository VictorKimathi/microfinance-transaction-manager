"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Send, DollarSign, AlertCircle, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuthContext } from "@/lib/context/AuthContext"
import { accountApi } from "@/lib/api/accounts"
import { transactionApi } from "@/lib/api/transactions"
import { loanApi } from "@/lib/api/loans"
import { repaymentApi } from "@/lib/api/repayments"
import { Account, Transaction, Loan, Repayment } from "@/lib/types"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuthContext()
  const [showBalance, setShowBalance] = useState(true)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loans, setLoans] = useState<Loan[]>([])
  const [nextRepayment, setNextRepayment] = useState<Repayment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const [accountsData, loansData] = await Promise.all([
        accountApi.getAccountsByUserId(user.userId),
        loanApi.getLoansByUserId(user.userId),
      ])
      
      setAccounts(accountsData)
      setLoans(loansData.filter(l => l.status === 'ACTIVE' || l.status === 'PENDING'))
      
      if (accountsData.length > 0) {
        const txns = await transactionApi.getTransactionsByAccountId(accountsData[0].accountId)
        setTransactions(txns.slice(0, 5))
      }
      
      const activeLoans = loansData.filter(l => l.status === 'ACTIVE')
      if (activeLoans.length > 0) {
        try {
          const repayments = await repaymentApi.getRepaymentsByLoanId(activeLoans[0].loanId)
          const pending = repayments.find(r => r.status === 'PENDING')
          if (pending) setNextRepayment(pending)
        } catch (err) {
          console.error('Failed to fetch repayments:', err)
        }
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const primaryAccount = accounts[0]
  const activeLoansCount = loans.filter(l => l.status === 'ACTIVE').length
  const pendingRequestsCount = loans.filter(l => l.status === 'PENDING').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome Back, {user?.name || 'User'}</h1>
        <p className="text-foreground/60 mt-1">Here's your financial overview</p>
      </div>

      {/* Account Summary Card */}
      <Card className="border border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="pt-8 pb-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-2">Account Balance</p>
                <div className="flex items-center gap-3">
                  <p className="text-4xl font-bold text-foreground">
                    {showBalance ? `KES ${totalBalance.toLocaleString()}` : "••••••"}
                  </p>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 hover:bg-muted rounded-lg transition text-foreground/70"
                  >
                    {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-foreground/60 mb-2">Account Number</p>
                <p className="text-lg font-semibold text-foreground">
                  {primaryAccount ? `ACC-${primaryAccount.accountId.toString().padStart(6, '0')}` : 'N/A'}
                </p>
              </div>
            </div>

            {primaryAccount && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border w-fit ${
                primaryAccount.status === 'ACTIVE' 
                  ? 'bg-green-100 dark:bg-green-950/50 border-green-200 dark:border-green-900'
                  : 'bg-amber-100 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  primaryAccount.status === 'ACTIVE' ? 'bg-green-600' : 'bg-amber-600'
                }`}></div>
                <span className={`text-sm font-medium ${
                  primaryAccount.status === 'ACTIVE' 
                    ? 'text-green-900 dark:text-green-100'
                    : 'text-amber-900 dark:text-amber-100'
                }`}>{primaryAccount.status}</span>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
              <Link href="/dashboard/transactions" className="w-full">
                <Button variant="outline" className="bg-background hover:bg-muted h-12 w-full">
                  <ArrowDownLeft className="w-4 h-4 mr-2" />
                  Deposit
                </Button>
              </Link>
              <Link href="/dashboard/transactions" className="w-full">
                <Button variant="outline" className="bg-background hover:bg-muted h-12 w-full">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </Link>
              <Link href="/dashboard/loans/new" className="w-full">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 w-full">
                  <Send className="w-4 h-4 mr-2" />
                  Request Loan
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Quick Stats */}
        {[
          { label: "Total Transactions", value: transactions.length.toString(), icon: Send },
          { label: "Pending Requests", value: pendingRequestsCount.toString(), icon: AlertCircle },
          { label: "Next Repayment", value: nextRepayment ? new Date(nextRepayment.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'N/A', icon: DollarSign },
        ].map((stat, idx) => {
          const Icon = stat.icon
          return (
            <Card key={idx} className="border border-border">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Transactions */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <a href="/dashboard/transactions" className="text-sm text-primary hover:text-primary/80">
              View All
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {transactions.length === 0 ? (
              <p className="text-center py-8 text-foreground/60">No transactions yet</p>
            ) : (
              transactions.map((tx, idx) => {
                return (
                  <div
                    key={tx.transactionId}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      idx % 2 === 0 ? "bg-background" : "bg-muted/30"
                    } hover:bg-muted transition`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          tx.transactionType === "DEPOSIT" ? "bg-green-100 dark:bg-green-950/50" : "bg-amber-100 dark:bg-amber-950/50"
                        }`}
                      >
                        {tx.transactionType === "DEPOSIT" ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-amber-600" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tx.transactionType}</p>
                        <p className="text-xs text-foreground/60">{new Date(tx.transactionDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${tx.transactionType === "DEPOSIT" ? "text-green-600" : "text-amber-600"}`}>
                        {tx.transactionType === "DEPOSIT" ? "+" : "-"}KES {tx.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-foreground/60">Bal: KES {tx.balanceAfter.toLocaleString()}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Active Loans */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Active Loans</CardTitle>
            <a href="/dashboard/loans" className="text-sm text-primary hover:text-primary/80">
              View All
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loans.length === 0 ? (
              <p className="text-center py-8 text-foreground/60">No active loans</p>
            ) : (
              loans.slice(0, 2).map((loan, idx) => {
                const progress = ((loan.amount - loan.remainingBalance) / loan.amount) * 100
                return (
                  <div key={loan.loanId} className="p-4 rounded-lg bg-muted/30 hover:bg-muted transition border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">LOAN-{loan.loanId.toString().padStart(3, '0')}</p>
                        <p className="text-xs text-foreground/60">
                          KES {loan.amount.toLocaleString()} total • KES {loan.remainingBalance.toLocaleString()} remaining
                        </p>
                      </div>
                      <Link href="/dashboard/loans">
                        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground h-9 text-xs">
                          View Details
                        </Button>
                      </Link>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-background rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-foreground/60">
                        Status: {loan.status} • Progress: {progress.toFixed(0)}%
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
