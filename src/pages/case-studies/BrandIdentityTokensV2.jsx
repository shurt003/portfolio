import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CaseTLDR from '../../components/CaseTLDR'
import usePageMeta from '../../hooks/usePageMeta'

/* ── Palette (near-black with a green undertone + a single teal accent;
   deliberately quiet so the live theming demo's own colors read clearly) ── */
const BG     = '#F2F5F4'
const CARD   = '#FFFFFF'
const INK    = '#101A19'
const BODY   = '#39433F'
const DIM    = 'rgba(16,26,25,0.72)'
const MUTE   = 'rgba(16,26,25,0.64)'
const LINE   = 'rgba(16,26,25,0.10)'
const ACCENT = '#0E6E63'
const GREEN  = '#157A4A'
const RED    = '#B3372B'
const L_DIM  = 'rgba(255,255,255,0.74)'
const L_MUTE = 'rgba(255,255,255,0.55)'
const L_ACC  = '#5FC9BA'

const wrap = 'max-w-6xl mx-auto px-6 md:px-10'
const IMG = '/images/BrandIdentityTokensV2'

const fadeUp = {
  initial:     { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
}

/* ── Shared helpers ── */
function SectionLabel({ children, light }) {
  return (
    <p className="font-mono text-xs tracking-[0.2em] uppercase mb-5" style={{ color: light ? L_MUTE : MUTE }}>
      {children}
    </p>
  )
}

function SectionHead({ num, label, title, light }) {
  return (
    <div className="relative">
      {num && (
        <span
          aria-hidden
          className="hidden md:block absolute right-0 -top-10 font-display font-black leading-none select-none pointer-events-none"
          style={{ fontSize: 'clamp(6rem, 13vw, 10rem)', color: light ? 'rgba(255,255,255,0.045)' : 'rgba(16,26,25,0.05)' }}
        >
          {num}
        </span>
      )}
      <SectionLabel light={light}>{num ? `${num} · ${label}` : label}</SectionLabel>
      <h2
        className="font-display font-black leading-tight mb-6 relative"
        style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: light ? '#fff' : INK }}
      >
        {title}
      </h2>
    </div>
  )
}

function Slot({ note, file, aspect = '16 / 10' }) {
  return (
    <div
      role="img"
      aria-label={note}
      className="w-full rounded-2xl flex flex-col items-center justify-center text-center gap-3 px-6 py-8"
      style={{ aspectRatio: aspect, border: '1px dashed rgba(16,26,25,0.3)', backgroundColor: 'rgba(16,26,25,0.03)' }}
    >
      <span
        className="font-mono text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
        style={{ color: MUTE, border: `1px solid ${LINE}` }}
      >
        Screenshot
      </span>
      <p className="font-sans text-sm leading-snug" style={{ color: DIM, maxWidth: '48ch' }}>{note}</p>
      {file && <p className="font-mono text-[10px] tracking-[0.04em]" style={{ color: MUTE }}>{file}</p>}
    </div>
  )
}

