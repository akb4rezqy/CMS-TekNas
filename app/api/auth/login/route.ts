import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createSessionToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const adminUsername = process.env.ADMIN_USERNAME
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminUsername || !adminPassword) {
      return NextResponse.json(
        { success: false, error: "Kredensial admin belum dikonfigurasi" },
        { status: 500 }
      )
    }

    if (username === adminUsername && password === adminPassword) {
      const sessionToken = createSessionToken()
      const cookieStore = await cookies()
      cookieStore.set("admin_session", sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
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
