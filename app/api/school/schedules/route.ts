import { getServiceSupabase } from "@/lib/supabase/admin"
import { parseJSON, ok, created, err } from "../_utils"

export async function GET() {
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase.from("schedules").select("*").order("created_at", { ascending: false })
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
      .from("schedules")
      .insert({
        class_id: body.class_id,
        subject_id: body.subject_id,
        teacher_id: body.teacher_id ?? null,
        day_of_week: body.day_of_week,
        start_time: body.start_time,
        end_time: body.end_time,
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
