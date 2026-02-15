import { getServiceSupabase } from "@/lib/supabase/admin"

export interface StaffTeacher {
  id: string
  name: string
  position: string
  description: string
  gender?: "male" | "female"
  photo_url?: string | null
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
      const insertData: any = {
        name: input.name,
        position: input.position,
        description: input.description,
      }
      if (input.gender !== undefined) insertData.gender = input.gender
      if (input.photo_url !== undefined) insertData.photo_url = input.photo_url || null

      const { data, error } = await supabase
        .from("staff_teachers")
        .insert(insertData)
        .select("*")
        .single()

      if (error) {
        if (error.message.includes("gender") || error.message.includes("photo_url")) {
          delete insertData.gender
          delete insertData.photo_url
          const retry = await supabase.from("staff_teachers").insert(insertData).select("*").single()
          if (retry.error) return { success: false, error: retry.error.message }
          return { data: retry.data as StaffTeacher, success: true }
        }
        return { success: false, error: error.message }
      }
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
      const updateData: any = {
        ...patch,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from("staff_teachers")
        .update(updateData)
        .eq("id", id)
        .select("*")
        .single()

      if (error) {
        if (error.message.includes("gender") || error.message.includes("photo_url")) {
          delete updateData.gender
          delete updateData.photo_url
          const retry = await supabase.from("staff_teachers").update(updateData).eq("id", id).select("*").single()
          if (retry.error) return { success: false, error: retry.error.message }
          return { data: retry.data as StaffTeacher, success: true }
        }
        return { success: false, error: error.message }
      }
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
