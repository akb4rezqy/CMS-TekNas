"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime"

type GalleryItem = {
  id: string
  title?: string | null
  image_url?: string | null
  created_at?: string | null
}

const fetchGallery = async (): Promise<GalleryItem[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.from("gallery").select("*").order("created_at", { ascending: false }).limit(6)
  if (error) throw error
  return data ?? []
}

export function GallerySection() {
  const { data, error, isLoading, mutate } = useSWR("landing/gallery", fetchGallery)
  useSupabaseRealtime([{ table: "gallery" }], () => mutate())

  return (
    <section className="w-full py-12 md:py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Galeri</h2>
          <p className="text-muted-foreground">Momen kegiatan dan fasilitas sekolah</p>
        </div>

        {isLoading && <p className="text-center text-sm text-muted-foreground">Memuat galeri...</p>}
        {error && <p className="text-center text-sm text-destructive">Gagal memuat galeri.</p>}

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {(data ?? []).map((g) => (
            <Card key={g.id} className="overflow-hidden">
              <img
                src={
                  g.image_url || "/placeholder.svg?height=240&width=360&query=school%20gallery" || "/placeholder.svg"
                }
                alt={g.title || "Galeri sekolah"}
                className="h-48 w-full object-cover"
                crossOrigin="anonymous"
              />
              {g.title ? (
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-1">{g.title}</p>
                </div>
              ) : null}
            </Card>
          ))}
        </div>

        {!isLoading && !error && (data?.length ?? 0) === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-6">Belum ada foto di galeri.</p>
        )}
      </div>
    </section>
  )
}
