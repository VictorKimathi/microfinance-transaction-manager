"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, CheckCircle, Clock, TrendingUp, AlertCircle } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { reportApi } from "@/lib/api"
import type { AdminDashboard as AdminDashboardType } from "@/lib/types"

const chartData = [
  { month: "Jan", loans: 45, users: 120, revenue: 24000 },
  { month: "Feb", loans: 52, users: 145, revenue: 28500 },
  { month: "Mar", loans: 38, users: 110, revenue: 21000 },
  { month: "Apr", loans: 61, users: 180, revenue: 33500 },
  { month: "May", loans: 55, users: 160, revenue: 30000 },
  { month: "Jun", loans: 71, users: 220, revenue: 39000 },
]

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState<AdminDashboardType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await reportApi.getAdminDashboard()
        setDashboard(data)
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Error Loading Dashboard</h3>
                <p className="text-sm text-foreground/60">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const metrics = [
    { 
      label: "Total Users", 
      value: dashboard?.totalUsers?.toLocaleString() || "0", 
      icon: Users, 
      trend: "+12%" 
    },
    { 
      label: "Active Loans", 
      value: dashboard?.activeLoans?.toLocaleString() || "0", 
      icon: CheckCircle, 
      trend: "+8%" 
    },
    { 
      label: "Pending Approvals", 
      value: dashboard?.pendingApprovals?.toLocaleString() || "0", 
      icon: Clock, 
      trend: "-5%" 
    },
    { 
      label: "Total Disbursed", 
      value: `KES ${(dashboard?.totalDisbursed || 0).toLocaleString()}`, 
      icon: TrendingUp, 
      trend: "+24%" 
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-foreground/60 mt-1">Manage users, approvals, and monitor system performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <Card key={idx} className="border border-border">
              <CardContent className="pt-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                    <p className="text-xs text-green-600 mt-2">{metric.trend} from last month</p>
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

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Loans Chart */}
        <Card className="border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Loans Issued This Period</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-foreground)" opacity={0.7} />
                <YAxis stroke="var(--color-foreground)" opacity={0.7} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-background)",
                    border: `1px solid var(--color-border)`,
                  }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Legend />
                <Bar dataKey="loans" fill="var(--color-primary)" name="Loans" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card className="border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-foreground)" opacity={0.7} />
                <YAxis stroke="var(--color-foreground)" opacity={0.7} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-background)",
                    border: `1px solid var(--color-border)`,
                  }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-accent)"
                  name="Revenue (KES)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-accent)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card className="border border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle>Recent Pending Approvals</CardTitle>
            <a href="/admin/approvals" className="text-sm text-primary hover:text-primary/80">
              View All
            </a>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                id: "REG-001",
                name: "Grace Mwangi",
                date: "12 Jan 2026",
                type: "User Registration",
                status: "Pending",
              },
              {
                id: "LOAN-042",
                name: "David Kipchoge",
                date: "11 Jan 2026",
                type: "Loan Request",
                amount: "KES 100,000",
                status: "Under Review",
              },
            ].map((approval, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-muted/30 hover:bg-muted transition border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{approval.name}</p>
                        <p className="text-xs text-foreground/60">
                          {approval.type}
                          {approval.amount ? ` • ${approval.amount}` : ""}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-foreground/50">{approval.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        approval.status === "Pending"
                          ? "bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-100"
                          : "bg-blue-100 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100"
                      }`}
                    >
                      {approval.status}
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-green-600 hover:bg-green-700 h-8 text-xs text-white">Approve</Button>
                      <Button variant="outline" className="bg-background hover:bg-muted h-8 text-xs">
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
