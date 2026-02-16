import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createSessionToken } from "@/lib/auth"

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

    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { success: false, error: "Kredensial admin belum dikonfigurasi" },
        { status: 500 }
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

    if (username === adminUsername && password === adminPassword) {
      const sessionToken = createSessionToken()
      const cookieStore = await cookies()
      cookieStore.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 5,
      })

      return NextResponse.json({ success: true })
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
