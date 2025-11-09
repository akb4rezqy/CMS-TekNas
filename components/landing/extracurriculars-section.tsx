"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime"

type Extracurricular = {
  id: string
  name: string
  description?: string | null
  icon_url?: string | null
}

const fetchExtracurriculars = async (): Promise<Extracurricular[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.from("extracurriculars").select("*").order("name", { ascending: true })
  if (error) throw error
  return data ?? []
}

export function ExtracurricularsSection() {
  const { data, error, isLoading, mutate } = useSWR("landing/extracurriculars", fetchExtracurriculars)
  useSupabaseRealtime([{ table: "extracurriculars" }], () => mutate())

  return (
    <section className="w-full py-12 md:py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Ekstrakurikuler</h2>
          <p className="text-muted-foreground">Kembangkan minat dan bakat di berbagai kegiatan</p>
        </div>

        {isLoading && <p className="text-center text-sm text-muted-foreground">Memuat ekstrakurikuler...</p>}
        {error && <p className="text-center text-sm text-destructive">Gagal memuat ekstrakurikuler.</p>}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(data ?? []).map((e) => (
            <Card key={e.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{e.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="aspect-video w-full overflow-hidden rounded-md bg-muted">
                  <img
                    src={
                      e.icon_url || "/placeholder.svg?height=300&width=600&query=school%20club" || "/placeholder.svg"
                    }
                    alt={e.name}
                    className="h-full w-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
                {e.description ? <p className="text-sm text-muted-foreground line-clamp-3">{e.description}</p> : null}
              </CardContent>
            </Card>
          ))}
        </div>

        {!isLoading && !error && (data?.length ?? 0) === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-6">Belum ada data ekstrakurikuler.</p>
        )}
      </div>
    </section>
  )
}
