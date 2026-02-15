"use client"

import useSWR from "swr"
import { Card } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"
import { useSupabaseRealtime } from "@/hooks/use-supabase-realtime"

type Staff = {
  id: string
  name: string
  position?: string | null
  role?: string | null
  subject?: string | null
  gender?: string | null
  photo_url?: string | null
  avatar_url?: string | null
}

function getDefaultAvatar(gender?: string | null) {
  return gender === "female" ? "/default-female.png" : "/default-male.jpg"
}

const fetchStaff = async (): Promise<Staff[]> => {
  const supabase = getSupabaseBrowserClient()
  const { data, error } = await supabase.from("staff_teachers").select("*").order("name", { ascending: true })
  if (error) throw error
  return data ?? []
}

export function StaffSection() {
  const { data, error, isLoading, mutate } = useSWR("landing/staff", fetchStaff)
  useSupabaseRealtime([{ table: "staff_teachers" }], () => mutate())

  return (
    <section className="w-full py-12 md:py-20 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Guru & Staf</h2>
          <p className="text-muted-foreground">Tenaga pendidik dan staf profesional</p>
        </div>

        {isLoading && <p className="text-center text-sm text-muted-foreground">Memuat data guru dan staf...</p>}
        {error && <p className="text-center text-sm text-destructive">Gagal memuat data guru dan staf.</p>}

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {(data ?? []).map((p) => (
            <Card key={p.id} className="overflow-hidden">
              <div className="aspect-square w-full bg-muted">
                <img
                  src={p.photo_url || p.avatar_url || getDefaultAvatar(p.gender)}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-medium">{p.name}</p>
                {p.position ? <p className="text-xs text-muted-foreground">{p.position}</p> : null}
                {p.role ? <p className="text-xs text-muted-foreground">{p.role}</p> : null}
                {p.subject ? <p className="text-xs text-muted-foreground">{p.subject}</p> : null}
              </div>
            </Card>
          ))}
        </div>

        {!isLoading && !error && (data?.length ?? 0) === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-6">Belum ada data guru/staf.</p>
        )}
      </div>
    </section>
  )
}
