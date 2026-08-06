import { useEffect, useRef, useState, useMemo } from 'react'
import { useReducedMotion } from 'framer-motion'

/*
  MagicSignalPipeline — the SYS-01 schematic for the Magic Signal case study.
  One analysis cycle, animated: the options screener flags a ticker; it fans into
  two research passes plus the raw options data, which converge at GPT-4.1 and are
  delivered to the app feed. Below the flow, a per-cycle outcome states whether
  the user's notification criteria were met (push sent) or not (ignored).

  Engine notes:
  - framer-motion's imperative animate() is a silent no-op on SVG (v11), so the
    choreography runs on raw WAAPI (element.animate + commitStyles).
  - Packet dots travel via CSS offset-path along the SAME path strings the
    connectors are drawn with, so the dots are always exactly on the line.
  - Connectors run edge-to-edge (not center-to-center), so nothing rides under
    the node boxes and the merge region has no doubled strokes.
  Pauses fully when offscreen; respects prefers-reduced-motion.
*/

// ── Palette (matches the case study; saturated colour only at the outcome) ──────
const TEXT      = '#F2F2F0'
const DIM       = 'rgba(242,242,240,0.6)'      // node sublabels — AA on the node fill
const DIMMER    = 'rgba(242,242,240,0.52)'     // quiet chrome labels — AA on the dark surface
const ACCENT    = '#5B8DEA'                    // packet / entry — the site accent, not a semantic app colour
const NODE_FILL = 'rgba(13,17,24,0.94)'        // near the app surface #0B1119
const BORDER    = 'rgba(242,242,240,0.18)'
const BORDER_HI = 'rgba(242,242,240,0.55)'
const CONN      = 'rgba(242,242,240,0.16)'
const CONN_QUIET= 'rgba(242,242,240,0.07)'
// the one semantic colour in the diagram: mint marks a push actually firing
const MINT  = '#47E5BC'

// ── Timing (named — no magic numbers inline; ms because WAAPI) ──────────────────
const ENTRY_STAGGER  = 80     // between nodes on entry
const ENTRY_DUR      = 500    // node fade/rise
const CONN_DRAW      = 700    // connector draw-in
const LEG            = 650    // per connector leg
const NODE_PULSE     = 200    // arrival pulse
const EMIT_PULSE     = 250    // screener flags a ticker and emits the packets
const RESEARCH_DWELL = 340    // dwell at a Perplexity node
const SYNTH_DWELL    = 900    // "thinking" at GPT-4.1
const MERGE_POP      = 280    // three-into-one emphasis
const HANDOFF        = 260    // synth → deliver hop
const OUTCOME_POP    = 450    // outcome badge spring-with-overshoot
const OUTCOME_DELAY  = 300    // after delivery before the criteria outcome
const CYCLE_GAP      = 1500   // idle between cycles
const FADE_FAST      = 120    // packet fades
const EASE_INOUT = 'cubic-bezier(0.42, 0, 0.58, 1)'
const EASE_OUT   = 'cubic-bezier(0.22, 1, 0.36, 1)'
// WAAPI has no physical springs — this keyframe set emulates stiffness ~300 /
// damping ~30: one small overshoot, quick settle.
const SPRING_KF = (from = 0.6) => [
  { opacity: 0, transform: `scale(${from})` },
  { opacity: 1, transform: 'scale(1.06)', offset: 0.55 },
  { opacity: 1, transform: 'scale(0.985)', offset: 0.8 },
  { opacity: 1, transform: 'scale(1)' },
]

// ── One cycle = one ticker, one verdict, one confidence score. The push fires on
// the user's confidence threshold, not on direction: a low-confidence directional
// call (PLTR) is ignored just like a genuinely mixed one. ────────────────────────
const PUSH_THRESHOLD = 70
const CYCLES = [
  { ticker: 'NVDA', dir: 'bull',  conf: 84 },
  { ticker: 'TSLA', dir: 'bear',  conf: 76 },
  { ticker: 'COIN', dir: 'mixed', conf: 52 },
  { ticker: 'PLTR', dir: 'bull',  conf: 61 },
  { ticker: 'AMD',  dir: 'bear',  conf: 80 },
  { ticker: 'SOFI', dir: 'mixed', conf: 48 },
]

