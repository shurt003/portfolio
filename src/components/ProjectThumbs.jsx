// Abstract SVG illustrations for each project card thumbnail.
// Each is a mini geometric composition in the project's accent color —
// same visual language as the hero grid cells (circles, rectangles, diamonds).

function DashboardThumb({ accent }) {
  return (
    <svg viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Vertical bars — bar chart abstraction */}
      <rect x="52"  y="130" width="40" height="72" rx="6" fill={accent} opacity="0.38" />
      <rect x="106" y="90"  width="40" height="112" rx="6" fill={accent} opacity="0.65" />
      <rect x="160" y="108" width="40" height="94"  rx="6" fill={accent} opacity="0.48" />
      <rect x="214" y="62"  width="40" height="140" rx="6" fill={accent} />
      {/* Baseline rule */}
      <rect x="38" y="204" width="232" height="2" rx="1" fill={accent} opacity="0.2" />
      {/* Donut arc in top-right corner */}
      <circle cx="314" cy="64" r="54" stroke={accent} strokeWidth="16" opacity="0.15" />
      <circle cx="314" cy="64" r="54" stroke={accent} strokeWidth="16" strokeDasharray="140 200" opacity="0.6" />
      <circle cx="314" cy="64" r="54" stroke={accent} strokeWidth="16" strokeDasharray="40 300" strokeDashoffset="-145" opacity="0.35" />
    </svg>
  )
}

function MessagingThumb({ accent }) {
  return (
    <svg viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Primary bubble */}
      <rect x="28" y="32" width="212" height="82" rx="24" fill={accent} opacity="0.88" />
      {/* Tail */}
      <path d="M 52 114 L 34 142 L 80 114 Z" fill={accent} opacity="0.88" />
      {/* Text line hints */}
      <rect x="52" y="59" width="110" height="8" rx="4" fill="white" opacity="0.5" />
      <rect x="52" y="78" width="76" height="8"  rx="4" fill="white" opacity="0.32" />
      {/* Reply bubble — offset right */}
      <rect x="120" y="148" width="212" height="54" rx="20" fill={accent} opacity="0.34" />
      <rect x="144" y="167" width="94"  height="7" rx="3.5" fill={accent} opacity="0.62" />
      <rect x="144" y="183" width="58"  height="7" rx="3.5" fill={accent} opacity="0.4" />
    </svg>
  )
}


function MagicSignalThumb({ accent }) {
  return (
    <svg viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Dark background panel — echoes the app's dark UI */}
      <rect x="18" y="14" width="324" height="196" rx="14" fill={accent} opacity="0.07" />
      <rect x="18" y="14" width="324" height="196" rx="14" stroke={accent} strokeWidth="1.5" opacity="0.2" />
      {/* Candlestick chart — 7 candles */}
      {/* Candle wicks */}
      <line x1="62"  y1="52"  x2="62"  y2="168" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      <line x1="102" y1="68"  x2="102" y2="156" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      <line x1="142" y1="44"  x2="142" y2="140" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      <line x1="182" y1="72"  x2="182" y2="162" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      <line x1="222" y1="38"  x2="222" y2="118" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      <line x1="262" y1="54"  x2="262" y2="130" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      <line x1="302" y1="42"  x2="302" y2="108" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      {/* Candle bodies — alternating up/down, trending upward */}
      <rect x="54"  y="118" width="16" height="38" rx="2" fill={accent} opacity="0.35" />
      <rect x="94"  y="88"  width="16" height="46" rx="2" fill={accent} opacity="0.55" />
      <rect x="134" y="94"  width="16" height="30" rx="2" fill={accent} opacity="0.35" />
      <rect x="174" y="98"  width="16" height="44" rx="2" fill={accent} opacity="0.55" />
      <rect x="214" y="62"  width="16" height="36" rx="2" fill={accent} opacity="0.35" />
      <rect x="254" y="70"  width="16" height="36" rx="2" fill={accent} opacity="0.75" />
      <rect x="294" y="52"  width="16" height="36" rx="2" fill={accent} />
      {/* Signal pulse line over chart */}
      <path
        d="M 38 148 L 72 148 L 82 112 L 92 148 L 122 148 L 132 88 L 142 148 L 172 148 L 192 72 L 202 148 L 242 148 L 252 58 L 262 148 L 322 148"
        stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.45"
      />
      {/* Signal badge — top right */}
      <circle cx="300" cy="46" r="24" fill={accent} opacity="0.15" />
      <circle cx="300" cy="46" r="24" stroke={accent} strokeWidth="1.5" opacity="0.4" />
      {/* Lightning bolt / signal icon */}
      <path d="M 304 34 L 296 48 L 302 48 L 298 58 L 308 44 L 302 44 Z" fill={accent} opacity="0.9" />
    </svg>
  )
}

