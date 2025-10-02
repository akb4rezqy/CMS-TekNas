"use client"

import { useParams, useRouter } from "next/navigation"
import { useAnnouncements } from "@/hooks/useApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CalendarDays, Clock, Share2 } from "lucide-react"
import Link from "next/link"
import { withLayout } from "@/components/hoc/with-layout"

function AnnouncementDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { announcements, error } = useAnnouncements()

  const announcement = announcements.find((a) => a.id === Number(id))

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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link pengumuman telah disalin ke clipboard!")
    }
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        {/* Navigation */}
        <div className="mb-8">
          <Button onClick={() => router.back()} variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>

          {/* Breadcrumb */}
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

        {/* Announcement Header */}
        <Card className="mb-8">
          <CardHeader className="pb-6">
            <div className="space-y-4">
              <CardTitle className="text-3xl md:text-4xl font-bold leading-tight">{announcement.title}</CardTitle>

              {/* Announcement Meta */}
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

              {/* Share Button */}
              <div className="flex justify-end">
                <Button onClick={handleShare} variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Bagikan
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Announcement Content */}
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
              dangerouslySetInnerHTML={{ __html: announcement.content }}
            />
          </CardContent>
        </Card>

        {/* Related Announcements or Call to Action */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">Ingin membaca pengumuman lainnya?</h3>
              <p className="text-muted-foreground mb-6">
                Temukan lebih banyak pengumuman penting dari Sekolah Harapan Bangsa
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/pengumuman">
                  <Button>Lihat Semua Pengumuman</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Kembali ke Beranda</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default withLayout(AnnouncementDetailPage)
