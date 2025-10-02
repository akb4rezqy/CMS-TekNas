import { getServiceSupabase } from "@/lib/supabase/admin"
import { parseJSON, ok, err } from "../../_utils"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = getServiceSupabase()
    const { data, error } = await supabase.from("grades").select("*").eq("id", params.id).single()
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
      .from("grades")
      .update({
        student_id: body.student_id,
        subject_id: body.subject_id,
        score: body.score,
        graded_at: body.graded_at,
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
    const { error } = await supabase.from("grades").delete().eq("id", params.id)
    if (error) return err(error.message, 500)
    return ok({ id: params.id })
  } catch (e: any) {
    return err(e.message || "Internal error", 500)
  }
}
