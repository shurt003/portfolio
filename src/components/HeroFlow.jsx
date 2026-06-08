import { useMemo } from 'react'
import { motion } from 'framer-motion'

/*
  HeroFlow — abstract "currents of attention"
  ───────────────────────────────────────────
  Layered sine-wave streams flow endlessly across a dark canvas, a glowing
  comet rides the current, and soft nodes drift in the field. Abstractly
  evokes flow, motion, and guiding attention (a nod to a motion-design root)
  without depicting any literal UI.

  viewBox 800 x 600 (4:3 — matches the hero container)
*/

const VW = 800
const VH = 600

/* Build a smooth sine path sampled finely enough to read as a clean curve. */
function wavePath(width, amp, wavelength, yCenter, step = 6) {
  let d = ''
  for (let x = 0; x <= width; x += step) {
    const y = yCenter + amp * Math.sin((2 * Math.PI * x) / wavelength)
    d += x === 0 ? `M ${x} ${y.toFixed(2)}` : ` L ${x} ${y.toFixed(2)}`
  }
  return d
}

const WAVES = [
  { amp: 34,  wl: 300, yc: 262, w: 2,   op: 0.30, grad: 'hf-c', dur: 16, dir:  1 },
  { amp: 46,  wl: 360, yc: 286, w: 2,   op: 0.65, grad: 'hf-b', dur: 14, dir: -1 },
  { amp: 62,  wl: 430, yc: 300, w: 3,   op: 0.95, grad: 'hf-a', dur: 20, dir:  1, glow: true },
  { amp: 84,  wl: 540, yc: 322, w: 2,   op: 0.45, grad: 'hf-b', dur: 26, dir:  1 },
  { amp: 108, wl: 660, yc: 346, w: 1.5, op: 0.26, grad: 'hf-c', dur: 32, dir: -1 },
]

/* Drifting field nodes */
const NODES = [
  { x: 160, y: 200, r: 4,   dx: 18,  dy: 22,  dur: 9,  delay: 0 },
  { x: 600, y: 430, r: 5,   dx: -24, dy: 16,  dur: 11, delay: 1.2 },
  { x: 680, y: 180, r: 3,   dx: 14,  dy: -20, dur: 8,  delay: 0.6 },
  { x: 120, y: 420, r: 3.5, dx: 20,  dy: -14, dur: 12, delay: 2 },
]

export default function HeroFlow() {
  const paths = useMemo(
    () => WAVES.map(w => ({ ...w, d: wavePath(VW + w.wl, w.amp, w.wl, w.yc) })),
    []
  )

  // Comet keyframes — rides loosely along the central current
  const cometX = [40, 150, 250, 360, 470, 580, 690, 770]
  const cometY = [300, 256, 322, 248, 330, 268, 318, 292]

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      width="100%"
      height="100%"
      style={{ display: 'block', background: 'radial-gradient(120% 120% at 50% 40%, #131F38 0%, #0F172A 60%, #0A0F1E 100%)' }}
      role="img"
      aria-label="Abstract flowing streams representing the flow of attention in design"
    >
      <defs>
        <linearGradient id="hf-a" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"  stopColor="#2B59C3" />
          <stop offset="55%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
        <linearGradient id="hf-b" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"  stopColor="#6366F1" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id="hf-c" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"  stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#2B59C3" />
        </linearGradient>
        <filter id="hf-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <radialGradient id="hf-comet" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#E0F2FE" stopOpacity="1" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ── Flowing wave streams ─────────────────────────────────── */}
      {paths.map((w, i) => (
        <motion.g
          key={i}
          animate={{ x: w.dir > 0 ? [0, -w.wl] : [-w.wl, 0] }}
          transition={{ duration: w.dur, repeat: Infinity, ease: 'linear' }}
        >
          {w.glow && (
            <path
              d={w.d}
              fill="none"
              stroke={`url(#${w.grad})`}
              strokeWidth={w.w + 5}
              strokeOpacity={0.4}
              strokeLinecap="round"
              filter="url(#hf-glow)"
            />
          )}
          <path
            d={w.d}
            fill="none"
            stroke={`url(#${w.grad})`}
            strokeWidth={w.w}
            strokeOpacity={w.op}
            strokeLinecap="round"
          />
        </motion.g>
      ))}

      {/* ── Drifting field nodes ─────────────────────────────────── */}
      {NODES.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={n.r}
          fill="#7DD3FC"
          animate={{
            x: [0, n.dx, 0, -n.dx * 0.6, 0],
            y: [0, n.dy, n.dy * 0.3, -n.dy * 0.5, 0],
            opacity: [0.25, 0.7, 0.4, 0.65, 0.25],
          }}
          transition={{ duration: n.dur, delay: n.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* ── Comet riding the current ─────────────────────────────── */}
      <motion.g
        animate={{ x: cometX, y: cometY }}
        transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle r="22" fill="url(#hf-comet)" opacity="0.6" />
        <circle r="4.5" fill="#F0F9FF" />
      </motion.g>
    </svg>
  )
}
