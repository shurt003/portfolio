import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

/*
  OrchestrationHUD — a screen-space command-interface overlay for the
  orchestration particle page. Pure SVG + DOM, pointer-events-none, sitting
  above the WebGL canvas. The reticle is positioned on the globe's projected
  screen center (passed in from the page) so it stays locked to the sphere.
*/

const CREAM = 'rgba(245,240,232,'
const BLUE = '#8AA6FF'
const AMBER = '#F5A623'

/* ── live-value hooks ──────────────────────────────────────────────────── */
function useCountUp(target, duration = 1600, run = true) {
  const [v, setV] = useState(run ? 0 : target)
  useEffect(() => {
    if (!run) { setV(target); return }
    let raf, start
    const tick = (t) => {
      if (!start) start = t
      const p = Math.min((t - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setV(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, run])
  return v
}

function useFlicker(base, spread, interval = 900, run = true) {
  const [v, setV] = useState(base)
  useEffect(() => {
    if (!run) return
    const id = setInterval(() => setV(base + Math.round((Math.random() - 0.5) * 2 * spread)), interval)
    return () => clearInterval(id)
  }, [base, spread, interval, run])
  return v
}

function useCoordTicker(run = true) {
  const [s, setS] = useState('34.21°N  118.24°W')
  useEffect(() => {
    if (!run) return
    const id = setInterval(() => {
      const lat = (20 + Math.random() * 40).toFixed(2)
      const lon = (80 + Math.random() * 90).toFixed(2)
      setS(`${lat}°N  ${lon}°W`)
    }, 1400)
    return () => clearInterval(id)
  }, [run])
  return s
}

/* ── corner bracket (drawn in on mount) ────────────────────────────────── */
function Corner({ style, rotate }) {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" className="absolute" style={style}>
      <motion.path
        d="M2 16 V2 H16"
        fill="none"
        stroke={`${CREAM}0.5)`}
        strokeWidth="1.5"
        transform={`rotate(${rotate} 23 23)`}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

/* ── data cell for the bottom command bar ──────────────────────────────── */
function Cell({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: `${CREAM}0.35)` }}>{label}</span>
      <span className="font-mono text-[12px] tracking-[0.1em]" style={{ color: `${CREAM}0.85)` }}>{children}</span>
    </div>
  )
}

export default function OrchestrationHUD({ center, radius, reduce = false, compact = false }) {
  const nodes = useCountUp(5200, 1700, !reduce)
  const latency = useFlicker(13, 4, 850, !reduce)
  const coord = useCoordTicker(!reduce)
  const [uplink, setUplink] = useState(4)
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setUplink(3 + Math.round(Math.random() * 2)), 1200)
    return () => clearInterval(id)
  }, [reduce])

  if (!center || !radius) return null

  const frameR = radius * 1.2          // square targeting frame half-size
  const dashR = radius * 1.12          // rotating dashed ring
  const tickR = radius * 1.04          // tick ring
  const S = frameR + 24                // svg half-size (room for ticks)
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5) // every 5°

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">

      {/* viewport corner brackets */}
      <Corner rotate={0} style={{ top: 88, left: 24 }} />
      <Corner rotate={90} style={{ top: 88, right: 24 }} />
      <Corner rotate={270} style={{ bottom: 76, left: 24 }} />
      <Corner rotate={180} style={{ bottom: 76, right: 24 }} />

      {/* ── reticle, locked to the globe ──────────────────────────────── */}
      <div
        className="absolute"
        style={{ left: center.x, top: center.y, width: S * 2, height: S * 2, transform: 'translate(-50%, -50%)' }}
      >
        <svg width={S * 2} height={S * 2} viewBox={`${-S} ${-S} ${S * 2} ${S * 2}`}>
          {/* tick ring */}
          {ticks.map((deg) => {
            const cardinal = deg % 90 === 0
            const a = (deg * Math.PI) / 180
            const r1 = tickR
            const r2 = tickR + (cardinal ? 12 : 6)
            return (
              <line
                key={deg}
                x1={Math.cos(a) * r1} y1={Math.sin(a) * r1}
                x2={Math.cos(a) * r2} y2={Math.sin(a) * r2}
                stroke={`${CREAM}${cardinal ? '0.45)' : '0.2)'}`}
                strokeWidth={cardinal ? 1.5 : 1}
              />
            )
          })}

          {/* faint inner ring */}
          <circle cx="0" cy="0" r={tickR} fill="none" stroke={`${CREAM}0.12)`} strokeWidth="1" />

          {/* rotating dashed ring */}
          <motion.g
            animate={reduce ? {} : { rotate: 360 }}
            transition={{ duration: 48, ease: 'linear', repeat: Infinity }}
            style={{ transformOrigin: 'center' }}
          >
            <circle cx="0" cy="0" r={dashR} fill="none" stroke={BLUE} strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="2 10" />
          </motion.g>

          {/* counter-rotating accent arc */}
          <motion.g
            animate={reduce ? {} : { rotate: -360 }}
            transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
            style={{ transformOrigin: 'center' }}
          >
            <circle
              cx="0" cy="0" r={dashR + 8} fill="none" stroke={AMBER} strokeWidth="2" strokeOpacity="0.55"
              strokeDasharray={`${dashR * 0.5} ${dashR * 4}`} strokeLinecap="round"
            />
          </motion.g>

          {/* square target corners */}
          {[[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sy], i) => (
            <path
              key={i}
              d={`M ${sx * frameR} ${sy * (frameR - 18)} L ${sx * frameR} ${sy * frameR} L ${sx * (frameR - 18)} ${sy * frameR}`}
              fill="none" stroke={`${CREAM}0.6)`} strokeWidth="1.5"
            />
          ))}
        </svg>
      </div>

      {/* ── callouts with leader lines (hidden on mobile) ─────────────── */}
      {!compact && (<>
      {/* upper-right asset callout */}
      <div className="absolute" style={{ left: center.x + frameR * 0.72, top: center.y - frameR * 0.82 }}>
        <svg width="120" height="60" viewBox="0 0 120 60" className="absolute" style={{ left: -8, top: 8 }}>
          <line x1="0" y1="52" x2="40" y2="8" stroke={`${AMBER}`} strokeOpacity="0.6" strokeWidth="1" />
          <circle cx="0" cy="52" r="2" fill={AMBER} />
        </svg>
        <div className="absolute" style={{ left: 36, top: 0, whiteSpace: 'nowrap' }}>
          <div className="font-mono text-[11px] tracking-[0.12em]" style={{ color: `${CREAM}0.9)` }}>ASSET.ALPHA</div>
          <div className="font-mono text-[10px] tracking-[0.18em]" style={{ color: AMBER }}>▸ TRACKING</div>
        </div>
      </div>

      {/* lower-left route callout */}
      <div className="absolute" style={{ left: center.x - frameR * 1.05, top: center.y + frameR * 0.78 }}>
        <svg width="120" height="60" viewBox="0 0 120 60" className="absolute" style={{ left: 40, top: -16 }}>
          <line x1="80" y1="8" x2="40" y2="44" stroke={BLUE} strokeOpacity="0.6" strokeWidth="1" />
          <circle cx="80" cy="8" r="2" fill={BLUE} />
        </svg>
        <div className="absolute" style={{ right: 90, top: 16, whiteSpace: 'nowrap', textAlign: 'right' }}>
          <div className="font-mono text-[11px] tracking-[0.12em]" style={{ color: `${CREAM}0.9)` }}>ROUTE.SYNC</div>
          <div className="font-mono text-[10px] tracking-[0.18em]" style={{ color: BLUE }}>NOMINAL ◂</div>
        </div>
      </div>
      </>)}

      {/* ── bottom command bar ────────────────────────────────────────── */}
      <div
        className="absolute left-6 right-6 md:left-14 lg:left-20 md:right-14 lg:right-20"
        style={{ bottom: 40, borderTop: `1px solid ${CREAM}0.12)`, paddingTop: 16 }}
      >
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="flex items-end gap-8 md:gap-12 flex-wrap">
            <Cell label="System">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: AMBER, boxShadow: `0 0 8px ${AMBER}` }} />
                NOMINAL
              </span>
            </Cell>
            <Cell label="Nodes">{nodes.toLocaleString()}</Cell>
            {!compact && <Cell label="Active routes">08</Cell>}
            {!compact && (
            <Cell label="Uplink">
              <span className="inline-flex items-end gap-[3px]" style={{ height: 12 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="inline-block w-[3px] rounded-[1px]"
                    style={{
                      height: 4 + i * 2,
                      backgroundColor: i < uplink ? BLUE : `${CREAM}0.2)`,
                      transition: 'background-color 0.3s',
                    }}
                  />
                ))}
              </span>
            </Cell>
            )}
            <Cell label="Latency">{latency}MS</Cell>
            {!compact && <Cell label="Grid ref">{coord}</Cell>}
          </div>
          {!compact && (
          <span className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: `${CREAM}0.4)` }}>
            Built by Stephen Hurt
          </span>
          )}
        </div>
      </div>
    </div>
  )
}
