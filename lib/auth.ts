import crypto from "crypto"

const SECRET = process.env.ADMIN_PASSWORD || "fallback-secret-key"

interface TokenData {
  userId: string
  role: string
}

export function createSessionToken(userId: string, role: string): string {
  const timestamp = Date.now().toString()
  const random = crypto.randomBytes(16).toString("hex")
  const payload = `${timestamp}.${random}.${userId}.${role}`
  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex")
  return `${payload}.${signature}`
}

export function verifySessionToken(token: string): TokenData | null {
  if (!token) return null
  const parts = token.split(".")
  if (parts.length !== 5) return null

  const payload = `${parts[0]}.${parts[1]}.${parts[2]}.${parts[3]}`
  const signature = parts[4]

  const expectedSignature = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex")

  if (signature !== expectedSignature) return null

  const timestamp = parseInt(parts[0], 10)
  const maxAge = 5 * 60 * 60 * 1000
  if (Date.now() - timestamp > maxAge) return null

  return { userId: parts[2], role: parts[3] }
}
