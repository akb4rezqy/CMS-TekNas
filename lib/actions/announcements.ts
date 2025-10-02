"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export interface Announcement {
  id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching announcements:", error)
    throw new Error("Failed to fetch announcements")
  }

  return data || []
}

export async function createAnnouncement(formData: { title: string; content: string }) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("announcements")
    .insert([
      {
        title: formData.title,
        content: formData.content,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Error creating announcement:", error)
    throw new Error("Failed to create announcement")
  }

  revalidatePath("/dashboard/content/announcements")
  return data
}

export async function updateAnnouncement(id: string, formData: { title: string; content: string }) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("announcements")
    .update({
      title: formData.title,
      content: formData.content,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating announcement:", error)
    throw new Error("Failed to update announcement")
  }

  revalidatePath("/dashboard/content/announcements")
  return data
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("announcements").delete().eq("id", id)

  if (error) {
    console.error("Error deleting announcement:", error)
    throw new Error("Failed to delete announcement")
  }

  revalidatePath("/dashboard/content/announcements")
}
