import { getServiceSupabase } from "@/lib/supabase/admin"

export interface Extracurricular {
  id: string
  title: string
  description: string
  images: string[]
  created_at: string
  updated_at: string
}

export class ExtracurricularsService {
  static async getAll(): Promise<{ data: Extracurricular[]; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("extracurriculars")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) return { data: [], success: false, error: error.message }
      return { data: data as Extracurricular[], success: true }
    } catch (error) {
      return { data: [], success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async create(
    input: Omit<Extracurricular, "id" | "created_at" | "updated_at">,
  ): Promise<{ data?: Extracurricular; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("extracurriculars")
        .insert({
          title: input.title,
          description: input.description,
          images: input.images,
        } as any)
        .select("*")
        .single()

      if (error) return { success: false, error: error.message }
      return { data: data as Extracurricular, success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async update(
    id: string,
    patch: Partial<Extracurricular>,
  ): Promise<{ data?: Extracurricular; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("extracurriculars")
        .update({
          ...patch,
          updated_at: new Date().toISOString(),
        } as any)
        .eq("id", id)
        .select("*")
        .single()

      if (error) return { success: false, error: error.message }
      return { data: data as Extracurricular, success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { error } = await supabase.from("extracurriculars").delete().eq("id", id)

      if (error) return { success: false, error: error.message }
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}
