"use client"

import type React from "react"
import { useState, createContext, useContext, useCallback, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, Home, Newspaper, ImageIcon, Users, Trophy, Network, Phone, ChevronDown } from "lucide-react"

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
  const [logoUrl, setLogoUrl] = useState("")
  const scrollYRef = useRef(0)

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev)
    setExpandedGroup(null)
  }, [])

  const toggleGroup = useCallback((name: string) => {
    setExpandedGroup((prev) => (prev === name ? null : name))
  }, [])

  useEffect(() => {
    fetch("/api/page-settings")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data?.logoImage) {
          setLogoUrl(res.data.logoImage)
        }
      })
      .catch(() => {})
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
    { name: "Beranda", href: "/", icon: Home },
    {
      name: "Media",
      icon: Newspaper,
      subItems: [
        { name: "Pengumuman", href: "/pengumuman", icon: Newspaper },
        { name: "Galeri", href: "/galeri", icon: ImageIcon },
      ],
    },
    {
      name: "Profil",
      icon: Users,
      subItems: [
        { name: "Data Guru & Staf", href: "/guru-staf", icon: Users },
        { name: "Ekstrakurikuler", href: "/ekstrakurikuler", icon: Trophy },
        { name: "Struktur Organisasi", href: "/struktur", icon: Network },
      ],
    },
    { name: "Kontak", href: "/kontak", icon: Phone },
  ]

  return (
    <>
      <div
        className={`flex flex-col min-h-screen transition-all duration-500 ease-in-out
          ${isMenuOpen ? "scale-[0.92] rounded-2xl overflow-hidden opacity-60" : "scale-100"}`}
      >
        <MobileMenuContext.Provider value={{ isMenuOpen, toggleMenu }}>
          {children}
        </MobileMenuContext.Provider>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white z-50 lg:hidden shadow-2xl
          transform transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <Image src={logoUrl} alt="Logo" width={40} height={40} className="h-10 w-10 object-contain rounded-lg bg-gray-50 p-1" />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-[rgba(10,46,125,1)] flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SMK</span>
                </div>
              )}
              <div>
                <p className="text-gray-900 font-bold text-sm leading-tight">SMK Teknologi</p>
                <p className="text-gray-400 text-xs">Nasional</p>
              </div>
            </div>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all duration-200 active:scale-90"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <div className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isExpanded = expandedGroup === item.name
                const hasSubItems = !!item.subItems

                return (
                  <div
                    key={item.name}
                    className="transition-all duration-300"
                    style={{ transitionDelay: isMenuOpen ? `${index * 60}ms` : "0ms" }}
                  >
                    {hasSubItems ? (
                      <>
                        <button
                          onClick={() => toggleGroup(item.name)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                            ${isExpanded ? "bg-blue-50 text-[rgba(10,46,125,1)]" : "text-gray-700 hover:bg-gray-50"}`}
                        >
                          <div className={`p-2 rounded-lg transition-colors duration-200 ${isExpanded ? "bg-[rgba(10,46,125,1)] text-white" : "bg-gray-100 text-gray-500"}`}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="flex-1 font-medium text-[15px]">{item.name}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? "max-h-60 opacity-100 mt-1" : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="ml-4 pl-4 border-l-2 border-blue-100 space-y-1">
                            {item.subItems!.map((subItem) => {
                              const SubIcon = subItem.icon
                              return (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  onClick={toggleMenu}
                                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:text-[rgba(10,46,125,1)] hover:bg-blue-50 transition-all duration-200"
                                >
                                  <SubIcon className="h-4 w-4" />
                                  <span className="text-sm">{subItem.name}</span>
                                </Link>
                              )
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href!}
                        onClick={toggleMenu}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        <div className="p-2 rounded-lg bg-gray-100 text-gray-500">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-[15px]">{item.name}</span>
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          </nav>

          <div className="p-5 pt-3 border-t border-gray-100">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-900 text-sm font-medium mb-1">Hubungi Kami</p>
              <p className="text-gray-400 text-xs leading-relaxed">Punya pertanyaan? Jangan ragu untuk menghubungi kami.</p>
              <Link
                href="/kontak"
                onClick={toggleMenu}
                className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[rgba(10,46,125,1)] text-white text-sm font-semibold hover:bg-[rgba(10,46,125,0.9)] transition-all duration-200 active:scale-95"
              >
                <Phone className="h-4 w-4" />
                Hubungi Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
