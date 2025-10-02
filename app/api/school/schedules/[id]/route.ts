import { getServiceSupabase } from "@/lib/supabase/admin"
import { parseJSON, ok, err } from "../../_utils"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase.from("schedules").select("*").eq("id", params.id).single()
    if (error) return err(error.message, 404)
    return ok(data)
  } catch (e: any) {
    return err(e.message || "Internal error", 500)
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await parseJSON<any>(req)
    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from("schedules")
      .update({
        class_id: body.class_id,
        subject_id: body.subject_id,
        teacher_id: body.teacher_id ?? null,
        day_of_week: body.day_of_week,
        start_time: body.start_time,
        end_time: body.end_time,
      })
      .eq("id", params.id)
      .select("*")
      .single()
    if (error) return err(error.message, 500)
    return ok(data)
  } catch (e: any) {
    if (e instanceof Response) return e
    return err(e.message || "Internal error", 500)
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getServiceSupabase()
    const { error } = await supabase.from("schedules").delete().eq("id", params.id)
    if (error) return err(error.message, 500)
    return ok({ id: params.id })
  } catch (e: any) {
    return err(e.message || "Internal error", 500)
  }
}
