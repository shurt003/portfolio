import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion'
import CaseTLDR from '../../components/CaseTLDR'
import MagicSignalPipeline from '../../components/MagicSignalPipeline'
import usePageMeta from '../../hooks/usePageMeta'

// ── Palette ───────────────────────────────────────────────────────────────────
const BG          = '#0A0A0A'
const TEXT        = '#F2F2F0'
const DIM         = 'rgba(242,242,240,0.5)'
const DIMMER      = 'rgba(242,242,240,0.3)'
const ACCENT      = '#5B8DEA'
const ACCENT_35   = 'rgba(91,141,234,0.35)'
const RULE        = 'rgba(242,242,240,0.1)'
const RULE_STRONG = 'rgba(242,242,240,0.24)'   // dashed media-placeholder border (opacity of TEXT, not a new hue)

// ── Hero device screenshots (existing assets) ──────────────────────────────────
const SCREENS = Array.from({ length: 9 }, (_, i) =>
  i === 0 ? '/images/magicSignal/Group 124.png' : `/images/magicSignal/Group 124-${i}.png`
)

// ── Scroll-triggered motion ────────────────────────────────────────────────────
const fadeUp = {
  initial:     { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
}

const fadeIn = {
  initial:     { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
}

// ── Eyebrow label ──────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="font-sans text-xs tracking-[0.2em] uppercase mb-4" style={{ color: DIMMER }}>
      {children}
    </p>
  )
}

// ── Thin divider rule ───────────────────────────────────────────────────────────
function Rule() {
  return <div className="w-full h-px" style={{ backgroundColor: RULE }} />
}

/*
  MediaSlot — a single media container, pre-wired for the real asset.

  While `ready` is false (default) it renders a labeled placeholder showing the
  slot ID, a note, the aspect ratio, and the exact file path(s) to drop in — so
  the recording/export target is visible during a live walkthrough.

  To activate a slot once the asset exists: add the file at `src` (and `poster`
  for video) and set `ready`. No other change is needed. Video slots then render
  with autoplay / loop / muted / playsInline, a poster, lazy attachment (the
  <source> only mounts when the slot scrolls into view), and a prefers-
  reduced-motion fallback that shows the poster still instead of the video.

  Props:
    id      string  — visible slot label (e.g. "REC-01")
    note    string  — one-line description of what goes here
    kind    'video' | 'image'
    aspect  string  — CSS aspect-ratio (e.g. '9 / 19.5', '16 / 9')
    src     string  — final asset path (shown as a hint until `ready`)
    poster  string  — video poster / reduced-motion still
    alt     string  — alt / aria-label stub
    ready   boolean — flip to true when the asset is in place
*/
function MediaSlot({ id, note, kind = 'video', aspect = '9 / 19.5', specAspect, src = '', poster = '', alt = '', ready = false, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '200px' })     // triggers the lazy <source> mount, once
  const onscreen = useInView(ref)                                     // tracks current visibility, to pause offscreen loops
  const reduceMotion = useReducedMotion()

  // With many looping clips on one page, only the ones actually onscreen should be decoding.
  useEffect(() => {
    const v = ref.current
    if (onscreen) v?.play?.().catch(() => {})
    else v?.pause?.()
  }, [onscreen])

  // Placeholder — asset not dropped in yet
  if (!ready || !src) {
    return (
      <div
        ref={ref}
        role="img"
        aria-label={alt || `Media placeholder ${id}`}
        className={`relative w-full overflow-hidden rounded-2xl flex items-center justify-center text-center ${className}`}
        style={{ aspectRatio: aspect, minHeight: 'min-content', border: `1px dashed ${RULE_STRONG}`, backgroundColor: 'rgba(242,242,240,0.03)' }}
      >
        <div className="px-5 py-6">
          <p className="font-sans text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: ACCENT }}>{id}</p>
          {note && <p className="font-sans text-xs leading-relaxed mb-3 mx-auto" style={{ color: DIM, maxWidth: '32ch' }}>{note}</p>}
          <p className="font-mono text-[10px]" style={{ color: DIMMER }}>{kind} · {(specAspect || aspect).replace(/\s/g, '')}</p>
          {src && <p className="font-mono text-[10px] mt-1 break-all" style={{ color: DIMMER }}>{src}</p>}
          {kind === 'video' && poster && <p className="font-mono text-[10px] break-all" style={{ color: DIMMER }}>{poster}</p>}
        </div>
      </div>
    )
  }

  // Reduced motion, or a still image slot → render the poster / image
  if (kind === 'image' || reduceMotion) {
    return (
      <img
        ref={ref}
        src={kind === 'image' ? src : poster}
        alt={alt}
        loading="lazy"
        className={`w-full block rounded-2xl ${className}`}
        style={{ aspectRatio: aspect, objectFit: 'cover', border: `1px solid ${RULE_STRONG}` }}
      />
    )
  }

  // Video slot — lazily attach the source once in view
  return (
    <video
      ref={ref}
      aria-label={alt}
      poster={poster || undefined}
      autoPlay
      loop
      muted
      playsInline
      preload="none"
      className={`w-full block rounded-2xl ${className}`}
      style={{ aspectRatio: aspect, objectFit: 'cover', border: `1px solid ${RULE_STRONG}` }}
    >
      {inView && <source src={src} type="video/mp4" />}
    </video>
  )
}

// ── Scroll-synced exhibit swap (Design Approach + Signal Detail) ────────────────
// A pinned panel that swaps exhibit images as each numbered item scrolls into
// view. Crossfade ~300ms; hard cut under prefers-reduced-motion. Each state is
// a labeled MediaSlot placeholder (same convention as the REC/SYS slots): when
// the real capture lands at `src`, flip `ready` — no rewiring.
//
// The panel is sized for the section's tallest state (9/19.5); wider ratios
// letterbox inside it so the layout never jumps between swaps.

const DA_EXHIBITS = [
  { id: 'DA-01', aspect: '9 / 19.5', src: '/images/magicSignal/da-01.webp', ready: true, note: 'Sectors feed: scrollable sector cards, each with a thesis headline ("Tariffs Drive Materials Upside Amid Cautious Optimism"), a directional badge, background imagery, and a "View details" affordance.' },
  { id: 'DA-02', aspect: '9 / 19.5', src: '/images/magicSignal/da-02.webp', ready: true, note: 'Sector detail page (Technology): full-bleed hero image, sector name + BULLISH badge, thesis line, Net Premium Flow figure, Key Catalysts list visible below.' },
  { id: 'DA-03', aspect: '1190 / 1015', src: '/images/magicSignal/da-03.webp', ready: true, note: 'Single ticker analysis card, tight capture: NVDA with two mint Bullish confidence rings (Short Term 84%, Medium Term 76%) and one-sentence verdict.' },
  { id: 'DA-04', aspect: '9 / 19.5', src: '/images/magicSignal/da-04.webp', ready: true, note: 'Ticker analysis sheet, Movement tab (MSFT): "Short-term: NEUTRAL | Confidence: 54%" in plain text with its rationale paragraph.' },
]

