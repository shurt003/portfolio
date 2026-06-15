import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import usePageMeta from '../../hooks/usePageMeta'

/* ── Palette (sampled from the Figma export) ─────────────────────────────── */
const NAVY   = '#1C345A'
const INK    = '#1C345A'
const BODY   = '#4A5568'
const MUTE   = '#8A94A6'
const LINE   = 'rgba(28,52,90,0.12)'
const ALT_BG = '#F4F6F9'
const GREEN  = '#16784B'
const RED    = '#E54236'
const AMBER  = '#B7791F'
const TEAL   = '#1C8C7D'
const BLUE   = '#2B6CB0'

/* Folder is intentionally NOT named "alerts" — the URL segment /alerts/ is
   blocked by common ad-blocker / privacy filter lists, which would hide these
   screenshots for real visitors. */
const IMG_BASE = '/images/alertscase/'

const fadeUp = {
  initial:    { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport:   { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
}

/* ── Image slot: renders the real image once dropped in /images/alerts,
   otherwise a labelled placeholder that mirrors the red boxes in the export. */
function ImgSlot({ name, caption, ratio = '16 / 10' }) {
  const [failed, setFailed] = useState(false)
  const src = `${IMG_BASE}${name}.png`
  if (failed) {
    return (
      <figure className="w-full">
        <div
          className="w-full rounded-xl flex flex-col items-center justify-center text-center px-6"
          style={{
            aspectRatio: ratio,
            border: `2px dashed ${RED}`,
            backgroundColor: 'rgba(229,66,54,0.05)',
            color: RED,
          }}
        >
          <span className="font-mono text-xs tracking-[0.18em] uppercase">Image · {name}</span>
          {caption && <span className="font-sans text-sm mt-2 max-w-md" style={{ color: 'rgba(229,66,54,0.8)' }}>{caption}</span>}
        </div>
      </figure>
    )
  }
  return (
    <figure className="w-full">
      <img
        src={src}
        alt={caption || name}
        onError={() => setFailed(true)}
        className="w-full h-auto block rounded-xl"
        style={{ border: `1px solid ${LINE}`, boxShadow: '0 20px 50px -30px rgba(28,52,90,0.35)' }}
      />
    </figure>
  )
}

/* ── Small UI helpers ────────────────────────────────────────────────────── */
function SectionLabel({ children, light }) {
  return (
    <p
      className="font-mono text-xs tracking-[0.2em] uppercase mb-5"
      style={{ color: light ? 'rgba(255,255,255,0.5)' : MUTE }}
    >
      {children}
    </p>
  )
}

function StatCard({ value, label, sub }) {
  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: 'rgba(22,120,75,0.06)', border: '1px solid rgba(22,120,75,0.16)' }}>
      <p className="font-display text-4xl font-black mb-2" style={{ color: GREEN }}>{value}</p>
      <p className="font-sans text-sm font-semibold" style={{ color: INK }}>{label}</p>
      {sub && <p className="font-sans text-xs mt-1 leading-snug" style={{ color: MUTE }}>{sub}</p>}
    </div>
  )
}

const TONE = {
  amber: { fg: AMBER, bg: 'rgba(183,121,31,0.08)', bd: 'rgba(183,121,31,0.3)' },
  red:   { fg: RED,   bg: 'rgba(229,66,54,0.06)',  bd: 'rgba(229,66,54,0.3)' },
  teal:  { fg: TEAL,  bg: 'rgba(28,140,125,0.07)', bd: 'rgba(28,140,125,0.3)' },
  blue:  { fg: BLUE,  bg: 'rgba(43,108,176,0.07)', bd: 'rgba(43,108,176,0.3)' },
}

function Callout({ tone = 'amber', label, children }) {
  const t = TONE[tone]
  return (
    <div className="rounded-xl p-6" style={{ backgroundColor: t.bg, borderLeft: `3px solid ${t.fg}`, border: `1px solid ${t.bd}` }}>
      {label && <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: t.fg }}>{label}</p>}
      <p className="font-sans text-[15px] leading-relaxed" style={{ color: BODY }}>{children}</p>
    </div>
  )
}

