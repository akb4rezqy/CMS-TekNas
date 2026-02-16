import { getServiceSupabase } from "@/lib/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import { createHash } from "crypto"
import { verifySessionToken } from "@/lib/auth"
import { cookies } from "next/headers"

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

async function isAuthenticated(): Promise<{ valid: boolean; role?: string; userId?: string }> {
  const cookieStore = await cookies()
  const session = cookieStore.get("admin_session")
  if (!session?.value) return { valid: false }

  const tokenData = verifySessionToken(session.value)
  if (!tokenData) return { valid: false }

  return { valid: true, role: tokenData.role, userId: tokenData.userId }
}

export async function GET() {
  try {
    const auth = await isAuthenticated()
    if (!auth.valid || auth.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const supabase = getServiceSupabase()
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, username, display_name, role, created_at")
      .order("created_at", { ascending: true })

    if (error) {
      if (error.code === "42P01") {
        return NextResponse.json({ success: true, data: [], tableExists: false })
      }
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await isAuthenticated()
    if (!auth.valid || auth.role !== "admin") {
      return NextResponse.json({ success: false, error: "Hanya admin yang bisa membuat akun" }, { status: 403 })
    }

    const { username, password, display_name, role } = await req.json()

    if (!username || !password) {
      return NextResponse.json({ success: false, error: "Username dan password wajib diisi" }, { status: 400 })
    }

    if (username.length < 3) {
      return NextResponse.json({ success: false, error: "Username minimal 3 karakter" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: "Password minimal 6 karakter" }, { status: 400 })
    }

    const allowedRoles = ["admin", "editor"]
    if (role && !allowedRoles.includes(role)) {
      return NextResponse.json({ success: false, error: "Role tidak valid" }, { status: 400 })
    }

    const supabase = getServiceSupabase()

    const { data: existing } = await supabase
      .from("admin_users")
      .select("id")
      .eq("username", username.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json({ success: false, error: "Username sudah digunakan" }, { status: 400 })
    }

    const { error } = await supabase.from("admin_users").insert({
      username: username.toLowerCase(),
      password_hash: hashPassword(password),
      display_name: display_name || username,
      role: role || "editor",
    } as any)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await isAuthenticated()
    if (!auth.valid || auth.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ success: false, error: "ID wajib" }, { status: 400 })
    }

    if (id === auth.userId) {
      return NextResponse.json({ success: false, error: "Tidak bisa menghapus akun sendiri" }, { status: 400 })
    }

    const supabase = getServiceSupabase()
    const { error } = await supabase.from("admin_users").delete().eq("id", id)

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
