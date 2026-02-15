import { getServiceSupabase } from "@/lib/supabase/admin"

export interface OrgStructureItem {
  id: string
  position_name: string
  person_name: string
  parent_id: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export class OrgStructureService {
  static async getAll(): Promise<{ data: OrgStructureItem[]; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("org_structure")
        .select("*")
        .order("sort_order", { ascending: true })

      if (error) return { data: [], success: false, error: error.message }
      return { data: data as OrgStructureItem[], success: true }
    } catch (error) {
      return { data: [], success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async create(
    input: Omit<OrgStructureItem, "id" | "created_at" | "updated_at">,
  ): Promise<{ data?: OrgStructureItem; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("org_structure")
        .insert({
          position_name: input.position_name,
          person_name: input.person_name,
          parent_id: input.parent_id || null,
          sort_order: input.sort_order || 0,
        } as any)
        .select("*")
        .single()

      if (error) return { success: false, error: error.message }
      return { data: data as OrgStructureItem, success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async update(
    id: string,
    patch: Partial<OrgStructureItem>,
  ): Promise<{ data?: OrgStructureItem; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("org_structure")
        .update({
          ...patch,
          updated_at: new Date().toISOString(),
        } as any)
        .eq("id", id)
        .select("*")
        .single()

      if (error) return { success: false, error: error.message }
      return { data: data as OrgStructureItem, success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { error } = await supabase.from("org_structure").delete().eq("id", id)

      if (error) return { success: false, error: error.message }
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}
