"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuthContext } from "@/lib/context/AuthContext"
import { reportApi } from "@/lib/api/reports"

export default function StatementsPage() {
  const { user } = useAuthContext()
  const [selectedPeriod, setSelectedPeriod] = useState("30")
  const [loading, setLoading] = useState(false)

  const periods = [
    { label: "Last 30 Days", value: "30" },
    { label: "Last 60 Days", value: "60" },
    { label: "Last 90 Days", value: "90" },
    { label: "Last 6 Months", value: "180" },
  ]

  const handleDownload = async () => {
    try {
      setLoading(true)
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - Number.parseInt(selectedPeriod))
      
      const blob = await reportApi.exportTransactionReport(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      )
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `statement-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      alert(err.message || "Failed to download statement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mini Statements</h1>
        <p className="text-foreground/60 mt-1">Download your financial statements</p>
      </div>

      <Card className="border border-border bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="pt-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground block mb-2">Select Period</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
              >
                {periods.map((period) => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
            <Button 
              onClick={handleDownload}
              disabled={loading}
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 h-10"
            >
              <Download className="w-4 h-4" />
              {loading ? "Downloading..." : "Download PDF"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {periods.map((period, idx) => (
          <Card key={idx} className="border border-border hover:border-primary/50 transition">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{period.label}</h3>
                    <p className="text-sm text-foreground/60">
                      Transaction statement for the selected period
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    setSelectedPeriod(period.value)
                    handleDownload()
                  }}
                  disabled={loading}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
