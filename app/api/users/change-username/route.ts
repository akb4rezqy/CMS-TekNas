import { getServiceSupabase } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import { verifySessionToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin_session")
    if (!session?.value) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const tokenData = verifySessionToken(session.value)
    if (!tokenData) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { newUsername, targetUserId } = await req.json()

    if (!newUsername || newUsername.length < 3) {
      return NextResponse.json({ success: false, error: "Username minimal 3 karakter" }, { status: 400 })
    }

    const userId = targetUserId || tokenData.userId

    if (targetUserId && targetUserId !== tokenData.userId && tokenData.role !== "admin") {
      return NextResponse.json({ success: false, error: "Hanya admin yang bisa mengubah username user lain" }, { status: 403 })
    }

    const supabase = getServiceSupabase()

    const { data: existing } = await supabase
      .from("admin_users")
      .select("id")
      .eq("username", newUsername.toLowerCase())
      .neq("id", userId)
      .single()

    if (existing) {
      return NextResponse.json({ success: false, error: "Username sudah digunakan" }, { status: 400 })
    }

    const { error } = await (supabase
      .from("admin_users") as any)
      .update({ username: newUsername.toLowerCase(), updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