function Tag({ tone, children }) {
  const t = TONE[tone] || TONE.blue
  return (
    <span
      className="font-mono text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ color: t.fg, backgroundColor: t.bg, border: `1px solid ${t.bd}` }}
    >
      {children}
    </span>
  )
}

/* ── Data ────────────────────────────────────────────────────────────────── */
const OBJECTIVES = [
  'Enable bulk alert creation across multiple accounts at once',
  'Support both small and large account portfolios in one unified design',
  'Modernize the visual design of the alerts experience',
  'Make filtering and delivery-preference management intuitive',
  'Ensure the new flow feels familiar and low-friction for all users',
]

const COMPETITORS = [
  ['Chase', 'Set alerts per account — must repeat every step for each account', 'None'],
  ['Wells Fargo', 'Checkbox UI per account; thresholds entered separately each time', 'None'],
  ['Bank of America', '“Quick Setup” enrolls essential alerts — but only one account at a time', 'Partial'],
  ['U.S. Bank', 'Dropdown account switching, toggle alerts, repeat per account', 'None'],
  ['Gmail Filters', 'Define a rule once; it applies to all matching items automatically', 'Yes'],
  ['Shopify Admin', 'Filter → select → bulk-edit shared properties across many items', 'Yes'],
  ['Notion / Linear', 'Checkbox on hover → contextual bulk-action toolbar on selection', 'Yes'],
]
const BULK_TONE = { None: 'red', Partial: 'amber', Yes: 'teal' }

const TERMINOLOGY = [
  ['“Online Transaction Alert” doesn’t mean online purchases', 'Its dropdown is ACH Batch, EFTPS, Domestic Wire, Payroll, Stop Payment — commercial treasury operations. The name points the opposite way from its contents.'],
  ['“History Alert” contains no history', 'Its fields are Debit / Check Number — it’s really transaction monitoring, overlapping almost entirely with the “Online Transaction” bucket.'],
  ['Mislabeled fields compound it', '“Frequency” defaults to “When alert criteria is met” (a trigger, not a frequency), and “Transaction Type” mixes types (Debit, Credit) with search fields (Check Number, Description).'],
]

const STEPS = [
  {
    step: 'Step 1', title: 'Two variants: a simple mode and an advanced mode',
    body: 'My first instinct was to split the experience — a basic flow for casual users and an advanced one for power users. It worked on paper, but meant two parallel systems.',
    imgs: [['step1-advanced-mode', 'Advanced mode — per-account alert list']],
  },
  {
    step: 'Step 2', title: 'Collapse to a single, scalable experience',
    body: 'After talking with engineering, two workflows meant more code to maintain and more that could break. I unified into one design that scales — simpler to build and to use.',
    imgs: [
      ['create-select-accounts', 'Select accounts'],
      ['create-configure-alerts', 'Configure alert settings'],
      ['create-review-apply', 'Review & apply'],
    ],
  },
  {
    step: 'Step 3', title: 'A unified “Create New Alert” entry point',
    body: 'One clear, guided flow to create an alert and apply it to any number of accounts — replacing the scattered, per-type entry points of the old experience.',
    imgs: [['alert-management', 'Alert Management dashboard']],
  },
  {
    step: 'Step 4', title: 'Group Alerts vs. Individual Alerts',
    body: 'After collaborating with other designers, surfacing Group and Individual alerts as distinct sections proved more discoverable than hiding the choice behind a dropdown.',
    imgs: [['alert-management', 'Group & individual alerts, in one view']],
  },
]

const STATS = [
  ['87.9', 'SUS Score', 'Directional, n=6 · “Excellent” range (95% CI 74.9–100)'],
  ['5.6 / 7', 'VisAWI', 'Visual aesthetics rating'],
  ['79%', 'Avg. task completion', 'Across all four tasks (66.7%–100%)'],
  ['5.9 / 7', 'Avg. SEQ', 'Single-task ease across the four tasks'],
]

/* Per-task results from the readout — full breakdown, not just the highlights */
const TASK_RESULTS = [
  ['1', 'Create an alert group', '66.7%', '5.7'],
  ['2', 'Edit one alert within a group', '100%', '5.7'],
  ['3', 'Create a single alert', '83.3%', '6.2'],
  ['4', 'Bulk edit a group', '66.7%', '6.0'],
]

