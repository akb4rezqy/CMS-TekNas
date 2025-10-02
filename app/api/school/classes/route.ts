import { getServiceSupabase } from "@/lib/supabase/admin"
import { parseJSON, ok, created, err } from "../_utils"

export async function GET() {
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase.from("classes").select("*").order("created_at", { ascending: false })
    if (error) return err(error.message, 500)
    return ok(data)
  } catch (e: any) {
    return err(e.message || "Internal error", 500)
  }
}

export async function POST(req: Request) {
  try {
    const body = await parseJSON<any>(req)
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from("classes")
      .insert({
        name: body.name,
        grade_level: body.grade_level,
      })
      .select("*")
      .single()
    if (error) return err(error.message, 500)
    return created(data)
  } catch (e: any) {
    if (e instanceof Response) return e
    return err(e.message || "Internal error", 500)
  }
}
