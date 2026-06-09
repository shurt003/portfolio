import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavTheme } from '../contexts/NavTheme'
import usePageMeta from '../hooks/usePageMeta'

const BLUE = '#2B59C3'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
}

const STATS = [
  { value: '22M+', label: 'People bank on the platforms I design' },
  { value: '500+', label: 'Financial institutions served' },
  { value: '10 yrs', label: 'In motion design before UX' },
]

const PRINCIPLES = [
  { n: '01', title: 'Diagnose one level up', body: 'I look for what’s driving a problem, not just how it shows up on the surface. The real fix usually sits a level above the brief.' },
  { n: '02', title: 'Let the evidence settle it', body: 'Heuristic analysis, task flows, moderated testing. I trust those over opinions, and I’d rather be proven wrong in research than in production.' },
  { n: '03', title: 'Design the system, not the screen', body: 'Patterns and models other teams can adopt, so a good decision gets reused instead of redrawn every time.' },
  { n: '04', title: 'Accessibility is the floor', body: 'WCAG, ARIA, keyboard paths, screen-reader support. In banking, an interface that excludes people isn’t finished.' },
]

const CAPABILITIES = [
  { title: 'Motion, interaction & 3D', body: 'Flows, prototyping, and interface motion — ten years of After Effects, Rive, and Lottie, plus Cinema 4D and WebGL/Three.js for 3D and spatial interfaces.' },
  { title: 'UX research', body: 'Moderated studies, usability testing, heuristic evaluation, competitive analysis. Research that moves decisions.' },
  { title: 'Design systems', body: 'Component libraries, tokens, and documentation teams reach for.' },
  { title: 'Accessibility', body: 'WCAG 2.1 AA, ARIA semantics, and keyboard and screen-reader support, built in from the start instead of bolted on later.' },
  { title: 'Enterprise & fintech', body: 'Complex, security-sensitive B2B workflows at the scale of hundreds of institutions and millions of users.' },
  { title: 'AI-assisted design & build', body: 'Model strategy, reusable Claude skills, and a design-to-dev pipeline that turns a layout into a ready-to-test build in a few clicks.' },
]

// Asymmetric pinwheel grid (3 cols × 2 rows): the wide ⅔ tile alternates
// sides so the two landscape shots sit on a diagonal. Auto-flow + these spans
// place them as: [ramen][lake lake] / [cat cat][swing].
const OUTSIDE = [
  { type: 'img', src: '/images/aboutv2/ramen.jpg', alt: 'A bowl of homemade ramen with a soft egg, pork, and scallions', span: 1 },
  { type: 'img', src: '/images/aboutv2/lake.jpg', alt: 'Green Lake in Seattle on a clear summer day', span: 2 },
  { type: 'img', src: '/images/aboutv2/cat.jpg', alt: 'My grey cat with its tongue out', span: 2 },
  { type: 'video', src: '/images/aboutv2/swing.mp4', alt: 'Floating a clear, tree-lined river on a summer day', span: 1 },
]

