import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import CaseTLDR from '../../components/CaseTLDR'
import usePageMeta from '../../hooks/usePageMeta'

/* ── Palette (cool slate + deep navy + indigo; distinct from BIT cream/blue and MS black/steel) ── */
const BG     = '#F3F5F8'
const CARD   = '#FFFFFF'
const INK    = '#101B2D'
const BODY   = '#3E4A5C'
const DIM    = 'rgba(16,27,45,0.72)'   // ≥4.5:1 on BG for body-size text
const MUTE   = 'rgba(16,27,45,0.66)'   // lightest tier that clears AA on BG (0.60 measured 4.43:1)
const LINE   = 'rgba(16,27,45,0.10)'
const ACCENT = '#5B54E8'               // indigo — marks AI and key moves
const GREEN  = '#157A4A'
const AMBER  = '#855A11'   // AA on the alt section bg (#9C6A14 measured 3.99:1)
const RED    = '#B3372B'
const L_DIM  = 'rgba(255,255,255,0.74)'
const L_MUTE = 'rgba(255,255,255,0.55)'

const wrap = 'max-w-6xl mx-auto px-6 md:px-10'
const IMG = '/images/Q2Clarity'   // exact case: hosts serve public/ paths case-sensitively

/* ── Motion ── */
const fadeUp = {
  initial:     { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
}

/* ── Small helpers ── */
function SectionLabel({ children, light }) {
  return (
    <p className="font-mono text-xs tracking-[0.2em] uppercase mb-5" style={{ color: light ? L_MUTE : MUTE }}>
      {children}
    </p>
  )
}

function SectionHead({ num, label, title, light }) {
  return (
    <div className="relative">
      {num && (
        <span
          aria-hidden
          className="hidden md:block absolute right-0 -top-10 font-display font-black leading-none select-none pointer-events-none"
          style={{ fontSize: 'clamp(6rem, 13vw, 10rem)', color: light ? 'rgba(255,255,255,0.045)' : 'rgba(16,27,45,0.05)' }}
        >
          {num}
        </span>
      )}
      <SectionLabel light={light}>{num ? `${num} · ${label}` : label}</SectionLabel>
      <h2
        className="font-display font-black leading-tight mb-6 relative"
        style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: light ? '#fff' : INK }}
      >
        {title}
      </h2>
    </div>
  )
}

function Stat({ value, label, color = INK }) {
  return (
    <div>
      <p className="font-display text-4xl md:text-5xl font-black leading-none mb-2" style={{ color }}>{value}</p>
      <p className="font-sans text-sm leading-snug" style={{ color: DIM }}>{label}</p>
    </div>
  )
}

/* Dashed slot for an asset that isn't in the repo yet.
   `file` is the exact filename to drop into public/images/Q2Clarity/Designs_july17/.
   `kind` flips the label between a still and a screen recording. */
function Slot({ note, file, aspect = '16 / 10', kind = 'IMG' }) {
  const rec = kind === 'REC'
  return (
    <div
      role="img"
      aria-label={note}
      className="w-full rounded-2xl flex flex-col items-center justify-center text-center gap-3 px-6 py-8"
      style={{ aspectRatio: aspect, border: `1px dashed rgba(16,27,45,0.3)`, backgroundColor: 'rgba(16,27,45,0.03)' }}
    >
      <span
        className="font-mono text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
        style={{ color: rec ? ACCENT : MUTE, border: `1px solid ${rec ? 'rgba(91,84,232,0.4)' : LINE}` }}
      >
        {rec ? '▶ Screen recording' : 'Screenshot'}
      </span>
      <p className="font-sans text-sm leading-snug" style={{ color: DIM, maxWidth: '48ch' }}>{note}</p>
      {file && <p className="font-mono text-[10px] tracking-[0.04em]" style={{ color: MUTE }}>{file}</p>}
    </div>
  )
}

/* Back-compat alias — §08 notifications slot still calls PendingShot */
function PendingShot(props) {
  return <Slot {...props} />
}

/* Phone-framed slot. With `src`, shows the tall mobile PNG clipped to its fold
   (object-top) — no hand-cropping needed. Without `src`, a dashed placeholder
   naming the file (or recording) to drop in. */
function PhoneSlot({ note, file, src, kind = 'IMG', label, onOpen }) {
  const rec = kind === 'REC'
  const [zoomed, setZoomed] = useState(false)
  const handleOpen = src ? () => (onOpen ? onOpen() : setZoomed(true)) : undefined
  return (
    <figure className="shrink-0 w-[178px] md:w-[210px]" style={{ scrollSnapAlign: 'start' }}>
      <div
        className={`group rounded-[1.9rem] overflow-hidden relative ${src ? 'md:cursor-zoom-in' : ''}`}
        style={{ aspectRatio: '390 / 600', border: `6px solid ${INK}`, backgroundColor: 'rgba(16,27,45,0.03)' }}
        onClick={handleOpen}
      >
        {src ? (
          <>
            {/* Cropped to the fold in the frame; click opens the full screen */}
            <img src={src} alt={note} loading="lazy" className="absolute inset-0 w-full h-full object-cover object-top" />
            <span
              className="hidden md:flex absolute bottom-2 left-1/2 -translate-x-1/2 items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[8px] tracking-[0.12em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
              style={{ backgroundColor: 'rgba(16,27,45,0.78)', color: '#fff' }}
            >
              ⤢ Enlarge
            </span>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-2 px-4">
            <span className="font-mono text-[9px] tracking-[0.14em] uppercase" style={{ color: rec ? ACCENT : MUTE }}>
              {rec ? '▶ Recording' : 'Mobile · fold'}
            </span>
            <p className="font-sans text-[11px] leading-snug" style={{ color: DIM }}>{note}</p>
            {file && <p className="font-mono text-[9px] leading-tight" style={{ color: MUTE }}>{file}</p>}
          </div>
        )}
      </div>
      {label && (
        <figcaption className="font-mono text-[10px] tracking-[0.14em] uppercase mt-2 text-center" style={{ color: MUTE }}>
          {label}
        </figcaption>
      )}
      {src && !onOpen && <Lightbox open={zoomed} src={src} alt={note} onClose={() => setZoomed(false)} fit="height" />}
    </figure>
  )
}

