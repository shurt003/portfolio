import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavTheme } from '../contexts/NavTheme'

const links = [
  { label: 'Work', href: '/projects' },
  { label: 'Motion Lab', href: '/motion-lab' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { isDark } = useNavTheme()

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      const delta = y - lastY
      setScrolled(y > 40)
      if (y < 60) {
        setVisible(true)
      } else if (delta > 10) {
        setVisible(false)
      } else if (delta < -10) {
        setVisible(true)
      }
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setVisible(true)
  }, [location])

  // Derived color tokens based on dark mode
  const linkActive   = isDark ? 'text-white'      : 'text-ink'
  const linkInactive = isDark ? 'text-white/60 hover:text-white'   : 'text-ink-light hover:text-ink'
  const underline    = isDark ? 'bg-white'         : 'bg-ink'
  const barColor     = isDark ? 'bg-white'         : 'bg-ink'

  return (
    <>
      <motion.header
        style={{ opacity: 0 }}
        initial={{ y: -20, opacity: 0 }}
        animate={{
          y: visible ? 0 : '-100%',
          opacity: 1,
          backgroundColor: 'rgba(245,240,232,0)',
        }}
        transition={{ y: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }, opacity: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        className="fixed top-0 left-0 right-0 z-[70] px-6 md:px-10 py-5 flex items-center justify-between"
      >
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-2">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-300 ${isDark ? 'bg-cream' : 'bg-ink'}`}>
            <span className={`font-display text-sm font-bold leading-none transition-colors duration-300 ${isDark ? 'text-ink' : 'text-cream'}`}>SH</span>
          </div>
        </Link>

        {/* Desktop links */}
        <nav className={`hidden md:flex items-center gap-8 ${
          isDark ? '' : 'bg-cream/90 backdrop-blur-md rounded-full px-5 py-2'
        }`}>
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-sans text-sm font-500 tracking-wide relative group transition-colors duration-[450ms] ${
                location.pathname === link.href ? linkActive : linkInactive
              }`}
            >
              {/* Roll container — overflow hidden clips the sliding text */}
              <span className="block overflow-hidden relative">
                {/* Text 1 — exits upward on hover */}
                <span className="block transition-transform duration-[0.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-full">
                  {link.label}
                </span>
                {/* Text 2 — rises from below on hover */}
                <span className="absolute inset-0 block transition-transform duration-[0.4s] ease-[cubic-bezier(0.22,1,0.36,1)] translate-y-full group-hover:translate-y-0">
                  {link.label}
                </span>
              </span>
              {/* Underline */}
              <span
                className={`absolute -bottom-0.5 left-0 h-px ${underline} transition-all duration-300 ${
                  location.pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-1"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            className={`block w-6 h-px ${barColor} origin-center transition-colors duration-[450ms]`}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className={`block w-6 h-px ${barColor} transition-colors duration-[450ms]`}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            className={`block w-6 h-px ${barColor} origin-center transition-colors duration-[450ms]`}
            transition={{ duration: 0.3 }}
          />
        </button>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[65] bg-cream flex flex-col items-center justify-center gap-10"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  to={link.href}
                  className="font-display text-4xl font-bold text-ink hover:text-periwinkle transition-colors duration-200"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
