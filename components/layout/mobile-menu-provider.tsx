"use client"

import type React from "react"
import { useState, createContext, useContext, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import { X, ChevronDown } from "lucide-react"

interface MobileMenuContextType {
  isMenuOpen: boolean
  toggleMenu: () => void
}

const MobileMenuContext = createContext<MobileMenuContextType | undefined>(undefined)

export function useMobileMenu() {
  const context = useContext(MobileMenuContext)
  if (context === undefined) {
    throw new Error("useMobileMenu must be used within a MobileMenuProvider")
  }
  return context
}

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const scrollYRef = useRef(0)

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
    setExpandedGroup(null)
  }, [])

  const toggleGroup = useCallback((name: string) => {
    setExpandedGroup((prev) => (prev === name ? null : name))
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") return

    if (isMenuOpen) {
      scrollYRef.current = window.scrollY
      document.documentElement.classList.add("overflow-hidden")
      document.body.classList.add("overflow-hidden", "touch-none", "overscroll-none")
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollYRef.current}px`
      document.body.style.left = "0"
      document.body.style.right = "0"
      document.body.style.width = "100%"
    } else {
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
      <div className="flex flex-col min-h-screen">
        <MobileMenuContext.Provider value={{ isMenuOpen, toggleMenu }}>
          {children}
        </MobileMenuContext.Provider>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white z-50 lg:hidden shadow-2xl font-['Red_Hat_Display',sans-serif]
          transform transition-transform duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-end p-5">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-5">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isExpanded = expandedGroup === item.name
                const hasSubItems = !!item.subItems

                return (
                  <div key={item.name}>
                    {hasSubItems ? (
                      <>
                        <button
                          onClick={() => toggleGroup(item.name)}
                          className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-left transition-colors duration-200
                            ${isExpanded ? "text-[rgba(10,46,125,1)]" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          <span className="font-semibold text-[15px]">{item.name}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="ml-3 pl-3 border-l-2 border-gray-200 space-y-1 pb-1">
                            {item.subItems!.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                onClick={toggleMenu}
                                className="block px-3 py-2.5 rounded-lg text-gray-500 hover:text-[rgba(10,46,125,1)] hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href!}
                        onClick={toggleMenu}
                        className="block px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-semibold text-[15px]"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
