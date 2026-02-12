"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAnnouncements } from "@/hooks/useApi"
import { CalendarDays, ArrowRight, Loader2 } from "lucide-react"
import { withLayout } from "@/components/hoc/with-layout"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

function PengumumanPage() {
  const { announcements, loading, error } = useAnnouncements()

  const headerAnimation = useScrollAnimation(0.1)
  const contentAnimation = useScrollAnimation(0.05)

  if (error) {
    return (
      <div className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Pengumuman Terbaru</h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
                Dapatkan informasi dan berita penting terbaru dari SMK Teknologi Nasional.
              </p>
            </div>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Terjadi Kesalahan</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div
          ref={headerAnimation.ref}
          className={`flex flex-col items-center justify-center space-y-4 text-center mb-12 transition-all duration-1000 ${
            headerAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Pengumuman Terbaru</h1>
            <p className="max-w-[900px] text-muted-foreground md:text-xl lg:text-base xl:text-xl">
              Dapatkan informasi dan berita penting terbaru dari SMK Teknologi Nasional.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Memuat pengumuman...</span>
          </div>
        ) : announcements.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Belum Ada Pengumuman</h2>
              <p className="text-muted-foreground mb-6">
                Saat ini belum ada pengumuman yang tersedia. Silakan kembali lagi nanti.
              </p>
              <Link href="/">
                <Button>Kembali ke Beranda</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div
            ref={contentAnimation.ref}
            className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-700 ${
              contentAnimation.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {announcements.map((announcement, index) => (
              <Card
                key={announcement.id}
                className="flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Placeholder image */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=200&width=300&text=Pengumuman"
                    width={300}
                    height={200}
                    alt={announcement.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <CardHeader className="flex-1">
                  <CardTitle className="line-clamp-2 text-lg leading-tight group-hover:text-primary transition-colors duration-300">
                    {announcement.title}
                  </CardTitle>
                  <CardDescription className="flex items-center text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {new Date(announcement.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1">
                  {/* Extract text from HTML content for preview */}
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {announcement.content.replace(/<[^>]*>/g, "").substring(0, 150)}...
                  </p>
                </CardContent>

                <div className="p-6 pt-0">
                  <Link href={`/pengumuman/${announcement.id}`} passHref>
                    <Button className="w-full group/button">
                      Baca Selengkapnya
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/button:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const WrappedPengumumanPage = withLayout(PengumumanPage)
export default WrappedPengumumanPage
