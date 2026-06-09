import { useMemo, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

/*
  PlaybookScene — an "autonomous playbook" tactical study for the Motion Lab.

  An angled 3D tactical grid (a command-map read, deliberately unlike the
  orchestration globe). A roster of mixed-domain assets lives at heights that
  encode their domain — satellites high, drones mid, surface on the grid,
  subsurface below it. Selecting a "play" in the side panel morphs the whole
  fleet into a new formation and re-wires the link topology, exploring how an
  operator drops from a high-level tactic into a live spatial picture without
  losing context.

  Pure r3f + drei; light by design.
*/

const BLUE = '#8AA6FF'
const AMBER = '#F5A623'
const CYAN = '#5FE3D0'
const CREAM = '#F5F0E8'
const BG = '#0E1015'

const TYPE_COLOR = { sat: BLUE, uav: AMBER, usv: AMBER, uuv: CYAN, relay: CREAM }
const TYPE_HEIGHT = { sat: 2.2, uav: 1.15, usv: 0.05, uuv: -0.95, relay: 1.15 }

const TYPE_DOMAIN = { sat: 'Space', uav: 'Air', usv: 'Surface', uuv: 'Subsurface', relay: 'Air' }
const TYPE_CLASS = { sat: 'Satellite', uav: 'Aerial drone', usv: 'Surface vessel', uuv: 'Subsea vehicle', relay: 'Relay' }
const COVERAGE = { sat: 1.35, uav: 0.95, usv: 0.85, uuv: 0.72, relay: 0.8 }

/* Fixed roster — every play repositions this same set so transitions morph. */
const ROSTER = [
  { id: 'SAT-1', type: 'sat' },
  { id: 'UAV-7', type: 'uav' },
  { id: 'UAV-3', type: 'uav' },
  { id: 'USV-5', type: 'usv' },
  { id: 'UUV-9', type: 'uuv' },
  { id: 'RLY-2', type: 'relay' },
]

/* Each play gives an [x, z] for each roster slot (height comes from type),
   an `active` mask, and a link list (roster index pairs). */
export const PLAYS = [
  {
    key: 'SUBSURFACE_TO_AIR',
    name: 'Subsurface-to-Air Surveillance',
    tactic: 'Stack sensing from seabed to orbit; relay closes the loop.',
    xz: [[0, -1.6], [0, -0.4], [1.3, 0.2], [0, 1.0], [0, 1.8], [-1.4, 0.0]],
    active: [true, true, true, true, true, true],
    links: [[4, 3], [3, 1], [1, 0], [5, 1], [2, 1]],
  },
  {
    key: 'PERIMETER_SCREEN',
    name: 'Perimeter Screen',
    tactic: 'Ring the asset of interest; hand off contacts around the loop.',
    xz: [[0, -2.0], [1.8, -0.9], [1.8, 0.9], [0, 1.8], [-1.8, 0.9], [-1.8, -0.9]],
    active: [true, true, true, true, true, true],
    links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  },
  {
    key: 'DEEP_STRIKE_RECON',
    name: 'Deep-Strike Recon',
    tactic: 'Push a forward scout; chain a relay back to the orchestrator.',
    xz: [[-1.6, 1.6], [0.4, -2.0], [-0.6, -0.6], [1.4, 0.8], [0.8, 1.6], [-0.6, 0.4]],
    active: [true, true, true, false, false, true],
    links: [[1, 5], [5, 2], [2, 0]],
  },
  {
    key: 'SENSOR_NET',
    name: 'Distributed Sensor Net',
    tactic: 'Spread coverage wide; every node reports to the satellite hub.',
    xz: [[0, 0], [1.7, -1.4], [-1.7, -1.4], [1.7, 1.4], [-1.7, 1.4], [0, -2.0]],
    active: [true, true, true, true, true, true],
    links: [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
  },
]

function dot(inner, mid) {
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

/* Thin selection ring sprite. */
function makeRingTexture(stroke) {
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  ctx.strokeStyle = stroke
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(s / 2, s / 2, s / 2 - 12, 0, Math.PI * 2)
  ctx.stroke()
  return new THREE.CanvasTexture(c)
}

/* Flat circle geometry in the XZ plane (unit radius) for coverage footprints. */
function makeCircleGeo(seg = 64) {
  const pts = []
  for (let a = 0; a <= 360; a += 360 / seg) {
    const r = (a * Math.PI) / 180
    pts.push(Math.cos(r), 0, Math.sin(r))
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return g
}

/* Topographic contour map from a real height field (sum of Gaussian hills),
   traced with marching squares so contours nest/merge like a true topo map —
   multiple peaks, saddles and valleys, with no crossing lines. */
function makeTopoTexture(stroke) {
  const s = 512
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')

  // several hills of varying height/spread, plus a couple of basins
  const peaks = [
    [0.26, 0.30, 1.0, 0.15],
    [0.70, 0.36, 0.85, 0.17],
    [0.46, 0.68, 0.95, 0.14],
    [0.82, 0.76, 0.6, 0.12],
    [0.16, 0.74, 0.7, 0.13],
    [0.60, 0.16, -0.5, 0.12], // basin (negative)
  ]
  const G = 110
  const H = new Float32Array((G + 1) * (G + 1))
  let min = Infinity, max = -Infinity
  for (let j = 0; j <= G; j++) {
    for (let i = 0; i <= G; i++) {
      const nx = i / G, ny = j / G
      let h = 0
      for (const [px, py, amp, sig] of peaks) {
        const dx = nx - px, dy = ny - py
        h += amp * Math.exp(-(dx * dx + dy * dy) / (2 * sig * sig))
      }
      h += Math.sin(nx * 9) * Math.cos(ny * 8) * 0.04 // gentle ripple
      H[j * (G + 1) + i] = h
      if (h < min) min = h
      if (h > max) max = h
    }
  }

  const at = (i, j) => H[j * (G + 1) + i]
  const px = (x) => (x / G) * s
  ctx.strokeStyle = stroke
  ctx.lineWidth = 1.1

  const N = 16
  for (let k = 1; k < N; k++) {
    const level = min + ((max - min) * k) / N
    for (let j = 0; j < G; j++) {
      for (let i = 0; i < G; i++) {
        const tl = at(i, j), tr = at(i + 1, j), br = at(i + 1, j + 1), bl = at(i, j + 1)
        const idx = (bl >= level ? 1 : 0) | (br >= level ? 2 : 0) | (tr >= level ? 4 : 0) | (tl >= level ? 8 : 0)
        if (idx === 0 || idx === 15) continue
        const T = () => [px(i + (level - tl) / (tr - tl)), px(j)]
        const R = () => [px(i + 1), px(j + (level - tr) / (br - tr))]
        const B = () => [px(i + (level - bl) / (br - bl)), px(j + 1)]
        const L = () => [px(i), px(j + (level - tl) / (bl - tl))]
        const seg = (p, q) => { ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke() }
        switch (idx) {
          case 1: case 14: seg(L(), B()); break
          case 2: case 13: seg(B(), R()); break
          case 3: case 12: seg(L(), R()); break
          case 4: case 11: seg(T(), R()); break
          case 5: seg(L(), T()); seg(B(), R()); break
          case 6: case 9: seg(T(), B()); break
          case 7: case 8: seg(T(), L()); break
          case 10: seg(T(), L()); seg(B(), R()); break
          default: break
        }
      }
    }
  }
  return new THREE.CanvasTexture(c)
}

/* Topographic surface floor (replaces the flat grid). */
function TopoFloor() {
  const tex = useMemo(() => makeTopoTexture('rgba(245,240,232,0.18)'), [])
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[9, 9]} />
      <meshBasicMaterial map={tex} transparent opacity={0.8} depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

/* SPACE band — faint star-field slab up high. */
function StarField() {
  const starTex = useMemo(() => dot('rgba(255,255,255,1)', 'rgba(255,255,255,0.45)'), [])
  const geo = useMemo(() => {
    const N = 220
    const arr = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      arr[i * 3] = (Math.random() * 2 - 1) * 4.2
      arr[i * 3 + 1] = 1.6 + Math.random() * 1.1
      arr[i * 3 + 2] = (Math.random() * 2 - 1) * 4.2
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [])
  return (
    <points geometry={geo}>
      <pointsMaterial size={0.05} map={starTex} color={CREAM} transparent opacity={0.6} depthWrite={false} sizeAttenuation alphaTest={0.01} />
    </points>
  )
}

function Marker({ slot, index, dotTex, ringTex, circleGeo, targetRef, selected, onSelect }) {
  const groupRef = useRef()
  const matRef = useRef()
  const coreRef = useRef()
  const dropRef = useRef()
  const covRef = useRef()
  const ringRef = useRef()
  const [hovered, setHovered] = useState(false)
  const color = TYPE_COLOR[slot.type]
  const height = TYPE_HEIGHT[slot.type]
  const cov = COVERAGE[slot.type]

  useFrame(({ clock }) => {
    const g = groupRef.current
    const tgt = targetRef.current
    if (!g || !tgt) return
    g.position.x += (tgt.x - g.position.x) * 0.12
    g.position.y += (tgt.y - g.position.y) * 0.12
    g.position.z += (tgt.z - g.position.z) * 0.12
    const sc = THREE.MathUtils.lerp(g.scale.x, tgt.active ? 1 : 0.0001, 0.12)
    g.scale.setScalar(sc)
    if (matRef.current) matRef.current.opacity = tgt.active ? 0.62 : 0
    if (coreRef.current) coreRef.current.opacity = tgt.active ? 0.95 : 0
    // drop line down to the floor
    if (dropRef.current) {
      const pos = dropRef.current.geometry.attributes.position
      pos.setXYZ(0, 0, 0, 0)
      pos.setXYZ(1, 0, -g.position.y, 0)
      pos.needsUpdate = true
      dropRef.current.material.opacity = tgt.active ? 0.18 : 0
    }
    // coverage footprint pulses gently
    if (covRef.current) {
      const pulse = 0.1 + 0.04 * Math.sin(clock.elapsedTime * 1.2 + index)
      covRef.current.material.opacity = tgt.active ? pulse : 0
    }
    // selection ring
    if (ringRef.current) {
      ringRef.current.material.opacity += ((selected ? 0.95 : hovered ? 0.5 : 0) - ringRef.current.material.opacity) * 0.2
      const rs = 0.46 + 0.03 * Math.sin(clock.elapsedTime * 3)
      ringRef.current.scale.set(rs, rs, 1)
    }
  })

  const dropGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3))
    return g
  }, [])

  return (
    <group ref={groupRef} position={[0, height, 0]}>
      {/* coverage footprint on the floor beneath the asset */}
      <line geometry={circleGeo} ref={covRef} position={[0, -height, 0]} scale={[cov, 1, cov]}>
        <lineBasicMaterial color={color} transparent opacity={0.1} />
      </line>

      <sprite scale={[0.26, 0.26, 1]}>
        <spriteMaterial ref={matRef} map={dotTex} color={color} blending={THREE.AdditiveBlending} depthWrite={false} transparent opacity={0.62} />
      </sprite>
      {/* crisp solid core so the marker reads as a point, not just glow */}
      <sprite scale={[0.085, 0.085, 1]}>
        <spriteMaterial ref={coreRef} map={dotTex} color={color} depthWrite={false} transparent opacity={0.95} />
      </sprite>
      {/* selection / hover ring */}
      <sprite ref={ringRef} scale={[0.46, 0.46, 1]}>
        <spriteMaterial map={ringTex} color={selected ? CREAM : color} depthWrite={false} transparent opacity={0} />
      </sprite>

      <line ref={dropRef} geometry={dropGeo}>
        <lineBasicMaterial color={color} transparent opacity={0.18} />
      </line>

      {/* invisible hit target for hover / click */}
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = '' }}
        onClick={(e) => { e.stopPropagation(); onSelect && onSelect(index) }}
      >
        <sphereGeometry args={[0.36, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Html center distanceFactor={10} style={{ pointerEvents: 'none' }} zIndexRange={[10, 0]}>
        <div style={{ transform: 'translateY(20px)', whiteSpace: 'nowrap', fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.14em', color: selected ? '#fff' : 'rgba(245,240,232,0.85)' }}>
          {slot.id}
        </div>
      </Html>
    </group>
  )
}

function Links({ targetsRef, dotTex }) {
  // union of all links across plays, each fades in/out per active play
  const allLinks = useMemo(() => {
    const set = new Map()
    PLAYS.forEach((p) => p.links.forEach(([a, b]) => set.set(`${a}-${b}`, [a, b])))
    return [...set.values()]
  }, [])
  const refs = useRef([])
  const pulseRefs = useRef([])
  const pulseMatRefs = useRef([])

  useFrame(({ clock }) => {
    const T = targetsRef.current
    if (!T) return
    const curLinks = T.links || []
    const t = clock.elapsedTime
    allLinks.forEach((pair, i) => {
      const ln = refs.current[i]
      if (!ln) return
      const [a, b] = pair
      const pa = T.positions[a]
      const pb = T.positions[b]
      const pos = ln.geometry.attributes.position
      pos.setXYZ(0, pa.x, pa.y, pa.z)
      pos.setXYZ(1, pb.x, pb.y, pb.z)
      pos.needsUpdate = true
      const on = curLinks.some(([x, y]) => (x === a && y === b) || (x === b && y === a))
      const live = on && T.active[a] && T.active[b]
      const want = live ? 0.4 : 0
      ln.material.opacity += (want - ln.material.opacity) * 0.12

      // travelling data pulse
      const sprite = pulseRefs.current[i]
      const pmat = pulseMatRefs.current[i]
      if (sprite && pmat) {
        if (live) {
          const ph = (t * 0.12 + i * 0.37) % 1
          sprite.position.set(
            pa.x + (pb.x - pa.x) * ph,
            pa.y + (pb.y - pa.y) * ph,
            pa.z + (pb.z - pa.z) * ph,
          )
          pmat.opacity = Math.sin(Math.PI * ph) * 0.9 * ln.material.opacity / 0.4
        } else {
          pmat.opacity = 0
        }
      }
    })
  })

  return (
    <>
      {allLinks.map((_, i) => {
        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3))
        return (
          <line key={i} ref={(el) => (refs.current[i] = el)} geometry={geo}>
            <lineBasicMaterial color={BLUE} transparent opacity={0} />
          </line>
        )
      })}
      {allLinks.map((_, i) => (
        <sprite key={'p' + i} ref={(el) => (pulseRefs.current[i] = el)} scale={[0.07, 0.07, 1]}>
          <spriteMaterial ref={(el) => (pulseMatRefs.current[i] = el)} map={dotTex} color={CREAM} depthWrite={false} transparent opacity={0} />
        </sprite>
      ))}
    </>
  )
}

function Scene({ playIndex, still, selectedIndex, onSelect }) {
  const dotTex = useMemo(() => dot('rgba(255,255,255,1)', 'rgba(200,210,255,0.28)'), [])
  const ringTex = useMemo(() => makeRingTexture('rgba(255,255,255,1)'), [])
  const circleGeo = useMemo(() => makeCircleGeo(), [])

  // build the detail payload for a clicked asset, from the current play
  const handleSelect = (i) => {
    const play = PLAYS[playIndex] || PLAYS[0]
    const slot = ROSTER[i]
    const links = play.links.filter(([a, b]) => a === i || b === i).length
    onSelect && onSelect({
      index: i,
      id: slot.id,
      domain: TYPE_DOMAIN[slot.type],
      cls: TYPE_CLASS[slot.type],
      status: play.active[i] ? 'ACTIVE' : 'STANDBY',
      links,
    })
  }
  // live shared state the markers + links read from
  const targetsRef = useRef({
    positions: ROSTER.map(() => new THREE.Vector3()),
    active: ROSTER.map(() => true),
    links: PLAYS[0].links,
  })
  const markerTargets = useRef(ROSTER.map(() => ({ x: 0, y: 0, z: 0, active: true })))

  // when the play changes, set per-marker targets
  useEffect(() => {
    const play = PLAYS[playIndex] || PLAYS[0]
    play.xz.forEach(([x, z], i) => {
      const y = TYPE_HEIGHT[ROSTER[i].type]
      markerTargets.current[i] = { x, y, z, active: play.active[i] }
    })
    targetsRef.current.links = play.links
    targetsRef.current.active = play.active
  }, [playIndex])

  const groupRef = useRef()
  useFrame((_, delta) => {
    if (groupRef.current && !still) groupRef.current.rotation.y += delta * 0.025
    // mirror live marker positions into targetsRef for the links
    markerTargets.current.forEach((t, i) => {
      targetsRef.current.positions[i].set(t.x, t.y, t.z)
    })
  })

  return (
    <group position={[1.3, 0, 0]}>
      <StarField />
      <TopoFloor />
      <group ref={groupRef} position={[0, 0.1, 0]}>
        <Links targetsRef={targetsRef} dotTex={dotTex} />
        {ROSTER.map((slot, i) => (
          <Marker
            key={slot.id}
            slot={slot}
            index={i}
            dotTex={dotTex}
            ringTex={ringTex}
            circleGeo={circleGeo}
            targetRef={{ get current() { return markerTargets.current[i] } }}
            selected={selectedIndex === i}
            onSelect={handleSelect}
          />
        ))}
      </group>
    </group>
  )
}

export default function PlaybookScene({ playIndex = 0, selectedIndex = null, onSelect, onDeselect }) {
  const wrapRef = useRef()
  const [visible, setVisible] = useState(true)
  const still = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.02 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        camera={{ position: [4.0, 1.9, 5.6], fov: 44 }}
        onCreated={({ camera }) => camera.lookAt(0, 0.1, 0)}
        onPointerMissed={() => onDeselect && onDeselect()}
      >
        <color attach="background" args={[BG]} />
        <ambientLight intensity={0.8} />
        <Scene playIndex={playIndex} still={still} selectedIndex={selectedIndex} onSelect={onSelect} />
      </Canvas>
    </div>
  )
}
