import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useNavTheme } from '../contexts/NavTheme'
import ProjectThumb from '../components/ProjectThumbs'

/* ── Palette ─────────────────────────────────────────────────────────── */
const BG   = '#F5F0E8'
const INK  = '#1C2322'
const DIM  = 'rgba(28,35,34,0.68)'   // ≥4.5:1 on BG cream

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

/* ── ProjectRow: alternating image / text, full-width ─────────────────── */
function ProjectRow({ project, index }) {
  const [hovered, setHovered] = useState(false)
  const reverse = index % 2 === 1

  return (
    <FadeUp delay={index * 0.05}>
      <Link
        to={project.href}
        className="group grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image */}
        <div className={reverse ? 'lg:order-2' : 'lg:order-1'}>
          <div className="relative rounded-2xl overflow-hidden transition-transform duration-700 ease-out group-hover:scale-[1.03]" style={{ aspectRatio: '16/10' }}>
            {project.image
              ? <img src={project.image} alt={project.title} className="w-full h-full object-cover" loading="lazy" />
              : <ProjectThumb href={project.href} accent={project.accent} />
            }
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
          </div>
        </div>

        {/* Text */}
        <div className={reverse ? 'lg:order-1' : 'lg:order-2'}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display font-bold mb-3" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', color: INK, lineHeight: 1.1 }}>
                {project.title}
              </h3>
              <p className="font-sans text-base md:text-lg leading-relaxed max-w-md" style={{ color: DIM }}>
                {project.subtitle}
              </p>
            </div>
            <motion.div
              className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center mt-1"
              style={{ backgroundColor: INK }}
              animate={{ scale: hovered ? 1.1 : 1 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <span style={{ position: 'relative', width: 14, height: 14, overflow: 'hidden', display: 'inline-block', flexShrink: 0 }}>
                <motion.svg
                  width="14" height="14" viewBox="0 0 14 14" fill="none"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                  animate={hovered ? { x: 17, y: -17 } : { x: 0, y: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                >
                  <path d="M1 13L13 1M13 1H3M13 1V11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </motion.svg>
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
        </div>
      </Link>
    </FadeUp>
  )
}

/* ── Projects data ───────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 'q2-clarity',
    title: 'Q2 Clarity',
    subtitle: 'A vendor widget became a bank-owned money hub: pitched from outside the team, in beta with three FIs 2.5 months later.',
    href: '/q2-clarity',
    image: '/images/Q2Clarity/Designs_july17/overview-desktop.png',
  },
  {
    id: 'brand-identity-tokens',
    title: 'Brand Identity Tokens',
    subtitle: 'A typed token system that replaced 300 hand-set values and let one platform wear 500 brands.',
    href: '/brand-identity-tokens',
    accent: '#2B59C3',
  },
  {
    id: 'magic-signal',
    title: 'MagicSignal',
    subtitle: 'A product I designed, built, and shipped solo to iOS and Android.',
    href: '/magic-signal',
    image: '/images/magicSignal/ms-home-thumbnail.png',
  },
]

/* ── Main ────────────────────────────────────────────────────────────── */
export default function Work() {
  const { setIsDark } = useNavTheme()

  useEffect(() => {
    setIsDark(false)
    return () => setIsDark(false)
  }, [setIsDark])

  return (
    <main style={{ backgroundColor: BG }}>
      <section className="px-6 md:px-14 lg:px-20 pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto">
          {/* Page header */}
          <div className="mb-16 md:mb-24">
            <FadeUp>
              <p className="font-sans text-xs uppercase tracking-[0.25em] mb-3" style={{ color: DIM }}>
                Selected work
              </p>
              <h1
                className="font-display font-black tracking-tight"
                style={{ fontSize: 'clamp(2.75rem, 6vw, 5rem)', color: INK, lineHeight: 1.05 }}
              >
                Case studies
              </h1>
            </FadeUp>
          </div>

          {/* Project rows */}
          <div className="flex flex-col gap-20 md:gap-28">
            {PROJECTS.map((project, i) => (
              <ProjectRow key={project.id} project={project} index={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
