import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer, RoundedBox, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

/*
  HeroGem — matte "clay" mobile device orbited by recognizable UI components.
  • Large: a soft matte phone (body + screen with a UI hint), gently oscillating.
  • Orbiters: flat UI controls (toggle, button, checkbox, card) on inclined
    orbits that stay facing the viewer so they read clearly.
  • Warm desaturated palette + a soft contact shadow for grounding.
*/

const BLUE   = '#5b73b3'   // dusty clay blue
const BLUE_B = '#4f679f'   // phone body
const SCREEN = '#34466f'   // muted navy panel
const LIGHT  = '#f1ece2'   // warm off-white
const GREEN  = '#6fae8f'   // muted clay green
const SLATE  = '#b7bed4'

const clay = { roughness: 0.85, metalness: 0, envMapIntensity: 0.5 }

/* ── UI component icons (flat, recognizable) ─────────────────────────── */
function ToggleIcon() {
  return (
    <group>
      <RoundedBox args={[1.4, 0.64, 0.18]} radius={0.32} smoothness={6}>
        <meshStandardMaterial color={LIGHT} {...clay} />
      </RoundedBox>
      <mesh position={[0.36, 0, 0.13]}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color={GREEN} {...clay} />
      </mesh>
    </group>
  )
}

function ButtonIcon() {
  return (
    <group>
      <RoundedBox args={[1.5, 0.64, 0.18]} radius={0.32} smoothness={6}>
        <meshStandardMaterial color={BLUE} {...clay} />
      </RoundedBox>
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[0.72, 0.12, 0.03]} />
        <meshStandardMaterial color={LIGHT} roughness={0.8} metalness={0} />
      </mesh>
    </group>
  )
}

function CheckIcon() {
  return (
    <group>
      <RoundedBox args={[0.74, 0.74, 0.18]} radius={0.17} smoothness={6}>
        <meshStandardMaterial color={GREEN} {...clay} />
      </RoundedBox>
      <mesh position={[-0.13, -0.08, 0.12]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.18, 0.08, 0.05]} />
        <meshStandardMaterial color={LIGHT} roughness={0.8} />
      </mesh>
      <mesh position={[0.08, 0.05, 0.12]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[0.4, 0.08, 0.05]} />
        <meshStandardMaterial color={LIGHT} roughness={0.8} />
      </mesh>
    </group>
  )
}

function CardIcon() {
  return (
    <group>
      <RoundedBox args={[1.5, 1.1, 0.16]} radius={0.12} smoothness={6}>
        <meshStandardMaterial color={LIGHT} {...clay} />
      </RoundedBox>
      <RoundedBox args={[1.28, 0.52, 0.05]} radius={0.07} smoothness={4} position={[0, 0.24, 0.09]}>
        <meshStandardMaterial color={BLUE} roughness={0.8} />
      </RoundedBox>
      <mesh position={[-0.26, -0.18, 0.09]}>
        <boxGeometry args={[0.78, 0.11, 0.02]} />
        <meshStandardMaterial color={SLATE} roughness={0.85} />
      </mesh>
      <mesh position={[-0.41, -0.37, 0.09]}>
        <boxGeometry args={[0.48, 0.11, 0.02]} />
        <meshStandardMaterial color="#cdd2e2" roughness={0.85} />
      </mesh>
    </group>
  )
}

/* ── Orbiting wrapper (inclined path, stays facing the viewer) ───────── */
function OrbitingItem({ children, radius, speed, phase = 0, tilt = [0, 0, 0], squash = 0.7, scale = 0.95 }) {
  const item = useRef()
  const euler = useMemo(() => new THREE.Euler(tilt[0], tilt[1], tilt[2]), [tilt])
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase
    if (!item.current) return
    v.set(Math.cos(t) * radius, 0, Math.sin(t) * radius * squash).applyEuler(euler)
    item.current.position.copy(v)
    item.current.rotation.x = Math.sin(t * 0.9) * 0.1
    item.current.rotation.y = Math.sin(t * 0.7) * 0.14
  })
  return <group ref={item} scale={scale}>{children}</group>
}