// ── Node titles / sublabels (real text, shared across layouts) ──────────────────
const NODESPEC = [
  { key: 'screen',  title: 'UNUSUAL WHALES', subs: ['custom screener · fires only on my criteria', 'p/c ratio + tuned thresholds'] },
  { key: 'laneA',   title: 'PERPLEXITY',     subs: ['live news'] },
  { key: 'laneB',   title: 'PERPLEXITY',     subs: ['company fundamentals'] },
  { key: 'synth',   title: 'GPT-4.1',         subs: ['synthesis of research + raw flow', 'markdown contract: verdict · 2 scores · sections'] },
  { key: 'deliver', title: 'DELIVER',        subs: ['TO APP FEED', 'every signal lands here'] },
]

// ── Per-layout geometry (box centers/sizes; edges derived below) ─────────────────
const GEO = {
  horizontal: {
    viewBox: '0 40 1150 360',
    geo: {
      screen:  { cx: 144,  cy: 190, w: 232, h: 74 },
      laneA:   { cx: 480,  cy: 80,  w: 170, h: 54 },
      laneB:   { cx: 480,  cy: 190, w: 190, h: 54 },
      synth:   { cx: 806,  cy: 190, w: 258, h: 88 },
      deliver: { cx: 1046, cy: 190, w: 176, h: 76 },
    },
    laneC:    { x: 480, y: 300 },
    flow: 'h',
    rawLabel: { x: 480, y: 326, anchor: 'middle' },
    outcome:  { x: 575, y: 380 },
  },
  vertical: {
    viewBox: '0 36 380 716',
    geo: {
      screen:  { cx: 190, cy: 96,  w: 272, h: 74 },
      laneA:   { cx: 92,  cy: 300, w: 152, h: 74 },
      laneB:   { cx: 250, cy: 300, w: 152, h: 74 },
      synth:   { cx: 190, cy: 520, w: 300, h: 88 },
      deliver: { cx: 190, cy: 650, w: 232, h: 76 },
    },
    laneC:    { x: 338, y: 300 },
    flow: 'v',
    rawLabel: { x: 348, y: 364, anchor: 'end' },
    outcome:  { x: 190, y: 736 },
  },
}

// ── Path builders ─────────────────────────────────────────────────────────────────
// Fan-out: leaves the source at an angle, arrives at the lane along the flow axis.
// Fan-in: leaves the lane along the flow axis, arrives at the merge at an angle.
// Angled arrivals mean the merging strokes never run collinear — no doubled lines.
const line = (a, b) => `M ${a.x} ${a.y} L ${b.x} ${b.y}`
function fanOut(a, b, flow) {
  const dx = b.x - a.x, dy = b.y - a.y
  return flow === 'h'
    ? `M ${a.x} ${a.y} C ${a.x + 0.35 * dx} ${a.y + 0.6 * dy}, ${a.x + 0.65 * dx} ${b.y}, ${b.x} ${b.y}`
    : `M ${a.x} ${a.y} C ${a.x + 0.6 * dx} ${a.y + 0.35 * dy}, ${b.x} ${a.y + 0.65 * dy}, ${b.x} ${b.y}`
}
function fanIn(a, b, flow) {
  const dx = b.x - a.x, dy = b.y - a.y
  return flow === 'h'
    ? `M ${a.x} ${a.y} C ${a.x + 0.35 * dx} ${a.y}, ${a.x + 0.65 * dx} ${a.y + 0.6 * dy}, ${b.x} ${b.y}`
    : `M ${a.x} ${a.y} C ${a.x} ${a.y + 0.35 * dy}, ${a.x + 0.6 * dx} ${a.y + 0.65 * dy}, ${b.x} ${b.y}`
}

