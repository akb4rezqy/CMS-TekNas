"use client"

import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
      <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                    <DashboardSidebar />
                            <main className="flex-1 p-6">{children}</main>
                                  </div>
                                      </SidebarProvider>
                                        )
                                        }
