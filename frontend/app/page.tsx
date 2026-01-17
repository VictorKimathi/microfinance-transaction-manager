"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Lock, Zap, PieChart, Bell, CheckCircle2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
                Empower Your Financial Future
              </h1>
              <p className="text-lg text-foreground/70 mb-8">
                Secure microfinance management for individuals and institutions across Africa. Transform how you manage
                transactions, loans, and financial growth.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2" asChild>
                <Link href="/auth/register">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-2 bg-transparent" asChild>
                <Link href="/test-api">
                  Test API Connection
                </Link>
              </Button>
            </div>

            <div className="pt-4">
              <p className="text-sm text-foreground/60 mb-3">Trusted by 5,000+ users</p>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-semibold text-primary-foreground border-2 border-background"
                  >
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative h-96 md:h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <PieChart className="w-12 h-12 text-primary" />
                </div>
                <p className="text-foreground/70 font-semibold">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is the Platform */}
      <section className="bg-muted/30 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What is the Microfinance Transaction Manager?
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Our platform provides comprehensive financial management solutions designed specifically for microfinance
              institutions and individual borrowers. Manage accounts, loans, and transactions with confidence and
              security.
            </p>
          </div>

          <div className="bg-background rounded-lg p-8 md:p-12 border border-border shadow-sm">
            <p className="text-foreground/80 leading-relaxed mb-6">
              The Microfinance Transaction Manager is a secure, user-friendly platform built for financial institutions
              of all sizes. Whether you're running a small microfinance operation or managing thousands of accounts, our
              platform scales with your needs while maintaining the highest security standards.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              We combine modern technology with deep understanding of microfinance operations to deliver a solution
              that's both powerful and accessible to users in emerging markets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="border-2 bg-transparent">
              Request Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
          Powerful Features for Complete Control
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Lock,
              title: "Account Management",
              description:
                "Secure registration, admin verification, and balance tracking. Keep complete control of your financial profile.",
            },
            {
              icon: Zap,
              title: "Transaction Tracking",
              description:
                "Real-time deposits, withdrawals, and overdraft protection. Monitor every transaction instantly.",
            },
            {
              icon: TrendingUp,
              title: "Loan Services",
              description:
                "Quick loan requests with transparent approval process. Get the funds you need when you need them.",
            },
            {
              icon: CheckCircle2,
              title: "Repayment Management",
              description: "Flexible repayment schedules with automated tracking. Never miss a payment again.",
            },
            {
              icon: PieChart,
              title: "Mini Statements",
              description:
                "Comprehensive financial reports on demand. Access your complete transaction history anytime.",
            },
            {
              icon: Bell,
              title: "Notifications",
              description:
                "Instant alerts for approvals and account activity. Stay informed about every important event.",
            },
          ].map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card key={idx} className="border border-border hover:border-primary/50 transition-colors">
                <CardContent className="pt-8 pb-8">
                  <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Trust & Social Proof */}
      <section id="benefits" className="bg-primary text-primary-foreground py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Financial Institutions</h2>
            <p className="text-primary-foreground/90 text-lg">
              Join thousands of users who have transformed their financial management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { number: "98%", label: "Customer Satisfaction" },
              { number: "$2M+", label: "in Loans Processed" },
              { number: "5,000+", label: "Active Users" },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <p className="text-primary-foreground/90">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-6 flex-wrap">
            {["M-Pesa", "Bank Partners", "Mobile Money", "Integration"].map((partner, idx) => (
              <div
                key={idx}
                className="px-6 py-3 bg-primary-foreground/10 rounded-lg border border-primary-foreground/20 text-sm font-medium"
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-primary/5 to-accent/5 py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to transform your financial management?
          </h2>
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
            Join thousands of users managing their finances securely and efficiently with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-2 bg-transparent">
              Contact Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">FinFlow</span>
              </div>
              <p className="text-sm text-foreground/60">Secure microfinance management for Africa</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground transition">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground/60">© 2026 FinFlow. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-foreground/60">
              <button className="hover:text-foreground transition">English</button>
              <span>•</span>
              <button className="hover:text-foreground transition">High Contrast</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