// Edge points + the seven segments. Drawn connectors and dot motion paths are the
// SAME strings, so packets are on the line by construction.
function buildSegments(L) {
  const g = L.geo, f = L.flow
  const edge = (n, side) => f === 'h'
    ? { x: side === 'out' ? n.cx + n.w / 2 : n.cx - n.w / 2, y: n.cy }
    : { x: n.cx, y: side === 'out' ? n.cy + n.h / 2 : n.cy - n.h / 2 }
  const screenOut = edge(g.screen, 'out')
  const laneAIn = edge(g.laneA, 'in'),  laneAOut = edge(g.laneA, 'out')
  const laneBIn = edge(g.laneB, 'in'),  laneBOut = edge(g.laneB, 'out')
  const laneC = L.laneC
  const merge = edge(g.synth, 'in')
  const synthOut = edge(g.synth, 'out')
  const deliverIn = edge(g.deliver, 'in')
  return {
    merge,
    segs: {
      A1: fanOut(screenOut, laneAIn, f),
      B1: line(screenOut, laneBIn),
      C1: fanOut(screenOut, laneC, f),
      A2: fanIn(laneAOut, merge, f),
      B2: line(laneBOut, merge),
      C2: fanIn(laneC, merge, f),
      D:  line(synthOut, deliverIn),
    },
  }
}

const tf = (p) => `translate(${p.x}px, ${p.y}px)`

