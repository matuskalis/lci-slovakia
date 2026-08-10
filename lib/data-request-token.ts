import { createHmac, timingSafeEqual } from "crypto"

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

function sign(payload: string): string {
  const secret = process.env.DATA_REQUEST_SECRET
  if (!secret) throw new Error("DATA_REQUEST_SECRET nie je nastavený")
  return createHmac("sha256", secret).update(payload).digest("base64url")
}

export function createDownloadToken(requestId: string): string {
  const payload = `${requestId}.${Date.now() + TOKEN_TTL_MS}`
  return `${payload}.${sign(payload)}`
}

export function verifyDownloadToken(token: string): string | null {
  const parts = token.split(".")
  if (parts.length !== 3) return null

  const [requestId, expiresAt, signature] = parts
  const expected = Buffer.from(sign(`${requestId}.${expiresAt}`))
  const received = Buffer.from(signature)

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null
  if (Number(expiresAt) < Date.now()) return null

  return requestId
}
