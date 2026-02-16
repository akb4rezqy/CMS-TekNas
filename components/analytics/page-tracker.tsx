"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function PageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/login")) return

    const timer = setTimeout(() => {
      fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page: pathname,
          referrer: document.referrer || null,
        }),
      }).catch(() => {})
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname])

  return null
}