/* ── §01 · Before carousel: the buried overpanel, two frames at a time ── */
const BEFORE_SHOTS = [
  { src: `${IMG}/q2dashboard.png`,                              label: 'The dashboard · Q2-owned UI',   note: 'The Spending tile is the only doorway in' },
  { src: `${IMG}/previousdesign/Previous-Spending 1.png`,       label: 'The overpanel · Spending',      note: 'The vendor\'s UI from here on: its own donut, its own pink button' },
  { src: `${IMG}/previousdesign/Previous-Budget 1.png`,         label: 'The overpanel · Budget',        note: 'An empty state most members never discovered' },
  { src: `${IMG}/previousdesign/Previous-Trends 1.png`,         label: 'The overpanel · Trends',        note: 'Twelve months of history, one click from invisible' },
  { src: `${IMG}/previousdesign/Previous-CashFlow 1.png`,       label: 'The overpanel · Cash Flow',     note: 'A projection tool hidden behind a chart' },
  { src: `${IMG}/previousdesign/Previous-NetWorth 1.png`,       label: 'The overpanel · Net Worth',     note: 'Vendor patterns that exist nowhere else in the product' },
  { src: `${IMG}/previousdesign/Previous-Debts 1.png`,          label: 'The overpanel · Debts',         note: 'The sixth tab almost nobody knew existed' },
]

function BeforeCarousel() {
  const [start, setStart] = useState(0)
  const max = BEFORE_SHOTS.length - 2
  const step = (d) => setStart((s) => Math.min(max, Math.max(0, s + d)))

  return (
    <div>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${start * 50}%)`, transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
        >
          {BEFORE_SHOTS.map((s) => (
            <figure key={s.src} className="w-1/2 shrink-0 px-2 md:px-3">
              <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${LINE}`, aspectRatio: '4 / 3', backgroundColor: CARD }}>
                <img src={s.src} alt={`${s.label} — ${s.note}`} loading="lazy" className="w-full h-full object-cover object-top" />
              </div>
              <figcaption className="mt-3">
                <p className="font-mono text-[10px] tracking-[0.14em] uppercase" style={{ color: MUTE }}>{s.label}</p>
                <p className="font-sans text-xs leading-snug mt-1" style={{ color: DIM }}>{s.note}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 mt-6 px-2 md:px-3">
        {[['←', -1, 'Previous screens', start === 0], ['→', 1, 'Next screens', start === max]].map(([glyph, d, label, disabled]) => (
          <button
            key={label}
            type="button"
            onClick={() => step(d)}
            disabled={disabled}
            aria-label={label}
            className="w-11 h-11 rounded-full font-display text-lg transition-opacity duration-200"
            style={{
              border: `1px solid rgba(16,27,45,0.3)`,
              color: INK,
              opacity: disabled ? 0.3 : 1,
              cursor: disabled ? 'default' : 'pointer',
            }}
          >
            {glyph}
          </button>
        ))}
        <p className="font-mono text-[11px] tracking-[0.14em] uppercase" style={{ color: MUTE }}>
          {start + 1}–{start + 2} of {BEFORE_SHOTS.length}
        </p>
      </div>
    </div>
  )
}

