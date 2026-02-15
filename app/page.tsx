"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { withLayout } from "@/components/hoc/with-layout"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { CalendarDays, ArrowRight } from "lucide-react"

interface PageSettings {
  heroTitle: string
  heroSubtitle: string
  heroPrimaryButtonText: string
  heroSecondaryButtonText: string
  heroBackgroundImage: string
  logoImage: string
  principalName: string
  principalTitle: string
  principalWelcomeText: string
  principalMessage1: string
  principalMessage2: string
  schoolVision: string
  schoolMissions: string[]
  ctaTitle: string
  ctaSubtitle: string
  ctaButtonText: string
  siteTitle: string
  siteDescription: string
}

interface Announcement {
  id: string
  title: string
  content: string
  image_url?: string | null
  created_at: string
}

const DEFAULTS: PageSettings = {
  heroTitle: "Masa Depan Teknologi Dimulai di SMK TEKNOLOGI NASIONAL",
  heroSubtitle:
    "Kami berkomitmen untuk membentuk generasi teknologi unggul melalui pendidikan vokasi yang inovatif dan lingkungan belajar yang inspiratif.",
  heroPrimaryButtonText: "Daftar Sekarang",
  heroSecondaryButtonText: "Jelajahi Program",
  heroBackgroundImage: "",
  logoImage: "",
  principalName: "Bapak Budi Santoso, S.Pd.",
  principalTitle: "Kepala SMK TEKNOLOGI NASIONAL",
  principalWelcomeText: "Assalamu'alaikum Warahmatullahi Wabarakatuh.",
  principalMessage1:
    "Dengan rasa syukur dan bangga, saya menyambut Anda di website resmi SMK TEKNOLOGI NASIONAL. Kami berkomitmen untuk menyediakan lingkungan belajar teknologi yang inspiratif dan kondusif, di mana setiap siswa dapat mengembangkan potensi teknis, inovasi, dan keterampilan industri 4.0.",
  principalMessage2:
    "Kami percaya bahwa pendidikan teknologi adalah kunci masa depan Indonesia. Oleh karena itu, kami terus berinovasi dalam kurikulum vokasi, fasilitas laboratorium, dan metode pembelajaran praktis untuk mempersiapkan generasi teknisi yang kompeten, berkarakter, dan siap menghadapi tantangan industri global.",
  schoolVision:
    "Menjadi sekolah menengah kejuruan teknologi terdepan yang menghasilkan lulusan kompeten, inovatif, berkarakter mulia, dan siap bersaing di era industri 4.0.",
  schoolMissions: [
    "Menyelenggarakan pendidikan vokasi teknologi berkualitas yang berorientasi pada industri.",
    "Membentuk karakter siswa yang religius, mandiri, dan berjiwa technopreneurship.",
    "Mengembangkan kompetensi teknis dan soft skills siswa secara optimal.",
    "Menciptakan lingkungan belajar yang aman, nyaman, dan berbasis teknologi terkini.",
    "Membangun kemitraan strategis dengan industri, orang tua, dan masyarakat.",
  ],
  ctaTitle: "Siap Bergabung dengan Keluarga SMK TEKNOLOGI NASIONAL?",
  ctaSubtitle:
    "Daftarkan putra-putri Anda sekarang dan berikan mereka pendidikan teknologi vokasi terbaik untuk masa depan yang cerah.",
  ctaButtonText: "Daftar Sekarang",
  siteTitle: "SMK TEKNOLOGI NASIONAL",
  siteDescription: "Sekolah menengah kejuruan teknologi terdepan yang menghasilkan generasi unggul untuk industri 4.0",
}

