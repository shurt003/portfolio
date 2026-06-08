import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

/*
  EasingPlayground — a draggable cubic-bézier curve editor with a live demo.
  Drag the two handles to reshape the easing; two dots race across the track
  (one linear reference, one eased) so you can *feel* the curve. A motion-design
  nod that demonstrates an understanding of timing and easing.
*/

const BOX = 240 // curve area is BOX×BOX; value 1 at top (y=0), value 0 at bottom (y=BOX)
const INK = '#1C2322'
const BLUE = '#2B59C3'

const PRESETS = [
  { label: 'ease-out',    p1: [0, 0, 0.2, 1] },
  { label: 'ease-in-out', p1: [0.65, 0, 0.35, 1] },
  { label: 'overshoot',   p1: [0.34, 1.56, 0.64, 1] },
  { label: 'anticipate',  p1: [0.6, -0.4, 0.4, 1] },
]

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

export default function EasingPlayground() {
  // control points in curve space: x ∈ [0,1], y can go outside [0,1] for
  // overshoot (>1) or anticipate (<0). Defaults to the 'anticipate' preset.
  const [p1, setP1] = useState({ x: 0.6, y: -0.4 })
  const [p2, setP2] = useState({ x: 0.4, y: 1 })
  const [cycle, setCycle] = useState(0) // re-trigger the demo on preset/drag-end
  const svgRef = useRef(null)
  const dragging = useRef(null)

  const toCurve = (e) => {
    const svg = svgRef.current
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const loc = pt.matrixTransform(svg.getScreenCTM().inverse())
    return { x: clamp(loc.x / BOX, 0, 1), y: clamp(1 - loc.y / BOX, -0.5, 1.5) }
  }

  const onPointerDown = (which) => (e) => {
    e.preventDefault()
    dragging.current = which
    const move = (ev) => {
      const c = toCurve(ev)
      ;(which === 1 ? setP1 : setP2)(c)
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      dragging.current = null
      setCycle((n) => n + 1)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const sx = (v) => v * BOX
  const sy = (v) => (1 - v) * BOX
  const ease = [clamp(p1.x, 0, 1), p1.y, clamp(p2.x, 0, 1), p2.y]
  const bezierStr = `cubic-bezier(${ease.map((n) => Math.round(n * 100) / 100).join(', ')})`

  const demoTransition = {
    duration: 1.5,
    ease,
    repeat: Infinity,
    repeatType: 'loop',
    repeatDelay: 0.5,
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
      {/* Curve editor */}
      <div className="mx-auto w-full max-w-[300px]">
        <svg
          ref={svgRef}
          viewBox={`-20 -70 ${BOX + 40} ${BOX + 140}`}
          className="w-full select-none touch-none"
          style={{ overflow: 'visible' }}
        >
          {/* frame + grid */}
          <rect x="0" y="0" width={BOX} height={BOX} rx="10" fill="rgba(28,35,34,0.03)" stroke="rgba(28,35,34,0.12)" />
          {[0.25, 0.5, 0.75].map((g) => (
            <g key={g} stroke="rgba(28,35,34,0.06)">
              <line x1={sx(g)} y1="0" x2={sx(g)} y2={BOX} />
              <line x1="0" y1={sy(g)} x2={BOX} y2={sy(g)} />
            </g>
          ))}
          {/* handle leads */}
          <line x1="0" y1={BOX} x2={sx(p1.x)} y2={sy(p1.y)} stroke={BLUE} strokeOpacity="0.4" strokeWidth="1.5" />
          <line x1={BOX} y1="0" x2={sx(p2.x)} y2={sy(p2.y)} stroke={BLUE} strokeOpacity="0.4" strokeWidth="1.5" />
          {/* the curve */}
          <path
            d={`M 0 ${BOX} C ${sx(p1.x)} ${sy(p1.y)}, ${sx(p2.x)} ${sy(p2.y)}, ${BOX} 0`}
            fill="none"
            stroke={INK}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* anchors */}
          <circle cx="0" cy={BOX} r="4" fill={INK} />
          <circle cx={BOX} cy="0" r="4" fill={INK} />
          {/* draggable handles */}
          {[{ p: p1, which: 1 }, { p: p2, which: 2 }].map(({ p, which }) => (
            <circle
              key={which}
              cx={sx(p.x)}
              cy={sy(p.y)}
              r="9"
              fill={BLUE}
              stroke="#fff"
              strokeWidth="2"
              style={{ cursor: 'grab' }}
              onPointerDown={onPointerDown(which)}
            />
          ))}
        </svg>
      </div>

      {/* Demo + controls */}
      <div>
        <p className="font-sans text-xs uppercase tracking-[0.25em] text-ink/50 mb-3">Drag the handles</p>
        <p className="font-mono text-sm md:text-base text-ink mb-8 break-all">{bezierStr}</p>

        {/* two racing dots */}
        <div className="space-y-5 mb-8">
          {[
            { label: 'Linear', easing: 'linear', color: 'rgba(28,35,34,0.35)' },
            { label: 'Eased', easing: ease, color: BLUE },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex justify-between mb-2">
                <span className="font-sans text-xs uppercase tracking-widest text-ink/40">{row.label}</span>
              </div>
              <div className="relative h-2 rounded-full" style={{ backgroundColor: 'rgba(28,35,34,0.08)' }}>
                <motion.div
                  key={`${row.label}-${cycle}`}
                  className="absolute top-1/2 w-5 h-5 rounded-full"
                  style={{ marginTop: -10, marginLeft: -10, backgroundColor: row.color }}
                  initial={{ left: '0%' }}
                  animate={{ left: '100%' }}
                  transition={{
                    duration: 1.5,
                    ease: row.easing,
                    repeat: Infinity,
                    repeatType: 'loop',
                    repeatDelay: 0.5,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* presets */}
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setP1({ x: preset.p1[0], y: preset.p1[1] })
                setP2({ x: preset.p1[2], y: preset.p1[3] })
                setCycle((n) => n + 1)
              }}
              className="font-sans text-xs px-3.5 py-2 rounded-full border transition-colors duration-200 hover:bg-[rgba(28,35,34,0.04)]"
              style={{ borderColor: 'rgba(28,35,34,0.2)', color: INK }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
