"use client"

import Link from "next/link"
import Image from "next/image"
import { Mountain, Menu } from "lucide-react"
import { useMobileMenu } from "./mobile-menu-provider"
import { useState, useEffect } from "react"

export function Header() {
  const { toggleMenu } = useMobileMenu()
  const [isScrolled, setIsScrolled] = useState(false)
  const [logoUrl, setLogoUrl] = useState("")

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
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
    <header
      className={`sticky top-0 inset-x-0 z-50 px-4 lg:px-6 h-14 flex items-center justify-between border-b transition-all duration-300
    ${isScrolled ? "bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg" : "bg-background"}`}
    >
      <Link href="/" className="flex items-center gap-2 group">
        {logoUrl ? (
          <Image src={logoUrl} alt="Logo" width={32} height={32} className="h-8 w-8 object-contain group-hover:scale-110 transition-transform duration-200" />
        ) : (
          <Mountain className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-200" />
        )}
        <span className="text-lg font-semibold group-hover:text-primary transition-colors duration-200">
          SMK TEKNOLOGI NASIONAL
        </span>
      </Link>

      {/* Desktop Navigation (Muncul di layar besar) */}
      <nav className="hidden lg:flex gap-6 ml-auto">
        {navItems.map((item) =>
          item.subItems ? (
            <div key={item.name} className="relative group">
              <span className="text-sm font-medium hover:text-primary transition-colors duration-200 cursor-pointer relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full">
                {item.name}
              </span>
              <div className="absolute left-0 top-full mt-2 w-48 bg-background shadow-xl rounded-md py-2 z-40 border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    className="block px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 hover:translate-x-1"
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
              className="text-sm font-medium hover:text-primary transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.name}
            </Link>
          ),
        )}
      </nav>

      {/* Tombol Menu Toggle (Hanya muncul di layar kecil) */}
      <button
        className="p-2 rounded-md text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring lg:hidden transition-all duration-200 hover:scale-110 active:scale-95"
        onClick={toggleMenu}
        aria-label="Toggle navigation"
      >
        <Menu className="h-6 w-6" />
      </button>
    </header>
  )
}
