import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

import * as THREE from 'three'
import { GLOBE_R, OFFSET_X, OFFSET_Y, CAM_Z, FOV, NODES_META } from './orchestrationConfig'

/*
  OrchestrationSwarm — a particle study for the orchestration concept page.

  A point-cloud globe (~5k nodes) assembles from a scattered cloud, then
  slowly rotates with a per-point shimmer. Far-side points recede (depth
  dimming) and a fresnel rim gives it atmosphere. A handful of amber "asset"
  nodes sit on the surface; great-circle arcs are drawn in by occasional
  amber pulses. Asset nodes are hoverable / selectable, reporting out via
  callbacks so the HUD can show live detail.

  Honors prefers-reduced-motion and disables pointer tilt on touch.
*/

const BLUE = '#8AA6FF'
const BLUE_DEEP = '#2B59C3'
const AMBER = '#F5A623'
const CREAM = '#F5F0E8'
const BLUE_RGB = [0x8a / 255, 0xa6 / 255, 0xff / 255] // base point colour

const POINT_COUNT = 5200
const ASSEMBLE_DUR = 1.3
const STAGGER = 0.95
const ARC_REVEAL_START = 2.3
const ARC_REVEAL_STAGGER = 0.34
const ARC_PULSE_SPEED = 0.32
const ARC_TUBULAR = 64
const ARC_IDX_PER_SEG = 36
const PULSE_PERIOD = 12
const PULSE_ACTIVE = 2.8

const NODE_PAIRS = [[0, 1], [1, 2], [2, 4], [4, 5], [5, 3], [3, 0], [0, 4], [1, 5]]

/* Soft round sprite (radial gradient → transparent edge). */
function makeDotTexture(inner, mid) {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, inner)
  g.addColorStop(0.4, mid)
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  return new THREE.CanvasTexture(c)
}

/* Thin reticle ring with four inward ticks, for selection / hover. */
function makeRingTexture(stroke) {
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  ctx.strokeStyle = stroke
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.arc(s / 2, s / 2, s / 2 - 14, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = 3
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2
    const r1 = s / 2 - 14, r2 = s / 2 - 24
    ctx.beginPath()
    ctx.moveTo(s / 2 + Math.cos(a) * r1, s / 2 + Math.sin(a) * r1)
    ctx.lineTo(s / 2 + Math.cos(a) * r2, s / 2 + Math.sin(a) * r2)
    ctx.stroke()
  }
  return new THREE.CanvasTexture(c)
}

function fibonacciSphere(n, r) {
  const pts = []
  const phi = Math.PI * (Math.sqrt(5) - 1)
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const rad = Math.sqrt(1 - y * y)
    const theta = phi * i
    pts.push(new THREE.Vector3(Math.cos(theta) * rad, y, Math.sin(theta) * rad).multiplyScalar(r))
  }
  return pts
}

function latLonToVec(lat, lon, r) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta)
  ).multiplyScalar(r)
}

function greatCircleArc(a, b, segments, lift) {
  const va = a.clone().normalize()
  const vb = b.clone().normalize()
  const pts = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const v = va.clone().lerp(vb, t).normalize()
    const bell = Math.sin(Math.PI * t)
    pts.push(v.multiplyScalar(GLOBE_R * (1 + lift * bell)))
  }
  return pts
}

function pulseAlong(sprite, pts, ph) {
  if (!sprite) return
  const fi = ph * (pts.length - 1)
  const i0 = Math.floor(fi)
  const i1 = Math.min(i0 + 1, pts.length - 1)
  sprite.position.lerpVectors(pts[i0], pts[i1], fi - i0)
}

function smoothstep(e0, e1, x) {
  const tt = THREE.MathUtils.clamp((x - e0) / (e1 - e0), 0, 1)
  return tt * tt * (3 - 2 * tt)
}

/* Fresnel atmosphere rim. */
const RIM_VERT = `
  varying vec3 vN; varying vec3 vV;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`
const RIM_FRAG = `
  varying vec3 vN; varying vec3 vV;
  uniform vec3 uColor; uniform float uPower; uniform float uIntensity;
  void main() {
    float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), uPower);
    gl_FragColor = vec4(uColor * f * uIntensity, 1.0);
  }
`