/* ── Phone ───────────────────────────────────────────────────────────── */
function Device() {
  const ref = useRef()
  useFrame((state) => {
    if (!ref.current) return
    const t = state.clock.elapsedTime
    ref.current.rotation.y = Math.sin(t * 0.35) * 0.6
    ref.current.rotation.x = 0.08 + Math.sin(t * 0.5) * 0.08
    ref.current.position.y = Math.sin(t * 0.5) * 0.1
  })
  return (
    <group ref={ref} rotation={[0.1, 0.3, 0]} scale={1.22}>
      <RoundedBox args={[1.95, 3.9, 0.3]} radius={0.28} smoothness={8} creaseAngle={0.5}>
        <meshStandardMaterial color={BLUE_B} {...clay} />
      </RoundedBox>
      <RoundedBox args={[1.7, 3.6, 0.06]} radius={0.2} smoothness={8} position={[0, 0, 0.14]}>
        <meshStandardMaterial color={SCREEN} roughness={0.75} metalness={0} envMapIntensity={0.4} />
      </RoundedBox>
      {/* on-screen UI hint */}
      <mesh position={[0, 1.45, 0.18]}>
        <boxGeometry args={[0.55, 0.09, 0.01]} />
        <meshStandardMaterial color="#5a6a9c" roughness={0.85} />
      </mesh>
      <RoundedBox args={[1.35, 1.0, 0.05]} radius={0.1} smoothness={4} position={[0, 0.4, 0.18]}>
        <meshStandardMaterial color="#3a4c7d" roughness={0.8} />
      </RoundedBox>
      <mesh position={[-0.3, 0.55, 0.22]}>
        <boxGeometry args={[0.5, 0.4, 0.01]} />
        <meshStandardMaterial color={BLUE} roughness={0.8} />
      </mesh>
      <mesh position={[0.35, 0.62, 0.22]}>
        <boxGeometry args={[0.45, 0.09, 0.01]} />
        <meshStandardMaterial color="#7d8ab5" roughness={0.85} />
      </mesh>
      <mesh position={[0.28, 0.45, 0.22]}>
        <boxGeometry args={[0.3, 0.07, 0.01]} />
        <meshStandardMaterial color="#5a6a9c" roughness={0.85} />
      </mesh>
      <RoundedBox args={[1.3, 0.45, 0.07]} radius={0.22} smoothness={4} position={[0, -1.1, 0.19]}>
        <meshStandardMaterial color={BLUE} {...clay} />
      </RoundedBox>
    </group>
  )
}

export default function HeroGem() {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 7.6], fov: 42 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.85} />
        <hemisphereLight args={['#ffffff', '#e7ddcb', 0.7]} />
        <directionalLight position={[4, 6, 5]} intensity={1.5} />
        <directionalLight position={[-5, 2, 3]} intensity={0.5} color="#cdd9ff" />
        <Environment resolution={128} environmentIntensity={0.5}>
          <Lightformer form="rect" intensity={2} position={[-3, 3, 2]} scale={[5, 5, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={1.5} position={[3, -2, 3]} scale={[4, 4, 1]} color="#fff3e6" />
        </Environment>

        <Device />

        <OrbitingItem radius={2.7} speed={0.5}  phase={0}   tilt={[0.5, 0, 0.2]}   squash={0.7}>
          <ToggleIcon />
        </OrbitingItem>
        <OrbitingItem radius={3.1} speed={0.4}  phase={2.1} tilt={[-0.45, 0, 0.35]} squash={0.6}>
          <ButtonIcon />
        </OrbitingItem>
        <OrbitingItem radius={2.5} speed={0.62} phase={4.0} tilt={[0.35, 0, -0.4]}  squash={0.78}>
          <CheckIcon />
        </OrbitingItem>
        <OrbitingItem radius={3.3} speed={0.34} phase={1.0} tilt={[0.6, 0, 0.1]}    squash={0.62}>
          <CardIcon />
        </OrbitingItem>

        <ContactShadows position={[0, -3, 0]} scale={10} blur={2.8} far={4.5} opacity={0.32} color="#6b5a44" resolution={512} />
      </Canvas>
    </div>
  )
}