function HomePage() {
  const [s, setS] = useState<PageSettings>(DEFAULTS)
  const [latestAnnouncements, setLatestAnnouncements] = useState<Announcement[]>([])

  const heroAnimation = useScrollAnimation(0.1)
  const sambutanAnimation = useScrollAnimation(0.2)

  const profilAnimation = useScrollAnimation(0.2)
  const ctaAnimation = useScrollAnimation(0.2)

  useEffect(() => {
    fetch("/api/page-settings")
      .then((r) => r.json())
      .then((result) => {
        if (result.success && result.data) {
          setS({ ...DEFAULTS, ...result.data })
        }
      })
      .catch(() => {})

    fetch("/api/announcements/latest")
      .then((r) => r.json())
      .then((result) => {
        if (result.success && result.data) {
          setLatestAnnouncements(result.data)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <>
      <section
        ref={heroAnimation.ref}
        className={`relative w-full h-screen flex items-center justify-center transition-all duration-1000 ${
          heroAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {s.heroBackgroundImage ? (
          <Image
            src={s.heroBackgroundImage}
            fill
            alt="Hero background"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 via-slate-600 to-slate-800" />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative z-10 container px-4 md:px-6 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl animate-fade-in-up">
              {s.heroTitle}
            </h1>
            <p className="max-w-[800px] text-xl md:text-2xl mx-auto text-gray-200 animate-fade-in-up animation-delay-200">
              {s.heroSubtitle}
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center mt-8 animate-fade-in-up animation-delay-400">
              <Link
                href="#cta"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-10 text-lg font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                {s.heroPrimaryButtonText}
              </Link>
              <Link
                href="#profil-sekolah"
                className="inline-flex h-12 items-center justify-center rounded-md border-2 border-white bg-transparent px-10 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:bg-white hover:text-foreground hover:scale-105 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                {s.heroSecondaryButtonText}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={sambutanAnimation.ref}
        id="sambutan-kepala-sekolah"
        className={`w-full py-12 md:py-24 lg:py-32 bg-[rgba(10,46,125,1)] transition-all duration-1000 ${
          sambutanAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Sambutan Kepala Sekolah</h2>
              <p className="max-w-[900px] md:text-xl lg:text-base xl:text-xl text-white">
                Selamat datang di SMK TEKNOLOGI NASIONAL. Mari bersama membangun masa depan teknologi Indonesia.
              </p>
            </div>
          </div>
          <div className="mx-auto max-w-4xl py-12 grid md:grid-cols-2 gap-8 items-center">
            <div className="flex justify-center">
              <Image
                src="/placeholder.svg?height=300&width=300&text=Kepala+Sekolah"
                width={300}
                height={300}
                alt="Kepala Sekolah"
                className="rounded-full object-cover aspect-square shadow-lg transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="text-center md:text-left space-y-4">
              <p className="text-lg leading-relaxed text-white">{s.principalWelcomeText}</p>
              <p className="leading-relaxed text-white">{s.principalMessage1}</p>
              <p className="leading-relaxed text-white">{s.principalMessage2}</p>
              <p className="text-lg font-semibold text-white">{s.principalName}</p>
              <p className="text-white tabular-nums text-sm font-light">{s.principalTitle}</p>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={profilAnimation.ref}
        id="profil-sekolah"
        className={`w-full py-12 md:py-24 lg:py-32 bg-background transition-all duration-1000 ${
          profilAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Profil Sekolah</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                Mengenal lebih dalam tentang visi, misi, dan tujuan pendidikan teknologi vokasi kami.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:grid-cols-2 py-12">
            <Card className="flex flex-col p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold">Visi</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-muted-foreground">
                <p>{s.schoolVision}</p>
              </CardContent>
            </Card>
            <Card className="flex flex-col p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold">Misi</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-muted-foreground">
                <ul className="list-disc list-inside space-y-2">
                  {s.schoolMissions.map((mission, idx) => (
                    <li key={idx}>{mission}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {latestAnnouncements.length > 0 && (
        <section
          ref={ctaAnimation.ref}
          className={`w-full py-12 md:py-24 lg:py-32 bg-muted/50 transition-all duration-1000 ${
            ctaAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Pengumuman Terbaru</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                  Informasi dan berita penting terbaru dari SMK Teknologi Nasional.
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestAnnouncements.map((ann) => (
                <Link key={ann.id} href={`/pengumuman/${ann.id}`}>
                  <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                    <CardContent className="p-4">
                      <CardTitle className="line-clamp-1 text-base leading-tight group-hover:text-primary transition-colors mb-2">
                        {ann.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {ann.content.replace(/<[^>]*>/g, "").substring(0, 100)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          {new Date(ann.created_at).toLocaleDateString("id-ID", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center text-primary text-xs font-medium group-hover:gap-1 transition-all">
                          Selengkapnya
                          <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link
                href="/pengumuman"
                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Lihat Semua Pengumuman
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default withLayout(HomePage)
