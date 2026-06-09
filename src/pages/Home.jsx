import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useNavTheme } from '../contexts/NavTheme'
import RivePiece from '../components/RivePiece'
import ProjectThumb from '../components/ProjectThumbs'

const HeroRings = lazy(() => import('../components/HeroRings'))

/* ── Palette ─────────────────────────────────────────────────────────── */
const BG   = '#F5F0E8'
const INK  = '#1C2322'
const BLUE = '#2B59C3'
const DARK = '#0D0F14'
const DIM  = 'rgba(28,35,34,0.6)'

/* ── FadeUp ──────────────────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ── Stat ─────────────────────────────────────────────────────────────── */
function Stat({ value, label }) {
  return (
    <div>
      <p
        className="font-display font-black"
        style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)', color: INK, lineHeight: 1 }}
      >
        {value}
      </p>
      <p className="font-sans text-sm mt-1" style={{ color: DIM }}>{label}</p>
    </div>
  )
}

/* ── ProjectCard ─────────────────────────────────────────────────────── */
function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false)
  return (
    <FadeUp delay={index * 0.08}>
      <Link
        to={project.href}
        className="group block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative rounded-2xl overflow-hidden mb-5 transition-transform duration-700 ease-out group-hover:scale-[1.04]" style={{ aspectRatio: '16/10' }}>
          {project.image
            ? <img src={project.image} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
            : <ProjectThumb href={project.href} accent={project.accent} />
          }
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              className="font-display text-xl md:text-2xl font-bold mb-1"
              style={{ color: INK }}
            >
              {project.title}
            </h3>
            <p className="font-sans text-sm md:text-base leading-relaxed max-w-md" style={{ color: DIM }}>
              {project.subtitle}
            </p>
          </div>
          <motion.div
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center mt-1"
            style={{ backgroundColor: INK }}
            animate={{ scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <span style={{ position: 'relative', width: 14, height: 14, overflow: 'hidden', display: 'inline-block', flexShrink: 0 }}>
              {/* Arrow 1 — exits toward top-right on hover */}
              <motion.svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{ position: 'absolute', top: 0, left: 0 }}
                animate={hovered ? { x: 17, y: -17 } : { x: 0, y: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <path d="M1 13L13 1M13 1H3M13 1V11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
              {/* Arrow 2 — enters from bottom-left on hover */}
              <motion.svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                style={{ position: 'absolute', top: 0, left: 0 }}
                animate={hovered ? { x: 0, y: 0 } : { x: -17, y: 17 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <path d="M1 13L13 1M13 1H3M13 1V11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </span>
          </motion.div>
        </div>
      </Link>
    </FadeUp>
  )
}

/* ── Projects data ───────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 'messaging',
    title: 'Secure Messaging',
    subtitle: 'End-to-end research and redesign of a security-critical messaging feature for 20M+ users.',
    href: '/messaging-redesign',
    image: '/images/SecureMessaging/securemessagingbgheroimage.webp',
  },
  {
    id: 'interstitial',
    title: 'Interstitial',
    subtitle: 'A forgotten loading screen became a branded moment, and an $8M deal.',
    href: '/interstitial',
    image: '/images/Interstitial/interstitial-home-thumbnail.png',
  },
  {
    id: 'validation',
    title: 'Form Validation',
    subtitle: 'Research-driven case for moving Q2\'s platform to inline validation.',
    href: '/validation',
    accent: '#7B9EC7',
  },
  {
    id: 'magic-signal',
    title: 'MagicSignal',
    subtitle: 'From zero research to a shipped iOS app, every decision made with one eye on the user.',
    href: '/magic-signal',
    image: '/images/magicSignal/ms-home-thumbnail.png',
  },
]

/* ── Main ────────────────────────────────────────────────────────────── */
export default function Home() {
  const { setIsDark } = useNavTheme()
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })
  const [motionLabHovered, setMotionLabHovered] = useState(false)
  const [aboutHovered, setAboutHovered] = useState(false)

  useEffect(() => {
    setIsDark(false)
    return () => setIsDark(false)
  }, [setIsDark])

  return (
    <main style={{ backgroundColor: BG }}>

      {/* ── Hero: Centered ──────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center text-center px-6 md:px-14 lg:px-20 pt-28 pb-16"
      >
        {/* Orbital rings: DISABLED for now (may re-enable later).
            To bring back, flip `false` to `true` below. */}
        {false && (
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: '100vw', aspectRatio: '1 / 1' }}
          >
            <Suspense fallback={null}>
              <HeroRings />
            </Suspense>
          </div>
        )}

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
          <motion.p
            className="font-sans text-xs uppercase tracking-[0.25em] mb-7"
            style={{ color: DIM }}
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Stephen Hurt, Product Designer
          </motion.p>

          <motion.h1
            className="font-display font-black tracking-tight mb-8"
            style={{
              fontSize: 'clamp(2.8rem, 6.5vw, 6rem)',
              lineHeight: 1.04,
              color: INK,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Designing products{' '}
            <span style={{ color: BLUE }}>22 million</span>{' '}
            people trust
          </motion.h1>

          <motion.p
            className="font-sans text-lg md:text-xl leading-relaxed max-w-xl mb-12"
            style={{ color: DIM }}
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            I'm a product and interaction designer at Q2. Before UX, I spent ten years in motion design, learning to control where attention goes.
          </motion.p>

          <motion.div
            className="flex gap-12 md:gap-16"
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Stat value="22M" label="Users impacted" />
            <Stat value="500+" label="Financial institutions" />
            <Stat value="12yr" label="Design career" />
          </motion.div>
        </div>
      </section>

      {/* ── Divider line ─────────────────────────────────────────────── */}
      <div className="px-6 md:px-14 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="h-px" style={{ backgroundColor: 'rgba(28,35,34,0.12)' }} />
        </div>
      </div>

      {/* ── About strip ──────────────────────────────────────────────── */}
      <section className="px-6 md:px-14 lg:px-20 pt-20 md:pt-32">
        <FadeUp>
          <div
            className="max-w-[1400px] mx-auto rounded-3xl overflow-hidden"
            style={{ backgroundColor: DARK }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              {/* Image */}
              <div className="lg:col-span-2 relative" style={{ minHeight: '360px' }}>
                <img
                  src="/images/profile/StephenImage.webp"
                  alt="Stephen Hurt"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center top' }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0D0F14]/40 hidden lg:block" />
              </div>

              {/* Text */}
              <div className="lg:col-span-3 px-8 md:px-14 py-12 md:py-16 flex flex-col justify-center">
                <p className="font-sans text-xs uppercase tracking-[0.25em] mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  About
                </p>
                <h2
                  className="font-display font-black tracking-tight mb-6"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#fff', lineHeight: 1.15 }}
                >
                  Ten years in motion design taught me where attention goes.{' '}
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Now I use that instinct to design enterprise products.
                  </span>
                </h2>
                <p className="font-sans text-base leading-relaxed max-w-lg mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  At Q2, I work across the full product lifecycle, from research and design to testing and implementation, on banking software used by 22 million people across 500+ financial institutions.
                </p>
                <div>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 font-sans text-sm font-medium px-6 py-3 rounded-full border"
                    style={{ borderColor: 'rgba(255,255,255,0.25)', color: '#fff' }}
                    onMouseEnter={() => setAboutHovered(true)}
                    onMouseLeave={() => setAboutHovered(false)}
                  >
                    More about me
                    <span style={{ position: 'relative', width: 12, height: 12, overflow: 'hidden', display: 'inline-block', flexShrink: 0 }}>
                      {/* Arrow 1 — exits toward top-right on hover */}
                      <motion.svg
                        width="12" height="12" viewBox="0 0 12 12" fill="none"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                        animate={aboutHovered ? { x: 15, y: -15 } : { x: 0, y: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                      {/* Arrow 2 — enters from bottom-left on hover */}
                      <motion.svg
                        width="12" height="12" viewBox="0 0 12 12" fill="none"
                        style={{ position: 'absolute', top: 0, left: 0 }}
                        animate={aboutHovered ? { x: 0, y: 0 } : { x: -15, y: 15 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </motion.svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* ── Selected Work ────────────────────────────────────────────── */}
      <section className="px-6 md:px-14 lg:px-20 py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between mb-16">
            <FadeUp>
              <p className="font-sans text-xs uppercase tracking-[0.25em] mb-3" style={{ color: DIM }}>
                Selected work
              </p>
              <h2
                className="font-display font-black tracking-tight"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: INK, lineHeight: 1.1 }}
              >
                Case studies
              </h2>
            </FadeUp>
            <FadeUp delay={0.1}>
              <Link
                to="/projects"
                className="hidden md:inline-flex items-center gap-2 font-sans text-sm font-medium px-6 py-3 rounded-full border transition-colors duration-200 hover:bg-[rgba(28,35,34,0.04)]"
                style={{ borderColor: 'rgba(28,35,34,0.2)', color: INK }}
              >
                View all
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Link>
            </FadeUp>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
            {PROJECTS.map((project, i) => (
              <div key={project.id} style={{ marginTop: i % 2 === 1 ? '4rem' : '0' }}>
                <ProjectCard project={project} index={i} />
              </div>
            ))}
          </div>

          <div className="md:hidden mt-12 text-center">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 font-sans text-sm font-medium px-6 py-3 rounded-full border transition-colors duration-200"
              style={{ borderColor: 'rgba(28,35,34,0.2)', color: INK }}
            >
              View all work
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Approach ─────────────────────────────────────────────────── */}
      <section className="px-6 md:px-14 lg:px-20 py-20 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <FadeUp>
            <p className="font-sans text-xs uppercase tracking-[0.25em] mb-3" style={{ color: DIM }}>
              How I work
            </p>
            <h2
              className="font-display font-black tracking-tight mb-16"
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: INK, lineHeight: 1.1 }}
            >
              Evidence first, always
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                num: '01',
                title: 'Research',
                desc: 'Heuristic evaluations, task analysis, competitive audits, moderated testing. All before a single screen is drawn.',
              },
              {
                num: '02',
                title: 'Design',
                desc: 'Systematic thinking and hands-on craft. Components, patterns, and interactions that scale across enterprise products.',
              },
              {
                num: '03',
                title: 'Validate',
                desc: 'SUS scoring, think-aloud protocols, usability testing. The data tells us whether we got it right.',
              },
            ].map((step, i) => (
              <FadeUp key={step.num} delay={i * 0.1}>
                <div className="pt-6" style={{ borderTop: `2px solid ${INK}` }}>
                  <p className="font-display text-sm font-bold mb-3" style={{ color: BLUE }}>{step.num}</p>
                  <h3 className="font-display text-2xl font-bold mb-3" style={{ color: INK }}>{step.title}</h3>
                  <p className="font-sans text-base leading-relaxed" style={{ color: DIM }}>{step.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Motion Lab teaser ────────────────────────────────────────── */}
      <section className="px-6 md:px-14 lg:px-20 pb-20 md:pb-32">
        <FadeUp>
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.25em] mb-3" style={{ color: DIM }}>
                Motion Lab
              </p>
              <h2
                className="font-display font-black tracking-tight mb-5"
                style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)', color: INK, lineHeight: 1.08 }}
              >
                A decade in motion design.
              </h2>
              <p className="font-sans text-base md:text-lg leading-relaxed max-w-md mb-8" style={{ color: DIM }}>
                Before product design, I spent ten years in motion. Motion Lab is where I keep that craft sharp: interactive animations and interface motion. Most pieces are live, so hover and play with them.
              </p>
              <Link
                to="/motion-lab"
                className="inline-flex items-center gap-2 font-sans text-sm font-medium px-7 py-3.5 rounded-full"
                style={{ backgroundColor: INK, color: '#fff' }}
                onMouseEnter={() => setMotionLabHovered(true)}
                onMouseLeave={() => setMotionLabHovered(false)}
              >
                Explore Motion Lab
                <span style={{ position: 'relative', width: 13, height: 13, overflow: 'hidden', display: 'inline-block', flexShrink: 0 }}>
                  {/* Arrow 1 — exits toward top-right on hover */}
                  <motion.svg
                    width="13" height="13" viewBox="0 0 13 13" fill="none"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    animate={motionLabHovered ? { x: 16, y: -16 } : { x: 0, y: 0 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <path d="M1 12L12 1M12 1H3.5M12 1V9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                  {/* Arrow 2 — enters from bottom-left on hover */}
                  <motion.svg
                    width="13" height="13" viewBox="0 0 13 13" fill="none"
                    style={{ position: 'absolute', top: 0, left: 0 }}
                    animate={motionLabHovered ? { x: 0, y: 0 } : { x: -16, y: 16 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <path d="M1 12L12 1M12 1H3.5M12 1V9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </motion.svg>
                </span>
              </Link>
            </div>

            {/* Planet: duplicated from the Motion Lab page's gallery container
                (rounded, no background box, native hover listener). Wrapped in a
                Link so the visual still navigates to Motion Lab. */}
            <Link
              to="/motion-lab"
              className="block"
              style={{ aspectRatio: '4 / 3', clipPath: 'circle(closest-side at center)' }}
            >
              <RivePiece src="/rive/FRCCGvUVJDSEuCuQL0XwNHnY5QQ.riv" artboard="planet remap" />
            </Link>
          </div>
        </FadeUp>
      </section>

    </main>
  )
}
