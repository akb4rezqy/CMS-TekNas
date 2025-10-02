import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log("[v0] GET /api/announcements - Starting request")

    const supabase = await createClient()
    const { data, error } = await supabase.from("announcements").select("*").order("created_at", { ascending: false })

    if (error) {
      console.log("[v0] Database error:", error)
      throw error
    }

    console.log("[v0] Successfully fetched announcements:", data?.length || 0)
    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.log("[v0] GET announcements error:", error)
    return NextResponse.json({ error: "Failed to fetch announcements", success: false }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] POST /api/announcements - Starting request")

    const body = await request.json()
    const { title, content, date, author, status } = body

    if (!title || !content || !date || !author) {
      return NextResponse.json({ error: "Missing required fields", success: false }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("announcements")
      .insert([{ title, content, date, author, status: status || "draft" }])
      .select()
      .single()

    if (error) {
      console.log("[v0] Database error:", error)
      throw error
    }

    console.log("[v0] Successfully created announcement:", data.id)
    return NextResponse.json({ data, success: true })
  } catch (error) {
    console.log("[v0] POST announcements error:", error)
    return NextResponse.json({ error: "Failed to create announcement", success: false }, { status: 500 })
  }
}