const TRIAGE = [
  ['ACCEPTED', 'Remove pre-selected choices from the form', 'HIGH'],
  ['ACCEPTED', 'Given the frequency field didn’t look changeable, remove its pre-selected choice', 'HIGH'],
  ['ACCEPTED', 'Make account numbers visible on mobile when participants open the dropdown', 'HIGH'],
  ['ACCEPTED', 'Explore clearer visual treatment / wording / iconography for the group-view button', 'MEDIUM'],
  ['ACCEPTED', 'Prompt users to move an alert out of a group when they make a single change', 'MEDIUM'],
  ['ACCEPTED', 'Rename “Group Name” to “Alert Group Name”', 'LOW'],
  ['ACCEPTED', 'Make the accounts in the group-edit modal clearly clickable (or clearly not)', 'LOW'],
  ['ACCEPTED', 'Add tooltips to the single edit and delete buttons', 'LOW'],
  ['ACCEPTED', 'Increase the duration of the toast notification and make it stand out more visually', 'LOW'],
  ['REJECTED', 'Explore other visual treatments for the “Create New Alert” button to make it stand out', 'HIGH'],
  ['ACCEPTED', 'Allow users to search for group names with the search function', 'MEDIUM'],
]
const STATUS_TONE = { ACCEPTED: 'teal', REJECTED: 'red', OPEN: 'amber' }
const PRIORITY_TONE = { HIGH: 'red', MEDIUM: 'amber', LOW: 'blue' }

const wrap = 'max-w-5xl mx-auto px-6 md:px-10'

