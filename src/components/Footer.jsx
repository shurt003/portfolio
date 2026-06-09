import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const BLUE = '#2B59C3'

export default function Footer() {
  const [emailHovered, setEmailHovered] = useState(false)

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
              className="inline-flex items-center gap-2 font-sans text-sm font-medium px-8 py-4 rounded-full"
              style={{ backgroundColor: BLUE, color: '#fff' }}
              onMouseEnter={() => setEmailHovered(true)}
              onMouseLeave={() => setEmailHovered(false)}
            >
              stephenchurt@gmail.com
              <span style={{ position: 'relative', width: 12, height: 12, overflow: 'hidden', display: 'inline-block', flexShrink: 0 }}>
                {/* Arrow 1 — exits toward top-right on hover */}
                <motion.svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  animate={emailHovered ? { x: 15, y: -15 } : { x: 0, y: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </motion.svg>
                {/* Arrow 2 — enters from bottom-left on hover */}
                <motion.svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  animate={emailHovered ? { x: 0, y: 0 } : { x: -15, y: 15 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </motion.svg>
              </span>
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
            © 2026 Stephen Hurt. Designed & built in Austin, TX.
          </p>
          <div className="flex gap-8">
            {[
              { label: 'Work', href: '/projects' },
              { label: 'Motion Lab', href: '/motion-lab' },
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
