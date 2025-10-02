import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] PUT /api/announcements/[id] - Starting request for ID:", params.id)

    const body = await request.json()
    const { title, content, date, author, status } = body

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("announcements")
      .update({ title, content, date, author, status, updated_at: new Date().toISOString() })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.log("[v0] Database error:", error)
      throw error
    }

    console.log("[v0] Successfully updated announcement:", params.id)
    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.log("[v0] PUT announcements error:", error)
    return NextResponse.json({ error: "Failed to update announcement", success: false }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] DELETE /api/announcements/[id] - Starting request for ID:", params.id)

    const supabase = await createClient()
    const { error } = await supabase.from("announcements").delete().eq("id", params.id)

    if (error) {
      console.log("[v0] Database error:", error)
      throw error
    }

    console.log("[v0] Successfully deleted announcement:", params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("[v0] DELETE announcements error:", error)
    return NextResponse.json({ error: "Failed to delete announcement", success: false }, { status: 500 })
  }
}