function DesignSystemThumb({ accent }) {
  return (
    <svg viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Grid of mini component tiles */}
      {/* Row 1 */}
      <rect x="22" y="22" width="96" height="60" rx="8" fill={accent} opacity="0.12" />
      <rect x="22" y="22" width="96" height="60" rx="8" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      <rect x="30" y="34" width="56" height="7" rx="3.5" fill={accent} opacity="0.55" />
      <rect x="30" y="46" width="80" height="6" rx="3" fill={accent} opacity="0.28" />
      <rect x="30" y="58" width="66" height="6" rx="3" fill={accent} opacity="0.2" />

      <rect x="130" y="22" width="100" height="60" rx="8" fill="#E8C547" opacity="0.12" />
      <rect x="130" y="22" width="100" height="60" rx="8" stroke="#E8C547" strokeWidth="1.5" opacity="0.3" />
      <rect x="140" y="36" width="80" height="20" rx="10" fill="#E8C547" opacity="0.62" />
      <rect x="160" y="41" width="40" height="9" rx="4.5" fill="white" opacity="0.7" />

      <rect x="242" y="22" width="96" height="60" rx="8" fill="#7BBF7A" opacity="0.12" />
      <rect x="242" y="22" width="96" height="60" rx="8" stroke="#7BBF7A" strokeWidth="1.5" opacity="0.3" />
      <rect x="252" y="32" width="76" height="14" rx="3" fill="#7BBF7A" opacity="0.28" />
      {[46,56,66].map((y,i) => (
        <g key={i}><rect x="252" y={y} width="76" height="1" rx="0.5" fill="#7BBF7A" opacity="0.18" />
        <rect x="258" y={y+3} width={[44,36,40][i]} height="5" rx="2.5" fill="#7BBF7A" opacity="0.3" /></g>
      ))}

      {/* Row 2 */}
      <rect x="22" y="96" width="96" height="60" rx="8" fill="#E8A0B0" opacity="0.12" />
      <rect x="22" y="96" width="96" height="60" rx="8" stroke="#E8A0B0" strokeWidth="1.5" opacity="0.3" />
      <rect x="22" y="96" width="3.5" height="60" rx="1.75" fill="#E8A0B0" opacity="0.75" />
      <circle cx="42" cy="126" r="9" fill="#E8A0B0" opacity="0.28" />
      <rect x="56" y="120" width="50" height="7" rx="3.5" fill="#E8A0B0" opacity="0.5" />
      <rect x="56" y="132" width="36" height="6" rx="3" fill="#E8A0B0" opacity="0.25" />

      <rect x="130" y="96" width="100" height="60" rx="8" fill={accent} opacity="0.12" />
      <rect x="130" y="96" width="100" height="60" rx="8" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      <rect x="142" y="112" width="76" height="10" rx="5" fill={accent} opacity="0.18" />
      <rect x="142" y="112" width="50" height="10" rx="5" fill={accent} opacity="0.68" />
      <rect x="142" y="130" width="76" height="10" rx="5" fill={accent} opacity="0.14" />
      <rect x="142" y="130" width="28" height="10" rx="5" fill={accent} opacity="0.48" />

      <rect x="242" y="96" width="96" height="60" rx="8" fill="#E8C547" opacity="0.1" />
      <rect x="242" y="96" width="96" height="60" rx="8" stroke="#E8C547" strokeWidth="1.5" opacity="0.25" />
      <rect x="252" y="108" width="76" height="9" rx="4.5" fill="#E8C547" opacity="0.55" />
      <rect x="252" y="122" width="76" height="9" rx="4.5" fill="#E8C547" opacity="0.2" />
      <rect x="252" y="136" width="76" height="9" rx="4.5" fill="#E8C547" opacity="0.2" />

      {/* Row 3 partial */}
      <rect x="22" y="170" width="316" height="34" rx="8" fill={accent} opacity="0.07" />
      <rect x="22" y="170" width="316" height="34" rx="8" stroke={accent} strokeWidth="1" opacity="0.18" />
      <rect x="34" y="181" width="44" height="12" rx="6" fill={accent} opacity="0.55" />
      <rect x="88" y="183" width="30" height="8" rx="4" fill={accent} opacity="0.25" />
      <rect x="128" y="183" width="36" height="8" rx="4" fill={accent} opacity="0.25" />
      <rect x="174" y="183" width="28" height="8" rx="4" fill={accent} opacity="0.18" />
    </svg>
  )
}

