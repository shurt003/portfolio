import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'

// ─── Palette ─────────────────────────────────────────────────────────────────
const BG      = '#FAF7F2'
const SURFACE = '#F0EDE5'
const ACCENT  = '#C17F3E'
const ACCENT_D= 'rgba(193,127,62,0.10)'
const TEXT    = '#1C2322'
const DIM     = 'rgba(28,35,34,0.72)'
const DIMMER  = 'rgba(28,35,34,0.50)'
const RULE    = 'rgba(28,35,34,0.08)'

// ─── Animation ───────────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Components ──────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="font-sans text-xs tracking-widest uppercase mb-3" style={{ color: DIMMER }}>
      {children}
    </p>
  )
}

function Rule() {
  return <div className="w-full h-px mb-16" style={{ backgroundColor: RULE }} />
}

function StatCard({ value, label, sub }) {
  return (
    <div className="flex-1 rounded-2xl border px-6 py-8 text-center" style={{ borderColor: RULE, backgroundColor: 'white' }}>
      <div className="font-display text-5xl font-bold leading-none mb-2" style={{ color: ACCENT }}>
        {value}
      </div>
      <div className="font-sans text-sm font-semibold mb-1" style={{ color: DIM }}>{label}</div>
      {sub && <div className="font-sans text-xs leading-snug" style={{ color: DIMMER }}>{sub}</div>}
    </div>
  )
}

function Callout({ label, body }) {
  return (
    <div className="rounded-2xl p-6 my-8" style={{
      borderLeft: `4px solid ${ACCENT}`,
      backgroundColor: ACCENT_D,
      border: `1px solid ${RULE}`,
      borderLeftWidth: '4px',
      borderLeftColor: ACCENT,
    }}>
      {label && (
        <p className="font-sans text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: ACCENT }}>
          {label}
        </p>
      )}
      <p className="font-sans text-base leading-relaxed" style={{ color: DIM }}>{body}</p>
    </div>
  )
}

function MomentCard({ quote, outcome }) {
  return (
    <div className="rounded-2xl p-6 border" style={{ borderColor: RULE, backgroundColor: 'white' }}>
      <p className="font-display text-base font-bold mb-3" style={{ color: ACCENT }}>
        "{quote}"
      </p>
      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{outcome}</p>
    </div>
  )
}