function Scene({ still, fine, hoveredRef, hovered, selected, onHover, onSelect, offsetX, offsetY, scale }) {
  const tiltRef = useRef()
  const spinRef = useRef()
  const selRingRef = useRef()
  const pulseRefs = useRef([])
  const arcDrawn = useRef([])
  const nodeMatRefs = useRef([])
  const pulseMatRefs = useRef([])
  const arcMatRefs = useRef([])
  const startRef = useRef(0)

  // sphere geometry + scatter starts + per-point phase/delay + colour/normal
  const { geom, base, baseN, scatter, phases, delays } = useMemo(() => {
    const pts = fibonacciSphere(POINT_COUNT, GLOBE_R)
    const positions = new Float32Array(POINT_COUNT * 3)
    const colors = new Float32Array(POINT_COUNT * 3)
    const base = new Float32Array(POINT_COUNT * 3)
    const baseN = new Float32Array(POINT_COUNT * 3)
    const scatter = new Float32Array(POINT_COUNT * 3)
    const phases = new Float32Array(POINT_COUNT)
    const delays = new Float32Array(POINT_COUNT)
    for (let i = 0; i < POINT_COUNT; i++) {
      base[i * 3] = pts[i].x; base[i * 3 + 1] = pts[i].y; base[i * 3 + 2] = pts[i].z
      baseN[i * 3] = pts[i].x / GLOBE_R; baseN[i * 3 + 1] = pts[i].y / GLOBE_R; baseN[i * 3 + 2] = pts[i].z / GLOBE_R
      colors[i * 3] = BLUE_RGB[0]; colors[i * 3 + 1] = BLUE_RGB[1]; colors[i * 3 + 2] = BLUE_RGB[2]
      const u = Math.random() * 2 - 1
      const th = Math.random() * Math.PI * 2
      const s = Math.sqrt(1 - u * u)
      const rad = 3.6 + Math.random() * 4.2
      scatter[i * 3] = s * Math.cos(th) * rad
      scatter[i * 3 + 1] = s * Math.sin(th) * rad
      scatter[i * 3 + 2] = u * rad
      phases[i] = Math.random() * Math.PI * 2
      delays[i] = Math.random() * STAGGER
      const src = still ? base : scatter
      positions[i * 3] = src[i * 3]; positions[i * 3 + 1] = src[i * 3 + 1]; positions[i * 3 + 2] = src[i * 3 + 2]
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return { geom: g, base, baseN, scatter, phases, delays }
  }, [still])

  const dot = useMemo(() => makeDotTexture('rgba(190,205,255,1)', 'rgba(138,166,255,0.4)'), [])
  const amberDot = useMemo(() => makeDotTexture('rgba(255,230,180,1)', 'rgba(245,166,35,0.5)'), [])
  const glow = useMemo(() => makeDotTexture('rgba(70,110,230,0.55)', 'rgba(70,110,230,0.14)'), [])
  const ring = useMemo(() => makeRingTexture('rgba(255,255,255,1)'), [])
  const rimUniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(0.34, 0.5, 1.0) },
    uPower: { value: 3.2 },
    uIntensity: { value: 0 },
  }), [])

  const { nodes, arcs, arcGeoms } = useMemo(() => {
    const nodes = NODES_META.map((n) => latLonToVec(n.lat, n.lon, GLOBE_R))
    const arcs = NODE_PAIRS.map(([i, j]) => greatCircleArc(nodes[i], nodes[j], 64, 0.32))
    const arcGeoms = arcs.map((pts) => {
      const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.008, 6, false)
      g.setDrawRange(0, 0)
      return g
    })
    return { nodes, arcs, arcGeoms }
  }, [])

  // reusable temporaries for the depth-dimming maths
  const tmp = useMemo(() => ({ qT: new THREE.Quaternion(), qS: new THREE.Quaternion(), qW: new THREE.Quaternion(), v: new THREE.Vector3() }), [])

  useEffect(() => () => {
    geom.dispose(); dot.dispose(); amberDot.dispose(); glow.dispose(); ring.dispose()
    arcGeoms.forEach((g) => g.dispose())
  }, [geom, dot, amberDot, glow, ring, arcGeoms])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (startRef.current === 0) startRef.current = t
    const since = t - startRef.current

    const reveal = still ? 1 : THREE.MathUtils.clamp((since - 1.4) / 1.2, 0, 1)
    // store reveal so depth-fade can use it as a ceiling (set in depth-fade block below)
    nodeMatRefs.current._reveal = reveal
    rimUniforms.uIntensity.value = reveal * 0.95

    if (!still) {
      const arr = geom.attributes.position.array
      for (let i = 0; i < POINT_COUNT; i++) {
        const local = (since - delays[i]) / ASSEMBLE_DUR
        if (local < 1) {
          const e = local <= 0 ? 0 : 1 - Math.pow(1 - local, 3)
          const inv = 1 - e
          arr[i * 3] = scatter[i * 3] * inv + base[i * 3] * e
          arr[i * 3 + 1] = scatter[i * 3 + 1] * inv + base[i * 3 + 1] * e
          arr[i * 3 + 2] = scatter[i * 3 + 2] * inv + base[i * 3 + 2] * e
        } else {
          const r = 1 + 0.02 * Math.sin(t * 1.3 + phases[i])
          arr[i * 3] = base[i * 3] * r
          arr[i * 3 + 1] = base[i * 3 + 1] * r
          arr[i * 3 + 2] = base[i * 3 + 2] * r
        }
      }
      geom.attributes.position.needsUpdate = true
      if (spinRef.current) spinRef.current.rotation.y += delta * 0.06
    }

    // depth dimming — fade points whose normal faces away from the camera
    if (tiltRef.current && spinRef.current) {
      tmp.qT.setFromEuler(tiltRef.current.rotation)
      tmp.qS.setFromEuler(spinRef.current.rotation)
      tmp.qW.multiplyQuaternions(tmp.qT, tmp.qS)
      const col = geom.attributes.color.array
      for (let i = 0; i < POINT_COUNT; i++) {
        tmp.v.set(baseN[i * 3], baseN[i * 3 + 1], baseN[i * 3 + 2]).applyQuaternion(tmp.qW)
        const f = 0.16 + 0.84 * smoothstep(-0.4, 0.6, tmp.v.z)
        col[i * 3] = BLUE_RGB[0] * f; col[i * 3 + 1] = BLUE_RGB[1] * f; col[i * 3 + 2] = BLUE_RGB[2] * f
      }
      geom.attributes.color.needsUpdate = true
    }

    // arcs drawn in by their pulse, then occasional staggered fly-throughs
    const pulseStep = PULSE_PERIOD / arcs.length
    arcs.forEach((pts, idx) => {
      const geo = arcGeoms[idx]
      const sprite = pulseRefs.current[idx]
      const pmat = pulseMatRefs.current[idx]
      if (still) {
        geo.setDrawRange(0, Infinity)
        if (pmat) pmat.opacity = 0
        return
      }
      const localT = since - (ARC_REVEAL_START + idx * ARC_REVEAL_STAGGER)
      if (localT < 0) {
        geo.setDrawRange(0, 0)
        if (pmat) pmat.opacity = 0
        return
      }
      if (!arcDrawn.current[idx]) {
        const q = localT * ARC_PULSE_SPEED
        if (q >= 1) {
          arcDrawn.current[idx] = true
          geo.setDrawRange(0, Infinity)
        } else {
          geo.setDrawRange(0, Math.floor(q * ARC_TUBULAR) * ARC_IDX_PER_SEG)
          pulseAlong(sprite, pts, q)
          if (pmat) pmat.opacity = 1
          return
        }
      }
      const cp = (since + idx * pulseStep) % PULSE_PERIOD
      if (cp < PULSE_ACTIVE) {
        const ph = cp / PULSE_ACTIVE
        pulseAlong(sprite, pts, ph)
        if (pmat) pmat.opacity = Math.sin(Math.PI * ph)
      } else if (pmat) {
        pmat.opacity = 0
      }
    })

    // depth-fade arcs, asset nodes, and pulses on the far side
    if (spinRef.current) {
      const wq = new THREE.Quaternion()
      spinRef.current.getWorldQuaternion(wq)

      // arcs — midpoint Z drives opacity
      arcs.forEach((pts, idx) => {
        const mat = arcMatRefs.current[idx]
        if (!mat) return
        const mid = pts[Math.floor(pts.length / 2)].clone().applyQuaternion(wq)
        const d = THREE.MathUtils.smoothstep(mid.z / GLOBE_R, -0.6, 0.5)
        mat.opacity = THREE.MathUtils.lerp(0.08, 0.6, d)
      })

      // amber asset nodes — depth-fade capped by assembly reveal
      const rev = nodeMatRefs.current._reveal ?? 1
      nodes.forEach((p, idx) => {
        const mat = nodeMatRefs.current[idx]
        if (!mat) return
        const wp = p.clone().applyQuaternion(wq)
        const d = THREE.MathUtils.smoothstep(wp.z / GLOBE_R, -0.4, 0.4)
        mat.opacity = THREE.MathUtils.lerp(0.05, 1, d) * rev
      })
    }

    // selection ring "locked" pulse
    if (selRingRef.current) {
      const s = 0.52 + 0.04 * Math.sin(t * 4)
      selRingRef.current.scale.set(s, s, 1)
    }

    // tilt toward cursor
    const hov = fine && hoveredRef.current
    if (tiltRef.current) {
      const tx = hov ? -state.pointer.y * 0.3 : 0
      const ty = hov ? state.pointer.x * 0.3 : 0
      tiltRef.current.rotation.x += (tx - tiltRef.current.rotation.x) * 0.05
      tiltRef.current.rotation.y += (ty - tiltRef.current.rotation.y) * 0.05
    }
  })

  return (
    <>
      <ambientLight intensity={0.8} />
      <group ref={tiltRef} position={[offsetX, offsetY, 0]} scale={scale}>
        <group ref={spinRef}>
          {/* back glow */}
          <sprite scale={[5.4, 5.4, 1]} renderOrder={-2}>
            <spriteMaterial map={glow} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.55} />
          </sprite>

          {/* atmosphere rim */}
          <mesh>
            <sphereGeometry args={[GLOBE_R * 1.05, 48, 48]} />
            <shaderMaterial vertexShader={RIM_VERT} fragmentShader={RIM_FRAG} uniforms={rimUniforms} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>

          {/* depth occluder — invisible sphere that writes to depth buffer only */}
          <mesh renderOrder={0}>
            <sphereGeometry args={[GLOBE_R * 0.92, 48, 48]} />
            <meshBasicMaterial colorWrite={false} depthWrite={true} transparent={false} />
          </mesh>

          {/* point-cloud globe */}
          <points geometry={geom}>
            <pointsMaterial
              size={0.075}
              map={dot}
              vertexColors
              transparent
              opacity={1}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              sizeAttenuation
            />
          </points>

          {/* orchestration arcs */}
          {arcGeoms.map((g, i) => (
            <mesh key={i} geometry={g}>
              <meshBasicMaterial ref={(el) => (arcMatRefs.current[i] = el)} color={BLUE_DEEP} transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          ))}

          {/* asset nodes */}
          {nodes.map((p, i) => (
            <sprite key={i} position={p} scale={[0.24, 0.24, 1]}>
              <spriteMaterial ref={(el) => (nodeMatRefs.current[i] = el)} map={amberDot} color={AMBER} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0} />
            </sprite>
          ))}

          {/* invisible hit targets for hover / select */}
          {nodes.map((p, i) => (
            <mesh
              key={'hit' + i}
              position={p}
              onPointerOver={(e) => { e.stopPropagation(); onHover && onHover(i); document.body.style.cursor = 'pointer' }}
              onPointerOut={() => { onHover && onHover(null); document.body.style.cursor = '' }}
              onClick={(e) => { e.stopPropagation(); onSelect && onSelect(i) }}
            >
              <sphereGeometry args={[0.18, 10, 10]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
          ))}

          {/* hover ring */}
          {hovered != null && hovered !== selected && nodes[hovered] && (
            <sprite position={nodes[hovered]} scale={[0.42, 0.42, 1]} renderOrder={4}>
              <spriteMaterial map={ring} color={BLUE} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.7} />
            </sprite>
          )}

          {/* selection ring */}
          {selected != null && nodes[selected] && (
            <sprite ref={selRingRef} position={nodes[selected]} scale={[0.52, 0.52, 1]} renderOrder={5}>
              <spriteMaterial map={ring} color={CREAM} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.95} />
            </sprite>
          )}

          {/* travelling pulses */}
          {arcs.map((_, i) => (
            <sprite key={i} ref={(el) => (pulseRefs.current[i] = el)} scale={[0.15, 0.15, 1]}>
              <spriteMaterial ref={(el) => (pulseMatRefs.current[i] = el)} map={amberDot} color={CREAM} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0} />
            </sprite>
          ))}
        </group>
      </group>
    </>
  )
}

export default function OrchestrationSwarm({
  hovered, selected, onHover, onSelect,
  offsetX = OFFSET_X, offsetY = OFFSET_Y, scale = 1,
}) {
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
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.02 })
    io.observe(el)
    return () => { io.disconnect(); document.body.style.cursor = '' }
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
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [0, 0, CAM_Z], fov: FOV }}
        onPointerMissed={() => onSelect && onSelect(null)}
      >
        <color attach="background" args={['#0e1015']} />
        <Scene
          still={still}
          fine={fine}
          hoveredRef={hoveredRef}
          hovered={hovered}
          selected={selected}
          onHover={onHover}
          onSelect={onSelect}
          offsetX={offsetX}
          offsetY={offsetY}
          scale={scale}
        />

      </Canvas>
    </div>
  )
}
