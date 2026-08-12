import crypto from 'crypto'

const SESSION_SECRET =
  process.env.SESSION_SECRET || '3ds_platforma_secure_session_secret_key_2026_x89f'

export interface SessionPayload {
  userId: string
  role: string
  email?: string
  expiresAt: number
}

/**
 * Creates a cryptographically signed HMAC token for authentication
 */
export function createSessionToken(userId: string, role: string, email?: string): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  const payload: SessionPayload = { userId, role, email, expiresAt }
  const jsonString = JSON.stringify(payload)
  const base64Payload = Buffer.from(jsonString).toString('base64url')

  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(base64Payload)
    .digest('base64url')

  return `${base64Payload}.${signature}`
}

/**
 * Verifies and decodes a signed HMAC session token
 */
export function verifySessionToken(token: string | undefined | null): SessionPayload | null {
  if (!token) return null

  const parts = token.split('.')
  if (parts.length !== 2) return null

  const [base64Payload, signature] = parts

  try {
    const expectedSignature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(base64Payload)
      .digest('base64url')

    // Timing-safe comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)

    if (
      sigBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
    ) {
      return null
    }

    const jsonString = Buffer.from(base64Payload, 'base64url').toString('utf8')
    const payload: SessionPayload = JSON.parse(jsonString)

    if (!payload.expiresAt || Date.now() > payload.expiresAt) {
      return null
    }

    return payload
  } catch {
    return null
  }
}
