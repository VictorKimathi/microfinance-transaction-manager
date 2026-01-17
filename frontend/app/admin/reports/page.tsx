"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { reportApi } from "@/lib/api/reports"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function ReportsPage() {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reportData, setReportData] = useState<any>(null)

  useEffect(() => {
    // Set default dates (last 30 days)
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)
    
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
  }, [])

  const fetchReport = async () => {
    if (!startDate || !endDate) return

    try {
      setLoading(true)
      setError(null)
      const data = await reportApi.getTransactionStatement(startDate, endDate)
      setReportData(data)
    } catch (err: any) {
      setError(err.message || "Failed to load report")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    if (!startDate || !endDate) return

    try {
      const blob = await reportApi.exportTransactionReport(startDate, endDate)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report-${startDate}-to-${endDate}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      alert(err.message || "Failed to export report")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading report...</p>
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
                <h3 className="font-semibold text-foreground mb-1">Error Loading Report</h3>
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
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-foreground/60 mt-1">View detailed system reports and analytics</p>
        </div>
        <Button 
          onClick={handleExport}
          disabled={!reportData}
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
        >
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Date Range Selector */}
      <Card className="border border-border">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground block mb-2">From Date</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background" 
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground block mb-2">To Date</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background" 
                />
              </div>
            </div>
            <div className="flex gap-2 md:pt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  const end = new Date()
                  const start = new Date()
                  start.setDate(start.getDate() - 30)
                  setStartDate(start.toISOString().split('T')[0])
                  setEndDate(end.toISOString().split('T')[0])
                }}
                className="bg-background hover:bg-muted"
              >
                Reset
              </Button>
              <Button 
                onClick={fetchReport}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Apply
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {reportData && (
        <>
          {/* Summary Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border border-border">
              <CardContent className="pt-6 pb-6">
                <p className="text-sm text-foreground/60 mb-2">Total Transactions</p>
                <p className="text-2xl font-bold text-foreground">{reportData.totalTransactions || 0}</p>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="pt-6 pb-6">
                <p className="text-sm text-foreground/60 mb-2">Total Amount</p>
                <p className="text-2xl font-bold text-foreground">
                  KES {((reportData.totalDeposits || 0) + (reportData.totalWithdrawals || 0)).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="pt-6 pb-6">
                <p className="text-sm text-foreground/60 mb-2">Total Deposits</p>
                <p className="text-2xl font-bold text-green-600">
                  KES {(reportData.totalDeposits || 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="pt-6 pb-6">
                <p className="text-sm text-foreground/60 mb-2">Total Withdrawals</p>
                <p className="text-2xl font-bold text-red-600">
                  KES {(reportData.totalWithdrawals || 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Transactions Table */}
          <Card className="border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Transaction Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Account</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.transactions && reportData.transactions.length > 0 ? (
                      reportData.transactions.map((txn: any, idx: number) => (
                        <tr
                          key={idx}
                          className={`border-b border-border last:border-b-0 ${idx % 2 === 0 ? "bg-background" : "bg-muted/20"}`}
                        >
                          <td className="px-6 py-4 text-sm text-foreground">
                            {new Date(txn.transactionDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">{txn.transactionType}</td>
                          <td className="px-6 py-4 text-sm text-foreground">{txn.accountId}</td>
                          <td className={`px-6 py-4 text-sm text-right font-medium ${
                            txn.transactionType === 'DEPOSIT' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            KES {txn.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm text-foreground">
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-950/50 text-green-600 rounded text-xs">
                              {txn.status || 'Completed'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-foreground/60">
                          No transactions found for this date range
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {!reportData && (
        <Card className="border border-border">
          <CardContent className="py-12 text-center">
            <p className="text-foreground/60">Select a date range and click Apply to generate report</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
