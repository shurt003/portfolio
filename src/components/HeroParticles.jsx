import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/*
  HeroParticles — a rings-forward centerpiece for the Motion Lab hero.

  Four thin "solid" rings orbit on different axes, counter-rotating at
  different speeds. At the center, a wireframe icosahedron core slowly
  tumbles. An invisible depth-writing occluder (same shape as the core)
  makes the rings' back arcs hide behind it, so the rings genuinely nest
  AROUND the core instead of painting over it. A soft glow sits behind
  the core for a touch of luminosity.

  • Desktop pointer: the whole assembly tilts toward the cursor.
  • Scales in on load.
  • Honors prefers-reduced-motion (renders it still) and disables the
    pointer tilt on touch.

  Lazy-loaded from MotionLab so three.js stays out of the initial bundle.
*/

const BLUE = '#8AA6FF'       // the "motion" wordmark blue
const BLUE_DEEP = '#5b82ff'
const ACCENT = '#2B59C3'     // brand blue — the gem faces
const CREAM = '#F5F0E8'
const CORE_R = 0.62

function makeGlowTexture() {
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(138,166,255,0.8)')
  g.addColorStop(0.35, 'rgba(138,166,255,0.25)')
  g.addColorStop(1, 'rgba(138,166,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  return new THREE.CanvasTexture(c)
}

function Scene({ still, fine, hoveredRef }) {
  const tiltRef = useRef()
  const spinRef = useRef()
  const coreRef = useRef()
  const r1 = useRef(), r2 = useRef(), r3 = useRef()
  const startRef = useRef(0)

  const glow = useMemo(() => makeGlowTexture(), [])
  useEffect(() => () => glow.dispose(), [glow])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (startRef.current === 0) startRef.current = t
    const since = t - startRef.current

    // scale-in on load
    const intro = still ? 1 : 1 - Math.pow(1 - Math.min(since / 1.1, 1), 3)
    if (spinRef.current) spinRef.current.scale.setScalar(0.55 + 0.45 * intro)

    if (still) return

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.16
      coreRef.current.rotation.x += delta * 0.09
    }
    if (spinRef.current) {
      spinRef.current.rotation.y += delta * 0.05
      spinRef.current.rotation.x = Math.sin(t * 0.1) * 0.04
    }

    // counter-rotating rings, varied axes + speeds
    if (r1.current) r1.current.rotation.z += delta * 0.26
    if (r2.current) r2.current.rotation.z -= delta * 0.16
    if (r3.current) r3.current.rotation.y += delta * 0.21

    const hov = fine && hoveredRef.current
    if (tiltRef.current) {
      const tx = hov ? -state.pointer.y * 0.28 : 0
      const ty = hov ? state.pointer.x * 0.28 : 0
      tiltRef.current.rotation.x += (tx - tiltRef.current.rotation.x) * 0.06
      tiltRef.current.rotation.y += (ty - tiltRef.current.rotation.y) * 0.06
    }
  })

  const ringMat = (color, opacity) => (
    <meshBasicMaterial color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
  )

  return (
    <>
      <ambientLight intensity={0.75} />
      <directionalLight position={[2, 3, 2]} intensity={1.0} color="#e2e8ff" />
      <directionalLight position={[-2, -1, -1]} intensity={0.4} color={BLUE_DEEP} />
      <group ref={tiltRef}>
        <group ref={spinRef}>
        {/* soft glow halo behind the core */}
        <sprite scale={[2.0, 2.0, 1]} renderOrder={-1}>
          <spriteMaterial map={glow} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.4} />
        </sprite>

        {/* faceted icosahedron core — solid blue faces + crisp edges */}
        <group ref={coreRef}>
          {/* solid faces (opaque → also occludes the ring backs so they nest) */}
          <mesh>
            <icosahedronGeometry args={[CORE_R, 0]} />
            <meshStandardMaterial color={BLUE} emissive={BLUE_DEEP} emissiveIntensity={0.28} flatShading metalness={0} roughness={0.5} />
          </mesh>
          {/* edge lines in the SAME lit material as the faces, so they blend in
              instead of standing out as bright unlit lines */}
          <mesh scale={1.012}>
            <icosahedronGeometry args={[CORE_R, 0]} />
            <meshStandardMaterial color={BLUE} emissive={BLUE_DEEP} emissiveIntensity={0.28} flatShading metalness={0} roughness={0.5} wireframe transparent opacity={0.9} depthWrite={false} />
          </mesh>
        </group>

        {/* four counter-rotating rings */}
        <mesh ref={r1} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[1.62, 0.012, 16, 220]} />
          {ringMat(BLUE, 0.7)}
        </mesh>
        <mesh ref={r2} rotation={[Math.PI / 3, Math.PI / 5, 0]}>
          <torusGeometry args={[1.9, 0.009, 16, 240]} />
          {ringMat(CREAM, 0.38)}
        </mesh>
        <mesh ref={r3} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.42, 0.011, 16, 200]} />
          {ringMat(BLUE_DEEP, 0.6)}
        </mesh>
      </group>
    </group>
    </>
  )
}

export default function HeroParticles() {
  const wrapRef = useRef()
  const hoveredRef = useRef(false)
  const [visible, setVisible] = useState(true)

  const { still, fine } = useMemo(() => {
    if (typeof window === 'undefined') return { still: false, fine: true }
    return {
      still: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      fine: window.matchMedia('(pointer: fine)').matches,
    }
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={wrapRef}
      className="absolute inset-0"
      onPointerEnter={() => { hoveredRef.current = true }}
      onPointerLeave={() => { hoveredRef.current = false }}
    >
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, 6.0], fov: 45 }}
      >
        <Scene still={still} fine={fine} hoveredRef={hoveredRef} />
      </Canvas>
    </div>
  )
}
