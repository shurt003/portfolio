#!/usr/bin/env node
/* Checks the gate's logic and the build output.
 *
 *   node scripts/verify-gate.mjs            logic + build checks
 *   node scripts/verify-gate.mjs <base-url> also probes a running deployment
 *
 * The deployment probe is the one that proves the edge rules are live; run it
 * against a Vercel preview URL after deploying.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { createSession, verifySession, readCookie, COOKIE_NAME } from '../lib/session.js'
import { isPublicPath } from '../middleware.js'

const SECRET = 'test-secret-value-for-verification-only'
let failures = 0

function check(name, passed, detail = '') {
  const mark = passed ? 'ok  ' : 'FAIL'
  if (!passed) failures += 1
  console.log(`  ${mark}  ${name}${detail ? `  (${detail})` : ''}`)
}

/* ── 1. Session token ── */
console.log('\nSession token')
{
  const token = await createSession(SECRET)
  check('a freshly signed token verifies', await verifySession(token, SECRET))
  check('the wrong secret is rejected', !(await verifySession(token, 'other-secret')))
  check('a tampered signature is rejected', !(await verifySession(`${token}00`, SECRET)))

  const [exp, sig] = token.split('.')
  check('a tampered expiry is rejected', !(await verifySession(`${Number(exp) + 60000}.${sig}`, SECRET)))
  check('an expired token is rejected', !(await verifySession(token, SECRET, Date.now() + 1000 * 60 * 60 * 24 * 30)))
  check('garbage is rejected', !(await verifySession('not-a-token', SECRET)))
  check('an empty token is rejected', !(await verifySession('', SECRET)))
  check('a missing secret is rejected', !(await verifySession(token, '')))
  check('the cookie parser finds the token', readCookie(`a=1; ${COOKIE_NAME}=${token}; b=2`, COOKIE_NAME) === token)
}

/* ── 2. Which paths the middleware lets through ── */
console.log('\nPath rules')
{
  const shouldBePublic = [
    '/images/aboutv2/cat.webp',
    '/images/profile/StephenImage.webp',
    '/images/magicSignal/magicSignalHero.webp',
  ]
  const shouldBeGated = [
    '/images/Q2Clarity/Designs_july17/overview-desktop.webp',
    '/images/EnhancedMoneyHub/SpendingDesktop.png',
    '/images/magicSignal/da-01.webp',
    '/images/validation/anything.png',
    '/images/alertscase/anything.png',
    '/images/Q2CodeAgents/hero-product-desktop.png',
    '/images/BrandIdentityTokensV2/hero-theme-snapshot.png',
  ]
  for (const p of shouldBePublic) check(`public: ${p}`, isPublicPath(p) === true)
  for (const p of shouldBeGated) check(`gated:  ${p}`, isPublicPath(p) === false)
  check('a brand new image folder is gated by default', isPublicPath('/images/SomeFutureStudy/shot.png') === false)
  check('gated:  /videos/magicSignal/rec-01.mp4', isPublicPath('/videos/magicSignal/rec-01.mp4') === false)
}

/* ── 3. Build output ── */
console.log('\nBuild output')
const distAssets = join(process.cwd(), 'dist', 'assets')
if (!existsSync(distAssets)) {
  console.log('  skipped (no dist/ — run `npm run build` first)')
} else {
  const gatedDir = join(distAssets, 'gated')
  check('gated chunks are emitted to assets/gated/', existsSync(gatedDir))

  const publicChunks = readdirSync(distAssets).filter((f) => f.endsWith('.js'))
  const gatedChunks = existsSync(gatedDir) ? readdirSync(gatedDir).filter((f) => f.endsWith('.js')) : []
  // Every page App.jsx lazy-loads from a gated source should have produced its own gated chunk.
  const appSource = readFileSync(join(process.cwd(), 'src', 'App.jsx'), 'utf8')
  const lazyGated = [...appSource.matchAll(/lazy\(\(\) => import\('\.\/pages\/(?:case-studies\/)?(\w+)'\)\)/g)].map((m) => m[1])
  for (const name of lazyGated) {
    check(`gated chunk emitted for ${name}`, gatedChunks.some((f) => f.startsWith(`${name}-`)))
  }

  // Prose that must never appear in a chunk an anonymous visitor can fetch.
  const secrets = [
    'Uncategorized',
    'proof-of-work',
    'authorization gate',
    '900 entries',
    'Account overview',
  ]
  for (const file of publicChunks) {
    const body = readFileSync(join(distAssets, file), 'utf8')
    for (const secret of secrets) {
      check(`"${secret}" absent from public chunk ${file}`, !body.includes(secret))
    }
  }

  const entry = publicChunks.find((f) => f.startsWith('index-'))
  if (entry) {
    const body = readFileSync(join(distAssets, entry), 'utf8')
    check('the dev password is compiled out of the production entry', !body.includes('make-it-pop'))
    check('no VITE_ password is inlined', !body.includes('VITE_CASE_STUDY_PASSWORD'))
  }
}

/* ── 4. Live deployment ── */
const base = process.argv[2]
if (base) {
  console.log(`\nLive deployment (${base})`)
  const origin = base.replace(/\/$/, '')

  async function status(path) {
    try {
      const res = await fetch(origin + path, { redirect: 'manual' })
      return res.status
    } catch (err) {
      return `error: ${err.message}`
    }
  }

  const gatedDir = join(distAssets, 'gated')
  const sampleChunk = existsSync(gatedDir)
    ? readdirSync(gatedDir).find((f) => f.endsWith('.js'))
    : null

  if (sampleChunk) {
    const code = await status(`/assets/gated/${sampleChunk}`)
    check(`gated chunk refused without a cookie`, code === 401, `got ${code}`)
  }

  for (const p of [
    '/images/Q2Clarity/Designs_july17/overview-desktop.webp',
    '/images/EnhancedMoneyHub/SpendingDesktop.png',
    '/videos/magicSignal/ob-01.mp4',
    '/videos/magicSignal/rec-01.mp4',
  ]) {
    const code = await status(p)
    check(`private asset refused: ${p}`, code === 401, `got ${code}`)
  }

  for (const p of ['/images/profile/StephenImage.webp', '/images/magicSignal/magicSignalHero.webp']) {
    const code = await status(p)
    check(`public image still served: ${p}`, code === 200, `got ${code}`)
  }

  for (const p of ['/', '/about', '/q2-clarity']) {
    const code = await status(p)
    check(`page shell still served: ${p}`, code === 200, `got ${code}`)
  }
}

console.log(failures === 0 ? '\nAll checks passed.\n' : `\n${failures} check(s) failed.\n`)
process.exit(failures === 0 ? 0 : 1)
