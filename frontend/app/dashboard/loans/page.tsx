"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Clock, DollarSign, TrendingUp, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuthContext } from "@/lib/context/AuthContext"
import { loanApi } from "@/lib/api/loans"
import { Loan } from "@/lib/types"
import Link from "next/link"

export default function LoansPage() {
  const { user } = useAuthContext()
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchLoans()
    }
  }, [user])

  const fetchLoans = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const data = await loanApi.getLoansByUserId(user.userId)
      setLoans(data)
    } catch (err: any) {
      setError(err.message || "Failed to load loans")
    } finally {
      setLoading(false)
    }
  }

  const totalBorrowed = loans.reduce((sum, loan) => sum + loan.amount, 0)
  const totalRepaid = loans.reduce((sum, loan) => sum + (loan.amount - loan.remainingBalance), 0)
  const activeLoansCount = loans.filter(l => l.status === 'ACTIVE').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading loans...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Error Loading Loans</h3>
                <p className="text-sm text-foreground/60">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Loans</h1>
          <p className="text-foreground/60 mt-1">Manage your active and past loans</p>
        </div>
        <Link href="/dashboard/loans/new">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <TrendingUp className="w-4 h-4 mr-2" />
            Request New Loan
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { label: "Total Borrowed", value: `KES ${totalBorrowed.toLocaleString()}`, icon: DollarSign },
          { label: "Total Repaid", value: `KES ${totalRepaid.toLocaleString()}`, icon: CheckCircle2 },
          { label: "Active Loans", value: activeLoansCount.toString(), icon: Clock },
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

      <div className="space-y-4">
        {loans.length === 0 ? (
          <Card className="border border-border">
            <CardContent className="py-12 text-center">
              <p className="text-foreground/60">No loans yet. Request your first loan to get started!</p>
              <Link href="/dashboard/loans/new" className="mt-4 inline-block">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Request Loan
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          loans.map((loan, idx) => {
            const progress = ((loan.amount - loan.remainingBalance) / loan.amount) * 100
            const isCompleted = loan.status === 'PAID'

            return (
              <Card key={loan.loanId} className="border border-border hover:border-primary/50 transition">
                <CardContent className="pt-6 pb-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground/60">Loan Request</p>
                        <h3 className="text-lg font-semibold text-foreground mt-1">LOAN-{loan.loanId.toString().padStart(3, '0')}</h3>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                          isCompleted ? "bg-green-100 dark:bg-green-950/50" : 
                          loan.status === 'PENDING' ? "bg-amber-100 dark:bg-amber-950/50" :
                          "bg-blue-100 dark:bg-blue-950/50"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : loan.status === 'PENDING' ? (
                          <Clock className="w-4 h-4 text-amber-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-blue-600" />
                        )}
                        <span
                        className={`text-xs font-semibold ${
                          isCompleted ? "text-green-900 dark:text-green-100" : "text-blue-900 dark:text-blue-100"
                        }`}
                      >
                        {loan.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm p-4 bg-muted/20 rounded-lg border border-border/30">
                    <div>
                      <p className="text-foreground/60 mb-1">Loan Amount</p>
                      <p className="font-semibold text-foreground">KES {loan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 mb-1">Remaining</p>
                      <p className="font-semibold text-foreground">KES {loan.remainingBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 mb-1">Interest Rate</p>
                      <p className="font-semibold text-foreground">{(loan.interestRate * 100).toFixed(1)}% p.a.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground/60">Repayment Progress</span>
                      <span className="font-semibold text-foreground">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden border border-border">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <p className="text-xs text-foreground/60">
                      Applied: {new Date(loan.applicationDate).toLocaleDateString()} • Period: {loan.repaymentPeriodMonths} months
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })
        )}
      </div>
    </div>
  )
}
