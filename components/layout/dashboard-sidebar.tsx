"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
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
} from "lucide-react"

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
    title: "Website",
    icon: Settings,
    items: [
      {
        title: "Pengaturan Halaman",
        url: "/dashboard/website/page-settings",
        icon: FileEdit,
      },
    ],
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  console.log("[v0] Current pathname:", pathname)

  return (
    <Sidebar className="w-[280px] border-r">
      <SidebarHeader className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SHB</span>
          </div>
          <span className="font-bold text-lg">Admin Dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.items ? (
                <SidebarGroup>
                  <SidebarGroupLabel className="flex items-center gap-2 px-2 py-2">
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {item.items.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild isActive={pathname === subItem.url}>
                            <Link
                              href={subItem.url}
                              className="flex items-center gap-2"
                              onClick={() => console.log("[v0] Navigating to:", subItem.url)}
                            >
                              <subItem.icon className="w-4 h-4" />
                              {subItem.title}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ) : (
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <Link
                    href={item.url}
                    className="flex items-center gap-2"
                    onClick={() => console.log("[v0] Navigating to:", item.url)}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}
