import { useRef, useEffect, useState, lazy, Suspense } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import RivePiece from '../components/RivePiece'
import EasingPlayground from '../components/EasingPlayground'
import SquashStretch from '../components/SquashStretch'
import MotionLabIntro from '../components/MotionLabIntro'
import { useNavTheme } from '../contexts/NavTheme'
import { GLOBE_CONFIG, NODES_META } from '../components/orchestrationConfig'
import OrchestrationHUD from '../components/OrchestrationHUD'

const HeroParticles = lazy(() => import('../components/HeroParticles'))
const OrchestrationSwarm = lazy(() => import('../components/OrchestrationSwarm'))
const PlaybookScene = lazy(() => import('../components/PlaybookScene'))

/* ── Dark "studio" theme tokens ─────────────────────────────────
   Same brand family, inverted: ink becomes the canvas, cream becomes
   the type, and the blue accent stays. A brighter blue (ACCENT_LT)
   reads better as text/labels on near-black.                        */
const BG = '#0E1015'
const PANEL = '#161A21'
const CREAM = '#F5F0E8'
const ACCENT = '#2B59C3'
const ACCENT_LT = '#8AA6FF'
const AMBER = '#F5A623'

/* Converge: each child enters offset by `speed` and slides toward its final
   resting position as you scroll down. Alignment completes when the element's
   top reaches 50% up from the bottom of the viewport (center), then holds. */
function Parallax({ children, speed = 30, className, style }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.5'] })
  const y = useTransform(scrollYProgress, [0, 1], [speed, 0])
  return (
    <motion.div ref={ref} className={className} style={{ y, ...style }}>
      {children}
    </motion.div>
  )
}

/* Kinetic wordmark: staggered spring entrance + continuous gentle wave */
function KineticWord({ text, color }) {
  return (
    <span className="whitespace-nowrap" style={{ color }}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: '0.5em' }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.05, type: 'spring', stiffness: 280, damping: 18 }}
        >
          <motion.span
            className="inline-block"
            animate={{ y: ['0%', '-16%', '0%'] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 1 + i * 0.13 }}
          >
            {ch}
          </motion.span>
        </motion.span>
      ))}
    </span>
  )
}

/* Custom studio cursor: a precise dot + a lagging ring. Desktop only,
   and skipped under reduced-motion. */
function StudioCursor() {
  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const ringX = useSpring(dotX, { stiffness: 380, damping: 30, mass: 0.4 })
  const ringY = useSpring(dotY, { stiffness: 380, damping: 30, mass: 0.4 })
  const [on, setOn] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return
    setOn(true)
    document.documentElement.style.cursor = 'none'
    const move = (e) => { dotX.set(e.clientX); dotY.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => {
      window.removeEventListener('mousemove', move)
      document.documentElement.style.cursor = ''
    }
  }, [dotX, dotY])

  if (!on) return null
  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[130] rounded-full"
        style={{ x: dotX, y: dotY, width: 6, height: 6, marginLeft: -3, marginTop: -3, backgroundColor: ACCENT_LT }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[130] rounded-full"
        style={{ x: ringX, y: ringY, width: 34, height: 34, marginLeft: -17, marginTop: -17, border: `1px solid ${ACCENT_LT}59` }}
      />
    </>
  )
}

/* Ambient backdrop: faint graph grid + accent glow + film grain. */
function StudioBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* graph grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
          maskImage: 'radial-gradient(120% 80% at 50% 0%, #000 35%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(120% 80% at 50% 0%, #000 35%, transparent 100%)',
        }}
      />
      {/* accent glow behind the hero */}
      <div
        className="absolute"
        style={{
          top: '-12%', left: '50%', width: 900, height: 900, transform: 'translateX(-50%)',
          background: `radial-gradient(circle, ${ACCENT}33 0%, transparent 60%)`,
          filter: 'blur(20px)',
        }}
      />
      {/* film grain */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.06,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}

