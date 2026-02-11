import { getServiceSupabase } from "@/lib/supabase/admin"

export interface StaffTeacher {
  id: string
  name: string
  position: string
  description: string
  created_at: string
  updated_at: string
}

export class StaffTeachersService {
  static async getAll(): Promise<{ data: StaffTeacher[]; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("staff_teachers")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) return { data: [], success: false, error: error.message }
      return { data: data as StaffTeacher[], success: true }
    } catch (error) {
      return { data: [], success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async create(
    input: Omit<StaffTeacher, "id" | "created_at" | "updated_at">,
  ): Promise<{ data?: StaffTeacher; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("staff_teachers")
        .insert({
          name: input.name,
          position: input.position,
          description: input.description,
        } as any)
        .select("*")
        .single()

      if (error) return { success: false, error: error.message }
      return { data: data as StaffTeacher, success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async update(
    id: string,
    patch: Partial<StaffTeacher>,
  ): Promise<{ data?: StaffTeacher; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("staff_teachers")
        .update({
          ...patch,
          updated_at: new Date().toISOString(),
        } as any)
        .eq("id", id)
        .select("*")
        .single()

      if (error) return { success: false, error: error.message }
      return { data: data as StaffTeacher, success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { error } = await supabase.from("staff_teachers").delete().eq("id", id)

      if (error) return { success: false, error: error.message }
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}