const SD_EXHIBITS = [
  { id: 'SD-01', aspect: '1290 / 630', src: '/images/magicSignal/sd-01.webp', ready: true, note: 'Analysis sheet header crop (NVDA): ticker + live price + six timeframe performance values (green/red).' },
  { id: 'SD-02', aspect: '9 / 19.5', src: '/images/magicSignal/sd-02.webp', ready: true, note: 'Analysis sheet, Overview tab (NVDA): verdict narrative with 7-dot pagination, first dot active.' },
  { id: 'SD-03', aspect: '9 / 19.5', src: '/images/magicSignal/sd-03.webp', ready: true, note: 'Analysis sheet, Movement tab (NVDA): short-term and medium-term prediction cards, sixth pagination dot active.' },
  // Two-up state: both search modes render stacked while item 04 is active
  { id: 'SD-04', ready: true, note: 'Stock Analysis search: Quick View and Full Report modes.', stack: [
    { src: '/images/magicSignal/search-quickview.webp',  aspect: '1290 / 1101', alt: 'Stock Analysis search with Quick View selected: instant data pull for any ticker' },
    { src: '/images/magicSignal/search-fullreport.webp', aspect: '1290 / 1086', alt: 'Stock Analysis search with Full Report selected: a searched ticker triggers the entire pipeline' },
  ] },
]

const MOTION_EXHIBITS = [
  { id: 'REC-01', kind: 'video', aspect: '9 / 19.5', src: '/videos/magicSignal/rec-01.mp4', poster: '/images/magicSignal/rec-01-poster.webp', ready: true, note: 'Sector card → page morph: open, scroll, drag-to-close.' },
  { id: 'REC-02', kind: 'video', aspect: '9 / 19.5', src: '/videos/magicSignal/rec-02.mp4', poster: '/images/magicSignal/rec-02-poster.webp', ready: true, note: 'Alpha Signals sort switching.' },
  { id: 'REC-03', kind: 'video', aspect: '9 / 19.5', src: '/videos/magicSignal/rec-03.mp4', poster: '/images/magicSignal/rec-03-poster.webp', ready: true, note: 'Flow sheet scroll: rails, tug bars, balance beam, thermometers.' },
  { id: 'REC-04', kind: 'video', aspect: '9 / 19.5', src: '/videos/magicSignal/rec-04.mp4', poster: '/images/magicSignal/rec-04-poster.webp', ready: true, note: 'Streaming full report + dashboard progressive load.' },
]

// Scroll-spy for the pinned-exhibit sections: the active item is whichever
// container sits closest to the viewport's vertical center, measured on each
// scroll frame. Geometry instead of viewport-enter events, because a fast
// upward scroll can batch two enters into one IntersectionObserver callback,
// which delivers them in document order — the lower item wins and the item
// actually under the center stays inactive until the next enter fires.
function useScrollSpy(itemRefs) {
  const [active, setActive] = useState(0)
  useEffect(() => {
    let ticking = false
    const measure = () => {
      ticking = false
      const center = window.innerHeight / 2
      let best = 0
      let bestDist = Infinity
      itemRefs.current.forEach((el, i) => {
        if (!el) return
        const r = el.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - center)
        if (d < bestDist) { bestDist = d; best = i }
      })
      setActive(prev => (prev === best ? prev : best))
    }
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(measure) }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    measure()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [itemRefs])
  return active
}

