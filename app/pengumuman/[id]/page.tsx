"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { useAnnouncements } from "@/hooks/useApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CalendarDays, Clock, Share2, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { withLayout } from "@/components/hoc/with-layout"

function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*\S+/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<iframe[\s\S]*?\/>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?\/?>[\s\S]*?(<\/embed>)?/gi, "")
    .replace(/<form[\s\S]*?<\/form>/gi, "")
}

interface LatestAnnouncement {
  id: string
  title: string
  content: string
  image_url?: string | null
  created_at: string
}

function AnnouncementDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { announcements, loading, error } = useAnnouncements()
  const [latestAnnouncements, setLatestAnnouncements] = useState<LatestAnnouncement[]>([])

  const announcement = announcements.find((a) => String(a.id) === String(id))

  useEffect(() => {
    fetch("/api/announcements/latest")
      .then((r) => r.json())
      .then((result) => {
        if (result.success && result.data) {
          setLatestAnnouncements(result.data.filter((a: any) => String(a.id) !== String(id)))
        }
      })
      .catch(() => {})
  }, [id])

  if (loading) {
    return (
      <div className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mr-3" />
          <span>Memuat pengumuman...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-destructive mb-4">Terjadi Kesalahan</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!announcement) {
    return (
      <div className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Pengumuman Tidak Ditemukan</h2>
              <p className="text-muted-foreground mb-6">Maaf, pengumuman yang Anda cari tidak dapat ditemukan.</p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => router.back()} variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
                <Link href="/pengumuman">
                  <Button>Lihat Semua Pengumuman</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: announcement.title,
          text: `Baca pengumuman: ${announcement.title}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link pengumuman telah disalin ke clipboard!")
    }
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <div className="mb-8">
          <Button onClick={() => router.back()} variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>

          <nav className="text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Beranda
            </Link>
            <span className="mx-2">/</span>
            <Link href="/pengumuman" className="hover:text-foreground">
              Pengumuman
            </Link>
            <span className="mx-2">/</span>
            <span className="text-foreground">{announcement.title}</span>
          </nav>
        </div>

        {announcement.image_url && (
          <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <Image
              src={announcement.image_url}
              fill
              alt={announcement.title}
              className="object-cover"
            />
          </div>
        )}

        <Card className="mb-8">
          <CardHeader className="pb-6">
            <div className="space-y-4">
              <CardTitle className="text-3xl md:text-4xl font-bold leading-tight">{announcement.title}</CardTitle>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  <span>
                    Dipublikasikan:{" "}
                    {new Date(announcement.created_at).toLocaleDateString("id-ID", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                {announcement.updated_at !== announcement.created_at && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>
                      Diperbarui:{" "}
                      {new Date(announcement.updated_at).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button onClick={handleShare} variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Bagikan
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card>
          <CardContent className="p-8">
            <div
              className="prose prose-lg max-w-none
                prose-headings:text-foreground 
                prose-p:text-foreground 
                prose-strong:text-foreground
                prose-a:text-primary hover:prose-a:text-primary/80
                prose-blockquote:border-l-primary
                prose-blockquote:text-muted-foreground
                prose-code:text-primary
                prose-pre:bg-muted
                prose-img:rounded-lg
                prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(announcement.content) }}
            />
          </CardContent>
        </Card>

        {latestAnnouncements.length > 0 && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold mb-6">Pengumuman Lainnya</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestAnnouncements.slice(0, 3).map((ann) => (
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
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <Link href="/pengumuman">
            <Button variant="outline">Lihat Semua Pengumuman</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default withLayout(AnnouncementDetailPage)
