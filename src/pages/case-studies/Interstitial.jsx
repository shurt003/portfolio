import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import CaseTLDR from '../../components/CaseTLDR'
import usePageMeta from '../../hooks/usePageMeta'

// ─── Palette ─────────────────────────────────────────────────────────────────
const BG      = '#FAF7F2'
const SURFACE = '#F0EDE5'
const ACCENT  = '#1B4F8A'
const ACCENT_D= 'rgba(27,79,138,0.10)'
const TEXT    = '#1C2322'
const DIM     = 'rgba(28,35,34,0.72)'
const DIMMER  = 'rgba(28,35,34,0.55)'
const RULE    = 'rgba(28,35,34,0.08)'
const WARN    = '#C0392B'
const WARN_D  = 'rgba(192,57,43,0.08)'

// ─── Fade-up variant ──────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Light Nav ────────────────────────────────────────────────────────────────
// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: DIMMER }}>
      {children}
    </p>
  )
}

// ─── Rule ─────────────────────────────────────────────────────────────────────
function Rule() {
  return <div className="w-full h-px mb-10" style={{ backgroundColor: RULE }} />
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ value, label, sub }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border px-6 py-8 text-center" style={{ borderColor: RULE }}>
      <div className="font-display text-5xl font-bold leading-none mb-2" style={{ color: ACCENT }}>
        {value}
      </div>
      <div className="font-sans text-sm font-semibold mb-1" style={{ color: DIM }}>{label}</div>
      {sub && <div className="font-sans text-xs leading-snug" style={{ color: DIMMER }}>{sub}</div>}
    </div>
  )
}

// ─── Pull Quote ───────────────────────────────────────────────────────────────
function PullQuote({ quote, attribution }) {
  return (
    <div
      className="rounded-2xl p-8 border-l-4 my-10"
      style={{
        borderLeftColor: ACCENT,
        backgroundColor: ACCENT_D,
        borderTop: `1px solid ${RULE}`,
        borderRight: `1px solid ${RULE}`,
        borderBottom: `1px solid ${RULE}`,
      }}
    >
      <p className="font-display text-xl md:text-2xl font-bold leading-snug mb-3" style={{ color: TEXT }}>
        "{quote}"
      </p>
      {attribution && (
        <p className="font-sans text-xs uppercase tracking-widest" style={{ color: DIMMER }}>{attribution}</p>
      )}
    </div>
  )
}

// ─── Problem Callout ─────────────────────────────────────────────────────────
function ProblemCallout({ label, body }) {
  return (
    <div
      className="rounded-xl p-5 border-l-4"
      style={{
        borderLeftColor: WARN,
        backgroundColor: WARN_D,
        borderTop: `1px solid rgba(192,57,43,0.12)`,
        borderRight: `1px solid rgba(192,57,43,0.12)`,
        borderBottom: `1px solid rgba(192,57,43,0.12)`,
      }}
    >
      <p className="font-sans text-xs uppercase tracking-widest mb-1.5" style={{ color: WARN }}>
        Problem - {label}
      </p>
      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{body}</p>
    </div>
  )
}

// ─── Config Card ─────────────────────────────────────────────────────────────
function ConfigCard({ number, title, when, desc, image, alt, solo }) {
  return (
    <div className="bg-white border overflow-hidden" style={{ borderColor: RULE, borderRadius: '4px 4px 16px 16px' }}>
      {/* Full-width solo screenshot */}
      <div className="w-full overflow-hidden" style={{ backgroundColor: '#0A1929' }}>
        <img src={solo} alt={alt + ' - close-up'} className="w-full h-auto" loading="lazy" />
      </div>
      {/* Content */}
      <div className="p-7">
        <div
          className="inline-block font-sans text-xs font-bold px-2.5 py-1 rounded-full mb-4"
          style={{ backgroundColor: ACCENT_D, color: ACCENT }}
        >
          Config {number}
        </div>
        <h3 className="font-display text-xl font-bold mb-2" style={{ color: TEXT }}>{title}</h3>
        <p className="font-sans text-xs uppercase tracking-widest mb-2" style={{ color: DIMMER }}>
          Best for
        </p>
        <p className="font-sans text-sm mb-3 font-medium" style={{ color: DIM }}>{when}</p>
        <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{desc}</p>
      </div>
    </div>
  )
}

