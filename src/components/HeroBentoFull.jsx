import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

/*
  HeroBentoFull — the entire hero as one responsive bento grid that fills the
  viewport. No cursor tilt. Tiles: headline, auto-rotating featured project,
  three stats, a live Austin clock, and a Q2 tile.
*/

const INK  = '#1C2322'
const BLUE = '#2B59C3'
const DARK = '#0D0F14'
const DIM  = 'rgba(28,35,34,0.6)'
const EASE = [0.22, 1, 0.36, 1]

const FEATURED = [
  { title: 'Secure Messaging',     tag: 'Enterprise UX', href: '/messaging-redesign', image: '/images/SecureMessaging/securemessagingbgheroimage.webp' },
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

function Tile({ children, className = '', delay = 0, active, style }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
      whileHover={{ y: -4 }}
      style={style}
    >
      {children}
    </motion.div>
  )
}

const LiveDot = () => (
  <span className="relative flex h-2 w-2">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: '#22C55E' }} />
    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#22C55E' }} />
  </span>
)

export default function HeroBentoFull({ active = true }) {
  const [idx, setIdx] = useState(0)
  const time = useAustinTime()

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % FEATURED.length), 3600)
    return () => clearInterval(id)
  }, [])

  const current = FEATURED[idx]
  const card = 'rounded-2xl overflow-hidden'

  return (
    <div className="w-full max-w-[1400px] mx-auto grid grid-cols-2 lg:grid-cols-12 gap-3 lg:gap-4 lg:flex-1 lg:min-h-0 lg:grid-rows-[minmax(0,1fr)_auto]">

      {/* ── Headline ──────────────────────────────────────────────── */}
      <Tile
        active={active}
        delay={0.05}
        className={`${card} col-span-2 lg:col-span-7 flex flex-col justify-center gap-6 px-7 py-10 md:px-10`}
        style={{ backgroundColor: '#fff', border: '1px solid rgba(28,35,34,0.08)', minHeight: 280 }}
      >
        <div className="flex items-center gap-2">
          <LiveDot />
          <span className="font-sans text-[11px] uppercase tracking-[0.25em]" style={{ color: DIM }}>
            Stephen Hurt — Product Designer
          </span>
        </div>
        <h1
          className="font-display font-black tracking-tight"
          style={{ fontSize: 'clamp(2.2rem, 3.8vw, 3.8rem)', lineHeight: 1.04, color: INK }}
        >
          Designing products <span style={{ color: BLUE }}>22 million</span> people trust
        </h1>
        <p className="font-sans text-base md:text-lg leading-relaxed max-w-xl" style={{ color: DIM }}>
          I'm a product and interaction designer at Q2. Before UX, I spent ten years in motion design — learning to control where attention goes.
        </p>
      </Tile>

      {/* ── Featured project (auto-rotates) ───────────────────────── */}
      <Link to={current.href} className="col-span-2 lg:col-span-5 group block">
        <Tile
          active={active}
          delay={0.13}
          className={`${card} relative h-full`}
          style={{ backgroundColor: DARK, minHeight: 280 }}
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
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,15,20,0.8) 0%, rgba(13,15,20,0.12) 48%, rgba(13,15,20,0) 72%)' }} />
              <div className="absolute top-4 left-4">
                <span className="font-sans text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.14)', color: '#fff', backdropFilter: 'blur(6px)' }}>
                  {current.tag}
                </span>
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-sans text-[11px] uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>Featured work</p>
                <p className="font-display text-2xl font-bold text-white leading-tight">{current.title}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:rotate-45" style={{ backgroundColor: '#fff' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M1 12L12 1M12 1H3.5M12 1V9.5" stroke={INK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="absolute bottom-6 right-5 flex gap-1.5">
            {FEATURED.map((_, i) => (
              <span key={i} className="block rounded-full transition-all duration-300" style={{ width: i === idx ? 18 : 6, height: 6, backgroundColor: i === idx ? '#fff' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
        </Tile>
      </Link>

      {/* ── Stat: 22M (dark) ──────────────────────────────────────── */}
      <Tile
        active={active}
        delay={0.20}
        className={`${card} col-span-1 lg:col-span-2 flex flex-col justify-center px-5 py-6`}
        style={{ backgroundColor: DARK, minHeight: 124 }}
      >
        <p className="font-display font-black" style={{ fontSize: 'clamp(1.7rem, 2.4vw, 2.3rem)', color: '#fff', lineHeight: 1 }}>22M</p>
        <p className="font-sans text-xs mt-1.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Users impacted</p>
      </Tile>

      {/* ── Stat: 500+ ────────────────────────────────────────────── */}
      <Tile
        active={active}
        delay={0.25}
        className={`${card} col-span-1 lg:col-span-2 flex flex-col justify-center px-5 py-6`}
        style={{ backgroundColor: '#fff', border: '1px solid rgba(28,35,34,0.08)', minHeight: 124 }}
      >
        <p className="font-display font-black" style={{ fontSize: 'clamp(1.7rem, 2.4vw, 2.3rem)', color: INK, lineHeight: 1 }}>500+</p>
        <p className="font-sans text-xs mt-1.5" style={{ color: DIM }}>Financial institutions</p>
      </Tile>

      {/* ── Stat: 10yr ────────────────────────────────────────────── */}
      <Tile
        active={active}
        delay={0.30}
        className={`${card} col-span-2 lg:col-span-3 flex flex-col justify-center px-5 py-6`}
        style={{ backgroundColor: '#fff', border: '1px solid rgba(28,35,34,0.08)', minHeight: 124 }}
      >
        <p className="font-display font-black" style={{ fontSize: 'clamp(1.7rem, 2.4vw, 2.3rem)', color: INK, lineHeight: 1 }}>10yr</p>
        <p className="font-sans text-xs mt-1.5" style={{ color: DIM }}>Design career</p>
      </Tile>

      {/* ── Live Austin clock ─────────────────────────────────────── */}
      <Tile
        active={active}
        delay={0.35}
        className={`${card} col-span-1 lg:col-span-3 flex flex-col justify-between px-5 py-5`}
        style={{ backgroundColor: '#fff', border: '1px solid rgba(28,35,34,0.08)', minHeight: 124 }}
      >
        <div className="flex items-center gap-2">
          <LiveDot />
          <span className="font-sans text-[11px] uppercase tracking-widest" style={{ color: 'rgba(28,35,34,0.5)' }}>Austin, TX</span>
        </div>
        <div>
          <p className="font-display font-black tabular-nums" style={{ fontSize: 'clamp(1.2rem, 1.7vw, 1.6rem)', color: INK, lineHeight: 1 }}>{time}</p>
          <p className="font-sans text-xs mt-1" style={{ color: 'rgba(28,35,34,0.45)' }}>local time</p>
        </div>
      </Tile>

      {/* ── Q2 tile (blue) ────────────────────────────────────────── */}
      <Tile
        active={active}
        delay={0.40}
        className={`${card} col-span-1 lg:col-span-2 flex flex-col justify-between px-5 py-5`}
        style={{ backgroundColor: BLUE, minHeight: 124 }}
      >
        <span className="font-sans text-[11px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.6)' }}>Currently at</span>
        <div>
          <p className="font-display font-black text-white" style={{ fontSize: 'clamp(1.7rem, 2.4vw, 2.3rem)', lineHeight: 1 }}>Q2</p>
          <p className="font-sans text-[11px] mt-1.5" style={{ color: 'rgba(255,255,255,0.65)' }}>Enterprise banking</p>
        </div>
      </Tile>
    </div>
  )
}
