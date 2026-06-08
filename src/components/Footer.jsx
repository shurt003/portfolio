import { Link } from 'react-router-dom'

const BLUE = '#2B59C3'

export default function Footer() {
  return (
    <footer
      className="fixed bottom-0 inset-x-0 z-0 overflow-hidden"
      style={{ height: 'var(--footer-h)', backgroundColor: '#0D0F14' }}
    >
      <div className="h-full flex flex-col justify-between px-6 md:px-14 lg:px-20 py-12 md:py-16 max-w-[1400px] mx-auto w-full">

        {/* ── Top: CTA ──────────────────────────────────────────────── */}
        <div>
          <p
            className="font-sans text-xs uppercase tracking-[0.25em] mb-4"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Get in touch
          </p>
          <h2
            className="font-display font-black tracking-tight mb-8"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#fff', lineHeight: 1.1 }}
          >
            Have a project?<br />
            <span style={{ color: 'rgba(255,255,255,0.35)' }}>Let's talk about it.</span>
          </h2>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:stephenchurt@gmail.com"
              className="inline-flex items-center gap-2 font-sans text-sm font-medium px-8 py-4 rounded-full transition-opacity duration-200 hover:opacity-90"
              style={{ backgroundColor: BLUE, color: '#fff' }}
            >
              stephenchurt@gmail.com
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/schurt/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-sm font-medium px-8 py-4 rounded-full border transition-opacity duration-200 hover:opacity-80"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────── */}
        <div
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-10"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
        >
          <p className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            © 2025 Stephen Hurt. Designed & built in Austin, TX.
          </p>
          <div className="flex gap-8">
            {[
              { label: 'Work', href: '/projects' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map(link => (
              <Link
                key={link.label}
                to={link.href}
                className="font-sans text-sm transition-opacity duration-200 hover:opacity-70"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
