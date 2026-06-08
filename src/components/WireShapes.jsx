// Wireframe geometric shapes — stroke only, no fill.
// Inspired by precision scientific illustration + editorial geometry.

// ─── 1. Starburst ─────────────────────────────────────────────────────────────
// Thin radiating lines from a small center ring — like a diffraction pattern
export function WireStarburst({ color = '#7B9EC7', size = 140, spokes = 24 }) {
  const lines = Array.from({ length: spokes }, (_, i) => {
    const angle  = (i / spokes) * Math.PI * 2
    const innerR = 9
    const outerR = 46
    return (
      <line
        key={i}
        x1={(50 + Math.cos(angle) * innerR).toFixed(3)}
        y1={(50 + Math.sin(angle) * innerR).toFixed(3)}
        x2={(50 + Math.cos(angle) * outerR).toFixed(3)}
        y2={(50 + Math.sin(angle) * outerR).toFixed(3)}
        stroke={color}
        strokeWidth="0.75"
      />
    )
  })
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {lines}
      <circle cx="50" cy="50" r="7.5" stroke={color} strokeWidth="0.75" />
      <circle cx="50" cy="50" r="2"   fill={color} />
    </svg>
  )
}

// ─── 2. Nested Hexagons ───────────────────────────────────────────────────────
// Concentric hexagon outlines — like IB's center shape
export function WireHexagons({ color = '#E8C547', size = 150, rings = 5 }) {
  const hexes = Array.from({ length: rings }, (_, i) => {
    const r   = 9 + (i + 1) * 8
    const pts = Array.from({ length: 6 }, (_, j) => {
      const a = (j / 6) * Math.PI * 2 - Math.PI / 2
      return `${(50 + Math.cos(a) * r).toFixed(2)},${(50 + Math.sin(a) * r).toFixed(2)}`
    }).join(' ')
    return (
      <polygon
        key={i}
        points={pts}
        stroke={color}
        strokeWidth={0.8 - i * 0.05}
        fill="none"
      />
    )
  })
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {hexes}
    </svg>
  )
}

// ─── 3. Nested Diamonds ───────────────────────────────────────────────────────
// Four concentric diamond (rotated square) outlines with dashed center axes
export function WireDiamond({ color = '#E8A0B0', size = 180 }) {
  const rings = [
    [50, 4,  96, 50, 50, 96,  4, 50],
    [50, 15, 85, 50, 50, 85, 15, 50],
    [50, 26, 74, 50, 50, 74, 26, 50],
    [50, 37, 63, 50, 50, 63, 37, 50],
  ]
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {rings.map(([x1, y1, x2, y2, x3, y3, x4, y4], i) => (
        <polygon
          key={i}
          points={`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`}
          stroke={color}
          strokeWidth={0.85 - i * 0.1}
          fill="none"
        />
      ))}
      <line x1="4"  y1="50" x2="96" y2="50" stroke={color} strokeWidth="0.35" strokeDasharray="2.5 3" />
      <line x1="50" y1="4"  x2="50" y2="96" stroke={color} strokeWidth="0.35" strokeDasharray="2.5 3" />
    </svg>
  )
}

// ─── 4. Concentric Circles + Crosshair ───────────────────────────────────────
// Targeting reticle — precise, scientific
export function WireCircles({ color = '#7BBF7A', size = 130, rings = 4 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {Array.from({ length: rings }, (_, i) => (
        <circle
          key={i}
          cx="50" cy="50"
          r={11 + i * 10}
          stroke={color}
          strokeWidth={0.75 - i * 0.05}
        />
      ))}
      {/* Crosshair — 4 segments with gap at center */}
      <line x1="50" y1="5"  x2="50" y2="42" stroke={color} strokeWidth="0.4" strokeDasharray="2 3" />
      <line x1="50" y1="58" x2="50" y2="95" stroke={color} strokeWidth="0.4" strokeDasharray="2 3" />
      <line x1="5"  y1="50" x2="42" y2="50" stroke={color} strokeWidth="0.4" strokeDasharray="2 3" />
      <line x1="58" y1="50" x2="95" y2="50" stroke={color} strokeWidth="0.4" strokeDasharray="2 3" />
      <circle cx="50" cy="50" r="1.5" fill={color} />
    </svg>
  )
}

// ─── 5. Wire Grid ─────────────────────────────────────────────────────────────
// Evenly-spaced crossing lines — like graph paper or a coordinate system
export function WireGrid({ color = '#F5F0E8', size = 110, cells = 5 }) {
  const lines = []
  for (let i = 0; i <= cells; i++) {
    const t = 5 + (i / cells) * 90
    lines.push(
      <line key={`h${i}`} x1="5" y1={t} x2="95" y2={t} stroke={color} strokeWidth="0.5" />,
      <line key={`v${i}`} x1={t} y1="5" x2={t} y2="95" stroke={color} strokeWidth="0.5" />,
    )
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      {lines}
    </svg>
  )
}

// ─── 6. Crystal Prism ─────────────────────────────────────────────────────────
// A diamond with interior horizontal cross-sections — like IB's rightmost shape
// Gives the illusion of a 3D faceted gem
export function WirePrism({ color = '#7B9EC7', size = 160 }) {
  // Diamond outline
  const cx = 50, hs = 44 // half-size
  const yLevels = [4, 16, 28, 40, 50, 60, 72, 84, 96]

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <polygon
        points={`${cx},4 ${cx + hs},${cx} ${cx},96 ${cx - hs},${cx}`}
        stroke={color}
        strokeWidth="0.8"
        fill="none"
      />
      {/* Interior horizontal slices — width follows diamond shape */}
      {yLevels.map((y) => {
        const dy = Math.abs(y - cx)
        const hw = hs * (1 - dy / hs)
        if (hw < 1) return null
        return (
          <line
            key={y}
            x1={(cx - hw).toFixed(2)} y1={y}
            x2={(cx + hw).toFixed(2)} y2={y}
            stroke={color}
            strokeWidth="0.45"
          />
        )
      })}
      {/* Left and right edge diagonals for facet feel */}
      <line x1={cx - hs} y1={cx} x2={cx}      y2={4}  stroke={color} strokeWidth="0.4" strokeDasharray="2 3" />
      <line x1={cx + hs} y1={cx} x2={cx}      y2={4}  stroke={color} strokeWidth="0.4" strokeDasharray="2 3" />
      <line x1={cx - hs} y1={cx} x2={cx}      y2={96} stroke={color} strokeWidth="0.4" strokeDasharray="2 3" />
      <line x1={cx + hs} y1={cx} x2={cx}      y2={96} stroke={color} strokeWidth="0.4" strokeDasharray="2 3" />
    </svg>
  )
}
