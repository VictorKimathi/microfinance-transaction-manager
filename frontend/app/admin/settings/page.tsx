"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Save } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [systemSettings, setSystemSettings] = useState({
    platformName: "FinFlow",
    minLoanAmount: 10000,
    maxLoanAmount: 500000,
    interestRate: 12,
  })

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: "",
    smtpPort: 587,
    fromEmail: "",
  })

  const [saving, setSaving] = useState(false)

  const handleSaveSystemSettings = async () => {
    setSaving(true)
    // In a real app, this would call an API
    setTimeout(() => {
      setSaving(false)
      alert("System settings saved successfully")
    }, 1000)
  }

  const handleSaveEmailSettings = async () => {
    setSaving(true)
    // In a real app, this would call an API
    setTimeout(() => {
      setSaving(false)
      alert("Email settings saved successfully")
    }, 1000)
  }

  const handleTestEmailConnection = async () => {
    alert("Testing email connection...")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-foreground/60 mt-1">Configure system settings and parameters</p>
      </div>

      {/* System Configuration */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Platform Name</label>
            <Input 
              value={systemSettings.platformName}
              onChange={(e) => setSystemSettings({...systemSettings, platformName: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Minimum Loan Amount (KES)</label>
            <Input 
              type="number" 
              value={systemSettings.minLoanAmount}
              onChange={(e) => setSystemSettings({...systemSettings, minLoanAmount: Number(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Maximum Loan Amount (KES)</label>
            <Input 
              type="number" 
              value={systemSettings.maxLoanAmount}
              onChange={(e) => setSystemSettings({...systemSettings, maxLoanAmount: Number(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Interest Rate (% per annum)</label>
            <Input 
              type="number" 
              step="0.1" 
              value={systemSettings.interestRate}
              onChange={(e) => setSystemSettings({...systemSettings, interestRate: Number(e.target.value)})}
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button 
              onClick={handleSaveSystemSettings}
              disabled={saving}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setSystemSettings({
                platformName: "FinFlow",
                minLoanAmount: 10000,
                maxLoanAmount: 500000,
                interestRate: 12,
              })}
              className="bg-background hover:bg-muted"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email Configuration */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">SMTP Server</label>
            <Input 
              placeholder="smtp.example.com"
              value={emailSettings.smtpServer}
              onChange={(e) => setEmailSettings({...emailSettings, smtpServer: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">SMTP Port</label>
            <Input 
              type="number" 
              placeholder="587"
              value={emailSettings.smtpPort}
              onChange={(e) => setEmailSettings({...emailSettings, smtpPort: Number(e.target.value)})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">From Email Address</label>
            <Input 
              placeholder="noreply@finflow.com"
              value={emailSettings.fromEmail}
              onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button 
              onClick={handleSaveEmailSettings}
              disabled={saving}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTestEmailConnection}
              className="bg-background hover:bg-muted"
            >
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
            <p className="text-sm text-foreground mb-3">
              Dangerous actions that may affect system data and user experience. Use with caution.
            </p>
            <div className="space-y-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm("Are you sure you want to clear system cache?")) {
                    alert("System cache cleared")
                  }
                }}
                className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
              >
                Clear System Cache
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm("Are you sure you want to reset all statistics?")) {
                    alert("Statistics reset")
                  }
                }}
                className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
              >
                Reset All Statistics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
