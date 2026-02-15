import { getServiceSupabase } from "@/lib/supabase/admin"

export interface Assessment {
  id: string
  class_grade: string
  class_major: string
  subject_name: string
  gform_link: string
  day_name: string
  sort_order: number
  created_at: string
  updated_at: string
}

export class AssessmentsService {
  static async getAll(): Promise<{ data: Assessment[]; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .order("sort_order", { ascending: true })

      if (error) return { data: [], success: false, error: error.message }
      return { data: data as Assessment[], success: true }
    } catch (error) {
      return { data: [], success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async getByClass(grade: string, major: string): Promise<{ data: Assessment[]; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("class_grade", grade)
        .eq("class_major", major)
        .order("sort_order", { ascending: true })

      if (error) return { data: [], success: false, error: error.message }
      return { data: data as Assessment[], success: true }
    } catch (error) {
      return { data: [], success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async create(data: Omit<Assessment, "id" | "created_at" | "updated_at">): Promise<{ data: Assessment | null; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data: result, error } = await supabase
        .from("assessments")
        .insert(data)
        .select()
        .single()

      if (error) return { data: null, success: false, error: error.message }
      return { data: result as Assessment, success: true }
    } catch (error) {
      return { data: null, success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async update(id: string, data: Partial<Omit<Assessment, "id" | "created_at">>): Promise<{ data: Assessment | null; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data: result, error } = await supabase
        .from("assessments")
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) return { data: null, success: false, error: error.message }
      return { data: result as Assessment, success: true }
    } catch (error) {
      return { data: null, success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { error } = await supabase
        .from("assessments")
        .delete()
        .eq("id", id)

      if (error) return { success: false, error: error.message }
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}
