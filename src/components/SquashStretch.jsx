import { useRef, useState } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'

/*
  SquashStretch — an interactive demo of the first principle of animation.
  A ball bounces on a continuous loop; it squashes the instant it hits the
  ground and stretches when it's moving fast through the air. Two sliders
  control each deformation independently so you can *feel* how exaggeration
  reads as weight and life.

  The bounce is driven by a per-frame loop (not a keyframe tween) so dragging
  a slider updates the motion live, without ever restarting the bounce.
*/

const INK = '#1C2322'
const BLUE = '#2B59C3'

const PRESETS = [
  { label: 'none', sq: 0, st: 0 },
  { label: 'subtle', sq: 30, st: 35 },
  { label: 'lively', sq: 55, st: 65 },
  { label: 'cartoon', sq: 92, st: 85 },
]

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export default function SquashStretch() {
  const [squash, setSquash] = useState(55)
  const [stretch, setStretch] = useState(65)

  // refs mirror state so the animation loop always reads the latest values
  const sq = useRef(squash); sq.current = squash
  const st = useRef(stretch); st.current = stretch

  const BALL = 90     // ball diameter in px
  const RISE = 184    // bounce height in px
  const FLOOR = 28    // ground-line offset from the stage floor
  const PERIOD = 1300 // ms per bounce

  // deformation limits (how far the ball may squash / stretch)
  const SX_SQUASH = 0.8,  SY_SQUASH = 0.55
  const SX_STRETCH = 0.42, SY_STRETCH = 0.62
  const STAGE_H = FLOOR + RISE + BALL + 28

  const y = useMotionValue(0)
  const scaleX = useMotionValue(1)
  const scaleY = useMotionValue(1)
  const shScale = useMotionValue(0.6)
  const shOpacity = useMotionValue(0.15)

  useAnimationFrame((time) => {
    const t = (time % PERIOD) / PERIOD             // 0..1 over one bounce
    const a = 2 * Math.min(t, 1 - t)               // 0 at apex, 1 at the floor
    const heightFrac = 1 - a * a                   // 1 apex, 0 floor (parabolic fall)
    const contact = clamp((a - 0.88) / 0.12, 0, 1) // squash: only the last sliver at the floor

    // The ball stretches more the closer it gets to the floor (where it moves
    // fastest), reaching its tallest just before impact — then snaps into the
    // squash. Round at the apex, no breathing in the middle.
    const fall = Math.pow(a, 1.25)
    const stretch = fall * (1 - contact)

    const sqA = sq.current / 100
    const stA = st.current / 100

    y.set(-RISE * heightFrac)
    scaleX.set(1 + sqA * SX_SQUASH * contact - stA * SX_STRETCH * stretch)
    scaleY.set(1 - sqA * SY_SQUASH * contact + stA * SY_STRETCH * stretch)
    shScale.set(0.45 + a * 0.7)
    shOpacity.set(0.08 + a * 0.26)
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
      {/* Stage */}
      <div className="mx-auto w-full max-w-[320px]">
        <div className="relative" style={{ height: STAGE_H }}>
          {/* ground line */}
          <div className="absolute left-0 right-0" style={{ bottom: FLOOR, height: 2, background: 'rgba(28,35,34,0.14)' }} />
          {/* contact shadow */}
          <motion.div
            className="absolute left-1/2"
            style={{ bottom: FLOOR - 7, width: BALL * 0.92, height: 14, x: '-50%', borderRadius: '50%', background: INK, scaleX: shScale, opacity: shOpacity }}
          />
          {/* ball */}
          <motion.div
            className="absolute left-1/2"
            style={{ width: BALL, height: BALL, bottom: FLOOR, x: '-50%', y, scaleX, scaleY, transformOrigin: 'bottom center' }}
          >
            <div
              style={{
                width: '100%', height: '100%', borderRadius: '50%',
                background: `radial-gradient(circle at 34% 28%, #7d99ff 0%, ${BLUE} 55%, #1f3f96 100%)`,
                boxShadow: 'inset -6px -8px 16px rgba(0,0,0,0.18)',
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div>
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-ink/50 mb-3">Drag the sliders</p>
        <p className="font-mono text-sm md:text-base text-ink mb-8">
          squash {squash}%&nbsp;&nbsp;·&nbsp;&nbsp;stretch {stretch}%
        </p>

        <div className="space-y-7 mb-9">
          <Slider label="Squash" hint="on impact" value={squash} onChange={setSquash} />
          <Slider label="Stretch" hint="through speed" value={stretch} onChange={setStretch} />
        </div>

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { setSquash(p.sq); setStretch(p.st) }}
              className="font-sans text-xs px-3.5 py-2 rounded-full border transition-colors duration-200 hover:bg-[rgba(28,35,34,0.04)]"
              style={{ borderColor: 'rgba(28,35,34,0.2)', color: INK }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Slider({ label, hint, value, onChange }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2.5">
        <span className="font-sans text-sm text-ink">
          {label} <span className="text-ink/40">— {hint}</span>
        </span>
        <span className="font-mono text-xs text-ink/50">{value}%</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        className="w-full cursor-pointer"
        style={{ accentColor: BLUE }}
      />
    </div>
  )
}