/* Monospace lab label, e.g.  STUDY_01 */
function LabTag({ children, dim }) {
  return (
    <span
      className="font-mono text-[11px] uppercase tracking-[0.22em]"
      style={{ color: dim ? 'rgba(245,240,232,0.4)' : ACCENT_LT }}
    >
      {children}
    </span>
  )
}

/* White-artboard Rive pieces sit on a "screen" so the baked-in white
   reads as a mounted monitor rather than a stray bright rectangle. */
function ScreenFrame({ children, aspect, bg = '#fff' }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        backgroundColor: bg,
        border: '1px solid rgba(245,240,232,0.14)',
        boxShadow: '0 26px 70px -34px rgba(0,0,0,0.9)',
        aspectRatio: aspect,
      }}
    >
      {children}
    </div>
  )
}

/* Light "instrument panel" for the interactive widgets, which are
   built light. The chrome makes that intentional on a dark page. */
function InstrumentPanel({ tag, meta, children }) {
  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        backgroundColor: CREAM,
        border: '1px solid rgba(245,240,232,0.12)',
        boxShadow: '0 40px 90px -50px rgba(0,0,0,0.85)',
      }}
    >
      <div
        className="flex items-center justify-between px-6 py-3"
        style={{ borderBottom: '1px solid rgba(26,26,26,0.10)', backgroundColor: 'rgba(26,26,26,0.03)' }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'rgba(26,26,26,0.6)' }}>{tag}</span>
        <span className="font-mono text-[11px]" style={{ color: 'rgba(26,26,26,0.35)' }}>{meta}</span>
      </div>
      <div className="p-6 md:p-10">{children}</div>
    </div>
  )
}

const GALLERY = [
  {
    src: '/rive/FRCCGvUVJDSEuCuQL0XwNHnY5QQ.riv',
    artboard: 'planet remap',
    title: 'Planet companion',
    tag: 'STUDY_01',
    caption: 'A character study. It drifts on its own, then wakes up when you hover over it.',
    float: true,
    aspect: '4 / 3',
  },
  {
    src: '/rive/olUYe5misqaCZQZ6N9vpqFpkzE.riv',
    title: 'Animated nav rail',
    tag: 'UI_02',
    caption: 'A vertical navigation with per-item hover and selection states. Run your cursor down it.',
    aspect: '4 / 3',
    cream: true, // test: blend the baked-in white background to cream via multiply
  },
  {
    src: '/rive/jXjxnOB3tf4RpVsEz763esKMus.riv',
    title: 'Orbiting constraints',
    tag: 'RIG_03',
    caption: 'Rive constraints in action: elements that oscillate and rotate along a shared path. Hover to react.',
    hoverInputs: [{ name: 'isHovered?', on: true, off: false }],
    aspect: '4 / 3',
    cream: true, // blend the baked-in white background to cream via multiply
  },
]

const BUTTON_ANATOMY = {
  src: '/rive/1ez8VLa5wI6GPUe2zyaDNW8PbAc.riv',
  title: 'Anatomy of a button',
  tag: 'SPEC_05',
  caption: 'An explainer that breaks a button into its building blocks. Hover any label to highlight it.',
}

/* ── Orchestration section ────────────────────────────────────────────
   Full-width dark section embedding the particle globe. Lazy-mounts the
   Three.js canvas only when scrolled into view so it doesn't penalise
   the initial page load. Pauses the frame loop when scrolled away.    */
