"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { withLayout } from "@/components/hoc/with-layout"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

function HomePage() {
  const heroAnimation = useScrollAnimation(0.1)
  const sambutanAnimation = useScrollAnimation(0.2)
  const profilAnimation = useScrollAnimation(0.2)
  const ctaAnimation = useScrollAnimation(0.2)

  return (
    <>
      {/* Hero Section */}
      <section
        ref={heroAnimation.ref}
        className={`relative w-full h-screen flex items-center justify-center transition-all duration-1000 ${
          heroAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {/* Background Image */}
        <Image
          src="/placeholder.svg?height=1080&width=1920&text=Students+Learning"
          fill
          alt="Students learning in classroom"
          className="object-cover"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 container px-4 md:px-6 text-center text-white">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-6xl xl:text-7xl animate-fade-in-up">
              Masa Depan Teknologi Dimulai di SMK TEKNOLOGI NASIONAL
            </h1>
            <p className="max-w-[800px] text-xl md:text-2xl mx-auto text-gray-200 animate-fade-in-up animation-delay-200">
              Kami berkomitmen untuk membentuk generasi teknologi unggul melalui pendidikan vokasi yang inovatif dan
              lingkungan belajar yang inspiratif.
            </p>
            <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center mt-8 animate-fade-in-up animation-delay-400">
              <Link
                href="#cta"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-10 text-lg font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Daftar Sekarang
              </Link>
              <Link
                href="#profil-sekolah"
                className="inline-flex h-12 items-center justify-center rounded-md border-2 border-white bg-transparent px-10 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:bg-white hover:text-foreground hover:scale-105 hover:shadow-xl active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Jelajahi Program
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sambutan Kepala Sekolah Section */}
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
              <p className="text-lg leading-relaxed text-white">Assalamu'alaikum Warahmatullahi Wabarakatuh.</p>
              <p className="leading-relaxed text-white">
                Dengan rasa syukur dan bangga, saya menyambut Anda di website resmi SMK TEKNOLOGI NASIONAL. Kami
                berkomitmen untuk menyediakan lingkungan belajar teknologi yang inspiratif dan kondusif, di mana setiap
                siswa dapat mengembangkan potensi teknis, inovasi, dan keterampilan industri 4.0.
              </p>
              <p className="leading-relaxed text-white">
                Kami percaya bahwa pendidikan teknologi adalah kunci masa depan Indonesia. Oleh karena itu, kami terus
                berinovasi dalam kurikulum vokasi, fasilitas laboratorium, dan metode pembelajaran praktis untuk
                mempersiapkan generasi teknisi yang kompeten, berkarakter, dan siap menghadapi tantangan industri
                global.
              </p>
              <p className="text-lg font-semibold text-white">Bapak Budi Santoso, S.Pd.</p>
              <p className="text-white tabular-nums text-sm font-light">Kepala SMK TEKNOLOGI NASIONAL</p>
            </div>
          </div>
        </div>
      </section>

      {/* Profil Sekolah (Visi & Misi) Section */}
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
                <p>
                  Menjadi sekolah menengah kejuruan teknologi terdepan yang menghasilkan lulusan kompeten, inovatif,
                  berkarakter mulia, dan siap bersaing di era industri 4.0.
                </p>
              </CardContent>
            </Card>
            <Card className="flex flex-col p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl font-bold">Misi</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-muted-foreground">
                <ul className="list-disc list-inside space-y-2">
                  <li>Menyelenggarakan pendidikan vokasi teknologi berkualitas yang berorientasi pada industri.</li>
                  <li>Membentuk karakter siswa yang religius, mandiri, dan berjiwa technopreneurship.</li>
                  <li>Mengembangkan kompetensi teknis dan soft skills siswa secara optimal.</li>
                  <li>Menciptakan lingkungan belajar yang aman, nyaman, dan berbasis teknologi terkini.</li>
                  <li>Membangun kemitraan strategis dengan industri, orang tua, dan masyarakat.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final Call-to-Action Section */}
      <section
        ref={ctaAnimation.ref}
        id="cta"
        className={`w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground transition-all duration-1000 ${
          ctaAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Siap Bergabung dengan Keluarga SMK TEKNOLOGI NASIONAL?
            </h2>
            <p className="mx-auto max-w-[600px] md:text-xl lg:text-base xl:text-xl">
              Daftarkan putra-putri Anda sekarang dan berikan mereka pendidikan teknologi vokasi terbaik untuk masa
              depan yang cerah.
            </p>
          </div>
          <div className="flex justify-center">
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md px-8 text-sm font-medium text-secondary-foreground shadow transition-all duration-300 hover:bg-secondary/90 hover:scale-105 hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-blue-100"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default withLayout(HomePage)
