"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime"

type Announcement = {
  id: string
  title: string
  content?: string | null
  image_url?: string | null
  created_at?: string | null
}

const fetchAnnouncements = async (): Promise<Announcement[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)
  if (error) throw error
  return data ?? []
}

export function AnnouncementsSection() {
  const { data, error, isLoading, mutate } = useSWR("landing/announcements", fetchAnnouncements)

  useSupabaseRealtime([{ table: "announcements" }], () => mutate())

  return (
    <section className="w-full py-12 md:py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Pengumuman Terbaru</h2>
          <p className="text-muted-foreground">Informasi terkini dari sekolah</p>
        </div>

        {isLoading && <p className="text-center text-sm text-muted-foreground">Memuat pengumuman...</p>}
        {error && <p className="text-center text-sm text-destructive">Gagal memuat pengumuman.</p>}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((a) => (
            <Card key={a.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="line-clamp-2">{a.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                  {/* Use placeholder when image missing */}
                  <img
                    src={
                      a.image_url ||
                      "/placeholder.svg?height=300&width=600&query=school%20announcement" ||
                      "/placeholder.svg"
                    }
                    alt={a.title || "Pengumuman"}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                {a.content ? <p className="text-sm text-muted-foreground line-clamp-3">{a.content}</p> : null}
                {a.created_at ? (
                  <p className="text-xs text-muted-foreground tabular-nums">
                    {new Date(a.created_at).toLocaleString()}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>

        {!isLoading && !error && (data?.length ?? 0) === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-6">Belum ada pengumuman.</p>
        )}
      </div>
    </section>
  )
}
