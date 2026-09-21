/* Signed session token shared by the login function and the edge middleware.
   Uses WebCrypto rather than node:crypto so the same file runs unchanged in the
   Node runtime (api/login.js) and the Edge runtime (middleware.js).

   The token is `${expiresAt}.${hmac(expiresAt)}`. It carries no secret and no
   identity, only an expiry the server signed, so a copied cookie is worth
   exactly as much as the password it came from and expires on its own. */

export const COOKIE_NAME = 'cs_session'
export const MAX_AGE_SECONDS = 60 * 60 * 24 * 14 // two weeks

const encoder = new TextEncoder()

function toHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/* Compare without leaking position of the first difference through timing. */
export function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

async function sign(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))
  return toHex(new Uint8Array(signature))
}

export async function createSession(secret, now = Date.now()) {
  const expiresAt = String(now + MAX_AGE_SECONDS * 1000)
  return `${expiresAt}.${await sign(secret, expiresAt)}`
}

export async function verifySession(token, secret, now = Date.now()) {
  if (!token || !secret) return false
  const separator = token.indexOf('.')
  if (separator < 1) return false

  const expiresAt = token.slice(0, separator)
  const signature = token.slice(separator + 1)
  if (!/^\d+$/.test(expiresAt)) return false
  if (Number(expiresAt) < now) return false

  return safeEqual(signature, await sign(secret, expiresAt))
}

export function readCookie(header, name) {
  if (!header) return null
  for (const part of header.split(';')) {
    const eq = part.indexOf('=')
    if (eq < 0) continue
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim()
  }
  return null
}