function ClaudeCodeThumb({ accent }) {
  return (
    <svg viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Left bubble — designer side */}
      <rect x="18" y="28" width="148" height="90" rx="16" fill={accent} opacity="0.12" />
      <rect x="18" y="28" width="148" height="90" rx="16" stroke={accent} strokeWidth="1.5" opacity="0.35" />
      {/* Design elements inside left bubble */}
      <circle cx="54" cy="58" r="14" fill={accent} opacity="0.55" />
      <rect x="76" y="46" width="68" height="10" rx="5" fill={accent} opacity="0.35" />
      <rect x="76" y="62" width="50" height="10" rx="5" fill={accent} opacity="0.22" />
      <rect x="32" y="88" width="116" height="8" rx="4" fill={accent} opacity="0.18" />
      {/* Bubble tail */}
      <path d="M 34 118 L 22 136 L 58 118 Z" fill={accent} opacity="0.12" />
      <path d="M 34 118 L 22 136 L 58 118" stroke={accent} strokeWidth="1.5" opacity="0.35" fill="none" />

      {/* Right bubble — AI/code side */}
      <rect x="194" y="100" width="148" height="90" rx="16" fill={accent} opacity="0.08" />
      <rect x="194" y="100" width="148" height="90" rx="16" stroke={accent} strokeWidth="1.5" opacity="0.28" />
      {/* Code lines inside right bubble */}
      <rect x="210" y="116" width="88" height="7" rx="3.5" fill={accent} opacity="0.45" />
      <rect x="210" y="130" width="60" height="7" rx="3.5" fill={accent} opacity="0.28" />
      <rect x="220" y="144" width="72" height="7" rx="3.5" fill={accent} opacity="0.35" />
      <rect x="220" y="158" width="44" height="7" rx="3.5" fill={accent} opacity="0.22" />
      <rect x="210" y="172" width="100" height="7" rx="3.5" fill={accent} opacity="0.3" />
      {/* Bubble tail */}
      <path d="M 326 190 L 338 208 L 302 190 Z" fill={accent} opacity="0.08" />
      <path d="M 326 190 L 338 208 L 302 190" stroke={accent} strokeWidth="1.5" opacity="0.28" fill="none" />

      {/* Connecting arrows between bubbles */}
      <path d="M 172 72 Q 215 72 215 100" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" fill="none" markerEnd="url(#arrow)" />
      <path d="M 194 145 Q 172 145 172 118" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.25" fill="none" />
      {/* Arrow heads */}
      <path d="M 210 96 L 215 100 L 210 104" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" fill="none" />
      <path d="M 176 122 L 172 118 L 168 122" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" fill="none" />
    </svg>
  )
}

