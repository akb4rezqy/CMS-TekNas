"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const pathMap: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/content/announcements": "Pengumuman",
  "/dashboard/content/extracurriculars": "Ekstrakurikuler",
  "/dashboard/content/gallery": "Galeri",
  "/dashboard/people/staff-teachers": "Staff & Guru",
  "/dashboard/website/page-settings": "Pengaturan Halaman",
}

export function DashboardHeader() {
  const pathname = usePathname()
  const currentPage = pathMap[pathname] || "Dashboard"

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs = []

    if (segments.length > 1) {
      breadcrumbs.push({ title: "Dashboard", href: "/dashboard" })

      if (segments[1] === "content") {
        breadcrumbs.push({ title: "Konten", href: "#" })
      } else if (segments[1] === "people") {
        breadcrumbs.push({ title: "Orang", href: "#" })
      } else if (segments[1] === "website") {
        breadcrumbs.push({ title: "Website", href: "#" })
      }

      breadcrumbs.push({ title: currentPage, href: pathname })
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.length > 0 ? (
            breadcrumbs.map((breadcrumb, index) => (
              <div key={breadcrumb.href} className="flex items-center gap-2">
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{breadcrumb.title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.title}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </div>
            ))
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="ml-auto flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">Admin</span>
      </div>
    </header>
  )
}
