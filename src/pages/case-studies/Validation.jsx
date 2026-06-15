import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import CaseTLDR from '../../components/CaseTLDR'
import usePageMeta from '../../hooks/usePageMeta'

// ─── Palette ─────────────────────────────────────────────────────────────────
const BG       = '#FAF7F2'
const CARD     = '#FFFFFF'
const SURFACE  = '#F0EDE5'
const ACCENT   = '#1B4F8A'   // banking blue, matches Q2 platform tone
const ACCENT_D = 'rgba(27,79,138,0.10)'
const TEXT     = '#1C2322'
const DIM      = 'rgba(28,35,34,0.70)'
const DIMMER   = 'rgba(28,35,34,0.63)'
const RULE     = 'rgba(28,35,34,0.08)'
const ERROR    = '#C0392B'
const ERROR_D  = 'rgba(192,57,43,0.10)'
const SUCCESS  = '#2F8F5C'

// ─── Report Readout image paths (chronological order) ────────────────────────
const RR = (n) => `/images/validation/reportReadout/rr${n}.png`

// ─── Fade-up variant ──────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: DIMMER }}>
      {children}
    </p>
  )
}

// ─── Rule ─────────────────────────────────────────────────────────────────────
function Rule() {
  return <div className="w-full h-px mb-10" style={{ backgroundColor: RULE }} />
}

// ─── Hero Stat (Minto Pyramid Layer 1 stat strip) ─────────────────────────────
function HeroStat({ value, label }) {
  return (
    <div className="flex-1 px-6 py-7 border-r last:border-r-0" style={{ borderColor: RULE }}>
      <div className="font-display text-4xl md:text-5xl font-bold leading-none mb-2" style={{ color: ACCENT }}>
        {value}
      </div>
      <div className="font-sans text-xs leading-snug" style={{ color: DIMMER }}>{label}</div>
    </div>
  )
}

// ─── Principle Card ───────────────────────────────────────────────────────────
function PrincipleCard({ number, title, body }) {
  return (
    <div className="bg-white rounded-2xl border p-6" style={{ borderColor: RULE }}>
      <div
        className="font-display text-3xl font-bold leading-none mb-4"
        style={{ color: ACCENT + '28' }}
      >
        {number}
      </div>
      <p className="font-sans text-sm font-semibold mb-2" style={{ color: TEXT }}>{title}</p>
      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{body}</p>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, sub }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border px-6 py-8 text-center" style={{ borderColor: RULE }}>
      <div className="font-display text-5xl font-bold leading-none mb-2" style={{ color: ACCENT }}>
        {value}
      </div>
      <div className="font-sans text-sm font-semibold mb-1" style={{ color: DIM }}>{label}</div>
      {sub && <div className="font-sans text-xs leading-snug" style={{ color: DIMMER }}>{sub}</div>}
    </div>
  )
}

// ─── Takeaway Card ────────────────────────────────────────────────────────────
function TakeawayCard({ number, text }) {
  return (
    <div className="flex items-start gap-5 bg-white rounded-xl border p-5" style={{ borderColor: RULE }}>
      <div
        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-sans text-xs font-bold"
        style={{ backgroundColor: ACCENT_D, color: ACCENT }}
      >
        {number}
      </div>
      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{text}</p>
    </div>
  )
}

// ─── Pull Quote ───────────────────────────────────────────────────────────────
function PullQuote({ quote, attribution }) {
  return (
    <div
      className="rounded-2xl p-8 border-l-4 my-10"
      style={{ borderLeftColor: ACCENT, backgroundColor: ACCENT_D, borderTop: `1px solid ${RULE}`, borderRight: `1px solid ${RULE}`, borderBottom: `1px solid ${RULE}` }}
    >
      <p className="font-display text-xl md:text-2xl font-bold leading-snug mb-3" style={{ color: TEXT }}>
        "{quote}"
      </p>
      {attribution && (
        <p className="font-sans text-xs uppercase tracking-widest" style={{ color: DIMMER }}>{attribution}</p>
      )}
    </div>
  )
}

// ─── Design System Badge ──────────────────────────────────────────────────────
function DSBadge({ name }) {
  return (
    <div
      className="flex items-center gap-2 bg-white rounded-xl border px-4 py-3"
      style={{ borderColor: RULE }}
    >
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ACCENT }} />
      <span className="font-sans text-sm font-medium" style={{ color: TEXT }}>{name}</span>
    </div>
  )
}

