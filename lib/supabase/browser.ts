import { createBrowserClient } from "@supabase/ssr"

let supabaseBrowserClient: ReturnType<typeof createBrowserClient<any, "public">> | null = null

export function getSupabaseBrowserClient() {
  if (!supabaseBrowserClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !anonKey) {
      throw new Error("Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
    }
    supabaseBrowserClient = createBrowserClient(url, anonKey)
  }
  return supabaseBrowserClient
}