/* ── §05 · The gate — interactive cost comparison ── */
function GateCompare() {
  const [mode, setMode] = useState('gated')
  const gated = mode === 'gated'
  const view = gated
    ? {
        price: '2–3¢',
        tone: GREEN,
        title: 'Deterministic math first, AI narrates a summary',
        rows: [
          'The math engine computes totals, budgets, trends and forecasts with no model involved.',
          'AI sees pre-computed numbers ("dining $430, up 38%"), never raw transactions.',
          'Event-driven and cached: roughly 4–12 narration calls a month, per active user.',
          'Enrichment touches only the uncategorized tail, once per merchant string, capped per user.',
        ],
      }
    : {
        price: '≈ 68¢',
        tone: RED,
        title: 'Send every transaction to the model, refresh daily',
        rows: [
          'About 200 transactions, roughly 30 tokens each, re-read on every refresh.',
          'Refreshed daily: thirty passes a month over the whole ledger.',
          'A mid-tier model, because you are asking it to reason over raw data.',
          'Cost scales with transaction count, which is exactly the trap.',
        ],
      }

  return (
    <div className="rounded-2xl p-7 md:p-9" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
      <div className="flex flex-wrap gap-2 mb-8">
        {[['naive', 'The obvious build'], ['gated', 'The gated build (shipped to beta)']].map(([key, label]) => {
          const active = mode === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              aria-pressed={active}
              className="font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-3 rounded-full transition-colors duration-200"
              style={{
                border: `1px solid ${active ? INK : 'rgba(16,27,45,0.25)'}`,
                backgroundColor: active ? INK : 'transparent',
                color: active ? '#fff' : INK,
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-14 items-start">
        <div>
          <p className="font-display font-black leading-none" style={{ fontSize: 'clamp(3.4rem, 7vw, 5.5rem)', color: view.tone }}>
            {view.price}
          </p>
          <p className="font-sans text-sm mt-2" style={{ color: DIM }}>per active user, per month</p>
        </div>
        <div>
          <p className="font-display text-lg font-bold mb-4" style={{ color: INK }}>{view.title}</p>
          <ul className="space-y-2.5">
            {view.rows.map((r) => (
              <li key={r} className="font-sans text-sm leading-relaxed pl-4" style={{ color: DIM, borderLeft: `2px solid ${view.tone}` }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="font-sans text-sm leading-relaxed mt-8 pt-6" style={{ color: DIM, borderTop: `1px solid ${LINE}` }}>
        The decoupling is the whole trick. Numbers update on every transaction; AI wakes only for material, new events.
        Opening the app fifty times triggers <strong className="font-semibold" style={{ color: INK }}>zero</strong> new AI calls,
        because the screen reads cached narration over always-live math.
      </p>
    </div>
  )
}

/* ── §04 · Pipeline strip ── */
const PIPELINE = [
  { n: '1', name: 'Ingest',        ai: false, note: 'Held + external accounts, one ledger' },
  { n: '2', name: 'Enrich',        ai: true,  note: 'Rules categorize the bulk; AI cleans the messy tail' },
  { n: '3', name: 'Compute',       ai: false, note: 'Budgets, trends, forecasts. Pure math' },
  { n: '4', name: 'Detect & rank', ai: false, note: 'Findings scored by $ impact, deterministically' },
  { n: '5', name: 'Narrate',       ai: true,  note: 'One batched call writes the plain-language insight' },
  { n: '6', name: 'Present',       ai: false, note: 'The themed hub, live numbers' },
]

function PipelineStrip() {
  return (
    <div className="flex flex-wrap items-stretch gap-y-4">
      {PIPELINE.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div
            className="rounded-xl px-4 py-3 h-full"
            style={{
              backgroundColor: s.ai ? 'rgba(91,84,232,0.07)' : CARD,
              border: `1px solid ${s.ai ? 'rgba(91,84,232,0.45)' : LINE}`,
              maxWidth: '13.5rem',
            }}
          >
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase mb-1" style={{ color: s.ai ? ACCENT : MUTE }}>
              {s.n} · {s.ai ? '★ AI' : 'ours'}
            </p>
            <p className="font-display text-base font-bold leading-tight" style={{ color: INK }}>{s.name}</p>
            <p className="font-sans text-xs leading-snug mt-1" style={{ color: DIM }}>{s.note}</p>
          </div>
          {i < PIPELINE.length - 1 && (
            <span aria-hidden className="px-2 font-display" style={{ color: MUTE }}>→</span>
          )}
        </div>
      ))}
    </div>
  )
}

/* Shared desktop hover lightbox: a dark overlay with the full image on top.
   fit="width" suits wide desktop shots (scrolls if tall); fit="height" suits
   tall phone shots (whole screen fits the viewport). */
function Lightbox({ open, src, alt, onClose, fit = 'width', onPrev, onNext }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft' && onPrev) onPrev()
      else if (e.key === 'ArrowRight' && onNext) onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, onPrev, onNext])
  const heightFit = fit === 'height'
  const arrowStyle = { backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`hidden md:flex fixed inset-0 z-[90] justify-center overscroll-contain p-6 lg:p-12 cursor-zoom-out ${heightFit ? 'items-center' : 'items-start overflow-y-auto'}`}
          style={{ backgroundColor: 'rgba(16,27,45,0.86)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${alt} — enlarged`}
        >
          <button
            type="button"
            aria-label="Close enlarged view"
            onClick={onClose}
            className="fixed top-5 right-6 w-11 h-11 rounded-full flex items-center justify-center font-display text-2xl leading-none z-10"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}
          >
            ×
          </button>
          {onPrev && (
            <button
              type="button"
              aria-label="Previous screen"
              onClick={(e) => { e.stopPropagation(); onPrev() }}
              className="fixed left-3 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center font-display text-3xl leading-none z-10"
              style={arrowStyle}
            >
              ‹
            </button>
          )}
          {onNext && (
            <button
              type="button"
              aria-label="Next screen"
              onClick={(e) => { e.stopPropagation(); onNext() }}
              className="fixed right-3 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center font-display text-3xl leading-none z-10"
              style={arrowStyle}
            >
              ›
            </button>
          )}
          <motion.img
            key={src}
            src={src}
            alt={alt}
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl cursor-default"
            style={
              heightFit
                ? { maxHeight: '92vh', width: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }
                : { width: 'min(1100px, 94vw)', height: 'auto', boxShadow: '0 30px 80px rgba(0,0,0,0.5)' }
            }
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ── §07 · Sticky surface showcase ── */
const SURFACES = [
  {
    id: 'overview',
    tab: 'Overview',
    src: `${IMG}/Designs_july17/overview-desktop.png`,
    ratio: '2984 / 3269',
    title: 'Overview answers "am I okay this month?"',
    body: 'A written summary of the month sits up top: spending up 18%, mostly dining, Vacation goal slipped, here is the fix. Net worth, safe-to-spend and goals-on-track read from one glance. Every number is computed; only the words are generated.',
  },
  {
    id: 'spending',
    tab: 'Spending',
    src: `${IMG}/Designs_july17/spending-desktop.png`,
    ratio: '2984 / 3035',
    title: 'Fix a category once, and it sticks',
    body: 'Tap any transaction to recategorize it. Say "remember this" and a plain forward rule fixes every future charge from that merchant. The uncategorized pile arrives already shrunk, because enrichment ran before the member ever saw it.',
  },
  {
    id: 'budget',
    tab: 'Budget',
    src: `${IMG}/Designs_july17/budget-desktop.png`,
    ratio: '2984 / 3409',
    title: 'A zero-based budget with an exit ramp',
    body: 'Every dollar of income gets a job. When a category runs over, the page offers to cover it by moving money from one with room, keeping the plan balanced instead of just red.',
  },
  {
    id: 'trends',
    tab: 'Trends',
    src: `${IMG}/Designs_july17/trends-desktop.png`,
    ratio: '2984 / 2483',
    title: '"Is this normal for me?"',
    body: 'Spending against income across twelve months, plus the biggest movers versus your own three-month average: dining up 38%, transport down 13%. Bars pin on tap, so the chart works without a steady hover. The comparison is math; AI writes only the one-line read.',
  },
  {
    id: 'goals',
    tab: 'Goals',
    src: `${IMG}/Designs_july17/goals-desktop.png`,
    ratio: '2984 / 2829',
    title: 'Goals that track themselves',
    body: 'Each goal shows funded-versus-target, whether it is on pace, and the spending that moved it: Vacation slipped a month after dining ran over. "Get back on track" offers a concrete fix instead of a scold, raise the transfer or trim the category.',
  },
  {
    id: 'cashflow',
    tab: 'Cash Flow',
    src: `${IMG}/Designs_july17/cashflow-desktop.png`,
    ratio: '2984 / 2985',
    title: 'The tight week, called ahead of time',
    body: 'A 30-day projected balance names the problem in advance: bills land before the next paycheck and the balance dips low. The forecast is time-series math; AI only writes the heads-up.',
  },
  {
    id: 'subscriptions',
    tab: 'Subscriptions',
    src: `${IMG}/Designs_july17/subscriptions-desktop.png`,
    ratio: '2984 / 2263',
    title: 'Recurring waste, surfaced with receipts',
    body: 'Every recurring charge in one place, with price hikes flagged, annual-plan savings computed, and overlapping services called out. Any plan change hands off to the provider; the app narrates, it doesn\'t decide.',
  },
  {
    id: 'debts',
    tab: 'Debts',
    src: `${IMG}/Designs_july17/debts-desktop.png`,
    ratio: '2984 / 1984',
    title: 'Every balance, and the order to clear them',
    body: 'A drag-to-reorder attack list and an extra-per-month slider weigh minimums-only against your plan: $150 more a month clears the debt about two years sooner and saves $5,947 in interest. The simulation is arithmetic; nothing here moves money.',
  },
]

function SurfaceShowcase() {
  const [active, setActive] = useState(0)
  // Measure each image's true aspect ratio on load so the frame always matches the
  // actual file (self-corrects when a screenshot is re-exported at a different size).
  const [ratios, setRatios] = useState({})
  const captureRatio = (i) => (e) => {
    const { naturalWidth: w, naturalHeight: h } = e.currentTarget
    if (!w || !h) return
    const next = `${w} / ${h}`
    setRatios((prev) => (prev[i] === next ? prev : { ...prev, [i]: next }))
  }
  // Desktop hover lightbox: enlarge the active surface over a dark overlay for a closer look.
  const [zoomed, setZoomed] = useState(false)
  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] gap-10 md:gap-14 items-start">
      <div className="md:sticky md:top-24 order-last md:order-first">
        <div
          className="group relative w-full rounded-2xl overflow-hidden md:cursor-zoom-in"
          onClick={() => setZoomed(true)}
          style={{
            border: `1px solid ${LINE}`,
            aspectRatio: ratios[active] || SURFACES[active].ratio,
            backgroundColor: CARD,
            transition: 'aspect-ratio 0.5s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          {SURFACES.map((s, i) => (
            <img
              key={s.id}
              src={s.src}
              alt={s.title}
              loading="lazy"
              onLoad={captureRatio(i)}
              className="absolute inset-0 w-full h-full object-contain object-top transition-opacity duration-500"
              style={{ opacity: active === i ? 1 : 0 }}
            />
          ))}
          <span
            className="hidden md:flex absolute bottom-3 right-3 items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] tracking-[0.14em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
            style={{ backgroundColor: 'rgba(16,27,45,0.72)', color: '#fff' }}
          >
            ⤢ Click to enlarge
          </span>
        </div>
        <p className="font-mono text-[10px] tracking-[0.14em] uppercase mt-3" style={{ color: MUTE }}>
          Beta UI · shown in the demo's white-label "thrive" theme; each institution renders it in its own brand
        </p>
      </div>

      <div>
        {SURFACES.map((s, i) => (
          <motion.div
            key={s.id}
            className="md:min-h-[32vh] flex items-start"
            onViewportEnter={() => setActive(i)}
            viewport={{ margin: '-40% 0px -40% 0px' }}
            animate={{ opacity: active === i ? 1 : 0.45 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="w-full py-7" style={{ borderBottom: i < SURFACES.length - 1 ? `1px solid ${LINE}` : 'none' }}>
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase mb-2" style={{ color: ACCENT }}>{s.tab}</p>
              <p className="font-display text-lg font-bold leading-snug mb-2" style={{ color: INK }}>{s.title}</p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{s.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>

    <Lightbox
      open={zoomed}
      src={SURFACES[active].src}
      alt={SURFACES[active].title}
      onClose={() => setZoomed(false)}
      fit="width"
    />
    </>
  )
}

/* ── §07 · Mobile rail — cropped phone stills, click opens a full-screen gallery ── */
const MOBILE_TABS = [
  ['overview', 'Overview'],
  ['spending', 'Spending'],
  ['budget', 'Budget'],
  ['trends', 'Trends'],
  ['goals', 'Goals'],
  ['cashflow', 'Cash Flow'],
  ['subscriptions', 'Subscriptions'],
  ['debts', 'Debts'],
]

function MobileRail() {
  const [openIndex, setOpenIndex] = useState(null)
  const open = openIndex !== null
  const go = (d) => setOpenIndex((i) => (i === null ? i : (i + d + MOBILE_TABS.length) % MOBILE_TABS.length))
  const current = open ? MOBILE_TABS[openIndex] : null
  return (
    <>
      <p className="font-display text-xl font-bold mb-2" style={{ color: INK }}>The same hub in a pocket</p>
      <p className="font-sans text-sm leading-relaxed max-w-2xl mb-6" style={{ color: DIM }}>
        All eight tabs, laid out for a phone. Each is cropped to its top fold; the full-length pages live in the
        recordings below. Scroll through the set, or click any screen to open it full and step through with the arrows.
      </p>
      <div className="flex gap-4 md:gap-5 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0" style={{ scrollSnapType: 'x proximity' }}>
        {MOBILE_TABS.map(([slug, label], i) => (
          <PhoneSlot
            key={slug}
            label={label}
            note={`${label} tab, mobile`}
            src={`${IMG}/Designs_july17/${slug}-mobile.png`}
            onOpen={() => setOpenIndex(i)}
          />
        ))}
      </div>
      <Lightbox
        open={open}
        src={current ? `${IMG}/Designs_july17/${current[0]}-mobile.png` : ''}
        alt={current ? `${current[1]} tab, mobile` : ''}
        onClose={() => setOpenIndex(null)}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        fit="height"
      />
    </>
  )
}

/* ── §08 · Persona table ── */
const PANEL = [
  ['Margaret, 68', 'Retired teacher, fixed income, tablet',        'Dense screens, jargon, anything irreversible'],
  ['Darnell, 41',  'HVAC business owner, phone-first',             'Business and personal money mixing'],
  ['Priya, 29',    'Product manager, power user',                  'Any friction, or a feature that stops short'],
  ['Robert, 55',   'Warehouse supervisor, low finance literacy',   'Jargon, similar-looking numbers'],
  ['Sofia, 22',    'Nursing student, first-gen, ESL, mobile',      'Idioms, empty screens, desktop-only patterns'],
  ['Gene, 74',     'Retired machinist, low vision and tremor',     'Low contrast, tiny targets, small chevrons'],
]

/* ── Page ── */
export default function Q2Clarity() {
  usePageMeta(
    'Q2 Clarity by Stephen Hurt',
    'How a vendor-rendered spending widget became a bank-owned money hub: pitched from outside the team, designed with gated AI, and in beta with three financial institutions 2.5 months after the idea.'
  )

  return (
    <main style={{ backgroundColor: BG, color: BODY }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: INK, color: '#fff' }}>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
            backgroundSize: '84px 84px',
            maskImage: 'radial-gradient(ellipse at 70% 30%, black 15%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 70% 30%, black 15%, transparent 70%)',
          }}
        />
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{ right: '-10%', top: '-30%', width: '60%', height: '140%', background: 'radial-gradient(circle at 55% 45%, rgba(91,84,232,0.28), transparent 62%)' }}
        />
        <div className={`${wrap} pt-32 pb-16 relative`}>
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-8" style={{ color: L_MUTE }}>
            Case Study · Q2 · Product Design
          </p>
          <h1 className="font-display font-black leading-[0.95] mb-7" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            Q2 <span style={{ color: '#8B85F4' }}>Clarity</span>
          </h1>
          <p className="font-sans text-lg md:text-xl leading-relaxed max-w-2xl mb-6" style={{ color: 'rgba(255,255,255,0.78)' }}>
            The spending experience inside our online banking was a vendor's widget. This is how it became ours, and how
            the pitch traveled from my desk to a beta three banks are running.
          </p>
          <p className="font-sans text-base leading-relaxed max-w-2xl mb-14" style={{ color: L_DIM }}>
            Q2's platform served personal finance through our data vendor's embedded UI: capable data, foreign-feeling experience, and
            an uncategorized pile members had to sort themselves. I pitched rebuilding the experience on the data the vendor
            already serves, with AI reserved for the two jobs only language can do. The accounts team took it on with me,
            and it went from idea to beta release in two and a half months.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            {[
              ['Role', 'Product Designer · originated the pitch, led the design'],
              ['Team', 'Me + the accounts team: their lead designer, product owner, 3 engineers'],
              ['Timeline', '2.5 months, idea to beta release · 2026'],
              ['Status', 'In beta with 3 financial institutions'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: L_MUTE }}>{k}</p>
                <p className="font-sans text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.9)' }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TL;DR ── */}
      <CaseTLDR
        colors={{ text: INK, dim: DIM, accent: ACCENT, surface: CARD, rule: LINE }}
        summary="Members saw the vendor's own embedded widget where their bank's money tools should be, fronting a grey 'Uncategorized' wedge that taught them to stop looking. I wrote the argument before designing a screen: own the experience, keep the vendor as the data engine, gate AI to categorizing the messy tail and narrating insights. The proposal won over a team I wasn't on, and we shipped the themed hub to beta with three financial institutions. The AI layer didn't survive the beta: account holders barely used it, and it wasn't worth the extra engineering surface to keep, so we cut it."
        stats={[
          { value: '2.5 mo', label: 'From idea to beta release' },
          { value: '3', label: 'Financial institutions in beta' },
          { value: '8', label: 'Tabs unified into one hub, from a single widget' },
          { value: 'Cut', label: 'AI narration and enrichment, removed after beta' },
        ]}
      />

      {/* ── 01 THE PROBLEM ── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="01" label="The problem" title="The feature looked like someone else's product" />
          <div className="space-y-4 font-sans text-base leading-relaxed max-w-3xl mb-12">
            <p>
              The dashboard itself is Q2's: on-brand, built from our components, with a Spending content block showing a
              tidy donut. Click that tile, though, and a large overpanel opens with six full tabs of money tools inside:
              spending, budgets, trends, cash flow, net worth, debts. That single click is the only path in. Nothing on
              the dashboard signals any of it exists, so for most members it simply didn't. Six tabs of tools were living
              in a modal where a dedicated page belonged.
            </p>
            <p>
              Inside the overpanel, everything is rendered by our data vendor. None of it uses Q2's components or
              variables, so even the spending donut inside the panel doesn't match the Q2-built donut on the tile that
              opened it. The "looks foreign" complaint from financial institutions was never a CSS problem; the UI was
              genuinely someone else's.
            </p>
            <p>
              And the data carried a structural gap. Some share of transactions arrive without a category (bare ACH
              strings, cryptic POS codes, B2B references), and the widget presented that pile to members as their problem
              to sort. An experience that's both buried and off-brand gives nobody a reason to do that sorting.
            </p>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="mb-12">
          <BeforeCarousel />
        </motion.div>

        <motion.div {...fadeUp} className="grid grid-cols-3 gap-8 mb-14 max-w-2xl">
          <Stat value="1"  label="content block: the only doorway to all of it" color={RED} />
          <Stat value="6"  label="tabs of tools hidden inside the overpanel" color={RED} />
          <Stat value="0"  label="Q2 components used anywhere behind that click" color={RED} />
        </motion.div>

      </section>

      {/* ── 02 THE REFRAME — full-bleed band ── */}
      <motion.section {...fadeUp} style={{ backgroundColor: INK }}>
        <div className={`${wrap} py-16 md:py-20`}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-6" style={{ color: '#8B85F4' }}>
            02 · The reframe
          </p>
          <p className="font-display font-black leading-tight max-w-4xl mb-6" style={{ fontSize: 'clamp(1.7rem, 3.8vw, 2.8rem)', color: '#fff' }}>
            The gap is the experience, not the data.
          </p>
          <p className="font-sans text-base leading-relaxed max-w-3xl" style={{ color: L_DIM }}>
            Our data vendor already aggregates every account and categorizes the bulk of transactions, over an API we already receive.
            What was missing sat above the data: an experience each institution could theme as its own, and insight in
            plain language instead of raw numbers — the job we wanted AI to do. So the plan kept the two decisions apart: render our own themed
            views on the data the vendor serves, and never reopen the data layer. Deciding that early avoided a build-versus-buy
            fight and kept the project small enough to ship in a quarter.
          </p>
        </div>
      </motion.section>

      {/* ── 03 THE PITCH ── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="03" label="The pitch" title="Arguing for it from outside the team" />
          <div className="space-y-4 font-sans text-base leading-relaxed max-w-3xl mb-12">
            <p>
              The accounts team owned this surface, and I wasn't on it. Nobody had asked for this project. That shaped the
              whole approach: before designing a single screen, I wrote the argument in a form a skeptical product
              owner could interrogate: the ground truth of how the widget renders today, the strategy, the cost math worked
              bottom-up, and the quality bars the AI layer would have to clear before it could ship.
            </p>
            <p>
              The proposal did the persuading. The accounts team's lead designer partnered with me on the design, their
              product owner scoped it, and three of their engineers built it.
            </p>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={{ borderLeft: `3px solid ${ACCENT}` }} className="pl-6 md:pl-9 max-w-3xl">
          {[
            ['01', 'Establish ground truth', 'Confirmed via platform docs how the pipeline actually works: the dashboard tile is ours; the overpanel is the vendor\'s embedded UI on data we already receive.'],
            ['02', 'Separate the two decisions', 'Owning the UI is the sure thing; the AI enrichment layer is additive and has to earn its way in. Either ships without the other.'],
            ['03', 'Price it before anyone asks', 'Worked the AI cost bottom-up to 2–3¢ per active user per month, including the 68¢ failure mode we were avoiding.'],
            ['04', 'Set the quality bars first', 'Go/no-go thresholds for the enrichment layer, frozen before any results existed. No moving goalposts.'],
          ].map(([no, name, desc], i, arr) => (
            <div key={no} className="py-6 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : 'none' }}>
              <span aria-hidden className="font-display font-black leading-none shrink-0" style={{ fontSize: '2.6rem', color: 'rgba(16,27,45,0.14)' }}>{no}</span>
              <div>
                <p className="font-display text-lg font-bold mb-1.5" style={{ color: INK }}>{name}</p>
                <p className="font-sans text-sm leading-relaxed max-w-2xl" style={{ color: DIM }}>{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── 04 THE ARCHITECTURE ── */}
      <section className="py-20" style={{ backgroundColor: '#EAEDF3' }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="04" label="The architecture" title="Six steps, ours end to end. AI touches two." />
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
              The vendor stays the data engine for aggregation and categorization. From the adapter forward, everything is Q2's:
              a deterministic math core with AI gated to the hard cases of categorization and the narration of insights.
              The build rule behind it: deterministic first, AI last. Never hand a model a job a lookup can do.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="mb-12">
            <PipelineStrip />
          </motion.div>

          <motion.figure {...fadeUp}>
            <img
              src={`${IMG}/Flowcharts/Worked Example — Q2 Clarity Flow.png`}
              alt="Worked example: one member's month traced through the system, from four raw transactions to a goal-linked insight"
              loading="lazy"
              className="w-full rounded-2xl"
              style={{ border: `1px solid ${LINE}` }}
            />
            <figcaption className="font-sans text-xs leading-relaxed mt-3" style={{ color: MUTE }}>
              From the proposal: one member's month traced end to end. A cryptic "ACH DEBIT MERIDIAN SUPPLY" gets
              categorized once and cached forever; a dining overage becomes "your Vacation goal slipped a month, trimming
              two takeout orders puts it back on track."
            </figcaption>
          </motion.figure>
        </div>
      </section>

      {/* ── 05 THE GATE ── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="05" label="Cost as a design material" title="Why the AI bill stays under three cents" />
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
            The fair objection to any AI feature at banking scale is cost, so the proposal priced both architectures
            before anyone had to ask. The instinct that this could get expensive is correct, for the build we didn't do.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="mb-6">
          <GateCompare />
        </motion.div>

        <motion.div {...fadeUp} className="rounded-2xl p-7" style={{ backgroundColor: 'rgba(21,122,74,0.06)', border: '1px solid rgba(21,122,74,0.25)' }}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-3" style={{ color: GREEN }}>Built to clear governance</p>
          <p className="font-sans text-sm leading-relaxed max-w-3xl" style={{ color: DIM }}>
            The model never saw PII or raw transactions, only post-vendor aggregates: a cleansed merchant string, a dollar
            amount, a category total. It ran on already-approved infrastructure (AWS Bedrock with approved Claude models,
            US data residency, no training on our data) and cleared the standard AI Center of Excellence review before it
            ever touched a real account. We designed it to make that review easy, not to route around it.
          </p>
        </motion.div>
      </section>

      {/* ── 06 THE FIELD ── */}
      <section className="py-20" style={{ backgroundColor: '#EAEDF3' }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="06" label="The field" title="Two markets, and the ground none of them hold" />
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-12">
              I studied it from both sides: the eight account-linked finance apps people pay for (the post-Mint field of
              Copilot, Monarch, YNAB, Rocket Money and the rest), and what banks already ship inside their own apps, from
              Chase's bolted-on donut to SoFi's Relay. The apps prove the demand. The banks prove how rarely it's met
              with any depth.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
            {[
              ['We win', GREEN, 'First-party, bank-native trust. A spending-to-goals loop that turns an insight into an action. Proactive AI framing instead of restated numbers. One connected hub.'],
              ['We match', AMBER, 'Aggregation, categorization quality, subscription detection, cash-flow forecasting, zero-based budgeting. The table stakes, at parity.'],
              ['We lag', RED, 'Bill negotiation, household access, investment depth. Deliberate scope, stated in the proposal rather than discovered by a stakeholder later.'],
            ].map(([label, tone, body]) => (
              <div key={label} className="pt-6" style={{ borderTop: `3px solid ${tone}` }}>
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-3" style={{ color: tone }}>{label}</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{body}</p>
              </div>
            ))}
          </motion.div>

          <motion.p {...fadeUp} className="font-display font-black leading-tight max-w-4xl" style={{ fontSize: 'clamp(1.6rem, 3.4vw, 2.6rem)', color: INK }}>
            The incumbents lack depth. The neobanks lack insight. The apps lack the bank.
            <span style={{ color: ACCENT }}> That intersection is the product.</span>
          </motion.p>
        </div>
      </section>

      {/* ── 07 THE HUB ── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="07" label="The design" title="One hub, eight tabs, built for the phone first" />
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-6">
            The overpanel is gone. Clarity is a dedicated page: spending, budgets, goals, trends, cash flow,
            subscriptions and debts, which had lived scattered or buried, merge into one hub of eight tabs led by a
            plain-language read on the month. Depth increases as you scroll; the conclusion never moves from the top.
          </p>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-12">
            I designed it mobile-first on purpose. This is where people actually check their money, and the goal was
            never a nicer version of a feature nobody opened. It was something worth opening on the device that's
            already in your hand. The desktop layout is the same hub given room to breathe.
          </p>
        </motion.div>

        <motion.div {...fadeUp}>
          <SurfaceShowcase />
        </motion.div>

        {/* Mobile-first proof: the same eight tabs in the pocket, each cropped to its fold */}
        <motion.div {...fadeUp} className="mt-20">
          <MobileRail />
        </motion.div>

        {/* Full-length mobile + the two interactions that only make sense in motion */}
        <motion.div {...fadeUp} className="mt-14">
          <p className="font-display text-xl font-bold mb-2" style={{ color: INK }}>Seen in motion</p>
          <p className="font-sans text-sm leading-relaxed max-w-2xl mb-6" style={{ color: DIM }}>
            Two short mobile recordings: the full Overview page scrolling top to bottom, and the recategorize-and-remember
            flow that shrinks the uncategorized pile for good.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Slot
              kind="REC"
              aspect="16 / 10"
              note="Full Overview page scrolling top to bottom on mobile — the whole page a still can't show. Tap-ripple cursor."
              file="rec-overview-scroll-mobile.mp4"
            />
            <Slot
              kind="REC"
              aspect="16 / 10"
              note="Spending → tap an uncategorized transaction → accept the AI category → toggle 'always categorize this way' → Save. Mobile, tap-ripple cursor."
              file="rec-recategorize-mobile.mp4"
            />
          </div>
        </motion.div>
      </section>

      {/* ── 08 THE TEST ── */}
      <section className="py-20" style={{ backgroundColor: '#EAEDF3' }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="08" label="Research" title="Six people who aren't me, twice" />
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-8">
              The design tested beautifully in my head, which counts for nothing. I ran a moderated-style study across all
              26 flows with a panel built to stretch the design: a spread of age, tech comfort, financial literacy, account
              complexity, language, and one participant with low vision. Then I fixed what broke and ran it again.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="rounded-2xl p-6 mb-12 max-w-3xl" style={{ backgroundColor: 'rgba(156,106,20,0.06)', border: '1px solid rgba(156,106,20,0.3)' }}>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: AMBER }}>Method, stated plainly</p>
            <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
              This was a simulated panel: six constructed personas walked through the flows, not live recruits. Findings
              are weighted hypotheses, and the highest-severity ones are flagged as exactly that. Real member sessions are
              part of the beta now running.
            </p>
          </motion.div>

          {/* Persona table — people read as rows */}
          <motion.div {...fadeUp} className="mb-16">
            <div className="grid grid-cols-[minmax(0,10rem)_1fr] md:grid-cols-[minmax(0,12rem)_1fr_1fr] gap-x-6 pb-3" style={{ borderBottom: `2px solid ${INK}` }}>
              {['Panelist', 'Who they are', 'What they punish'].map((h, i) => (
                <p key={h} className={`font-mono text-[10px] tracking-[0.14em] uppercase ${i === 2 ? 'hidden md:block' : ''}`} style={{ color: MUTE }}>{h}</p>
              ))}
            </div>
            {PANEL.map(([name, who, watch]) => (
              <div key={name} className="grid grid-cols-[minmax(0,10rem)_1fr] md:grid-cols-[minmax(0,12rem)_1fr_1fr] gap-x-6 py-4 items-baseline" style={{ borderBottom: `1px solid ${LINE}` }}>
                <p className="font-display text-lg font-bold" style={{ color: INK }}>{name}</p>
                <p className="font-sans text-sm leading-snug" style={{ color: DIM }}>{who}</p>
                <p className="font-sans text-sm leading-snug hidden md:block" style={{ color: RED }}>{watch}</p>
              </div>
            ))}
          </motion.div>

          {/* Round 1 */}
          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-[minmax(0,22rem)_1fr] gap-8 md:gap-14 mb-16 items-start">
            <div>
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase mb-3" style={{ color: RED }}>Round 1 · the loud problems</p>
              <p className="font-display text-xl font-bold leading-snug mb-3" style={{ color: INK }}>Alerts you set, then couldn't find</p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                Three findings broke a task or a trust moment. The clearest: people configured notifications that then
                vanished into the OS, with no bell, no inbox, no way to confirm what would fire. The fix gave alerts a
                visible home in the nav. "Where do these show up later?" — Priya asked it, and the answer became a feature.
              </p>
            </div>
            <Slot note="Notifications inbox, before and after — the Round-1 fix that gave alerts a visible home in the nav." file="notifications-inbox-desktop.png" aspect="16 / 9" />
          </motion.div>

          {/* Round 2 */}
          <motion.div {...fadeUp} className="mb-16">
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase mb-3" style={{ color: GREEN }}>Round 2 · on the fixed build</p>
            <p className="font-display text-xl font-bold leading-snug mb-3 max-w-2xl" style={{ color: INK }}>
              No critical issues, and one quieter gap: new members had no front door
            </p>
            <p className="font-sans text-sm leading-relaxed max-w-3xl mb-8" style={{ color: DIM }}>
              The second round came back with nothing task-breaking, which is what you want. What it surfaced instead:
              brand-new members landed on a hub with nothing in it yet and no obvious first move. The response is an
              onboarding built around a single first action. On the first visit, a modal invites connecting external
              accounts through Plaid, read-only, so the hub fills with real data from the first minute. Every tab that
              isn't set up yet carries its own explainer in place of a blank screen, so nothing reads as broken.
            </p>
            <div className="flex flex-wrap gap-6 items-start mb-6">
              <PhoneSlot
                label="First visit"
                note="Modal: 'See your whole financial picture' — connect external accounts via Plaid (read-only), or Maybe later."
                file="onboarding-plaid-modal-mobile.png"
              />
              <PhoneSlot
                label="Empty state"
                note="A not-yet-set-up tab (Budget) showing its explainer in place of data, so an empty screen still says what it's for."
                file="onboarding-empty-budget-mobile.png"
              />
            </div>
            <Slot
              kind="REC"
              aspect="16 / 9"
              note="First run in motion: land on Clarity → Plaid connect modal → connect or skip → a not-yet-set-up tab with its explainer. Mobile, tap-ripple cursor."
              file="rec-onboarding-mobile.mp4"
            />
          </motion.div>

          {/* One control, both rounds */}
          <motion.div {...fadeUp} className="rounded-2xl p-7 md:p-9 mb-12" style={{ backgroundColor: INK }}>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-4" style={{ color: '#8B85F4' }}>
              The clearest proof it was tested twice
            </p>
            <p className="font-display text-lg md:text-xl font-bold leading-snug mb-5 max-w-3xl" style={{ color: '#fff' }}>
              The account-scope filter got found broken, fixed, then refined again on the fix.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                ['Round 1', 'Ticking an account did nothing until Apply. Cautious users assumed the control was frozen.'],
                ['The fix', 'A "1 change pending — press Apply" hint made the delay read as intentional.'],
                ['Round 2', 'The hint mildly annoyed power users on a single pick. Split the behavior: one account applies instantly, several confirm with Apply.'],
              ].map(([label, body]) => (
                <div key={label} className="pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  <p className="font-mono text-[10px] tracking-[0.14em] uppercase mb-2" style={{ color: L_MUTE }}>{label}</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: L_DIM }}>{body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="mb-16">
            <Slot
              kind="REC"
              aspect="16 / 9"
              note="The account-scope filter in motion: open 'All accounts' → pick one account (applies instantly) → pick several (confirm with Apply). The split behavior both rounds landed on. Mobile, tap-ripple cursor."
              file="rec-account-filter-mobile.mp4"
            />
          </motion.div>

          <motion.div {...fadeUp} className="grid grid-cols-3 gap-8 max-w-2xl">
            <Stat value="26"     label="flows walked, both rounds" />
            <Stat value="3 → 0"  label="critical issues between rounds" color={GREEN} />
            <Stat value="17 → 5" label="open items after iterating; none blockers" />
          </motion.div>
        </div>
      </section>

      {/* ── 09 THE SHIP ── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="09" label="The ship" title="From pitch to beta in one quarter" />
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-12">
            The proposal was approved, and the build ran inside the accounts team: their product owner sequenced it, three
            of their engineers built it, and their lead designer and I split the design. The pitch deliberately asked for
            the smallest phase first, and we followed that sequence through the build. By release the experience had
            graduated from the overpanel to what the plan aimed at all along: a dedicated Clarity page. Three financial
            institutions are running the beta now.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <Stat value="2.5 mo" label="idea to beta release" color={ACCENT} />
          <Stat value="3"      label="financial institutions in beta" color={ACCENT} />
          <Stat value="6"      label="people: two designers, a PO, three engineers" />
          <Stat value="0"      label="critical issues at engineering handoff" />
        </motion.div>
      </section>

      {/* ── 09B THE CUT ── */}
      <motion.section {...fadeUp} style={{ backgroundColor: INK }}>
        <div className={`${wrap} py-16 md:py-20`}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-6" style={{ color: '#8B85F4' }}>
            After the beta
          </p>
          <p className="font-display font-black leading-tight max-w-4xl mb-6" style={{ fontSize: 'clamp(1.7rem, 3.8vw, 2.8rem)', color: '#fff' }}>
            We cut the AI layer entirely.
          </p>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-4" style={{ color: L_DIM }}>
            The financial institutions running Clarity asked their own account holders what they thought of it, and the
            AI barely came up. Most people didn't have a strong opinion on the recategorization or the narrated insights
            either way. What they noticed was the hub itself: a real page instead of a buried modal, tabs that worked on
            a phone for the first time. AI had become a second engineering surface, one more thing to monitor and explain
            to a risk team, for a feature most account holders never mentioned. So we killed it. Clarity kept shipping on
            the deterministic core alone: no enrichment calls, no narration calls. The AI line in the cost model went
            from two to three cents a user to zero.
          </p>
          <p className="font-sans text-base leading-relaxed max-w-3xl" style={{ color: L_DIM }}>
            None of the cost work went to waste. Pricing the feature in pennies before it existed is what made killing
            it later a shrug instead of a fight over sunk engineering time.
          </p>
        </div>
      </motion.section>

      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp} className="mb-16">
          <p className="font-display text-xl font-bold mb-2" style={{ color: INK }}>What the beta had to prove</p>
          <p className="font-sans text-sm leading-relaxed max-w-3xl mb-8" style={{ color: DIM }}>
            Three questions, and the first one is blunt: do members actually use it? Every earlier round ran on
            constructed personas, so the beta is where real behavior gets its vote.
          </p>
          <div style={{ borderLeft: `3px solid ${ACCENT}` }} className="pl-6 md:pl-8 max-w-3xl space-y-5">
            {[
              ['Do people come back?', 'Return visits to the hub without a push notification driving them. A money tool people open twice and abandon is the category\'s defining failure, and the reason the old widget went unused.'],
              ['Did the AI layer earn its keep?', 'Answered, and not the way the pitch expected: no. Account holders barely mentioned the recategorization or the narration when their institutions asked, and it remained a second engineering surface someone had to maintain. We cut it.'],
              ['Does real research confirm the simulated panel?', 'Five live member sessions during beta, re-running the panel\'s highest-severity findings against actual people.'],
            ].map(([q, a]) => (
              <div key={q}>
                <p className="font-display text-base font-bold mb-1" style={{ color: INK }}>{q}</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{a}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp}>
          <p className="font-display text-xl font-bold mb-2" style={{ color: INK }}>The bars the AI layer never got the chance to fail</p>
          <p className="font-sans text-sm leading-relaxed max-w-3xl mb-8" style={{ color: DIM }}>
            These were the go/no-go thresholds, frozen before the model ever touched a real transaction so nobody could
            move them after seeing results. They turned out not to be the question that decided this feature's fate.
            Account holders answered a simpler one first.
          </p>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${LINE}` }}>
            <table className="w-full text-left border-collapse" style={{ backgroundColor: CARD }}>
              <thead>
                <tr style={{ backgroundColor: BG }}>
                  {['Metric', 'The bar', 'Why that bar'].map((h) => (
                    <th key={h} className="font-mono text-[10px] tracking-[0.12em] uppercase px-4 py-3" style={{ color: MUTE }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Uncategorized dollars resolved', '≥ 70%', 'The core win: close the gap the member actually sees'],
                  ['Business-transaction accuracy', '≥ 90%', 'Where the uncategorized pile concentrates'],
                  ['Precision, no bad guesses', '≥ 95%', 'A confident wrong label is worse than "Uncategorized"'],
                  ['Cost per fallback transaction', '< 1¢, cached', 'Only the tail hits the model; identical inputs never re-bill'],
                  ['Category stability across runs', '> 99%', 'Categories can\'t flicker between sessions'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${LINE}` }}>
                    {row.map((cell, j) => (
                      <td key={j} className={`font-sans text-sm px-4 py-3 align-top ${j === 1 ? 'font-semibold' : ''}`} style={{ color: j === 0 ? INK : j === 1 ? GREEN : DIM }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-sans text-xs leading-relaxed mt-4" style={{ color: MUTE }}>
            The quality bars were never what killed this feature. The math core and the hub kept shipping exactly as
            designed once the AI layer came out, proof it was additive from day one and never load-bearing.
          </p>
        </motion.div>
      </section>

      {/* ── 10 REFLECTION ── */}
      <section className="py-20" style={{ backgroundColor: INK, color: '#fff' }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="10" label="Reflection" title="What I'd carry forward" light />
          </motion.div>
          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {[
              ['The memo did the persuading', 'Writing the argument before the screens is why this exists. A proposal a product owner could interrogate earned more trust than a polished prototype would have, because it showed the thinking was checkable.'],
              ['Simulated research is a loan', 'The constructed panel bought speed and honesty about severity, and it still owes real sessions. Beta is where that debt gets paid; next time I would budget for live participants a round earlier.'],
              ['Scope the fight, not just the feature', 'Splitting "own the experience" from "replace the data" is the reason there was no build-versus-buy war and no eighteen-month rewrite. Deciding which argument not to have was the highest-leverage design decision on the project.'],
              ['A cheap bet is easy to kill', 'Pricing the AI layer in pennies before it existed is the reason cutting it later cost nothing. It never touched the math core or the hub, so removing it was a config change, not a rewrite. Next time I would put the smallest slice in front of real users even earlier.'],
            ].map(([t, b], i) => (
              <div key={t} className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.28)' }}>
                <p className="font-mono text-[11px] tracking-[0.18em] mb-4" style={{ color: '#8B85F4' }}>0{i + 1}</p>
                <p className="font-display text-xl font-bold mb-3">{t}</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>{b}</p>
              </div>
            ))}
          </motion.div>
          <motion.p {...fadeUp} className="font-display text-xl md:text-2xl font-bold leading-snug max-w-3xl">
            The cost and gating instincts came from shipping Magic Signal on my own dime.
            <span style={{ color: '#8B85F4' }}> This is what they look like in production, at a bank.</span>
          </motion.p>
        </div>
      </section>

      {/* ── NEXT PROJECT ── */}
      <section className={`${wrap} py-20`}>
        <div style={{ borderTop: `1px solid ${LINE}` }} className="pt-12">
          <Link to="/q2code-agents" className="group inline-block">
            <p className="font-sans text-sm mb-2" style={{ color: MUTE }}>Next project</p>
            <h3 className="font-display font-black leading-none transition-opacity duration-300 group-hover:opacity-60" style={{ fontSize: 'clamp(2rem,5vw,4rem)', color: INK }}>
              Q2Code Agents
            </h3>
          </Link>
        </div>
      </section>

    </main>
  )
}
