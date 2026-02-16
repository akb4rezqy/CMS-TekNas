import { getServiceSupabase } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"
import { verifySessionToken } from "@/lib/auth"
import { cookies } from "next/headers"

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

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

    const { currentPassword, newPassword, targetUserId } = await req.json()

    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ success: false, error: "Password baru minimal 6 karakter" }, { status: 400 })
    }

    const supabase = getServiceSupabase()
    const userId = targetUserId || tokenData.userId

    if (targetUserId && targetUserId !== tokenData.userId && tokenData.role !== "admin") {
      return NextResponse.json({ success: false, error: "Hanya admin yang bisa mengubah password user lain" }, { status: 403 })
    }

    if (!targetUserId || targetUserId === tokenData.userId) {
      if (!currentPassword) {
        return NextResponse.json({ success: false, error: "Password lama wajib diisi" }, { status: 400 })
      }

      const { data: user } = await supabase
        .from("admin_users")
        .select("password_hash")
        .eq("id", userId)
        .single() as { data: any }

      if (!user || user.password_hash !== hashPassword(currentPassword)) {
        return NextResponse.json({ success: false, error: "Password lama salah" }, { status: 400 })
      }
    }

    const { error } = await (supabase
      .from("admin_users") as any)
      .update({ password_hash: hashPassword(newPassword), updated_at: new Date().toISOString() })
      .eq("id", userId)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
