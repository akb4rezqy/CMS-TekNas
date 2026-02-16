import crypto from "crypto"

const SECRET = process.env.ADMIN_PASSWORD || "fallback-secret-key"

export function createSessionToken(): string {
  const timestamp = Date.now().toString()
  const random = crypto.randomBytes(16).toString("hex")
  const payload = `${timestamp}.${random}`
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex")
  return `${payload}.${signature}`
}

export function verifySessionToken(token: string): boolean {
  if (!token) return false
  const parts = token.split(".")
  if (parts.length !== 3) return false

  const payload = `${parts[0]}.${parts[1]}`
  const signature = parts[2]

  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex")

  if (signature !== expectedSignature) return false

  const timestamp = parseInt(parts[0], 10)
  const maxAge = 7 * 24 * 60 * 60 * 1000
  if (Date.now() - timestamp > maxAge) return false

  return true
}
