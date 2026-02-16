import { NextRequest, NextResponse } from "next/server"

async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 5) return false

  const payload = `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3]}`
  const signature = parts[4]

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(payload))
  const expectedSignature = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  if (signature !== expectedSignature) return false

  const timestamp = parseInt(parts[0], 10)
  const maxAge = 5 * 60 * 60 * 1000
  if (Date.now() - timestamp > maxAge) return false

  return true
}

export async function proxy(request: NextRequest) {
  const session = request.cookies.get("admin_session")
  const secret = process.env.ADMIN_PASSWORD || "fallback-secret-key"

  if (!session?.value || !(await verifySessionToken(session.value, secret))) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