// ─── Decision Callout ─────────────────────────────────────────────────────────
// Explicit "we considered X, chose Y, because Z" frame, the playbook's
// decision-making layer made visible.
function DecisionCallout({ question, options, chose, rationale }) {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: RULE }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: RULE, backgroundColor: SURFACE }}>
        <p className="font-sans text-[10px] uppercase tracking-widest mb-1" style={{ color: DIMMER }}>Decision</p>
        <p className="font-display text-base md:text-lg font-bold leading-snug" style={{ color: TEXT }}>{question}</p>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="font-sans text-[10px] uppercase tracking-widest mb-3" style={{ color: DIMMER }}>Options considered</p>
          <ul className="space-y-2">
            {options.map((o, i) => (
              <li key={i} className="flex items-start gap-2 font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                <span className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: DIMMER }} />
                <span className={o === chose ? 'font-semibold' : ''} style={{ color: o === chose ? TEXT : DIM }}>
                  {o}{o === chose && <span className="ml-2 text-[10px] uppercase tracking-widest" style={{ color: ACCENT }}>chosen</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-sans text-[10px] uppercase tracking-widest mb-3" style={{ color: ACCENT }}>Why</p>
          <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{rationale}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Focus-Flow Diagram (Motion piece #1) ─────────────────────────────────────
// Shows the cognitive cost of Top of Form vs Inline by animating a focus
// indicator through each pattern. Cognitive compression in action, the UX
// difference is visible without reading.
function FocusFlowDiagram({ variant }) {
  const isTop = variant === 'top'
  const errorIdx = [0, 2, 3] // fields with errors

  // Field positions
  const FX = 30, FW = 140, FH = 26
  // Top variant: 4 fields below the error summary list (which sits at y=68-124)
  const topFields = [134, 168, 202, 236]
  // Inline variant: 4 fields with reserved 14px slot for inline error message
  const inlineFields = [80, 132, 174, 226] // varying gaps because some have errors

  // Per-variant geometry so the Submit button never overlaps fields/error text
  const submitY = isTop ? 272 : 280
  const containerH = isTop ? 304 : 320
  const viewBoxH = isTop ? 320 : 340

  // Top of Form animation keyframes (ping-pong between summary and fields)
  // Cursor: starts at submit, jumps to summary, then to field 1, back to summary, field 3, back, field 4, back
  const topKeys = {
    cx: [100, 100, 40,  100, 40,  100, 40,  100, 40,  100, 40,  100],
    cy: [283, 96,  147, 96,  215, 96,  249, 96,  283, 283, 283, 283],
  }
  const topTimes = [0, 0.08, 0.18, 0.28, 0.38, 0.48, 0.58, 0.68, 0.78, 0.88, 0.95, 1]

  // Inline animation keyframes (linear top-to-bottom flow)
  const inlineKeys = {
    cx: [100, 40,  40,  40,  100, 100],
    cy: [296, 93,  187, 239, 296, 296],
  }
  const inlineTimes = [0, 0.18, 0.42, 0.66, 0.85, 1]

  return (
    <svg
      viewBox={`0 0 200 ${viewBoxH}`}
      className="w-full h-auto block"
      role="img"
      aria-label={isTop
        ? 'Animated diagram: focus pings between top error summary and form fields'
        : 'Animated diagram: focus flows linearly through form fields with inline errors'}
    >
      {/* Form container */}
      <rect x="10" y="10" width="180" height={containerH} rx="10" fill={CARD} stroke={RULE} />
      {/* Form header line */}
      <line x1="20" y1="60" x2="180" y2="60" stroke={RULE} strokeWidth="1" />
      <text x="20" y="32" fontSize="8" fontFamily="Space Grotesk, sans-serif" fill={DIMMER} letterSpacing="1">
        {isTop ? 'TOP-OF-FORM ERRORS' : 'INLINE ERRORS'}
      </text>

      {isTop && (
        <g>
          {/* Error summary block at top, lists each error so the user must
              memorize them, scroll to the field, and map message → field. */}
          <rect x="20" y="68" width="160" height="56" rx="4" fill={ERROR_D} stroke={ERROR} strokeWidth="1" />
          <text x="28" y="80" fontSize="7" fontFamily="Space Grotesk, sans-serif" fill={ERROR} fontWeight="600">3 errors found</text>
          {/* Bullet 1 */}
          <circle cx="32" cy="92" r="1.2" fill={ERROR} />
          <text x="38" y="94" fontSize="6" fontFamily="Space Grotesk, sans-serif" fill={ERROR}>Field 1: amount is required</text>
          {/* Bullet 2 */}
          <circle cx="32" cy="103" r="1.2" fill={ERROR} />
          <text x="38" y="105" fontSize="6" fontFamily="Space Grotesk, sans-serif" fill={ERROR}>Field 3: select an account</text>
          {/* Bullet 3 */}
          <circle cx="32" cy="114" r="1.2" fill={ERROR} />
          <text x="38" y="116" fontSize="6" fontFamily="Space Grotesk, sans-serif" fill={ERROR}>Field 4: date must be in the future</text>
        </g>
      )}

      {/* Form fields */}
      {(isTop ? topFields : inlineFields).map((y, i) => {
        const hasError = errorIdx.includes(i)
        return (
          <g key={i}>
            <rect
              x={FX} y={y}
              width={FW} height={FH}
              rx="4"
              fill="white"
              stroke={hasError ? ERROR : RULE}
              strokeWidth={hasError ? 1.5 : 1}
            />
            <text x={FX + 6} y={y + 16} fontSize="7" fontFamily="Space Grotesk, sans-serif" fill={hasError ? ERROR : DIMMER}>
              Field {i + 1}
            </text>
            {/* Inline error message below the field (inline variant only) */}
            {!isTop && hasError && (
              <text
                x={FX + 2}
                y={y + FH + 10}
                fontSize="6.5"
                fontFamily="Space Grotesk, sans-serif"
                fill={ERROR}
              >
                ⓘ Error: please review this field
              </text>
            )}
          </g>
        )
      })}

      {/* Submit button */}
      <rect x="30" y={submitY} width="60" height="22" rx="4" fill={ACCENT} />
      <text x="60" y={submitY + 14} fontSize="8" fontFamily="Space Grotesk, sans-serif" fill="white" textAnchor="middle" fontWeight="600">Submit</text>

      {/* Animated focus indicator, 'eye' that traces user attention */}
      <motion.g
        animate={isTop ? topKeys : inlineKeys}
        transition={{
          duration: isTop ? 9 : 6,
          repeat: Infinity,
          ease: 'easeInOut',
          times: isTop ? topTimes : inlineTimes,
        }}
        style={{ originX: '50%', originY: '50%' }}
      >
        <circle r="9" fill={ACCENT} opacity="0.18" />
        <circle r="5" fill={ACCENT} />
      </motion.g>
    </svg>
  )
}

// CSS keyframes for the layout-shift demo.
const VAL_SHIFT_CSS = `
@keyframes valShiftFieldB {
  0%, 20%    { transform: translate(0, 0); }
  20.01%, 80% { transform: translate(0, 16px); }
  80.01%, 100% { transform: translate(0, 0); }
}
.val-shift-fieldB {
  animation: valShiftFieldB 5s linear infinite;
}
@keyframes valErrorIn {
  0%, 20%    { opacity: 0; }
  20.01%, 80% { opacity: 1; }
  80.01%, 100% { opacity: 0; }
}
.val-error-msg {
  animation: valErrorIn 5s linear infinite;
}
@keyframes valSlotOut {
  0%, 20%    { opacity: 1; }
  20.01%, 80% { opacity: 0; }
  80.01%, 100% { opacity: 1; }
}
.val-slot-indicator {
  animation: valSlotOut 5s linear infinite;
}
@keyframes valFieldAStroke {
  0%, 20%    { stroke: rgba(28,35,34,0.08); }
  20.01%, 80% { stroke: #C0392B; }
  80.01%, 100% { stroke: rgba(28,35,34,0.08); }
}
.val-fieldA-border {
  animation: valFieldAStroke 5s linear infinite;
}
@keyframes valFieldAText {
  0%, 20%    { fill: rgba(28,35,34,0.63); }
  20.01%, 80% { fill: #C0392B; }
  80.01%, 100% { fill: rgba(28,35,34,0.63); }
}
.val-fieldA-text {
  animation: valFieldAText 5s linear infinite;
}
`

// ─── Layout-Shift Diagram (Motion piece #2) ───────────────────────────────────
// Shows why the 16px reserved slot eliminates layout shift when an error
// appears. Two side-by-side mini-forms cycle through the same submit event.
function LayoutShiftDiagram({ reservedSlot }) {
  // When 'reservedSlot' is true, the field always reserves 14px of space below it,
  // so when the error fires, no fields move. When false, the bottom field is
  // pushed downward to make room.
  const errorAppears = {
    show:   { opacity: 1 },
    hidden: { opacity: 0 },
  }
  const fieldPos = {
    // No reserved slot: field B starts close to A, gets pushed down when error fires
    none:   { yA: 60, yB_idle: 108, yB_err: 124 },
    // Reserved slot: gap is permanent, field B stays put
    reserved:{yA: 60, yB_idle: 124, yB_err: 124 },
  }
  const cfg = reservedSlot ? fieldPos.reserved : fieldPos.none

  return (
    <>
      <style>{VAL_SHIFT_CSS}</style>
    <svg
      viewBox="0 0 220 220"
      className="w-full h-auto block"
      role="img"
      aria-label={reservedSlot
        ? 'Animated diagram: form with reserved 16px slot, error appears with no layout shift'
        : 'Animated diagram: form without reserved slot, second field jumps down when error appears'}
    >
      <rect x="10" y="10" width="200" height="200" rx="10" fill={CARD} stroke={RULE} />
      <text x="22" y="32" fontSize="8" fontFamily="Space Grotesk, sans-serif" fill={DIMMER} letterSpacing="1">
        {reservedSlot ? 'WITH RESERVED SLOT' : 'WITHOUT RESERVED SLOT'}
      </text>

      {/* Field A, toggles between neutral and error styling */}
      <rect className="val-fieldA-border" x="22" y={cfg.yA} width="176" height="28" rx="4" fill="white" strokeWidth="1.5" />
      <text className="val-fieldA-text" x="28" y={cfg.yA + 17} fontSize="8" fontFamily="Space Grotesk, sans-serif">Field A</text>


      {/* Inline error message under Field A, synced with Field B shift via CSS */}
      <g className="val-error-msg">
        <text x="22" y={cfg.yA + 42} fontSize="7" fontFamily="Space Grotesk, sans-serif" fill={ERROR}>
          ⓘ Error: please correct this field
        </text>
      </g>

      {/* Field B, snaps down when no reserved slot, in lockstep with the error appearing.
          Uses CSS keyframes because Framer Motion's `y` and transform string syntax
          don't reliably translate SVG group elements. */}
      <g className={reservedSlot ? '' : 'val-shift-fieldB'} style={{ transformBox: 'fill-box', transformOrigin: 'top left' }}>
        <rect x="22" y={cfg.yB_idle} width="176" height="28" rx="4" fill="white" stroke={RULE} />
        <text x="28" y={cfg.yB_idle + 17} fontSize="8" fontFamily="Space Grotesk, sans-serif" fill={DIMMER}>Field B</text>
      </g>

      {/* Status indicator */}
      <text x="22" y="190" fontSize="7" fontFamily="Space Grotesk, sans-serif" fill={reservedSlot ? SUCCESS : ERROR} fontWeight="600">
        {reservedSlot ? '✓ Field B stays put' : '✕ Field B jumps down 16px'}
      </text>
    </svg>
    </>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Validation() {
  usePageMeta(
    'Form Validation by Stephen Hurt',
    'Building the evidence-based case for inline validation, then shipping it as the new platform standard across 9 form components with zero new accessibility code.'
  )
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 800], ['0%', '-18%'])

  return (
    <main style={{ backgroundColor: BG }}>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-0 h-screen overflow-hidden flex flex-col justify-end">
        <div className="absolute inset-0" style={{
          backgroundImage: `url('/images/FormValidation/formvalidationherobg.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }} />
        <motion.div
          className="absolute pointer-events-none"
          style={{ y: bgY, top: '-20%', bottom: '-20%', left: 0, right: 0 }}
        >
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to right, rgba(10,15,30,0.88) 0%, rgba(10,15,30,0.60) 55%, rgba(10,15,30,0.25) 100%)`,
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-48" style={{
            background: `linear-gradient(to bottom, transparent, ${BG})`,
          }} />
        </motion.div>

        <div className="relative z-10 px-8 md:px-14 pb-16 md:pb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-2 mb-7"
          >
            {['UX Research', 'Prototyping', 'Design Systems', 'Q2'].map((t) => (
              <span
                key={t}
                className="font-sans text-xs px-3 py-1.5 rounded-full border"
                style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'rgba(255,255,255,0.8)' }}
              >
                {t}
              </span>
            ))}
          </motion.div>
          <div className="overflow-hidden mb-5">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black leading-[0.88]"
              style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)', color: '#FAF7F2' }}
            >
              Top of Form vs<br className="hidden md:block" /> Inline Validation
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-lg leading-relaxed max-w-xl"
            style={{ color: 'rgba(250,247,242,0.78)' }}
          >
            Made the research case for inline validation in 2024. Two years later, nine Tecton form components shipped and inline became the platform's new standard for form work. Here's how the same evidence finally got it across the line.
          </motion.p>
        </div>
      </section>

      <div className="relative z-10" style={{ backgroundColor: BG }}>

      {/* ── TL;DR ──────────────────────────────────────────────────────── */}
      <CaseTLDR
        colors={{ text: TEXT, dim: DIM, accent: ACCENT, surface: CARD, rule: RULE }}
        summary={`The case for inline validation was airtight, academic research, all seven major design systems, and a moderated study all agreed. But in 2024 the org timing wasn't there, so I filed it. Two years later I reopened it and shipped it across nine form components in three weeks as the platform's new standard, reusing an existing component, so it needed zero new accessibility code.`}
        stats={[
          { value: '9', label: 'Tecton form components shipped' },
          { value: 'Majority', label: 'Of participants preferred inline' },
          { value: '7/7', label: 'Major design systems agree' },
          { value: '0', label: 'New accessibility code at the component level' },
        ]}
      />

      {/* ── Overview Strip ─────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-14 border-b" style={{ borderColor: RULE }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {[
                { label: 'Role',     value: 'Product Designer · built the evidence case (desk research + competitive audit) and created the test prototypes; partnered with a UX Researcher who designed and moderated the usability study. Drove the 2026 implementation and platform-wide rollout end-to-end' },
                { label: 'Scope',    value: 'Desk research, usability study design, moderated sessions, analysis, stakeholder presentation, org-wide rollout' },
                { label: 'Platform', value: 'Q2 online banking, desktop and mobile web' },
                { label: 'Timeline', value: 'Research 2024 · dormant 2024-2026 · in development April 2026 · new platform standard May 2026' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: DIMMER }}>{item.label}</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <article className="px-8 md:px-14 py-20">
        <div className="max-w-6xl mx-auto space-y-28">

          {/* ── 01 ─────────────────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>01: Why error states became Q2's most visible legacy pattern</SectionLabel>
            <Rule />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-6" style={{ color: TEXT }}>
                  Error states are a trust moment. Getting them wrong has a cost.
                </h2>
                <div className="space-y-4 font-sans text-base leading-relaxed" style={{ color: DIM }}>
                  <p>
                    Q2's online banking platform was in the middle of UUX Next, a platform-wide initiative to modernize the UI. The effort was still early and much of the interface remained on legacy patterns, form error states among them: errors surfaced as a summary block at the top of the form after submission.
                  </p>
                  <p>
                    This pattern, "Top of Form Validation," carried a known usability cost. Users had to read an error summary, remember which fields were affected, scroll to find them, and fix each one. The question was whether research would support switching to inline validation, and how to make that case with evidence rather than opinion.
                  </p>
                </div>
              </div>
              <div className="space-y-5">
                <div
                  className="rounded-2xl p-7 border"
                  style={{ borderColor: `${ACCENT}30`, backgroundColor: ACCENT_D }}
                >
                  <p className="font-sans text-xs uppercase tracking-widest mb-4" style={{ color: ACCENT }}>The central question</p>
                  <p className="font-display text-xl font-bold leading-snug mb-4" style={{ color: TEXT }}>
                    Should Q2 move from Top of Form to Inline Validation, and what do users actually prefer?
                  </p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    Answering this took two parallel tracks: pulling together academic research and industry precedent to build the case on paper, then running a moderated usability study with real banking customers to back it up with how people actually behaved.
                  </p>
                </div>
                <div
                  className="rounded-2xl p-7 border"
                  style={{ borderColor: 'rgba(192,57,43,0.2)', backgroundColor: 'rgba(192,57,43,0.05)' }}
                >
                  <p className="font-sans text-xs uppercase tracking-widest mb-4" style={{ color: ERROR }}>The business stakes</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    Q2 operates in a competitive enterprise SaaS market where UI quality directly influences deal outcomes. Prospective financial institutions evaluate multiple platforms before signing. An outdated UI doesn't just frustrate users, it signals to buyers that the technology behind it might be behind too. In sales demos, prospects consistently heard from competitors that Q2's UI looked dated, feedback that reached us through sales and marketing. Top of Form Validation wasn't the only contributor, but to me it was one of the most glaring, and most fixable, examples of that legacy feel.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── 02 ─────────────────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>02: Three independent sources, one consistent answer</SectionLabel>
            <Rule />
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: TEXT }}>
              Before the study, the case was already strong
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-12" style={{ color: DIM }}>
              Desk research, academic literature, Nielsen Norman Group principles, and a competitive audit of major design systems all pointed to the same answer before a single user was ever tested.
            </p>

            <div className="rounded-2xl overflow-hidden border mb-6" style={{ borderColor: RULE }}>
              <img
                src="/images/validation/presentation/1.png"
                alt="Top of Form vs Inline Validation, academic research and cognitive load comparison"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <p className="font-sans text-xs mb-12 leading-relaxed" style={{ color: DIMMER }}>
              Academic research (IUI 2003): Top of Form Validation imposes a high cognitive load on memory. Inline validation uses recognition over recall, reducing correction time and cognitive overhead.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
              <PrincipleCard
                number="01"
                title="Academic research (IUI 2003)"
                body="Displaying all errors at the top of a form forces users to recall each error message and map it back to the correct field, a task that degrades with form length and error count."
              />
              <PrincipleCard
                number="02"
                title="Nielsen Norman Group"
                body="Inline validation relies on recognition instead of recall. Error messages should be easy to notice, the field in error should be easy to locate, and users shouldn't have to memorize the fix."
              />
              <PrincipleCard
                number="03"
                title="Industry standard"
                body="Every major design system, Carbon, Material, Fluent, Spectrum, Bootstrap, Atlassian, Salesforce, uses inline validation as the default error pattern. It's settled practice at this point."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: RULE }}>
                <img src="/images/validation/presentation/4.png" alt="Minimizing cognitive load, Nielsen Norman Group principles" className="w-full h-auto" loading="lazy" />
              </div>
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: RULE }}>
                <img src="/images/validation/presentation/5.png" alt="Aim for inline validation whenever possible, NNG" className="w-full h-auto" loading="lazy" />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
              {['Carbon Design System','Google Material','Adobe Spectrum','Microsoft Fluent','Bootstrap','Atlassian Design System','Salesforce Lightning'].map((name) => (
                <DSBadge key={name} name={name} />
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden border" style={{ borderColor: RULE }}>
              <img src="/images/validation/presentation/6.png" alt="Industry precedent, inline validation across seven major design systems" className="w-full h-auto" loading="lazy" />
            </div>
            <p className="font-sans text-xs mt-4 leading-relaxed" style={{ color: DIMMER }}>
              Competitive audit: every system surfaces errors adjacent to the input field. No summary blocks. No memory load.
            </p>
          </motion.section>

          {/* ── 03 ─────────────────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>03: Same form, two completely different error experiences</SectionLabel>
            <Rule />
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: TEXT }}>
              Where errors appear changes how users solve them
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-10" style={{ color: DIM }}>
              Both patterns were designed against Q2's Funds Transfer form, one of the highest-traffic forms in the platform, to make the comparison concrete. Desktop and mobile variants were both produced for testing.
            </p>

            {/* Motion piece #1, focus-flow comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-3">
              <div className="rounded-2xl border p-6" style={{ borderColor: RULE, backgroundColor: CARD }}>
                <p className="font-sans text-[10px] uppercase tracking-widest mb-4" style={{ color: ERROR }}>Top of Form, visual ping-pong</p>
                <FocusFlowDiagram variant="top" />
              </div>
              <div className="rounded-2xl border p-6" style={{ borderColor: RULE, backgroundColor: CARD }}>
                <p className="font-sans text-[10px] uppercase tracking-widest mb-4" style={{ color: SUCCESS }}>Inline, linear flow</p>
                <FocusFlowDiagram variant="inline" />
              </div>
            </div>
            <p className="font-sans text-xs mb-12 leading-relaxed max-w-3xl" style={{ color: DIMMER }}>
              <span className="font-semibold" style={{ color: TEXT }}>What this animation shows: </span>
              with top-of-form validation, attention pings between the summary banner and each field, read the error, scroll to find the field, fix it, scroll back to the summary, repeat. With inline validation, attention flows linearly from one field to the next. It's not about looks, it's about where the user has to look.
            </p>

            {/* Desktop screenshots side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              <div>
                <div className="rounded-2xl overflow-hidden border mb-3" style={{ borderColor: RULE }}>
                  <img src="/images/validation/presentation/2.png" alt="Top of Form Validation, Funds Transfer desktop" className="w-full h-auto" loading="lazy" />
                </div>
                <div className="flex items-start gap-3 px-1">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#E8A0B0' }}>
                    <span className="text-white text-[10px] font-bold">✕</span>
                  </div>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    <span className="font-semibold" style={{ color: TEXT }}>Top of Form (Desktop): </span>
                    Error summary lists all issues at the top. Users must memorize what's wrong, scroll back down, and locate each field, no spatial connection between the message and the problem.
                  </p>
                </div>
              </div>
              <div>
                <div className="rounded-2xl overflow-hidden border mb-3" style={{ borderColor: RULE }}>
                  <img src="/images/validation/presentation/3.png" alt="Inline Validation, Funds Transfer desktop" className="w-full h-auto" loading="lazy" />
                </div>
                <div className="flex items-start gap-3 px-1">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#4CAF82' }}>
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    <span className="font-semibold" style={{ color: TEXT }}>Inline (Desktop): </span>
                    Errors appear directly beneath each affected field. No memory required, the error and the fix are co-located, letting users correct each field in sequence.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border mb-4" style={{ borderColor: RULE }}>
              <img src={RR(4)} alt="Mobile designs, 2A Funds Transfer Top of Form vs 2B Funds Transfer Inline Validation" className="w-full h-auto" loading="lazy" />
            </div>
            <p className="font-sans text-xs mb-5 leading-relaxed" style={{ color: DIMMER }}>
              Mobile variants of both patterns were also designed and tested. 2A (left): error summary at top. 2B (right): errors inline with each field.
            </p>
          </motion.section>

          {/* ── 04 ─────────────────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>04: Putting both patterns in front of real banking customers</SectionLabel>
            <Rule />
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: TEXT }}>
              Six participants, two tasks, moderated remote sessions
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-12" style={{ color: DIM }}>
              With that case established, the study put both patterns in front of real banking customers using a think-aloud protocol over Zoom, capturing what they could do and how they felt while doing it.
            </p>

            {/* Decision callouts, make the methodology choices explicit */}
            <div className="space-y-5 mb-12">
              <DecisionCallout
                question="How many participants and what kind of session?"
                options={[
                  '12+ participants, unmoderated remote',
                  '6 participants, moderated remote (think-aloud)',
                  'In-person lab study with 8 participants',
                ]}
                chose="6 participants, moderated remote (think-aloud)"
                rationale="The goal wasn't statistical significance, it was directional confidence and a clear read on how people actually behaved. Six is the standard qualitative sample for comparative usability work, and Nielsen Norman Group research suggests five participants surface ~85% of usability issues. Moderated think-aloud shows you why people do what they do, which an unmoderated study can't."
              />
              <DecisionCallout
                question="Which form length should we test against?"
                options={[
                  'Only Funds Transfer (short, high-stakes)',
                  'Only Online Banking Enrollment (longer, multi-field)',
                  'Both, to test whether preference holds across complexity',
                ]}
                chose="Both, to test whether preference holds across complexity"
                rationale="Top-of-form validation's cognitive cost scales with form length. If we only tested the short form, the legacy pattern would face its easiest test. Running both, the short Funds Transfer form and the longer multi-field Online Banking Enrollment form, let us check whether participants prefer inline regardless of form size. The preference held across both, and was clearest on the longer form."
              />
            </div>

            <div className="rounded-2xl overflow-hidden border mb-4" style={{ borderColor: RULE }}>
              <img src={RR(1)} alt="Task overview, Online Banking Enrollment and Funds Transfer tasks" className="w-full h-auto" loading="lazy" />
            </div>
            <p className="font-sans text-xs mb-12 leading-relaxed" style={{ color: DIMMER }}>
              Two tasks tested against both validation patterns: (1) Online Banking Enrollment, a longer multi-field form. (2) Funds Transfer, a shorter, higher-stakes form.
            </p>

            <p className="font-sans text-xs uppercase tracking-widest mb-2" style={{ color: DIMMER }}>Research questions and session structure</p>
            <p className="font-sans text-sm mb-5 leading-relaxed" style={{ color: DIM }}>
              Three research questions guided the sessions: whether Top of Form or Inline validation worked better; how users responded to the quick-select interaction in the transfer form; and whether users had a preference between the two patterns across form types.
            </p>
            <div className="rounded-2xl overflow-hidden border mb-12" style={{ borderColor: RULE }}>
              <img src={RR(3)} alt="Research questions and session structure" className="w-full h-auto" loading="lazy" />
            </div>

            <div className="rounded-2xl overflow-hidden border mb-4" style={{ borderColor: RULE }}>
              <img src={RR(2)} alt="Designs shown to participants, Online Banking Enrollment Top of Form vs Inline, desktop" className="w-full h-auto" loading="lazy" />
            </div>
            <p className="font-sans text-xs leading-relaxed" style={{ color: DIMMER }}>
              Desktop designs shown to participants. Left: Online Banking Enrollment with Top of Form error summary. Right: the same form with errors displayed inline, adjacent to each affected field.
            </p>
          </motion.section>

          {/* ── 05 ─────────────────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>05: Users called the inline version "less anxiety-inducing"</SectionLabel>
            <Rule />
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: TEXT }}>
              The research held up, and users agreed.
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-12" style={{ color: DIM }}>
              Participants successfully cleared all errors in both variants, across Q2 select, Q2 input, and Q2 textarea components. Task completion was equivalent on both forms, which is meaningful context, not a null result. The Funds Transfer form is one of the shortest in the platform, the least punishing test for top-of-form, and even there users found inline less stressful and clearer. On the longer Online Banking Enrollment form, where top-of-form's cognitive cost is highest, the preference for inline was clearest of all. That users found inline more comfortable even where the legacy pattern should perform best is the finding, not the completion rate.
            </p>

            <div className="rounded-2xl overflow-hidden border mb-4" style={{ borderColor: RULE }}>
              <img src={RR(6)} alt="Quantitative metrics, SEQ, task completion rate, and VisAWI scores" className="w-full h-auto" loading="lazy" />
            </div>
            <p className="font-sans text-xs mb-12 leading-relaxed" style={{ color: DIMMER }}>
              SEQ, task completion rate, and VisAWI captured across both conditions. Where scores trended below benchmarks, participants framed this as the inherent friction of any error state, not a failure of either design.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: RULE }}>
                <img src={RR(7)} alt="Top of Form vs Inline Validation, detailed participant takeaways" className="w-full h-auto" loading="lazy" />
              </div>
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: RULE }}>
                <img src={RR(8)} alt="Top of Form vs Inline Validation, summary and recommendation" className="w-full h-auto" loading="lazy" />
              </div>
            </div>

            <PullQuote
              quote="It's simplified. Less anxiety-inducing. The error is right there where I need it."
              attribution="Study participant, on inline validation"
            />

            <div className="space-y-4">
              <TakeawayCard
                number={1}
                text="All 6 participants successfully cleared all errors in both variants, across Q2 select, Q2 input, and Q2 textarea components."
              />
              <TakeawayCard
                number={2}
                text='The majority preferred Inline Validation. The Top of Form error list was described as "cumbersome", participants had to scroll up and down to find and fix each error.'
              />
              <TakeawayCard
                number={3}
                text='Inline Validation was described as "simplified," "less anxiety-inducing," and "clear." Errors appearing where users were already working removed the need for navigation.'
              />
              <TakeawayCard
                number={4}
                text="Testing both a short form (Funds Transfer) and a longer multi-field form (Online Banking Enrollment) mattered: top-of-form's cognitive cost scales with length, and the preference for inline was clearest on the longer form, exactly where the legacy pattern is most punishing."
              />
            </div>
          </motion.section>

          {/* ── 06 ─────────────────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>06: Why screen readers benefit even more than sighted users</SectionLabel>
            <Rule />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-6" style={{ color: TEXT }}>
                  Inline validation has a stronger accessibility story
                </h2>
                <div className="space-y-5 font-sans text-base leading-relaxed" style={{ color: DIM }}>
                  <p>
                    When a screen reader user submits an invalid form, the browser moves focus to the error block. The reader announces a list of errors, and the user must then navigate back to correct each field individually. This is the screen reader equivalent of the same cognitive load problem sighted users experience, except it's worse, because there's no peripheral vision to anchor location.
                  </p>
                  <p>
                    With inline validation and properly implemented <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>aria-live</code> regions, errors are announced as soon as a field loses focus, keeping the user in context, adjacent to the field that needs attention.
                  </p>
                  <p>
                    This approach directly satisfies WCAG 3.3.1 (Error Identification) and 3.3.3 (Error Suggestion), which require errors to be described in text and suggestions for correction to be provided.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: RULE }}>
                <img src="/images/validation/presentation/7.png" alt="Screen reader accessibility, aria-live and focus management for inline validation" className="w-full h-auto" loading="lazy" />
              </div>
            </div>
          </motion.section>

          {/* ── 07 ─────────────────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>07: Adopt inline. Formalize it under UUX Next.</SectionLabel>
            <Rule />
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: TEXT }}>
              Three independent sources lined up, and the recommendation followed.
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-12" style={{ color: DIM }}>
              Academic evidence, industry precedent, and direct participant preference all aligned. The recommendations were to adopt inline validation as the platform standard, add a confirmation page to the Funds Transfer flow, and clarify the transfer-date copy. The key next step: carry inline validation into UUX Next for formal design system documentation.
            </p>

            <div className="rounded-2xl overflow-hidden border mb-10" style={{ borderColor: RULE }}>
              <img src={RR(9)} alt="Research recommendations and next steps" className="w-full h-auto" loading="lazy" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
              {[
                { num: '01', title: 'Adopt inline validation', body: 'Move forward with inline validation for error display across all Q2 forms. The evidence, both theoretical and behavioral, supports this regardless of form length.' },
                { num: '02', title: 'Add a confirmation page',  body: 'Add a confirmation page to the Funds Transfer flow. Participants expected to review transfer details before completing, a standard pattern missing from the current design.' },
                { num: '03', title: 'Clarify transfer-date copy',     body: 'Update the language around transfer dates so users understand when a transfer will actually process. Participants were unsure whether "today" meant same-day, and wanted the initiation date and anticipated processing date labeled clearly. (Refined during the report readout.)' },
              ].map((item) => (
                <div key={item.num} className="bg-white rounded-2xl border p-6" style={{ borderColor: RULE }}>
                  <div className="font-display text-3xl font-bold leading-none mb-4" style={{ color: ACCENT + '28' }}>{item.num}</div>
                  <p className="font-sans text-sm font-semibold mb-2" style={{ color: TEXT }}>{item.title}</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{item.body}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <StatCard value="6"   label="Study participants" sub="Moderated remote Zoom sessions with banking customers" />
              <StatCard value="7/7" label="Design systems"     sub="Every major enterprise design system uses inline as the standard" />
              <StatCard value="Majority" label="Preferred inline"   sub="Preference was clearest on the longer form; a couple had no preference on the short form" />
            </div>
          </motion.section>

          {/* ── 08 ─────────────────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>08: Right research, wrong moment, and the question that reopened the file</SectionLabel>
            <Rule />
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: TEXT }}>
              The research was done and the case was made, but nobody moved.
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-12" style={{ color: DIM }}>
              After the recommendation was presented, the project was added to UUX Next, Q2's initiative for addressing platform-wide UI work incrementally. In theory, that meant it would get a sprint. In practice, it joined a backlog of credible work competing for sprint capacity, with no dedicated owner pushing it forward.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
              <div className="space-y-5 font-sans text-base leading-relaxed" style={{ color: DIM }}>
                <p>
                  I reached out to a senior designer who had worked at Q2 for years. The feedback was direct:{' '}
                  <span className="font-semibold" style={{ color: TEXT }}>"Don't bother. This is just the way we do it here."</span>{' '}
                  It wasn't dismissive, it was just how things worked there. A senior developer I spoke with separately confirmed Q2 had actually used inline validation before switching to the current top-of-form pattern. Nobody could explain why it was removed, the reason had just been lost over time. Nobody was against the change, but nobody was pushing for it either.
                </p>
                <p>
                  I had a full plate of assigned work, the Secure Messaging redesign, Consumer Dashboard, and component library contributions were all actively in flight, and was still relatively new to the organization. Forcing a platform-wide pattern change without active sponsorship, against a default nobody could even explain, wasn't the right battle to pick. I filed it as important-but-not-urgent and moved on.
                </p>
              </div>
              <div className="space-y-5 font-sans text-base leading-relaxed" style={{ color: DIM }}>
                <p>
                  Almost two years later, a designer from an off-shoot brand that builds on Tecton asked a simple question:{' '}
                  <span className="font-semibold" style={{ color: TEXT }}>why can't we have inline validation?</span>{' '}
                  That question reopened the file. The research was still solid. The recommendation was unchanged. But the conditions were completely different.
                </p>
                <p>
                  This time I had organizational credibility and direct developer relationships I hadn't had in 2024. And the "zero to one" working model from the Component Library project (small scope, direct dev collaboration, sprint-based) meant I knew exactly how to compress the timeline.
                </p>
                <p>
                  Two presentations to the development team, using the original research as the foundation, aligned scope and approach. Bringing in other designers gave the recommendation shared ownership, which made engineering prioritization easier to justify. The work hit the sprint in three weeks. All nine components shipped and rolled out platform-wide in May 2026.
                </p>
              </div>
            </div>

            {/* Timeline */}
            <p className="font-sans text-xs uppercase tracking-widest mb-6" style={{ color: DIMMER }}>Timeline</p>
            <div className="max-w-2xl">
              {[
                { date: '2024',         label: 'Research completed',         detail: 'Moderated usability study conducted with 6 banking customers. Recommendation made to adopt inline validation platform-wide.', isActive: true,  isDim: false },
                { date: '2024',         label: 'Added to UUX Next backlog',  detail: 'Project entered the initiative. Sprint capacity unassigned. No dedicated owner.',                                              isActive: false, isDim: false },
                { date: '2024 - 2026',  label: 'Dormant',                    detail: "Secure Messaging, Consumer Dashboard, and component library work kept me at capacity across multiple product teams. Without active sponsorship for a platform-wide pattern change, I filed it as important-but-not-urgent.", isActive: false, isDim: true  },
                { date: 'April 2026',   label: 'Catalyst question',          detail: "An off-shoot brand designer asked why inline validation wasn't available in Tecton. The file reopened.",                       isActive: true,  isDim: false },
                { date: 'April 2026',   label: 'Engineering alignment',      detail: 'Two presentations to the development team. Other designers brought in. Scope and approach aligned across the group.',         isActive: true,  isDim: false },
                { date: 'April 2026',   label: 'In development',             detail: 'Added to sprint. All nine Tecton form components updated.',                                                                   isActive: true,  isDim: false },
                { date: 'May 2026',     label: 'Shipped as the new standard',      detail: 'The update was presented to all Q2 designers and inline validation became the default for all new form work. Because customers upgrade Tecton on their own schedule, the change was built backwards-compatible and opt-in: release notes recommended switching, and designers could partner with their product-team developers to audit and migrate existing forms.', isActive: true, isDim: false },
              ].map((item, i, arr) => {
                const borderClr = item.isDim ? 'rgba(28,35,34,0.08)' : item.isActive ? ACCENT + '55' : 'rgba(28,35,34,0.18)'
                const dotBg     = item.isDim ? BG                    : item.isActive ? ACCENT        : SURFACE
                const dotBorder = item.isDim ? 'rgba(28,35,34,0.18)' : item.isActive ? ACCENT        : 'rgba(28,35,34,0.3)'
                const dateClr   = item.isDim ? 'rgba(28,35,34,0.28)' : item.isActive ? ACCENT        : DIMMER
                const labelClr  = item.isDim ? 'rgba(28,35,34,0.32)' : TEXT
                const bodyClr   = item.isDim ? 'rgba(28,35,34,0.28)' : DIM
                return (
                  <div
                    key={i}
                    className="relative pl-8 pb-9"
                    style={{ borderLeft: i < arr.length - 1 ? `2px solid ${borderClr}` : '2px solid transparent' }}
                  >
                    <div
                      className="absolute"
                      style={{ top: '4px', left: '-6px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: dotBg, border: `2px solid ${dotBorder}` }}
                    />
                    <p className="font-sans text-xs uppercase tracking-widest mb-1" style={{ color: dateClr }}>{item.date}</p>
                    <p className="font-sans text-sm font-semibold mb-1.5" style={{ color: labelClr }}>{item.label}</p>
                    <p className="font-sans text-sm leading-relaxed" style={{ color: bodyClr }}>{item.detail}</p>
                  </div>
                )
              })}
            </div>
          </motion.section>

          {/* ── 09 ─────────────────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>09: One component variant. Nine forms. Zero new accessibility code.</SectionLabel>
            <Rule />
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: TEXT }}>
              From recommendation to in development
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-12" style={{ color: DIM }}>
              The research recommendation was clear. The engineering question was more nuanced: how do you add inline error messages to nine existing Tecton components without rebuilding them from scratch, or duplicating the accessibility work already in the system?
            </p>

            {/* Decision callout, the implementation tradeoff */}
            <div className="mb-12">
              <DecisionCallout
                question="Build a new inline-error component, or extend an existing one?"
                options={[
                  'Build a new InlineError component from scratch',
                  'Add a new variant to existing Q2 Message (showAsInline=true)',
                  'Hard-code error display into each of the 9 form components',
                ]}
                chose="Add a new variant to existing Q2 Message (showAsInline=true)"
                rationale="Q2 Message already had the ARIA wiring built in (aria-live, aria-invalid, aria-describedby). Building net-new would duplicate that work, risk drift, and create a parallel accessibility surface to maintain. Hard-coding into each form component would make every future change a 9-component refactor. A single new variant of an existing component meant the inline error inherited every accessibility guarantee already in the system, with no new a11y code at the component level."
              />
            </div>

            {/* Approach + info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
              <div>
                <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: DIMMER }}>The approach</p>
                <div className="space-y-4 font-sans text-base leading-relaxed" style={{ color: DIM }}>
                  <p>
                    Rather than build a net-new component, the team created a new variant of Q2's existing{' '}
                    <span className="font-semibold" style={{ color: TEXT }}>Q2 Message</span> component:{' '}
                    <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>showAsInline=true</code>.
                    This compact 16px variant (icon and text only, no border container) is designed to slot directly below each form field.
                  </p>
                  <p>
                    Each of the nine Tecton form components received a matching{' '}
                    <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>showAsInline=true</code>{' '}
                    prop that reserves a 16px slot at the bottom of the component. When validation fires, the inline message drops into that space.
                  </p>
                  <p>
                    The key advantage: <span className="font-semibold" style={{ color: TEXT }}>Q2 Message already had all the required ARIA wiring built in</span>, including{' '}
                    <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>aria-live</code>,{' '}
                    <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>aria-invalid</code>, and{' '}
                    <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>aria-describedby</code>.
                    By reusing the component rather than building new, the ARIA wiring came with it. No new accessibility code at the component level.
                  </p>
                  <p>
                    One documented exception, surfaced by a developer before implementation: for very long or complex forms, Q2's developer documentation recommends also placing the standard non-inline Q2 Message variant at the top of the form on submission, indicating how many errors are present in total. The inline errors still appear on every field. The top-level message gives users of long forms a summary anchor before they begin correcting, without replacing the contextual inline errors that do the actual work.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border p-6" style={{ borderColor: RULE, backgroundColor: CARD }}>
                  <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: DIMMER }}>Component used</p>
                  <p className="font-sans text-sm font-semibold mb-2" style={{ color: TEXT }}>
                    Q2 Message , {' '}
                    <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>showAsInline=true</code>
                  </p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    A new variant of Q2's existing Message component. 16px tall, compact, icon and text only. Slotted into the bottom of all nine Tecton form components via a new <code className="font-mono text-xs">showAsInline</code> prop.
                  </p>
                </div>
                <div className="rounded-2xl border p-6" style={{ borderColor: RULE, backgroundColor: CARD }}>
                  <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: DIMMER }}>Scope</p>
                  <p className="font-sans text-sm font-semibold mb-2" style={{ color: TEXT }}>9 Tecton form components</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    Calendar · Checkbox Group · Editable Field · File Picker · Input · Option Group · Radio Group · Select · Textarea
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border mb-3" style={{ borderColor: RULE }}>
              <img src="/images/validation/implementation/message-variants.png" alt="Q2 Message component, existing variants alongside the new showAsInline=true variant" className="w-full h-auto" loading="lazy" />
            </div>
            <p className="font-sans text-xs mb-10 leading-relaxed" style={{ color: DIMMER }}>
              The two existing Q2 Message variants (top) alongside the new <code className="font-mono text-xs">showAsInline=true</code> variant (bottom). At 16px tall, the inline variant is compact enough to sit below a form field without disrupting the form's visual rhythm.
            </p>

            <div className="rounded-2xl overflow-hidden border mb-3" style={{ borderColor: RULE }}>
              <img src="/images/validation/ProposedConfigurationExamplecopy.webp" alt="Select component with showAsInline disabled (top) and enabled (bottom)" className="w-full h-auto" loading="lazy" />
            </div>
            <p className="font-sans text-xs mb-16 leading-relaxed" style={{ color: DIMMER }}>
              The Select component with <code className="font-mono text-xs">showAsInline</code> off (top) and on (bottom). Enabling the prop increases the component's height by 16px, creating the reserved slot for the inline message.
            </p>

            {/* Motion piece #2, layout-stability comparison */}
            <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: DIMMER }}>Why the reserved slot matters</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-5" style={{ color: TEXT }}>
              No layout shift, ever
            </h3>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-8" style={{ color: DIM }}>
              The 16px slot exists whether or not an error is present. That means submitting a form with every field in error doesn't reflow the page. Nothing moves. The errors appear in space already allocated.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-3">
              <div className="rounded-2xl border p-6" style={{ borderColor: RULE, backgroundColor: CARD }}>
                <LayoutShiftDiagram reservedSlot={false} />
              </div>
              <div className="rounded-2xl border p-6" style={{ borderColor: RULE, backgroundColor: CARD }}>
                <LayoutShiftDiagram reservedSlot={true} />
              </div>
            </div>
            <p className="font-sans text-xs mb-16 leading-relaxed max-w-3xl" style={{ color: DIMMER }}>
              <span className="font-semibold" style={{ color: TEXT }}>What this animation shows: </span>
              left, an error message appears beneath Field A and pushes Field B down 16px, the user's cursor or finger position is now aimed at the wrong field. Right, the same error appears in space already reserved, Field B doesn't move, the user's intent stays valid. The reserved slot is what keeps a usability win from quietly creating a new problem.
            </p>

            {/* Spacing recommendation */}
            <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: DIMMER }}>The spacing recommendation</p>
            <h3 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-5" style={{ color: TEXT }}>
              <code className="font-mono">--app-scale-3x</code> minimum between form fields
            </h3>
            <div className="space-y-4 font-sans text-base leading-relaxed max-w-3xl mb-10" style={{ color: DIM }}>
              <p>
                Q2's platform uses a 5px spacing token system:{' '}
                <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>--app-scale-1x</code> is 5px,{' '}
                <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>--app-scale-2x</code> is 10px, and so on.
                Since inline messages now appear below each field, the vertical gap between form fields becomes a deliberate design decision, not just a layout preference.
              </p>
              <p>
                At very tight spacing values, an error message sits so close to the next field's label that it can read as if it belongs to the field below rather than the one above. Customers can configure this spacing themselves, so the goal was to recommend a sensible default minimum. The team evaluated the Funds Transfer form, the same form used in the usability study, with all errors triggered simultaneously across six spacing values to land on that recommendation.
              </p>
              <p>
                The recommendation: use a minimum of{' '}
                <span className="font-semibold" style={{ color: TEXT }}>--app-scale-3x (15px)</span> between form fields. Below that threshold, the error message for one field can start to read as the label for the field below it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-3">
              <div>
                <div className="rounded-2xl overflow-hidden border mb-3" style={{ borderColor: RULE }}>
                  <img src="/images/validation/implementation/spacing-1x.png" alt="Funds Transfer form at --app-scale-1x (5px) spacing with all errors triggered" className="w-full h-auto" loading="lazy" />
                </div>
                <div className="flex items-start gap-3 px-1">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#E8A0B0' }}>
                    <span className="text-white text-[10px] font-bold">✕</span>
                  </div>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    <span className="font-semibold" style={{ color: TEXT }}>--app-scale-1x (5px): </span>
                    At this spacing the error can read as if it belongs to the field below it, blurring the association between an error and its field.
                  </p>
                </div>
              </div>
              <div>
                <div className="rounded-2xl overflow-hidden border mb-3" style={{ borderColor: RULE }}>
                  <img src="/images/validation/implementation/spacing-3x.png" alt="Funds Transfer form at --app-scale-3x (15px) spacing with all errors triggered" className="w-full h-auto" loading="lazy" />
                </div>
                <div className="flex items-start gap-3 px-1">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: '#4CAF82' }}>
                    <span className="text-white text-[10px] font-bold">✓</span>
                  </div>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    <span className="font-semibold" style={{ color: TEXT }}>--app-scale-3x (15px): </span>
                    Recommended minimum. Each error message is clearly associated with the field directly above it.
                  </p>
                </div>
              </div>
            </div>
            <p className="font-sans text-xs mb-16 leading-relaxed" style={{ color: DIMMER }}>
              Each frame shows the Funds Transfer form with all validation errors triggered simultaneously, the most demanding scenario for visual clarity.
            </p>

            <div className="mb-10">
              <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: DIMMER }}>Before</p>
              <div className="rounded-2xl overflow-hidden border" style={{ borderColor: RULE, maxHeight: '560px', overflowY: 'auto' }}>
                <img src="/images/validation/implementation/form-components-2.jpg" alt="Tecton form components before inline validation, error state shows red border and warning triangle with no contextual message" className="w-full h-auto" loading="lazy" />
              </div>
              <p className="font-sans text-xs mt-3 leading-relaxed" style={{ color: DIMMER }}>
                The before state: error communicated through a red border and warning triangle only. No message. No indication of what's wrong or how to fix it.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-16">
              <div>
                <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: DIMMER }}>After</p>
                <div className="rounded-2xl overflow-hidden border" style={{ borderColor: RULE, maxHeight: '560px', overflowY: 'auto' }}>
                  <img src="/images/validation/InlineErrors_after.webp" alt="All nine Tecton form components with inline validation errors, error message appears directly below each field" className="w-full h-auto" loading="lazy" />
                </div>
                <p className="font-sans text-xs mt-3 leading-relaxed" style={{ color: DIMMER }}>
                  All nine components in error state. Scroll to see the full set.
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-widest mb-5" style={{ color: DIMMER }}>One mechanism. Nine components.</p>
                <div className="space-y-4 font-sans text-base leading-relaxed" style={{ color: DIM }}>
                  <p>
                    A date picker, a drag-and-drop file uploader, a checkbox group, and a textarea have almost nothing in common structurally. What they share now is a single 16px reserved slot at the bottom of each, and the same inline error message dropping into it when validation fires.
                  </p>
                  <p>
                    That consistency is what a design system is for. The{' '}
                    <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>showAsInline=true</code>{' '}
                    prop works identically across all nine components because the mechanism doesn't change regardless of what's above it. No custom engineering per component. No inconsistent edge cases.
                  </p>
                  <p>
                    The UX shift is straightforward: before, nine red borders and nine triangles, each communicating <span className="italic">"something is wrong, figure out what."</span> Now, nine inline messages, each saying specifically <span className="italic">what.</span>
                  </p>
                </div>
              </div>
            </div>

            <p className="font-sans text-xs uppercase tracking-widest mb-4" style={{ color: DIMMER }}>Accessibility: already baked in</p>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-8" style={{ color: DIM }}>
              Because the implementation reuses the existing Q2 Message component, the core ARIA wiring ({' '}
              <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>aria-live</code>,{' '}
              <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>aria-invalid</code>, and{' '}
              <code className="font-mono text-sm px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>aria-describedby</code>{' '}
              ) is inherited by the new inline variant without writing any new accessibility code at the component level. An accessibility designer then worked directly with the developers to verify the screen reader experience behaved as expected. The patterns below describe what developers building forms with these components still need to implement correctly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

              <div className="rounded-2xl border p-6" style={{ borderColor: RULE, backgroundColor: CARD }}>
                <p className="font-sans text-sm font-semibold mb-3" style={{ color: TEXT }}>Global error announcement</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                  On submit, a single message announces the form failed validation via{' '}
                  <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>aria-live="assertive"</code>{' '}
                  or{' '}
                  <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>role="alert"</code>.
                  {' '}Something like: "There are 3 errors in this form. Please fix them and try again." Focus is typically moved to this message so it fires immediately.
                </p>
              </div>

              <div className="rounded-2xl border p-6" style={{ borderColor: RULE, backgroundColor: CARD }}>
                <p className="font-sans text-sm font-semibold mb-3" style={{ color: TEXT }}>Inline field-level errors</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                  Each invalid field carries{' '}
                  <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>aria-invalid="true"</code>{' '}
                  and references its error via{' '}
                  <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>aria-describedby</code>.
                  {' '}When focus lands, the reader announces label, invalid state, and message together, e.g., "Amount, invalid, error: Enter an amount greater than $0."
                </p>
              </div>

              <div className="rounded-2xl border p-6" style={{ borderColor: RULE, backgroundColor: CARD }}>
                <p className="font-sans text-sm font-semibold mb-3" style={{ color: TEXT }}>Avoid over-announcing</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                  Making every inline error a live region is a common mistake. Multiple simultaneous{' '}
                  <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>aria-live</code>{' '}
                  regions cause messages to be skipped, read out of order, or create cognitive overload. One global live region for the submit announcement; passive field-level errors via{' '}
                  <code className="font-mono text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: SURFACE, color: ACCENT }}>aria-describedby</code>{' '}
                  on focus.
                </p>
              </div>

              <div className="rounded-2xl border p-6" style={{ borderColor: RULE, backgroundColor: CARD }}>
                <p className="font-sans text-sm font-semibold mb-3" style={{ color: TEXT }}>Recommended pattern</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                  Both mechanisms together: a top-level summary that announces errors exist and optionally links to each invalid field, plus inline errors tied directly to each input providing specific, actionable guidance. The combination gives users quick awareness of failure and efficient navigation to fix it.
                </p>
              </div>

              <div className="rounded-2xl border p-6 md:col-span-2 xl:col-span-2" style={{ borderColor: RULE, backgroundColor: CARD }}>
                <p className="font-sans text-sm font-semibold mb-3" style={{ color: TEXT }}>Interaction flow</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                  On submit: global message fires ("There are 4 errors in this form"), focus moves to it. As the user navigates: each invalid field announces its label, error message, and invalid state in sequence. No overwhelming flood of announcements, just contextual information exactly where it's needed. This balances clarity and usability without overloading the screen reader experience.
                </p>
              </div>

            </div>
          </motion.section>

          {/* ── 10 Reflection ──────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>10: What I'd do differently</SectionLabel>
            <Rule />
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-6" style={{ color: TEXT }}>
              Being right wasn't enough on its own
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-4 font-sans text-base leading-relaxed" style={{ color: DIM }}>
                <p>
                  The hardest part wasn't the research. It was being right and knowing the timing wasn't there. The evidence was solid, the recommendation was clear, and the correct move was still to file it and move on. That required a kind of patience that's uncomfortable when you're confident in the work. But pushing a platform-wide pattern change without active sponsorship, in an organization I was still relatively new to, would have been the wrong move regardless of how strong the case was.
                </p>
                <p>
                  What surprised me most was the history of it. Q2 had used inline validation before, someone had removed it, and nobody knew why. It wasn't that people were against the pattern, it had just drifted away. The research didn't have to win an argument, it had to wait for the right moment.
                </p>
              </div>
              <div className="space-y-4 font-sans text-base leading-relaxed" style={{ color: DIM }}>
                <p>
                  The gap between the 2024 recommendation and the 2026 implementation clarified something about the relationship between research quality and organizational readiness. The study was well-designed, the findings were directionally clear, the recommendation was sound, and none of that was sufficient on its own. What moved it forward wasn't new evidence, it was the same evidence under different conditions. Building developer relationships and a track record earlier would have closed that gap sooner, since the change needed more than good research.
                </p>
                <p>
                  If I were to run the study again, I'd push to instrument the post-launch state from day one: error rates by field, form abandonment after failed submission, support ticket volume. Q2 had no instrumentation on form abandonment after failed submission at the time of the study. I've flagged this as a follow-up measurement to establish the pre/post baseline, pairing the usability case with a business case that makes it easier for engineering to prioritize.
                </p>
              </div>
            </div>
          </motion.section>

          {/* ── Next Project ───────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <Link to="/interstitial" className="group inline-block mt-4">
              <p className="font-sans text-sm mb-2" style={{ color: DIMMER }}>Next project</p>
              <h3
                className="font-display font-black leading-[0.9] transition-opacity duration-300 group-hover:opacity-40"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', color: TEXT }}
              >
                Interstitial
              </h3>
            </Link>
          </motion.section>

        </div>
      </article>
      </div>
    </main>
  )
}
