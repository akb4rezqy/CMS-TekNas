import { getServiceSupabase } from "@/lib/supabase/admin"

export interface Announcement {
  id: string
  title: string
  content: string
  date: string
  author: string
  status: "draft" | "published"
  image_url?: string | null
  created_at: string
  updated_at: string
}

export class AnnouncementsService {
  static async getAll(): Promise<{ data: Announcement[]; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) return { data: [], success: false, error: error.message }
      return { data: data as Announcement[], success: true }
    } catch (error) {
      return { data: [], success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async getLatest(limit: number = 3): Promise<{ data: Announcement[]; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) return { data: [], success: false, error: error.message }
      return { data: data as Announcement[], success: true }
    } catch (error) {
      return { data: [], success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async create(
    input: Omit<Announcement, "id" | "created_at" | "updated_at">,
  ): Promise<{ data?: Announcement; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const insertData: any = {
        title: input.title,
        content: input.content,
        date: input.date,
        author: input.author,
        status: input.status,
      }
      if (input.image_url !== undefined) {
        insertData.image_url = input.image_url || null
      }

      const { data, error } = await supabase
        .from("announcements")
        .insert(insertData)
        .select("*")
        .single()

      if (error) {
        if (error.message.includes("image_url")) {
          delete insertData.image_url
          const retry = await supabase.from("announcements").insert(insertData).select("*").single()
          if (retry.error) return { success: false, error: retry.error.message }
          return { data: retry.data as Announcement, success: true }
        }
        return { success: false, error: error.message }
      }
      return { data: data as Announcement, success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async update(
    id: string,
    patch: Partial<Announcement>,
  ): Promise<{ data?: Announcement; success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const updateData: any = {
        ...patch,
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase
        .from("announcements")
        .update(updateData)
        .eq("id", id)
        .select("*")
        .single()

      if (error) {
        if (error.message.includes("image_url")) {
          delete updateData.image_url
          const retry = await supabase.from("announcements").update(updateData).eq("id", id).select("*").single()
          if (retry.error) return { success: false, error: retry.error.message }
          return { data: retry.data as Announcement, success: true }
        }
        return { success: false, error: error.message }
      }
      return { data: data as Announcement, success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }

  static async delete(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = getServiceSupabase()
      const { error } = await supabase.from("announcements").delete().eq("id", id)

      if (error) return { success: false, error: error.message }
      return { success: true }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
  }
}
