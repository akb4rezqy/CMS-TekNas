import { getServiceSupabase } from "@/lib/supabase/admin"

export interface GalleryItem {
  id: string
  title: string
  description: string
  images: string[]
  created_at: string
  updated_at: string
}

export class GalleryService {
  static async getAll(): Promise<{ data: GalleryItem[]; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) return { data: [], success: false, error: error.message }
      return { data: data as GalleryItem[], success: true }
    } catch (error) {
      return { data: [], success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async create(
    input: Omit<GalleryItem, "id" | "created_at" | "updated_at">,
  ): Promise<{ data?: GalleryItem; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("gallery")
        .insert({
          title: input.title,
          description: input.description,
          images: input.images,
        } as any)
        .select("*")
        .single()

      if (error) return { success: false, error: error.message }
      return { data: data as GalleryItem, success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async update(
    id: string,
    patch: Partial<GalleryItem>,
  ): Promise<{ data?: GalleryItem; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("gallery")
        .update({
          ...patch,
          updated_at: new Date().toISOString(),
        } as any)
        .eq("id", id)
        .select("*")
        .single()

      if (error) return { success: false, error: error.message }
      return { data: data as GalleryItem, success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { error } = await supabase.from("gallery").delete().eq("id", id)

      if (error) return { success: false, error: error.message }
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}
