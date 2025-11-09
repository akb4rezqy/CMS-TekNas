"use client"

import { useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/browser"

type TableSubscription = {
  table: string
  schema?: string
  event?: "INSERT" | "UPDATE" | "DELETE" | "*"
}

export function useSupabaseRealtime(tables: TableSubscription[], onChange: () => void) {
  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    // One channel for multiple tables
    const channel = supabase.channel(`realtime:${tables.map((t) => t.table).join(",")}`)

    tables.forEach((t) => {
      channel.on(
        "postgres_changes",
        {
          event: t.event ?? "*",
          schema: t.schema ?? "public",
          table: t.table,
        },
        () => {
          onChange()
        },
      )
    })

    channel.subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(tables)])
}
