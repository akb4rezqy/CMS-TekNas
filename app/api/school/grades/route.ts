import { getServiceSupabase } from "@/lib/supabase/admin"
import { parseJSON, ok, created, err } from "../_utils"

export async function GET() {
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase.from("grades").select("*").order("created_at", { ascending: false })
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
      .from("grades")
      .insert({
        student_id: body.student_id,
        subject_id: body.subject_id,
        score: body.score,
        graded_at: body.graded_at ?? new Date().toISOString().slice(0, 10),
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
