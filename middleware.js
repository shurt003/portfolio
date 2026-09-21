import { next } from '@vercel/functions/middleware'
import { COOKIE_NAME, readCookie, verifySession } from './lib/session.js'

/* Edge gate for private content.

   Only two things are matched, and neither is an HTML route. index.html is the
   same public shell for every path and holds no case study content, so letting
   it through is what allows the password form to render normally instead of a
   bare 401. The protection lives on the things that actually carry content:
   the lazily loaded case study chunks, and the screenshots.

   Middleware runs before the filesystem handler and before the CDN cache, so a
   401 here beats both the static file and the SPA rewrite. */
export const config = {
  matcher: ['/assets/gated/:path*', '/images/:path*'],
}

/* Images are deny-by-default: a new case study's screenshots are protected the
   day they land, with no matcher to remember to update. The exceptions below
   are the handful of files public pages genuinely render. Forgetting to add one
   breaks a visible image on a public page, which is a loud failure; the
   dangerous direction, a private image quietly served to anyone, cannot happen
   by omission. */
const PUBLIC_IMAGE_PREFIXES = [
  '/images/aboutv2/',
  '/images/profile/',
]

const PUBLIC_IMAGE_FILES = new Set([
  '/images/FormValidation/formvalidationherobg.webp',
  '/images/Interstitial/NewCustomImage.png',
  '/images/SecureMessaging/securemessagingbgheroimage.webp',
  '/images/magicSignal/magicSignalHero.webp',
])

export function isPublicPath(pathname) {
  if (!pathname.startsWith('/images/')) return false
  if (PUBLIC_IMAGE_FILES.has(pathname)) return true
  return PUBLIC_IMAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function denied(pathname) {
  const body = pathname.startsWith('/images/')
    ? 'This image is part of a private case study.'
    : 'This content is private.'
  return new Response(body, {
    status: 401,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
    },
  })
}

export default async function middleware(request) {
  const { pathname } = new URL(request.url)

  if (isPublicPath(pathname)) return next()

  const token = readCookie(request.headers.get('cookie'), COOKIE_NAME)
  const ok = await verifySession(token, process.env.CASE_STUDY_SECRET)

  return ok ? next() : denied(pathname)
}
