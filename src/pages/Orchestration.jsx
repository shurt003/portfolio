import { useEffect, useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavTheme } from '../contexts/NavTheme'
import { GLOBE_CONFIG, NODES_META } from '../components/orchestrationConfig'
import OrchestrationHUD from '../components/OrchestrationHUD'

const OrchestrationSwarm = lazy(() => import('../components/OrchestrationSwarm'))

const BG = '#0E1015'
const CREAM = '#F5F0E8'
const ACCENT_LT = '#8AA6FF'
const AMBER = '#F5A623'

/* Globe placement: right-of-centre hero on desktop; centred + smaller and
   pushed below the headline on phones. */
const DESKTOP = { offsetX: GLOBE_CONFIG.offsetX, offsetY: GLOBE_CONFIG.offsetY, scale: 1 }
const MOBILE = { offsetX: 0, offsetY: -0.85, scale: 0.66 }

/* Project the globe's world center to screen pixels (px-per-world is
   isotropic in a perspective frustum, so x and y share one scale). */
function projectGlobe(layout) {
  const { radius, camZ, fov } = GLOBE_CONFIG
  const vw = window.innerWidth
  const vh = window.innerHeight
  const halfH = Math.tan((fov * Math.PI) / 180 / 2) * camZ
  const pxPerWorld = vh / 2 / halfH
  return {
    center: { x: vw / 2 + layout.offsetX * pxPerWorld, y: vh / 2 - layout.offsetY * pxPerWorld },
    radius: radius * layout.scale * pxPerWorld,
  }
}

export default function Orchestration() {
  const { setIsDark } = useNavTheme()
  const [proj, setProj] = useState(null)
  const [reduce, setReduce] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)
  const node = selected != null ? NODES_META[selected] : null
  const layout = isMobile ? MOBILE : DESKTOP

  useEffect(() => {
    setIsDark(true)
    return () => setIsDark(false)
  }, [setIsDark])

  useEffect(() => {
    setReduce(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    const update = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      setProj(projectGlobe(mobile ? MOBILE : DESKTOP))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <main className="relative min-h-screen overflow-hidden" style={{ backgroundColor: BG, color: CREAM }}>
      {/* particle field */}
      <div className="absolute inset-0">
        <Suspense fallback={null}>
          <OrchestrationSwarm
            hovered={hovered}
            selected={selected}
            onHover={setHovered}
            onSelect={setSelected}
            offsetX={layout.offsetX}
            offsetY={layout.offsetY}
            scale={layout.scale}
            bloom={!isMobile}
          />
        </Suspense>
      </div>

      {/* faint instrument grid */}
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

      {/* command-interface overlay */}
      {proj && <OrchestrationHUD center={proj.center} radius={proj.radius} reduce={reduce} compact={isMobile} />}

      {/* headline block */}
      <div className="pointer-events-none relative z-10 px-6 md:px-14 lg:px-20 pt-28">
        <div className="flex items-center gap-3 mb-6">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: AMBER, boxShadow: `0 0 12px ${AMBER}` }}
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: ACCENT_LT }}>
            Orchestration // live
          </span>
        </div>
        <h1
          className="font-display font-black tracking-tight max-w-3xl"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1.04 }}
        >
          One layer, coordinating many autonomous agents.
        </h1>
        <p className="font-sans max-w-md mt-5 text-base md:text-lg" style={{ color: 'rgba(245,240,232,0.6)' }}>
          A particle study. Independent nodes, one orchestration layer. Hover the globe to shift the
          view — <span style={{ color: ACCENT_LT }}>click an asset node</span> to inspect it.
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
              ...(isMobile
                ? { left: 16, right: 16, bottom: 96, width: 'auto' }
                : { top: '52%', width: 268 }),
              backgroundColor: 'rgba(12,15,21,0.72)',
              border: '1px solid rgba(245,240,232,0.14)',
              borderRadius: 14,
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              boxShadow: '0 30px 70px -40px rgba(0,0,0,0.9)',
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: '1px solid rgba(245,240,232,0.1)' }}
            >
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
    </main>
  )
}
