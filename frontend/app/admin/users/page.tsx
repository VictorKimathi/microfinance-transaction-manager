"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MoreVertical, CheckCircle, Clock, Ban, AlertCircle } from "lucide-react"
import { useState, Suspense, useEffect } from "react"
import { userApi } from "@/lib/api/users"
import { accountApi } from "@/lib/api/accounts"
import { User } from "@/lib/types"

function UsersContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [userBalances, setUserBalances] = useState<Record<number, number>>({})

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await userApi.getAllUsers()
      const usersList = data.users || []
      setUsers(usersList)
      
      // Fetch balances for each user
      const balances: Record<number, number> = {}
      await Promise.all(
        usersList.map(async (user) => {
          try {
            const accounts = await accountApi.getAccountsByUserId(user.userId)
            balances[user.userId] = accounts.reduce((sum, acc) => sum + acc.balance, 0)
          } catch (err) {
            balances[user.userId] = 0
          }
        })
      )
      setUserBalances(balances)
    } catch (err: any) {
      setError(err.message || "Failed to load users")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSuspendUser = async (userId: number) => {
    try {
      setActionLoading(userId)
      await userApi.suspendUser(userId)
      await fetchUsers()
    } catch (err: any) {
      alert(err.message || "Failed to suspend user")
    } finally {
      setActionLoading(null)
    }
  }

  const handleActivateUser = async (userId: number) => {
    try {
      setActionLoading(userId)
      await userApi.reactivateUser(userId)
      await fetchUsers()
    } catch (err: any) {
      alert(err.message || "Failed to activate user")
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = Array.isArray(users) ? users.filter(
    (u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  ) : []

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading users...</p>
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
                <h3 className="font-semibold text-foreground mb-1">Error Loading Users</h3>
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
        <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
        <p className="text-foreground/60 mt-1">Manage all platform users and their accounts</p>
      </div>

      <Card className="border border-border">
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      <Card className="border border-border overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Join Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Balance</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, idx) => (
                  <tr
                    key={user.userId}
                    className={`border-b border-border last:border-b-0 ${idx % 2 === 0 ? "bg-background" : "bg-muted/20"} hover:bg-muted/50 transition`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground/70">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {user.status === "ACTIVE" ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : user.status === "PENDING" ? (
                          <Clock className="w-4 h-4 text-amber-600" />
                        ) : (
                          <Ban className="w-4 h-4 text-red-600" />
                        )}
                        <span className="text-foreground">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {new Date(user.registrationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      KES {(userBalances[user.userId] || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        {user.status === "ACTIVE" && (
                          <Button
                            onClick={() => handleSuspendUser(user.userId)}
                            disabled={actionLoading === user.userId}
                            variant="outline"
                            size="sm"
                            className="border-destructive text-destructive hover:bg-destructive/10"
                          >
                            {actionLoading === user.userId ? "..." : "Suspend"}
                          </Button>
                        )}
                        {user.status === "SUSPENDED" && (
                          <Button
                            onClick={() => handleActivateUser(user.userId)}
                            disabled={actionLoading === user.userId}
                            variant="outline"
                            size="sm"
                            className="border-green-600 text-green-600 hover:bg-green-600/10"
                          >
                            {actionLoading === user.userId ? "..." : "Activate"}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function UsersPage() {
  return (
    <Suspense fallback={null}>
      <UsersContent />
    </Suspense>
  )
}
