"use client"

import type React from "react"
import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[280px] bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar onNavigate={() => setSidebarOpen(false)} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="text-sm font-medium">Admin Panel</span>
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