export default function MagicSignalPipeline() {
  const reduce = useReducedMotion()
  const rootRef = useRef(null)
  const [mode, setMode] = useState(
    typeof window !== 'undefined' && window.innerWidth < 900 ? 'vertical' : 'horizontal'
  )
  const [ticker, setTicker] = useState(CYCLES[0].ticker)
  const [met, setMet] = useState(true)

  const L = useMemo(() => GEO[mode], [mode])
  const nodes = useMemo(() => NODESPEC.map((s) => ({ ...s, ...L.geo[s.key] })), [L])
  const { merge, segs } = useMemo(() => buildSegments(L), [L])

  // responsive mode switch
  useEffect(() => {
    const onResize = () => setMode(window.innerWidth < 900 ? 'vertical' : 'horizontal')
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // ── the choreography (raw WAAPI + offset-path) ────────────────────────────────
  const enteredRef = useRef(false)
  useEffect(() => {
    if (reduce) return
    const root = rootRef.current
    if (!root) return

    let alive = false
    const running = new Set()
    const isAlive = () => alive
    const $  = (sel) => root.querySelector(sel)
    const $$ = (sel) => [...root.querySelectorAll(sel)]
    const wait = (ms) => new Promise((r) => setTimeout(r, ms))

    async function anim(el, keyframes, opts) {
      if (!el || !isAlive()) return
      const a = el.animate(keyframes, { easing: EASE_INOUT, fill: 'forwards', ...opts })
      running.add(a)
      try {
        await a.finished
        try { a.commitStyles() } catch { /* detached */ }
      } catch { /* cancelled */ }
      running.delete(a)
      a.cancel()
    }

    const setOpacity = (el, v) => { if (el) el.style.opacity = String(v) }

    // ride a connector: same path string the line is drawn with
    const travel = (el, d, dur, easing = EASE_INOUT) => {
      if (!el) return Promise.resolve()
      el.style.offsetPath = `path("${d}")`
      el.style.offsetRotate = '0deg'
      el.style.offsetDistance = '0%'
      return anim(el, [{ offsetDistance: '0%' }, { offsetDistance: '100%' }], { duration: dur, easing })
    }

    const pulse = (key) => anim($(`.ms-box-${key}`), [
      { transform: 'scale(1)',    stroke: BORDER },
      { transform: 'scale(1.04)', stroke: BORDER_HI },
      { transform: 'scale(1)',    stroke: BORDER },
    ], { duration: NODE_PULSE })

    const flash = (key) => Promise.all(
      $$(`.ms-sub-${key}`).map((el) =>
        anim(el, [{ opacity: 0.6 }, { opacity: 1 }, { opacity: 0.6 }], { duration: RESEARCH_DWELL }))
    )

    const shimmer = () => anim($('.ms-shimmer'), [
      { opacity: 0,   transform: 'translateX(-40px)' },
      { opacity: 0.5, transform: 'translateX(0px)', offset: 0.5 },
      { opacity: 0,   transform: 'translateX(44px)' },
    ], { duration: 850, easing: EASE_OUT })

    async function researchLane(el, out, back, key) {
      setOpacity(el, 1)
      await travel(el, out, LEG)
      if (!isAlive()) return
      // the packet enters the node — no dot parked on the edge during the dwell
      await anim(el, [{ opacity: 1 }, { opacity: 0 }], { duration: FADE_FAST })
      pulse(key); flash(key)
      await wait(RESEARCH_DWELL)
      if (!isAlive()) return
      // re-emerges on the far side as the research completes
      anim(el, [{ opacity: 0 }, { opacity: 1 }], { duration: FADE_FAST })
      await travel(el, back, LEG)
    }
    // constant speed, no dwell — the numbers travel untouched
    async function rawLane(el, out, back) {
      setOpacity(el, 1)
      const total = LEG * 2 + RESEARCH_DWELL
      await travel(el, out, total / 2, 'linear')
      if (!isAlive()) return
      await travel(el, back, total / 2, 'linear')
    }

    async function cycle(i) {
      const c = CYCLES[i % CYCLES.length]
      setTicker(c.ticker)
      // reset transient elements
      $$('.ms-dot').forEach((el) => setOpacity(el, 0))
      ;[$('#ms-outcome'), $('#ms-ticker')].forEach((el) => setOpacity(el, 0))
      if (!isAlive()) return

      // the screener flags a ticker and emits three packets
      anim($('.ms-box-screen'), [
        { transform: 'scale(1)' }, { transform: 'scale(1.15)' }, { transform: 'scale(1)' },
      ], { duration: EMIT_PULSE })
      anim($('#ms-ticker'), [{ opacity: 0 }, { opacity: 1 }], { duration: 300 })
      await wait(EMIT_PULSE)
      if (!isAlive()) return

      await Promise.all([
        researchLane($('#ms-dotA'), segs.A1, segs.A2, 'laneA'),
        researchLane($('#ms-dotB'), segs.B1, segs.B2, 'laneB'),
        rawLane($('#ms-dotC'), segs.C1, segs.C2),
      ])
      if (!isAlive()) return

      // three into one at the GPT-4.1 edge — the signature merge
      await Promise.all(['#ms-dotA', '#ms-dotB', '#ms-dotC'].map((s) =>
        anim($(s), [{ opacity: 1 }, { opacity: 0 }], { duration: FADE_FAST })))
      const dM = $('#ms-dotM')
      dM.style.offsetPath = 'none'
      dM.style.transform = tf(merge)
      setOpacity(dM, 1)
      await anim(dM, [
        { r: '2.8px' }, { r: '7px', offset: 0.6 }, { r: '5.5px' },
      ], { duration: MERGE_POP, easing: EASE_OUT })
      await anim(dM, [{ opacity: 1 }, { opacity: 0 }], { duration: FADE_FAST })
      if (!isAlive()) return

      // synthesis — a restrained "thinking" shimmer
      pulse('synth')
      shimmer()
      await wait(SYNTH_DWELL)
      if (!isAlive()) return

      // hand the verdict to delivery: everything analyzed lands in the app feed
      dM.style.transform = ''
      setOpacity(dM, 1)
      await travel(dM, segs.D, HANDOFF, EASE_OUT)
      await anim(dM, [{ opacity: 1 }, { opacity: 0 }], { duration: FADE_FAST })
      pulse('deliver')
      if (!isAlive()) return

      // the per-cycle outcome: did this signal's confidence clear the user's bar?
      const isMet = c.conf >= PUSH_THRESHOLD
      setMet(isMet)
      await wait(OUTCOME_DELAY)   // React paints the label during the pause
      if (isMet) {
        // criteria met — the push fires, so the outcome pops
        await anim($('#ms-outcome'), SPRING_KF(0.7), { duration: OUTCOME_POP, easing: EASE_OUT })
      } else {
        // criteria not met — a non-event: it just states itself, quietly
        await anim($('#ms-outcome'), [{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: EASE_OUT })
      }
      await wait(CYCLE_GAP)
      await anim($('#ms-outcome'), [{ opacity: 1 }, { opacity: 0 }], { duration: 400 })
    }

    async function entry() {
      $$('.ms-conn').forEach((el, i) =>
        anim(el, [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
          { duration: CONN_DRAW, delay: i * ENTRY_STAGGER * 0.6, easing: EASE_OUT }))
      await Promise.all(
        $$('.ms-node').map((el, i) =>
          anim(el, [
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'translateY(0px)' },
          ], { duration: ENTRY_DUR, delay: i * ENTRY_STAGGER, easing: EASE_OUT }))
      )
    }

    // Entry tweens cancelled mid-flight (scrolled away before they finished)
    // never commit their final styles, which would leave nodes stuck invisible.
    const showAll = () => {
      $$('.ms-node').forEach((el) => { el.style.opacity = '1'; el.style.transform = 'translateY(0px)' })
      $$('.ms-conn').forEach((el) => { el.style.strokeDashoffset = '0' })
    }

    async function run() {
      if (!enteredRef.current) {
        await entry()
        if (!isAlive()) return
        enteredRef.current = true
      }
      showAll()
      let i = 0
      while (isAlive()) { await cycle(i++) }
    }

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (e.isIntersecting && e.intersectionRatio >= 0.35) {
          if (!alive) { alive = true; run() }
        } else {
          // loop bails at its next guard; cancel in-flight animations too
          alive = false
          running.forEach((a) => a.cancel())
        }
      },
      { threshold: [0, 0.35, 1] }
    )
    io.observe(root)
    return () => {
      alive = false
      running.forEach((a) => a.cancel())
      io.disconnect()
    }
  }, [reduce, L, segs, merge])

  // ── render ────────────────────────────────────────────────────────────────────
  const hiddenNode = reduce ? 1 : 0
  const connOffset = reduce ? 0 : 1
  const eyebrow = { fontFamily: 'Space Grotesk, system-ui, sans-serif', fontSize: 12.5, fontWeight: 600, letterSpacing: '0.12em', fill: TEXT }
  const sub     = { fontFamily: 'Space Grotesk, system-ui, sans-serif', fontSize: 10.5, fill: DIM }
  const mono    = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }

  // the outcome is binary: user's notification criteria met → push sent; not met → ignored
  const outcomeLabel = met ? 'USER CRITERIA MET · PUSH SENT' : 'USER CRITERIA NOT MET · IGNORED'
  const outcomeW = 30 + outcomeLabel.length * 6.6

  const conns = [
    { key: 'A1', d: segs.A1 }, { key: 'B1', d: segs.B1 }, { key: 'C1', d: segs.C1, quiet: true },
    { key: 'A2', d: segs.A2 }, { key: 'B2', d: segs.B2 }, { key: 'C2', d: segs.C2, quiet: true },
    { key: 'D',  d: segs.D  },
  ]

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label="Animated schematic of the Magic Signal analysis pipeline: the Unusual Whales options screener flags tickers with unusual activity every five minutes; each flagged ticker fans out to two Perplexity research passes (live news and company fundamentals) alongside the raw options data, which converge at GPT-4.1 for synthesis into a verdict that is always delivered to the app feed. A push notification is sent only when the user's notification criteria are met; otherwise it is ignored."
      className="w-full"
      style={{ padding: 'clamp(12px, 2vw, 24px)' }}
    >
      <svg viewBox={L.viewBox} width="100%" style={{ display: 'block', height: 'auto' }} aria-hidden="true">
        <defs>
          <linearGradient id="ms-shine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* connectors (drawn from the exact strings the dots travel) */}
        {conns.map((c) => (
          <path
            key={c.key}
            className="ms-conn"
            d={c.d}
            fill="none"
            stroke={c.quiet ? CONN_QUIET : CONN}
            strokeWidth={c.quiet ? 1 : 1.25}
            pathLength={1}
            style={{ strokeDasharray: 1, strokeDashoffset: connOffset }}
          />
        ))}

        {/* raw options data — the quiet pass-through label */}
        <text x={L.rawLabel.x} y={L.rawLabel.y} textAnchor={L.rawLabel.anchor} style={{ ...mono, fontSize: 10, letterSpacing: '0.06em', fill: DIMMER }}>
          raw options data
        </text>

        {/* packet dots — positioned by offset-path along the connectors */}
        <circle id="ms-dotA" className="ms-dot" r="3.5" fill={ACCENT} style={{ opacity: 0 }} />
        <circle id="ms-dotB" className="ms-dot" r="3.5" fill={ACCENT} style={{ opacity: 0 }} />
        <circle id="ms-dotC" className="ms-dot" r="3"   fill="rgba(242,242,240,0.5)" style={{ opacity: 0 }} />
        <circle id="ms-dotM" className="ms-dot" r="5.5" fill={ACCENT} style={{ opacity: 0 }} />

        {/* nodes */}
        {nodes.map((n) => {
          const lineH = 14
          const total = 1 + n.subs.length
          const startY = n.cy - ((total - 1) * lineH) / 2 + 4
          const isDeliver = n.key === 'deliver'
          return (
            <g key={n.key} className="ms-node" style={{ opacity: hiddenNode }}>
              <rect
                className={`ms-box-${n.key}`}
                x={n.cx - n.w / 2} y={n.cy - n.h / 2} width={n.w} height={n.h} rx="14"
                fill={NODE_FILL} stroke={BORDER} strokeWidth="1"
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
              />
              <text x={n.cx} y={startY} textAnchor="middle" style={eyebrow}>{n.title}</text>
              {n.subs.map((s, i) => (
                <text
                  key={i}
                  x={n.cx}
                  y={startY + (i + 1) * lineH}
                  textAnchor="middle"
                  className={`ms-sub-${n.key}`}
                  style={
                    isDeliver && i === 0
                      ? { ...eyebrow, fontSize: 11, letterSpacing: '0.1em', fill: TEXT }
                      : sub
                  }
                >
                  {s}
                </text>
              ))}
            </g>
          )
        })}

        {/* synthesis shimmer (sweeps across the GPT-4.1 box) */}
        <rect
          className="ms-shimmer"
          x={L.geo.synth.cx - 30} y={L.geo.synth.cy - L.geo.synth.h / 2}
          width="60" height={L.geo.synth.h} rx="14"
          fill="url(#ms-shine)"
          style={{ opacity: 0, mixBlendMode: 'overlay' }}
        />

        {/* travelling ticker label above the screener */}
        <text
          id="ms-ticker"
          x={L.geo.screen.cx}
          y={L.geo.screen.cy - L.geo.screen.h / 2 - 10}
          textAnchor="middle"
          style={{ ...mono, fontSize: 11, letterSpacing: '0.08em', fill: ACCENT, opacity: 0 }}
        >
          {ticker}
        </text>

        {/* user-criteria outcome — binary: push sent, or ignored */}
        <g id="ms-outcome" style={{ opacity: reduce ? 1 : 0, transformBox: 'fill-box', transformOrigin: 'center' }}>
          <rect x={L.outcome.x - outcomeW / 2} y={L.outcome.y - 11} width={outcomeW} height="22" rx="11"
            fill={met ? 'rgba(71,229,188,0.12)' : 'rgba(242,242,240,0.04)'}
            stroke={met ? 'rgba(71,229,188,0.5)' : BORDER} strokeWidth="1" />
          <text x={L.outcome.x} y={L.outcome.y + 3.5} textAnchor="middle"
            style={{ ...mono, fontSize: 9, letterSpacing: '0.12em', fill: met ? MINT : DIMMER }}>
            {outcomeLabel}
          </text>
        </g>
      </svg>
    </div>
  )
}
