"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, CheckCircle, XCircle, Clock, User, AlertCircle } from "lucide-react"
import { userApi, loanApi } from "@/lib/api"
import type { User as UserType, Loan } from "@/lib/types"

export default function ApprovalsPage() {
  const [filter, setFilter] = useState("users")
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<UserType[]>([])
  const [loans, setLoans] = useState<Loan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [pendingUsers, pendingLoans] = await Promise.all([
        userApi.getPendingApprovals(),
        loanApi.getPendingLoans()
      ])
      setUsers(pendingUsers.users || [])
      setLoans(pendingLoans || [])
    } catch (err: any) {
      setError(err.message || "Failed to load approvals")
    } finally {
      setLoading(false)
    }
  }

  const handleApproveUser = async (userId: number) => {
    try {
      setActionLoading(`user-${userId}`)
      await userApi.approveUser(userId, { status: "ACTIVE" as any })
      await fetchData()
    } catch (err: any) {
      alert(err.message || "Failed to approve user")
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectUser = async (userId: number) => {
    const reason = prompt("Enter rejection reason:")
    if (!reason) return

    try {
      setActionLoading(`user-${userId}`)
      await userApi.rejectUser(userId, reason)
      await fetchData()
    } catch (err: any) {
      alert(err.message || "Failed to reject user")
    } finally {
      setActionLoading(null)
    }
  }

  const handleApproveLoan = async (loanId: number, amount: number) => {
    try {
      setActionLoading(`loan-${loanId}`)
      await loanApi.approveLoan(loanId, {
        approvedAmount: amount,
        approvalNotes: "Approved by admin"
      })
      await fetchData()
    } catch (err: any) {
      alert(err.message || "Failed to approve loan")
    } finally {
      setActionLoading(null)
    }
  }

  const handleRejectLoan = async (loanId: number) => {
    const reason = prompt("Enter rejection reason:")
    if (!reason) return

    try {
      setActionLoading(`loan-${loanId}`)
      await loanApi.rejectLoan(loanId, { rejectionReason: reason })
      await fetchData()
    } catch (err: any) {
      alert(err.message || "Failed to reject loan")
    } finally {
      setActionLoading(null)
    }
  }

  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.includes(searchTerm)
  )

  const filteredLoans = loans.filter(
    (l) => searchTerm === "" || l.loanId.toString().includes(searchTerm)
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading approvals...</p>
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
                <h3 className="font-semibold text-foreground mb-1">Error Loading Approvals</h3>
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Approvals Management</h1>
        <p className="text-foreground/60 mt-1">Review and approve pending registrations and loan requests</p>
      </div>

      <Card className="border border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <Input 
                placeholder="Search by name, email or ID..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex gap-2">
        {[
          { label: `Users (${users.length})`, value: "users" },
          { label: `Loans (${loans.length})`, value: "loans" },
        ].map((f) => (
          <Button
            key={f.value}
            onClick={() => setFilter(f.value)}
            variant={filter === f.value ? "default" : "outline"}
            className={filter === f.value ? "bg-primary hover:bg-primary/90" : "bg-background hover:bg-muted"}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {/* User Approvals */}
      {filter === "users" && (
        <div className="space-y-4">
          {filteredUsers.length === 0 ? (
            <Card className="border border-border">
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-foreground/60">No pending user approvals</p>
              </CardContent>
            </Card>
          ) : (
            filteredUsers.map((user) => (
              <Card key={user.userId} className="border border-border hover:border-primary/50 transition">
                <CardContent className="pt-6 pb-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
                          <p className="text-sm text-foreground/60">User Registration</p>
                          <p className="text-sm text-foreground/60 mt-1">{user.email}</p>
                          <p className="text-sm text-foreground/60">{user.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-900">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-medium text-amber-900 dark:text-amber-100">{user.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                      <div>
                        <p className="text-xs text-foreground/50 mb-1">User ID</p>
                        <p className="text-sm font-medium text-foreground">USR-{user.userId.toString().padStart(3, '0')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/50 mb-1">Registration Date</p>
                        <p className="text-sm font-medium text-foreground">
                          {new Date(user.registrationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => handleApproveUser(user.userId)}
                        disabled={actionLoading === `user-${user.userId}`}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {actionLoading === `user-${user.userId}` ? (
                          "Processing..."
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleRejectUser(user.userId)}
                        disabled={actionLoading === `user-${user.userId}`}
                        variant="outline"
                        className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Loan Approvals */}
      {filter === "loans" && (
        <div className="space-y-4">
          {filteredLoans.length === 0 ? (
            <Card className="border border-border">
              <CardContent className="py-12 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <p className="text-foreground/60">No pending loan approvals</p>
              </CardContent>
            </Card>
          ) : (
            filteredLoans.map((loan) => (
              <Card key={loan.loanId} className="border border-border hover:border-primary/50 transition">
                <CardContent className="pt-6 pb-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">Loan Request</h3>
                          <p className="text-sm text-foreground/60">User ID: {loan.userId}</p>
                          <p className="text-sm font-semibold text-primary mt-1">
                            KES {loan.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-950/50 rounded-lg border border-amber-200 dark:border-amber-900">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="text-xs font-medium text-amber-900 dark:text-amber-100">{loan.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                      <div>
                        <p className="text-xs text-foreground/50 mb-1">Loan ID</p>
                        <p className="text-sm font-medium text-foreground">LOAN-{loan.loanId.toString().padStart(3, '0')}</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/50 mb-1">Interest Rate</p>
                        <p className="text-sm font-medium text-foreground">{(loan.interestRate * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/50 mb-1">Period</p>
                        <p className="text-sm font-medium text-foreground">{loan.repaymentPeriodMonths} months</p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        onClick={() => handleApproveLoan(loan.loanId, loan.amount)}
                        disabled={actionLoading === `loan-${loan.loanId}`}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {actionLoading === `loan-${loan.loanId}` ? (
                          "Processing..."
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleRejectLoan(loan.loanId)}
                        disabled={actionLoading === `loan-${loan.loanId}`}
                        variant="outline"
                        className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
