import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'

function Ribbon() {
  const meshRef = useRef()

  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2, 3, 0),
      new THREE.Vector3(1, 1.8, 1.5),
      new THREE.Vector3(-0.5, 0, -1),
      new THREE.Vector3(1.5, -1.8, 1),
      new THREE.Vector3(-1, -3.2, -0.5),
    ])

    const segments = 200
    const frames = curve.computeFrenetFrames(segments, false)
    const points = curve.getSpacedPoints(segments)
    const width = 1.8

    const positions = []
    const indices = []
    const uvs = []

    for (let i = 0; i <= segments; i++) {
      const normal = frames.normals[i]
      const binormal = frames.binormals[i]
      const point = points[i]

      const twist = (i / segments) * Math.PI * 1.2
      const cos = Math.cos(twist)
      const sin = Math.sin(twist)

      const nx = normal.x * cos + binormal.x * sin
      const ny = normal.y * cos + binormal.y * sin
      const nz = normal.z * cos + binormal.z * sin

      const hw = width * 0.5
      positions.push(
        point.x + nx * hw, point.y + ny * hw, point.z + nz * hw,
        point.x - nx * hw, point.y - ny * hw, point.z - nz * hw
      )

      const t = i / segments
      uvs.push(t, 0, t, 1)

      if (i < segments) {
        const a = i * 2
        const b = i * 2 + 1
        const c = (i + 1) * 2
        const d = (i + 1) * 2 + 1
        indices.push(a, b, c, b, d, c)
      }
    }

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2))
    geo.setIndex(indices)
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime
      meshRef.current.rotation.y = t * 0.08
      meshRef.current.rotation.x = Math.sin(t * 0.05) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} position={[1.5, 0, 0]}>
      <meshPhysicalMaterial
        color="#2B59C3"
        metalness={0.95}
        roughness={0.08}
        clearcoat={1}
        clearcoatRoughness={0.05}
        envMapIntensity={2}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.8} />
      <directionalLight position={[-3, -2, 3]} intensity={0.5} color="#7BA4FF" />
      <Environment preset="city" />
      <Ribbon />
    </Canvas>
  )
}