function OrchestrationSection() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const [inView, setInView] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)
  const [proj, setProj] = useState(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const node = selected != null ? NODES_META[selected] : null

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // Intersection Observer — mount canvas 200px before visible, pause when away
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && !hasEntered) setHasEntered(true)
      },
      { rootMargin: '200px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hasEntered])

  // Project globe center to screen pixels within the section container
  useEffect(() => {
    if (!hasEntered) return
    const update = () => {
      const el = stageRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const { radius, camZ, fov } = GLOBE_CONFIG
      const w = rect.width
      const h = rect.height
      const halfH = Math.tan((fov * Math.PI) / 180 / 2) * camZ
      const pxPerWorld = h / 2 / halfH
      // Globe is offset right on desktop, centered on mobile
      const mobile = w < 768
      const offX = mobile ? 0 : GLOBE_CONFIG.offsetX
      const offY = mobile ? -0.85 : GLOBE_CONFIG.offsetY
      const sc = mobile ? 0.66 : 1
      setProj({
        center: { x: w / 2 + offX * pxPerWorld, y: h / 2 - offY * pxPerWorld },
        radius: radius * sc * pxPerWorld,
      })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [hasEntered])

  const TECH = [
    { label: 'Three.js / R3F', desc: 'WebGL particle system rendered via @react-three/fiber for declarative scene composition.' },
    { label: 'Fibonacci sphere', desc: '5,200 points distributed uniformly on a sphere using the golden-angle algorithm.' },
    { label: 'Great-circle arcs', desc: 'Geodesic paths between asset nodes, drawn in progressively by travelling amber pulses.' },
    { label: 'Depth occlusion', desc: 'An invisible depth-writing sphere hides far-side elements; opacity fades smooth the transition at edges.' },
    { label: 'Fresnel rim shader', desc: 'Custom GLSL vertex/fragment shader creates the atmosphere glow at the globe’s silhouette.' },
    { label: 'HUD overlay', desc: 'Screen-space SVG reticle, callouts, and live telemetry bar — all pointer-events-none, projected from 3D world coords.' },
  ]

  return (
    <section
      ref={sectionRef}
      className="mt-20 md:mt-28"
      style={{ backgroundColor: '#0E1015', width: '100vw', marginLeft: 'calc(50% - 50vw)' }}
    >
      {/* ── Globe viewport: exactly 100vh, self-contained ──────── */}
      <div ref={stageRef} className="relative overflow-hidden" style={{ height: '100vh' }}>
        {/* Globe canvas — only mounted after first scroll into view */}
        {hasEntered && (
          <div className="absolute inset-0" style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.4s' }}>
            <Suspense fallback={null}>
              <OrchestrationSwarm
                hovered={hovered}
                selected={selected}
                onHover={setHovered}
                onSelect={setSelected}
                offsetX={window.innerWidth < 768 ? 0 : GLOBE_CONFIG.offsetX}
                offsetY={window.innerWidth < 768 ? -0.85 : GLOBE_CONFIG.offsetY}
                scale={window.innerWidth < 768 ? 0.66 : 1}
              />
            </Suspense>
          </div>
        )}

        {/* faint grid */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '46px 46px',
            maskImage: 'radial-gradient(120% 90% at 50% 50%, #000 35%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(120% 90% at 50% 50%, #000 35%, transparent 100%)',
          }}
        />

        {/* HUD overlay */}
        {proj && <OrchestrationHUD center={proj.center} radius={proj.radius} reduce={reduceMotion} compact={typeof window !== 'undefined' && window.innerWidth < 768} />}

        {/* headline */}
        <div className="pointer-events-none relative z-10 px-6 md:px-14 lg:px-20 pt-28">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: AMBER, boxShadow: `0 0 12px ${AMBER}` }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT_LT }}>
              Orchestration // live
            </span>
          </div>
          <h2
            className="font-display font-black tracking-tight max-w-3xl"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.04, color: CREAM }}
          >
            One layer, coordinating many autonomous agents.
          </h2>
          <p className="font-sans max-w-md mt-5 text-base md:text-lg" style={{ color: 'rgba(245,240,232,0.6)' }}>
            A concept for a real-time command interface — coordinating many autonomous assets from a single
            orchestration layer. Built from scratch in WebGL / Three.js, with live telemetry, depth-aware 3D
            visualization, and an operator HUD. Hover the globe to shift the view — <span style={{ color: ACCENT_LT }}>click an asset node</span> to inspect it.
          </p>
        </div>

        {/* selected-node detail panel */}
        <AnimatePresence>
          {node && (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute z-30 left-6 md:left-14 lg:left-20"
              style={{
                top: '52%', width: 268,
                backgroundColor: 'rgba(12,15,21,0.72)',
                border: '1px solid rgba(245,240,232,0.14)',
                borderRadius: 14,
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                boxShadow: '0 30px 70px -40px rgba(0,0,0,0.9)',
              }}
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(245,240,232,0.1)' }}>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: ACCENT_LT }}>
                  Node // {node.id}
                </span>
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: node.status === 'ACTIVE' ? AMBER : 'rgba(245,240,232,0.35)',
                    boxShadow: node.status === 'ACTIVE' ? `0 0 8px ${AMBER}` : 'none',
                  }}
                />
              </div>
              <div className="px-4 py-3 space-y-2.5">
                {[
                  ['Class', node.cls],
                  ['Status', node.status],
                  ['Coord', `${node.lat}° ${node.lon}°`],
                  ['Links', String(node.links).padStart(2, '0')],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(245,240,232,0.4)' }}>{label}</span>
                    <span className="font-mono text-[12px] tracking-[0.08em]" style={{ color: 'rgba(245,240,232,0.9)' }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(245,240,232,0.3)' }}>
                  Click empty space to deselect
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── How it was built ─────────────────────────────────────── */}
      <div className="relative z-10 px-6 md:px-14 lg:px-20 pb-20" style={{ borderTop: '1px solid rgba(245,240,232,0.08)' }}>
          <div className="pt-16 max-w-3xl">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT_LT }}>
              How it was built
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-bold mt-4" style={{ color: CREAM }}>
              WebGL particle system, from scratch
            </h3>
            <p className="font-sans text-base leading-relaxed mt-4" style={{ color: 'rgba(245,240,232,0.6)' }}>
              No globe library — this is a custom Three.js scene built on React Three Fiber.
              5,200 particles assemble from a scattered cloud into a Fibonacci sphere, with
              great-circle arcs revealed by travelling pulses, per-point depth dimming, and a
              screen-space HUD projected from 3D world coordinates.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              {TECH.map((t) => (
                <div key={t.label} className="flex flex-col gap-1.5">
                  <span className="font-mono text-[12px] tracking-[0.1em] font-semibold" style={{ color: CREAM }}>{t.label}</span>
                  <span className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(245,240,232,0.5)' }}>{t.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
    </section>
  )
}

/* ── Autonomous playbook study ────────────────────────────────────────
   A tactical playbook selector wired to an angled 3D command-map. Choosing
   a play morphs the fleet formation + link topology. Play metadata is kept
   local (no Three import) so the heavy scene stays lazy.                  */
const PLAYS_META = [
  { code: 'PLAY.01', name: 'Subsurface-to-Air Surveillance', tactic: 'Stack sensing from seabed to orbit; a relay closes the loop.', assets: 6, domains: 'Sea · Surface · Air · Space', links: 5 },
  { code: 'PLAY.02', name: 'Perimeter Screen', tactic: 'Ring the asset of interest; hand off contacts around the loop.', assets: 6, domains: 'Surface · Air · Space', links: 6 },
  { code: 'PLAY.03', name: 'Deep-Strike Recon', tactic: 'Push a forward scout; chain a relay back to the orchestrator.', assets: 4, domains: 'Sea · Air · Space', links: 3 },
  { code: 'PLAY.04', name: 'Distributed Sensor Net', tactic: 'Spread coverage wide; every node reports to the satellite hub.', assets: 6, domains: 'Sea · Surface · Air · Space', links: 5 },
]

function PlaybookSection() {
  const sectionRef = useRef(null)
  const [hasEntered, setHasEntered] = useState(false)
  const [play, setPlay] = useState(0)
  const [sel, setSel] = useState(null) // selected asset detail or null

  const selectPlay = (i) => { setPlay(i); setSel(null) }

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHasEntered(true) },
      { rootMargin: '200px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const meta = PLAYS_META[play]

  return (
    <section
      ref={sectionRef}
      className="mt-20 md:mt-28"
      style={{ backgroundColor: '#0E1015', width: '100vw', marginLeft: 'calc(50% - 50vw)' }}
    >
      <div className="relative overflow-hidden" style={{ minHeight: '88vh' }}>
        {/* command-map scene — full width, but its left edge fades out so it
            never hard-clips and stays clear of the playbook cards */}
        {hasEntered && (
          <div
            className="absolute inset-0"
            style={{
              WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, transparent 6%, #000 34%)',
              maskImage: 'linear-gradient(90deg, transparent 0%, transparent 6%, #000 34%)',
            }}
          >
            <Suspense fallback={null}>
              <PlaybookScene
                playIndex={play}
                selectedIndex={sel ? sel.index : null}
                onSelect={setSel}
                onDeselect={() => setSel(null)}
              />
            </Suspense>
          </div>
        )}

        <div className="pointer-events-none relative z-10 px-6 md:px-14 lg:px-20 pt-20 pb-10">
          {/* heading */}
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: AMBER, boxShadow: `0 0 12px ${AMBER}` }} />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT_LT }}>
              Autonomous playbooks // study
            </span>
          </div>
          <h2 className="font-display font-black tracking-tight max-w-xl" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', lineHeight: 1.05, color: CREAM }}>
            Pick a play. Watch the fleet take shape.
          </h2>
          <p className="font-sans max-w-sm mt-4 text-base md:text-lg" style={{ color: 'rgba(245,240,232,0.6)' }}>
            High-level tactic in, live spatial picture out. Select a playbook and the mixed-domain
            assets morph into formation — without losing the operator’s spatial context.
          </p>

          {/* playbook cards */}
          <div className="pointer-events-auto mt-8 max-w-md space-y-2.5">
            {PLAYS_META.map((p, i) => {
              const sel = i === play
              return (
                <button
                  key={p.code}
                  onClick={() => selectPlay(i)}
                  className="w-full text-left rounded-xl px-4 py-3.5 transition-all"
                  style={{
                    border: `1px solid ${sel ? 'rgba(245,166,35,0.55)' : 'rgba(245,240,232,0.14)'}`,
                    backgroundColor: sel ? 'rgba(245,166,35,0.08)' : 'rgba(12,15,21,0.5)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em]" style={{ color: sel ? AMBER : 'rgba(245,240,232,0.4)' }}>{p.code}</span>
                    <span className="font-mono text-[10px] tracking-[0.1em]" style={{ color: 'rgba(245,240,232,0.4)' }}>{p.assets} ASSETS</span>
                  </div>
                  <div className="font-display font-bold text-[15px] mt-1.5" style={{ color: CREAM }}>{p.name}</div>
                  <div className="font-sans text-[13px] leading-snug mt-1" style={{ color: 'rgba(245,240,232,0.55)' }}>{p.tactic}</div>
                </button>
              )
            })}
          </div>

          {/* telemetry strip */}
          <div className="mt-8 max-w-md flex items-center gap-8 font-mono" style={{ borderTop: '1px solid rgba(245,240,232,0.12)', paddingTop: 14 }}>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color: 'rgba(245,240,232,0.4)' }}>Domains</div>
              <div className="text-[12px] tracking-[0.06em] mt-1" style={{ color: 'rgba(245,240,232,0.85)' }}>{meta.domains}</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.22em]" style={{ color: 'rgba(245,240,232,0.4)' }}>Links</div>
              <div className="text-[12px] tracking-[0.06em] mt-1" style={{ color: 'rgba(245,240,232,0.85)' }}>{String(meta.links).padStart(2, '0')}</div>
            </div>
          </div>
        </div>

        {/* selected-asset detail panel */}
        <AnimatePresence>
          {sel && (
            <motion.div
              key={sel.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute z-30 right-6 md:right-14 lg:right-20"
              style={{
                bottom: 40, width: 248,
                backgroundColor: 'rgba(12,15,21,0.72)',
                border: '1px solid rgba(245,240,232,0.14)',
                borderRadius: 14,
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                boxShadow: '0 30px 70px -40px rgba(0,0,0,0.9)',
              }}
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid rgba(245,240,232,0.1)' }}>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: ACCENT_LT }}>
                  Asset // {sel.id}
                </span>
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: sel.status === 'ACTIVE' ? AMBER : 'rgba(245,240,232,0.35)',
                    boxShadow: sel.status === 'ACTIVE' ? `0 0 8px ${AMBER}` : 'none',
                  }}
                />
              </div>
              <div className="px-4 py-3 space-y-2.5">
                {[
                  ['Class', sel.cls],
                  ['Domain', sel.domain],
                  ['Status', sel.status],
                  ['Links', String(sel.links).padStart(2, '0')],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: 'rgba(245,240,232,0.4)' }}>{label}</span>
                    <span className="font-mono text-[12px] tracking-[0.08em]" style={{ color: 'rgba(245,240,232,0.9)' }}>{value}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 pb-3">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em]" style={{ color: 'rgba(245,240,232,0.3)' }}>
                  Click empty space to deselect
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* design rationale */}
      <div className="relative z-10 px-6 md:px-14 lg:px-20 pb-8" style={{ borderTop: '1px solid rgba(245,240,232,0.08)' }}>
        <div className="pt-16 max-w-3xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT_LT }}>
            The design problem
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-bold mt-4" style={{ color: CREAM }}>
            From a high-level decision to a live spatial picture
          </h3>
          <p className="font-sans text-base leading-relaxed mt-4" style={{ color: 'rgba(245,240,232,0.6)' }}>
            An operator shouldn’t have to hand-place every asset. They choose intent — a play — and the
            system composes the fleet. The design challenge is the transition: moving from an abstract menu
            choice into a concrete 3D formation <em>without</em> a jarring cut that costs the operator their
            spatial bearings. Here the assets morph in place and the link topology re-wires continuously, so
            the map stays the same map — only the plan changes.
          </p>
        </div>
      </div>

      {/* how it was built */}
      <div className="relative z-10 px-6 md:px-14 lg:px-20 pb-20">
        <div className="pt-4 max-w-3xl">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT_LT }}>
            How it was built
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-bold mt-4" style={{ color: CREAM }}>
            A real-time 3D scene, driven by a tactic
          </h3>
          <p className="font-sans text-base leading-relaxed mt-4" style={{ color: 'rgba(245,240,232,0.6)' }}>
            A custom Three.js scene built on React Three Fiber — no map or globe library. The terrain is a
            generated height field, the fleet morphs procedurally between formations, and the link topology
            re-draws itself every frame from the assets’ live positions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
            {[
              { label: 'Three.js / R3F', desc: 'A declarative WebGL scene composed in React Three Fiber.' },
              { label: 'Procedural topography', desc: 'A height field of summed Gaussian hills, traced into contour lines with marching squares — real ridges, saddles and valleys.' },
              { label: 'Formation morphing', desc: 'Each play defines target positions; assets interpolate toward them every frame, so switching plays animates rather than cuts.' },
              { label: 'Live link topology', desc: 'Connection lines are recomputed from the assets’ current positions each frame and cross-fade as the active play changes.' },
              { label: 'Domain as elevation', desc: 'Vertical position encodes domain — satellites in orbit, drones aloft, surface on the terrain, subsurface below.' },
              { label: 'Lazy + paused', desc: 'The canvas mounts only when scrolled into view and pauses its frame loop when off-screen to keep the page light.' },
            ].map((t) => (
              <div key={t.label} className="flex flex-col gap-1.5">
                <span className="font-mono text-[12px] tracking-[0.1em] font-semibold" style={{ color: CREAM }}>{t.label}</span>
                <span className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(245,240,232,0.5)' }}>{t.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
}

/* Small mono section header used above each block. */
function SectionLabel({ index, title, meta }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <LabTag>{index}</LabTag>
      <span className="h-px flex-1" style={{ backgroundColor: 'rgba(245,240,232,0.14)' }} />
      <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'rgba(245,240,232,0.4)' }}>{meta}</span>
    </div>
  )
}

