"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  FileText,
  Megaphone,
  Target,
  ImageIcon,
  Users,
  GraduationCap,
  Settings,
  FileEdit,
  MessageSquare,
  Network,
  BookOpen,
  ClipboardList,
  LogOut,
  UserCog,
} from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: BarChart3,
  },
  {
    title: "Konten",
    icon: FileText,
    items: [
      {
        title: "Pengumuman",
        url: "/dashboard/content/announcements",
        icon: Megaphone,
      },
      {
        title: "Ekstrakurikuler",
        url: "/dashboard/content/extracurriculars",
        icon: Target,
      },
      {
        title: "Galeri",
        url: "/dashboard/content/gallery",
        icon: ImageIcon,
      },
    ],
  },
  {
    title: "Orang",
    icon: Users,
    items: [
      {
        title: "Staff & Guru",
        url: "/dashboard/people/staff-teachers",
        icon: GraduationCap,
      },
    ],
  },
  {
    title: "Akademik",
    icon: BookOpen,
    items: [
      {
        title: "Asesmen Online",
        url: "/dashboard/akademik/asesmen",
        icon: ClipboardList,
      },
    ],
  },
  {
    title: "Komunikasi",
    icon: MessageSquare,
    items: [
      {
        title: "Pesan Masuk",
        url: "/dashboard/messages",
        icon: MessageSquare,
      },
    ],
  },
  {
    title: "Website",
    icon: Settings,
    items: [
      {
        title: "Pengaturan Halaman",
        url: "/dashboard/website/page-settings",
        icon: FileEdit,
      },
      {
        title: "Struktur Organisasi",
        url: "/dashboard/website/org-structure",
        icon: Network,
      },
    ],
  },
  {
    title: "Pengaturan",
    icon: Settings,
    items: [
      {
        title: "Manajemen Akun",
        url: "/dashboard/settings/accounts",
        icon: UserCog,
      },
    ],
  },
]

interface DashboardSidebarProps {
  onNavigate?: () => void
}

export function DashboardSidebar({ onNavigate }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-2" onClick={onNavigate}>
          <Image src="/logo-sekolah.png" alt="Logo" width={32} height={32} className="w-8 h-8 object-contain" />
          <span className="font-bold text-lg">Admin Dashboard</span>
        </Link>
      </div>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.items ? (
              <div className="mb-2">
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <item.icon className="w-4 h-4" />
                  {item.title}
                </div>
                <div className="space-y-0.5 ml-2">
                  {item.items.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.url}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                        pathname === subItem.url
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      <subItem.icon className="w-4 h-4" />
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                href={item.url!}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                  pathname === item.url
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.title}
              </Link>
            )}
          </div>
        ))}
      </nav>
      <div className="p-3 border-t">
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" })
            window.location.href = "/login"
          }}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </div>
  )
}
