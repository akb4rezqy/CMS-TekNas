"use client"

import Link from "next/link"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { MobileMenuProvider } from "@/components/layout/mobile-menu-provider"

export default function NotFound() {
  return (
    <MobileMenuProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="text-center space-y-4">
            <h1 className="text-8xl sm:text-9xl font-black text-primary/80 tracking-tight">
              404
            </h1>
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground">
              Halaman Tidak Ditemukan
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.
            </p>
            <div className="pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MobileMenuProvider>
  )
}