/* ── Page ────────────────────────────────────────────────────────────────── */
export default function AlertsRedesign() {
  usePageMeta(
    'Alerts Redesign by Stephen Hurt',
    'One unified alert-creation experience — effortless for a customer with 3 accounts, powerful enough for a business managing 100+.'
  )

  return (
    <main style={{ backgroundColor: '#FFFFFF', color: BODY }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: NAVY, color: '#fff' }}>
        <div className={`${wrap} pt-32 pb-16`}>
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Case Study · Desktop Banking
          </p>
          <h1 className="font-display font-black leading-[0.95] mb-7" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
            Alerts
          </h1>
          <p className="font-sans text-lg md:text-xl leading-relaxed max-w-2xl mb-12" style={{ color: 'rgba(255,255,255,0.75)' }}>
            One unified alert-creation experience — effortless for a customer with 3 accounts, powerful enough for a business managing 100+.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
            {[
              ['Role', 'Lead Designer (+ 3 designers)'],
              ['Timeline', '3 months'],
              ['Team', 'PO, Shared Features · Engineering · UX Research'],
              ['Platform', 'Desktop-first (responsive)'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{k}</p>
                <p className="font-sans text-sm leading-snug" style={{ color: 'rgba(255,255,255,0.9)' }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 02 OVERVIEW ──────────────────────────────────────────────────── */}
      <section className={`${wrap} pt-24`}>
        <motion.div {...fadeUp}>
          <SectionLabel>01 — Overview</SectionLabel>
          <h2 className="font-display font-black leading-tight mb-10" style={{ fontSize: 'clamp(2rem,4.5vw,3.4rem)', color: INK }}>
            Problem, goal, and who it’s for
          </h2>
        </motion.div>

        <motion.div {...fadeUp} className="rounded-2xl p-8 md:p-10 mb-12" style={{ backgroundColor: NAVY, color: '#fff' }}>
          <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Alerts Redesign</p>
          <p className="font-display text-3xl font-black mb-2">Alerts</p>
          <p className="font-sans text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>A scalable, modern alert-creation experience for all account types.</p>
        </motion.div>

        <motion.div {...fadeUp} className="mb-12">
          <SectionLabel>The Problem</SectionLabel>
          <div className="space-y-4 max-w-3xl">
            <p className="font-sans text-base leading-relaxed">Today, users can only create one alert for one account at a time. For users managing many accounts — sometimes hundreds — this makes alert setup tedious, time-consuming, and impractical.</p>
            <p className="font-sans text-base leading-relaxed">The current experience also doesn’t scale visually or functionally to commercial users who need to take bulk actions across large account portfolios.</p>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="mb-12">
          <SectionLabel>Project Goal</SectionLabel>
          <div className="space-y-4 max-w-3xl">
            <p className="font-sans text-base leading-relaxed">Design a single, unified alert-creation experience that works for everyone — from a personal banking customer with 2–3 accounts to a business owner managing 100+.</p>
            <p className="font-sans text-base leading-relaxed">The new experience should support bulk alert creation, feel modern and intuitive, and reduce friction for all user types.</p>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8" style={{ borderTop: `1px solid ${LINE}` }}>
          <div>
            <SectionLabel>Who it’s for</SectionLabel>
            <p className="font-sans text-base font-semibold mb-1" style={{ color: INK }}>Personal banking customers</p>
            <p className="font-sans text-sm leading-relaxed mb-5">Users with a small number of accounts (checking, savings). Currently underserved by slow, one-at-a-time alert setup.</p>
            <p className="font-sans text-base font-semibold mb-1" style={{ color: INK }}>Commercial / business banking customers</p>
            <p className="font-sans text-sm leading-relaxed">Business owners managing 10–100+ accounts. The current experience breaks down at this scale entirely.</p>
          </div>
          <div>
            <SectionLabel>Key Objectives</SectionLabel>
            <ul className="space-y-3">
              {OBJECTIVES.map((o, i) => (
                <li key={i} className="flex gap-3 font-sans text-sm leading-relaxed">
                  <span style={{ color: GREEN }}>·</span>{o}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </section>

      {/* ── 03 OLD EXPERIENCE ────────────────────────────────────────────── */}
      <section className="mt-24 py-24" style={{ backgroundColor: ALT_BG }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionLabel>02 — The Old Experience</SectionLabel>
            <h2 className="font-display font-black leading-tight mb-5" style={{ fontSize: 'clamp(2rem,4.5vw,3.4rem)', color: INK }}>
              One alert, one account, one at a time
            </h2>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-12">
              Q2's legacy online banking experience forced users to set every alert individually, per account. There was no way to apply an alert across multiple accounts, and no bulk management of any kind — so a commercial user with dozens of accounts had to repeat the entire flow for each one.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <ImgSlot name="old-account-alert" caption="New Account Alert" />
            <ImgSlot name="old-history-alert" caption="New History Alert" />
            <ImgSlot name="old-insufficient-funds-alert" caption="New Insufficient Funds Alert" />
            <ImgSlot name="old-nononline-alert" caption="New Non-Online Transaction Alert" />
          </motion.div>

          <motion.div {...fadeUp}>
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-4" style={{ color: INK }}>
              The terminology described the bank — not the user
            </h3>
            <div className="max-w-3xl mb-6">
              <Callout tone="amber">
                Users had to choose between Account, History, and Online Transaction alerts up front — but those labels describe how the bank categorizes activity internally, not what a person is trying to do. The result was overlapping, misleading buckets.
              </Callout>
            </div>
            <div className="space-y-3 max-w-3xl mb-12">
              {TERMINOLOGY.map(([h, b], i) => (
                <div key={i} className="rounded-xl p-5" style={{ backgroundColor: '#fff', borderLeft: `3px solid ${RED}`, border: `1px solid ${LINE}` }}>
                  <p className="font-sans text-sm font-semibold mb-1" style={{ color: INK }}>{h}</p>
                  <p className="font-sans text-sm leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp}>
            <ImgSlot name="issues" ratio="38 / 8" caption="The legacy alert forms in context: the “Online Transaction” type-picker (full of commercial-treasury options), the “History Alert,” and the “Account Alert” with its preset Frequency." />
          </motion.div>
        </div>
      </section>

      {/* ── 04 COMPETITIVE RESEARCH ──────────────────────────────────────── */}
      <section className={`${wrap} py-24`}>
        <motion.div {...fadeUp}>
          <SectionLabel>03 — Competitive Research</SectionLabel>
          <h2 className="font-display font-black leading-tight mb-5" style={{ fontSize: 'clamp(2rem,4.5vw,3.4rem)', color: INK }}>
            No bank had solved this — so I looked beyond banking
          </h2>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
            I audited four major banks and three analogous products. Every bank required repeating alert setup per account — the gap was universal. The clearest models for solving it came from outside banking.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="overflow-hidden rounded-xl mb-10" style={{ border: `1px solid ${LINE}` }}>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ backgroundColor: ALT_BG }}>
                <th className="font-mono text-[10px] tracking-[0.16em] uppercase px-5 py-3" style={{ color: MUTE }}>Company</th>
                <th className="font-mono text-[10px] tracking-[0.16em] uppercase px-5 py-3" style={{ color: MUTE }}>How alerts work today</th>
                <th className="font-mono text-[10px] tracking-[0.16em] uppercase px-5 py-3" style={{ color: MUTE }}>Bulk actions</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITORS.map(([c, how, bulk], i) => (
                <tr key={i} style={{ borderTop: `1px solid ${LINE}` }}>
                  <td className="font-sans text-sm font-semibold px-5 py-4 align-top" style={{ color: INK }}>{c}</td>
                  <td className="font-sans text-sm px-5 py-4 align-top">{how}</td>
                  <td className="px-5 py-4 align-top"><Tag tone={BULK_TONE[bulk]}>{bulk}</Tag></td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        <motion.div {...fadeUp} className="max-w-3xl">
          <Callout tone="blue" label="Key Insight">
            The winning pattern is “define once, apply to many” — filter → select → bulk-edit. Borrow it from Shopify and Gmail, bring it to banking.
          </Callout>
        </motion.div>
      </section>

      {/* ── 05 FRAMING QUESTIONS ─────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: NAVY, color: '#fff' }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionLabel light>04 — Framing Questions</SectionLabel>
            <h2 className="font-display font-black leading-tight mb-12" style={{ fontSize: 'clamp(2rem,4.5vw,3.4rem)' }}>
              The central tension
            </h2>
          </motion.div>
          {[
            ['01', 'Should alerts be split into a simple and an advanced experience?'],
            ['02', 'Or can one design do both — staying simple for users with a few accounts while scaling to those with many?'],
          ].map(([n, q]) => (
            <motion.div {...fadeUp} key={n} className="flex gap-6 py-6" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <span className="font-display text-xl font-black" style={{ color: 'rgba(255,255,255,0.45)' }}>{n}</span>
              <p className="font-sans text-lg md:text-xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.92)' }}>{q}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 06 EXPLORATIONS ──────────────────────────────────────────────── */}
      <section className={`${wrap} py-24`}>
        <motion.div {...fadeUp}>
          <SectionLabel>05 — Explorations</SectionLabel>
          <h2 className="font-display font-black leading-tight mb-5" style={{ fontSize: 'clamp(2rem,4.5vw,3.4rem)', color: INK }}>
            Four decisions that shaped the design
          </h2>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-16">
            I explored the problem in stages — each step resolved one decision and set up the next.
          </p>
        </motion.div>

        <div className="space-y-20">
          {STEPS.map(({ step, title, body, imgs }) => (
            <motion.div {...fadeUp} key={step} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-4">
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase mb-3" style={{ color: BLUE }}>{step}</p>
                <h3 className="font-display text-xl md:text-2xl font-bold mb-3" style={{ color: INK }}>{title}</h3>
                <p className="font-sans text-sm leading-relaxed">{body}</p>
              </div>
              <div className="md:col-span-8 space-y-6">
                {imgs.map(([name, cap]) => <ImgSlot key={name} name={name} caption={cap} />)}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── 07 SOLUTION ──────────────────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: NAVY, color: '#fff' }}>
        <div className={wrap}>
          <motion.div {...fadeUp} className="mb-16">
            <SectionLabel light>06 — The Solution</SectionLabel>
            <h2 className="font-display font-black leading-tight mb-5" style={{ fontSize: 'clamp(2.2rem,5vw,4rem)' }}>
              One experience. Both extremes.
            </h2>
            <p className="font-sans text-base md:text-lg leading-relaxed max-w-3xl" style={{ color: 'rgba(255,255,255,0.75)' }}>
              The same create-alert flow is designed to serve a customer with 3 accounts and a business managing 100+ — on every surface. Desktop carries the scale, mobile keeps it light. (As covered in the outcome below, the at-scale version is validated and ready to build, pending a batched API.)
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="rounded-2xl p-6 md:p-8 mb-8" style={{ backgroundColor: '#fff' }}>
            <div className="flex items-center gap-2 mb-2">
              <Tag tone="blue">Desktop</Tag><Tag tone="teal">Scales up</Tag>
            </div>
            <h3 className="font-display text-2xl font-bold mb-2" style={{ color: INK }}>The commercial user — managing 100+ accounts</h3>
            <p className="font-sans text-sm leading-relaxed mb-6" style={{ color: BODY }}>
              Filter the portfolio, select many accounts at once, and apply one alert across all of them. Bulk power without repetition — the problem no bank had solved.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImgSlot name="alert-management" caption="Alert Management — group & individual alerts" />
              <ImgSlot name="create-select-accounts" caption="Bulk account selection" />
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: '#fff' }}>
            <div className="flex items-center gap-2 mb-2">
              <Tag tone="blue">Mobile</Tag><Tag tone="teal">Stays simple</Tag>
            </div>
            <h3 className="font-display text-2xl font-bold mb-2" style={{ color: INK }}>The personal user — just a few accounts</h3>
            <p className="font-sans text-sm leading-relaxed mb-6" style={{ color: BODY }}>
              The identical flow, on a phone, with no learning curve — the same mental model, just scaled down. It shows the unified design never overwhelms a small user.
            </p>
            <div className="grid grid-cols-3 gap-4">
              <ImgSlot name="mobile-1" ratio="9 / 19" caption="Create alert" />
              <ImgSlot name="mobile-2" ratio="9 / 19" caption="Select accounts" />
              <ImgSlot name="mobile-3" ratio="9 / 19" caption="Review & apply" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 08 VALIDATION ────────────────────────────────────────────────── */}
      <section className={`${wrap} py-24`}>
        <motion.div {...fadeUp}>
          <SectionLabel>07 — Validation</SectionLabel>
          <h2 className="font-display font-black leading-tight mb-5" style={{ fontSize: 'clamp(2rem,4.5vw,3.4rem)', color: INK }}>
            Testing it with both kinds of users
          </h2>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-10">
            Our UX Researcher ran remote usability sessions with 6 participants — 2 with fewer than 10 accounts and 4 commercial users with more than 10 — across four tasks: create an alert group, edit one alert within a group, create a single alert, and bulk-edit a group. I observed the sessions and turned the findings into design changes. Measured with SUS, SEQ, task completion, and VisAWI.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS.map(([v, l, s]) => <StatCard key={l} value={v} label={l} sub={s} />)}
        </motion.div>

        <motion.div {...fadeUp} className="mb-10">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-4" style={{ color: MUTE }}>Per-task results</p>
          <div className="overflow-hidden rounded-xl" style={{ border: `1px solid ${LINE}` }}>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: ALT_BG }}>
                  <th className="font-mono text-[10px] tracking-[0.16em] uppercase px-5 py-3" style={{ color: MUTE }}>Task</th>
                  <th className="font-mono text-[10px] tracking-[0.16em] uppercase px-5 py-3" style={{ color: MUTE }}>Completion</th>
                  <th className="font-mono text-[10px] tracking-[0.16em] uppercase px-5 py-3" style={{ color: MUTE }}>SEQ (ease, 1–7)</th>
                </tr>
              </thead>
              <tbody>
                {TASK_RESULTS.map(([n, name, comp, seq]) => (
                  <tr key={n} style={{ borderTop: `1px solid ${LINE}` }}>
                    <td className="font-sans text-sm px-5 py-4 align-top" style={{ color: INK }}>
                      <span className="font-semibold">Task {n}</span> — {name}
                    </td>
                    <td className="font-sans text-sm font-semibold px-5 py-4 align-top" style={{ color: INK }}>{comp}</td>
                    <td className="font-sans text-sm px-5 py-4 align-top">{seq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-sans text-xs mt-3 leading-relaxed" style={{ color: MUTE }}>
            Completion across all four tasks, n=6. The two tasks at 66.7% both stemmed from the same thing — participants starting in “edit” before finding “Create New Alert” — which directly drove the fixes below.
          </p>
        </motion.div>

        <motion.div {...fadeUp} className="mb-16">
          <ImgSlot name="quantitative-metrics-chart" ratio="16 / 11" caption="SUS confidence interval, per-task SEQ & completion, and VisAWI" />
        </motion.div>

        <motion.div {...fadeUp}>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4" style={{ color: INK }}>
            What testing told us to change
          </h3>
          <p className="font-sans text-base leading-relaxed max-w-3xl mb-8">
            Beyond the scores, sessions surfaced concrete fixes. I triaged each by priority, then accepted or rejected it — 10 of 11 were adopted into the design.
          </p>
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${LINE}` }}>
            {TRIAGE.map(([status, item, priority], i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-4"
                style={{ borderTop: i ? `1px solid ${LINE}` : 'none', backgroundColor: '#fff' }}
              >
                <div className="w-24 shrink-0"><Tag tone={STATUS_TONE[status]}>{status}</Tag></div>
                <p className="font-sans text-sm flex-1 leading-snug">{item}</p>
                <div className="shrink-0"><Tag tone={PRIORITY_TONE[priority]}>{priority}</Tag></div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── 09 OUTCOME & REFLECTION ──────────────────────────────────────── */}
      <section className="py-24" style={{ backgroundColor: ALT_BG }}>
        <div className={wrap}>
          <motion.div {...fadeUp}>
            <SectionLabel>08 — Outcome, Status & Reflection</SectionLabel>
            <h2 className="font-display font-black leading-tight mb-12" style={{ fontSize: 'clamp(2rem,4.5vw,3.4rem)', color: INK }}>
              Validated, then paused — and what it taught me
            </h2>
          </motion.div>

          <motion.div {...fadeUp} className="mb-12">
            <SectionLabel>Validated through testing</SectionLabel>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-8">
              Usability testing with 6 participants — 2 with fewer than 10 accounts and 4 commercial users with more than 10 — confirmed the unified design worked at both ends of the spectrum. The same flows that scaled to large portfolios stayed easy for small ones.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard value="87.9" label="SUS Score" sub="Directional, n=6 · “Excellent” range (95% CI 74.9–100)" />
              <StatCard value="5.6 / 7" label="VisAWI" sub="Visual aesthetics rating" />
              <StatCard value="79%" label="Avg. task completion" sub="Across all four tasks (66.7%–100%)" />
              <StatCard value="6" label="Participants" sub="2 personal · 4 commercial" />
            </div>
          </motion.div>

          <motion.div {...fadeUp} className="mb-12">
            <SectionLabel>Paused — and why</SectionLabel>
            <p className="font-sans text-base leading-relaxed max-w-3xl mb-6">
              Engineering was a partner from the start. When the team checked feasibility right after the research sessions, they surfaced a backend constraint: under the hood, a group alert is just a collection of single alerts. Applying one group alert fires the single-alert API call once per account — so a group spanning hundreds of accounts would trigger hundreds of calls.
            </p>
            <div className="max-w-3xl">
              <Callout tone="amber">
                The existing API couldn’t support group alerts at scale. The project was placed on hold pending a new batched “group alerts” API — a prerequisite for development, not a flaw in the design.
              </Callout>
            </div>
          </motion.div>

          <motion.div {...fadeUp}>
            <SectionLabel>Reflection</SectionLabel>
            <div className="space-y-4 max-w-3xl">
              <p className="font-sans text-base leading-relaxed">
                The design is validated and ready to build once the API exists. The pause drove home something I'll carry forward: check the data model and infrastructure during exploration, not after.
              </p>
              <p className="font-sans text-base leading-relaxed">
                The thing that made this design valuable — define once, apply to many — was also the thing with the biggest backend implications. Involving engineering earlier, during exploration rather than after testing, would have surfaced the constraint sooner and shaped the approach from the start.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── NEXT PROJECT ─────────────────────────────────────────────────── */}
      <section className={`${wrap} py-20`}>
        <div style={{ borderTop: `1px solid ${LINE}` }} className="pt-12">
          <Link to="/messaging-redesign" className="group inline-block">
            <p className="font-sans text-sm mb-2" style={{ color: MUTE }}>Next project</p>
            <h3 className="font-display font-black leading-none transition-opacity duration-300 group-hover:opacity-60" style={{ fontSize: 'clamp(2rem,5vw,4rem)', color: INK }}>
              Secure Messaging
            </h3>
          </Link>
        </div>
      </section>
    </main>
  )
}
