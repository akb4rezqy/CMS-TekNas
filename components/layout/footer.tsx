"use client"

import Link from "next/link"
import Image from "next/image"
import { Mountain, Instagram, Mail, Phone, MapPin, Youtube } from "lucide-react"
import { useState, useEffect } from "react"

export function Footer() {
  const [logoUrl, setLogoUrl] = useState("")

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
    { name: "Pengumuman", href: "/pengumuman" },
    { name: "Galeri", href: "/galeri" },
    { name: "Data Guru & Staf", href: "/guru-staf" },
    { name: "Ekstrakurikuler", href: "/ekstrakurikuler" },
    { name: "Struktur Organisasi", href: "/struktur" },
    { name: "Kontak", href: "/kontak" },
  ]

  return (
    <footer className="bg-background text-foreground py-8 md:py-12 border-t">
      <div className="container px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Section 1: School Name & Description */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            {logoUrl ? (
              <Image src={logoUrl} alt="Logo" width={32} height={32} className="h-8 w-8 object-contain" />
            ) : (
              <Mountain className="h-8 w-8 text-primary" />
            )}
            <span className="text-xl font-bold">SMK TEKNOLOGI NASIONAL</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Membentuk generasi teknologi unggul melalui pendidikan vokasi yang inovatif dan berkualitas tinggi.
          </p>
          <div className="flex gap-4 mt-4">
            <Link href="#" aria-label="YouTube">
              <Youtube className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="#" aria-label="Instagram">
              <Instagram className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>

        {/* Section 2: Navigation Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Halaman</h3>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-primary hover:underline underline-offset-4 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Section 3: Contact Information */}
        <div className="space-y-4 md:col-span-1 lg:col-span-1">
          <h3 className="text-lg font-semibold">Kontak Kami</h3>
          <div className="space-y-2 text-muted-foreground text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 flex-shrink-0 text-primary" />
              <p>
                Jl. Irigasi Baru II Jl. Irigasi Persada Baru No.52, RT.004/RW.014, Bekasi Jaya, Kec. Bekasi Tim., Kota
                Bks, Jawa Barat 17112
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 flex-shrink-0 text-primary" />
              <p>(021) 8816961</p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 flex-shrink-0 text-primary" />
              <p>info@smkteknasional.sch.id</p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="container px-4 md:px-6 mt-8 pt-4 border-t border-border text-center">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} SMK TEKNOLOGI NASIONAL. Hak Cipta Dilindungi.
        </p>
      </div>
    </footer>
  )
}