function ExhibitSwap({ states, active }) {
  const reduceMotion = useReducedMotion()
  const s = states[active]

  return (
    <div className="mx-auto w-full" style={{ maxWidth: 320 }}>
      <div className="relative w-full" style={{ aspectRatio: '9 / 19.5' }}>
        <AnimatePresence>
          <motion.div
            key={s.id}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {s.stack ? (
              <div className="w-full flex flex-col justify-center gap-3">
                {s.stack.map((img) => (
                  <MediaSlot
                    key={img.src}
                    id={s.id}
                    kind="image"
                    aspect={img.aspect}
                    note={s.note}
                    src={img.src}
                    alt={img.alt}
                    ready={s.ready}
                    className="w-full"
                  />
                ))}
              </div>
            ) : (
              <MediaSlot
                id={s.id}
                kind={s.kind || 'image'}
                aspect={s.ready ? s.aspect : '9 / 19.5'}
                specAspect={s.aspect}
                note={s.note}
                src={s.src}
                poster={s.poster}
                alt={s.note}
                ready={s.ready}
                className="w-full"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Numbered divider row (signature two-column decision list) ───────────────────
function DecisionRow({ num, title, body, note, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-5 py-8 border-b"
      style={{ borderColor: RULE }}
    >
      <span className="font-display text-sm font-bold flex-shrink-0 mt-0.5 w-7" style={{ color: ACCENT, opacity: 0.6 }}>
        {num}
      </span>
      <div>
        <p className="font-display text-base font-bold mb-2" style={{ color: TEXT }}>{title}</p>
        <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{body}</p>
        {note && <p className="font-sans text-xs mt-3" style={{ color: DIMMER }}>{note}</p>}
      </div>
    </motion.div>
  )
}

// ── Ghost-numeral cell (Problem grid) ───────────────────────────────────────────
function GhostCell({ num, title, body, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="p-8 md:p-10"
      style={{ backgroundColor: BG }}
    >
      <p className="font-display text-4xl font-black mb-5" style={{ color: ACCENT_35 }}>{num}</p>
      <p className="font-display text-xl font-bold mb-3" style={{ color: TEXT }}>{title}</p>
      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{body}</p>
    </motion.div>
  )
}

// ── Accent-rule card (Outcome / Reflection) ─────────────────────────────────────
function RuleCard({ label, body, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="p-10"
      style={{ backgroundColor: BG }}
    >
      <div className="w-8 h-px mb-6" style={{ backgroundColor: ACCENT, opacity: 0.6 }} />
      <p className="font-display text-xl font-bold mb-3" style={{ color: TEXT }}>{label}</p>
      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{body}</p>
    </motion.div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────────
export default function MagicSignal() {
  usePageMeta(
    'Magic Signal by Stephen Hurt',
    'A self-initiated AI stock-analysis app, designed, built, and shipped solo to iOS & Android, and the AI fluency it brought back to my product work at Q2.'
  )
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 800], ['0%', '-18%'])
  const approachRefs = useRef([])
  const signalRefs = useRef([])
  const motionRefs = useRef([])
  const approachActive = useScrollSpy(approachRefs)
  const signalActive = useScrollSpy(signalRefs)
  const motionActive = useScrollSpy(motionRefs)

  // Montserrat (the app's typeface) — loaded only for the DL-01 design-language specimen
  useEffect(() => {
    const id = 'ms-montserrat-specimen'
    if (document.getElementById(id)) return
    const link = document.createElement('link')
    link.id = id
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@100..900&display=swap'
    document.head.appendChild(link)
  }, [])

  return (
    <main style={{ backgroundColor: BG, color: TEXT }}>

      {/* ── HERO (unchanged layout + device mockups) ──────────────────────────── */}
      <section className="sticky top-0 z-0 h-screen overflow-hidden flex flex-col justify-end">
        <div className="absolute inset-0" style={{
          backgroundImage: `url('/images/magicSignal/magicSignalHero.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }} />
        <motion.div
          className="absolute pointer-events-none flex items-center justify-end"
          style={{ y: bgY, top: '-20%', bottom: '-20%', left: 0, right: 0 }}
        >
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to right, rgba(4,4,18,0.70) 0%, rgba(4,4,18,0.25) 40%, rgba(4,4,18,0.00) 58%)`,
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-48" style={{
            background: `linear-gradient(to bottom, transparent, #0A0A0A)`,
          }} />

          <div className="hidden md:flex items-start pr-14" style={{ marginTop: '-4vh' }}>
            {[
              { idx: 1, mt: 60, ml: 0,   zIndex: 1 },
              { idx: 3, mt: 0,  ml: -28, zIndex: 3 },
              { idx: 6, mt: 80, ml: -28, zIndex: 1 },
            ].map(({ idx, mt, ml, zIndex }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flex-shrink-0"
                style={{ width: 'clamp(225px, 19.5vw, 300px)', marginTop: mt, marginLeft: ml, zIndex, position: 'relative' }}
                aria-hidden={i !== 1 ? 'true' : undefined}
              >
                <img
                  src={SCREENS[idx]}
                  alt={i === 1 ? 'Magic Signal app: the AI stock-signal interface, verdict-first with a signal-strength ring' : ''}
                  className="w-full h-auto block"
                  style={{ borderRadius: '3rem', boxShadow: '0 40px 80px rgba(0,0,0,0.8)' }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10 px-8 md:px-14 pb-16 md:pb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-2 mb-7"
          >
            {['Product Design', 'Founder', 'Mobile'].map(t => (
              <span
                key={t}
                className="font-sans text-xs px-3 py-1.5 rounded-full border"
                style={{ borderColor: 'rgba(91,141,234,0.4)', color: 'rgba(91,141,234,0.9)' }}
              >
                {t}
              </span>
            ))}
          </motion.div>

          {/* Mask for the rise-in: spacing lives outside the overflow-hidden box
              (mb-6 on the wrapper, not the h1) so the hidden text can't peek
              through the extra height before the animation starts. pb-4 stays
              inside for descenders; 140% clears text height + padding at every
              viewport size. */}
          <div className="overflow-hidden pb-4 mb-6">
            <motion.h1
              initial={{ y: '140%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black leading-[0.88]"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', color: TEXT }}
            >
              Magic Signal
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-lg md:text-xl leading-relaxed max-w-xl"
            style={{ color: DIM }}
          >
            An app nobody asked me to build, for a problem I lived daily, and the hands-on AI fluency it gave me that now shapes how I approach product design at Q2.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: DIMMER }}
        >
          <div className="w-px h-12 overflow-hidden">
            <motion.div
              className="w-full h-full"
              style={{ backgroundColor: DIMMER }}
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.4 }}
            />
          </div>
        </motion.div>
      </section>

      <div className="relative z-10" style={{ backgroundColor: BG }}>

        {/* ── TL;DR ───────────────────────────────────────────────────────────── */}
        <CaseTLDR
          colors={{ text: TEXT, dim: DIM, accent: ACCENT, surface: 'rgba(242,242,240,0.04)', rule: RULE }}
          summary={`A self-initiated app for a problem I lived as a retail investor: institutional options data, real-time research, and the AI's read on it, in one verdict-first view. I designed it, built it, shipped it solo to both app stores, and ran it as a real subscription business. I didn't take the model's confidence scores on faith either: a paper-trading loop ran 355 trades against the live market, and high-confidence signals closed profitable 62.7% of the time. Five months after launch I ran the numbers against where the market was heading and sunset it deliberately. The app is gone. The judgment and AI fluency it gave me moved straight into my production work at Q2.`}
          stats={[
            { value: 'Solo', label: 'Designed, built & shipped end-to-end' },
            { value: '2', label: 'App stores: iOS & Android' },
            { value: '50', label: 'Paying subscribers at peak' },
            { value: '5 mo', label: 'Live Sept 2025 to Feb 2026' },
          ]}
        />

        {/* ── META STRIP ──────────────────────────────────────────────────────── */}
        <section className="px-8 md:px-14 py-14 border-t border-b" style={{ borderColor: RULE }}>
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {[
                { label: 'Role',     value: 'Product Design & Development, solo and end-to-end' },
                { label: 'Platform', value: 'iOS & Android via Capacitor' },
                { label: 'Timeline', value: 'Built early 2025, live in both stores September 2025 to February 2026' },
                { label: 'Status',   value: 'Shipped & sunsetted; what I learned went straight into AI work at Q2' },
              ].map(item => (
                <div key={item.label}>
                  <p className="font-sans text-xs tracking-[0.18em] uppercase mb-3" style={{ color: DIMMER }}>
                    {item.label}
                  </p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── THE PROBLEM ─────────────────────────────────────────────────────── */}
        <section className="px-8 md:px-14 pt-28 pb-0">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp}>
              <SectionLabel>The Problem</SectionLabel>
            </motion.div>

            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
              <motion.h2
                {...fadeUp}
                className="font-display font-black leading-[0.9]"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', color: TEXT }}
              >
                Raw data and AI insight, but never in the same place.
              </motion.h2>

              <motion.div {...fadeUp} className="space-y-5 pt-2" style={{ color: DIM }}>
                <p className="font-sans text-base leading-relaxed">
                  Magic Signal wasn't a client project or a design brief. It was built for me. As an active retail investor I kept hitting the same wall: AI tools could explain market concepts clearly but had no access to live data. Platforms like Unusual Whales surfaced real-time options flow, often a leading indicator of institutional moves, but interpreting it takes expertise most retail investors don't have.
                </p>
                <p className="font-sans text-base leading-relaxed">
                  I built the tool I wanted to exist. No stakeholder review, no PRD. Eighteen months of being annoyed by this exact workflow, a clear idea of what would fix it, and the decision to ship it.
                </p>
              </motion.div>
            </div>

            <motion.div
              {...fadeUp}
              className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px"
              style={{ backgroundColor: RULE }}
            >
              {[
                { num: '01', title: 'Data without context', body: 'Retail investors could find options flow data. They couldn\'t interpret it without 1–2 hours of additional research per ticker, and unusual activity hits several tickers a day.' },
                { num: '02', title: 'Asking an AI is manual work', body: 'Even an AI with live research access only answers when you ask. You\'d have to notice the unusual activity yourself, then run the research one ticker at a time while the window closes. Nobody is watching for you.' },
                { num: '03', title: 'Being early is the whole edge', body: 'Unusual flow shows up before the move plays out. That move can take 1–5 days, sometimes 1–4 weeks. The edge only lasts while few people have connected the dots. Find out after it\'s on every feed and you\'re trading a move that\'s already priced in.' },
                { num: '04', title: 'No mobile product bridged the gap', body: 'Nothing I found combined live data, real-time news, and an AI read on it in one actionable view.' },
              ].map((item, i) => (
                <GhostCell key={item.num} num={item.num} title={item.title} body={item.body} delay={i * 0.08} />
              ))}
            </motion.div>

            <motion.p
              {...fadeUp}
              className="mt-16 font-display font-bold leading-tight"
              style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.6rem)', color: TEXT, maxWidth: '26ch' }}
            >
              Point 02 set the brief. Nobody was watching for you, so the product watches, and pushes the moment flow turns unusual.
            </motion.p>
          </div>
        </section>

        {/* ── DESIGN APPROACH ─────────────────────────────────────────────────── */}
        <section className="px-8 md:px-14 pt-32 pb-0">
          <div className="max-w-6xl mx-auto">
            <Rule />
            <div className="pt-20">
              <motion.div {...fadeUp}>
                <SectionLabel>Design Approach</SectionLabel>
                <h2
                  className="font-display font-black leading-[0.88] mt-2"
                  style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', color: TEXT, maxWidth: '18ch' }}
                >
                  Verdict first. Data second.
                </h2>
              </motion.div>

              <motion.div {...fadeUp} className="mt-16 space-y-5 max-w-3xl" style={{ color: DIM }}>
                <p className="font-sans text-base leading-relaxed">
                  The core design decision was hierarchy. Every existing tool put raw data front and center: tables of options flow, columns of numbers, industry shorthand. I know because I was the user: I'd arrive informed, leave confused, and let the window close without acting.
                </p>
                <p className="font-sans text-base leading-relaxed">
                  Magic Signal inverted this. The primary surface is one verdict: one sentence, one direction, bullish or bearish. The AI output, the options data, the news context are all present, but subordinate. You read the verdict in under 30 seconds. You drill into sources if you want to.
                </p>
                <p className="font-sans text-base leading-relaxed">
                  Inverting the hierarchy has an obvious risk: if you lead with a machine's opinion, people may follow it blindly. Most of the design system exists to manage that risk. Confidence is always visible, uncertainty is stated in plain language, and every claim can be traced to its source data in two taps.
                </p>
              </motion.div>

              {/* Pinned exhibit: swaps card → sheet → card → sheet as each decision scrolls in */}
              <div className="mt-20 grid grid-cols-1 md:grid-cols-[minmax(0,400px)_1fr] gap-14 md:gap-20 items-start">
                <motion.div {...fadeIn} className="md:sticky md:top-24">
                  <ExhibitSwap states={DA_EXHIBITS} active={approachActive} />
                </motion.div>

                <div className="space-y-0 md:py-24">
                  {[
                    { num: '01', title: 'Verdict over data', body: 'One sentence leads every card. The full analysis lives one tap deeper, present but never competing with the verdict.' },
                    { num: '02', title: 'The same rule at every level', body: 'Open the sector and the hierarchy repeats: thesis first, then the flow number, then catalysts, then the full AI briefing. Depth increases as you scroll. The conclusion never moves from the top.' },
                    { num: '03', title: 'Confidence is visual', body: 'Every verdict carries two rings, short-term and medium-term conviction, encoded as arc-fill in the direction\'s color. You read how full the ring is before you read a single word. That ordering is deliberate. The number itself is the model\'s own stated confidence. I didn\'t take it on faith either, which is why I built the validation loop further down this page.' },
                    { num: '04', title: 'Honesty about uncertainty', body: 'NEUTRAL is a verdict in its own right: the model reads the stock as directionally flat. Expect chop, wait for a catalyst. On the card its ring renders gray. Confidence is a separate axis, how sure the model is of whichever tag it gave, so a neutral call at 54% is the app saying "probably flat, and not even sure of that." Letting it say so plainly instead of forcing a direction was the single best trust decision in the product.' },
                  ].map((p, i) => (
                    <motion.div
                      key={p.num}
                      ref={el => { approachRefs.current[i] = el }}
                      className="md:min-h-[38vh] flex items-start"
                      style={{ opacity: 1 }}
                      animate={{ opacity: approachActive === i ? 1 : 0.45 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="w-full">
                        <DecisionRow num={p.num} title={p.title} body={p.body} delay={0} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ONBOARDING ──────────────────────────────────────────────────────── */}
        <section className="px-8 md:px-14 pt-32 pb-0">
          <div className="max-w-6xl mx-auto">
            <Rule />
            <div className="pt-20">
              <motion.div {...fadeUp}>
                <SectionLabel>Onboarding</SectionLabel>
                <h2
                  className="font-display font-black leading-[0.88] mt-2"
                  style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', color: TEXT, maxWidth: '20ch' }}
                >
                  The product proves itself before setup is done.
                </h2>
              </motion.div>

              <motion.p {...fadeUp} className="mt-16 font-sans text-base leading-relaxed max-w-3xl" style={{ color: DIM }}>
                Most onboarding flows explain an app before they let you use it. I wanted new users to see Magic Signal work, not read about it. The moment you tap your first watchlist pick, the pipeline starts on it quietly in the background while you're still choosing the rest of your list. By the time you land on the feed, that first ticker already has a verdict waiting, not a loading spinner.
              </motion.p>

              <motion.div {...fadeIn} className="mt-14 max-w-[300px] mx-auto">
                <MediaSlot
                  id="OB-01"
                  kind="video"
                  aspect="9 / 19.5"
                  note="Onboarding: picking a first watchlist ticker through to its verdict already waiting on the feed."
                  src="/videos/magicSignal/ob-01.mp4"
                  poster="/images/magicSignal/ob-01-poster.webp"
                  alt="Onboarding screen recording: a new user picks their first watchlist ticker, and by the time onboarding ends its verdict is already waiting on the feed."
                  ready
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── THE SYSTEM ──────────────────────────────────────────────────────── */}
        <section className="px-8 md:px-14 pt-32 pb-0">
          <div className="max-w-6xl mx-auto">
            <Rule />
            <div className="pt-20">
              <motion.div {...fadeUp}>
                <SectionLabel>The System</SectionLabel>
                <h2
                  className="font-display font-black leading-[0.88] mt-2"
                  style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', color: TEXT, maxWidth: '20ch' }}
                >
                  Every screen is the last mile of a pipeline.
                </h2>
              </motion.div>

              <motion.div {...fadeUp} className="mt-16 space-y-5 max-w-3xl" style={{ color: DIM }}>
                <p className="font-sans text-base leading-relaxed">
                  Every five minutes during market hours, a screener I configured inside Unusual Whales flags tickers with genuinely unusual activity. Alerts only fired for tickers that cleared thresholds I tuned, put/call ratio among them. Each one is researched by Perplexity in two passes, live news and company fundamentals, then handed to GPT-4.1 with the raw options data to make the call. The result lands in the app and, when it clears a user's confidence threshold, in a push notification. About thirty serverless functions, three vendors, one verdict.
                </p>
              </motion.div>

              {/* MEDIA[SYS-01] — code-built animated pipeline schematic, leading the section */}
              <motion.div {...fadeIn} className="mt-14">
                <MagicSignalPipeline />
              </motion.div>

              <motion.p {...fadeUp} className="mt-14 font-sans text-base leading-relaxed max-w-3xl" style={{ color: DIM }}>
                When every screen sits at the end of a metered pipeline, cost and latency become design materials. Some of the most important design decisions in Magic Signal never appear on a screen.
              </motion.p>

              {/* Ledger: full-width rows, oversized numerals */}
              <div className="mt-14">
                {[
                  { num: '01', title: 'Cost is a design constraint', body: 'Filtering started at the source: the Unusual Whales screener only emitted tickers that cleared my criteria, so noise never touched the paid research or verdict stages at all. Downstream, recent analyses are cached on-device and on-demand full reports are rate-limited to 20 per day, with the reset time stated in the error message.' },
                  { num: '02', title: 'Every wait has a job', body: 'A full analysis takes real time. On-demand full reports stream in token by token, so you watch the answer being written. The feed loads in progressive batches while data preloads behind the splash screen. Onboarding quietly analyzes your first watchlist pick while you\'re still choosing the rest. By the time you finish, the result is waiting.' },
                  { num: '03', title: 'Structured output is a contract', body: 'GPT-4.1 returns structured markdown against a rigid contract: a verdict line, two confidence scores, named sections. A tiered parser with fallbacks for every legacy shape the model ever produced turns that prose into UI. The format was the interface, so prompt design was interface design.' },
                  { num: '04', title: 'One source down isn\'t zero', body: 'Three vendors feed one verdict, and any of them can fail mid-market. A failed source doesn\'t kill the signal: the analysis continues on what\'s available, confidence drops to match, and the gap is named in the output.' },
                  { num: '05', title: 'Alerts have a threshold, not a firehose', body: 'Users set a confidence bar and a watchlist. Notifications only fire past the bar, and deep-link straight into the exact analysis that triggered them.' },
                ].map((p, i) => (
                  <motion.div
                    key={p.num}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-[4rem_1fr] md:grid-cols-[7rem_minmax(0,17rem)_1fr] gap-x-6 md:gap-x-12 gap-y-3 py-10"
                    style={{ borderTop: `1px solid ${RULE}` }}
                  >
                    <span className="font-display font-black leading-none" style={{ fontSize: 'clamp(2.6rem, 5vw, 4rem)', color: ACCENT_35 }}>
                      {p.num}
                    </span>
                    <p className="font-display text-lg md:text-xl font-bold leading-snug self-start" style={{ color: TEXT }}>{p.title}</p>
                    <p className="font-sans text-sm md:text-base leading-relaxed col-start-2 md:col-start-3" style={{ color: DIM }}>{p.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── VALIDATION ──────────────────────────────────────────────────────── */}
        <section className="px-8 md:px-14 pt-32 pb-0">
          <div className="max-w-6xl mx-auto">
            <Rule />
            <div className="pt-20">
              <motion.div {...fadeUp}>
                <SectionLabel>Validation</SectionLabel>
                <h2
                  className="font-display font-black leading-[0.88] mt-2"
                  style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', color: TEXT, maxWidth: '18ch' }}
                >
                  I made the signal prove itself.
                </h2>
              </motion.div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-12 md:gap-20 items-start">
                <motion.div {...fadeUp}>
                  <p className="font-display font-black leading-[0.85]" style={{ fontSize: 'clamp(4rem, 13vw, 9rem)', color: TEXT }}>
                    62.7<span style={{ fontSize: '0.44em' }}>%</span>
                  </p>
                  <p className="font-sans text-base mt-4 leading-relaxed" style={{ color: DIM, maxWidth: '26ch' }}>
                    of high-confidence signals closed profitable when tested against the live market.
                  </p>
                </motion.div>

                <motion.div {...fadeUp} className="space-y-5" style={{ color: DIM }}>
                  <p className="font-sans text-base leading-relaxed">
                    The confidence scores came straight from the model, so I built a loop to test whether they meant anything. An automation layer wired to Alpaca (paper trading) watched every new verdict; when the short-term call was bullish and cleared a set confidence threshold of 85%, it auto-bought a single share, held it for five trading days, then auto-sold and recorded the result. Long only. It never shorted the bearish calls. Every trade stored the exact confidence that triggered it next to its realized P&L, so I could line the model's certainty up against what the market actually did.
                  </p>
                  <p className="font-sans text-base leading-relaxed">
                    The loop ran 355 trades over the five months the app was live. One whole share per signal, by design: this was a validation instrument, not a trading strategy. So the number is directional evidence that the high-confidence signal carried an edge, not a performance claim. It was the closest thing the product had to a ground-truth check on its own core promise.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SIGNAL DETAIL (phone + annotations) ─────────────────────────────── */}
        <section className="px-8 md:px-14 pt-32 pb-0">
          <div className="max-w-6xl mx-auto">
            <Rule />
            <div className="pt-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              {/* Pinned exhibit: swaps as each annotation scrolls in */}
              <motion.div {...fadeIn} className="md:sticky md:top-24">
                <ExhibitSwap states={SD_EXHIBITS} active={signalActive} />
              </motion.div>

              <div className="space-y-0 pt-2">
                <motion.div {...fadeUp}>
                  <SectionLabel>Signal Detail</SectionLabel>
                  <h2
                    className="font-display font-black leading-[0.9] mb-10"
                    style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: TEXT }}
                  >
                    The interface reads it for you.
                  </h2>
                </motion.div>

                <div className="space-y-0">
                  {[
                    { num: '01', title: 'Orientation before opinion', body: 'Ticker, live price, and six performance windows stay pinned at the top. You know where you are before anyone tells you what to think.' },
                    { num: '02', title: 'One verdict first', body: 'Overview is page one: the verdict in plain language, readable in under 30 seconds.' },
                    { num: '03', title: 'Paginated source sections', body: 'The verdict is one of seven pages. Unusual activity, technicals, news context, sentiment, predictions, and risks each live one swipe deeper: there if you want them, never in the way.' },
                    { num: '04', title: 'On-demand analysis', body: 'The feed only shows what the screener flags, and users shouldn\'t be capped at that. Search was in the plan from the start, but I cut it from v1 to get the watching loop live sooner and shipped it as a post-launch update. Any ticker, on demand: Quick View pulls the raw Unusual Whales data instantly; Full Report runs the entire pipeline and lands in the same verdict-first sheet.' },
                  ].map((item, i) => (
                    <motion.div
                      key={item.num}
                      ref={el => { signalRefs.current[i] = el }}
                      className="md:min-h-[30vh] flex items-start"
                      style={{ opacity: 1 }}
                      animate={{ opacity: signalActive === i ? 1 : 0.45 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="w-full">
                        <DecisionRow num={item.num} title={item.title} body={item.body} delay={0} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── DESIGN LANGUAGE ─────────────────────────────────────────────────── */}
        <section className="px-8 md:px-14 pt-32 pb-0">
          <div className="max-w-6xl mx-auto">
            <Rule />
            <div className="pt-20">
              <motion.div {...fadeUp}>
                <SectionLabel>Design Language</SectionLabel>
                <h2
                  className="font-display font-black leading-[0.88] mt-2"
                  style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', color: TEXT, maxWidth: '16ch' }}
                >
                  Color is rationed to the signal.
                </h2>
              </motion.div>

              <motion.p {...fadeUp} className="mt-16 font-sans text-base leading-relaxed max-w-3xl" style={{ color: DIM }}>
                The visual system is deliberately small: one dark surface, one typeface, and a color budget spent almost entirely on meaning. In a product whose whole job is "which direction, how confident," decoration competes with the answer.
              </motion.p>

              {/* MEDIA[DL-01] — live design-language specimen (coded, not a static image) */}
              <motion.div
                {...fadeIn}
                className="mt-16 rounded-2xl p-8 md:p-10"
                style={{ border: `1px solid ${RULE}`, backgroundColor: 'rgba(242,242,240,0.02)' }}
              >
                {/* Swatch row — role labels, not color names */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {[
                    { role: 'Surface',    hex: '#0B1119', fill: '#0B1119' },
                    { role: 'Foreground', hex: '#F5FBEF', fill: '#F5FBEF' },
                    { role: 'Bullish',    hex: '#47E5BC', fill: '#47E5BC' },
                    { role: 'Bearish',    hex: '#E5484B', fill: '#E5484B' },
                    { role: 'Neutral',    hex: '#999999', fill: '#999999' },
                    { role: 'Caution',    hex: '#FACC15', fill: '#FACC15' },
                  ].map(s => (
                    <div key={s.role}>
                      <div
                        className="w-full rounded-xl mb-3"
                        style={{ height: 72, backgroundColor: s.fill, border: `1px solid ${RULE_STRONG}` }}
                      />
                      <p className="font-sans text-[11px] tracking-[0.14em] uppercase" style={{ color: TEXT }}>{s.role}</p>
                      <p className="font-mono text-[11px] mt-0.5" style={{ color: s.tbd ? ACCENT : DIM }}>{s.hex}</p>
                    </div>
                  ))}
                </div>

                <div className="h-px my-9" style={{ backgroundColor: RULE }} />

                {/* Type scale — Montserrat, the app's one typeface (the product's real tiers) */}
                <div style={{ fontFamily: "'Montserrat', system-ui, sans-serif" }}>
                  {[
                    { label: 'Page Title',        weight: 700, size: 'clamp(1.5rem, 3vw, 1.875rem)', ls: '-0.01em', sample: 'Analysis Feed' },
                    { label: 'Ticker + Price',    weight: 700, size: '1.5rem', ls: '-0.01em', tabular: true,
                      sample: <span className="inline-flex items-baseline gap-4"><span>NVDA</span><span>$187.42</span></span> },
                    { label: 'Card Title',        weight: 600, size: '1.125rem', ls: '0', sample: 'Volume Flow' },
                    { label: 'Body',              weight: 400, size: 'clamp(0.875rem, 1.4vw, 0.9375rem)', ls: '0', sample: 'One sentence, one direction. Read it in under 30 seconds.' },
                    { label: 'Eyebrow / Caption', weight: 600, size: '0.72rem', ls: '0.18em', uppercase: true, muted: true, sample: 'POSITION' },
                  ].map((t) => (
                    <div
                      key={t.label}
                      className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-4"
                      style={{ borderBottom: `1px solid ${RULE}` }}
                    >
                      <span className="font-sans text-[10px] tracking-[0.14em] uppercase flex-shrink-0" style={{ color: DIMMER, width: 116 }}>
                        {t.label}
                      </span>
                      <span style={{
                        color: t.muted ? DIM : TEXT,
                        fontWeight: t.weight,
                        fontSize: t.size,
                        lineHeight: 1.15,
                        letterSpacing: t.ls,
                        textTransform: t.uppercase ? 'uppercase' : 'none',
                        fontVariantNumeric: t.tabular ? 'tabular-nums' : 'normal',
                      }}>
                        {t.sample}
                      </span>
                    </div>
                  ))}
                  {/* Data — Montserrat Bold, tabular figures */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6 py-4">
                    <span className="font-sans text-[10px] tracking-[0.14em] uppercase flex-shrink-0" style={{ color: DIMMER, width: 116 }}>
                      Data
                    </span>
                    <span
                      className="inline-flex gap-7"
                      style={{ color: TEXT, fontWeight: 700, fontSize: 'clamp(1.1rem, 2.4vw, 1.6rem)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.01em' }}
                    >
                      <span style={{ color: '#47E5BC' }}>+132.2%</span>
                      <span>0.58</span>
                      <span>$45.46</span>
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* The rules behind the specimen — annotation columns, no numbering */}
              <motion.div {...fadeUp} className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                {[
                  { title: 'Two colors carry direction', body: 'Mint (#47E5BC) always means bullish. Coral (#E5484B) always means bearish. A neutral read isn\'t a third color: on a ticker\'s sentiment ring it goes gray, a flat read rather than a new direction. Amber is a shared attention accent instead of a single job: high volatility, mixed signals, relative-volume warnings, earnings moves, the neutral sector badge. In the signal layer, color still never appears decoratively; it carries information.' },
                  { title: 'One typeface, weight does the work', body: 'Montserrat variable, 100–900, for everything. Hierarchy comes from weight and scale, never from a second family. Tabular numerals are reserved for price and ticker figures, where alignment actually matters, not every number on the page.' },
                  { title: 'Depth without new hues', body: 'The base is a near-black blue (#0B1119); cards sit as a slightly lifted solid surface over it, with hairline borders instead of a new color. Shadows show up on buttons and overlays, not the base layer, and radius scales down for denser components. Depth reads through layering more than elevation.' },
                  { title: 'Redundant by rule', body: 'Direction is never expressed by color alone; every signal pairs color with a text label, so the message survives for anyone who can\'t read color (WCAG 1.4.1). Dimmed states step down through opacity, not a swap to a separate color, so the same hue holds everywhere it appears.' },
                ].map((r) => (
                  <div key={r.title}>
                    <div className="w-8 h-px mb-4" style={{ backgroundColor: ACCENT, opacity: 0.6 }} />
                    <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                      <span className="font-display text-base font-bold block mb-2" style={{ color: TEXT }}>{r.title}</span>
                      {r.body}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── MOTION ──────────────────────────────────────────────────────────── */}
        <section className="px-8 md:px-14 pt-32 pb-0">
          <div className="max-w-6xl mx-auto">
            <Rule />
            <div className="pt-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                {/* Pinned exhibit: swaps as each annotation scrolls in */}
                <motion.div {...fadeIn} className="md:sticky md:top-24">
                  <ExhibitSwap states={MOTION_EXHIBITS} active={motionActive} />
                </motion.div>

                <div className="space-y-0 pt-2">
                  <motion.div {...fadeUp}>
                    <SectionLabel>Motion</SectionLabel>
                    <h2
                      className="font-display font-black leading-[0.9] mb-6"
                      style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: TEXT }}
                    >
                      On a phone, hierarchy happens over time.
                    </h2>
                    <p className="font-sans text-base leading-relaxed" style={{ color: DIM }}>
                      A phone screen can't show importance the way a dashboard can. There isn't room. What appears first reads as most important. What moves together reads as related. Motion is how the interface explains its own structure.
                    </p>
                  </motion.div>

                  <div className="space-y-0 mt-6">
                    {[
                      { num: '01', title: 'Cards become places', body: 'Tapping a sector expands the card itself into a full-screen page: the image you touched becomes the hero. Quick looks live in sheets; destinations earn a transition.' },
                      { num: '02', title: 'Re-sorting is information', body: 'Change the ranking metric and the cards physically glide to their new positions while the active filter pill slides between chips.' },
                      { num: '03', title: 'Numbers arrive, they don\'t appear', body: 'Panels reveal as you reach them; values count up from zero; markers spring onto their scales.' },
                      { num: '04', title: 'Waiting is part of the interface', body: 'Confidence rings sweep on entry, staggered so the eye follows one card at a time, and panels reveal in reading order as you scroll.' },
                    ].map((item, i) => (
                      <motion.div
                        key={item.num}
                        ref={el => { motionRefs.current[i] = el }}
                        className="md:min-h-[30vh] flex items-start"
                        style={{ opacity: 1 }}
                        animate={{ opacity: motionActive === i ? 1 : 0.45 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="w-full">
                          <DecisionRow num={item.num} title={item.title} body={item.body} delay={0} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Motion tokens — the spec behind the recordings above */}
              <motion.div {...fadeUp} className="mt-20">
                <p className="font-sans text-xs tracking-[0.2em] uppercase mb-6" style={{ color: DIMMER }}>
                  Motion tokens
                </p>
                <div style={{ borderTop: `1px solid ${RULE}` }}>
                  {/* header (desktop) */}
                  <div
                    className="hidden md:grid md:grid-cols-[0.9fr_1.2fr_1.6fr] gap-6 py-4"
                    style={{ borderBottom: `1px solid ${RULE}` }}
                  >
                    {['Token', 'Value', 'Job'].map(h => (
                      <p key={h} className="font-sans text-xs tracking-[0.16em] uppercase" style={{ color: DIMMER }}>{h}</p>
                    ))}
                  </div>
                  {[
                    { token: 'spring.morph',   value: 'stiffness 300 / damping 33', job: 'shared-element card→page, rail markers' },
                    { token: 'spring.sort',    value: 'stiffness 380 / damping 34', job: 'list reshuffle (FLIP), filter pill slide' },
                    { token: 'spring.settle',  value: 'stiffness 130 / damping 22', job: 'panel content settling into place' },
                    { token: 'spring.weight',  value: 'stiffness 60 / damping 12',  job: 'the balance beam (deliberately underdamped so it feels heavy)' },
                    { token: 'ease.reveal',    value: 'cubic-bezier(0.22, 1, 0.36, 1), ~550ms', job: 'scroll-triggered panel entry' },
                    { token: 'stagger.panel',  value: '60ms between children, 220ms after morph', job: 'one-thing-at-a-time reading order' },
                    { token: 'duration.count', value: '~1.1s', job: 'number count-ups' },
                    { token: 'ring.sweep',     value: '455ms ease-out, 78ms sibling offset', job: 'confidence rings' },
                  ].map((r, i) => (
                    <motion.div
                      key={r.token}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                      className="grid grid-cols-1 md:grid-cols-[0.9fr_1.2fr_1.6fr] gap-1 md:gap-6 py-5"
                      style={{ borderBottom: `1px solid ${RULE}` }}
                    >
                      <p className="font-mono text-sm" style={{ color: TEXT }}>{r.token}</p>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                        <span className="md:hidden font-sans text-[10px] tracking-[0.12em] uppercase mr-2" style={{ color: DIMMER }}>Value</span>
                        {r.value}
                      </p>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                        <span className="md:hidden font-sans text-[10px] tracking-[0.12em] uppercase mr-2" style={{ color: DIMMER }}>Job</span>
                        {r.job}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Haptics — the tactile half of the same hierarchy argument */}
              <motion.div {...fadeUp} className="mt-20">
                <p className="font-sans text-xs tracking-[0.2em] uppercase mb-6" style={{ color: DIMMER }}>
                  Haptics
                </p>
                <div className="space-y-5 max-w-3xl" style={{ color: DIM }}>
                  <p className="font-sans text-base leading-relaxed">
                    The same hierarchy runs through your thumb. A custom <span className="font-mono text-sm" style={{ color: TEXT }}>useHaptics</span> hook on Capacitor's Haptics API gives every interaction a tier: medium impacts for navigation and tab changes, and a far lighter tap for everything secondary, from buttons to dismissing a sheet. The levels came from holding the phone, not from a spec. Navigation started heavy and got knocked down to medium, and secondary taps ended up distinctly lighter, so a page change feels different from a button press without looking.
                  </p>
                  <p className="font-sans text-base leading-relaxed">
                    Android was the compromise. Its vibration hardware turned even the lightest setting into a buzzer, so I disabled haptics there entirely. No feedback beats harsh feedback.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── THE SUNSET — full-bleed band over the hero artwork, tinted darker ── */}
        <section className="mt-32 relative overflow-hidden">
          <div className="absolute inset-0" style={{
            backgroundImage: `url('/images/magicSignal/magicSignalHero.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }} />
          {/* Dark tint so the copy stays readable over the artwork */}
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(6,6,16,0.68)' }} />
          <div className="relative px-8 md:px-14 py-24 md:py-32">
            <div className="max-w-6xl mx-auto">
              <motion.div {...fadeUp}>
                <p className="font-sans text-xs tracking-[0.2em] uppercase mb-4" style={{ color: DIMMER }}>
                  The Sunset
                </p>
                <h2
                  className="font-display font-black leading-[0.9] mt-2"
                  style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', color: TEXT, maxWidth: '20ch' }}
                >
                  Knowing when to fold is a product decision.
                </h2>
              </motion.div>

              <motion.div {...fadeUp} className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-5" style={{ color: 'rgba(242,242,240,0.75)' }}>
                <div className="space-y-5">
                  <p className="font-sans text-base leading-relaxed">
                    Magic Signal ran as a real business: store review on both platforms (including financial-disclosure compliance), subscriptions, push infrastructure, and fifty people paying for a verdict every trading day.
                  </p>
                  <p className="font-sans text-base leading-relaxed">
                    The economics made the call before the market did. Metered market data plus two AI vendors against a $9.99-a-month subscription only works at a scale I couldn't reach solo, and distribution was the one problem the product couldn't solve for me. The research edge was narrowing too: general-purpose LLMs kept getting better at the interpretation piece, and my read was that most people would rather ask one tool they already had than commit to a specialized app. The watching-and-push loop was still something nothing else offered. It wasn't enough to carry the subscription on its own.
                  </p>
                </div>
                <div>
                  <p className="font-sans text-base leading-relaxed">
                    So I sunset it deliberately: turned the pipeline off, honored the subscriptions, kept the code. The problem was real. The delivery mechanism I chose wasn't where the market landed.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── OUTCOME ─────────────────────────────────────────────────────────── */}
        <section className="px-8 md:px-14 pt-32 pb-0">
          <div className="max-w-6xl mx-auto">
            <Rule />
            <div className="pt-20">
              <motion.div {...fadeUp}>
                <SectionLabel>Outcome</SectionLabel>
              </motion.div>

              <motion.div {...fadeUp} className="mt-6 mb-16">
                <p className="font-display font-black leading-none" style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', color: TEXT }}>
                  50
                </p>
                <p className="font-sans text-base mt-2" style={{ color: DIM }}>
                  paying subscribers at peak, App Store + Google Play, before sunsetting in February 2026, five months after launch
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: RULE }}>
                {[
                  { label: 'Solo end-to-end', body: 'Designed, built, shipped, and maintained by one person, from first sketch to both app stores.' },
                  { label: 'Live in both stores', body: 'Cleared App Store and Google Play review, including financial-disclosure compliance.' },
                  { label: 'Real AI pipeline', body: 'Production system combining Unusual Whales options flow, two-pass Perplexity research, and GPT-4.1 pulling it into one verdict, in real time.' },
                ].map((item, i) => (
                  <RuleCard key={item.label} label={item.label} body={item.body} delay={i * 0.1} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── REFLECTION ──────────────────────────────────────────────────────── */}
        <section className="px-8 md:px-14 pt-28 pb-0">
          <div className="max-w-6xl mx-auto">
            <Rule />
            <div className="pt-20">
              <motion.div {...fadeUp}>
                <SectionLabel>Reflection</SectionLabel>
                <p
                  className="font-display font-black leading-[0.9] mt-4 max-w-3xl"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: TEXT }}
                >
                  I built a product that didn't survive the market. The skills did.
                </p>
                <div className="mt-10 space-y-5 max-w-3xl" style={{ color: DIM }}>
                  <p className="font-sans text-base leading-relaxed">
                    Magic Signal was never meant to be a startup. I built it to teach myself the AI stack, using a problem I actually had, and I treated it that way. No investors, no design-by-committee. That freedom meant I could make fast decisions and go deep on the AI implementation layer in a way a normal design job wouldn't allow.
                  </p>
                  <p className="font-sans text-base leading-relaxed">
                    What I came away with was AI fluency most product designers didn't have yet: building system prompts, structuring user prompts, managing streaming API responses, optimizing tokens, and treating input/output cost as a design constraint. All of it transferred directly and immediately into my work at Q2.
                  </p>
                </div>
              </motion.div>

              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
                {[
                  { label: 'AI Workshop', body: 'Before the workshop, the Director of Product set up a 1:1 to understand how I was shipping so quickly. Word had gotten around. That conversation led to a team-wide session reframing AI from a creation tool to a thinking partner: use it to stress-test your ideas before stakeholder meetings, arrive with fully-formed concepts instead of blank canvases. Changed how the team prepares and presents.' },
                  { label: 'Cost-Saving Pipeline', body: 'When Q2 designers burned through Figma Make\'s expensive AI credits, I found a better path: Claude Code builds the prototype, our engineers built a deploy tool that pushes it to a live URL for user testing, stakeholder review, and production-ready handoff. Zero recurring Figma Make credits.' },
                  { label: 'AI Feature Contribution', body: 'The knowledge gained building Magic Signal directly informs my contribution to a Q2 AI banking feature in discovery: a tool for a 22M+ user base to make sense of their spending through bank statement analysis, where prompt design, data pipeline thinking, and AI output hierarchy all matter.' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="pt-6"
                    style={{ borderTop: `1px solid ${RULE_STRONG}` }}
                  >
                    <p className="font-display text-sm font-bold mb-4" style={{ color: ACCENT, opacity: 0.7 }}>0{i + 1}</p>
                    <p className="font-display text-xl font-bold mb-3" style={{ color: TEXT }}>{item.label}</p>
                    <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{item.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── IF I BUILT IT AGAIN ─────────────────────────────────────────────── */}
        <section className="px-8 md:px-14 pt-32 pb-0">
          <div className="max-w-6xl mx-auto">
            <Rule />
            <div className="pt-20">
              <motion.div {...fadeUp}>
                <SectionLabel>If I Built It Again</SectionLabel>
              </motion.div>

              <div className="mt-8 max-w-3xl">
                {[
                  { num: '01', title: 'Ship the web app first', body: 'I went native for one reason: push notifications. The edge depends on knowing before everyone else does. What native actually bought me was two store review processes, each taking multiple rounds to clear, plus fees and build overhead before a single subscriber existed. A web app could have been live in days. I\'d start there and only wrap it for the stores once push alerts had earned that cost.' },
                  { num: '02', title: 'Set the kill criteria on day one', body: 'Cost-per-user was knowable at launch. I\'d define the sunset thresholds up front (metrics, dates, exit plan) rather than deriving them at month five. Deciding when to stop is a design decision too.' },
                ].map((p, i) => (
                  <DecisionRow key={p.num} num={p.num} title={p.title} body={p.body} delay={i * 0.09} />
                ))}
              </div>

              <motion.p
                {...fadeUp}
                className="mt-16 font-display font-bold leading-tight"
                style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.6rem)', color: TEXT, maxWidth: '30ch' }}
              >
                Magic Signal is where I learned to treat AI as a material: its cost, its latency, its uncertainty. That's exactly how I design with it at Q2 today.
              </motion.p>
            </div>
          </div>
        </section>

        {/* ── NEXT PROJECT ────────────────────────────────────────────────────── */}
        <section className="px-8 md:px-14 pt-28 pb-28">
          <div className="max-w-6xl mx-auto">
            <Rule />
            <motion.div {...fadeUp} className="pt-16">
              <Link to="/messaging-redesign" className="group inline-block mt-4">
                <p className="font-sans text-sm mb-2" style={{ color: DIMMER }}>
                  Next project
                </p>
                <h2
                  className="font-display font-black leading-[0.9] transition-opacity duration-300 group-hover:opacity-60"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', color: TEXT }}
                >
                  Secure Messaging
                </h2>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  )
}
