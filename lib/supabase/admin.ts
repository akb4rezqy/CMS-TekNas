import { createClient } from "@supabase/supabase-js"

let serviceClient: ReturnType<typeof createClient> | null = null

export function getServiceSupabase() {
  if (serviceClient) return serviceClient
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  }
  serviceClient = createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
  return serviceClient
}