export default function About() {
  const { setIsDark } = useNavTheme()
  useEffect(() => { setIsDark(false) }, [setIsDark])
  usePageMeta(
    'About Stephen Hurt',
    'Stephen Hurt is a product designer at Q2. Ten years in motion design, now designing enterprise banking used by 22M+ people, with depth in research, design systems, accessibility, and AI.'
  )

  return (
    <main className="bg-cream text-ink pt-28 md:pt-32 pb-28 px-6 md:px-14 lg:px-20">
      <div className="max-w-[1100px] mx-auto">

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section>
          <motion.p {...fadeUp} className="font-sans text-xs tracking-[0.25em] uppercase text-ink/50 mb-7">
            About
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-10 lg:gap-16 items-center">
            <div>
              <motion.h1 {...fadeUp} className="font-display font-black leading-[1.02]" style={{ fontSize: 'clamp(2.6rem, 6.2vw, 5rem)' }}>
                I make complex software feel <span style={{ color: BLUE }}>obvious</span>.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="font-sans text-lg md:text-xl text-ink/70 leading-relaxed mt-7 max-w-xl"
              >
                A product designer at Q2, where 22 million people bank on the platforms I work on. I came to UX after
                ten years in motion design, and that background left me with a strong instinct for where attention
                goes. Everything since has been about building out the rest: research, design systems, accessibility,
                and interfaces that stay clear under real complexity.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src="/images/profile/StephenImage.webp"
                alt="Stephen Hurt"
                className="w-full rounded-2xl object-cover"
                style={{ aspectRatio: '4 / 5', objectPosition: 'center 25%' }}
              />
            </motion.div>
          </div>

          {/* Proof strip */}
          <motion.div {...fadeUp} className="grid grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-9 mt-16 md:mt-20 pt-10 border-t border-ink/10">
            {STATS.map((s) => (
              <div key={s.value}>
                <div className="font-display font-black leading-none" style={{ fontSize: 'clamp(2rem, 3.4vw, 2.8rem)' }}>{s.value}</div>
                <div className="font-sans text-sm text-ink/55 leading-snug mt-2 max-w-[18ch]">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── Narrative ──────────────────────────────────────────── */}
        <section className="mt-28 md:mt-36 max-w-[720px]">
          <motion.p {...fadeUp} className="font-sans text-xs tracking-[0.25em] uppercase text-ink/50 mb-5">The through-line</motion.p>
          <motion.h2 {...fadeUp} className="font-display font-bold leading-[1.08] mb-8" style={{ fontSize: 'clamp(1.9rem, 4vw, 3rem)' }}>
            Motion, then product, then AI. Each one built on the last.
          </motion.h2>
          <motion.div {...fadeUp} className="space-y-6 font-sans text-base md:text-lg text-ink/70 leading-relaxed">
            <p>
              Moving from motion design into UX made sense to me from the start. Animation is the craft of controlling
              attention over time: what someone notices first, what fades back, the order things click into place. I
              didn’t leave that behind when I moved into product. I just aimed it at a different kind of problem.
            </p>
            <p>
              That shift happened from inside Q2. They brought me in for three months to standardize animation tokens
              across the design system, back when I was still in a marketing role. By the time they offered me the
              design seat, I already knew the platform, the team, and how decisions got made. That vantage point still
              shapes how I work: my first instinct on any brief is to look a level up and find what’s really causing the
              problem.
            </p>
            <p>
              My take on AI comes from building with it. I shipped a solo AI product to both app stores, and I built
              this portfolio with AI handling the code while every design decision stayed mine. That work is why Q2’s
              VP of Product named me the <strong className="font-semibold text-ink">AI Champion</strong> for Product.
              Part of the role is cutting through hype. I helped pare a long list of AI tools down to the few that
              matter, since under the hood they’re all the same models. The other part is teaching: I run workshops on
              using AI as a thinking partner, not just a generator. Vetting an idea before a meeting can turn a sign-off
              that used to take several rounds into a single one. I’ve also built Claude skills into our design
              templates, so a designer can take a layout into Claude Code and hand a developer a ready-to-test build in
              a few clicks.
            </p>
          </motion.div>
        </section>

        {/* ── Pull quote ─────────────────────────────────────────── */}
        <section className="mt-20 md:mt-28">
          <motion.blockquote {...fadeUp} className="font-display font-bold leading-[1.12] max-w-[1000px]" style={{ fontSize: 'clamp(1.7rem, 3.6vw, 3.1rem)' }}>
            AI raises the floor on execution. It doesn’t raise the <span style={{ color: BLUE }}>ceiling</span>. That’s
            still set by taste, judgment, and knowing which problems are worth solving.
          </motion.blockquote>
        </section>

        {/* ── How I work ─────────────────────────────────────────── */}
        <section className="mt-20 md:mt-28">
          <motion.div {...fadeUp} className="rounded-3xl bg-white border border-ink/[0.06] p-8 md:p-14">
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-ink/50 mb-3">How I work</p>
            <h2 className="font-display font-bold leading-tight mb-10" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)' }}>
              The instincts behind the work.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-10">
              {PRINCIPLES.map((p) => (
                <div key={p.n}>
                  <span className="font-display font-black text-2xl" style={{ color: BLUE }}>{p.n}</span>
                  <h3 className="font-display text-xl font-bold mt-2 mb-2">{p.title}</h3>
                  <p className="font-sans text-base text-ink/65 leading-relaxed max-w-md">{p.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Capabilities ───────────────────────────────────────── */}
        <section className="mt-24 md:mt-32">
          <motion.p {...fadeUp} className="font-sans text-xs tracking-[0.25em] uppercase text-ink/50 mb-3">What I bring</motion.p>
          <motion.h2 {...fadeUp} className="font-display font-bold leading-tight mb-10" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.6rem)' }}>
            Broad range, deep in a few places.
          </motion.h2>
          <motion.div
            {...fadeUp}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-ink/10"
            style={{ backgroundColor: 'rgba(28,35,34,0.10)' }}
          >
            {CAPABILITIES.map((c) => (
              <div key={c.title} className="bg-cream p-7">
                <h3 className="font-display text-lg font-bold mb-2">{c.title}</h3>
                <p className="font-sans text-sm text-ink/60 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ── Outside the work ───────────────────────────────────── */}
        <section className="mt-24 md:mt-32">
          <div className="max-w-[720px]">
            <motion.p {...fadeUp} className="font-sans text-xs tracking-[0.25em] uppercase text-ink/50 mb-5">Outside the work</motion.p>
            <motion.p {...fadeUp} className="font-sans text-lg md:text-xl text-ink/70 leading-relaxed">
              I grew up around DC, spent five years in Seattle, and now live in Austin. Most of my free time goes to
              dialing in a ramen recipe, flying my drone, playing tennis, and mapping out the next trip.
              (Lisbon’s still winning.)
            </motion.p>
          </div>

          <motion.div
            {...fadeUp}
            className="grid gap-3 md:gap-4 mt-10 md:mt-12"
            style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', aspectRatio: '3 / 2' }}
          >
            {OUTSIDE.map((m) => (
              <div
                key={m.src}
                className="rounded-2xl overflow-hidden bg-ink/5"
                style={{ gridColumn: `span ${m.span}` }}
              >
                {m.type === 'video' ? (
                  <video
                    src={m.src}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    aria-label={m.alt}
                  />
                ) : (
                  <img
                    src={m.src}
                    alt={m.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </motion.div>
        </section>

      </div>
    </main>
  )
}