function FailureCard({ title, body }) {
  return (
    <div className="rounded-xl p-5" style={{
      backgroundColor: ACCENT_D,
      borderLeft: `4px solid ${ACCENT}80`,
    }}>
      <p className="font-sans text-sm font-semibold mb-1.5" style={{ color: TEXT }}>{title}</p>
      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{body}</p>
    </div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function ClaudeCode() {
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 800], ['0%', '-18%'])

  return (
    <main style={{ backgroundColor: BG }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-0 h-screen overflow-hidden flex flex-col justify-end">
        <motion.div
          className="absolute pointer-events-none"
          style={{ y: bgY, top: '-20%', bottom: '-20%', left: 0, right: 0 }}
        >
          {/* Gradient base */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 25% 60%, #3D1F00 0%, #1E1000 45%, #080400 100%)' }} />
          {/* Claude SVG watermark */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <img src="/images/claudelogo/claudecode-color.svg" alt="" className="w-[90vh] h-[90vh] object-contain opacity-20" />
          </div>
          {/* Bottom fade into page */}
          <div className="absolute bottom-0 left-0 right-0 h-48" style={{ background: `linear-gradient(to bottom, transparent, ${BG})` }} />
        </motion.div>

        <div className="relative z-10 px-8 md:px-14 pb-16 md:pb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-2 mb-7"
          >
            {['AI Tooling', 'Self-Initiated', '2025'].map(tag => (
              <span key={tag} className="font-sans text-xs px-3 py-1.5 rounded-full border" style={{ borderColor: `${ACCENT}60`, color: `${ACCENT}CC` }}>
                {tag}
              </span>
            ))}
          </motion.div>
          <div className="overflow-hidden mb-5">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black leading-[0.88]"
              style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)', color: '#FAF7F2' }}
            >
              Building with<br />Claude Code
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-lg leading-relaxed max-w-xl"
            style={{ color: 'rgba(250,247,242,0.65)' }}
          >
            What happens when a product designer ships production React without a developer — using AI as the implementation layer.
          </motion.p>
        </div>
      </section>

      <div className="relative z-10" style={{ backgroundColor: BG }}>
      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-8 md:px-14 py-16 md:py-24">

        {/* Stats */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="flex flex-col sm:flex-row gap-4 mb-20"
        >
          <StatCard value="0" label="Developers" sub="Every line of code written by AI" />
          <StatCard value="8" label="Case studies shipped" sub="All built in this codebase" />
          <StatCard value="1" label="Designer" sub="Making every visual decision" />
        </motion.div>

        <Rule />

        {/* The Setup */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="mb-20"
        >
          <SectionLabel>The Setup</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: TEXT }}>
            I design things I can't build.<br />Or I used to.
          </h2>
          <div className="space-y-4 max-w-2xl">
            <p className="font-sans text-base leading-relaxed" style={{ color: DIM }}>
              I've spent years working in Figma, handing off to engineers, watching my designs get implemented with varying degrees of fidelity. Not because engineers are bad at their jobs — because translation is lossy. Every handoff is a game of telephone where some nuance doesn't survive.
            </p>
            <p className="font-sans text-base leading-relaxed" style={{ color: DIM }}>
              I wanted to build a portfolio that felt exactly like my design decisions. No translation layer, no engineering prioritization queue, no "we'll revisit that in the next sprint."
            </p>
            <p className="font-sans text-base leading-relaxed" style={{ color: DIM }}>
              The problem: I don't write production code. So I used Claude Code — an AI coding assistant — as my implementation layer. Not just for boilerplate. For the entire frontend: every component, every animation, every layout.
            </p>
          </div>

          <Callout
            label="Important distinction"
            body="This is not 'AI built my portfolio.' I made every design decision. Claude wrote the code that executed those decisions. The distinction matters — and it's where most of the interesting things happened."
          />
        </motion.section>

        <Rule />

        {/* Workflow */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="mb-20"
        >
          <SectionLabel>The Workflow</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: TEXT }}>
            Describing visual decisions<br />in words is a design skill.
          </h2>
          <p className="font-sans text-base leading-relaxed max-w-2xl mb-10" style={{ color: DIM }}>
            The loop that emerged was fast because I could speak the language — referencing components, layout properties, animation state by name. The hard part was never the syntax. It was knowing what I actually wanted, and whether the output delivered it.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {[
              { n: '01', title: 'Design intent', body: 'A clear visual or UX decision formed in my head — sometimes from reference, usually from feel.' },
              { n: '02', title: 'Describe it', body: 'Translate the visual into language. Specific, unambiguous, with real constraints.' },
              { n: '03', title: 'AI implements', body: 'Claude writes the code. Usually structurally correct. Not always visually right.' },
              { n: '04', title: 'Evaluate', body: 'Look at the actual rendered result. Does it match the intent? Does it feel right?' },
              { n: '05', title: 'Iterate', body: "Adjust, push further, course-correct. Repeat until it's right." },
            ].map((step, i) => (
              <div key={i} className="rounded-xl p-4" style={{ backgroundColor: SURFACE }}>
                <div className="font-display text-xl font-bold mb-2" style={{ color: ACCENT + '70' }}>{step.n}</div>
                <p className="font-sans text-xs font-semibold mb-1" style={{ color: TEXT }}>{step.title}</p>
                <p className="font-sans text-xs leading-relaxed" style={{ color: DIM }}>{step.body}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <Rule />

        {/* Where AI excelled */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="mb-20"
        >
          <SectionLabel>Where AI Excelled</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: TEXT }}>
            Fast, consistent, and never tired.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: 'Implementation speed',
                body: "Framer Motion animations, Tailwind layout patterns, React component structure — things with known APIs were fast. What would have taken me hours of documentation-reading took seconds.",
              },
              {
                title: 'Technical audits',
                body: 'Running a full code audit across accessibility, performance, and theming surfaced issues I never would have caught manually — including a font-weight class that had silently failed for weeks without affecting anything visibly.',
              },
              {
                title: 'Restructuring without breaking',
                body: "Refactoring a flat card grid into a featured-card layout with new hierarchy — complex changes that preserved animation state and didn't introduce regressions.",
              },
              {
                title: 'Codebase consistency',
                body: 'Maintaining consistent easing curves, spacing decisions, and component patterns across a growing codebase with no design system enforcement and no second pair of eyes.',
              },
            ].map((item, i) => (
              <div key={i} className="rounded-xl p-6 border" style={{ borderColor: RULE, backgroundColor: 'white' }}>
                <p className="font-sans text-sm font-semibold mb-2" style={{ color: TEXT }}>{item.title}</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{item.body}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <Rule />

        {/* Where humans are irreplaceable */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="mb-20"
        >
          <SectionLabel>Where Humans Are Irreplaceable</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4" style={{ color: TEXT }}>
            Technical fluency got me halfway.<br />Design judgment got me the rest.
          </h2>
          <p className="font-sans text-base leading-relaxed max-w-2xl mb-10" style={{ color: DIM }}>
            I'm not code-illiterate — I can read a component, reason about state, direct changes at the DOM level. That fluency made me a better collaborator with AI. But it didn't replace the decisions that only a designer's eye can make.
          </p>
          <div className="space-y-3">
            <MomentCard
              quote="Bump this to 70% — 40 is too timid"
              outcome="AI defaulted to 40% opacity on a UI element. Technically fine. Visually too faint to function as a signal. Knowing the right value isn't a code problem — it's a calibration judgment that comes from looking at things, not reading them."
            />
            <MomentCard
              quote="This is too safe. Make it bolder — no gradients, no glass"
              outcome="A direction with real constraints. Translating 'bolder' into a featured card layout, stronger typographic hierarchy, and accent-color hover borders required design intuition that no specification could fully capture. I knew it when I saw it."
            />
            <MomentCard
              quote="Run me a hiring manager audit — I want to know which cases are weak before I apply"
              outcome="Not 'help me figure out my portfolio' — 'give me the analysis I need to make the call.' AI flagged the weaknesses. I decided what to cut, what to elevate, and what story the final set was telling. Portfolio curation is a design decision."
            />
            <MomentCard
              quote="The failure narrative needs teeth — here's everything that actually happened"
              outcome="I gave Claude the full context on why MagicSignal didn't survive: market timing, internal recognition, what it led to next. The draft came back solid. I rewrote the parts that didn't sound like me and kept what did. The story was always mine — AI just had the writing speed."
            />
          </div>
        </motion.section>

        <Rule />

        {/* Where it broke down */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="mb-20"
        >
          <SectionLabel>Where It Broke Down</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: TEXT }}>
            It wasn't always fast.<br />It wasn't always right.
          </h2>
          <div className="space-y-4">
            <FailureCard
              title="Page transitions — abandoned"
              body="Spent time iterating on animated page transitions. The implementation kept conflicting with React Router's rendering model in ways that were hard to debug without seeing the actual render. Cut it entirely. Sometimes the right call is to stop."
            />
            <FailureCard
              title="The disappearing images bug"
              body="On one case study page, device images would appear briefly then vanish. AI couldn't reliably diagnose it without seeing the actual browser output. The gap between 'code that should work' and 'code that visually works' became real."
            />
            <FailureCard
              title="Conservative defaults throughout"
              body="AI trends toward the safe middle — 40% opacity instead of 70%, generic card grids instead of featured hierarchy, subtle instead of present. Left unchecked, the output would be technically correct and aesthetically timid. Every default needed questioning."
            />
          </div>
        </motion.section>

        <Rule />

        {/* What I learned */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="mb-20"
        >
          <SectionLabel>What I Learned</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: TEXT }}>
            The constraint made me better.
          </h2>
          <div className="space-y-5 max-w-2xl">
            <p className="font-sans text-base leading-relaxed" style={{ color: DIM }}>
              Describing visual decisions in words forced a precision I didn't have before. When you can't just drag a layer, you have to articulate exactly why something should be where it is — why that spacing, why that opacity, why that easing curve instead of another one.
            </p>
            <p className="font-sans text-base leading-relaxed" style={{ color: DIM }}>
              It also collapsed the handoff gap entirely. When I changed my mind about a design decision — as designers do — the cost of that change was one conversation, not a ticket, not a sprint negotiation, not waiting.
            </p>
            <p className="font-sans text-base leading-relaxed" style={{ color: DIM }}>
              What surprised me most: the work that felt most like design was the work AI couldn't touch. Strategy, narrative framing, taste, judgment calls about which projects belong in a portfolio and which ones don't. The implementation layer got dramatically faster. The design layer got more important, not less.
            </p>
          </div>
        </motion.section>

        <Rule />

        {/* The bigger picture */}
        <motion.section
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
          className="mb-20"
        >
          <SectionLabel>The Bigger Picture</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6" style={{ color: TEXT }}>
            The gap between design and engineering is closing. Someone still has to know what good looks like.
          </h2>
          <div className="space-y-4 max-w-2xl">
            <p className="font-sans text-base leading-relaxed" style={{ color: DIM }}>
              This isn't about AI replacing developers. Developers do far more than write front-end code. It's about a new kind of designer who can hold both design intent and technical implementation in mind simultaneously — and who knows how to direct, evaluate, and course-correct AI output rather than just accept whatever it produces.
            </p>
            <p className="font-sans text-base leading-relaxed" style={{ color: DIM }}>
              The teams that will move fastest aren't the ones with the best AI tools. They're the ones with designers who know how to use them well — who bring the taste and judgment that no prompt can replace.
            </p>
          </div>
        </motion.section>

        {/* Next project */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="pt-16 border-t" style={{ borderColor: RULE }}
        >
          <Link to="/magic-signal" className="group inline-block mt-4">
            <p className="font-sans text-sm mb-2" style={{ color: DIMMER }}>Next project</p>
            <h3
              className="font-display font-black leading-[0.9] transition-opacity duration-300 group-hover:opacity-60"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', color: TEXT }}
            >
              MagicSignal
            </h3>
          </Link>
        </motion.div>

      </div>
      </div>
    </main>
  )
}
