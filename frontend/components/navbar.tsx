"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { TrendingUp, Menu, X, LogOut, User } from "lucide-react"
import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface NavbarProps {
  showUserMenu?: boolean
  userName?: string
}

export function Navbar({ showUserMenu = false, userName = "User" }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isAuthPage = pathname?.startsWith("/auth")

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">FinFlow</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {!isAuthPage && !showUserMenu && (
            <>
              <a href="/#features" className="text-sm text-foreground/70 hover:text-foreground transition">
                Features
              </a>
              <a href="/#benefits" className="text-sm text-foreground/70 hover:text-foreground transition">
                Benefits
              </a>
              <a href="/#pricing" className="text-sm text-foreground/70 hover:text-foreground transition">
                Pricing
              </a>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          {showUserMenu ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{userName}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="hidden sm:flex">
                <Button variant="outline" className="bg-transparent">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-accent hover:bg-accent/90">Get Started</Button>
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground hover:bg-muted rounded-lg transition"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && !isAuthPage && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-4 space-y-4">
            <a href="/#features" className="block text-sm text-foreground/70 hover:text-foreground transition">
              Features
            </a>
            <a href="/#benefits" className="block text-sm text-foreground/70 hover:text-foreground transition">
              Benefits
            </a>
            <a href="/#pricing" className="block text-sm text-foreground/70 hover:text-foreground transition">
              Pricing
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
