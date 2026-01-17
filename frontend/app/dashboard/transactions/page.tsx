"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowDownLeft, ArrowUpRight, Download, Search, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuthContext } from "@/lib/context/AuthContext"
import { accountApi } from "@/lib/api/accounts"
import { transactionApi } from "@/lib/api/transactions"
import { reportApi } from "@/lib/api/reports"
import { Transaction } from "@/lib/types"

export default function TransactionsPage() {
  const { user } = useAuthContext()
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user])

  const fetchTransactions = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      const accounts = await accountApi.getAccountsByUserId(user.userId)
      if (accounts.length > 0) {
        const txns = await transactionApi.getTransactionsByAccountId(accounts[0].accountId)
        setTransactions(txns)
      }
    } catch (err: any) {
      setError(err.message || "Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const blob = await reportApi.exportTransactionReport(startDate, endDate)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions-${startDate}-to-${endDate}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      alert(err.message || "Failed to export transactions")
    }
  }

  const filtered = transactions.filter((tx) => {
    const matchesFilter =
      filter === "all" || 
      (filter === "deposits" && tx.transactionType === "DEPOSIT") || 
      (filter === "withdrawals" && tx.transactionType === "WITHDRAWAL")

    const matchesSearch = searchTerm === "" || 
      tx.transactionId.toString().includes(searchTerm) ||
      tx.transactionType.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading transactions...</p>
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
                <h3 className="font-semibold text-foreground mb-1">Error Loading Transactions</h3>
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
        <h1 className="text-3xl font-bold text-foreground">Transactions</h1>
        <p className="text-foreground/60 mt-1">Manage and track your financial transactions</p>
      </div>

      <Card className="border border-border">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <Input
                placeholder="Search by transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={handleExport} className="bg-background hover:bg-muted gap-2">
              <Download className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="flex gap-2">
        {["all", "deposits", "withdrawals"].map((f) => (
          <Button
            key={f}
            onClick={() => setFilter(f)}
            variant={filter === f ? "default" : "outline"}
            className={filter === f ? "bg-primary hover:bg-primary/90" : "bg-background hover:bg-muted"}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>

      <Card className="border border-border overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date & Time</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Amount</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Balance</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-foreground/60">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filtered.map((tx, idx) => (
                    <tr
                      key={tx.transactionId}
                      className={`border-b border-border last:border-b-0 ${idx % 2 === 0 ? "bg-background" : "bg-muted/20"} hover:bg-muted/50 transition`}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground">TXN-{tx.transactionId.toString().padStart(4, '0')}</td>
                      <td className="px-6 py-4 text-sm text-foreground/70">{new Date(tx.transactionDate).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          {tx.transactionType === "DEPOSIT" ? (
                            <ArrowDownLeft className="w-4 h-4 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-amber-600" />
                          )}
                          <span className="text-foreground">{tx.transactionType}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm text-right font-semibold ${
                        tx.transactionType === "DEPOSIT" ? "text-green-600" : "text-amber-600"
                      }`}>
                        {tx.transactionType === "DEPOSIT" ? "+" : "-"}KES {tx.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-right font-medium text-foreground">
                        KES {tx.balanceAfter.toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-foreground/60">
          Showing {filtered.length} of {transactions.length} transactions
        </p>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-background hover:bg-muted">
            Previous
          </Button>
          <Button variant="outline" className="bg-background hover:bg-muted">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
