import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import CaseTLDR from '../../components/CaseTLDR'
import usePageMeta from '../../hooks/usePageMeta'

// ── Palette ───────────────────────────────────────────────────────────────────
const BG        = '#0A0A0A'
const TEXT      = '#F2F2F0'
const DIM       = 'rgba(242,242,240,0.5)'
const DIMMER    = 'rgba(242,242,240,0.3)'
const ACCENT    = '#5B8DEA'
const ACCENT_DIM = 'rgba(91,141,234,0.18)'
const RULE      = 'rgba(242,242,240,0.1)'

// ── Screen images ─────────────────────────────────────────────────────────────
const SCREENS = Array.from({ length: 9 }, (_, i) =>
  i === 0 ? '/images/magicSignal/Group 124.png' : `/images/magicSignal/Group 124-${i}.png`
)

// ── Scroll-triggered fade-up ──────────────────────────────────────────────────
const fadeUp = {
  initial:    { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport:   { once: true, margin: '-60px' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
}

const fadeIn = {
  initial:    { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport:   { once: true, margin: '-60px' },
  transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
}

// ── Minimal dark nav ──────────────────────────────────────────────────────────
// ── Section label + heading helper ───────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="font-sans text-xs tracking-[0.2em] uppercase mb-4" style={{ color: DIMMER }}>
      {children}
    </p>
  )
}

// ── Horizontal rule ───────────────────────────────────────────────────────────
function Rule() {
  return <div className="w-full h-px" style={{ backgroundColor: RULE }} />
}

// ── Main component ────────────────────────────────────────────────────────────
export default function MagicSignal() {
  usePageMeta(
    'Magic Signal by Stephen Hurt',
    'A self-initiated AI stock-analysis app, designed, built, and shipped solo to iOS & Android, and the AI fluency it brought back to my product work at Q2.'
  )
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 800], ['0%', '-18%'])

  return (
    <main style={{ backgroundColor: BG, color: TEXT }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-0 h-screen overflow-hidden flex flex-col justify-end">
          {/* Hero background image: inset-0 so it matches homepage pill proportions */}
          <div className="absolute inset-0" style={{
            backgroundImage: `url('/images/magicSignal/magicSignalHero.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }} />
        {/* Overlays + phone screens: parallax */}
        <motion.div
          className="absolute pointer-events-none flex items-center justify-end"
          style={{ y: bgY, top: '-20%', bottom: '-20%', left: 0, right: 0 }}
        >
          {/* Subtle dark vignette so text stays legible */}
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to right, rgba(4,4,18,0.70) 0%, rgba(4,4,18,0.25) 40%, rgba(4,4,18,0.00) 58%)`,
          }} />
          {/* Bottom fade into page */}
          <div className="absolute bottom-0 left-0 right-0 h-48" style={{
            background: `linear-gradient(to bottom, transparent, #0A0A0A)`,
          }} />

          {/* App screens staggered on the right */}
          <div className="hidden md:flex items-start pr-14" style={{ marginTop: '-4vh' }}>
            {[
              { idx: 1, mt: 60, ml: 0,   zIndex: 1 },
              { idx: 3, mt: 0,  ml: -28, zIndex: 3 },
              { idx: 6, mt: 80, ml: -28, zIndex: 1 },
            ].map(({ idx, mt, ml, zIndex }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.4 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flex-shrink-0"
                style={{ width: 'clamp(225px, 19.5vw, 300px)', marginTop: mt, marginLeft: ml, zIndex, position: 'relative' }}
                aria-hidden={i !== 1 ? 'true' : undefined}
              >
                <img
                  src={SCREENS[idx]}
                  alt={i === 1 ? 'Magic Signal app: the AI stock-signal interface, verdict-first with a signal-strength ring' : ''}
                  className="w-full h-auto block"
                  style={{
                    borderRadius: '3rem',
                    boxShadow: '0 40px 80px rgba(0,0,0,0.8)',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hero text: bottom left */}
        <div
          className="relative z-10 px-8 md:px-14 pb-16 md:pb-20 max-w-3xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-2 mb-7"
          >
            {['Product Design', 'Founder', 'Mobile'].map(t => (
              <span
                key={t}
                className="font-sans text-xs px-3 py-1.5 rounded-full border"
                style={{ borderColor: 'rgba(91,141,234,0.4)', color: 'rgba(91,141,234,0.9)' }}
              >
                {t}
              </span>
            ))}
          </motion.div>

          <div className="overflow-hidden pb-4">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black leading-[0.88] mb-6"
              style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', color: TEXT }}
            >
              Magic Signal
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-lg md:text-xl leading-relaxed max-w-xl"
            style={{ color: DIM }}
          >
            A self-initiated app built to solve a problem I lived daily, and the hands-on AI fluency it unlocked that now shapes how I approach product design at Q2.
          </motion.p>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: DIMMER }}
        >
          <div className="w-px h-12 overflow-hidden">
            <motion.div
              className="w-full h-full"
              style={{ backgroundColor: DIMMER }}
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.4 }}
            />
          </div>
        </motion.div>
      </section>

      <div className="relative z-10" style={{ backgroundColor: BG }}>

      {/* ── TL;DR ────────────────────────────────────────────────────────────── */}
      <CaseTLDR
        colors={{ text: TEXT, dim: DIM, accent: ACCENT, surface: 'rgba(242,242,240,0.04)', rule: RULE }}
        summary={`A self-initiated app for a problem I lived as a retail investor: live options data, real-time news, and AI synthesis in one verdict-first view. I designed, built, and shipped it solo to both app stores. It sunset after six months as general LLMs caught up, but the AI fluency it gave me transferred straight into my production work at Q2.`}
        stats={[
          { value: 'Solo', label: 'Designed, built & shipped end-to-end' },
          { value: '2', label: 'App stores: iOS & Android' },
          { value: '50', label: 'Paying subscribers at peak' },
          { value: '6 mo', label: 'A full ship-to-sunset cycle' },
        ]}
      />

      {/* ── OVERVIEW STRIP ───────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-14 border-t border-b" style={{ borderColor: RULE }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { label: 'Role',     value: 'Product Design & Development - solo, end-to-end' },
              { label: 'Platform', value: 'iOS & Android via Capacitor' },
              { label: 'Timeline', value: '2024 - 6 months, shipped to both stores' },
              { label: 'Status',   value: 'Shipped & sunsetted, learning transferred directly to production AI work at Q2' },
            ].map(item => (
              <div key={item.label}>
                <p className="font-sans text-xs tracking-[0.18em] uppercase mb-3" style={{ color: DIMMER }}>
                  {item.label}
                </p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                  {item.value}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── THE PROBLEM ──────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 pt-28 pb-0">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp}>
            <SectionLabel>The Problem</SectionLabel>
          </motion.div>

          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
            <motion.h2
              {...fadeUp}
              className="font-display font-black leading-[0.9]"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', color: TEXT }}
            >
              Raw data and AI insight, but never in the same place.
            </motion.h2>

            <motion.div {...fadeUp} className="space-y-5 pt-2" style={{ color: DIM }}>
              <p className="font-sans text-base leading-relaxed">
                Magic Signal wasn't a client project or a design brief. It was built for me. As an active retail investor, I kept running into the same wall: AI tools like ChatGPT could explain market concepts clearly but had no access to live data. Meanwhile, platforms like Unusual Whales surfaced real-time options flow, often a leading indicator of institutional moves, but interpreting it required domain expertise most retail investors don't have.
              </p>
              <p className="font-sans text-base leading-relaxed">
                I built the tool I wanted to exist. No traditional process, no stakeholder review, no PRD. Just 18 months of personal friction with this workflow, a clear idea of what would fix it, and the decision to ship it.
              </p>
            </motion.div>
          </div>

          {/* Problem bullets */}
          <motion.div
            {...fadeUp}
            className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-px"
            style={{ backgroundColor: RULE }}
          >
            {[
              {
                num: '01',
                heading: 'Data without context',
                body: 'Retail investors could find options flow data. They couldn\'t interpret it without 1-2 hours of additional research per ticker.',
              },
              {
                num: '02',
                heading: 'AI has a knowledge cutoff',
                body: 'AI tools were the most common secondary step, but users universally hit the same wall. The answer might be months out of date.',
              },
              {
                num: '03',
                heading: 'The action window is hours',
                body: 'Unusual options contracts that precede major moves are most actionable within 4-8 hours. Any latency kills the signal.',
              },
              {
                num: '04',
                heading: 'No mobile product bridged the gap',
                body: 'No single mobile product combined live data, real-time news, and AI synthesis in one actionable view.',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 md:p-10"
                style={{ backgroundColor: BG }}
              >
                <p className="font-display text-4xl font-black mb-5" style={{ color: ACCENT_DIM.replace('0.18', '0.35') }}>
                  {item.num}
                </p>
                <p className="font-display text-xl font-bold mb-3" style={{ color: TEXT }}>
                  {item.heading}
                </p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                  {item.body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── DESIGN APPROACH ──────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 pt-32 pb-0">
        <div className="max-w-6xl mx-auto">
          <Rule />
          <div className="pt-20">
            <motion.div {...fadeUp}>
              <SectionLabel>Design Approach</SectionLabel>
              <h2
                className="font-display font-black leading-[0.88] mt-2"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', color: TEXT, maxWidth: '18ch' }}
              >
                Synthesis first. Data second.
              </h2>
            </motion.div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
              <motion.div {...fadeUp} className="space-y-5" style={{ color: DIM }}>
                <p className="font-sans text-base leading-relaxed">
                  The core design decision was hierarchy. Every existing tool put the raw data
                  front and center, tables of options flow, columns of numbers, industry
                  shorthand. Users would arrive informed, leave confused, and never act.
                </p>
                <p className="font-sans text-base leading-relaxed">
                  Magic Signal inverted this. The primary surface is the synthesized verdict:
                  one sentence, one direction: bullish or bearish. The AI output, the options
                  data, the news context, all present, but subordinate. You read the verdict
                  in under 5 seconds. You drill into sources if you want to.
                </p>
                <p className="font-sans text-base leading-relaxed">
                  The signal strength ring encodes confidence as a proportion. High certainty
                  fills ~75% of the arc. Low confidence fills ~25% in amber. The intended read
                  order was confidence first, verdict second. Arc-fill communicates certainty faster than any text label.
                </p>
              </motion.div>

              {/* Design principles */}
              <motion.div {...fadeUp} className="space-y-0">
                {[
                  {
                    num: '01',
                    label: 'Verdict over data',
                    desc: 'One synthesized sentence at the top. All source data below it, collapsed by default.',
                  },
                  {
                    num: '02',
                    label: 'Confidence is visual',
                    desc: 'A signal strength ring encodes certainty as arc-fill, readable at a glance without parsing numbers.',
                  },
                  {
                    num: '03',
                    label: 'Graceful degradation',
                    desc: 'One failed data source doesn\'t kill the signal. The ring switches to amber. Analysis continues.',
                  },
                  {
                    num: '04',
                    label: 'Honesty about uncertainty',
                    desc: 'When sources conflict: "Mixed signals - no clear direction." Trust over false conviction.',
                  },
                ].map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-start gap-6 py-7 border-b"
                    style={{ borderColor: RULE }}
                  >
                    <span
                      className="font-display text-sm font-bold flex-shrink-0 mt-0.5"
                      style={{ color: ACCENT, opacity: 0.6 }}
                    >
                      {p.num}
                    </span>
                    <div>
                      <p className="font-display text-base font-bold mb-1.5" style={{ color: TEXT }}>
                        {p.label}
                      </p>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                        {p.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SIGNAL DETAIL ────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 pt-32 pb-0">
        <div className="max-w-6xl mx-auto">
          <Rule />
          <div className="pt-20 grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Left: featured screen */}
            <motion.div
              {...fadeIn}
              className="relative flex justify-center"
            >
              <div
                className="rounded-[2.5rem] overflow-hidden"
                style={{
                  width: 280,
                  boxShadow: '0 40px 80px rgba(0,0,0,0.7)',
                  border: '1px solid rgba(91,141,234,0.2)',
                }}
              >
                <img src={SCREENS[2]} alt="Signal detail screen" className="w-full block" />
              </div>

              {/* Callout labels */}
              {[
                { top: '14%',  text: 'Signal strength ring', sub: 'Confidence as arc proportion' },
                { top: '42%',  text: 'Synthesized verdict',  sub: 'One sentence, one direction' },
                { top: '65%',  text: 'Source rows',          sub: 'Collapsed - tap to expand' },
              ].map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
                  className="absolute left-[calc(50%+155px)] flex items-center gap-3"
                  style={{ top: c.top, display: 'none' }}
                >
                  <div className="w-8 h-px" style={{ backgroundColor: ACCENT, opacity: 0.5 }} />
                  <div>
                    <p className="font-sans text-xs font-semibold" style={{ color: TEXT }}>{c.text}</p>
                    <p className="font-sans text-[10px]" style={{ color: DIMMER }}>{c.sub}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right: annotations */}
            <motion.div {...fadeUp} className="space-y-0 pt-2">
              <SectionLabel>Signal Detail</SectionLabel>
              <h3
                className="font-display font-black leading-[0.9] mb-10"
                style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: TEXT }}
              >
                The interface does the synthesis.
              </h3>

              <div className="space-y-0">
                {[
                  {
                    num: '01',
                    title: 'Signal strength ring',
                    body: 'The ring encodes confidence as a proportion, ~75% fill for high certainty, ~25% in amber for low. Arc-fill communicates certainty before you read the verdict text. Confidence first was the intended hierarchy.',
                  },
                  {
                    num: '02',
                    title: 'One synthesized verdict',
                    body: 'One sentence, one direction. The full GPT-4o output is available behind a tap, but the primary read takes under 5 seconds, designed specifically around the 4-8 hour action window.',
                  },
                  {
                    num: '03',
                    title: 'Expandable source rows',
                    body: 'Options flow, news context, and financial health are each a collapsed row. Present for transparency, visually subordinate to the verdict. Power users can drill in; casual users never have to.',
                  },
                  {
                    num: '04',
                    title: 'Color + text redundancy',
                    body: 'Direction is always expressed in both color and text label. WCAG colorblind-safe and improves legibility in bright-light conditions.',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-5 py-8 border-b"
                    style={{ borderColor: RULE }}
                  >
                    <span
                      className="font-display text-sm font-bold flex-shrink-0 mt-0.5 w-7"
                      style={{ color: ACCENT, opacity: 0.6 }}
                    >
                      {item.num}
                    </span>
                    <div>
                      <p className="font-display text-base font-bold mb-2" style={{ color: TEXT }}>
                        {item.title}
                      </p>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                        {item.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── APP SCREENS GALLERY ───────────────────────────────────────────────── */}
      <motion.section {...fadeIn} className="mt-28">
        {/* Ticker strip */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-5"
            style={{ width: 'max-content' }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 40 }}
          >
            {[...SCREENS, ...SCREENS].map((src, i) => {
              const isDuplicate = i >= SCREENS.length
              return (
                <div
                  key={i}
                  className="flex-shrink-0"
                  style={{ width: 300 }}
                  aria-hidden={isDuplicate ? 'true' : undefined}
                >
                  <img
                    src={src}
                    alt={isDuplicate ? '' : `Magic Signal app: stock-signal screen ${(i % SCREENS.length) + 1} of ${SCREENS.length}`}
                    className="w-full h-auto block"
                    style={{
                      borderRadius: '1.5rem',
                      boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                      border: '1px solid rgba(91,141,234,0.12)',
                    }}
                  />
                </div>
              )
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* ── OUTCOME ──────────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 pt-32 pb-0">
        <div className="max-w-6xl mx-auto">
          <Rule />
          <div className="pt-20">
            <motion.div {...fadeUp}>
              <SectionLabel>Outcome</SectionLabel>
            </motion.div>

            {/* Big number */}
            <motion.div
              {...fadeUp}
              className="mt-6 mb-16"
            >
              <p
                className="font-display font-black leading-none"
                style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', color: TEXT }}
              >
                50
              </p>
              <p className="font-sans text-base mt-2" style={{ color: DIM }}>
                paying subscribers at peak, App Store + Google Play, before sunsetting after six months
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ backgroundColor: RULE }}>
              {[
                {
                  label: 'Solo end-to-end',
                  body: 'Designed, built, shipped, and maintained by one person, from first sketch to both app stores.',
                },
                {
                  label: 'Live in both stores',
                  body: 'Successfully navigated App Store and Google Play review, including compliance with financial disclosure requirements.',
                },
                {
                  label: 'Real AI pipeline',
                  body: 'Production system combining Unusual Whales options flow, dual Perplexity AI sources, and GPT-4o synthesis in real time.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="p-10"
                  style={{ backgroundColor: BG }}
                >
                  <div
                    className="w-8 h-px mb-6"
                    style={{ backgroundColor: ACCENT, opacity: 0.6 }}
                  />
                  <p className="font-display text-xl font-bold mb-3" style={{ color: TEXT }}>
                    {item.label}
                  </p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REFLECTION ───────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 pt-28 pb-0">
        <div className="max-w-6xl mx-auto">
          <Rule />
          <div className="pt-20">
            <motion.div {...fadeUp}>
              <SectionLabel>Reflection</SectionLabel>
              <blockquote
                className="font-display font-black leading-[0.9] mt-4 max-w-3xl"
                style={{ fontSize: 'clamp(1.8rem, 4vw, 3.2rem)', color: TEXT }}
              >
                "I built a product that didn't survive the market. The skills did."
              </blockquote>
              <div className="mt-10 space-y-5 max-w-3xl" style={{ color: DIM }}>
                <p className="font-sans text-base leading-relaxed">
                  Magic Signal was never meant to be a startup. It was a learning vehicle built around a real personal problem, and I treated it that way. No investor pressure, no roadmap obligations, no design-by-committee. That freedom meant I could make fast decisions and go deep on the AI implementation layer in a way a typical design engagement wouldn't allow.
                </p>
                <p className="font-sans text-base leading-relaxed">
                  The product sunsetted after six months. As general-purpose LLMs gained live data access, the moat, AI interpretation of real-time options flow, became something users could approximate through ChatGPT directly. Most retail investors wanted to ask a general-purpose tool anything, not commit to a specialized app. That's a market insight, not a design failure. The problem was real. The delivery mechanism I chose wasn't where the market landed.
                </p>
                <p className="font-sans text-base leading-relaxed">
                  What I came away with was AI fluency that most product designers in 2024 didn't have: building system prompts, structuring user prompts, managing streaming API responses, optimizing tokens, and thinking through input/output cost as a design constraint. All of it transferred directly and immediately into my work at Q2.
                </p>
              </div>
            </motion.div>

            {/* Q2 Impact grid */}
            <motion.div
              {...fadeUp}
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-px"
              style={{ backgroundColor: RULE }}
            >
              {[
                {
                  label: 'AI Workshop',
                  body: 'Before the workshop, the Director of Product set up a 1:1 to understand how I was shipping so quickly. Word had gotten around. That conversation led to a team-wide session reframing AI from a creation tool to a thinking partner: use it to stress-test your ideas before stakeholder meetings, arrive with fully-formed concepts instead of blank canvases. Changed how the team prepares and presents.',
                },
                {
                  label: 'Cost-Saving Pipeline',
                  body: 'When Q2 designers burned through Figma Make\'s expensive AI credits, I found a better path: Claude Code builds the prototype, our engineers built a deploy tool that pushes it to a live URL for user testing, stakeholder review, and production-ready handoff. Zero recurring credit costs.',
                },
                {
                  label: 'AI Feature Contribution',
                  body: 'The knowledge gained building Magic Signal directly informs my contribution to a Q2 AI banking feature in discovery: a tool helping 22M+ users understand their spending through bank statement analysis, where prompt design, data pipeline thinking, and AI output hierarchy all matter.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="p-10"
                  style={{ backgroundColor: BG }}
                >
                  <div className="w-8 h-px mb-6" style={{ backgroundColor: ACCENT, opacity: 0.6 }} />
                  <p className="font-display text-xl font-bold mb-3" style={{ color: TEXT }}>
                    {item.label}
                  </p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    {item.body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── NEXT PROJECT ─────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 pt-28 pb-28">
        <div className="max-w-6xl mx-auto">
          <Rule />
          <motion.div
            {...fadeUp}
            className="pt-16"
          >
            <Link
              to="/messaging-redesign"
              className="group inline-block mt-4"
            >
              <p className="font-sans text-sm mb-2" style={{ color: DIMMER }}>
                Next project
              </p>
              <h3
                className="font-display font-black leading-[0.9] transition-opacity duration-300 group-hover:opacity-60"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', color: TEXT }}
              >
                Secure Messaging
              </h3>
            </Link>
          </motion.div>
        </div>
      </section>
      </div>
    </main>
  )
}