function DataTable({ head, rows, firstCol = 'strong' }) {
  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${LINE}` }}>
      <table className="w-full text-left border-collapse" style={{ backgroundColor: CARD }}>
        <thead>
          <tr style={{ backgroundColor: BG }}>
            {head.map((h) => (
              <th key={h} className="font-mono text-[10px] tracking-[0.12em] uppercase px-4 py-3 whitespace-nowrap" style={{ color: MUTE }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ borderTop: `1px solid ${LINE}` }}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`font-sans text-sm px-4 py-3 align-top ${j === 0 && firstCol === 'strong' ? 'font-semibold' : ''}`}
                  style={{ color: j === 0 ? INK : DIM }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   §04 · KnobLab: the live proof.
   Seven knobs drive a generated token spread, which renders a preview surface.
   This is the argument the case study is making, made operable.
   ══════════════════════════════════════════════════════════════════════════ */

const RADIUS_RATIOS  = [0.25, 0.5, 1, 4 / 3, 2]
const HEADING_RATIOS = [2.071, 1.429, 1.214, 1]
const ROOT_PX = 14

const PRESETS = [
  { key: 'default', name: "Today's defaults", heading: 1,    gutter: 25, card: 15, radius: 12, border: 1, shadow: 0.3,  surface: 1 },
  { key: 'soft',    name: 'Soft and open',    heading: 1.16, gutter: 38, card: 26, radius: 20, border: 1, shadow: 0.16, surface: 1 },
  { key: 'sharp',   name: 'Sharp and dense',  heading: 0.92, gutter: 13, card: 7,  radius: 2,  border: 2, shadow: 0.42, surface: 1 },
  { key: 'glass',   name: 'Translucent',      heading: 1.06, gutter: 30, card: 18, radius: 16, border: 1, shadow: 0.2,  surface: 0.62 },
]

const KNOBS = [
  { id: 'heading', label: 'heading-base',   axis: 'Type hierarchy',   min: 0.85, max: 1.3,  step: 0.01, unit: 'rem' },
  { id: 'gutter',  label: 'gutter',         axis: 'Layout density',   min: 8,    max: 44,   step: 1,    unit: 'px'  },
  { id: 'card',    label: 'card-margin',    axis: 'Surface spacing',  min: 4,    max: 32,   step: 1,    unit: 'px'  },
  { id: 'radius',  label: 'radius-base',    axis: 'Corner character', min: 0,    max: 26,   step: 1,    unit: 'px'  },
  { id: 'border',  label: 'border-width',   axis: 'Stroke weight',    min: 0,    max: 3,    step: 0.5,  unit: 'px'  },
  { id: 'shadow',  label: 'shadow-opacity', axis: 'Depth',            min: 0,    max: 0.5,  step: 0.01, unit: ''    },
  { id: 'surface', label: 'surface-opacity',axis: 'Surface treatment',min: 0.4,  max: 1,    step: 0.01, unit: ''    },
]

function KnobLab() {
  const [k, setK] = useState(PRESETS[0])
  const set = (id, value) => setK((prev) => ({ ...prev, key: 'custom', [id]: value }))

  const gen = useMemo(() => {
    const radii = RADIUS_RATIOS.map((r) => Math.round(k.radius * r))
    const headings = HEADING_RATIOS.map((r) => Math.round(k.heading * r * ROOT_PX * 10) / 10)
    const ambient = k.shadow * 0.47
    const shadow = (level) => {
      const y = 2 * level
      const blur = 4 * Math.pow(2, level - 1)
      return `0 ${y}px ${blur}px rgba(0,0,0,${k.shadow.toFixed(2)}), 0 1px 2px rgba(0,0,0,${ambient.toFixed(2)})`
    }
    return { radii, headings, shadow }
  }, [k])

  const surfaceBg = `rgba(255,255,255,${k.surface})`
  const stroke = `${k.border}px solid rgba(16,26,25,${0.10 + k.border * 0.04})`

  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${LINE}`, backgroundColor: CARD }}>
      {/* Presets */}
      <div className="flex flex-wrap gap-2 px-5 md:px-7 pt-6 pb-5" style={{ borderBottom: `1px solid ${LINE}` }}>
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase self-center mr-2" style={{ color: MUTE }}>Presets</span>
        {PRESETS.map((p) => {
          const active = k.key === p.key
          return (
            <button
              key={p.key}
              type="button"
              onClick={() => setK(p)}
              aria-pressed={active}
              className="font-mono text-[11px] tracking-[0.1em] uppercase px-4 py-2 rounded-full transition-colors duration-200"
              style={{
                border: `1px solid ${active ? ACCENT : 'rgba(16,26,25,0.22)'}`,
                backgroundColor: active ? ACCENT : 'transparent',
                color: active ? '#fff' : INK,
                cursor: 'pointer',
              }}
            >
              {p.name}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,20rem)_1fr]">
        {/* Knobs */}
        <div className="px-5 md:px-7 py-6 space-y-5" style={{ borderRight: `1px solid ${LINE}` }}>
          {KNOBS.map((knob) => (
            <div key={knob.id}>
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <label htmlFor={`knob-${knob.id}`} className="font-mono text-[11px]" style={{ color: INK }}>
                  {knob.label}
                </label>
                <span className="font-mono text-[11px] tabular-nums" style={{ color: ACCENT }}>
                  {knob.id === 'heading' ? k[knob.id].toFixed(2) : knob.step < 1 ? k[knob.id].toFixed(2) : k[knob.id]}
                  {knob.unit}
                </span>
              </div>
              <input
                id={`knob-${knob.id}`}
                type="range"
                min={knob.min}
                max={knob.max}
                step={knob.step}
                value={k[knob.id]}
                onChange={(e) => set(knob.id, parseFloat(e.target.value))}
                className="w-full"
                style={{ accentColor: ACCENT, cursor: 'pointer' }}
              />
              <p className="font-sans text-[11px] mt-1" style={{ color: MUTE }}>{knob.axis}</p>
            </div>
          ))}
        </div>

        {/* Preview + generated readout */}
        <div>
          <div
            className="px-5 md:px-8 py-8"
            style={{
              background:
                'radial-gradient(circle at 18% 22%, rgba(14,110,99,0.42), transparent 45%), ' +
                'radial-gradient(circle at 82% 78%, rgba(16,26,25,0.30), transparent 50%), ' +
                'linear-gradient(135deg, rgba(14,110,99,0.22), rgba(95,201,186,0.16))',
            }}
          >
            <div
              style={{
                backgroundColor: surfaceBg,
                border: stroke,
                borderRadius: `${gen.radii[3]}px`,
                boxShadow: gen.shadow(3),
                padding: `${k.gutter}px`,
                backdropFilter: k.surface < 1 ? 'blur(8px)' : 'none',
                WebkitBackdropFilter: k.surface < 1 ? 'blur(8px)' : 'none',
                transition: 'border-radius 180ms ease, padding 180ms ease',
              }}
            >
              <p className="font-display font-bold leading-tight" style={{ fontSize: `${gen.headings[1]}px`, color: INK, marginBottom: `${k.card * 0.5}px` }}>
                Account overview
              </p>
              <p className="font-display font-black leading-none" style={{ fontSize: `${gen.headings[0] * 1.5}px`, color: INK, marginBottom: `${k.card}px` }}>
                $12,480.55
              </p>

              <div className="grid grid-cols-2" style={{ gap: `${k.card}px`, marginBottom: `${k.card}px` }}>
                {[['Spending', '$2,140'], ['Saved', '$680']].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      backgroundColor: `rgba(16,26,25,${0.035 * k.surface})`,
                      border: stroke,
                      borderRadius: `${gen.radii[2]}px`,
                      padding: `${Math.max(8, k.card * 0.85)}px`,
                      boxShadow: gen.shadow(1),
                    }}
                  >
                    <p className="font-sans" style={{ fontSize: `${gen.headings[3] * 0.82}px`, color: MUTE, marginBottom: 4 }}>{label}</p>
                    <p className="font-display font-bold leading-none" style={{ fontSize: `${gen.headings[2]}px`, color: INK }}>{value}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: `${k.card}px` }}>
                {['Payroll deposit', 'Utilities'].map((row, i) => (
                  <div
                    key={row}
                    className="flex items-center justify-between"
                    style={{
                      padding: `${Math.max(6, k.card * 0.6)}px 0`,
                      borderTop: i === 0 ? 'none' : `${k.border}px solid rgba(16,26,25,0.10)`,
                    }}
                  >
                    <span className="font-sans" style={{ fontSize: `${gen.headings[3] * 0.92}px`, color: DIM }}>{row}</span>
                    <span className="font-sans tabular-nums" style={{ fontSize: `${gen.headings[3] * 0.92}px`, color: INK }}>
                      {i === 0 ? '+$3,200.00' : '-$142.18'}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="font-sans font-semibold"
                style={{
                  backgroundColor: ACCENT,
                  color: '#fff',
                  border: 'none',
                  borderRadius: `${gen.radii[1]}px`,
                  padding: `${Math.max(8, k.card * 0.7)}px ${Math.max(14, k.gutter * 0.7)}px`,
                  fontSize: `${gen.headings[3] * 0.92}px`,
                  boxShadow: gen.shadow(2),
                  cursor: 'default',
                }}
              >
                Move money
              </button>
            </div>
          </div>

          {/* What the knobs generated */}
          <div className="px-5 md:px-8 py-5" style={{ borderTop: `1px solid ${LINE}`, backgroundColor: BG }}>
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase mb-3" style={{ color: MUTE }}>
              Generated from those seven values
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 font-mono text-[11px]" style={{ color: DIM }}>
              <p>radius spread · <span style={{ color: INK }}>{gen.radii.join(' · ')}px</span></p>
              <p>heading spread · <span style={{ color: INK }}>{gen.headings.join(' · ')}px</span></p>
              <p>elevation levels · <span style={{ color: INK }}>5, from one opacity</span></p>
              <p>downstream names · <span style={{ color: INK }}>unchanged</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Data ── */
const CATEGORIES = [
  ['Typography',        '2 knobs, 12 ratios',        'Heading scale and the margins under each level'],
  ['Spacing and layout','6 knobs',                   'Content breathing room and card-to-card gaps, with per-axis overrides'],
  ['Decoration',        '3 knobs, 5 ratios',         'Corner radius, stroke weight, and border colors'],
  ['Effects',           '5 knobs, 4 support values', 'Shadow depth, opacity, and geometry'],
  ['Elevation',         '2 knobs',                   'How surfaces separate from the base, including glass and transparency'],
]

const SEVEN = [
  ['heading-base',    'Type hierarchy',    'compact and understated', 'bold and expressive'],
  ['gutter',          'Layout density',    'tight and utilitarian',   'open and relaxed'],
  ['card-margin',     'Surface spacing',   'dense and app-like',      'airy and editorial'],
  ['radius-base',     'Corner character',  'sharp and corporate',     'soft and friendly'],
  ['border-width',    'Stroke weight',     'hairline and minimal',    'bold and structural'],
  ['shadow-opacity',  'Depth',             'flat and minimal',        'dimensional and elevated'],
  ['surface-opacity', 'Surface treatment', 'fully opaque',            'glass and translucent'],
]

const ROLES = [
  ['Knob',      'The input a designer actually turns. Seven of these carry the identity.'],
  ['Support',   'A tuning value that shapes how the generation behaves, like the per-level ratios.'],
  ['Generated', 'The output token components already reference. Its name never changed.'],
]

const DERIVATION = [
  ['Heading scale', 'Measured from the sizes already shipping: 29, 20, 17 and 14px', '2.071 · 1.429 · 1.214 · 1.0'],
  ['Corner radius', 'Measured from the three radii already in use against a 12px base', '0.25 · 0.5 · 1 · 4/3 · 2'],
  ['Elevation',     'Offset grows step by step, blur doubles per level', '5 levels from one opacity value'],
]

export default function BrandIdentityTokensV2() {
  usePageMeta(
    'Brand Identity Tokens v2 by Stephen Hurt',
    'A theming system with 900+ variables where a global change reached roughly 15% of the UI. Eighteen knobs that generate the rest, non-breaking at their defaults, and small enough for an AI assistant to operate safely.'
  )

  return (
    <main style={{ backgroundColor: BG, color: BODY }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: INK, color: '#fff' }}>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
            backgroundSize: '84px 84px',
            maskImage: 'radial-gradient(ellipse at 72% 32%, black 15%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 72% 32%, black 15%, transparent 70%)',
          }}
        />
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{ right: '-10%', top: '-30%', width: '62%', height: '140%', background: 'radial-gradient(circle at 55% 45%, rgba(14,110,99,0.42), transparent 62%)' }}
        />
        <div className={`${wrap} pt-32 pb-16 relative`}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] uppercase mb-8" style={{ color: L_MUTE }}>
                Case Study · Q2 · Design Systems
              </p>
              <h1 className="font-display font-black leading-[0.95] mb-7" style={{ fontSize: 'clamp(2.6rem, 6vw, 4.6rem)' }}>
                Brand Identity Tokens <span style={{ color: L_ACC }}>v2</span>
              </h1>
              <p className="font-sans text-lg md:text-xl leading-relaxed max-w-xl mb-10" style={{ color: 'rgba(255,255,255,0.78)' }}>
                The theming layer had grown past 900 variables, and most screens had quietly stopped listening to them.
                This is the layer we put above it: eighteen knobs that generate the rest, and seven that carry the
                identity.
              </p>
              <div className="flex flex-wrap gap-x-10 gap-y-4 pt-7" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                {[
                  ['Role', 'Product Designer, co-designed with engineering'],
                  ['Status', 'Spec’d and documented, build underway'],
                ].map(([key, value]) => (
                  <div key={key}>
                    <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-1.5" style={{ color: L_MUTE }}>{key}</p>
                    <p className="font-sans text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.9)' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              role="img"
              aria-label="Theme snapshot placeholder, to be replaced with a real export"
              className="w-full rounded-2xl flex flex-col items-center justify-center text-center gap-3 px-6 py-8 lg:-mr-6"
              style={{ aspectRatio: '4 / 3', border: '1px dashed rgba(255,255,255,0.28)', backgroundColor: 'rgba(255,255,255,0.03)' }}
            >
              <span
                className="font-mono text-[10px] tracking-[0.14em] uppercase px-2.5 py-1 rounded-full"
                style={{ color: L_MUTE, border: '1px solid rgba(255,255,255,0.22)' }}
              >
                Screenshot
              </span>
              <p className="font-sans text-sm leading-snug" style={{ color: L_DIM, maxWidth: '32ch' }}>
                A generated theme snapshot: every category rendered at one set of values
              </p>
              <p className="font-mono text-[10px] tracking-[0.04em]" style={{ color: L_MUTE }}>hero-theme-snapshot.png</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TL;DR ── */}
      <CaseTLDR
        colors={{ text: INK, dim: DIM, accent: ACCENT, surface: CARD, rule: LINE }}
        summary="The platform's theming layer had grown past 900 variables, and an internal audit found that roughly 85% of surfaces hardcoded their own values anyway, so setting a global variable correctly still reached only about 15% of the screens it was meant to. Consolidating that list had already been attempted and abandoned as impractical. We went the other direction and added a generation layer above it: eighteen knobs that produce the existing tokens, with every downstream name preserved and every default tuned to reproduce the current output exactly. Seven of those knobs carry the visual differentiation, and the surface is deliberately small enough that an AI assistant can operate it without producing incoherent states."
        stats={[
          { value: '900+', label: 'Variables in the theming layer before' },
          { value: '~15%', label: 'Of affected surfaces a global change actually reached' },
          { value: '18', label: 'Knobs that now generate the spread' },
          { value: '0', label: 'Breaking changes at default values' },
        ]}
      />

      {/* ── 01 THE PROBLEM ── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="01" label="The problem" title="A global variable that moved 15% of the UI" />
          <div className="space-y-4 font-sans text-base leading-relaxed max-w-3xl mb-12">
            <p>
              The theming layer worked the way it had been designed to, and it had been growing since long before I got
              near it. Every new feature request arrived with its own set of theme variables, so the list only ever went
              one direction. By early 2026 it was past 900 entries, with nothing in its structure to indicate which of
              them were related to each other.
            </p>
            <p>
              That alone would have been a manageable problem. The second half was worse. An internal audit of theme and
              UI debt found that most surfaces had quietly stopped using the shared variables at all. Radii, shadows,
              stroke colors and backgrounds were bespoke per layout rather than tied to anything central, so setting a
              global border radius correctly would reach roughly 15% of the surfaces it was supposed to. The other 85%
              were hardcoded and would not move.
            </p>
            <p>
              Two failures stacked on each other: far too many variables to reason about, and variables that mostly
              did not do anything.
            </p>
          </div>
        </motion.div>

        <motion.div {...fadeUp} style={{ borderLeft: `3px solid ${RED}` }} className="pl-6 md:pl-9 max-w-3xl mb-12">
          {[
            ['Differentiating a theme was expensive', 'Making two instances of the platform look like genuinely different products meant touching many files and holding the relationships between hundreds of variables in your head. Rounder corners meant tracking down more than fifty radius variables. Looser density meant finding dozens of padding values scattered across component files.'],
            ['Proportional changes were error-prone', 'Scaling headings up twenty percent meant recalculating every level by hand. Adjusting shadow depth meant editing individual definitions and hoping the proportions between them stayed intact. The system had no idea that its own values were related to each other.'],
          ].map(([name, desc], i, arr) => (
            <div key={name} className="py-6" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : 'none' }}>
              <p className="font-display text-lg font-bold mb-1.5" style={{ color: INK }}>{name}</p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div {...fadeUp} className="grid grid-cols-3 gap-8 max-w-2xl">
          <Stat value="900+" label="theme variables, growing with every feature" />
          <Stat value="85%" label="of surfaces hardcoding their own values" />
          <Stat value="50+" label="radius variables behind one rounder corner" />
        </motion.div>
      </section>

      {/* ── 02 THE REFRAME ── */}
      <motion.section {...fadeUp} style={{ backgroundColor: INK }}>
        <div className={`${wrap} py-16 md:py-20`}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-6" style={{ color: L_ACC }}>
            02 · The reframe
          </p>
          <p className="font-display font-black leading-tight max-w-4xl mb-6" style={{ fontSize: 'clamp(1.7rem, 3.8vw, 2.8rem)', color: '#fff' }}>
            The list was never going to get shorter.
          </p>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-4" style={{ color: L_DIM }}>
            Another team had already tried the obvious fix. They set out to identify a smaller, less granular set of
            variables that would make theme creation easier, studied how the existing ones were actually being used,
            and concluded that consolidation would not be straightforward. Their own proposal stopped short and pivoted
            to a different starting point rather than finish that work.
          </p>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-10" style={{ color: L_DIM }}>
            That result reframed it for me. Nine hundred variables is not a tidiness problem waiting for someone
            patient. It is a generation problem. Everything downstream can keep its name and every override a customer
            theme already depends on, as long as something above it decides what those values should be. The
            question stopped being which variables to remove, and became the smallest set of inputs that could produce
            the rest.
          </p>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.1em]">
            {['Brand inputs', '18 knobs', 'Generated tokens', 'Component variables'].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    border: `1px solid ${i === 1 ? L_ACC : 'rgba(255,255,255,0.28)'}`,
                    color: i === 1 ? L_ACC : 'rgba(255,255,255,0.86)',
                  }}
                >
                  {step}
                </span>
                {i < arr.length - 1 && <span aria-hidden style={{ color: L_MUTE }}>→</span>}
              </span>
            ))}
          </div>
          <p className="font-sans text-sm leading-relaxed max-w-3xl mt-5" style={{ color: L_MUTE }}>
            Only the middle step is new. The names on either end of it stay exactly as they were.
          </p>
        </div>
      </motion.section>

      {/* ── 03 THE SURFACE ── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="03" label="The surface" title="Eighteen knobs, five categories" />
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
            Eighteen was not a target. It is what was left after cutting everything that did not change how the product
            felt at a glance. Engineering owned the generation itself and where it sits in the import chain. I owned
            which knobs existed, what each one was allowed to do, and the ratios behind them. We wrote the spec
            together.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="mb-14">
          <DataTable head={['Category', 'Inputs', 'What it controls']} rows={CATEGORIES} />
        </motion.div>

        <motion.div {...fadeUp}>
          <p className="font-display text-xl font-bold mb-3" style={{ color: INK }}>Every variable plays one of three roles</p>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-6">
            The taxonomy matters more than it sounds like it should. It is what lets a theme reach in at any level:
            turn a knob for the normal case, adjust a ratio when the spread needs reshaping, or pin a single generated
            value when the formula produces the wrong answer for one specific brand.
          </p>
          <div style={{ borderLeft: `3px solid ${ACCENT}` }} className="pl-6 md:pl-8 max-w-3xl">
            {ROLES.map(([role, desc], i, arr) => (
              <div key={role} className="py-4" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : 'none' }}>
                <p className="font-mono text-[11px] tracking-[0.14em] uppercase mb-1" style={{ color: ACCENT }}>{role}</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 04 THE SEVEN ── */}
      <section className="py-20" style={{ backgroundColor: '#E8EEEC' }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="04" label="The high-impact set" title="Seven knobs carry the identity" />
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
              Eleven of the eighteen are refinement dials: per-axis spacing overrides, shadow geometry, heading
              margins, border width stepping. They matter when someone is tuning. Seven do the differentiating work,
              and each one maps to something a person perceives rather than a property a browser reads. That mapping is
              the part I care about most, because it is what lets a conversation about a brand happen in words instead
              of pixel values.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="mb-12 overflow-x-auto rounded-xl" style={{ border: `1px solid ${LINE}` }}>
            <table className="w-full text-left border-collapse" style={{ backgroundColor: CARD }}>
              <thead>
                <tr style={{ backgroundColor: BG }}>
                  {['Knob', 'Axis', 'Turned down', 'Turned up'].map((h) => (
                    <th key={h} className="font-mono text-[10px] tracking-[0.12em] uppercase px-4 py-3 whitespace-nowrap" style={{ color: MUTE }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SEVEN.map(([knob, axis, low, high], i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${LINE}` }}>
                    <td className="font-mono text-[12px] px-4 py-3 align-top whitespace-nowrap" style={{ color: ACCENT }}>{knob}</td>
                    <td className="font-sans text-sm font-semibold px-4 py-3 align-top" style={{ color: INK }}>{axis}</td>
                    <td className="font-sans text-sm px-4 py-3 align-top" style={{ color: DIM }}>{low}</td>
                    <td className="font-sans text-sm px-4 py-3 align-top" style={{ color: DIM }}>{high}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.div {...fadeUp}>
            <p className="font-display text-xl font-bold mb-2" style={{ color: INK }}>Turn them yourself</p>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-6">
              Same markup, same component, same downstream variable names. Only the seven values change. The readout
              underneath shows what each setting generates, which is the whole argument in one place: a handful of
              inputs, a full spread out the other side.
            </p>
            <KnobLab />
          </motion.div>
        </div>
      </section>

      {/* ── 05 NON-BREAKING ── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="05" label="The constraint" title="Defaults that change nothing" />
          <div className="space-y-4 font-sans text-base leading-relaxed max-w-3xl mb-10">
            <p>
              A platform serving hundreds of financial institutions cannot take a theming change that requires every
              existing theme to be revisited. So the hard requirement came first: at default values, the generated
              output had to be byte-for-byte what shipped yesterday.
            </p>
            <p>
              That is why the ratios are measured rather than invented. The heading scale comes from the sizes already
              in production, not from a modular scale that looks elegant on a spec page. The radius ratios come from
              the three radii the system was already using. Someone chose those relationships deliberately, years
              before this project, and scaling a base value preserves their judgment instead of quietly overwriting it
              with math.
            </p>
            <p>
              Every variable also carries a default flag, so a theme that already overrides a downstream value keeps
              winning. Nothing had to be migrated on a schedule. Adoption is something a team opts into when it wants
              the knobs, not a bill that comes due.
            </p>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="mb-12">
          <DataTable head={['Spread', 'Where the ratios came from', 'Result']} rows={DERIVATION} />
        </motion.div>

        <motion.div {...fadeUp} className="rounded-2xl p-7 md:p-9 max-w-3xl" style={{ backgroundColor: 'rgba(21,122,74,0.06)', border: '1px solid rgba(21,122,74,0.25)' }}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-3" style={{ color: GREEN }}>The test that mattered</p>
          <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
            Set every knob to its default and the system produces the same heading sizes, the same three radii, and the
            same three elevation levels it produced before any of this existed. Levels four and five are new range at
            the top, available to anything that wants them and ignored by everything that does not.
          </p>
        </motion.div>
      </section>

      {/* ── 06 THE NON-HUMAN OPERATOR ── */}
      <section className="py-20" style={{ backgroundColor: '#E8EEEC' }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="06" label="Automation" title="A surface an agent can be trusted with" />
            <div className="space-y-4 font-sans text-base leading-relaxed max-w-3xl mb-10">
              <p>
                While the aesthetics work was being planned, someone raised the obvious fear about pointing the
                platform's AI assistant at theming: it could set variables indiscriminately and produce visual states
                nobody would ship. Against a flat list of 900 loosely related values, that fear is just correct. There
                is no way for a model, or a new engineer, to know which twelve of those variables need to move together.
              </p>
              <p>
                A bounded surface is the answer to that. Eighteen inputs, each with a sensible range and a proportional
                generator behind it, cannot produce an incoherent spread, because the spread is derived rather than
                typed. The generation layer was designed for humans first, but the reason it is small enough to be
                useful to a human is the same reason it is safe to automate.
              </p>
              <p>
                A workshop on the theme-building experience proposed the version of this I find most interesting:
                letting an institution describe what they want instead of navigating a thousand individual decisions.
                "Make it feel more open and modern" is not a variable name, but it does resolve cleanly to a handful of
                knob values. That path is proposed rather than built, and it only works at all because the surface it
                would drive is eighteen knobs wide.
              </p>
            </div>
          </motion.div>

          <motion.div {...fadeUp}>
            <Slot note="Concept: plain-language intent resolving to a set of knob values, with the generated spread shown alongside." file="prompt-to-knobs-concept.png" aspect="16 / 9" />
          </motion.div>
        </div>
      </section>

      {/* ── 07 WHAT IT BUYS ── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="07" label="Consequences" title="What it buys, and what it doesn't" />
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
            The second-order effects turned out to be the easiest part to sell internally, because they belong to teams
            who never touch a design token.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={{ borderLeft: `3px solid ${ACCENT}` }} className="pl-6 md:pl-9 max-w-3xl mb-12">
          {[
            ['Quality engineering can actually verify a theme', 'A visual change that touches eighteen variables instead of several thousand can be reviewed in one pass. That shortens the cycle and makes an unnoticed regression much less likely, which was a real cost the old approach kept paying.'],
            ['Customers can approve something bounded', 'An institution reviewing a proposed look can reason about a set of intentional inputs. A sprawling diff across hundreds of token overrides is not something anyone can meaningfully sign off on, so approvals dragged.'],
            ['Two teams stopped building two systems', 'The component library team adopted the same knobs for their own template customization work rather than inventing a parallel set. The platform themes and the component themes now answer to the same inputs, which is the outcome I was most interested in.'],
          ].map(([name, desc], i, arr) => (
            <div key={name} className="py-6" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : 'none' }}>
              <p className="font-display text-lg font-bold mb-1.5" style={{ color: INK }}>{name}</p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{desc}</p>
            </div>
          ))}
        </motion.div>

        <motion.div {...fadeUp} className="rounded-2xl p-7 md:p-9 max-w-3xl" style={{ backgroundColor: 'rgba(179,55,43,0.05)', border: '1px solid rgba(179,55,43,0.22)' }}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-3" style={{ color: RED }}>What this does not fix</p>
          <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
            The 85% of surfaces that hardcode their own values are still hardcoded. Generation makes the knobs coherent;
            it does not reconnect screens that stopped listening years ago. Reconnecting them is its own phase of the
            remediation plan, and until that work lands, turning a knob still moves less of the product than it should.
            This layer is what makes that cleanup worth doing rather than a substitute for it.
          </p>
        </motion.div>
      </section>

      {/* ── 08 WHERE IT STANDS ── */}
      <section className="py-20" style={{ backgroundColor: INK, color: '#fff' }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="08" label="Where it stands" title="In build, with one question open" light />
            <div className="space-y-4 font-sans text-base leading-relaxed max-w-3xl mb-14" style={{ color: L_DIM }}>
              <p>
                The eighteen knobs, their ratios, their defaults and their roles are documented and agreed on.
                Engineering is building the generation layer now, and it sits at the center of a seven-phase plan for
                the platform's theme debt: the phases before it get preset aesthetics working, the phases after it
                apply the new variables across surfaces and start reconnecting the hardcoded ones.
              </p>
              <p>
                The first knob being wired into the customer-facing side is corner radius, exposed as a single control
                that runs from sharp to rounded instead of a per-component setting. Each preset aesthetic maps that one
                value into its own ranges underneath: inputs stay on the sharp end, cards get a wider range, modals
                take a larger radius, small controls cap out early. One decision for the person choosing, five
                different behaviors underneath.
              </p>
              <p>
                One thing is still open. Whether the knobs should live in their own namespace, separate from the
                component-level tokens they generate, is recorded as an idea rather than a decision. I think they
                should, because the distinction between an input and an output is the clearest thing about this system
                and the current naming hides it.
              </p>
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ['The cheapest change is the one nobody has to make', 'Requiring defaults to reproduce the current output exactly is what turned this from a migration into an option. Every hour not spent revisiting existing themes was an hour the idea did not have to justify.'],
              ['Ratios carry other people’s decisions', 'Measuring the ratios from values already shipping preserved judgment made years earlier by people who are not in the room. A cleaner modular scale would have been easier to defend and worse to live with.'],
              ['Bounded surfaces are what make automation safe', 'The argument for keeping this small started as a usability one. It ended up being the reason an assistant can touch theming at all, which is not where I expected the value to land.'],
            ].map(([title, body], i) => (
              <div key={title} className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.28)' }}>
                <p className="font-mono text-[11px] tracking-[0.18em] mb-4" style={{ color: L_ACC }}>0{i + 1}</p>
                <p className="font-display text-xl font-bold mb-3">{title}</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>{body}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── NEXT PROJECT ── */}
      <section className={`${wrap} py-20`}>
        <div style={{ borderTop: `1px solid ${LINE}` }} className="pt-12">
          <Link to="/q2-clarity" className="group inline-block">
            <p className="font-sans text-sm mb-2" style={{ color: MUTE }}>Next project</p>
            <h3 className="font-display font-black leading-none transition-opacity duration-300 group-hover:opacity-60" style={{ fontSize: 'clamp(2rem,5vw,4rem)', color: INK }}>
              Q2 Clarity
            </h3>
          </Link>
        </div>
      </section>

    </main>
  )
}

function Stat({ value, label, color = INK }) {
  return (
    <div>
      <p className="font-display text-4xl md:text-5xl font-black leading-none mb-2" style={{ color }}>{value}</p>
      <p className="font-sans text-sm leading-snug" style={{ color: DIM }}>{label}</p>
    </div>
  )
}
