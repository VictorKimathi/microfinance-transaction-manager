"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User, Lock, Bell, Shield } from "lucide-react"
import { useState, useEffect } from "react"
import { useAuthContext } from "@/lib/context/AuthContext"

export default function ProfilePage() {
  const { user } = useAuthContext()
  const [activeTab, setActiveTab] = useState("personal")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.name,
        email: user.email,
        phone: user.phone,
      })
    }
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = () => {
    // In a real app, this would call the userApi.updateUserProfile
    alert("Profile updated successfully!")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-foreground/60 mt-1">Manage your account information and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border pb-0">
        {[
          { id: "personal", label: "Personal Info", icon: User },
          { id: "security", label: "Security", icon: Lock },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "privacy", label: "Privacy", icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition -mb-px ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-foreground/60 hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Personal Info Tab */}
      {activeTab === "personal" && (
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input name="fullName" value={formData.fullName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email Address</label>
                <Input name="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone Number</label>
                <Input name="phone" value={formData.phone} onChange={handleChange} />
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleSave}>
                Save Changes
              </Button>
              <Button variant="outline" className="bg-background hover:bg-muted">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Change Password</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Current Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">New Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Confirm Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-6">
              <h4 className="font-semibold text-foreground mb-4">Two-Factor Authentication</h4>
              <p className="text-sm text-foreground/60 mb-4">Add an extra layer of security to your account</p>
              <Button variant="outline" className="bg-background hover:bg-muted">
                Enable 2FA
              </Button>
            </div>
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Update Password</Button>
              <Button variant="outline" className="bg-background hover:bg-muted">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { title: "Transaction Alerts", description: "Get notified for deposits, withdrawals, and transfers" },
              { title: "Loan Notifications", description: "Updates on loan requests, approvals, and repayments" },
              { title: "Account Updates", description: "Important account and security related notifications" },
              { title: "Promotional Offers", description: "New features and special offers" },
            ].map((notif, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/20 border border-border/30"
              >
                <div>
                  <p className="font-medium text-foreground">{notif.title}</p>
                  <p className="text-sm text-foreground/60">{notif.description}</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-primary" />
              </div>
            ))}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Preferences</Button>
              <Button variant="outline" className="bg-background hover:bg-muted">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Tab */}
      {activeTab === "privacy" && (
        <Card className="border border-border">
          <CardHeader>
            <CardTitle>Privacy Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              {
                title: "Profile Visibility",
                description: "Control who can see your profile information",
                options: ["Private", "Friends Only", "Public"],
              },
              {
                title: "Transaction History",
                description: "Who can view your transaction history",
                options: ["Only Me", "Authorized Users", "Support Staff"],
              },
            ].map((setting, idx) => (
              <div key={idx} className="space-y-3 pb-4 border-b border-border last:border-b-0 last:pb-0">
                <div>
                  <p className="font-medium text-foreground">{setting.title}</p>
                  <p className="text-sm text-foreground/60">{setting.description}</p>
                </div>
                <select className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary/50 outline-none">
                  {setting.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Save Privacy Settings</Button>
              <Button variant="outline" className="bg-background hover:bg-muted">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
