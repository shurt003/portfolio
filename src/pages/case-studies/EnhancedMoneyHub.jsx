import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import usePageMeta from '../../hooks/usePageMeta'

/* ── Palette ─────────────────────────────────────────────────────────────── */
const BG    = '#F7F5F1'
const CARD  = '#FFFFFF'
const INK   = '#17191C'
const BODY  = '#454C52'
const DIM   = 'rgba(23,25,28,0.64)'
const MUTE  = 'rgba(23,25,28,0.45)'
const LINE  = 'rgba(23,25,28,0.10)'
const ALT   = '#EFEBE4'
const GREEN = '#1F8A5B'   // deterministic / "ours"
const AI    = '#7C5CFC'   // AI / purple
const RED   = '#C0392B'

const wrap = 'max-w-5xl mx-auto px-6 md:px-10'

/* ── Motion ──────────────────────────────────────────────────────────────── */
const fadeUp = {
  initial:     { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' },
  transition:  { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
}

/* ── Image slot: real image if present, labelled placeholder if not ──────── */
const IMG_BASE = '/images/EnhancedMoneyHub/'
function ImgSlot({ name, caption, ratio = '16 / 10' }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <figure className="w-full">
        <div
          className="w-full rounded-xl flex flex-col items-center justify-center text-center px-6"
          style={{ aspectRatio: ratio, border: `2px dashed ${RED}`, backgroundColor: 'rgba(192,57,43,0.05)', color: RED }}
        >
          <span className="font-mono text-[11px] tracking-[0.18em] uppercase">Image · {name}</span>
          {caption && <span className="font-sans text-sm mt-2 max-w-md" style={{ color: 'rgba(192,57,43,0.8)' }}>{caption}</span>}
        </div>
        {caption && <figcaption className="font-sans text-xs mt-2 leading-relaxed" style={{ color: MUTE }}>{caption}</figcaption>}
      </figure>
    )
  }
  return (
    <figure className="w-full">
      <img
        src={`${IMG_BASE}${name}.png`}
        alt={caption || name}
        onError={() => setFailed(true)}
        className="w-full h-auto block rounded-xl"
        style={{ border: `1px solid ${LINE}`, boxShadow: '0 20px 50px -34px rgba(23,25,28,0.4)' }}
      />
      {caption && <figcaption className="font-sans text-xs mt-2 leading-relaxed" style={{ color: MUTE }}>{caption}</figcaption>}
    </figure>
  )
}

/* ── Small helpers ───────────────────────────────────────────────────────── */
function SectionLabel({ children, light }) {
  return (
    <p className="font-mono text-xs tracking-[0.2em] uppercase mb-5" style={{ color: light ? 'rgba(255,255,255,0.5)' : MUTE }}>
      {children}
    </p>
  )
}

function Stat({ value, label }) {
  return (
    <div>
      <p className="font-display text-4xl md:text-5xl font-black leading-none mb-2" style={{ color: GREEN }}>{value}</p>
      <p className="font-sans text-sm leading-snug" style={{ color: DIM }}>{label}</p>
    </div>
  )
}

function Reframe({ label = 'The reframe', children }) {
  return (
    <div className="rounded-2xl p-7 md:p-8" style={{ backgroundColor: CARD, borderLeft: `3px solid ${GREEN}`, border: `1px solid ${LINE}` }}>
      <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-3" style={{ color: GREEN }}>{label}</p>
      <p className="font-display text-lg md:text-xl font-bold leading-snug" style={{ color: INK }}>{children}</p>
    </div>
  )
}

/* ── §03 pipeline: 6 steps, AI badges on 2 and 5 ─────────────────────────── */
const PIPELINE = [
  { n: '1', title: 'Ingest',        ai: false, body: 'Held + external accounts normalized into one ledger.' },
  { n: '2', title: 'Enrich',        ai: true,  body: 'Rules + MCC + cleansing categorize the bulk; AI cleans the messy tail.' },
  { n: '3', title: 'Compute',       ai: false, body: 'Budgets, trends, recurring, forecast, safe-to-spend. Pure math.' },
  { n: '4', title: 'Detect & Rank', ai: false, body: 'Our engine finds and scores insights by $ impact.' },
  { n: '5', title: 'Narrate',       ai: true,  body: 'Batched AI turns top insights into thrive-voice copy.' },
  { n: '6', title: 'Present',       ai: false, body: 'Themed UI: dashboard, the Money tabs, account pages.' },
]

