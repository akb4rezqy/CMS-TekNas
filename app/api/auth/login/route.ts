import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createSessionToken } from "@/lib/auth"
import { getServiceSupabase } from "@/lib/supabase/admin"
import { createHash } from "crypto"

function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    })
    const data = await res.json()
    return data.success === true
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, turnstileToken } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username dan password wajib diisi" },
        { status: 400 }
      )
    }

    if (process.env.TURNSTILE_SECRET_KEY) {
      if (!turnstileToken) {
        return NextResponse.json(
          { success: false, error: "Verifikasi CAPTCHA diperlukan" },
          { status: 400 }
        )
      }

      const isValid = await verifyTurnstile(turnstileToken)
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Verifikasi CAPTCHA gagal, coba lagi" },
          { status: 403 }
        )
      }
    }

    const supabase = getServiceSupabase()

    const { data: dbUser } = await supabase
      .from("admin_users")
      .select("id, username, password_hash, role, display_name")
      .eq("username", username.toLowerCase())
      .single() as { data: any }

    if (dbUser && dbUser.password_hash === hashPassword(password)) {
      const sessionToken = createSessionToken(dbUser.id, dbUser.role)
      const cookieStore = await cookies()
      cookieStore.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 5,
      })

      return NextResponse.json({ success: true, user: { username: dbUser.username, role: dbUser.role, display_name: dbUser.display_name } })
    }

    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (adminUsername && adminPassword && username === adminUsername && password === adminPassword) {
      const sessionToken = createSessionToken("env-admin", "admin")
      const cookieStore = await cookies()
      cookieStore.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 5,
      })

      return NextResponse.json({ success: true, user: { username: adminUsername, role: "admin", display_name: "Administrator" } })
    }

    return NextResponse.json(
      { success: false, error: "Username atau password salah" },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan" },
      { status: 500 }
    )
  }
}
