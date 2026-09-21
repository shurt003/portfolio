import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CaseTLDR from '../../components/CaseTLDR'
import usePageMeta from '../../hooks/usePageMeta'

/* ── Palette (near-black plum ink + the portal's own purple accent; distinct
   from Q2 Clarity's navy/indigo, BIT's cream/blue, Magic Signal's black/steel) ── */
const BG     = '#F5F3F8'
const CARD   = '#FFFFFF'
const INK    = '#18151F'
const BODY   = '#3E3A47'
const DIM    = 'rgba(24,21,31,0.72)'
const MUTE   = 'rgba(24,21,31,0.64)'
const LINE   = 'rgba(24,21,31,0.10)'
const ACCENT = '#6F4C9F'
const GREEN  = '#157A4A'
const AMBER  = '#855A11'
const RED    = '#B3372B'
const L_DIM  = 'rgba(255,255,255,0.74)'
const L_MUTE = 'rgba(255,255,255,0.55)'

const wrap = 'max-w-6xl mx-auto px-6 md:px-10'
const IMG = '/images/Q2CodeAgents'

const fadeUp = {
  initial:     { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
}

/* ── Small helpers ── */
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
          style={{ fontSize: 'clamp(6rem, 13vw, 10rem)', color: light ? 'rgba(255,255,255,0.045)' : 'rgba(24,21,31,0.05)' }}
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

function Stat({ value, label, color = INK }) {
  return (
    <div>
      <p className="font-display text-4xl md:text-5xl font-black leading-none mb-2" style={{ color }}>{value}</p>
      <p className="font-sans text-sm leading-snug" style={{ color: DIM }}>{label}</p>
    </div>
  )
}

/* Dashed placeholder for a screenshot that isn't captured yet.
   `file` is the filename to drop into public/images/Q2CodeAgents/. */
function Slot({ note, file, aspect = '16 / 10' }) {
  return (
    <div
      role="img"
      aria-label={note}
      className="w-full rounded-2xl flex flex-col items-center justify-center text-center gap-3 px-6 py-8"
      style={{ aspectRatio: aspect, border: `1px dashed rgba(24,21,31,0.3)`, backgroundColor: 'rgba(24,21,31,0.03)' }}
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

/* ── §05 · The live orchestration pipeline, as a connected chain ── */
const PIPELINE = [
  { n: '1', name: 'Requirements',    kind: 'system', note: 'Pulled from a labeled issue, parsed into a scoped task' },
  { n: '2', name: 'Issue Resolver',  kind: 'agent',  note: 'Writes the code and the tests' },
  { n: '3', name: 'Merge Request',   kind: 'system', note: 'Opened automatically, held for review' },
  { n: '4', name: 'Security & Tests', kind: 'agent', note: 'A security scan plus end-to-end browser tests, with screenshots' },
  { n: '5', name: 'Proof of Work',   kind: 'system', note: 'Diff, tests, findings, and reasoning compiled into one package' },
  { n: '6', name: 'Review Gate',     kind: 'gate',   note: 'Nothing merges until a person approves it' },
]

function tone(kind) {
  if (kind === 'agent') return ACCENT
  if (kind === 'gate') return GREEN
  return MUTE
}

function PipelineStrip() {
  return (
    <div className="flex flex-wrap items-stretch gap-y-4">
      {PIPELINE.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div
            className="rounded-xl px-4 py-3 h-full"
            style={{
              backgroundColor: s.kind === 'system' ? CARD : `${tone(s.kind)}12`,
              border: `1px solid ${s.kind === 'system' ? LINE : `${tone(s.kind)}72`}`,
              maxWidth: '13.5rem',
            }}
          >
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase mb-1" style={{ color: tone(s.kind) }}>
              {s.n} · {s.kind === 'agent' ? '⚙ Agent' : s.kind === 'gate' ? '◆ Human' : 'System'}
            </p>
            <p className="font-display text-base font-bold leading-tight" style={{ color: INK }}>{s.name}</p>
            <p className="font-sans text-xs leading-snug mt-1" style={{ color: DIM }}>{s.note}</p>
          </div>
          {i < PIPELINE.length - 1 && (
            <span aria-hidden className="px-2 font-display" style={{ color: MUTE }}>→</span>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── §01 · The seven documented problems ── */
const PROBLEMS = [
  ['Off-brand visual language', 'A light, skeuomorphic look, serif titles, folded-corner panels, cyan buttons, sitting inside a portal built dark and componentized. Two visual languages in one product.'],
  ['The human\'s action moments were buried', 'When an agent paused to ask a clarifying question, it rendered at the bottom of the page, below every stage that hadn\'t started yet, and appeared a second time inline. The one moment a human had to act was the hardest thing on the screen to find.'],
  ['One overloaded panel doing four jobs', 'A single bottom panel silently switched between answering a blocking question, casual chat, taking the wheel during a failure, and interrupting a live run. Four different urgencies with no visual difference between them.'],
  ['Developer-grade rawness by default', 'Raw JSON, internal identifiers, and token counts were the only depth on offer. Powerful for debugging, opaque for anyone else.'],
  ['Misleading success states', 'Stages showed a green Passed even when a guardrail had blocked the work and nothing was produced. Status reflected that a step ran, not what it actually did.'],
  ['No hero for the thing being sold', 'The actual deliverable, a diff, a set of tests, a security report, a merge request, had no strong, reviewable home anywhere in the interface.'],
  ['Single-run tunnel vision', 'The view understood exactly one run at a time. No fleet-level sense of what your agents were doing, no work intake, no review queue, no metrics.'],
]

/* ── §03 · Five build principles ── */
const PRINCIPLES = [
  ['01', 'Human-in-the-loop is the product', 'Not a feature bolted onto the workflow. Nothing merges without approval, and the approval gate is a first-class destination, not a footnote.'],
  ['02', 'Anchor action to context', 'A prompt that needs a human belongs on the stage that raised it, never at the bottom of the page.'],
  ['03', 'Match urgency to treatment', 'Blocking, non-blocking, recovery, and steering have to look and feel different from each other, not share one panel.'],
  ['04', 'Plain language first, raw depth on demand', 'Legible for someone who doesn\'t live in the codebase, with the full trace one click away for someone who does.'],
  ['05', 'Native to the portal', 'Built from the portal\'s own components and tokens, so it ships as it is instead of needing a re-skin later.'],
]

/* ── §05 · The five-tab section ── */
const TABS = [
  ['Overview', 'System dashboard that reports state and never runs work. At-a-glance tiles plus active and recent runs.'],
  ['Issue Queue', 'Labeled issues from the tracker, triaged and reassigned to an agent.'],
  ['Run & Orchestration', 'The one live view: an animated pipeline plus a click-to-inspect fleet.'],
  ['Reviews', 'The proof-of-work approval gate. Nothing merges here without a human.'],
  ['Metrics', 'Merge-request throughput, service-level gauges, and per-agent performance.'],
]

/* ── §05 · The four control surfaces ── */
const SURFACES = [
  ['Ask', 'Read-only, non-blocking question while the agent keeps working.'],
  ['Interrupt', 'Steers a live run. Pauses the fleet and takes a new instruction.'],
  ['Agent needs input', 'Anchored to the exact stage that asked. The run waits for the answer.'],
  ['Request changes', 'Acts on a finished merge request from the review gate.'],
]

/* ── §06 · Key decisions ── */
const DECISIONS = [
  ['One tabbed section, not separate pages', 'A fleet needs a fleet-level home. Fragmented pages hid the system.'],
  ['Split Interrupt from Request Changes', 'Steering a live run is not the same as requesting changes on a finished merge request. Different urgency, different surface.'],
  ['Anchor blocking prompts to their stage', 'The one moment a human must act should be the easiest thing to find, not the hardest.'],
  ['The git connection as a prerequisite gate', 'A run physically can\'t clone or push without it. Fail early and clearly, not mid-run.'],
  ['Plain-language default, raw trace on demand', 'Serve the non-expert without lobotomizing the tool for the expert.'],
  ['Native to the portal\'s components from day one', 'The deliverable is buildable against the real product, not a throwaway skin.'],
]

/* ── §07 · Before / after ── */
const BEFORE_AFTER = [
  ['Visual language', 'Off-brand "blueprint paper"', 'Portal-native, dark, componentized'],
  ['Scope', 'One run at a time', 'Full fleet: queue, run, review, metrics'],
  ['Action moments', 'Buried at the page bottom, duplicated', 'Anchored to the stage that raised them'],
  ['Control model', 'One panel, four hidden modes', 'Four distinct, purpose-built surfaces'],
  ['Depth', 'Raw JSON by default', 'Plain language first, raw on demand'],
  ['The deliverable', 'No clear home', 'A proof-of-work review gate'],
]

export default function Q2CodeAgents() {
  usePageMeta(
    'Q2Code Agents by Stephen Hurt',
    'Redesigning the Q2 Developer Portal around a supervised fleet of AI agents: a live orchestration pipeline with a proof-of-work review gate, and four purpose-built ways for a human to step in before anything ships.'
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
            maskImage: 'radial-gradient(ellipse at 70% 30%, black 15%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 70% 30%, black 15%, transparent 70%)',
          }}
        />
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{ right: '-10%', top: '-30%', width: '60%', height: '140%', background: `radial-gradient(circle at 55% 45%, rgba(111,76,159,0.32), transparent 62%)` }}
        />
        <div className={`${wrap} pt-32 pb-16 relative`}>
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center">
            <div>
              <p className="font-mono text-xs tracking-[0.2em] uppercase mb-8" style={{ color: L_MUTE }}>
                Case Study · Q2 · Product Design
              </p>
              <h1 className="font-display font-black leading-[0.95] mb-7" style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)' }}>
                Q2Code <span style={{ color: '#B79BDB' }}>Agents</span>
              </h1>
              <p className="font-sans text-lg md:text-xl leading-relaxed max-w-xl mb-10" style={{ color: 'rgba(255,255,255,0.78)' }}>
                Q2 is turning its developer portal from a manual write-code-push-deploy loop into a fleet of AI agents
                that do real development work. An agent acting on your behalf only earns trust if you can see what
                it's doing, steer it, and approve it before anything ships.
              </p>
              <div className="flex flex-wrap gap-x-10 gap-y-4 pt-7" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                {[
                  ['Role', 'Lead Designer'],
                  ['Status', 'In active engineering build'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-1.5" style={{ color: L_MUTE }}>{k}</p>
                    <p className="font-sans text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.9)' }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div
              role="img"
              aria-label="Product screenshot placeholder, to be replaced once real captures land"
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
                The Overview tab, the first thing a developer sees
              </p>
              <p className="font-mono text-[10px] tracking-[0.04em]" style={{ color: L_MUTE }}>hero-product-desktop.png</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TL;DR ── */}
      <CaseTLDR
        colors={{ text: INK, dim: DIM, accent: ACCENT, surface: CARD, rule: LINE }}
        summary="The Q2 Developer Portal is becoming agentic: a fleet of specialized AI agents handling development work that used to be manual, each one required to produce proof of what it did before anything reaches production. The first working version had the right capability in the wrong shape, off-brand, and it buried the one moment a developer actually had to act. I redesigned it twice, from three per-screen explorations into one portal-native section built around a live orchestration pipeline and a proof-of-work review gate, with four purpose-built ways for a human to step in before anything ships. Nothing merges without approval, and it's now in active engineering build."
        stats={[
          { value: '7/7', label: 'documented problems resolved in v2' },
          { value: '2', label: 'full redesign iterations, v1 to v2' },
          { value: '4', label: 'purpose-built control surfaces, replacing 1 overloaded panel' },
          { value: '0', label: 'merges without a human in the loop' },
        ]}
      />

      {/* ── 01 THE PROBLEM ── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="01" label="The problem" title="Right capability, wrong shape" />
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-8">
            The underlying feature already worked. Working software is not the same as a shippable experience.
            Studying the live app surfaced seven problems that all traced back to one tension.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="rounded-2xl p-7 md:p-9 mb-12 max-w-3xl" style={{ backgroundColor: INK }}>
          <p className="font-display text-lg md:text-xl font-bold leading-snug" style={{ color: '#fff' }}>
            An autonomous agent is only trustworthy if the human stays oriented and in control. The first build had the
            capability but not the orientation.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={{ borderLeft: `3px solid ${ACCENT}` }} className="pl-6 md:pl-9 max-w-3xl">
          {PROBLEMS.map(([name, desc], i) => (
            <div key={name} className="py-5 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8" style={{ borderBottom: i < PROBLEMS.length - 1 ? `1px solid ${LINE}` : 'none' }}>
              <span aria-hidden className="font-display font-black leading-none shrink-0" style={{ fontSize: '2rem', color: 'rgba(24,21,31,0.16)' }}>{i + 1}</span>
              <div>
                <p className="font-display text-base font-bold mb-1.5" style={{ color: INK }}>{name}</p>
                <p className="font-sans text-sm leading-relaxed max-w-2xl" style={{ color: DIM }}>{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div {...fadeUp} className="mt-12">
          <Slot note="The original app: capable, but a light skeuomorphic blueprint-paper aesthetic colliding with the portal's dark, componentized UI." file="phase0-original.png" aspect="16 / 9" />
        </motion.div>
      </section>

      {/* ── 02 GROUNDING ── */}
      <motion.section {...fadeUp} style={{ backgroundColor: INK }}>
        <div className={`${wrap} py-16 md:py-20`}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-6" style={{ color: '#B79BDB' }}>
            02 · Grounding the redesign
          </p>
          <p className="font-display font-black leading-tight max-w-4xl mb-6" style={{ fontSize: 'clamp(1.7rem, 3.8vw, 2.8rem)', color: '#fff' }}>
            I refused to design from imagination.
          </p>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-4" style={{ color: L_DIM }}>
            The real interaction model already running in the live app, its stage lifecycle, the channels a human
            already had for reaching an agent, how it behaved once something failed, became the baseline no redesign
            was allowed to contradict. The portal's own front-end code supplied the real type and color, so the new
            section could borrow the portal's actual visual language instead of an invented skin. And the planning doc
            leadership had already written filled in what neither of those could show: the agent fleet, the trigger
            model, the architecture the whole design had to sit on top of.
          </p>
          <p className="font-sans text-base leading-relaxed max-w-3xl" style={{ color: L_DIM }}>
            None of this was decoration. The prototype had to be buildable against the real portal and model the real
            backend workflow, which is the only reason engineering could read it as a spec instead of a mood board.
          </p>
        </div>
      </motion.section>

      {/* ── 03 PRINCIPLES ── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="03" label="Principles" title="Five rules, one non-negotiable" />
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
            Everything downstream was measured against these. The first one never bent.
          </p>
        </motion.div>

        <motion.div {...fadeUp} style={{ borderLeft: `3px solid ${ACCENT}` }} className="pl-6 md:pl-9 max-w-3xl">
          {PRINCIPLES.map(([no, name, desc], i, arr) => (
            <div key={no} className="py-6 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8" style={{ borderBottom: i < arr.length - 1 ? `1px solid ${LINE}` : 'none' }}>
              <span aria-hidden className="font-display font-black leading-none shrink-0" style={{ fontSize: '2.6rem', color: 'rgba(24,21,31,0.14)' }}>{no}</span>
              <div>
                <p className="font-display text-lg font-bold mb-1.5" style={{ color: INK }}>{name}</p>
                <p className="font-sans text-sm leading-relaxed max-w-2xl" style={{ color: DIM }}>{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── 04 TWO ITERATIONS ── */}
      <section className="py-20" style={{ backgroundColor: '#EDE9F2' }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="04" label="Two iterations" title="What v1 still got wrong" />
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-12">
              The destination only makes sense as the product of deliberate iteration. This is the part worth walking
              through in full.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="mb-12">
            <p className="font-display text-lg font-bold mb-2" style={{ color: INK }}>Phase 0 · The starting point</p>
            <p className="font-sans text-sm leading-relaxed max-w-3xl" style={{ color: DIM }}>
              The underlying automation had a working build, capable, but wrapped in a light, skeuomorphic look, serif
              type, folded-corner panels, that had nothing to do with the portal it lived in. It also understood exactly
              one run at a time.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="mb-12">
            <p className="font-display text-lg font-bold mb-2" style={{ color: INK }}>Phase 1 · Per-screen redesigns</p>
            <p className="font-sans text-sm leading-relaxed max-w-3xl mb-6" style={{ color: DIM }}>
              Before committing to a full architecture, I re-skinned the individual screens into the portal's actual
              visual language to prove the translation held up: the start-a-run form, the live run and summary view,
              and the review and proof-of-work screen. It de-risked the visual port and surfaced the real problem
              underneath it. Individually redesigned screens don't add up to a coherent product. A developer would
              still be tab-hopping between disconnected pages with no view of the fleet as a whole.
            </p>
            <Slot note="The three Phase 1 redesigns side by side: right visual language, still three disconnected pages." file="phase1-screens.png" aspect="21 / 9" />
          </motion.div>

          <motion.div {...fadeUp} className="mb-12">
            <p className="font-display text-lg font-bold mb-2" style={{ color: INK }}>Phase 2 · v1, one unified section</p>
            <p className="font-sans text-sm leading-relaxed max-w-3xl mb-6" style={{ color: DIM }}>
              The architectural move was folding the separate screens into one tabbed section, Overview, Issue Queue,
              Run, Reviews, Metrics, with the run's clarifying questions and review actions brought inline instead of
              scattered. That established the fleet model and the five-tab structure everything after it kept. V1 got
              the fleet-level structure right, the unified section and its live pipeline, plus a proof-of-work review
              with dedicated views for the diff, the tests, the security findings, and the reasoning behind them. It
              still conflated two things that
              should have stayed apart: interrupting a live run and requesting changes on a finished merge request
              lived in one combined action, mixing steering something in progress with commenting on something already
              done.
            </p>
            <Slot note="v1: one unified section, but Interrupt and Request Changes still shared a single combined modal." file="v1-section.png" aspect="16 / 9" />
          </motion.div>

          <motion.div {...fadeUp}>
            <p className="font-display text-lg font-bold mb-2" style={{ color: INK }}>Phase 3 · v2, the refinement (current)</p>
            <p className="font-sans text-sm leading-relaxed max-w-3xl" style={{ color: DIM }}>
              V2 split interrupting a run from requesting changes into two distinct surfaces, since steering a live
              agent and asking for changes on finished work carry different urgency. It anchored the agent's clarifying
              question to the exact stage that raised it instead of the bottom of the page. It made the connection to
              the portal's git host an explicit prerequisite for starting a run, since a run can't do anything without
              it, so that failure shows up early and clearly instead of mid-run. And it built out the real edge-case
              states, empty, failed, errored, waiting on a person, as actual prototype screens instead of only the
              happy path.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── 05 THE SOLUTION ── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="05" label="The solution" title="One tabbed home for the whole fleet" />
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-4">
            It lives under Self Service › AI Agents, inside the existing portal. The mental model underneath it: an
            issue in the tracker is the work queue, a specialized agent is the worker, a merge request plus its proof
            of work is the output, and a human is the merge gate.
          </p>
          <div className="flex flex-wrap items-center gap-2 mb-14 font-mono text-xs uppercase tracking-[0.1em]" style={{ color: MUTE }}>
            {['Issue', 'Agent', 'Merge request + proof', 'Human approves'].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full" style={{ border: `1px solid ${LINE}`, color: INK, backgroundColor: CARD }}>{step}</span>
                {i < arr.length - 1 && <span aria-hidden style={{ color: MUTE }}>→</span>}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="mb-14">
          <p className="font-display text-xl font-bold mb-4" style={{ color: INK }}>Five tabs, five jobs</p>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${LINE}` }}>
            <table className="w-full text-left border-collapse" style={{ backgroundColor: CARD }}>
              <thead>
                <tr style={{ backgroundColor: BG }}>
                  {['Tab', 'Job'].map((h) => (
                    <th key={h} className="font-mono text-[10px] tracking-[0.12em] uppercase px-4 py-3" style={{ color: MUTE }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABS.map(([tab, job], i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${LINE}` }}>
                    <td className="font-sans text-sm font-semibold px-4 py-3 align-top" style={{ color: INK }}>{tab}</td>
                    <td className="font-sans text-sm px-4 py-3 align-top" style={{ color: DIM }}>{job}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Slot note="Overview: the honest 'what are my agents doing' surface." file="overview-desktop.png" aspect="16 / 10" />
            <Slot note="Issue Queue: the agentic work intake." file="issue-queue-desktop.png" aspect="16 / 10" />
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="mb-14">
          <p className="font-display text-xl font-bold mb-4" style={{ color: INK }}>The live orchestration pipeline</p>
          <p className="font-sans text-sm leading-relaxed max-w-3xl mb-6" style={{ color: DIM }}>
            The Run tab renders the real backend workflow as a legible chain. Each stage starts when the prior one
            passes, and clicking any node inspects what it's actually doing.
          </p>
          <PipelineStrip />
          <div className="mt-8">
            <Slot note="The live pipeline with the fleet inspector open." file="run-pipeline-desktop.png" aspect="21 / 9" />
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="mb-14">
          <p className="font-display text-xl font-bold mb-4" style={{ color: INK }}>Four purpose-built surfaces, replacing one overloaded panel</p>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${LINE}` }}>
            <table className="w-full text-left border-collapse" style={{ backgroundColor: CARD }}>
              <thead>
                <tr style={{ backgroundColor: BG }}>
                  {['Surface', 'What it does'].map((h) => (
                    <th key={h} className="font-mono text-[10px] tracking-[0.12em] uppercase px-4 py-3" style={{ color: MUTE }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SURFACES.map(([surface, does], i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${LINE}` }}>
                    <td className="font-sans text-sm font-semibold px-4 py-3 align-top" style={{ color: INK }}>{surface}</td>
                    <td className="font-sans text-sm px-4 py-3 align-top" style={{ color: DIM }}>{does}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <Slot note="The action moment brought to where the human is looking. Fixes the buried-prompt problem." file="control-surfaces-desktop.png" aspect="16 / 9" />
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="mb-14">
          <p className="font-display text-xl font-bold mb-3" style={{ color: INK }}>The proof-of-work review gate</p>
          <p className="font-sans text-sm leading-relaxed max-w-3xl mb-6" style={{ color: DIM }}>
            The deliverable finally has a hero. A review package bundles the code diff, the tests, the security
            findings, screenshots, and the reasoning trace behind them, with an explicit approve-or-request-changes
            decision for a human to make.
          </p>
          <Slot note="Proof of work: the thing being sold, made reviewable." file="review-gate-desktop.png" aspect="16 / 9" />
        </motion.div>

        <motion.div {...fadeUp}>
          <p className="font-display text-xl font-bold mb-3" style={{ color: INK }}>Beyond the happy path</p>
          <p className="font-sans text-sm leading-relaxed max-w-3xl mb-6" style={{ color: DIM }}>
            The prototype covers the states a real operator actually hits, not only the version where everything goes
            right.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Slot note="Empty state: zero runs." file="state-empty.png" aspect="4 / 3" />
            <Slot note="A failed run." file="state-failed.png" aspect="4 / 3" />
            <Slot note="An errored run." file="state-errored.png" aspect="4 / 3" />
          </div>
        </motion.div>
      </section>

      {/* ── 06 WHERE THE GATE BELONGS ── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="06" label="Prior art" title="Where the gate belongs" />
          <div className="space-y-4 font-sans text-base leading-relaxed max-w-3xl mb-10">
            <p>
              The pattern language for supervised agent work is being written in public right now, and the sharpest
              version of it I have read comes from HumanLayer, who build tooling for this exact problem. Their argument
              is about where human attention is worth the most, and it complicates everything above.
            </p>
            <p>
              A bad line of code costs you a bad line of code. A bad line of a plan costs hundreds, because every line
              written against it inherits the mistake. A wrong assumption in the research underneath that plan costs
              thousands. So human attention is worth the most early, on the approach, and worth the least on the
              finished diff, which is the one place most teams spend it. Their shorthand for the goal is
              <span className="font-semibold" style={{ color: INK }}> "no more slop"</span>, and the mechanism is
              reviewing the thinking before it becomes code.
            </p>
            <p>
              Measured against that, the design above puts its one scheduled human decision in the most expensive
              place available. The gate sits at the end, on a finished merge request, after the agent has written the
              code, opened the request, run the scans and compiled the evidence. Interrupt and the stage-anchored
              prompt do let a person step in earlier, but both are reactive: they fire when an agent asks, or when
              somebody happens to be watching. Nothing in the pipeline requires a human to look at the approach before
              the work exists.
            </p>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {[
            ['The gate this design has', 'Authorization', 'Nothing reaches a bank’s production environment without a named person accountable for it, with the evidence they used attached to the decision. That is a compliance requirement before it is a quality one, and it cannot move earlier. Approving an approach is not the same as approving what actually got built.', ACCENT],
            ['The gate this design lacks', 'Leverage', 'Stopping a wrong approach before it becomes expensive, and keeping a team oriented to a codebase changing faster than anyone can read it. It saves money and attention. It does not satisfy an auditor, which is why it cannot replace the first one.', AMBER],
          ].map(([title, kind, body, tone]) => (
            <div key={title} className="rounded-2xl p-6 md:p-7" style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, borderTop: `3px solid ${tone}` }}>
              <p className="font-mono text-[11px] tracking-[0.16em] uppercase mb-2" style={{ color: tone }}>{kind}</p>
              <p className="font-display text-lg font-bold mb-2" style={{ color: INK }}>{title}</p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{body}</p>
            </div>
          ))}
        </motion.div>

        <motion.div {...fadeUp} className="rounded-2xl p-7 md:p-9 max-w-3xl" style={{ backgroundColor: 'rgba(133,90,17,0.06)', border: '1px solid rgba(133,90,17,0.28)' }}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-3" style={{ color: AMBER }}>What I would change in v3</p>
          <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
            v2 has the authorization gate and not the leverage one. The pipeline produces its first reviewable artifact
            after the code is already written, so the cheapest moment to catch a wrong assumption passes without anyone
            being asked to look at it. Closing that means giving the Requirements stage an output a person reads and
            approves before an agent starts, which is a change to the workflow rather than a change to a screen. It is
            the first thing I would put into the next version.
          </p>
        </motion.div>
      </section>

      {/* ── 07 KEY DECISIONS ── */}
      <section className="py-20" style={{ backgroundColor: '#EDE9F2' }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="07" label="Key decisions" title="The calls that mattered, and why" />
          </motion.div>
          <motion.div {...fadeUp}>
            <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${LINE}` }}>
              <table className="w-full text-left border-collapse" style={{ backgroundColor: CARD }}>
                <thead>
                  <tr style={{ backgroundColor: BG }}>
                    {['Decision', 'Why'].map((h) => (
                      <th key={h} className="font-mono text-[10px] tracking-[0.12em] uppercase px-4 py-3" style={{ color: MUTE }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DECISIONS.map(([decision, why], i) => (
                    <tr key={i} style={{ borderTop: `1px solid ${LINE}` }}>
                      <td className="font-sans text-sm font-semibold px-4 py-3 align-top" style={{ color: INK }}>{decision}</td>
                      <td className="font-sans text-sm px-4 py-3 align-top" style={{ color: DIM }}>{why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
          <motion.div {...fadeUp} className="mt-12">
            <Slot note="Metrics: MR throughput, SLO gauges, and per-agent performance close the observability loop." file="metrics-desktop.png" aspect="16 / 9" />
          </motion.div>
        </div>
      </section>

      {/* ── 08 BEFORE / AFTER ── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionHead num="08" label="Before → after" title="The transformation in one frame" />
        </motion.div>
        <motion.div {...fadeUp}>
          <div className="overflow-x-auto rounded-xl mb-10" style={{ border: `1px solid ${LINE}` }}>
            <table className="w-full text-left border-collapse" style={{ backgroundColor: CARD }}>
              <thead>
                <tr style={{ backgroundColor: BG }}>
                  {['', 'Before (Phase 0)', 'After (v2)'].map((h) => (
                    <th key={h} className="font-mono text-[10px] tracking-[0.12em] uppercase px-4 py-3" style={{ color: MUTE }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BEFORE_AFTER.map(([label, before, after], i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${LINE}` }}>
                    <td className="font-sans text-sm font-semibold px-4 py-3 align-top" style={{ color: INK }}>{label}</td>
                    <td className="font-sans text-sm px-4 py-3 align-top" style={{ color: RED }}>{before}</td>
                    <td className="font-sans text-sm px-4 py-3 align-top" style={{ color: GREEN }}>{after}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Slot note="Side by side: the original blueprint app against the v2 section." file="before-after-composite.png" aspect="21 / 9" />
        </motion.div>
      </section>

      {/* ── 09 WHERE IT STANDS ── */}
      <section className="py-20" style={{ backgroundColor: INK, color: '#fff' }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionHead num="09" label="Where it stands" title="In build now, not yet in front of users" light />
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-14" style={{ color: L_DIM }}>
              The design work is done, and engineering is building it now. Every one of the seven problems documented
              in section one has a corresponding resolution in v2. The prototype is native to the portal's real
              components and models the real backend workflow, which is the only reason it can double as an
              interaction spec instead of a mood board handed off and reinterpreted.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ['Ground it before drawing anything', 'Reading the real interaction model and the portal\'s actual tokens before designing a screen is why the translation held up under scrutiny instead of needing a second pass.'],
              ['Fixing the language isn\'t fixing the architecture', 'Phase 1 proved the visual translation worked and still left the deeper problem untouched. Individually redesigned screens don\'t add up to a coherent product. That took a real information architecture, not a better skin.'],
              ['Match the surface to the stakes', 'Interrupt and Request Changes felt like the same action until v2 split them. Two things that carry different consequences need to look different, even when an early version can get away with merging them.'],
            ].map(([t, b], i) => (
              <div key={t} className="pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.28)' }}>
                <p className="font-mono text-[11px] tracking-[0.18em] mb-4" style={{ color: '#B79BDB' }}>0{i + 1}</p>
                <p className="font-display text-xl font-bold mb-3">{t}</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.68)' }}>{b}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── NEXT PROJECT ── */}
      <section className={`${wrap} py-20`}>
        <div style={{ borderTop: `1px solid ${LINE}` }} className="pt-12">
          <Link to="/brand-identity-tokens" className="group inline-block">
            <p className="font-sans text-sm mb-2" style={{ color: MUTE }}>Next project</p>
            <h3 className="font-display font-black leading-none transition-opacity duration-300 group-hover:opacity-60" style={{ fontSize: 'clamp(2rem,5vw,4rem)', color: INK }}>
              Brand Identity Tokens
            </h3>
          </Link>
        </div>
      </section>

    </main>
  )
}
