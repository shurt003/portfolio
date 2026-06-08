import { motion } from 'framer-motion'

/*
  Grid-to-Layout Reveal
  ─────────────────────
  Communicates UX design by showing the invisible scaffolding beneath good
  layout: an 8pt dot grid + column guides, with UI skeleton elements snapping
  into place onto the grid. Ambient motion: a glowing scanner line sweeps the
  canvas, and a cursor travels in to "click" the primary button (ripple).

  viewBox 800 x 600  (4:3 — matches the hero container aspect ratio)
*/

const EASE = [0.22, 1, 0.36, 1]
const LOOP = 5 // seconds, shared by cursor + button + ripple

// Column geometry (4 columns, 20px gutters, 80px side margins)
const COL_W = 145
const COLS = [80, 245, 410, 575]

// Accent palette (self-contained "design canvas")
const SKY = '#38BDF8'
const BLUE = '#3B82F6'
const SLATE = '#475569'
const MUTE = '#94A3B8'

/* Reusable enter transition for the skeleton blocks */
function blockEnter(delay) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  }
}

export default function HeroGridReveal() {
  return (
    <svg
      viewBox="0 0 800 600"
      width="100%"
      height="100%"
      style={{ background: '#0F172A', display: 'block' }}
      role="img"
      aria-label="Animated illustration of a UI layout snapping onto a design grid"
    >
      <defs>
        <pattern id="hgr-dots" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1" fill="#334155" opacity="0.65" />
        </pattern>
        <linearGradient id="hgr-scan" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={SKY} stopOpacity="0" />
          <stop offset="50%" stopColor={SKY} stopOpacity="0.55" />
          <stop offset="100%" stopColor={SKY} stopOpacity="0" />
        </linearGradient>
        <filter id="hgr-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* ── Dot grid ─────────────────────────────────────────────── */}
      <motion.rect
        width="800"
        height="600"
        fill="url(#hgr-dots)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      />

      {/* ── Column guides ────────────────────────────────────────── */}
      {COLS.map((x, i) => (
        <motion.g key={x}>
          <motion.rect
            x={x}
            y={50}
            width={COL_W}
            height={500}
            fill={BLUE}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.07 }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.08 }}
          />
          <motion.line
            x1={x}
            y1={50}
            x2={x}
            y2={550}
            stroke={BLUE}
            strokeWidth="1"
            strokeOpacity="0.3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.15 + i * 0.08 }}
          />
        </motion.g>
      ))}

      {/* ── Nav bar ──────────────────────────────────────────────── */}
      <motion.g {...blockEnter(0.4)}>
        <rect x="80" y="64" width="640" height="34" rx="6" fill="rgba(56,189,248,0.07)" stroke={SKY} strokeOpacity="0.5" strokeWidth="1" />
        <rect x="92" y="72" width="18" height="18" rx="4" fill={SKY} fillOpacity="0.8" />
        <rect x="560" y="77" width="42" height="6" rx="3" fill={SLATE} />
        <rect x="612" y="77" width="42" height="6" rx="3" fill={SLATE} />
        <rect x="664" y="77" width="44" height="6" rx="3" fill={SLATE} />
      </motion.g>

      {/* ── Heading bars (span col 0–2) ──────────────────────────── */}
      <motion.rect {...blockEnter(0.55)} x="80" y="150" width="470" height="30" rx="6" fill="rgba(148,163,184,0.18)" />
      <motion.rect {...blockEnter(0.65)} x="80" y="190" width="370" height="30" rx="6" fill="rgba(148,163,184,0.18)" />

      {/* ── Body text lines ──────────────────────────────────────── */}
      <motion.rect {...blockEnter(0.8)}  x="80" y="248" width="300" height="9" rx="4" fill={SLATE} />
      <motion.rect {...blockEnter(0.88)} x="80" y="268" width="280" height="9" rx="4" fill={SLATE} />
      <motion.rect {...blockEnter(0.96)} x="80" y="288" width="210" height="9" rx="4" fill={SLATE} />

      {/* ── Primary button (col 0) ───────────────────────────────── */}
      <motion.g
        {...blockEnter(1.1)}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      >
        <motion.rect
          x="80"
          y="332"
          width="150"
          height="46"
          rx="23"
          fill={BLUE}
          animate={{ scale: [1, 1, 0.93, 1, 1] }}
          transition={{ duration: LOOP, times: [0, 0.36, 0.43, 0.5, 1], repeat: Infinity, repeatDelay: 0.3, ease: 'easeInOut' }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <rect x="108" y="351" width="94" height="8" rx="4" fill="#fff" fillOpacity="0.85" />
      </motion.g>

      {/* ── Click ripple on the button ───────────────────────────── */}
      <motion.circle
        cx="155"
        cy="355"
        fill="none"
        stroke={SKY}
        strokeWidth="2"
        initial={{ r: 8, opacity: 0 }}
        animate={{ r: [8, 8, 70], opacity: [0, 0, 0.5, 0] }}
        transition={{ duration: LOOP, times: [0, 0.4, 0.55, 0.72], repeat: Infinity, repeatDelay: 0.3, ease: 'easeOut' }}
      />

      {/* ── Side card (col 3) ────────────────────────────────────── */}
      <motion.g {...blockEnter(0.7)}>
        <rect x="575" y="150" width="145" height="228" rx="10" fill="rgba(56,189,248,0.06)" stroke={SKY} strokeOpacity="0.45" strokeWidth="1" />
        <rect x="595" y="170" width="105" height="92" rx="6" fill="rgba(59,130,246,0.18)" stroke={BLUE} strokeOpacity="0.4" strokeWidth="1" />
        <line x1="595" y1="170" x2="700" y2="262" stroke={BLUE} strokeOpacity="0.35" strokeWidth="1" />
        <line x1="700" y1="170" x2="595" y2="262" stroke={BLUE} strokeOpacity="0.35" strokeWidth="1" />
        <rect x="595" y="280" width="105" height="9" rx="4" fill={SLATE} />
        <rect x="595" y="298" width="78" height="9" rx="4" fill={SLATE} />
      </motion.g>

      {/* ── Footer row ───────────────────────────────────────────── */}
      <motion.g {...blockEnter(1.0)}>
        <rect x="80" y="470" width="640" height="48" rx="8" fill="rgba(148,163,184,0.07)" stroke={SLATE} strokeOpacity="0.4" strokeWidth="1" />
        <rect x="100" y="489" width="120" height="9" rx="4" fill={SLATE} />
        <rect x="560" y="489" width="48" height="9" rx="4" fill={SLATE} />
        <rect x="620" y="489" width="48" height="9" rx="4" fill={SLATE} />
      </motion.g>

      {/* ── Measurement: vertical spacing (heading → body) ───────── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0.5, 0.9] }}
        transition={{ opacity: { duration: 3, delay: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } }}
        stroke={MUTE}
        strokeWidth="1"
      >
        <line x1="60" y1="222" x2="60" y2="246" />
        <line x1="55" y1="222" x2="65" y2="222" />
        <line x1="55" y1="246" x2="65" y2="246" />
        <text x="40" y="238" fill={MUTE} stroke="none" fontSize="11" fontFamily="ui-monospace, monospace">24</text>
      </motion.g>

      {/* ── Measurement: horizontal gutter ───────────────────────── */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0.5, 0.9] }}
        transition={{ opacity: { duration: 3, delay: 1.7, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' } }}
        stroke={MUTE}
        strokeWidth="1"
      >
        <line x1="225" y1="540" x2="245" y2="540" />
        <line x1="225" y1="535" x2="225" y2="545" />
        <line x1="245" y1="535" x2="245" y2="545" />
        <text x="226" y="562" fill={MUTE} stroke="none" fontSize="11" fontFamily="ui-monospace, monospace">20</text>
      </motion.g>

      {/* ── Ambient scanner sweep ────────────────────────────────── */}
      <motion.g
        animate={{ y: [0, 480], opacity: [0, 1, 1, 0] }}
        transition={{
          y: { duration: 3.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 },
          opacity: { duration: 3.6, times: [0, 0.12, 0.88, 1], repeat: Infinity, repeatDelay: 0.6, ease: 'linear' },
        }}
      >
        <rect x="70" y="44" width="660" height="34" fill="url(#hgr-scan)" />
        <line x1="70" y1="60" x2="730" y2="60" stroke={SKY} strokeWidth="1.5" filter="url(#hgr-glow)" />
        <line x1="70" y1="60" x2="730" y2="60" stroke={SKY} strokeWidth="1" />
      </motion.g>

      {/* ── Cursor (travels in, clicks the button) ───────────────── */}
      <motion.g
        animate={{
          x: [560, 155, 155, 470, 560],
          y: [110, 355, 355, 470, 110],
        }}
        transition={{
          duration: LOOP,
          times: [0, 0.38, 0.5, 0.78, 1],
          repeat: Infinity,
          repeatDelay: 0.3,
          ease: 'easeInOut',
        }}
      >
        <path
          d="M0 0 L0 22 L6 16 L10 25 L13 24 L9 15 L16 15 Z"
          fill="#fff"
          stroke="#0F172A"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </motion.g>
    </svg>
  )
}