function ValidationDiagram() {
  const LX = 16, LW = 153, RX = 187, RW = 157, FH = 16
  const leftFields  = [44, 64, 84, 104, 124, 144]
  const leftErrors  = new Set([64, 104, 144])
  const rightFields = [22, 42, 68, 88, 114, 134]
  const rightErrors = new Set([42, 88])

  return (
    <svg viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width="360" height="220" fill="rgba(8,12,24,0.94)"/>

      {/* Labels */}
      <text x={LX} y="14" fill="rgba(255,255,255,0.6)" fontSize="7.5" fontWeight="700" letterSpacing="0.8" fontFamily="system-ui,sans-serif">TOP OF FORM</text>
      <text x={RX} y="14" fill="rgba(255,255,255,0.6)" fontSize="7.5" fontWeight="700" letterSpacing="0.8" fontFamily="system-ui,sans-serif">INLINE</text>

      {/* Vertical divider */}
      <line x1="176" y1="8" x2="176" y2="196" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>

      {/* Left error banner */}
      <rect x={LX} y="22" width={LW} height="15" rx="2.5" fill="rgba(180,40,40,0.13)" stroke="rgba(180,40,40,0.28)" strokeWidth="1"/>
      <rect x={LX+6} y="26.5" width="78" height="3" rx="1.5" fill="rgba(180,40,40,0.6)"/>
      <rect x={LX+6} y="31.5" width="54" height="3" rx="1.5" fill="rgba(180,40,40,0.38)"/>

      {/* Left fields */}
      {leftFields.map(y => (
        <rect key={y} x={LX} y={y} width={LW} height={FH} rx="2.5"
          fill={leftErrors.has(y) ? 'rgba(180,40,40,0.08)' : 'rgba(255,255,255,0.04)'}
          stroke={leftErrors.has(y) ? 'rgba(180,40,40,0.75)' : 'rgba(255,255,255,0.18)'}
          strokeWidth="1.5"
        />
      ))}

      {/* Right fields + inline error bars */}
      {rightFields.map(y => (
        <g key={y}>
          <rect x={RX} y={y} width={RW} height={FH} rx="2.5"
            fill={rightErrors.has(y) ? 'rgba(180,40,40,0.08)' : 'rgba(255,255,255,0.04)'}
            stroke={rightErrors.has(y) ? 'rgba(180,40,40,0.75)' : 'rgba(255,255,255,0.18)'}
            strokeWidth="1.5"
          />
          {rightErrors.has(y) && <rect x={RX} y={y + FH + 3} width="84" height="3.5" rx="1.5" fill="rgba(180,40,40,0.55)"/>}
        </g>
      ))}

      {/* Horizontal rules */}
      <line x1={LX} y1="168" x2="172" y2="168" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>
      <line x1={RX} y1="168" x2="346" y2="168" stroke="rgba(255,255,255,0.08)" strokeWidth="1"/>

      {/* Left ✕ icons + labels — fully inlined, no sub-components */}
      <circle cx="23" cy="180" r="6.5" fill="rgba(180,40,40,0.22)" stroke="rgba(180,40,40,0.65)" strokeWidth="1.2"/>
      <line x1="20" y1="177" x2="26" y2="183" stroke="rgba(180,40,40,0.85)" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="26" y1="177" x2="20" y2="183" stroke="rgba(180,40,40,0.85)" strokeWidth="1.3" strokeLinecap="round"/>
      <text x="34" y="184" fill="rgba(255,255,255,0.8)" fontSize="8.5" fontFamily="system-ui,sans-serif">Longer time to correct errors</text>

      <circle cx="23" cy="196" r="6.5" fill="rgba(180,40,40,0.22)" stroke="rgba(180,40,40,0.65)" strokeWidth="1.2"/>
      <line x1="20" y1="193" x2="26" y2="199" stroke="rgba(180,40,40,0.85)" strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="26" y1="193" x2="20" y2="199" stroke="rgba(180,40,40,0.85)" strokeWidth="1.3" strokeLinecap="round"/>
      <text x="34" y="200" fill="rgba(255,255,255,0.8)" fontSize="8.5" fontFamily="system-ui,sans-serif">Longer time to correct errors</text>

      {/* Right ✓ icons + labels — fully inlined */}
      <circle cx="194" cy="180" r="6.5" fill="rgba(60,160,80,0.22)" stroke="rgba(60,160,80,0.65)" strokeWidth="1.2"/>
      <path d="M190.5 180 L193.5 183 L198.5 176.5" stroke="rgba(60,160,80,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="205" y="184" fill="rgba(255,255,255,0.8)" fontSize="8.5" fontFamily="system-ui,sans-serif">Low cognitive load on memory</text>

      <circle cx="194" cy="196" r="6.5" fill="rgba(60,160,80,0.22)" stroke="rgba(60,160,80,0.65)" strokeWidth="1.2"/>
      <path d="M190.5 196 L193.5 199 L198.5 192.5" stroke="rgba(60,160,80,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="205" y="200" fill="rgba(255,255,255,0.8)" fontSize="8.5" fontFamily="system-ui,sans-serif">Shorter time to correct errors</text>
    </svg>
  )
}

