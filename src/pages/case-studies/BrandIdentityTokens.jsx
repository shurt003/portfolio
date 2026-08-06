import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import usePageMeta from '../../hooks/usePageMeta'

/* ── Palette ─────────────────────────────────────────────────────────────── */
const BG   = '#F7F5F1'
const CARD = '#FFFFFF'
const INK  = '#17191C'
const BODY = '#454C52'
const DIM  = 'rgba(23,25,28,0.64)'
const MUTE = 'rgba(23,25,28,0.45)'
const LINE = 'rgba(23,25,28,0.10)'
const ALT  = '#EFEBE4'
const BLUE = '#2B44E0'   // system / tokens
const RED  = '#C0392B'   // killed / fails
const AMBER = '#B7791F'

const wrap = 'max-w-5xl mx-auto px-6 md:px-10'

/* ── Motion ──────────────────────────────────────────────────────────────── */
const fadeUp = {
  initial:     { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
}

/* ── Small helpers ───────────────────────────────────────────────────────── */
function SectionLabel({ children, light }) {
  return (
    <p className="font-mono text-xs tracking-[0.2em] uppercase mb-5" style={{ color: light ? 'rgba(255,255,255,0.5)' : MUTE }}>
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
          style={{ fontSize: 'clamp(6rem, 13vw, 10rem)', color: light ? 'rgba(255,255,255,0.045)' : 'rgba(23,25,28,0.05)' }}
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

function Stat({ value, label, color = BLUE }) {
  return (
    <div>
      <p className="font-display text-4xl md:text-5xl font-black leading-none mb-2" style={{ color }}>{value}</p>
      <p className="font-sans text-sm leading-snug" style={{ color: DIM }}>{label}</p>
    </div>
  )
}

function PullQuote({ quote, who }) {
  return (
    <figure className="my-6">
      <blockquote className="font-display font-bold leading-snug" style={{ fontSize: 'clamp(1.15rem, 2.2vw, 1.5rem)', color: INK }}>
        <span style={{ color: BLUE }}>“</span>{quote}<span style={{ color: BLUE }}>”</span>
      </blockquote>
      <figcaption className="font-mono text-[11px] uppercase tracking-[0.16em] mt-3" style={{ color: MUTE }}>
        {who}
      </figcaption>
    </figure>
  )
}

/* ── §09 · The live demo: one dashboard, three brands, all tokens ────────── */
const BRANDS = [
  {
    key: 'bluebonnet',
    name: 'Bluebonnet',
    kind: 'Credit Union',
    url: 'bluebonnet.bank/dashboard',
    line: 'Square, hairlined, dense: a traditional bank\'s idea of order.',
    tokens: [
      ['brand.typeface', 'libre franklin'],
      ['card.radius', 'radius.sm'],
      ['card.border', 'border.hairline'],
      ['card.bg', 'surface.solid'],
      ['grid.columns', 'dense.4'],
      ['grid.gap', 'space.sm'],
    ],
    theme: {
      font: "'Libre Franklin', 'Helvetica Neue', sans-serif",
      weight: 600,
      brand: '#1F3F8F',
      bg: '#F2F4F9',
      ink: '#1C2333',
      mute: 'rgba(28,35,51,0.55)',
      cardBg: '#FFFFFF',
      cardBorder: '1px solid rgba(31,63,143,0.25)',
      radius: 6,
      pad: 14,
      gap: 12,
      cols: 4,
      shadow: 'none',
      blur: 'none',
      chipBg: 'rgba(31,63,143,0.10)',
    },
  },
  {
    key: 'copperfield',
    name: 'Copperfield',
    kind: 'Bank',
    url: 'copperfield.bank/dashboard',
    line: 'Round, warm, unhurried: same components, different rhythm.',
    tokens: [
      ['brand.typeface', 'nunito'],
      ['card.radius', 'radius.xl'],
      ['card.border', 'border.none'],
      ['card.shadow', 'elevation.soft'],
      ['grid.columns', 'relaxed.3'],
      ['grid.gap', 'space.lg'],
    ],
    theme: {
      font: "'Nunito', 'Helvetica Neue', sans-serif",
      weight: 700,
      brand: '#9A5B2D',
      bg: '#FAF4EC',
      ink: '#2B2118',
      mute: 'rgba(43,33,24,0.55)',
      cardBg: '#FFFDF9',
      cardBorder: 'none',
      radius: 22,
      pad: 22,
      gap: 22,
      cols: 3,
      shadow: '0 16px 34px -20px rgba(154,91,45,0.5)',
      blur: 'none',
      chipBg: 'rgba(154,91,45,0.12)',
    },
  },
  {
    key: 'verdant',
    name: 'Verdant',
    kind: 'Credit Union',
    url: 'verdant.bank/dashboard',
    line: 'Glass over a brand gradient. The clamp floors the opacity so every label stays AA.',
    tokens: [
      ['brand.typeface', 'outfit'],
      ['card.bg', 'surface.glass'],
      ['card.blur', 'blur.md'],
      ['card.border', 'border.glass'],
      ['card.radius', 'radius.lg'],
      ['grid.gap', 'space.md'],
    ],
    theme: {
      font: "'Outfit', 'Helvetica Neue', sans-serif",
      weight: 500,
      brand: '#EAF6EE',
      bg: 'linear-gradient(135deg, #16482F 0%, #1E6842 55%, #2A8256 100%)',
      ink: '#F4FAF5',
      mute: 'rgba(244,250,245,0.72)',
      cardBg: 'rgba(255,255,255,0.14)',
      cardBorder: '1px solid rgba(255,255,255,0.35)',
      radius: 16,
      pad: 18,
      gap: 16,
      cols: 3,
      shadow: 'none',
      blur: 'blur(14px)',
      chipBg: 'rgba(255,255,255,0.18)',
    },
  },
]

function DashCard({ t, children }) {
  return (
    <div
      style={{
        backgroundColor: t.cardBg,
        border: t.cardBorder === 'none' ? undefined : t.cardBorder,
        borderRadius: t.radius,
        padding: t.pad,
        boxShadow: t.shadow === 'none' ? undefined : t.shadow,
        backdropFilter: t.blur === 'none' ? undefined : t.blur,
        WebkitBackdropFilter: t.blur === 'none' ? undefined : t.blur,
        transition: 'all 0.55s cubic-bezier(0.22,1,0.36,1)',
        minWidth: 0,
      }}
    >
      {children}
    </div>
  )
}

function ThemedDashboard({ brand }) {
  const t = brand.theme
  const label = { fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: t.mute, fontWeight: 600, display: 'block', marginBottom: 6 }
  const val = { fontSize: 'clamp(16px, 2.2vw, 22px)', fontWeight: t.weight, color: t.ink, lineHeight: 1.1, display: 'block' }
  const sub = { fontSize: 11, color: t.mute, display: 'block', marginTop: 6 }
  const bars = [40, 66, 48, 82, 58]

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: `1px solid ${LINE}`, boxShadow: '0 20px 50px -34px rgba(23,25,28,0.4)' }}
    >
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ backgroundColor: '#E9E6DF', borderBottom: `1px solid ${LINE}` }}>
        {['#E0574B', '#E0B23F', '#59B36A'].map((c) => (
          <span key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
        ))}
        <span className="font-mono text-[11px] ml-3 truncate" style={{ color: MUTE }}>{brand.url}</span>
      </div>

      {/* The themed UI: every visual difference below is a token */}
      <div style={{ background: t.bg, padding: 'clamp(16px, 3vw, 28px)', fontFamily: t.font, transition: 'background 0.55s cubic-bezier(0.22,1,0.36,1)' }}>
        <div className="flex items-baseline justify-between flex-wrap gap-2" style={{ marginBottom: t.gap }}>
          <p style={{ color: t.ink, fontWeight: t.weight, fontSize: 'clamp(15px, 2vw, 19px)', lineHeight: 1.2 }}>
            {brand.name.toLowerCase()} <span style={{ color: t.mute, fontWeight: 400, fontSize: '0.8em' }}>{brand.kind.toLowerCase()}</span>
          </p>
          <p style={{ color: t.mute, fontSize: 13 }}>good afternoon, dana</p>
        </div>

        <style>{`
          .bit-dashgrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
          @media (min-width: 768px) { .bit-dashgrid { grid-template-columns: repeat(var(--bit-cols), minmax(0, 1fr)); } }
        `}</style>
        <div className="bit-dashgrid" style={{ '--bit-cols': t.cols, gap: t.gap, transition: 'gap 0.55s cubic-bezier(0.22,1,0.36,1)' }}>
          <DashCard t={t}>
            <span style={label}>credit score</span>
            <b style={val}>735</b>
            <span style={{ ...sub, display: 'inline-block', padding: '2px 8px', borderRadius: 999, backgroundColor: t.chipBg, color: t.ink, fontWeight: 600 }}>excellent</span>
          </DashCard>
          <DashCard t={t}>
            <span style={label}>everyday checking</span>
            <b style={val}>$8,204.12</b>
            <span style={sub}>··· 4021</span>
          </DashCard>
          <DashCard t={t}>
            <span style={label}>high-yield savings</span>
            <b style={val}>$12,890.43</b>
            <span style={sub}>··· 7788</span>
          </DashCard>
          <DashCard t={t}>
            <span style={label}>spend · july</span>
            <span style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 34, marginTop: 2 }} aria-hidden>
              {bars.map((h, i) => (
                <i key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: brand.key === 'verdant' ? 'rgba(255,255,255,0.7)' : t.brand, borderRadius: Math.min(t.radius, 4), opacity: 0.85, transition: 'all 0.55s cubic-bezier(0.22,1,0.36,1)' }} />
              ))}
            </span>
            <span style={sub}>$1,842 of $2,600</span>
          </DashCard>
        </div>
      </div>
    </div>
  )
}