export default function MotionLab() {
  const { setIsDark } = useNavTheme()
  useEffect(() => {
    setIsDark(true)
    return () => setIsDark(false)
  }, [setIsDark])

  return (
    <>
      <MotionLabIntro />
      <StudioCursor />
      <main className="relative min-h-screen pt-28 pb-28 px-6 md:px-14 lg:px-20" style={{ backgroundColor: BG, color: CREAM }}>
        <StudioBackdrop />
        <div className="relative max-w-[1200px] mx-auto">

          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: ACCENT_LT, boxShadow: `0 0 12px ${ACCENT_LT}` }} />
                <LabTag>MOTION_LAB</LabTag>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: 'rgba(245,240,232,0.35)' }}>/ interactive</span>
              </div>
              <h1 className="font-display font-black leading-[1.03] mb-6" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.4rem)' }}>
                A decade in <KineticWord text="motion" color={ACCENT_LT} />.
              </h1>
              <p className="font-sans text-lg md:text-xl max-w-xl leading-relaxed" style={{ color: 'rgba(245,240,232,0.62)' }}>
                Before product design, I spent ten years as a motion designer. This is where I keep that
                craft sharp: interactive animations and interface motion I build to explore what a UI can
                <em> feel</em> like. Most of the pieces below are live, so go ahead and play with them.
              </p>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] mt-8" style={{ color: 'rgba(245,240,232,0.32)' }}>
                Rive · Framer Motion · After Effects · Lottie · Three.js · React Three Fiber · Cinema 4D · WebGL
              </p>
            </motion.div>

            {/* Particle centerpiece: lazy-loaded WebGL */}
            <motion.div
              className="relative w-full mx-auto lg:ml-auto max-w-[420px] lg:max-w-[520px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
                <Suspense fallback={<div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 50%, ${ACCENT}26 0%, transparent 60%)` }} />}>
                  <HeroParticles />
                </Suspense>
              </div>
            </motion.div>
          </div>

          {/* ── Reel ───────────────────────────────────────────────── */}
          <section className="mt-20 md:mt-28">
            <SectionLabel index="REEL_00" title="Reel" meta="16:9 · vimeo" />
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">The reel</h2>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ position: 'relative', paddingBottom: '56.25%', height: 0, border: '1px solid rgba(245,240,232,0.14)', boxShadow: '0 30px 80px -40px rgba(0,0,0,0.9)' }}
            >
              <iframe
                src="https://player.vimeo.com/video/961473193?title=0&byline=0&portrait=0"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title="Motion reel by Stephen Hurt"
              />
            </div>
          </section>

          {/* ── Interactive explorations ───────────────────────────── */}
          <section className="mt-20 md:mt-28">
            <SectionLabel index="LAB_01" title="Interactive explorations" meta="built in rive" />
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-10">Interactive explorations</h2>

            {/* OALET featured */}
            <motion.div
              {...fadeUp}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 md:mb-16"
            >
              <Parallax speed={-20} className="order-2 lg:order-1">
                <LabTag>FLOW_00 · featured</LabTag>
                <h3 className="font-display text-3xl md:text-4xl font-bold mt-3 mb-4">OALET: fintech onboarding</h3>
                <p className="font-sans text-base md:text-lg leading-relaxed max-w-md" style={{ color: 'rgba(245,240,232,0.6)' }}>
                  A complete multi-screen onboarding flow for a finance app concept, built as a single
                  interactive Rive file: animated screen transitions, a tappable “Get Started” button,
                  and a generative hero mark. Tap through it.
                </p>
              </Parallax>
              <Parallax speed={36} className="order-1 lg:order-2 mx-auto w-full max-w-[360px]">
                <div className="relative">
                  <div
                    className="absolute -inset-10 rounded-full"
                    style={{ background: `radial-gradient(circle, ${ACCENT}40 0%, transparent 65%)`, filter: 'blur(10px)' }}
                  />
                  <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: '10 / 19', boxShadow: '0 40px 90px -40px rgba(0,0,0,0.95)' }}>
                    <RivePiece src="/rive/6neXUhtNbkWzYGzKHDVvCVoIVgU.riv" />
                  </div>
                </div>
              </Parallax>
            </motion.div>

            {/* Gallery grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {GALLERY.map((p, i) => (
                <motion.div
                  key={p.src}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Parallax speed={i % 2 === 0 ? 26 : 14}>
                    {p.float ? (
                      <div className="relative" style={{ aspectRatio: p.aspect }}>
                        <div
                          className="absolute inset-0"
                          style={{ background: `radial-gradient(circle at 50% 45%, ${ACCENT}2e 0%, transparent 60%)` }}
                        />
                        <div className="relative w-full h-full">
                          <RivePiece src={p.src} artboard={p.artboard} hoverInputs={p.hoverInputs} />
                        </div>
                      </div>
                    ) : (
                      <ScreenFrame aspect={p.aspect} bg={p.cream ? CREAM : '#fff'}>
                        <RivePiece
                          src={p.src}
                          artboard={p.artboard}
                          hoverInputs={p.hoverInputs}
                          style={p.cream ? { mixBlendMode: 'multiply' } : undefined}
                        />
                      </ScreenFrame>
                    )}
                  </Parallax>
                  <div className="mt-4 flex items-center gap-3">
                    <LabTag>{p.tag}</LabTag>
                    <span className="h-px flex-1" style={{ backgroundColor: 'rgba(245,240,232,0.1)' }} />
                  </div>
                  <h3 className="font-display text-lg font-bold mt-2">{p.title}</h3>
                  <p className="font-sans text-sm leading-relaxed mt-1 max-w-md" style={{ color: 'rgba(245,240,232,0.55)' }}>{p.caption}</p>
                </motion.div>
              ))}
            </div>

            {/* Anatomy of a button: full-width screen */}
            <motion.div className="mt-10 md:mt-12" {...fadeUp}>
              <Parallax speed={20}>
                <ScreenFrame aspect="540 / 256" bg={CREAM}>
                  <RivePiece
                    src={BUTTON_ANATOMY.src}
                    style={{ borderRadius: '1rem', clipPath: 'inset(0 round 1rem)', mixBlendMode: 'multiply' }}
                  />
                </ScreenFrame>
              </Parallax>
              <div className="mt-4 flex items-center gap-3">
                <LabTag>{BUTTON_ANATOMY.tag}</LabTag>
                <span className="h-px flex-1" style={{ backgroundColor: 'rgba(245,240,232,0.1)' }} />
              </div>
              <h3 className="font-display text-lg font-bold mt-2">{BUTTON_ANATOMY.title}</h3>
              <p className="font-sans text-sm leading-relaxed mt-1 max-w-md" style={{ color: 'rgba(245,240,232,0.55)' }}>{BUTTON_ANATOMY.caption}</p>
            </motion.div>
          </section>

          {/* ── Orchestration globe ─────────────────────────────────── */}
          <OrchestrationSection />

          {/* ── Autonomous playbook study ───────────────────────────── */}
          <PlaybookSection />

          {/* ── Easing playground ──────────────────────────────────── */}
          <section className="mt-20 md:mt-28">
            <SectionLabel index="TOOL_02" title="Easing" meta="cubic-bezier()" />
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Easing, by feel</h2>
            <p className="font-sans text-base max-w-2xl mb-8 leading-relaxed" style={{ color: 'rgba(245,240,232,0.6)' }}>
              Motion lives in the curve. Drag the handles to reshape the easing and watch the dots
              respond. It's the difference between “fine” and “feels right.”
            </p>
            <InstrumentPanel tag="EASING.editor" meta="cubic-bezier()">
              <EasingPlayground />
            </InstrumentPanel>
          </section>

          {/* ── Squash & stretch ───────────────────────────────────── */}
          <section className="mt-20 md:mt-28">
            <SectionLabel index="TOOL_03" title="Squash & stretch" meta="per-frame" />
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Squash &amp; stretch</h2>
            <p className="font-sans text-base max-w-2xl mb-8 leading-relaxed" style={{ color: 'rgba(245,240,232,0.6)' }}>
              The first principle of animation: things deform as they move. A ball squashes on
              impact and stretches through speed. Drag each slider to dial it in.
            </p>
            <InstrumentPanel tag="DEFORM.demo" meta="squash · stretch">
              <SquashStretch />
            </InstrumentPanel>
          </section>

        </div>
      </main>
    </>
  )
}
