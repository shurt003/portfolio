import { useState, useEffect } from 'react'
import { Outlet, Link } from 'react-router-dom'
import { useNavTheme } from '../contexts/NavTheme'

/* ──────────────────────────────────────────────────────────────────────────
 * Cosmetic password gate for the case-study pages.
 *
 * ⚠️  This is NOT real security. It keeps casual visitors out, but the page
 *     content still ships in the JS bundle and can be recovered by anyone
 *     technical. Do not rely on it for NDA / confidential work.
 *
 * 🔑  TO SET THE PASSWORD: change the string below (or set the env var
 *     VITE_CASE_STUDY_PASSWORD in a .env file / your host's settings).
 * ────────────────────────────────────────────────────────────────────────── */
const PASSWORD = import.meta.env.VITE_CASE_STUDY_PASSWORD || 'make-it-pop'
const STORAGE_KEY = 'caseStudyAccess'

export default function CaseStudyGate() {
  const { setIsDark } = useNavTheme()
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(STORAGE_KEY) === '1')
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)

  // Keep the nav in its light state while the (cream) gate is showing.
  useEffect(() => {
    if (!authed) setIsDark(false)
  }, [authed, setIsDark])

  if (authed) return <Outlet />

  const submit = (e) => {
    e.preventDefault()
    if (value === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, '1')
      setAuthed(true)
    } else {
      setError(true)
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
          This case study is private
        </h1>
        <p className="font-sans text-base leading-relaxed mb-8" style={{ color: 'rgba(28,35,34,0.6)' }}>
          Enter the password to view it. Need access?{' '}
          <Link to="/contact" style={{ color: '#2B59C3' }}>Get in touch</Link>.
        </p>

        <form onSubmit={submit} className="flex flex-col gap-3">
          <input
            type="password"
            autoFocus
            autoComplete="off"
            aria-label="Password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false) }}
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
            className="w-full px-5 py-3.5 rounded-full font-sans text-sm font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#1C2322', color: '#fff' }}
          >
            View case study
          </button>
          {error && (
            <p className="font-sans text-sm mt-1" style={{ color: '#D9488E' }}>
              Incorrect password — try again.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