// ─── Research Callout ────────────────────────────────────────────────────────
function ResearchCallout({ source, finding }) {
  return (
    <div
      className="rounded-xl p-5 border"
      style={{ borderColor: `${ACCENT}30`, backgroundColor: ACCENT_D }}
    >
      <p className="font-sans text-xs uppercase tracking-widest mb-1.5" style={{ color: ACCENT }}>
        {source}
      </p>
      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{finding}</p>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Interstitial() {
  usePageMeta(
    'Interstitial by Stephen Hurt',
    "Turning the platform's most-fired screen into an honest, configurable brand moment, a self-initiated UX fix that helped unlock an $8M enterprise deal."
  )
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 800], ['0%', '-18%'])

  return (
    <main style={{ backgroundColor: BG }}>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-0 h-screen overflow-hidden flex flex-col justify-end">
        <motion.div
          className="absolute pointer-events-none"
          style={{ y: bgY, top: '-20%', bottom: '-20%', left: 0, right: 0 }}
        >
          <div className="absolute inset-0" style={{ backgroundColor: BG }}>
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse 70% 60% at 70% 40%, rgba(27,79,138,0.08) 0%, transparent 70%)`,
              }}
            />
          </div>
        </motion.div>

        <div className="relative z-10 px-8 md:px-14 pb-20 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap gap-2 mb-8">
              {['Product Design', 'Interaction Design', 'Q2'].map((t) => (
                <span
                  key={t}
                  className="font-sans text-xs px-3 py-1 rounded-full border"
                  style={{ borderColor: `${ACCENT}40`, color: DIM }}
                >
                  {t}
                </span>
              ))}
            </div>
            <h1
              className="font-display text-6xl md:text-8xl font-bold leading-[0.92] mb-7 tracking-tight"
              style={{ color: TEXT }}
            >
              Interstitial
            </h1>
            <p className="font-sans text-lg md:text-xl max-w-2xl leading-relaxed" style={{ color: DIM }}>
              Turning a forgotten loading screen into a branded moment, accidentally unlocking an $8M deal.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="relative z-10" style={{ backgroundColor: BG }}>

      {/* ── TL;DR ──────────────────────────────────────────────────────── */}
      <CaseTLDR
        colors={{ text: TEXT, dim: DIM, accent: ACCENT, surface: SURFACE, rule: RULE }}
        summary={`The interstitial fires millions of times a day, but no one had ever designed it: generic stock art over a progress bar that "completed" before the data finished loading. I picked it up unassigned: an honest spinner plus a three-configuration brand system that became the new platform default, and gave sales a demo asset that helped close an $8M deal.`}
        stats={[
          { value: '22M', label: 'Users: the most-fired screen in the platform' },
          { value: '$8M', label: 'Enterprise deal the framework helped unlock' },
          { value: '3', label: 'Brand configurations, minimal to image-rich' },
          { value: 'New', label: 'Became the platform default loader' },
        ]}
      />

      {/* ── Overview Strip ─────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-14 border-b" style={{ borderColor: RULE }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-50px' }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {[
                { label: 'Role',     value: 'Product Designer - self-initiated; design through implementation with engineering' },
                { label: 'Scope',    value: 'UX audit, interaction design, three-configuration system, design system component' },
                { label: 'Platform', value: 'Q2 - white-label digital banking · 500 financial institution customers · 22M end users' },
                { label: 'Outcome',  value: 'Three configurations shipped · spinner pattern adopted · custom loader program launched · $8M deal attributed' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-sans text-xs tracking-widest uppercase mb-2" style={{ color: DIMMER }}>{item.label}</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{item.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <article className="px-8 md:px-14 py-20">
        <div className="max-w-6xl mx-auto space-y-28">

          {/* ── 01 Context ─────────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>01 - Context</SectionLabel>
            <Rule />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start mb-14">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-6" style={{ color: TEXT }}>
                  The most-seen screen nobody designed
                </h2>
                <div className="space-y-4 font-sans text-base leading-relaxed" style={{ color: DIM }}>
                  <p>
                    Every time someone logs into their online banking, whether it's a regional credit union or a national bank, Q2's platform fires an interstitial screen between login and dashboard while account data loads. Q2 powers 500 financial institutions serving 22 million end users. That screen fires millions of times a day.
                  </p>
                  <p>
                    Despite being one of the highest-frequency screens in the entire product, it had never been treated as a design surface. It was an implementation detail, a generic stock illustration of piggy banks and coins dropped onto a plain white canvas, with a progress bar at the bottom. FIs could upload their own image, but many never did, meaning this outdated illustration was what millions of users actually saw every time they logged in. The images shown here are from Q2's demo environment.
                  </p>
                  <p>
                    What made the problem undeniable was a simple comparison: looking at Q2's interstitial next to any modern banking app's loading screen. Chime, SoFi, Cash App: each had loading experiences that felt branded, intentional, and current. Q2's still had clip-art-style piggy banks and coins. The gap was obvious. And given the screen's scale, it was a high-impact problem that had simply been overlooked. Clear problem, significant reach, nobody actively working on it. That's reason enough to pick it up.
                  </p>
                </div>
              </div>
              <div
                className="rounded-2xl p-7 border"
                style={{ borderColor: `${ACCENT}30`, backgroundColor: ACCENT_D }}
              >
                <p className="font-sans text-xs uppercase tracking-widest mb-4" style={{ color: ACCENT }}>Why this screen matters</p>
                <p className="font-display text-xl font-bold leading-snug mb-4" style={{ color: TEXT }}>
                  22 million users. One screen. Zero design attention.
                </p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                  The user has just authenticated. They have nowhere to go and nothing to do. Their attention is completely on the screen. Q2's platform is white-labeled, end users never see "Q2," they see their bank. This screen belongs to the institution. It should feel like their brand, not a vendor's placeholder.
                </p>
              </div>
            </div>

            {/* Original in-context flow */}
            <div className="overflow-hidden border mb-4" style={{ borderColor: RULE }}>
              <img
                src="/images/Interstitial/Original.png"
                alt="Original interstitial in context - login to interstitial to dashboard flow"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <p className="font-sans text-xs leading-relaxed" style={{ color: DIMMER }}>
              The original experience in context: login screen → interstitial → dashboard. The top bar houses the institution's logo on a customizable background color. The bottom bar contains the progress indicator, the same across all 500 customers. This is Q2's demo environment; in production every customer replaces the stock illustration with their own content.
            </p>
          </motion.section>

          {/* ── 02 Two Problems ────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>02 - What Was Wrong</SectionLabel>
            <Rule />
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: TEXT }}>
              Two compounding failures on a single screen
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-12" style={{ color: DIM }}>
              The original interstitial had two distinct problems. One was a trust issue. The other was a missed opportunity. Together, they made what should have been a brand moment feel like a broken system.
            </p>

            {/* Original close-up */}
            <div className="overflow-hidden border mb-4" style={{ borderColor: RULE }}>
              <img
                src="/images/Interstitial/OriginalSolo.png"
                alt="Original interstitial close-up - stock illustration and progress bar"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <p className="font-sans text-xs mb-10 leading-relaxed" style={{ color: DIMMER }}>
              Anatomy of the original: the top bar holds the institution's logo (background color is configurable per customer). The large white area was filled with a generic financial stock illustration. The black bar at the bottom, identical across all 500 customers, contained the progress indicator and status text.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <ProblemCallout
                label="The dishonest progress bar"
                body="The progress bar was an animation, not a measurement. It would complete its visual sweep, hitting 100%, before the actual data had finished loading. The user saw 'done,' then kept waiting. This creates a specific kind of UX failure: a temporal expectation violation. You've told the user the task is complete. Every additional second after that feels longer and more frustrating than honest, open-ended waiting."
              />
              <ProblemCallout
                label="The generic default nobody replaced"
                body="FIs could upload a custom image, but many never did. The generic financial stock illustration (piggy banks, coins, a smartphone) was the default, and for a large portion of Q2's 500 customers it was also the permanent state. Inaction meant 22 million users were met with filler art that had nothing to do with their bank. The capability for customization existed; the design system didn't make it easy enough to use."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <ResearchCallout
                source="Adar, Tan & Teevan - CHI 2013"
                finding="'Benevolent Deception in Human Computer Interaction' (Microsoft Research) established that smoothing a stuttering progress bar reduces anxiety, but only when the deception is undetectable. A bar that visually completes before the task is done is, by definition, detected deception. The trust-repair cost of a caught lie exceeds any benefit the bar provided."
              />
              <ResearchCallout
                source="Harrison, Amento et al. - UIST 2007"
                finding="'Rethinking the Progress Bar' (ACM) found users tolerate slowdowns best at the start of a process, not the end. A bar that halts or completes prematurely near 100% is the single most damaging failure pattern. Expectation of imminent completion has already been set; any deviation from it feels disproportionately worse."
              />
            </div>
          </motion.section>

          {/* ── 03 The Redesign ────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>03 - The Redesign</SectionLabel>
            <Rule />
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: TEXT }}>
              Three configurations. One honest interaction pattern.
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-8" style={{ color: DIM }}>
              The redesign introduced a system of three distinct configurations, not a single mandated look, but a flexible range. Q2's customers (banks and credit unions) vary enormously in brand maturity, available assets, and design sophistication. The right solution gives each client a path that works for their brand.
            </p>

            {/* What we explored */}
            <div className="mb-12">
              <p className="font-sans text-xs uppercase tracking-widest mb-5" style={{ color: DIMMER }}>What we explored before landing here</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                {[
                  {
                    label: 'Single universal design',
                    outcome: 'Rejected',
                    why: 'A single mandated look would work for some FIs and feel completely off-brand for others. Q2\'s customer base ranges from minimalist fintech-adjacent credit unions to traditional regional banks with established visual identities. One size fit none well enough.',
                  },
                  {
                    label: 'Progress bar refinement (keep the bar, make it accurate)',
                    outcome: 'Rejected',
                    why: 'The fundamental problem wasn\'t accuracy. It was that actual load time is indeterminate and varies by account complexity, network, and server state. Even a perfectly accurate bar would occasionally violate the contract. The design problem couldn\'t be solved at the bar level.',
                  },
                  {
                    label: 'Looping video background',
                    outcome: 'Rejected',
                    why: 'Video assets would require significant FI effort to produce and maintain, and streaming video during the load state, the moment before content has finished loading, created an obvious irony. The technical overhead eliminated it quickly.',
                  },
                  {
                    label: 'Full-bleed image with no loader indicator',
                    outcome: 'Rejected',
                    why: 'Removing the spinner entirely left users with no signal that anything was happening. In user sessions, a static image with no movement created anxiety rather than calm. People tapped the screen repeatedly to check if it had frozen.',
                  },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl border p-5" style={{ borderColor: RULE, backgroundColor: '#fff' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-sans text-sm font-semibold" style={{ color: TEXT }}>{item.label}</p>
                      <span className="font-sans text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(192,57,43,0.08)', color: '#C0392B' }}>{item.outcome}</span>
                    </div>
                    <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{item.why}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Why three configs specifically */}
            <div
              className="rounded-xl p-5 border mb-10 flex items-start gap-4"
              style={{ borderColor: `${ACCENT}30`, backgroundColor: ACCENT_D }}
            >
              <div>
                <p className="font-sans text-xs uppercase tracking-widest mb-2" style={{ color: ACCENT }}>Why three configurations, specifically</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                  Three emerged from the real decision tree FIs face. Config 03 (Custom Image) was straightforward: institutions with lifestyle photography in their asset library needed a way to use it. The remaining question was the default loader, a centered spinner with logo and status text. Some FIs have a strong brand color as their app background, and placing the spinner directly on that background risked contrast issues between the text and the background color. Config 01 (Default + Container) solves this by wrapping the loader in a contained card, creating a neutral backdrop. Config 02 (Default - No Container) drops the card for institutions with confident, clean visual identities where the background color carries the whole screen. Three configs, three real problems solved.
                </p>
              </div>
            </div>
            <div
              className="rounded-xl p-5 border mb-14 flex items-start gap-4"
              style={{ borderColor: `${ACCENT}30`, backgroundColor: ACCENT_D }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-sans text-xs font-bold"
                style={{ backgroundColor: ACCENT, color: '#fff' }}
              >
                ★
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-widest mb-1" style={{ color: ACCENT }}>New default</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                  Following this work, <span className="font-semibold" style={{ color: TEXT }}>Default + Container became the new platform default</span>, replacing the stock illustration for any FI that hadn't configured a custom image. Every inactive customer automatically got a cleaner, more professional loading experience with zero effort on their part.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
              <ConfigCard
                number="01"
                title="Default + Container"
                when="Banks with minimal brand assets, or the new platform default"
                desc="The bank's logo, a spinner, and a status message centered in a contained card. The background is sourced from the FI's existing app background, the same color used throughout their online banking, so the screen is automatically on-brand with zero additional configuration."
                solo="/images/Interstitial/NewDefaultContainerSolo.png"
                alt="Config 01 - Default with container card"
              />
              <ConfigCard
                number="02"
                title="Default - No Container"
                when="Modern brands or credit unions with a strong, confident visual identity"
                desc="The same logo, spinner, and status text float directly on the background, no card, no border. Like Config 01, the background is pulled from the FI's existing app background. The most minimal option, and the most immersive, the brand color owns the entire viewport."
                solo="/images/Interstitial/NewDefaultNoContainerSolo.png"
                alt="Config 02 - Default, no container"
              />
              <ConfigCard
                number="03"
                title="Custom Image"
                when="Institutions with lifestyle or brand photography in their asset library"
                desc="A full-bleed image fills the screen, a branch interior, a family, a member moment. The logo pins to the top, the spinner and status text sit at the bottom. The load screen becomes an ad for the brand relationship."
                solo="/images/Interstitial/NewCustomImageSolo.png"
                alt="Config 03 - Custom full-bleed image"
              />
            </div>

            {/* In-flow context for all three */}
            <p className="font-sans text-xs uppercase tracking-widest mb-4" style={{ color: DIMMER }}>
              All three configurations in context, login → interstitial → dashboard
            </p>
            <div className="space-y-4">
              <div className="overflow-hidden border" style={{ borderColor: RULE }}>
                <img
                  src="/images/Interstitial/NewDefaultContainer.png"
                  alt="Config 01 in full login flow context"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden border" style={{ borderColor: RULE }}>
                <img
                  src="/images/Interstitial/NewDefaultNoContainer.png"
                  alt="Config 02 in full login flow context"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden border" style={{ borderColor: RULE }}>
                <img
                  src="/images/Interstitial/NewCustomImage.png"
                  alt="Config 03 in full login flow context"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>
            <p className="font-sans text-xs mt-4 mb-14 leading-relaxed" style={{ color: DIMMER }}>
              Each configuration transitions naturally from the login screen and into the dashboard, the dark background creates visual continuity with the login state, making the whole post-authentication experience feel designed rather than incidental.
            </p>

            {/* Mobile in-context */}
            <p className="font-sans text-xs uppercase tracking-widest mb-4" style={{ color: DIMMER }}>
              Mobile - all three configurations in context
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div className="overflow-hidden border" style={{ borderColor: RULE }}>
                <img
                  src="/images/Interstitial/MobileDefaultContainer.png"
                  alt="Config 01 - Default + Container on mobile"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden border" style={{ borderColor: RULE }}>
                <img
                  src="/images/Interstitial/MobileDefaultNoContainer.png"
                  alt="Config 02 - Default No Container on mobile"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
              <div className="overflow-hidden border" style={{ borderColor: RULE }}>
                <img
                  src="/images/Interstitial/MobileCustomImage.png"
                  alt="Config 03 - Custom Image on mobile"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            </div>
            <p className="font-sans text-xs mt-4 leading-relaxed" style={{ color: DIMMER }}>
              All three configurations were designed for mobile from the start. The full-viewport dark background of Configs 01 and 02 works especially well on mobile, filling the screen edge-to-edge with the institution's brand color before the dashboard loads.
            </p>
          </motion.section>

          {/* ── 04 The Spinner Decision ─────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>04 - The Core Interaction Decision</SectionLabel>
            <Rule />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-6" style={{ color: TEXT }}>
                  Spinner over progress bar: an honesty decision
                </h2>
                <div className="space-y-4 font-sans text-base leading-relaxed" style={{ color: DIM }}>
                  <p>
                    The single most important interaction change was replacing the progress bar with a spinner. This wasn't an aesthetic preference, it was a decision about what the UI should promise to users.
                  </p>
                  <p>
                    A progress bar is a contract. It says: "I know how long this will take, and I'm showing you where we are." If you break that contract, if the bar hits 100% and the loading continues, you've lied to the user. The trust repair cost of that lie exceeds any benefit the bar provided.
                  </p>
                  <p>
                    A spinner makes no such promise. It says: "Something is happening. I don't know exactly how long it will take." For a process where actual load time varies based on account complexity, network conditions, and server state, this is the only honest thing to show. Users understand the spinner contract intuitively, they've never been burned by a spinner that "completed" too early.
                  </p>
                </div>
              </div>
              <div className="space-y-5">
                <div
                  className="rounded-2xl p-6 border"
                  style={{ borderColor: `${ACCENT}30`, backgroundColor: ACCENT_D }}
                >
                  <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
                    Determinate vs. Indeterminate indicators
                  </p>
                  <div className="space-y-4">
                    <div>
                      <p className="font-sans text-sm font-semibold mb-1" style={{ color: TEXT }}>Progress bar (determinate)</p>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                        Use only when you can accurately measure and reflect actual progress. If the animation is decoupled from real load state, the bar is not a progress indicator, it's a lie with a UI wrapper.
                      </p>
                    </div>
                    <div className="h-px w-full" style={{ backgroundColor: RULE }} />
                    <div>
                      <p className="font-sans text-sm font-semibold mb-1" style={{ color: TEXT }}>Spinner (indeterminate)</p>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                        Use when duration is unknown or variable. Sets no expectation beyond "this is happening", making it impossible to violate. Users tolerate honest uncertainty far better than broken promises.
                      </p>
                    </div>
                  </div>
                </div>

                <ResearchCallout
                  source="Nielsen Norman Group - Progress Indicators"
                  finding="Spinners are appropriate for waits of 2-10 seconds where duration is unknown. Progress bars are recommended only for waits over 10 seconds where the system can accurately display remaining time. An animation that mimics progress without measuring it gives users a false mental model of system state, which is more disorienting than honest uncertainty."
                />

                <ResearchCallout
                  source="David Maister - 'The Psychology of Waiting Lines' (1985)"
                  finding="Maister's foundational research at Harvard Business School established a core law: occupied time feels shorter than unoccupied time. Any loading animation, even a static spinner, makes the wait feel shorter than a blank screen. Branded, engaging animations compound this effect further."
                />
              </div>
            </div>

            <PullQuote
              quote="The worst progress bar is one that lies. The best spinner is one that's honest about not knowing."
              attribution="Interaction design principle"
            />
          </motion.section>

          {/* ── 05 The Unexpected Unlock ─────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>05 - The Unexpected Unlock</SectionLabel>
            <Rule />
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ color: TEXT }}>
              A design decision for users became a sales tool for prospects
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-12" style={{ color: DIM }}>
              The three-configuration system was designed for existing Q2 clients, giving banks and credit unions meaningful control over how their brand appeared during the login experience. But the framework opened a door nobody expected.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-14">
              <div className="space-y-5">
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: RULE }}>
                  <div className="font-display text-3xl font-bold leading-none mb-4" style={{ color: ACCENT + '28' }}>01</div>
                  <p className="font-sans text-sm font-semibold mb-2" style={{ color: TEXT }}>The Custom Loader Program</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    After the interstitial shipped, Q2's sales team recognized what the configurable framework made possible. PMs started bringing prospect logos to developers, who would animate a custom loader for each upcoming demo. The demo opened with the prospect's brand, not a generic Q2 screen. None of that was in the original brief. The design created the conditions; the sales team and developers found the opportunity.
                  </p>
                </div>
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: RULE }}>
                  <div className="font-display text-3xl font-bold leading-none mb-4" style={{ color: ACCENT + '28' }}>02</div>
                  <p className="font-sans text-sm font-semibold mb-2" style={{ color: TEXT }}>Tangible Proof of Flexibility</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    For institutions evaluating digital banking platforms, "we can customize the experience for your brand" is a standard sales claim. Every vendor says it. But walking into a demo where the loading screen already has your logo, that's evidence. It turns an abstract pitch point into something tangible in the first ten seconds of the demo.
                  </p>
                </div>
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: RULE }}>
                  <div className="font-display text-3xl font-bold leading-none mb-4" style={{ color: ACCENT + '28' }}>03</div>
                  <p className="font-sans text-sm font-semibold mb-2" style={{ color: TEXT }}>$8M, 16-Month Contract</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    One prospect, a large institution, signed an $8M, 16-month contract with Q2 and explicitly cited the platform's flexibility around customization as a key factor in their decision. The sales team documented it in the deal review: the prospect cited loading screen customization as a key differentiator. This was the first deal where Q2 could demonstrate the Custom Loader program with a fully built example. A loading screen became a deal driver.
                  </p>
                </div>
                <div className="bg-white rounded-2xl border p-6" style={{ borderColor: RULE }}>
                  <div className="font-display text-3xl font-bold leading-none mb-4" style={{ color: ACCENT + '28' }}>04</div>
                  <p className="font-sans text-sm font-semibold mb-2" style={{ color: TEXT }}>The Developer Unlock</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    The interstitial redesign created an unexpected unlock for engineering. By rethinking the screen as a configurable brand surface, rather than a hardcoded implementation detail, the work exposed capabilities the development team hadn't previously considered. The architecture needed to support three distinct visual configurations opened the door for a broader discussion about what else in the platform could be made configurable in this way. A single screen redesign changed how engineering thought about white-label flexibility platform-wide.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <ResearchCallout
                  source="Gartner Digital Markets - 2025 Software Buying Trends"
                  finding="71% of enterprise buyers at companies with 10,000+ employees cite integration and platform flexibility as a top decision factor, second only to price/ROI (78%). In B2B software sales, the ability to adapt the product to a buyer's brand and workflows is not a differentiator; it's a baseline expectation at the enterprise tier."
                />
                <ResearchCallout
                  source="Hohenstein et al. - CHI 2016"
                  finding="'Shorter Wait Times: The Effects of Various Loading Screens on Perceived Performance' found that interactive, branded loading animations produced shorter perceived wait times and higher user satisfaction than both standard progress bars and passive animations. What happens during the wait changes product perception, not just wait tolerance."
                />
                <div
                  className="rounded-2xl p-6 border"
                  style={{ borderColor: `${ACCENT}30`, backgroundColor: ACCENT_D }}
                >
                  <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: ACCENT }}>
                    The wider principle
                  </p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                    The interstitial was never intended to be a sales asset. It was a UX fix. But a design decision made for the right reasons, honest interaction patterns, meaningful brand flexibility, creates product value that compounds in ways you can't always predict at the time of the decision.
                  </p>
                </div>

                {/* Custom loader example: image to be added */}
                <div
                  className="rounded-2xl border flex flex-col items-center justify-center"
                  style={{ borderColor: RULE, minHeight: '260px' }}
                >
                  <p className="font-sans text-xs uppercase tracking-widest" style={{ color: DIMMER }}>
                    Custom Loader Example
                  </p>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <StatCard
                value="22M"
                label="End Users Affected"
                sub="Across 500 financial institution customers, every login, every session"
              />
              <StatCard
                value="$8M"
                label="Contract Value"
                sub="16-month deal where customization flexibility was cited as a key decision factor"
              />
              <StatCard
                value="3"
                label="Configurations"
                sub="Each matched to a different client brand posture, from minimal to image-rich"
              />
            </div>
          </motion.section>

          {/* ── 06 Reflection ──────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <SectionLabel>06 - Reflection</SectionLabel>
            <Rule />
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight mb-6" style={{ color: TEXT }}>
              Good design decisions compound
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-4 font-sans text-base leading-relaxed" style={{ color: DIM }}>
                <p>
                  The interstitial project started as a UX audit, a screen that clearly had problems and needed attention. The progress bar fix was straightforward once the problem was correctly diagnosed: you can't use a determinate indicator for an indeterminate process. That's not a design opinion; it's a factual mismatch between the UI signal and the system state.
                </p>
                <p>
                  The three-configuration system required a bit more judgment. The temptation with any loading-state redesign is to pick a single "best" option and standardize it. But Q2's customer base is diverse, a regional credit union and a national bank have very different brand identities and very different expectations for what their digital product should feel like. Flexibility here wasn't scope creep; it was the correct product decision.
                </p>
              </div>
              <div className="space-y-4 font-sans text-base leading-relaxed" style={{ color: DIM }}>
                <p>
                  The custom loader program and the $8M deal were genuinely unexpected. After the design shipped, PMs brought prospect logos to developers, who built animated versions for demos. None of that was part of the original work. The design created the conditions; the sales team and developers found the opportunity.
                </p>
                <p>
                  The lesson I take from this: decisions made for the right user-centered reasons tend to generate value that compounds in ways you can't plan for. The spinner was chosen because it was honest; the configurability was designed for real client needs. But the part worth naming: this wasn't an assigned project. I spotted the comparison with competing apps, recognized the scale of the gap, and brought it forward. Other designers gave feedback on layout and spacing. Engineering partnered through implementation. The collaboration made it better, but the project started because someone looked at that screen and decided to fix it.
                </p>
              </div>
            </div>
          </motion.section>

          {/* ── Next Project ───────────────────────────────────────────── */}
          <motion.section variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
            <Link to="/magic-signal" className="group inline-block mt-4">
              <p className="font-sans text-sm mb-2" style={{ color: DIMMER }}>Next project</p>
              <h3
                className="font-display font-black leading-[0.9] transition-opacity duration-300 group-hover:opacity-40"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', color: TEXT }}
              >
                MagicSignal
              </h3>
            </Link>
          </motion.section>

        </div>
      </article>
      </div>
    </main>
  )
}
