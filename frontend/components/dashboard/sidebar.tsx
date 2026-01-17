"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight, LayoutDashboard, Send, PiggyBank, FileText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const links = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/dashboard/transactions", icon: Send, label: "Transactions" },
    { href: "/dashboard/loans", icon: PiggyBank, label: "Loans" },
    { href: "/dashboard/statements", icon: FileText, label: "Statements" },
    { href: "/dashboard/profile", icon: Settings, label: "Profile" },
  ]

  return (
    <aside
      className={cn(
        "border-r border-border bg-background transition-all duration-300 ease-in-out fixed md:relative top-16 md:top-0 left-0 h-[calc(100vh-4rem)] md:h-screen",
        open ? "w-64" : "w-20",
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border hidden md:flex">
          {open && <span className="font-semibold text-foreground text-sm">Navigation</span>}
          <button
            onClick={onToggle}
            className="p-1 hover:bg-muted rounded-lg transition text-foreground/70"
            aria-label="Toggle sidebar"
          >
            {open ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted",
                )}
                title={link.label}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {open && <span>{link.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border">
          {open && <p className="text-xs text-foreground/50">© 2026 FinFlow. All rights reserved.</p>}
        </div>
      </div>
    </aside>
  )
}