function ValidationThumb({ accent }) {
  return (
    <svg viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Form card */}
      <rect x="60" y="16" width="240" height="190" rx="14" fill={accent} opacity="0.08" />
      <rect x="60" y="16" width="240" height="190" rx="14" stroke={accent} strokeWidth="1.5" opacity="0.2" />
      {/* Label */}
      <rect x="80" y="36" width="58" height="7" rx="3.5" fill={accent} opacity="0.35" />
      {/* Field 1 — success */}
      <rect x="80" y="50" width="200" height="30" rx="8" fill={accent} opacity="0.1" />
      <rect x="80" y="50" width="200" height="30" rx="8" stroke={accent} strokeWidth="1.5" opacity="0.6" />
      <rect x="92" y="62" width="82" height="7" rx="3.5" fill={accent} opacity="0.42" />
      <circle cx="265" cy="65" r="9" fill={accent} opacity="0.85" />
      <path d="M261 65 L264 68.5 L270 60.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Label 2 */}
      <rect x="80" y="94" width="44" height="7" rx="3.5" fill={accent} opacity="0.35" />
      {/* Field 2 — error */}
      <rect x="80" y="108" width="200" height="30" rx="8" fill={accent} opacity="0.05" />
      <rect x="80" y="108" width="200" height="30" rx="8" stroke={accent} strokeWidth="1.5" opacity="0.3" />
      <rect x="92" y="120" width="55" height="7" rx="3.5" fill={accent} opacity="0.18" />
      <circle cx="265" cy="123" r="9" fill={accent} opacity="0.4" />
      <line x1="261.5" y1="119.5" x2="268.5" y2="126.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="268.5" y1="119.5" x2="261.5" y2="126.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      {/* Inline error message */}
      <rect x="80" y="144" width="128" height="7" rx="3.5" fill={accent} opacity="0.44" />
      {/* Field 3 — neutral */}
      <rect x="80" y="164" width="200" height="30" rx="8" fill={accent} opacity="0.04" />
      <rect x="80" y="164" width="200" height="30" rx="8" stroke={accent} strokeWidth="1" opacity="0.14" />
      <rect x="92" y="176" width="68" height="7" rx="3.5" fill={accent} opacity="0.12" />
    </svg>
  )
}

function InterstitialThumb({ accent }) {
  return (
    <svg viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Screen frame */}
      <rect x="22" y="14" width="316" height="194" rx="14" fill={accent} opacity="0.09" />
      <rect x="22" y="14" width="316" height="194" rx="14" stroke={accent} strokeWidth="1.5" opacity="0.28" />
      {/* Expanding brand rings */}
      <circle cx="180" cy="100" r="24" fill={accent} opacity="0.88" />
      <circle cx="180" cy="100" r="50" stroke={accent} strokeWidth="3" opacity="0.44" />
      <circle cx="180" cy="100" r="76" stroke={accent} strokeWidth="2" opacity="0.22" />
      <circle cx="180" cy="100" r="102" stroke={accent} strokeWidth="1.5" opacity="0.1" />
      {/* Center mark — two overlapping squares */}
      <rect x="171" y="91" width="18" height="18" rx="3" fill="white" opacity="0.55" />
      <rect x="171" y="91" width="18" height="18" rx="3" fill="white" opacity="0.4" transform="rotate(45 180 100)" />
      {/* Progress bar */}
      <rect x="128" y="186" width="104" height="4" rx="2" fill={accent} opacity="0.14" />
      <rect x="128" y="186" width="66" height="4" rx="2" fill={accent} opacity="0.62" />
    </svg>
  )
}

export default function ProjectThumb({ href, accent }) {
  const thumbs = {
    '/design-system':         DesignSystemThumb,
    '/messaging-redesign':    MessagingThumb,
    '/magic-signal':          MagicSignalThumb,
    '/validation':            ValidationDiagram,
    '/interstitial':          InterstitialThumb,
  }
  const Thumb = thumbs[href]
  return Thumb ? <Thumb accent={accent} /> : null
}
