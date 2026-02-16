import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifySessionToken } from "@/lib/auth"
import { getServiceSupabase } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin_session")
    if (!session?.value) {
      return NextResponse.json({ success: false }, { status: 401 })
    }

    const tokenData = verifySessionToken(session.value)
    if (!tokenData) {
      return NextResponse.json({ success: false }, { status: 401 })
    }

    if (tokenData.userId === "env-admin") {
      return NextResponse.json({
        success: true,
        user: {
          id: "env-admin",
          username: process.env.ADMIN_USERNAME || "admin",
          display_name: "Administrator",
          role: "admin",
        },
      })
    }

    const supabase = getServiceSupabase()
    const { data: user } = await supabase
      .from("admin_users")
      .select("id, username, display_name, role")
      .eq("id", tokenData.userId)
      .single()

    if (!user) {
      return NextResponse.json({ success: false }, { status: 401 })
    }

    return NextResponse.json({ success: true, user })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
