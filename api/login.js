import { COOKIE_NAME, MAX_AGE_SECONDS, createSession, safeEqual } from '../lib/session.js'

/* Validates the password server-side and hands back a signed httpOnly cookie.
   The password itself never reaches the browser bundle, which was the core
   failure of the previous client-side gate.

   Requires two environment variables in Vercel (neither VITE_-prefixed, so
   neither is inlined into the client build):
     CASE_STUDY_PASSWORD  the password handed to recruiters
     CASE_STUDY_SECRET    a long random string used to sign the cookie

   With either missing this fails closed and says so, rather than quietly
   letting everyone through. */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'method_not_allowed' })
  }

  const password = process.env.CASE_STUDY_PASSWORD
  const secret = process.env.CASE_STUDY_SECRET
  if (!password || !secret) {
    return res.status(503).json({
      error: 'not_configured',
      message: 'Set CASE_STUDY_PASSWORD and CASE_STUDY_SECRET in the Vercel project.',
    })
  }

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }
  const submitted = body && typeof body.password === 'string' ? body.password : ''

  if (!safeEqual(submitted, password)) {
    return res.status(401).json({ error: 'invalid_password' })
  }

  // Secure cookies are dropped over plain http, which is how `vercel dev` serves locally.
  const secure = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'development' ? ' Secure;' : ''
  const token = await createSession(secret)
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly;${secure} SameSite=Lax; Path=/; Max-Age=${MAX_AGE_SECONDS}`,
  )
  return res.status(200).json({ ok: true })
}