function BrandSwitcher() {
  const [active, setActive] = useState(0)
  const brand = BRANDS[active]

  return (
    <div>
      {/* Web fonts for the fictional brands only */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;600&family=Nunito:wght@500;700&family=Outfit:wght@400;500&display=swap"
      />

      {/* Brand tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {BRANDS.map((b, i) => {
          const isActive = i === active
          return (
            <button
              key={b.key}
              type="button"
              onClick={() => setActive(i)}
              className="font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-3 rounded-full transition-colors duration-200"
              style={{
                border: `1px solid ${isActive ? INK : 'rgba(23,25,28,0.25)'}`,
                backgroundColor: isActive ? INK : 'transparent',
                color: isActive ? '#fff' : INK,
                cursor: 'pointer',
              }}
            >
              {b.name} {b.kind === 'Bank' ? 'Bank' : 'CU'}
            </button>
          )
        })}
      </div>

      <ThemedDashboard brand={brand} />

      {/* The tokens doing the work */}
      <div className="flex flex-wrap gap-2 mt-4">
        {brand.tokens.map(([k, v]) => (
          <span key={k} className="font-mono text-[11px] px-3 py-1.5 rounded-md" style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, color: MUTE }}>
            {k} <b style={{ color: BLUE, fontWeight: 600 }}>{v}</b>
          </span>
        ))}
      </div>
      <p className="font-sans text-sm leading-relaxed max-w-3xl mt-4" style={{ color: DIM }}>
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase mr-2" style={{ color: BLUE }}>{brand.name}</span>
        {brand.line}
      </p>
      <p className="font-sans text-xs leading-relaxed mt-2" style={{ color: MUTE }}>
        Everything above renders live: the markup never changes between brands; only the token values do. Fictional brands; every value clamped and contrast-checked at save.
      </p>
    </div>
  )
}