function Pipeline() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {PIPELINE.map((s) => {
        const c = s.ai ? AI : GREEN
        return (
          <div key={s.n} className="rounded-xl p-5" style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, borderTop: `3px solid ${c}` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-mono text-[11px] font-bold" style={{ color: c }}>{s.n}</span>
              <span className="font-display text-base font-bold" style={{ color: INK }}>{s.title}</span>
              <span className="ml-auto font-mono text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full"
                style={{ color: c, backgroundColor: s.ai ? 'rgba(124,92,252,0.10)' : 'rgba(31,138,91,0.10)', border: `1px solid ${c}40` }}>
                {s.ai ? '★ AI' : 'Ours'}
              </span>
            </div>
            <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{s.body}</p>
          </div>
        )
      })}
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function EnhancedMoneyHub() {
  usePageMeta(
    'thrive Money by Stephen Hurt',
    'A first-party, AI-assisted money hub built inside online banking — and the research that reshaped it.'
  )

  return (
    <main style={{ backgroundColor: BG, color: BODY }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: INK, color: '#fff' }}>
        <div className={`${wrap} pt-32 pb-16`}>
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Case Study · Fintech · AI
          </p>
          <h1 className="font-display font-black leading-[0.95] mb-7" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            thrive Money
          </h1>
          <p className="font-sans text-lg md:text-xl leading-relaxed max-w-2xl mb-6" style={{ color: 'rgba(255,255,255,0.78)' }}>
            A first-party, AI-assisted money hub built inside online banking — and the research that reshaped it.
          </p>
          <p className="font-sans text-base leading-relaxed max-w-2xl mb-12" style={{ color: 'rgba(255,255,255,0.6)' }}>
            How I took a weak, third-party spending widget and rebuilt it into a full personal-finance hub: spending, budgets,
            goals, cash flow and subscriptions in one place, with AI used only where it earns its keep. Then I put it in front
            of six very different people and let what they struggled with rewrite the plan.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            {[
              ['Role', 'Lead Product Designer'],
              ['Scope', 'Strategy → UI → Research → Iteration'],
              ['Surface', 'Web · in-app (online banking)'],
              ['Timeline', 'Q2 · two research rounds'],
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
      <section className={`${wrap} pt-20`}>
        <motion.div {...fadeUp}>
          <SectionLabel>The short version</SectionLabel>
          <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: INK }}>
            What it is, and what changed my mind
          </h2>
          <p className="font-sans text-base md:text-lg leading-relaxed max-w-3xl mb-12">
            The design brief looked simple: make the spending widget better. The real work was deciding what to own versus
            rent, where AI actually helps, and then being honest when testing showed the polished design still failed the
            people at the edges. The version I'd defend today is the one the research forced, not the one I started with.
          </p>
        </motion.div>
        <motion.div {...fadeUp} className="grid grid-cols-2 lg:grid-cols-4 gap-8 pb-4">
          <Stat value="7"      label="tabs unified into one hub, from a single donut widget" />
          <Stat value="6"      label="people tested, chosen to stretch across age, literacy & ability" />
          <Stat value="2"      label="research rounds — the second found the layer the first exposed" />
          <Stat value="17 → 5" label="open issues after iterating; none of the five are blockers" />
        </motion.div>
      </section>

      {/* ── 01 CONTEXT & PROBLEM ─────────────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionLabel>01 — Context & Problem</SectionLabel>
          <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: INK }}>
            A donut chart pretending to be a product
          </h2>
          <div className="space-y-4 font-sans text-base leading-relaxed max-w-3xl mb-10">
            <p>
              The bank's online banking already had a "spending" feature: a single third-party donut widget, unthemed, bolted
              on through an aggregator, with a weak "view all transactions" panel behind it. It answered almost nothing a real
              person asks about their money. Meanwhile people were leaving to use Copilot, Monarch, Rocket Money — apps that do
              budgeting, goals, subscriptions and cash-flow forecasting in one place.
            </p>
            <p>
              The instinct in the room was "ditch the third party and build our own." But that mixed up two very different
              decisions: owning the interface (clearly ours to win) and owning the data enrichment (unproven, and expensive to
              get wrong). The first job was to separate them.
            </p>
          </div>
          <div className="max-w-3xl">
            <Reframe>
              "We have the data" doesn't mean "we can enrich it as well as they can." Own the UI now — that's a real win we
              control. Test the data layer before ripping out enrichment we might not be able to match.
            </Reframe>
          </div>
        </motion.div>
      </section>

      {/* ── 02 STRATEGY & THESIS ─────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: ALT }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionLabel>02 — Strategy & Thesis</SectionLabel>
            <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: INK }}>
              AI is the garnish, not the meal
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
              Before designing a screen, I wrote the argument. Because the bank owns its transaction pipeline end to end, the
              real question was never "build or buy" — it was how well we enrich the data, and where AI actually beats a plain
              rule. My read: a great spending experience is roughly 90% deterministic data engineering (ingestion, rules, math,
              charts) and about 10% language and judgment. So the build principle is simple: deterministic first, AI last.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="rounded-2xl p-7 md:p-8 max-w-3xl" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
            <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-4" style={{ color: GREEN }}>The rule we build by — deterministic first, AI last</p>
            <ul className="space-y-3">
              {[
                'Default to rules and math; escalate to AI only when they fall short.',
                'Never hand an LLM a job a SQL query or lookup can do.',
                'Cache aggressively, so identical inputs never re-bill.',
                'Batch and summarize before prompting; never feed raw transaction dumps.',
                'Own every layer, so each improvement compounds across the whole app.',
              ].map((r, i) => (
                <li key={i} className="flex gap-3 font-sans text-base leading-relaxed" style={{ color: BODY }}>
                  <span style={{ color: GREEN }}>→</span>{r}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ── 03 THE ARCHITECTURE ──────────────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionLabel>03 — The Architecture</SectionLabel>
          <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: INK }}>
            One pipeline, entirely ours — and AI touches only two steps
          </h2>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
            Every stage is owned in-house. External accounts enter at step 1 through a thin aggregation pipe, then flow through
            the exact same enrichment as held accounts. AI is gated to two things only: the hard cases of categorization, and
            narrating insights. Everything else is deterministic.
          </p>
        </motion.div>
        <motion.div {...fadeUp}>
          <Pipeline />
          <p className="font-sans text-xs mt-4 leading-relaxed max-w-3xl" style={{ color: MUTE }}>
            Only steps 2 and 5 ever call an LLM, and those calls are gated, batched, and cached. External and held accounts
            share one enrichment path, so outside accounts get the same first-party-quality categorization our own data does.
          </p>
        </motion.div>
      </section>

      {/* ── 04 COMPETITIVE LANDSCAPE ─────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: ALT }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionLabel>04 — The Competitive Landscape</SectionLabel>
            <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: INK }}>
              Two markets, and the gap between them
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-12">
              I studied this from both sides: the third-party apps people link their banks to, and what banks already ship
              inside their own apps. The apps prove the demand; the banks prove the strategy — because thrive's whole thesis is
              "it's your bank's own app."
            </p>
          </motion.div>

          {/* The apps */}
          <motion.div {...fadeUp}>
            <p className="font-sans text-sm font-semibold mb-1" style={{ color: INK }}>The apps people link their banks to</p>
            <p className="font-sans text-sm leading-relaxed max-w-3xl mb-6" style={{ color: DIM }}>
              Mint's 2024 shutdown pushed ~3.6M users to find a replacement, splitting the field into camps. Nearly all ride the
              same connectivity plumbing (Plaid, MX, Finicity), so aggregation is table stakes — the product, insight and trust
              layers are where they differ.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {[
                ['Copilot', '$95/yr', 'Design-first tracker', 'Best-in-class UX + ML categorization that learns fast.', 'Apple-only for years; no real free tier.'],
                ['Monarch', '$100/yr', 'Household finance hub', "Comprehensive; real couples / shared support. Mint's heir.", 'Price crept up; sync drops; a learning curve.'],
                ['YNAB', '$109/yr', 'Zero-based budgeting', 'Genuine behavior change; rigorous method + loyal base.', 'Steep learning curve; priciest; budgeting only.'],
                ['Rocket Money', 'Free / $6–12', 'Bill-cutting / subs', '1-tap subscription cancel; bill negotiation.', 'Weak as a full budgeter; takes 30–60% of savings.'],
                ['Empower', 'Free', 'Wealth / net worth', 'Best investment tracking + net-worth view.', 'Budgeting is an afterthought; advisor sales calls.'],
                ['Simplifi', '$36–48/yr', 'Affordable all-rounder', 'Real-time "spending plan"; the value pick.', 'Low brand awareness; no free tier.'],
              ].map(([app, price, kind, pro, con]) => (
                <div key={app} className="rounded-xl p-5" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
                  <div className="flex items-baseline justify-between mb-1">
                    <p className="font-display text-lg font-bold" style={{ color: INK }}>{app}</p>
                    <p className="font-mono text-xs" style={{ color: MUTE }}>{price}</p>
                  </div>
                  <p className="font-sans text-xs uppercase tracking-widest mb-3" style={{ color: GREEN }}>{kind}</p>
                  <p className="font-sans text-sm leading-relaxed mb-1.5" style={{ color: BODY }}><span style={{ color: GREEN }}>✓ </span>{pro}</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}><span style={{ color: RED }}>✕ </span>{con}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* The banks */}
          <motion.div {...fadeUp}>
            <p className="font-sans text-sm font-semibold mb-1" style={{ color: INK }}>And what banks already ship</p>
            <p className="font-sans text-sm leading-relaxed max-w-3xl mb-6" style={{ color: DIM }}>
              The real competitive floor. Incumbents (Chase, BofA, Wells) mostly bolt a shallow spending donut onto banking.
              Neobanks (Chime, Ally) set the real bar on simplicity and automation but stay thin on analysis. Only SoFi's
              "Relay" approaches full external aggregation inside a bank — and even it stays descriptive, not actionable.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              {[
                ['Shallow', 'Incumbents · Chase, BofA, Wells', 'A spending donut bolted onto banking. Ubiquitous and trusted, but no depth, no external accounts, no real insight.', RED],
                ['Moderate', 'Neobanks · Chime, Ally', "Win on effortless saving and clean UX (Ally's Buckets, Surprise Savings). Prove mainstream demand, but stay shallow on analysis.", '#B7791F'],
                ['Strong', 'SoFi · Relay', 'The one to watch. Aggregates external accounts inside a bank. Proves it\'s possible — but still descriptive, not AI-driven action.', GREEN],
              ].map(([tier, who, body, c]) => (
                <div key={tier} className="rounded-xl p-5" style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, borderTop: `3px solid ${c}` }}>
                  <p className="font-mono text-[11px] tracking-[0.16em] uppercase mb-1" style={{ color: c }}>{tier}</p>
                  <p className="font-sans text-sm font-semibold mb-2" style={{ color: INK }}>{who}</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{body}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="max-w-3xl">
            <div className="rounded-2xl p-7 md:p-8" style={{ backgroundColor: INK, color: '#fff' }}>
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-3" style={{ color: '#8B7BF0' }}>★ The white space</p>
              <p className="font-display text-lg md:text-xl font-bold leading-snug mb-3">
                The incumbents lack depth. The neobanks lack insight. The apps lack the bank.
              </p>
              <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                A bank-native, trusted experience with app-grade depth, external aggregation, AND proactive AI insight tied to
                goals — that intersection is open. Nobody holds all four. That's exactly the ground thrive is aimed at.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 05 THE PROPOSED FEATURE SET ──────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionLabel>05 — The Proposed Feature Set</SectionLabel>
          <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: INK }}>
            The plan: one hub, seven surfaces, AI only where it earns its place
          </h2>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
            Before evaluating anything, here's what the strategy committed us to build. The core move is consolidation: take the
            spending, budgets, goals, cash-flow and subscription tools that live scattered (or don't exist yet) and merge them
            into a single "Money" hub of seven tabs. Every number is computed deterministically; AI is reserved for narrating
            insights and cleaning the messy-merchant tail. This is the proposal the next section measures against.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {[
            ['Overview', 'The hub. A plain-language read on the month, net worth, and snapshots of everything else.'],
            ['Spending', 'Where the money went — a category donut, transactions with editable categories, top merchants.'],
            ['Budget', 'Zero-based: every dollar of income gets a job, with move-money and an optional auto-budget.'],
            ['Trends', 'Spending vs income over 12 months and the biggest category movers.'],
            ['Goals', 'Save toward things, funded from real accounts, with on-pace tracking and recovery fixes.'],
            ['Cash Flow', 'A 30-day projected balance and the income and bills that drive it.'],
            ['Subscriptions', 'Every recurring charge in one place, with price hikes, annual savings and overlap surfaced.'],
          ].map(([tab, desc], i) => (
            <div key={tab} className="rounded-xl p-5 flex gap-4" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
              <span className="font-display text-2xl font-black leading-none" style={{ color: `${INK}22` }}>{i + 1}</span>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-display text-base font-bold" style={{ color: INK }}>{tab}</p>
                  <span className="font-mono text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full" style={{ color: AI, backgroundColor: 'rgba(124,92,252,0.10)', border: `1px solid ${AI}40` }}>★ AI</span>
                </div>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div {...fadeUp}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-4" style={{ color: MUTE }}>Plus the bets that tie it together</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['Spending × Goals loop', 'Tie spending to goals so an insight becomes a plan: "dining slipped your vacation — here\'s the fix."'],
              ['Account-scope selector', 'View all accounts, one, or several — the same engine, just filtered, so it never re-bills AI.'],
              ['Link external accounts', 'Pull outside banks in through a thin pipe; they get the same first-party-quality enrichment.'],
            ].map(([t, d]) => (
              <div key={t} className="rounded-xl p-5" style={{ backgroundColor: ALT, border: `1px solid ${LINE}` }}>
                <p className="font-sans text-sm font-semibold mb-2" style={{ color: INK }}>{t}</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{d}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 06 POSITIONING ───────────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: ALT }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionLabel>06 — Positioning</SectionLabel>
            <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: INK }}>
              At parity on what's commoditized, alone on what matters
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
              I mapped the designed feature set against all eight apps on the same grid. The point isn't to beat everyone at
              everything — it's to own the intersection none of them hold, while staying at parity on the table stakes. And to be
              honest about the real gaps.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              ['We win', GREEN, [
                ['First-party, bank-native trust', 'The only ● in that row: your bank\'s app, data not sold.'],
                ['Spending × Goals loop', 'Cause → action ("dining slipped your vacation"); only Monarch & Simplifi even partial.'],
                ['Proactive, actionable AI insight', 'A consequence and a fix, not a restated number.'],
                ['Account scope selector', 'All, one, or many; most apps don\'t offer real multi-account scoping.'],
                ['One connected hub', 'Spending, budgets, goals, cash flow, subscriptions merged.'],
              ]],
              ['We match', '#B7791F', [
                ['Bank aggregation', '● like everyone; the price of entry.'],
                ['Categorization quality', 'On par with Copilot and Monarch.'],
                ['Subscription detection', 'Full, with a dedicated Subscriptions surface.'],
                ['Cash-flow forecast', 'On par with the best budgeters.'],
                ['Zero-based budgeting', "YNAB's signature mechanic, built: groups, rollover, auto-budget."],
                ['Design & UX polish', 'Competitive with the design leaders.'],
              ]],
              ['We lag', RED, [
                ['Bill negotiation', "We detect + hand off cancellation, but don't negotiate or auto-cancel (Rocket's niche)."],
                ['Household / shared access', 'Not built yet — a real gap versus Monarch.'],
                ['Investment depth', 'Partial: tracking, not a wealth tool like Empower.'],
                ['Education & coaching', 'We lead with insights, not lessons — no YNAB-style curriculum.'],
              ]],
            ].map(([head, c, rows]) => (
              <div key={head} className="rounded-2xl p-6" style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, borderTop: `3px solid ${c}` }}>
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-4" style={{ color: c }}>{head}</p>
                <ul className="space-y-4">
                  {rows.map(([t, d]) => (
                    <li key={t}>
                      <p className="font-sans text-sm font-semibold mb-0.5" style={{ color: INK }}>{t}</p>
                      <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{d}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
          <motion.p {...fadeUp} className="font-sans text-sm leading-relaxed max-w-3xl mt-8" style={{ color: DIM }}>
            The gaps are honest and mostly deliberate scope. The differentiation is real: thrive stands alone on the combination
            none of them hold.
          </motion.p>
        </div>
      </section>

      {/* ── 07 COST & VALIDATION ─────────────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionLabel>07 — Cost & Validation</SectionLabel>
          <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: INK }}>
            Cheap to run, and the front line already wants it
          </h2>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
            Two things had to be true for this to be worth building: it can't be expensive to operate, and the people who sell
            for a living have to believe in it. Both checked out.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          <div className="rounded-2xl p-7" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
            <p className="font-display text-4xl font-black mb-1" style={{ color: GREEN }}>≈ 2–3¢</p>
            <p className="font-sans text-sm font-semibold mb-3" style={{ color: INK }}>per active user, per month (AI cost, bottom-up)</p>
            <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
              AI runs on newsworthy events, not every app-open — roughly 4 to 12 narration calls a month. Opening the app 50
              times triggers zero new calls, because the screen reads cached narration over always-live numbers. It stays this
              cheap because the engine gates before it generates (~93% of categorization never reaches an LLM), caches
              everything, batches per event, and sends pre-computed numbers instead of raw transactions.
            </p>
          </div>
          <div className="rounded-2xl p-7" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
            <p className="font-display text-4xl font-black mb-1" style={{ color: GREEN }}>30 / 30</p>
            <p className="font-sans text-sm font-semibold mb-3" style={{ color: INK }}>reps said it would help them close — not one "maybe"</p>
            <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
              Before betting engineering cycles, I took it to the front line. The #1 gap reps hear from prospects today is
              "where's the money view?" This turns a recurring objection into a yes, flips feature-parity losses in competitive
              deals, and gives a live demo wow-moment. Read honestly: it's qualitative enthusiasm, not booked revenue — but it's
              demand from the people closest to the customer, before a line of code.
            </p>
          </div>
        </motion.div>

        {/* Pressure test */}
        <motion.div {...fadeUp}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: AI }}>Pressure-testing the cost · AI token math</p>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4" style={{ color: INK }}>Does the 2–3¢ number actually hold up?</h3>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-3">
            The plan asserts the AI layer costs about 2 to 3 cents per active user per month, but calls it back-of-napkin. The
            fair worry: a user has hundreds of transactions, and if we analyze all of them repeatedly, that gets expensive fast.
            This works the math bottom-up to see whether the number survives, and whether we have room to run AI more often.
          </p>
          <p className="font-sans text-xs leading-relaxed max-w-3xl mb-8" style={{ color: MUTE }}>
            Token prices are illustrative early-2026 rates and will shift. This is a sizing exercise to sanity-check the order of
            magnitude, not a billing forecast. The hypothetical: one engaged user · 3 accounts · ~200 transactions/mo · ~14
            re-categorized by AI (the ~7% messy tail) · ~30 narration runs (once-daily batch, at most).
          </p>
        </motion.div>

        {/* Math table */}
        <motion.div {...fadeUp} className="mb-12">
          <p className="font-sans text-sm font-semibold mb-3" style={{ color: INK }}>Every AI call, priced out</p>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${LINE}` }}>
            <table className="w-full text-left border-collapse" style={{ backgroundColor: CARD }}>
              <thead>
                <tr style={{ backgroundColor: ALT }}>
                  {['What calls the model', 'Calls / mo', 'Tokens (in / out)', 'Model', 'Cost / mo'].map((h) => (
                    <th key={h} className="font-mono text-[10px] tracking-[0.12em] uppercase px-4 py-3" style={{ color: MUTE }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Categorize the messy tail', '~14', '250 in / 40 out', 'Small (cheap)', '≈ $0.002'],
                  ['Daily narration batch', 'up to 30', '~450 in / 140 out', 'Small (cheap)', '$0.002–0.004'],
                  ['Weekly / monthly recap', '1', '~600 in / 250 out', 'Small (cheap)', '< $0.001'],
                  ['All budgets, trends, forecasts', '0', 'none', 'No model at all', '$0.00'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${LINE}` }}>
                    {row.map((cell, j) => (
                      <td key={j} className="font-sans text-sm px-4 py-3 align-top" style={{ color: j === 0 ? INK : DIM }}>{cell}</td>
                    ))}
                  </tr>
                ))}
                <tr style={{ borderTop: `2px solid ${LINE}`, backgroundColor: 'rgba(31,138,91,0.05)' }}>
                  <td className="font-sans text-sm font-bold px-4 py-3" style={{ color: INK }}>Blended total (small model)</td>
                  <td className="px-4 py-3" /><td className="px-4 py-3" /><td className="px-4 py-3" />
                  <td className="font-sans text-sm font-bold px-4 py-3" style={{ color: GREEN }}>≈ 0.4–0.8¢</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="font-sans text-xs mt-3 leading-relaxed max-w-3xl" style={{ color: MUTE }}>
            The key move: we send pre-computed numbers to the model ("dining $420, up 38%"), never the raw transactions. So input
            size stays tiny no matter how many transactions the user has.
          </p>
        </motion.div>

        {/* Expensive vs gated */}
        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          <div className="rounded-2xl p-6" style={{ backgroundColor: CARD, border: `1px solid rgba(192,57,43,0.25)` }}>
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase mb-1" style={{ color: RED }}>The expensive way (we avoid this)</p>
            <p className="font-display text-3xl font-black mb-3" style={{ color: RED }}>≈ 68¢ <span className="text-base font-bold" style={{ color: DIM }}>/ user / mo</span></p>
            <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
              Send every transaction to the model, refresh daily. ~200 transactions × ~30 tokens = ~6,000 input tokens every
              refresh, 30 passes a month, on a mid/frontier model. About 18× more expensive — and it scales with transaction
              count, which is the trap.
            </p>
          </div>
          <div className="rounded-2xl p-6" style={{ backgroundColor: CARD, border: `1px solid rgba(31,138,91,0.25)` }}>
            <p className="font-mono text-[11px] tracking-[0.14em] uppercase mb-1" style={{ color: GREEN }}>The gated way (the plan)</p>
            <p className="font-display text-3xl font-black mb-3" style={{ color: GREEN }}>≈ 0.3–3¢ <span className="text-base font-bold" style={{ color: DIM }}>/ user / mo</span></p>
            <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
              Deterministic math computes everything with no model. AI sees pre-computed numbers, not transactions (~400 input
              tokens, flat). Event-driven and cached: 4–12 narrations a month, not 30 full refreshes. Cost is decoupled from
              transaction count, which is why it stays a rounding error.
            </p>
          </div>
        </motion.div>

        {/* Headroom */}
        <motion.div {...fadeUp} className="mb-12">
          <p className="font-sans text-sm font-semibold mb-1" style={{ color: INK }}>Headroom — can we afford to run AI more often? Yes, easily.</p>
          <p className="font-sans text-sm leading-relaxed max-w-3xl mb-4" style={{ color: DIM }}>
            Because each narration is so cheap, we can dial insights up a lot before cost becomes a real line item.
          </p>
          <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${LINE}` }}>
            <table className="w-full text-left border-collapse" style={{ backgroundColor: CARD }}>
              <thead>
                <tr style={{ backgroundColor: ALT }}>
                  {['Scenario', 'Narrations / mo', 'Model', 'Cost / user / mo'].map((h) => (
                    <th key={h} className="font-mono text-[10px] tracking-[0.12em] uppercase px-4 py-3" style={{ color: MUTE }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Today's plan (conservative)", '~30 (daily)', 'Small model', '≈ 2–3¢'],
                  ['Narrate on a frontier model', '12', 'Frontier (nuanced prose)', '≈ 4¢'],
                  ['3× more insights', '~36', 'Frontier', '≈ 13¢'],
                  ['Daily insight, frontier model', '30', 'Frontier', '≈ 11¢'],
                  ['5× more insights (aggressive)', '~60', 'Frontier', '≈ 21¢'],
                ].map((row, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${LINE}` }}>
                    {row.map((cell, j) => (
                      <td key={j} className="font-sans text-sm px-4 py-3 align-top" style={{ color: j === 0 ? INK : DIM }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-sans text-xs mt-3 leading-relaxed max-w-3xl" style={{ color: MUTE }}>
            Even at 5× the insight frequency on a frontier model, we're around 20¢ a user per month. For context, the
            connectivity provider (Plaid and friends) is typically a bigger per-user line than any of this. AI frequency is a
            product decision we can make freely, not a cost ceiling we're pinned against.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="max-w-3xl mb-12">
          <Reframe label="The verdict">
            The number holds, but only because of the gate — and we have plenty of room to spend more. Break either rule (AI
            never touches raw transactions; it runs once a day at most) and you climb toward the 68¢ naive number. The discipline
            buys real freedom: we could narrate on a frontier model, several times a day, and still land around 10–20¢ a user per
            month. Cadence is ours to tune.
          </Reframe>
        </motion.div>

        {/* Cadence & immediacy */}
        <motion.div {...fadeUp}>
          <p className="font-sans text-sm font-semibold mb-1" style={{ color: INK }}>Cadence & immediacy — if I overspend, do I see it right away?</p>
          <p className="font-sans text-sm leading-relaxed max-w-3xl mb-5" style={{ color: DIM }}>
            Yes, instantly, and it has nothing to do with an AI call. Awareness and AI are two separate systems. The numbers and
            the warning are deterministic and fire the moment a transaction posts. AI only writes the smart version of that
            warning, and that is what we batch to once a day. You never wait on a model to find out you're over budget.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['The instant · $200 dinner posts', 'No AI', 'Live math recomputes', 'Budget bars, safe-to-spend, and totals update the moment the charge lands. The Dining bar turns red on the spot.', GREEN],
              ['The instant · same moment', 'No AI', 'Template alert fires', 'A built-in message triggers the second a threshold is crossed. No model involved, so there\'s no wait and no cost. "You\'re $130 over on Dining this month."', GREEN],
              ['Within a day · next batch', 'Batched', 'AI narrates the smart version', 'AI upgrades that alert into connected, plain-language insight, once in the daily batch. "Dining ran over and pushed your Vacation goal back a month. Trim two takeout orders to recover."', AI],
            ].map(([when, tag, title, body, c]) => (
              <div key={when} className="rounded-xl p-5" style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, borderTop: `3px solid ${c}` }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="font-mono text-[10px] tracking-[0.12em] uppercase" style={{ color: MUTE }}>{when}</p>
                  <span className="font-mono text-[9px] font-bold tracking-[0.1em] uppercase px-2 py-0.5 rounded-full" style={{ color: c, backgroundColor: `${c}14`, border: `1px solid ${c}40` }}>{tag}</span>
                </div>
                <p className="font-display text-base font-bold mb-2" style={{ color: INK }}>{title}</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 08 HOW IT WORKS (flows) ──────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: ALT }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionLabel>08 — How it works</SectionLabel>
            <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: INK }}>
              The reasoning: each feature as a flow
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-6">
              Between the plan and the pixels, I mapped how each core feature actually behaves — the path a person takes, the
              decision points, and exactly where AI enters. This is the process work that made the screens inevitable. Notice the
              shape repeat: deterministic steps do the work, and AI shows up only to clean the messy tail or narrate.
            </p>
            <div className="flex flex-wrap gap-4 mb-10 font-mono text-[10px] tracking-[0.1em] uppercase" style={{ color: MUTE }}>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: GREEN }} />Deterministic</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: AI }} />AI step</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rotate-45" style={{ backgroundColor: '#B7791F' }} />Decision</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: INK }} />End state</span>
            </div>
          </motion.div>

          <div className="space-y-6">
            {[
              ['Link an external account', "thrive owns the intro and success screens; the connectivity provider handles secure login in between. Once linked, raw transactions flow into our own engine. AI enters at one step only: cleaning merchant names the rules can't resolve.",
                [['Tap "Link account"','d'],['Provider: choose bank & login','d'],['Choose accounts to share','d'],['Transactions import','d'],['Enrich & categorize','a'],['Now in your view','e']]],
              ['Choose which accounts you\'re viewing', 'A global scope selector re-runs only the deterministic math on the accounts you pick. There is no AI in this flow at all — which is exactly why filtering is instant and never re-bills.',
                [['Open scope selector','d'],['See grouped accounts','d'],['Pick all / one / several','d'],['Tap Apply','d'],['Re-run the math (no AI)','d'],['Views update, scoped','e']]],
              ['Fix a category, and it sticks', 'Rules categorize most transactions. For the messy tail, AI suggests a fix; if you say "remember this," we write a plain forward rule so every future charge auto-fixes. The branch is the whole point: remember once, or train the app forever.',
                [['Tap category chip','d'],['Suggest a category (rules + AI tail)','a'],['Remember this?','q'],['Save once / create forward rule','d'],['Future ones auto-fix','e']]],
              ['Build a zero-based budget', 'Every dollar of income gets a job. You can auto-build from history or set it up by hand. When a category goes over, we prompt you to cover it by moving money — keeping the plan balanced. AI touches one optional spot: the auto-budget suggestion.',
                [['Open Budget','d'],['Auto or manual?','q'],['Auto-budget (from 3-mo history)','a'],['Assign every dollar to $0','d'],['Category over? Move money','d'],['Stays balanced','e']]],
              ['Set a goal and stay on track', 'You pick a target; we size the monthly contribution and fund it from a real account. Pace tracking is deterministic. AI comes in only to narrate why a goal slipped and to frame the fixes in plain language.',
                [['Create a goal & target','d'],['Size the monthly (target ÷ months)','d'],['Fund from an account','d'],['Track pace continuously','d'],['Slipped? surface why + fixes','a'],['Back on track','e']]],
              ['See every subscription, cut the waste', 'We detect recurring charges from transactions and gather them in one place, flagging price hikes, annual savings and overlap from billing data alone. Any plan change hands off to the provider. AI only writes the plain-language insight — it narrates, it doesn\'t decide.',
                [['Detect recurring (cadence math)','d'],['Flag hikes / annual / overlap','d'],['Open Subscriptions','d'],['Act? hand off to provider','d'],['Write the savings insight','a']]],
            ].map(([title, desc, steps]) => (
              <motion.div key={title} {...fadeUp} className="rounded-2xl p-6 md:p-7" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
                <p className="font-display text-lg font-bold mb-2" style={{ color: INK }}>{title}</p>
                <p className="font-sans text-sm leading-relaxed max-w-3xl mb-5" style={{ color: DIM }}>{desc}</p>
                <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                  {steps.map(([label, type], i) => {
                    const c = type === 'a' ? AI : type === 'q' ? '#B7791F' : type === 'e' ? INK : GREEN
                    const bg = type === 'e' ? INK : `${c}12`
                    const fg = type === 'e' ? '#fff' : c
                    return (
                      <span key={i} className="flex items-center gap-1.5">
                        <span className="font-sans text-[12px] font-medium px-3 py-1.5 leading-tight"
                          style={{ color: fg, backgroundColor: bg, border: `1px solid ${c}${type==='e'?'':'40'}`, borderRadius: type === 'q' ? '4px' : '999px' }}>
                          {type === 'a' && <span className="font-bold">★ </span>}{label}
                        </span>
                        {i < steps.length - 1 && <span style={{ color: MUTE }}>→</span>}
                      </span>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p {...fadeUp} className="font-sans text-sm leading-relaxed max-w-3xl mt-8" style={{ color: DIM }}>
            Six flows, one pattern: the math is ours and always-on, AI is gated to the two things only language and judgment do
            well. That discipline is what the whole product is built on.
          </motion.p>
        </div>
      </section>

      {/* ── 09 FINAL DESIGN ──────────────────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionLabel>09 — The Redesign</SectionLabel>
          <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: INK }}>
            One hub, seven surfaces, AI kept on a short leash
          </h2>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-4">
            The redesign turned a single widget into a real personal-finance hub: Overview, Spending, Budget, Trends, Goals, Cash
            Flow and Subscriptions — plus the workflows that make each one usable. The spine is a plain-language answer to "am I
            okay this month?" up top, deterministic math everywhere, and AI only narrating or cleaning the messy tail.
          </p>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-8">
            The Overview is the front door. It leads with a written summary of the month, a net-worth trend, and snapshots of
            spending, goals, budget and upcoming bills — every number computed, the words generated.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <ImgSlot name="OverviewDesktop" caption="Overview — the front door" />
          <ImgSlot name="BudgetDesktop" caption="Budget — zero-based" />
          <ImgSlot name="GoalsDesktop" caption="Goals — on-pace tracking" />
          <ImgSlot name="CashFlowDesktop" caption="Cash Flow — 30-day projection" />
        </motion.div>

        <motion.div {...fadeUp}>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-6">
            The workflows are where the product earns trust. Every edit that ripples — changing a budget line, raising a goal,
            adding a one-time expense — previews its impact across Budget, Cash Flow and Goals before you commit. When a goal
            falls behind, the app offers concrete fixes with the tradeoffs tagged, not a scolding.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            <ImgSlot name="MoveMoneyDesktop" caption="Move money to cover an overspend" />
            <ImgSlot name="BackOnTrackDesktop" caption="Recover a goal that slipped" />
            <ImgSlot name="PlanBBigExpenseDesktop" caption="Plan a big one-time expense" />
          </div>
        </motion.div>

        <motion.div {...fadeUp}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: MUTE }}>And on mobile — the same hub, reflowed</p>
          <p className="font-sans text-sm leading-relaxed max-w-3xl mb-6" style={{ color: DIM }}>
            Every surface has a mobile counterpart. The hierarchy holds — the plain-language answer stays on top, snapshots stack
            into a single column, and the workflows keep their cross-tab impact previews.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['OverviewMobile','BudgetMobile','GoalsMobile','CashFlowMobile','MoveMoneyMobile','BackOnTrackMobile','PlanABigExpenseMobile'].map((n) => (
              <ImgSlot key={n} name={n} ratio="9 / 19" />
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 10 BEFORE / AFTER ────────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: ALT }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionLabel>10 — Before & After</SectionLabel>
            <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: INK }}>
              From the old tool to thrive, side by side
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
              A version of this feature already exists in production today. These pairs put the current experience next to the
              redesign. The "before" frames are placeholders — real production screenshots to be dropped in — but the story each
              tells is the same: a thin, generic view became a purposeful one.
            </p>
          </motion.div>

          {[
            ['The Landing View', 'TheLandingViewBefore', 'TheLandingViewAfter', 'The old view was a single donut and a raw transaction list. The redesign leads with a plain-language read on the month, net worth, and snapshots that route into each area — so someone gets an answer, not just a chart.'],
            ['Spending', 'SpendingBefore', 'SpendingAfter', 'Same donut idea, but now paired with a ranked category list, top merchants, editable categories, and AI-cleaned merchant names — turning a picture into something you can actually act on.'],
            ['Budgeting', 'BudgetingBefore', 'BudgetingAfter', 'Where the old tool had no real budgeting, the redesign is zero-based: every dollar gets a job, categories group and roll over, and overspend is coverable by moving money — no new money required.'],
          ].map(([label, before, after, changed]) => (
            <motion.div key={label} {...fadeUp} className="mb-12">
              <p className="font-display text-xl font-bold mb-4" style={{ color: INK }}>{label}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                <ImgSlot name={before} caption="Before (production today)" />
                <ImgSlot name={after} caption="After (redesign)" />
              </div>
              <p className="font-sans text-sm leading-relaxed max-w-3xl" style={{ color: DIM }}>
                <span className="font-mono text-[10px] tracking-[0.14em] uppercase mr-2" style={{ color: GREEN }}>What changed</span>
                {changed}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 11 THE PANEL ─────────────────────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionLabel>11 — Research</SectionLabel>
          <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: INK }}>
            Then I gave it to six people who aren't me
          </h2>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-6">
            The design tested beautifully in my head. So I ran a moderated-style study across all 26 flows with a panel built to
            stretch it — a spread of age, tech comfort, financial literacy, account complexity, language, and one participant with
            low vision. I wanted the places where a confident user glides and everyone else stalls.
          </p>
          <div className="rounded-xl p-5 max-w-3xl mb-10" style={{ backgroundColor: ALT, borderLeft: `3px solid ${AI}`, border: `1px solid ${LINE}` }}>
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase mb-2" style={{ color: AI }}>Method</p>
            <p className="font-sans text-sm leading-relaxed" style={{ color: BODY }}>
              Full transparency: this was a simulated panel — six constructed personas walked through the flows, not live
              recruits. Findings are weighted hypotheses to confirm with real sessions, and I flag the highest-severity ones as
              exactly that. The value is the pattern: the same walls show up for the same kinds of people.
            </p>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            ['Margaret, 68', 'Retired teacher, fixed income, tablet', 'Cautious, reads every word', '1 checking + 1 savings, loss-averse', 'Dense screens, jargon, anything irreversible'],
            ['Darnell, 41', 'HVAC business owner, phone-first', 'Comfortable, no patience for clutter', 'Personal + business + a corp card', 'Business and personal money mixing'],
            ['Priya, 29', 'Product manager, power user', 'Expert, hates dead clicks', 'Several accounts, automates everything', 'Any friction or a feature that stops short'],
            ['Robert, 55', 'Warehouse supervisor, watches every dollar', 'Moderate, taps carefully', 'Paycheck to paycheck, low finance literacy', 'Jargon, similar-looking numbers'],
            ['Sofia, 22', 'Nursing student, first-gen, ESL, mobile', 'High on phones, new to money apps', 'Thin file: one checking, part-time income', 'Idioms, empty screens, desktop-only'],
            ['Gene, 74', 'Retired machinist, low vision + tremor', 'Low, desktop with large text', 'Pension + savings, deliberate', 'Low contrast, tiny targets, small chevrons'],
          ].map(([name, who, tech, money, watch]) => (
            <div key={name} className="rounded-xl p-5" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
              <p className="font-display text-lg font-bold mb-0.5" style={{ color: INK }}>{name}</p>
              <p className="font-sans text-sm mb-4" style={{ color: DIM }}>{who}</p>
              <dl className="space-y-2">
                {[['Tech', tech],['Money', money],['Watch', watch]].map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <dt className="font-mono text-[9px] tracking-[0.12em] uppercase pt-1 w-12 shrink-0" style={{ color: MUTE }}>{k}</dt>
                    <dd className="font-sans text-sm leading-snug" style={{ color: BODY }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── 12 WHAT THE RESEARCH CHANGED ─────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: ALT }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionLabel>12 — What the research changed</SectionLabel>
            <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: INK }}>
              Tested it, changed it, tested it again
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-6">
              I didn't run one study and call it done. I ran two: a first round on the initial build, then a second round on the
              fixed product to see what the fixes had exposed. The strongest changes came from watching real tasks fail,
              redesigning, and re-checking.
            </p>
            <div className="flex flex-wrap gap-2 mb-12">
              {['Am I okay this month?','Where did my money actually go?','Cover a category I overspent','Rescue a goal that\'s behind','Set an alert before I bust a budget','Start out as a brand-new customer'].map((t) => (
                <span key={t} className="font-sans text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, color: DIM }}>{t}</span>
              ))}
            </div>
          </motion.div>

          {/* Round 1 */}
          <motion.div {...fadeUp} className="mb-12">
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase mb-1" style={{ color: RED }}>Round 1 · Testing the first build</p>
            <h3 className="font-display text-2xl font-bold mb-3" style={{ color: INK }}>The first pass found the loud problems</h3>
            <p className="font-sans text-sm leading-relaxed max-w-3xl mb-5" style={{ color: DIM }}>
              Three findings broke a task or a trust moment; several more caused real hesitation. The clearest design failure:
              people set up alerts and then had nowhere to see them. Configuring a notification worked, but it vanished into the
              OS — no bell, no inbox, no way to confirm it or review it later.
            </p>
            <div className="rounded-2xl p-6 mb-5" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
              <p className="font-mono text-[10px] tracking-[0.14em] uppercase mb-1" style={{ color: MUTE }}>Gap · No home for alerts · Task: "Ping me before I bust my dining budget."</p>
              <p className="font-display text-lg font-bold leading-snug mb-2" style={{ color: INK }}>
                "Where do these show up later? I set it, but I have no way to check what it'll send me."
              </p>
              <p className="font-sans text-xs" style={{ color: MUTE }}>— Priya, 29</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
              <ImgSlot name="Round1Before" caption="Before" />
              <ImgSlot name="Round1After" caption="After" />
            </div>
            <p className="font-sans text-sm leading-relaxed max-w-3xl" style={{ color: DIM }}>
              <span className="font-semibold" style={{ color: INK }}>What changed:</span> added a notification bell to the nav that
              opens an inbox of past alerts, so the notifications people configure finally have a visible home.
              <span className="font-semibold" style={{ color: INK }}> Why:</span> an alert that only lives as an OS push gets
              missed and can't be revisited — it hurt both the power user (wants a log) and the cautious user (wants proof).
            </p>
          </motion.div>

          {/* Round 2 */}
          <motion.div {...fadeUp} className="mb-12">
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase mb-1" style={{ color: GREEN }}>Round 2 · Re-testing the fixed build</p>
            <h3 className="font-display text-2xl font-bold mb-3" style={{ color: INK }}>Fixing the loud problems exposed a quieter one</h3>
            <p className="font-sans text-sm leading-relaxed max-w-3xl mb-5" style={{ color: DIM }}>
              The second round ran on the repaired product — and came back with no critical issues, which is exactly what you
              want. What it surfaced was subtler: brand-new customers had no single place to start. My own empty-state fixes had
              left six tabs each saying "start here," with no front door. The response wasn't a tweak — it was designing an
              onboarding system.
            </p>
            <div className="rounded-2xl p-6 mb-5" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
              <p className="font-mono text-[10px] tracking-[0.14em] uppercase mb-1" style={{ color: MUTE }}>New · Onboarding system · Task: "I'm brand new here. Where do I begin?"</p>
              <p className="font-display text-lg font-bold leading-snug mb-2" style={{ color: INK }}>
                "Every tab wants me to do something different. Which one do I actually do first?"
              </p>
              <p className="font-sans text-xs" style={{ color: MUTE }}>— Sofia, 22</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
              <ImgSlot name="Round2Before" caption="Before" />
              <ImgSlot name="Round2After" caption="After" />
            </div>
            <p className="font-sans text-sm leading-relaxed max-w-3xl" style={{ color: DIM }}>
              <span className="font-semibold" style={{ color: INK }}>What changed:</span> designed a first-visit spotlight tour
              that orients new members, plus renamed the misleading "Link Account" button to "Link external account" so no one
              thinks linking is required to begin. <span className="font-semibold" style={{ color: INK }}>Why:</span> the clearest
              case of research driving design — the strategy phase never anticipated it. A new customer needs one guided path, not
              six competing invitations, so I built the tour: skippable and replayable from the header.
            </p>
          </motion.div>

          {/* Scope filter — tested twice */}
          <motion.div {...fadeUp} className="mb-12">
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase mb-3" style={{ color: MUTE }}>The clearest proof we tested twice</p>
            <h3 className="font-display text-xl font-bold mb-3" style={{ color: INK }}>One control, refined across both rounds</h3>
            <p className="font-sans text-sm leading-relaxed max-w-3xl mb-5" style={{ color: DIM }}>
              The account-scope filter is the whole method in miniature. Tested, changed, tested again — on the same control.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                ['Round 1 · Found', RED, 'Ticking an account did nothing until Apply. Cautious users assumed the control was broken.'],
                ['Fix', '#B7791F', 'Added a "1 change pending — press Apply" hint so the delay reads as intentional.'],
                ['Round 2 · Refined', GREEN, 'Hint annoyed the power user on a single pick. Split it: single applies instantly, multi confirms.'],
              ].map(([h, c, b]) => (
                <div key={h} className="rounded-xl p-5" style={{ backgroundColor: CARD, border: `1px solid ${LINE}`, borderTop: `3px solid ${c}` }}>
                  <p className="font-mono text-[10px] tracking-[0.12em] uppercase mb-2" style={{ color: c }}>{h}</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{b}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dozen smaller refinements */}
          <motion.div {...fadeUp}>
            <p className="font-mono text-[11px] tracking-[0.16em] uppercase mb-3" style={{ color: MUTE }}>And a dozen smaller refinements</p>
            <h3 className="font-display text-xl font-bold mb-5" style={{ color: INK }}>The quiet fixes that add up to trust</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ['The wrong celebration number', 'A goal-achieved headline read $1,000 while everything else said $10,000. Bound it to one source so it can\'t drift — a bug in the most emotional moment.'],
                ['A toggle that read backwards', 'The "reserve in budget" switch showed ON in the inactive gray. Colored the on-state track so people can trust what it\'s doing.'],
                ['Numbers that looked sloppy', 'Some amounts showed "$10000". Ran every value through one formatter with thousands separators. Precision reads as care.'],
                ['Charts you couldn\'t read exactly', 'Added y-axis values, tooltips, and tap-to-pin so tremor and low-vision users can read a bar\'s value without a steady hover.'],
                ['A goal detail no one could find', 'Goal cards didn\'t look tappable, hiding the richest screen. Added a chevron so the door is visible.'],
                ['Jargon on a key control', '"Reprioritize" meant nothing to lower-literacy and ESL testers. Renamed it "Adjust monthly split."'],
                ['A payment with no closure', 'Pay-a-bill promised a confirmation but showed none. Added a receipt with a confirmation number and the account\'s new balance.'],
                ['A destructive action with no guard', 'Disconnecting a linked account happened instantly. Added a confirm step so cautious users aren\'t afraid to explore.'],
              ].map(([t, b]) => (
                <div key={t} className="rounded-xl p-5" style={{ backgroundColor: CARD, border: `1px solid ${LINE}` }}>
                  <p className="font-sans text-sm font-semibold mb-1" style={{ color: INK }}>{t}</p>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{b}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OUTCOME ──────────────────────────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <motion.div {...fadeUp}>
          <SectionLabel>Outcome</SectionLabel>
          <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)', color: INK }}>
            From "fails the majority" to "works for everyone"
          </h2>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
            Two rounds of testing bent the trajectory hard. The first round found things that broke tasks and trust; the second,
            run on the fixed product, found no critical issues at all — just a thinner, more sophisticated layer, most of which
            the first round's fixes had exposed. That's the shape of healthy iteration.
          </p>
        </motion.div>
        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <Stat value="3 → 0" label="critical, task-breaking issues between round 1 and round 2" />
          <Stat value="17 → 5" label="open backlog items after iterating; none are blockers" />
          <Stat value="+1" label="first-run walkthrough, built to answer the one gap round 2 found" />
        </motion.div>
        <motion.p {...fadeUp} className="font-sans text-base leading-relaxed max-w-3xl" style={{ color: DIM }}>
          The changes weren't cosmetic. A corrected celebration amount, four dead-end screens turned into real destinations, a
          payment that now shows its receipt and new balance, a filter that no longer feels broken, plainer language, an
          accessibility pass, and a first-run tour that finally gives a new customer one clear front door instead of six
          competing "start here" screens.
        </motion.p>
      </section>

      {/* ── 13 REFLECTION ────────────────────────────────────────────────── */}
      <section className="py-20" style={{ backgroundColor: INK, color: '#fff' }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionLabel light>13 — Reflection</SectionLabel>
            <h2 className="font-display font-black leading-tight mb-6" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)' }}>
              What I'd carry into the next project
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-12" style={{ color: 'rgba(255,255,255,0.72)' }}>
              The lesson that stuck: what a power user shrugs off is where a cautious user stops and blames themselves. A dead
              button, a silent filter, a bit of jargon — I'd have shipped past all of them, because I'm fluent in my own design.
              The people at the edges are the ones who told the truth about it, and they're the majority a bank actually serves.
            </p>
          </motion.div>
          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              ['Separate the bets', '"Own the UI" and "own the data" were different decisions with different risk. Naming that early kept the project honest and shippable.'],
              ['Reserve AI for judgment', 'Deterministic math does the heavy lifting; AI only narrates or cleans the messy tail. That\'s what kept it fast, trustworthy, and cheap to run.'],
              ['Test past yourself', 'The design I\'d have defended on day one failed the people who most needed it to work. The version worth shipping is the one research forced.'],
            ].map(([t, b]) => (
              <div key={t} className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <p className="font-display text-lg font-bold mb-2">{t}</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>{b}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── NEXT PROJECT ─────────────────────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <div style={{ borderTop: `1px solid ${LINE}` }} className="pt-12">
          <Link to="/alerts-redesign" className="group inline-block">
            <p className="font-sans text-sm mb-2" style={{ color: MUTE }}>Next project</p>
            <h3 className="font-display font-black leading-none transition-opacity duration-300 group-hover:opacity-60" style={{ fontSize: 'clamp(2rem,5vw,4rem)', color: INK }}>
              Alerts Redesign
            </h3>
          </Link>
        </div>
      </section>

    </main>
  )
}
