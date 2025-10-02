"use client"

import type React from "react"
import { useState, createContext, useContext, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { X } from "lucide-react"

// Definisikan tipe konteks
interface MobileMenuContextType {
  isMenuOpen: boolean
  toggleMenu: () => void
}

// Buat konteks
const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined)

// Custom hook untuk menggunakan konteks
export function useMobileMenu() {
  const context = useContext(MobileMenuContext)
  if (context === undefined) {
    throw new Error("useMobileMenu must be used within a MobileMenuProvider")
  }
  return context
}

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const scrollYRef = useRef(0)

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    if (isMenuOpen) {
      // Simpan posisi saat ini lalu kunci scroll
      scrollYRef.current = window.scrollY
      document.documentElement.classList.add("overflow-hidden")
      document.body.classList.add("overflow-hidden", "touch-none", "overscroll-none")
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollYRef.current}px`
      document.body.style.left = "0"
      document.body.style.right = "0"
      document.body.style.width = "100%"
    } else {
      // Pulihkan
      document.documentElement.classList.remove("overflow-hidden")
      document.body.classList.remove("overflow-hidden", "touch-none", "overscroll-none")
      const y = Math.abs(Number.parseInt(document.body.style.top || "0", 10)) || 0
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.width = ""
      if (y) window.scrollTo(0, y)
    }

    // Cleanup jika komponen unmount saat menu terbuka
    return () => {
      document.documentElement.classList.remove("overflow-hidden")
      document.body.classList.remove("overflow-hidden", "touch-none", "overscroll-none")
      const y = Math.abs(Number.parseInt(document.body.style.top || "0", 10)) || 0
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.width = ""
      if (y) window.scrollTo(0, y)
    }
  }, [isMenuOpen])

  const navItems = [
    { name: "Beranda", href: "/" },
    {
      name: "Media",
      subItems: [
        { name: "Pengumuman", href: "/pengumuman" },
        { name: "Galeri", href: "/galeri" },
      ],
    },
    {
      name: "Profil",
      subItems: [
        { name: "Data Guru & Staf", href: "/guru-staf" },
        { name: "Ekstrakurikuler", href: "/ekstrakurikuler" },
        { name: "Struktur Organisasi", href: "/struktur" },
      ],
    },
    { name: "Kontak", href: "/kontak" },
  ]

  return (
    <>
      {/* Wrapper untuk semua konten (Header, main, Footer) yang akan di-blur */}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out
          ${isMenuOpen ? "filter blur-sm pointer-events-none" : ""}`}
      >
        {/* MobileMenuContext.Provider sekarang membungkus children */}
        <MobileMenuContext.Provider value={{ isMenuOpen, toggleMenu }}>
          {children} {/* Ini akan merender Header, main, dan Footer */}
        </MobileMenuContext.Provider>
      </div>

      {/* Menu Mobile Mengambang (di luar wrapper blur) */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xs bg-background shadow-lg py-2 z-50 border-l border-border lg:hidden
          transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={toggleMenu}
            className="p-2 rounded-md text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex flex-col p-4 pt-0">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) =>
              item.subItems ? (
                <div key={item.name} className="flex flex-col">
                  <span className="text-lg font-semibold text-foreground mb-2">{item.name}</span>
                  <div className="flex flex-col pl-4 gap-2">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="text-base text-muted-foreground hover:text-foreground"
                        onClick={toggleMenu}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-lg font-semibold text-foreground"
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              ),
            )}
          </nav>
        </div>
      </div>
      {/* Overlay saat menu mobile terbuka */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        ></div>
      )}
    </>
  )
}