/* ── §11 · Contrast clamp, before → after ────────────────────────────────── */
function ClampDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 items-stretch">
      <figure className="rounded-2xl p-6" style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, borderTop: `3px solid ${RED}` }}>
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase mb-4" style={{ color: RED }}>Before · hand-themed</p>
        <div className="rounded-xl p-6 flex flex-col items-center gap-3" style={{ backgroundColor: ALT }}>
          <span className="font-sans text-sm font-semibold px-6 py-3 rounded-lg" style={{ backgroundColor: '#22355F', color: '#5A6B94' }}>
            Open an account
          </span>
          <span className="font-mono text-[11px] px-2.5 py-1 rounded" style={{ backgroundColor: 'rgba(192,57,43,0.1)', color: RED }}>
            2.4:1 · fails AA, shipped anyway
          </span>
        </div>
        <figcaption className="font-sans text-xs mt-4 leading-relaxed" style={{ color: MUTE }}>
          The FI's navy, pasted on by hand: value № 214 of 300.
        </figcaption>
      </figure>

      <div className="hidden md:flex items-center font-display text-3xl font-black" style={{ color: MUTE }} aria-hidden>→</div>

      <figure className="rounded-2xl p-6" style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, borderTop: `3px solid ${BLUE}` }}>
        <p className="font-mono text-[11px] tracking-[0.16em] uppercase mb-4" style={{ color: BLUE }}>After · token engine</p>
        <div className="rounded-xl p-6 flex flex-col items-center gap-3" style={{ backgroundColor: ALT }}>
          <span className="font-sans text-sm font-semibold px-6 py-3 rounded-lg" style={{ backgroundColor: '#22355F', color: '#FFFFFF' }}>
            Open an account
          </span>
          <span className="font-mono text-[11px] px-2.5 py-1 rounded" style={{ backgroundColor: 'rgba(43,68,224,0.08)', color: BLUE }}>
            4.9:1 · on-color derived, AA passes
          </span>
        </div>
        <figcaption className="font-sans text-xs mt-4 leading-relaxed" style={{ color: MUTE }}>
          Same navy, derived on-color: the clamp at work.
        </figcaption>
      </figure>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function BrandIdentityTokens() {
  usePageMeta(
    'Brand Identity Tokens by Stephen Hurt',
    'How one white-label banking platform learned to wear 500 brands: a typed, clamped token contract that replaced 300 hand-set values and made every theme accessible.'
  )

  return (
    <main style={{ backgroundColor: BG, color: BODY }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: INK, color: '#fff' }}>
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)',
            backgroundSize: '84px 84px',
            maskImage: 'radial-gradient(ellipse at 75% 35%, black 15%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 75% 35%, black 15%, transparent 70%)',
          }}
        />
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{ right: '-12%', top: '-25%', width: '65%', height: '130%', background: 'radial-gradient(circle at 60% 45%, rgba(43,68,224,0.3), transparent 62%)' }}
        />
        <div className={`${wrap} pt-32 pb-16 relative`}>
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Case Study · Q2 · Platform Design
          </p>
          <h1 className="font-display font-black leading-[0.95] mb-7" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            Brand Identity <span style={{ color: '#7C90FF' }}>Tokens</span>
          </h1>
          <p className="font-sans text-lg md:text-xl leading-relaxed max-w-2xl mb-6" style={{ color: 'rgba(255,255,255,0.78)' }}>
            One platform, five hundred brands. The styling contract that lets one banking codebase wear every customer's identity, safely.
          </p>
          <p className="font-sans text-base leading-relaxed max-w-2xl mb-14" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Q2 runs digital banking for roughly 500 banks and credit unions, and every one of them needs the same product to
            feel like <em>their</em> bank. I led the pod that replaced 300 hand-set values per theme with 41 typed, clamped
            tokens covering everything from typeface to card radius to glass blur, with accessibility enforced by the
            system instead of remembered by people.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            {[
              ['Role', 'Product Designer, design lead: token architecture, contrast engine, pod leadership'],
              ['Team', '2 product designers · PO · 5 platform engineers · accessibility specialist · 6 pilot FIs'],
              ['Surface', 'Web · iOS · Android'],
              ['Timeline', '8 months, audit to general availability · 2026'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{k}</p>
                <p className="font-sans text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.9)' }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE SHORT VERSION ────────────────────────────────────────────── */}
      <section className={`${wrap} pt-20 pb-4`}>
        <motion.div {...fadeUp}>
          <SectionLabel>The short version</SectionLabel>
          <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: INK }}>
            One system that wears 500 brands
          </h2>
          <p className="font-sans text-base md:text-lg leading-relaxed max-w-3xl mb-12">
            Every new financial institution meant weeks of hand-set values, a private fork of the last theme, bugs included.
            We replaced that with <em>Brand Identity Tokens</em>, a typed styling contract where every value is clamped to a
            safe range and every theme passes WCAG AA by construction. A marketing director with a hex code and twenty
            minutes can now re-theme an entire digital bank, and nothing needs review.
          </p>
        </motion.div>
        <motion.div {...fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <Stat value="12×"      label="faster theme setup, 6 weeks to 4 days per FI" />
          <Stat value="61→100%"  label="of themes passing WCAG AA" />
          <Stat value="340"      label="FIs migrated in the first 6 months" />
          <Stat value="41"       label="typed tokens replacing 300 hand-set values" />
        </motion.div>
      </section>

      {/* ── 01 THE BRIEF ─────────────────────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="01" label="The brief" title={'"Your bank, your brand," delivered by hand, 500 times'} />
          <div className="space-y-4 font-sans text-base leading-relaxed max-w-3xl mb-10">
            <p>
              Q2's platform ships the same product to roughly 500 banks and credit unions, and every one of them needs it to
              feel like their bank, not ours. The theming pipeline hadn't scaled with the customer base: each new FI meant
              weeks of hand-set values, and the brand promise had quietly become our biggest quality liability.
            </p>
            <p>
              I pitched, scoped and led Brand Identity Tokens, the system that lets one codebase wear five hundred brands
              safely. The deliverables were a 41-token styling contract (JSON + CSS), an FI theming console, a 40-component
              migration, and a plain-language brand guide. The constraints were brutal: zero visual regressions for 500 live
              FIs, WCAG AA everywhere, no end-user retraining.
            </p>
          </div>
        </motion.div>
        <motion.div {...fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <Stat value="6 wks"  label="average theme build, per FI" color={RED} />
          <Stat value="300"    label="hand-set values in every theme" color={RED} />
          <Stat value="39%"    label="of live themes failing WCAG AA somewhere" color={RED} />
          <Stat value="2.4k"   label="brand-related support tickets a year" color={RED} />
        </motion.div>
        <motion.p {...fadeUp} className="font-sans text-base leading-relaxed max-w-3xl">
          Every new FI was a fork of the last one: its values, and its bugs. At 50 customers that was a cost. At 500 it was
          a wall: professional services couldn't hire fast enough, and no two FIs' "blue" behaved the same way twice.
        </motion.p>
      </section>

      {/* ── 02 RESEARCH ──────────────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: ALT }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="02" label="Research" title="Five weeks: the people, the themes, the tickets" />
            <div className="flex flex-wrap gap-2 mb-12">
              {['14 FI admin interviews', 'Audit of all 500 live themes', '3 conversion shadowings', 'Ticket audit of 2,400 brand tickets', 'Teardown of 6 theming systems'].map((m) => (
                <span key={m} className="font-sans text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, color: DIM }}>{m}</span>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              ['01', 'FIs want range without the risk.',
                'They wanted real expression (square or rounded, hairlined or borderless, dense or airy, even glass) but never at the cost of members\' trust, or a compliance letter.',
                '"Give me my green and keep me out of trouble."', 'Marketing director, $800M credit union'],
              ['02', 'The palette was 300 separate decisions.',
                'The theme audit found no system underneath: buttons, links, charts and badges each carried their own hand-picked hex. Every FI was a bespoke fork; regressions were routine.',
                '"Every new FI is a copy-paste of the last one\'s bugs."', 'Implementation engineer, 9 years on the platform'],
              ['03', 'Nobody chose bad contrast. The system allowed it.',
                '39% of live themes had at least one AA failure, all of them shipped by us, none of them malicious. A brand navy pasted onto a button simply had nowhere to fail loudly.',
                '"The failures weren\'t decisions. They were defaults."', 'Accessibility specialist, platform team'],
              ['04', 'The person theming is a marketer with twenty minutes.',
                'The FI-side "designer" is a marketing director juggling nine jobs. Their brand kit is a logo, a hex code and a font from an old letterhead. Any system assuming design literacy would fail on contact.',
                '"I have a logo, a hex and a font from 2009. That\'s my brand kit."', 'Digital banking manager, community bank'],
            ].map(([no, head, body, quote, who]) => (
              <motion.article key={no} {...fadeUp} className="rounded-2xl p-7 flex flex-col" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-3" style={{ color: BLUE }}>Insight {no}</p>
                <h3 className="font-display text-xl font-bold mb-3 leading-snug" style={{ color: INK }}>{head}</h3>
                <p className="font-sans text-sm leading-relaxed mb-5" style={{ color: DIM }}>{body}</p>
                <blockquote className="mt-auto pl-4" style={{ borderLeft: `3px solid ${BLUE}` }}>
                  <p className="font-display text-base font-bold leading-snug mb-1" style={{ color: INK }}>{quote}</p>
                  <footer className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: MUTE }}>{who}</footer>
                </blockquote>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 THE REFRAME + CONVICTIONS ─────────────────────────────────── */}
      <section className="py-20">
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="03" label="The reframe" title="Stop shipping 500 custom themes" />
          </motion.div>
        </div>

        {/* Full-bleed thesis band: the one claim the whole project hangs on */}
        <motion.div {...fadeUp} className="my-14" style={{ backgroundColor: INK }}>
          <div className={`${wrap} py-16`}>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-6" style={{ color: '#7C90FF' }}>
              The reframe that changed the project · week 6
            </p>
            <p className="font-display font-black leading-tight max-w-4xl" style={{ fontSize: 'clamp(1.7rem, 3.8vw, 2.8rem)', color: '#fff' }}>
              We stopped shipping 500 custom themes and started shipping one system that wears 500 brands.
            </p>
          </div>
        </motion.div>

        <div className={wrap}>
          <motion.div {...fadeUp}>
            <p className="font-display text-xl md:text-2xl font-bold leading-snug mb-2" style={{ color: INK }}>Four convictions, each traced to an insight</p>
            <p className="font-sans text-sm leading-relaxed max-w-3xl mb-10" style={{ color: DIM }}>
              Every one traces to a research insight, and every one survived a fight.
            </p>
            <div style={{ borderLeft: `3px solid ${BLUE}` }} className="pl-6 md:pl-9">
              {[
                ['01', 'Brand is an input', 'The FI hands us identity; the system decides how it gets applied.', 'Insight 01'],
                ['02', 'The theme is a contract', 'Typed tokens with clamped ranges, radius to blur, derive into 300+ values.', 'Insight 02'],
                ['03', 'The engine owns accessibility', 'It enforces contrast; humans never have to remember to.', 'Insight 03'],
                ['04', 'Built for a marketer with twenty minutes', 'One hex code, zero jargon, and it still comes out right.', 'Insight 04'],
              ].map(([no, name, desc, src], i, arr) => (
                <div key={no} className="py-6 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : 'none' }}>
                  <span className="font-display font-black leading-none shrink-0" style={{ fontSize: '2.6rem', color: 'rgba(23,25,28,0.14)' }}>{no}</span>
                  <div>
                    <p className="font-display text-lg font-bold mb-1.5" style={{ color: INK }}>{name}</p>
                    <p className="font-sans text-sm leading-relaxed mb-2 max-w-2xl" style={{ color: DIM }}>{desc}</p>
                    <p className="font-mono text-[10px] tracking-[0.14em] uppercase" style={{ color: MUTE }}>← {src}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 04 THE TEAM ──────────────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: ALT }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="04" label="The team" title="A pod of nine, six pilot FIs, one standing council" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div {...fadeUp} className="rounded-2xl p-6" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-4" style={{ color: BLUE }}>The pod</p>
              <ul className="space-y-3">
                {[
                  ['Me', 'design lead: architecture, contrast engine, exec & FI reviews'],
                  ['PD · console', 'product designer: FI theming console, admin flows'],
                  ['PD · migration', 'product designer: 40-component audit & token mapping'],
                  ['PO', 'backlog, pilot sequencing, the "no" to new knobs'],
                  ['Eng ×5', 'platform engineers: token runtime, preview, CI checks'],
                  ['A11y', 'specialist: clamp thresholds, audit tooling (fractional)'],
                ].map(([who, what]) => (
                  <li key={who}>
                    <p className="font-sans text-sm font-semibold" style={{ color: INK }}>{who}</p>
                    <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{what}</p>
                  </li>
                ))}
              </ul>
              <p className="font-sans text-xs leading-relaxed mt-4 pt-4" style={{ color: MUTE, borderTop: `1px solid ${LINE}` }}>
                Plus six pilot FIs, from a $12B bank to a $200M credit union, who reviewed every round.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="rounded-2xl p-6" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-4" style={{ color: BLUE }}>Held vs. handed off</p>
              <p className="font-sans text-sm font-semibold mb-2" style={{ color: INK }}>I held</p>
              <ul className="font-sans text-sm leading-relaxed space-y-1 mb-5" style={{ color: DIM }}>
                <li>Token architecture & naming</li>
                <li>Contrast-clamp rules</li>
                <li>Exec & pilot-FI reviews</li>
                <li>The final quality bar</li>
              </ul>
              <p className="font-sans text-sm font-semibold mb-2" style={{ color: INK }}>I handed off</p>
              <ul className="font-sans text-sm leading-relaxed space-y-1" style={{ color: DIM }}>
                <li>Console flows (PD 1, end to end)</li>
                <li>Component audit (PD 2)</li>
                <li>Docs site & brand guide</li>
                <li>Figma library build</li>
              </ul>
              <p className="font-sans text-xs leading-relaxed mt-4 pt-4" style={{ color: MUTE, borderTop: `1px solid ${LINE}` }}>
                Both workstreams shipped better than my first drafts, which is the point of handing them off.
              </p>
            </motion.div>

            <motion.div {...fadeUp} className="rounded-2xl p-6" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-4" style={{ color: BLUE }}>The rituals</p>
              <ul className="space-y-3">
                {[
                  ['Weekly', 'token council: design, eng, PO; 45 min, standing agenda, decisions logged'],
                  ['Biweekly', 'pilot FI review: real brands run through the engine, live'],
                  ['Fridays', 'pod crit: work-in-progress, no slides allowed'],
                  ['Monthly', 'office hours: other Q2 product teams adopting the tokens'],
                ].map(([when, what]) => (
                  <li key={when}>
                    <p className="font-sans text-sm font-semibold" style={{ color: INK }}>{when}</p>
                    <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{what}</p>
                  </li>
                ))}
              </ul>
              <p className="font-sans text-xs leading-relaxed mt-4 pt-4" style={{ color: MUTE, borderTop: `1px solid ${LINE}` }}>
                The council is where the fights in section 07 were actually won.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 05 TOKEN ARCHITECTURE ────────────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="05" label="Token architecture" title="From 300 hand-set values to 41 typed tokens" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div {...fadeUp} className="rounded-2xl p-7" style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, borderTop: `3px solid ${RED}` }}>
            <div className="flex items-baseline justify-between mb-3">
              <p className="font-display text-xl font-bold" style={{ color: INK }}>Before</p>
              <p className="font-mono text-[10px] tracking-[0.14em] uppercase" style={{ color: RED }}>✕ Retired</p>
            </div>
            <p className="font-sans text-sm leading-relaxed mb-6" style={{ color: DIM }}>
              Every value hand-set, per FI: a private fork of the palette for each customer.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['primary-blue', 'header-bg', 'btn-bg', 'btn-bg-alt', 'link-color', 'nav-active', 'chart-1', 'focus-ring', 'badge-bg', 'footer-bg', 'alert-tint', '…290 more'].map((t) => (
                <span key={t} className="font-mono text-[11px] px-2.5 py-1 rounded-md" style={{ backgroundColor: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.2)', color: 'rgba(192,57,43,0.85)' }}>{t}</span>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="rounded-2xl p-7" style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, borderTop: `3px solid ${BLUE}` }}>
            <div className="flex items-baseline justify-between mb-3">
              <p className="font-display text-xl font-bold" style={{ color: INK }}>After</p>
              <p className="font-mono text-[10px] tracking-[0.14em] uppercase" style={{ color: BLUE }}>● Shipped</p>
            </div>
            <p className="font-sans text-sm leading-relaxed mb-6" style={{ color: DIM }}>
              Forty-one typed inputs cascade through semantic roles into every component, in every mode.
            </p>
            <div className="space-y-2.5">
              {[
                ['identity', 'brand color · logo'],
                ['expression', 'typeface · radius · border · blur · spacing · columns'],
                ['semantic', '28 roles'],
                ['derived', '300+ values · 4 modes'],
              ].map(([layer, detail], i) => (
                <div key={layer} className="flex items-center gap-3">
                  <span className="font-mono text-[11px] font-semibold px-3 py-1.5 rounded-md shrink-0" style={{ backgroundColor: 'rgba(43,68,224,0.07)', border: '1px solid rgba(43,68,224,0.25)', color: BLUE }}>{layer}</span>
                  {i < 3 && <span aria-hidden style={{ color: MUTE }}>↓</span>}
                  <span className="font-sans text-xs" style={{ color: DIM }}>{detail}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.p {...fadeUp} className="font-sans text-xs mt-4 leading-relaxed" style={{ color: MUTE }}>
          Every pixel traces to a typed, clamped token. Schema co-written with platform engineering: one JSON, read by design and code.
        </motion.p>
      </section>

      {/* ── 06 ITERATIONS ────────────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: ALT }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="06" label="Iterations" title="The theming model took three lives" />
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
              Week 6 was divergence on paper, four ways to let a bank be itself: free CSS, twelve skins, a theme
              marketplace, and typed tokens with an engine. Every round after that got the same test, with six pilot FIs
              running the same brand kits through the same tasks. Two rounds got honest funerals.
            </p>
          </motion.div>
          <div className="relative">
            <div className="hidden md:block absolute left-0 right-0 top-[7px] h-px" style={{ backgroundColor: LINE }} aria-hidden />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 relative">
              {[
                ['R1 · The escape hatch', '✕ Killed, week 8', RED,
                  'Per-FI custom CSS. Power for the 5% of FIs with agencies, chaos for the rest, and un-upgradeable forever. The audit data killed it in one council.'],
                ['R2 · The skin catalog', '✕ Killed, week 11', RED,
                  'Twelve tasteful presets. The pilot FIs\' verdict was unanimous: "none of these are us." Identity isn\'t a dropdown.'],
                ['R3 · Tokens + engine', '● Shipped', BLUE,
                  'Forty-one typed tokens, typeface to card radius, blur to column width. Every range clamped, everything else derived. FIs look like themselves; the platform stays one product.'],
              ].map(([name, status, c, body], i, arr) => (
                <motion.div key={name} {...fadeUp} className="relative">
                  <span className="w-3.5 h-3.5 rounded-full block mb-4 relative z-10" style={{ backgroundColor: c, border: `2px solid ${ALT}` }} aria-hidden />
                  <p className="font-mono text-[10px] tracking-[0.14em] uppercase mb-3" style={{ color: c }}>{status}</p>
                  <p className="font-display text-lg font-bold leading-snug mb-2" style={{ color: INK, opacity: c === RED ? 0.55 : 1 }}>{name}</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM, opacity: c === RED ? 0.7 : 1 }}>{body}</p>
                  {i < arr.length - 1 && (
                    <span className="hidden md:block absolute -right-6 top-0 font-display text-base" style={{ color: MUTE }} aria-hidden>→</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 07 KEY DECISIONS ─────────────────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="07" label="Key decisions" title="Three fights worth having" />
        </motion.div>
        <div className="space-y-8">
          {[
            ['D.01', 'Forty-one typed tokens instead of free CSS',
              'Agencies wanted a stylesheet; sales wanted a knob for every lost deal. We took it to the audit instead: across 500 live themes, what FIs actually varied was a finite vocabulary of brand color, typeface, card radius, borders, surface color and opacity, blur, spacing and column widths. So each became a typed token with a clamped range (radius 0–24, opacity floors, blur caps, spacing steps) and nothing became free CSS. The token council held that line deal by deal, the PO and I absorbing the pushback together. Real expressive range, zero un-upgradeable forks.',
              'Expression is a range, not a free field.'],
            ['D.02', 'The contrast clamp: your brand, readable',
              'When a brand navy fails on a surface, the engine shifts the derived on-color\'s lightness inside the brand hue until it clears AA. When an FI dials a card toward glass, the clamp floors the opacity and caps the blur so the balance printed on it never drops below 4.5:1. Every adjustment is shown to the admin in the preview, with the why. Brand purists at two pilot FIs objected to any adjustment at all; our accessibility specialist brought member-complaint data, I brought side-by-sides, and the clamp became the system\'s most-loved feature in the follow-up interviews. Never silent, never optional.',
              'Your brand, readable. It\'s both, or neither ships.'],
            ['D.03', 'Tokens are the API: one JSON, read by everyone',
              'I co-designed the schema with our platform engineers so the same file drives the runtime CSS, the Figma libraries, and the FI console\'s live preview. Design reviews the schema in the same pull requests as code; the handoff didn\'t get better, it disappeared. CI fails a theme that breaks the clamp, which means accessibility regressions are now a build error instead of a Q3 audit finding.',
              'Design and code stopped exchanging artifacts and started sharing a source.'],
          ].map(([no, head, body, pull]) => (
            <motion.article key={no} {...fadeUp} className="rounded-2xl p-7 md:p-9" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-3" style={{ color: BLUE }}>{no}</p>
              <h3 className="font-display text-2xl font-bold mb-4 leading-snug" style={{ color: INK }}>{head}</h3>
              <p className="font-sans text-base leading-relaxed max-w-3xl mb-6">{body}</p>
              <p className="font-display text-lg font-bold pl-4" style={{ color: INK, borderLeft: `3px solid ${BLUE}` }}>“{pull}”</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* ── 08 THE PROOF (live demo) ─────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: ALT }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="08" label="The proof" title="One dashboard, three charters, and every difference is a token" />
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
              The same dashboard, themed for three fictional charters. Type, radius, border, surface, blur, spacing and
              columns are all tokens. Switch brands and watch the identical components put on a different identity.
            </p>
          </motion.div>
          <motion.div {...fadeUp}>
            <BrandSwitcher />
          </motion.div>
        </div>
      </section>

      {/* ── 09 THE SPEC ──────────────────────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="09" label="The spec" title="The token contract: 41 inputs, 28 roles, 300+ derived values" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            ['Color · the identity tokens',
              'The FI hands over one true color; a brand tint, action colors and on-colors are all derived from it. No FI ever sets a component value. Inputs cascade; the system derives, which is why nothing drifts.'],
            ['Surface · radius, border, background, blur',
              'Card background, opacity, blur, border and radius are all FI tokens, each with a clamped range (radius 0–24, opacity floors, blur caps), each checked against the content it carries.'],
            ['Rhythm · spacing & columns',
              'The spacing scale and column widths are tokens too. An FI chooses a density, dense 4-column or airy 2-column, and every tile reflows on the same grid, and nothing breaks.'],
            ['The clamp · contrast math',
              'Text holds 4.5:1 minimum, enforced at save; controls and focus rings hold 3:1; glass surfaces get opacity floors and blur caps per surface. Derived on-colors shift lightness inside the brand hue until they clear the bar. Shown to the admin, never silent.'],
            ['Type · the FI\'s voice, on the platform\'s scale',
              'brand.typeface is an FI token, chosen from a vetted and licensed list. The scale, line-heights, tabular numerals and minimum sizes stay platform tokens, so a playful font can never shrink a disclosure.'],
            ['Modes · generated automatically',
              'Light is the FI\'s theme exactly as set. Dark is derived: surfaces invert, brand hue preserved. High-contrast tightens the clamp toward AAA, and reduced-transparency falls glass back to solid. Four modes per FI from one set of tokens; nobody hand-designs 2,000 themes.'],
          ].map(([head, body]) => (
            <motion.div key={head} {...fadeUp} className="rounded-2xl p-6" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
              <p className="font-display text-lg font-bold mb-3 leading-snug" style={{ color: INK }}>{head}</p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUp} className="rounded-2xl p-7 mt-5" style={{ backgroundColor: INK, color: '#fff' }}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-5" style={{ color: '#7C90FF' }}>
            Access: enforced for all 500
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ['AA', 'contrast checked at theme save; failing themes can\'t ship'],
              ['200%', 'dynamic type in any FI\'s typeface, zero clipped strings'],
              ['Focus', 'rings derived per brand, 3:1 minimum everywhere'],
              ['Modes', 'light · dark · high-contrast, generated per FI'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="font-display text-2xl font-black mb-1.5" style={{ color: '#7C90FF' }}>{k}</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{v}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.p {...fadeUp} className="font-sans text-xs mt-4 leading-relaxed" style={{ color: MUTE }}>
          The token contract, abridged: one JSON that Figma, web, iOS and Android all read.
        </motion.p>
      </section>

      {/* ── 10 VALIDATION ────────────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: ALT }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="10" label="Validation" title="Six pilot FIs, then the long tail" />
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
              Every round used the same brand kits and the same tasks, so the numbers compare cleanly. The clearest single
              artifact is the button below: the same FI navy, before and after the engine.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="mb-12">
            <ClampDemo />
          </motion.div>

          <motion.div {...fadeUp} className="overflow-x-auto rounded-xl mb-8" style={{ border: `1px solid ${LINE}` }}>
            <table className="w-full text-left border-collapse" style={{ backgroundColor: CARD }}>
              <thead>
                <tr style={{ backgroundColor: BG }}>
                  {['Measure', 'Before', 'After', 'Change'].map((h) => (
                    <th key={h} className="font-mono text-[10px] tracking-[0.12em] uppercase px-4 py-3" style={{ color: MUTE }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Theme setup, per FI', '6 weeks', '4 days', '−93%'],
                  ['Values set by hand', '300', '41 typed', '−86%'],
                  ['Themes passing WCAG AA', '61%', '100%', 'solved'],
                  ['FI admin SUS score', '58', '88', '+30'],
                  ['Brand tickets, quarterly', '610', '140', '−77%'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${LINE}` }}>
                    {row.map((cell, j) => (
                      <td key={j} className={`font-sans text-sm px-4 py-3 align-top ${j === 3 ? 'font-semibold' : ''}`} style={{ color: j === 0 ? INK : j === 3 ? BLUE : DIM }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          <motion.p {...fadeUp} className="font-sans text-base leading-relaxed max-w-3xl">
            The number I'm proudest of isn't in the table: during the pilot, a marketing director re-themed their entire
            digital bank (web and both apps) alone, in 22 minutes, and nothing needed review.
          </motion.p>
        </div>
      </section>

      {/* ── 11 IMPACT ────────────────────────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="11" label="Impact" title="Six months after general availability" />
        </motion.div>
        <motion.div {...fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <Stat value="340"  label="FIs migrated to tokens" />
          <Stat value="100%" label="of migrated themes passing AA" />
          <Stat value="12×"  label="faster theme setup" />
          <Stat value="0"    label="visual-regression rollbacks" />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            ['"For the first time, the app looks like our brand, and I did it myself, without a single email to support."', 'Marketing director, pilot credit union'],
            ['"The token contract deleted a whole class of bugs, and a whole class of meetings."', 'Platform engineering lead'],
          ].map(([q, who]) => (
            <motion.figure key={who} {...fadeUp} className="rounded-2xl p-7" style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, borderLeft: `3px solid ${BLUE}` }}>
              <blockquote className="font-display text-lg font-bold leading-snug mb-3" style={{ color: INK }}>{q}</blockquote>
              <figcaption className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: MUTE }}>{who}</figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* ── 12 REFLECTION ────────────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: INK, color: '#fff' }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="12" label="Reflection" title="What I'd do differently" light />
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-12" style={{ color: 'rgba(255,255,255,0.72)' }}>
              A group product manager's read on the whole thing: "the tokens changed what our customers believe is
              possible on a shared platform."
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
            {[
              ['Pilot the ugliest brand first', 'We recruited friendly pilots with tasteful navies. The FI with neon-orange-on-black found the engine\'s real edge cases in week 20; they should have been in the room in week 8.'],
              ['Plain language beats the spec', 'Marketing directors never read the 40-page token spec. The one-pager, "here\'s what we do with your color, and why," did more for adoption than the entire docs site. I\'d write it first next time.'],
              ['Hand off sooner', 'I held the console flows three sprints longer than I needed to. The designer I handed them to beat my version within one. Delegation is a design decision, and I\'d make it earlier.'],
            ].map(([t, b], i) => (
              <div key={t} className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.28)' }}>
                <p className="font-mono text-[11px] tracking-[0.18em] mb-4" style={{ color: '#7C90FF' }}>0{i + 1}</p>
                <p className="font-display text-xl font-bold mb-3">{t}</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>{b}</p>
              </div>
            ))}
          </motion.div>
          <motion.p {...fadeUp} className="font-display text-xl md:text-2xl font-bold leading-snug max-w-3xl">
            What I'd keep, forever: <span style={{ color: '#7C90FF' }}>the clamp: automated, explained, non-negotiable.</span>
          </motion.p>
        </div>
      </section>

      {/* ── NEXT PROJECT ─────────────────────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <div style={{ borderTop: `1px solid ${LINE}` }} className="pt-12">
          <Link to="/magic-signal" className="group inline-block">
            <p className="font-sans text-sm mb-2" style={{ color: MUTE }}>Next project</p>
            <h3 className="font-display font-black leading-none transition-opacity duration-300 group-hover:opacity-60" style={{ fontSize: 'clamp(2rem,5vw,4rem)', color: INK }}>
              Magic Signal
            </h3>
          </Link>
        </div>
      </section>

    </main>
  )
}
