import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  motion, AnimatePresence, useMotionValue, useSpring, useTransform,
} from 'framer-motion'

/*
  HeroBento — a personality-dense bento grid for the hero's right side.
  • Big tile auto-rotates through real case studies (crossfade)
  • Live "Austin, TX" tile with the local time ticking
  • "Currently at Q2" tile
  • Whole grid tilts toward the cursor in 3D (parallax depth per tile)
*/

const INK  = '#1C2322'
const BLUE = '#2B59C3'
const DARK = '#0D0F14'
const EASE = [0.22, 1, 0.36, 1]

const FEATURED = [
  { title: 'Secure Messaging',    tag: 'Enterprise UX', href: '/messaging-redesign', image: '/images/SecureMessaging/securemessagingbgheroimage.webp' },
  { title: 'Interstitial Screens', tag: 'Brand Moment',  href: '/interstitial',       image: '/images/Interstitial/NewCustomImage.png' },
  { title: 'Form Validation',      tag: 'Research',      href: '/validation',         image: '/images/FormValidation/formvalidationherobg.webp' },
  { title: 'MagicSignal',          tag: '0 → 1 iOS',     href: '/magic-signal',       image: '/images/magicSignal/magicSignalHero.webp' },
]

function useAustinTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: true, timeZone: 'America/Chicago',
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

export default function HeroBento({ active = true }) {
  const [idx, setIdx] = useState(0)
  const time = useAustinTime()
  const wrapRef = useRef(null)

  // Auto-rotate the featured project
  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % FEATURED.length), 3600)
    return () => clearInterval(id)
  }, [])

  // Cursor-reactive 3D tilt
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), { stiffness: 150, damping: 18 })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 150, damping: 18 })

  const handleMove = e => {
    const r = wrapRef.current?.getBoundingClientRect()
    if (!r) return
    px.set((e.clientX - r.left) / r.width - 0.5)
    py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const handleLeave = () => { px.set(0); py.set(0) }

  const current = FEATURED[idx]

  return (
    <motion.div
      ref={wrapRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, x: 30 }}
      animate={active ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        style={{
          rotateX, rotateY, transformStyle: 'preserve-3d',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        {/* ── Featured project (big, rotates) ─────────────────────── */}
        <Link
          to={current.href}
          className="group relative block rounded-2xl overflow-hidden"
          style={{ gridColumn: '1 / 3', aspectRatio: '16 / 10', transform: 'translateZ(40px)', backgroundColor: DARK }}
        >
          <AnimatePresence>
            <motion.div
              key={idx}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <img src={current.image} alt={current.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,15,20,0.78) 0%, rgba(13,15,20,0.12) 45%, rgba(13,15,20,0) 70%)' }} />
              <div className="absolute top-4 left-4">
                <span className="font-sans text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: '#fff', backdropFilter: 'blur(6px)' }}>
                  {current.tag}
                </span>
              </div>
              <div className="absolute bottom-4 left-5 right-5">
                <p className="font-sans text-[11px] uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Featured work</p>
                <p className="font-display text-2xl font-bold text-white leading-tight">{current.title}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* hover arrow */}
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:rotate-45" style={{ backgroundColor: '#fff' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 12L12 1M12 1H3.5M12 1V9.5" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* index dots */}
          <div className="absolute bottom-5 right-5 flex gap-1.5">
            {FEATURED.map((_, i) => (
              <span key={i} className="block rounded-full transition-all duration-300" style={{ width: i === idx ? 18 : 6, height: 6, backgroundColor: i === idx ? '#fff' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
        </Link>

        {/* ── Live Austin clock ───────────────────────────────────── */}
        <div
          className="rounded-2xl px-5 py-5 flex flex-col justify-between"
          style={{ transform: 'translateZ(22px)', backgroundColor: '#fff', border: '1px solid rgba(28,35,34,0.08)', minHeight: 132 }}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: '#22C55E' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#22C55E' }} />
            </span>
            <span className="font-sans text-[11px] uppercase tracking-widest" style={{ color: 'rgba(28,35,34,0.5)' }}>Austin, TX</span>
          </div>
          <div>
            <p className="font-display font-black tabular-nums" style={{ fontSize: 'clamp(1.4rem, 2vw, 1.9rem)', color: INK, lineHeight: 1 }}>
              {time}
            </p>
            <p className="font-sans text-xs mt-1" style={{ color: 'rgba(28,35,34,0.45)' }}>local time</p>
          </div>
        </div>

        {/* ── Currently at Q2 ─────────────────────────────────────── */}
        <div
          className="rounded-2xl px-5 py-5 flex flex-col justify-between"
          style={{ transform: 'translateZ(30px)', backgroundColor: BLUE, minHeight: 132 }}
        >
          <span className="font-sans text-[11px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>Currently at</span>
          <div>
            <p className="font-display font-black text-white" style={{ fontSize: 'clamp(2rem, 3vw, 2.6rem)', lineHeight: 1 }}>Q2</p>
            <p className="font-sans text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Enterprise banking software</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
