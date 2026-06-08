import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

/*
  HeroRings — the counter-rotating ring system from the Motion Lab hero,
  re-themed for the light Home hero.

  Differences from the Motion Lab version:
  • No center shape, no glow, no lights — just the three orbiting rings.
  • NORMAL blending with brand-blue / ink lines instead of additive + glow,
    because additive blending would make the rings vanish on cream (adding
    light to a near-white background does nothing).
  • Ambient drift only (no cursor tilt) for a calm front-door feel.

  Honors prefers-reduced-motion, scales in on load, pauses when offscreen.
  Lazy-loaded so three.js never blocks the hero's first paint.
*/

const BLUE = '#2B59C3' // brand blue — ties to the "22 million" accent
const INK = '#1C2322'

function Rings({ still }) {
  const spinRef = useRef()
  const r1 = useRef(), r2 = useRef(), r3 = useRef()
  const startRef = useRef(0)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (startRef.current === 0) startRef.current = t
    const since = t - startRef.current

    // scale-in on load
    const intro = still ? 1 : 1 - Math.pow(1 - Math.min(since / 1.2, 1), 3)
    if (spinRef.current) spinRef.current.scale.setScalar(0.62 + 0.38 * intro)

    if (still) return

    if (spinRef.current) {
      spinRef.current.rotation.y += delta * 0.05
      spinRef.current.rotation.x = Math.sin(t * 0.1) * 0.04
    }
    // counter-rotating, varied axes + speeds (same as Motion Lab)
    if (r1.current) r1.current.rotation.z += delta * 0.26
    if (r2.current) r2.current.rotation.z -= delta * 0.16
    if (r3.current) r3.current.rotation.y += delta * 0.21
  })

  const ringMat = (color, opacity) => (
    <meshBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
  )

  return (
    <group ref={spinRef}>
      <mesh ref={r1} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.62, 0.013, 16, 220]} />
        {ringMat(BLUE, 0.275)}
      </mesh>
      <mesh ref={r2} rotation={[Math.PI / 3, Math.PI / 5, 0]}>
        <torusGeometry args={[1.9, 0.01, 16, 240]} />
        {ringMat(INK, 0.11)}
      </mesh>
      <mesh ref={r3} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.42, 0.012, 16, 200]} />
        {ringMat(BLUE, 0.21)}
      </mesh>
    </group>
  )
}

export default function HeroRings() {
  const wrapRef = useRef()
  const [visible, setVisible] = useState(true)
  const still = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 6.0], fov: 45 }}
      >
        <Rings still={still} />
      </Canvas>
    </div>
  )
}
