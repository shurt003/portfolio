import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useNavTheme } from '../contexts/NavTheme'

/* ──────────────────────────────────────────────────────────────────────────
 * Password gate for the case-study pages.
 *
 * The check happens server-side. Submitting posts to /api/login, which compares
 * against CASE_STUDY_PASSWORD (set in Vercel, not VITE_-prefixed, so it never
 * enters this bundle) and returns a signed httpOnly cookie. Edge middleware
 * refuses the case study chunks and screenshots without that cookie, so this
 * component is the door rather than the lock: faking the flag below gets you an
 * empty page, not the content.
 *
 * In `vite dev` there is no middleware and no function, so the gate falls back
 * to a local check to keep the normal workflow. That branch is compiled out of
 * production builds.
 * ────────────────────────────────────────────────────────────────────────── */
const STORAGE_KEY = 'caseStudyAccess'
const DEV_PASSWORD = 'make-it-pop'

export default function CaseStudyGate() {
  const { setIsDark } = useNavTheme()
  const { pathname } = useLocation()
  // The /work index lists several case studies; individual studies are singular.
  const isIndex = pathname === '/work'
  const heading = isIndex ? 'These case studies are private' : 'This case study is private'
  const viewText = isIndex ? 'them' : 'it'
  const buttonLabel = isIndex ? 'View case studies' : 'View case study'
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(STORAGE_KEY) === '1')
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)

  // Keep the nav in its light state while the (cream) gate is showing.
  useEffect(() => {
    if (!authed) setIsDark(false)
  }, [authed, setIsDark])

  if (authed) return <Outlet />

  const unlock = () => {
    sessionStorage.setItem(STORAGE_KEY, '1')
    setAuthed(true)
  }

  const fail = (text) => {
    setError(true)
    setMessage(text)
    setPending(false)
  }

  const submit = async (e) => {
    e.preventDefault()
    if (pending) return

    if (import.meta.env.DEV) {
      if (value === DEV_PASSWORD) unlock()
      else fail('Incorrect password, try again.')
      return
    }

    setPending(true)
    setError(false)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: value }),
      })
      if (res.ok) {
        unlock()
        return
      }
      if (res.status === 503) fail('The gate is not configured yet. Get in touch and I will sort it out.')
      else fail('Incorrect password, try again.')
    } catch {
      fail('Could not reach the server. Check your connection and try again.')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 pt-28 pb-20"
      style={{ backgroundColor: '#F5F0E8' }}
    >
      <div className="w-full max-w-md text-center">
        <p className="font-sans text-xs uppercase tracking-[0.25em] mb-4" style={{ color: 'rgba(28,35,34,0.6)' }}>
          Protected
        </p>
        <h1
          className="font-display font-black tracking-tight mb-3"
          style={{ fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', color: '#1C2322', lineHeight: 1.12 }}
        >
          {heading}
        </h1>
        <p className="font-sans text-base leading-relaxed mb-8" style={{ color: 'rgba(28,35,34,0.6)' }}>
          Enter the password to view {viewText}. Need access?{' '}
          <Link to="/contact" style={{ color: '#2B59C3' }}>Get in touch</Link>.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="password"
            autoFocus
            autoComplete="off"
            aria-label="Password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); setMessage('') }}
            placeholder="Password"
            className="w-full px-5 py-3.5 rounded-full font-sans text-base outline-none border-2 transition-colors"
            style={{
              borderColor: error ? '#D9488E' : 'rgba(28,35,34,0.18)',
              backgroundColor: '#fff',
              color: '#1C2322',
            }}
          />
          <button
            type="submit"
            disabled={pending}
            className="w-full px-5 py-3.5 rounded-full font-sans text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1C2322', color: '#fff', opacity: pending ? 0.6 : 1, cursor: pending ? 'default' : 'pointer' }}
          >
            {pending ? 'Checking…' : buttonLabel}
          </button>
          {error && message && (
            <p className="font-sans text-sm mt-1" role="alert" style={{ color: '#D9488E' }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
