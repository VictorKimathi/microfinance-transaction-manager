"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useAuthContext } from "@/lib/context/AuthContext"
import { loanApi } from "@/lib/api/loans"
import { useRouter } from "next/navigation"

export default function NewLoanPage() {
  const { user } = useAuthContext()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    amount: 50000,
    purpose: "business-expansion",
    period: "12",
    notes: "",
  })

  const interestRate = 0.12 // 12% annual rate
  const monthlyRate = interestRate / 12
  const numPayments = Number.parseInt(formData.period)
  const monthlyPayment = (formData.amount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                         (Math.pow(1 + monthlyRate, numPayments) - 1)
  const totalWithInterest = monthlyPayment * numPayments

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
      setStep(2)
    } else {
      if (!user) {
        alert("Please log in to request a loan")
        return
      }

      try {
        setLoading(true)
        await loanApi.applyForLoan({
          userId: user.userId,
          amount: formData.amount,
          interestRate: interestRate,
          repaymentPeriodMonths: Number.parseInt(formData.period),
        })
        alert("Loan request submitted successfully! Please wait for admin approval.")
        router.push("/dashboard/loans")
      } catch (err: any) {
        alert(err.message || "Failed to submit loan request")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/dashboard/loans"
        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Loans
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-foreground">Request a New Loan</h1>
        <p className="text-foreground/60 mt-1">Complete the form below to apply for a loan</p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-4 my-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-4">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-foreground/60"
              }`}
            >
              {s}
            </div>
            {s === 1 && <p className={step >= 1 ? "text-foreground" : "text-foreground/60"}>Loan Details</p>}
            {s === 2 && <p className={step >= 2 ? "text-foreground" : "text-foreground/60"}>Review & Confirm</p>}
            {s < 2 && <div className={`h-1 w-8 ${step > s ? "bg-primary" : "bg-muted"}`}></div>}
          </div>
        ))}
      </div>

      {/* Step 1: Loan Details */}
      {step === 1 && (
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Loan Amount */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Loan Amount (KES)</label>
                <div className="space-y-2">
                  <Input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="10000"
                    max="500000"
                  />
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={formData.amount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number.parseInt(e.target.value) }))}
                    className="w-full accent-primary"
                  />
                  <p className="text-xs text-foreground/60">Range: KES 10,000 - 500,000</p>
                </div>
              </div>

              {/* Purpose */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Purpose of Loan</label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  <option value="business-expansion">Business Expansion</option>
                  <option value="equipment">Equipment Purchase</option>
                  <option value="working-capital">Working Capital</option>
                  <option value="education">Education</option>
                  <option value="personal">Personal Use</option>
                </select>
              </div>

              {/* Repayment Period */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Repayment Period (Months)</label>
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Additional Information</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Tell us more about your loan request..."
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 outline-none resize-none h-24"
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Link href="/dashboard/loans">
                  <Button variant="outline" className="bg-background hover:bg-muted">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1">
                  Continue to Review
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Review & Confirm */}
      {step === 2 && (
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Review Your Application</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Summary */}
              <div className="space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">Loan Amount</p>
                  <p className="font-semibold text-foreground">KES {(formData.amount / 1000).toFixed(0)}k</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">Interest Rate</p>
                  <p className="font-semibold text-foreground">12% per annum</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground/70">Repayment Period</p>
                  <p className="font-semibold text-foreground">{formData.period} months</p>
                </div>
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <p className="text-foreground">Monthly Payment</p>
                  <p className="font-bold text-lg text-primary">KES {Math.round(monthlyPayment).toLocaleString()}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-foreground">Total with Interest</p>
                  <p className="font-bold text-lg text-accent">KES {Math.round(totalWithInterest).toLocaleString()}</p>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                <input type="checkbox" defaultChecked className="mt-1 w-4 h-4 rounded accent-primary" />
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  I have read and agree to the loan terms and conditions
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="bg-background hover:bg-muted flex-1"
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
