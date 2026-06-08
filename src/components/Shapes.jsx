// ─── New decorative shapes ─────────────────────────────────────────────────────

// Scalloped circle — n bumps around a core (cookie / sunny style)
export function ShapeCookie({ color = '#C55070', n = 8, size = 140 }) {
  const c = size / 2
  const dist = size * 0.30   // distance from center to each scallop's center
  const scR  = size * 0.23   // scallop circle radius
  const core = size * 0.25   // core fill radius (overlaps scallops → no gaps)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} overflow="visible">
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2
        return <circle key={i} cx={c + Math.cos(a) * dist} cy={c + Math.sin(a) * dist} r={scR} fill={color} />
      })}
      <circle cx={c} cy={c} r={core} fill={color} />
    </svg>
  )
}

// Flower — elliptical petals radiating from center
export function ShapeFlowerPetal({ color = '#9A7008', petals = 8, size = 130 }) {
  const c = size / 2
  const pDist = size * 0.27   // petal center distance from origin
  const pRx   = size * 0.12   // petal half-width
  const pRy   = size * 0.23   // petal half-length
  const core  = size * 0.13
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} overflow="visible">
      {Array.from({ length: petals }, (_, i) => {
        const a   = (i / petals) * Math.PI * 2
        const deg = (a * 180) / Math.PI
        const px  = c + Math.cos(a) * pDist
        const py  = c + Math.sin(a) * pDist
        return <ellipse key={i} cx={px} cy={py} rx={pRx} ry={pRy} transform={`rotate(${deg},${px},${py})`} fill={color} />
      })}
      <circle cx={c} cy={c} r={core} fill={color} />
    </svg>
  )
}

// Cloud / puffy — overlapping circles forming an organic blob
export function ShapeCloud({ color = '#B08040', size = 180 }) {
  const h = size * 0.60
  return (
    <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`} overflow="visible">
      <circle cx={size*0.16} cy={h*0.64} r={size*0.16} fill={color} />
      <circle cx={size*0.33} cy={h*0.44} r={size*0.20} fill={color} />
      <circle cx={size*0.50} cy={h*0.36} r={size*0.22} fill={color} />
      <circle cx={size*0.67} cy={h*0.44} r={size*0.20} fill={color} />
      <circle cx={size*0.84} cy={h*0.64} r={size*0.16} fill={color} />
      <rect x={size*0.15} y={h*0.50} width={size*0.70} height={h*0.44} rx={size*0.07} fill={color} />
    </svg>
  )
}

// ─── Original shapes ───────────────────────────────────────────────────────────
// Redesigned shapes — inspired by layered geometric compositions

// 1. Concentric quarter-circle arch (rainbow stripes from bottom-left corner)
export function ShapeArch() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220">
      <circle cx="0" cy="220" r="200" fill="#F5F0E8" />
      <circle cx="0" cy="220" r="155" fill="#E8C547" />
      <circle cx="0" cy="220" r="110" fill="#7BBF7A" />
      <circle cx="0" cy="220" r="65" fill="#E8A0B0" />
      <circle cx="0" cy="220" r="22" fill="#F5F0E8" />
    </svg>
  )
}

// 2. Diamond + circle overlap (layered geometric composition)
export function ShapeFlower({ color = '#7B9EC7' }) {
  return (
    <svg width="190" height="160" viewBox="0 0 190 160" fill="none">
      <rect
        x="20" y="30"
        width="90" height="90"
        rx="6"
        transform="rotate(45 65 75)"
        fill="#7BBF7A"
      />
      <circle cx="128" cy="80" r="52" fill={color} />
    </svg>
  )
}

// 3. Dumbbell — two circles connected by a bar
export function ShapeRing({ color = '#E8C547' }) {
  return (
    <svg width="200" height="110" viewBox="0 0 200 110" fill="none">
      <circle cx="32" cy="55" r="38" fill={color} />
      <rect x="32" y="34" width="136" height="42" fill={color} />
      <circle cx="168" cy="55" r="38" fill={color} />
    </svg>
  )
}

// 4. Checkerboard grid
export function ShapeOvals({ color = '#7BBF7A' }) {
  const size = 156
  const cell = size / 4
  const squares = []
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if ((r + c) % 2 === 0) {
        squares.push(
          <rect
            key={`${r}-${c}`}
            x={c * cell}
            y={r * cell}
            width={cell}
            height={cell}
            fill={color}
          />
        )
      }
    }
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {squares}
    </svg>
  )
}

// 5. Four-leaf clover with center accent square
export function ShapeEyes({ color = '#F5F0E8' }) {
  const r = 44
  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      <circle cx="54" cy="54" r={r} fill={color} />
      <circle cx="106" cy="54" r={r} fill={color} />
      <circle cx="54" cy="106" r={r} fill={color} />
      <circle cx="106" cy="106" r={r} fill={color} />
      <rect x="40" y="40" width="80" height="80" fill={color} />
      <rect x="54" y="54" width="52" height="52" rx="6" fill="#E8C547" />
    </svg>
  )
}

// 6. Scalloped / sunflower circle
export function ShapeStep({ color = '#E8A0B0' }) {
  const n = 10
  const outerR = 62
  const scR = 24
  const cx = 80
  const cy = 80

  const scallops = Array.from({ length: n }, (_, i) => {
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2
    const x = cx + Math.cos(angle) * outerR
    const y = cy + Math.sin(angle) * outerR
    return <circle key={i} cx={x} cy={y} r={scR} fill={color} />
  })

  return (
    <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
      {scallops}
      <circle cx={cx} cy={cy} r="46" fill={color} />
    </svg>
  )
}
