import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProjectThumb from '../components/ProjectThumbs'
import usePageMeta from '../hooks/usePageMeta'

const projects = [
  {
    href: '/design-system',
    title: 'Q2 Component Library',
    subtitle: 'Modernizing 40+ components across 5+ years of visual debt',
    tags: ['Design System', 'Enterprise SaaS', 'Ongoing'],
    impact: '20M+ users, with accessibility and visual consistency at scale',
    accent: '#7B9EC7',
    year: '2026',
  },
  {
    href: '/messaging-redesign',
    title: 'Secure Messaging Redesign',
    subtitle: 'Modernizing a Legacy Enterprise UI',
    tags: ['UX Research', 'Redesign', 'Q2'],
    impact: '92.9 SUS score, affecting 20M+ users',
    accent: '#E8C547',
    year: '2024',
    image: '/images/SecureMessaging/securemessagingbgheroimage.webp',
  },
  {
    href: '/interstitial',
    title: 'Interstitial',
    subtitle: 'Turning a forgotten loading screen into a branded moment',
    tags: ['Product Design', 'Interaction Design', 'Q2'],
    impact: 'Accidentally unlocked an $8M deal',
    accent: '#1B4F8A',
    year: '2025',
    image: '/images/Interstitial/interstitial-home-thumbnail.png',
  },
  {
    href: '/validation',
    title: 'Form Validation',
    subtitle: 'Making the evidence-based case for inline validation',
    tags: ['UX Research', 'Usability Testing', 'Q2'],
    impact: 'Moderated study that changed platform-wide validation patterns',
    accent: '#7B9EC7',
    year: '2026',
  },
  {
    href: '/magic-signal',
    title: 'Magic Signal',
    subtitle: 'Real-time market data visualization, AI-powered, for iOS & Android',
    tags: ['Product Design', 'Data Viz', 'AI-Powered'],
    impact: 'Designed, built, and shipped solo, on the App Store and Google Play',
    accent: '#5B8DEA',
    year: '2025',
    image: '/images/magicSignal/ms-home-thumbnail.png',
  },
]

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function FeaturedCard({ href, title, subtitle, tags, impact, accent, year, image }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div variants={item} className="col-span-full">
      <Link
        to={href}
        className="group flex flex-col md:flex-row rounded-2xl overflow-hidden bg-white transition-all duration-300 h-full"
        style={{
          border: `2px solid ${hovered ? accent : accent + '40'}`,
          transition: 'border-color 0.3s ease',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Thumbnail: left half on desktop */}
        <div
          className="md:w-1/2 aspect-[4/3] md:aspect-auto relative overflow-hidden flex-shrink-0 min-h-[260px]"
          style={{ backgroundColor: accent + '18' }}
        >
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            {image
              ? <img src={image} alt={title} className="w-full h-full object-cover" />
              : <ProjectThumb href={href} accent={accent} />
            }
          </div>
        </div>

        {/* Info: right half */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8 flex-wrap">
              <span className="font-display text-xs tracking-widest text-ink/30">01</span>
              <span className="font-sans text-xs text-ink/38">{year}</span>
              {tags.map((t) => (
                <span
                  key={t}
                  className="font-sans text-[11px] px-2.5 py-0.5 rounded-full border border-ink/15 text-ink/45"
                >
                  {t}
                </span>
              ))}
            </div>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-ink leading-tight mb-3">
              {title}
            </h2>
            <p className="font-sans text-base text-ink/50 mb-8">{subtitle}</p>

            {/* Impact: hero treatment */}
            <p className="font-sans text-base font-medium text-ink/80">{impact}</p>
          </div>

          <div className="flex items-center gap-2 font-sans text-sm text-ink/38 group-hover:text-ink/80 transition-colors duration-200 mt-10">
            View case study
            <span className="inline-block group-hover:translate-x-3 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]">→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function ProjectCard({ href, title, subtitle, tags, impact, accent, year, index, image }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div variants={item} className="flex flex-col">
      <Link
        to={href}
        className="group flex flex-col rounded-2xl overflow-hidden bg-white transition-all duration-300 h-full"
        style={{
          border: `2px solid ${hovered ? accent : accent + '30'}`,
          transition: 'border-color 0.3s ease',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Thumbnail */}
        <div
          className="aspect-[3/2] relative overflow-hidden"
          style={{ backgroundColor: accent + '15' }}
        >
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04]">
            {image
              ? <img src={image} alt={title} className="w-full h-full object-cover" />
              : <ProjectThumb href={href} accent={accent} />
            }
          </div>
          {/* Project number */}
          <span className="absolute top-4 left-4 font-display text-xs tracking-widest text-ink/25">
            {String(index + 2).padStart(2, '0')}
          </span>
        </div>

        {/* Info */}
        <div className="p-5 md:p-6 flex flex-col flex-1">
          {/* Year + tags */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="font-sans text-xs text-ink/38">{year}</span>
            {tags.map((t) => (
              <span
                key={t}
                className="font-sans text-[11px] px-2.5 py-0.5 rounded-full border border-ink/15 text-ink/45"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Title */}
          <h2 className="font-display text-xl md:text-2xl font-bold text-ink leading-tight mb-1.5">
            {title}
          </h2>
          <p className="font-sans text-sm text-ink/48 mb-4">{subtitle}</p>

          {/* Impact: de-italicized, more prominent */}
          <p className="font-sans text-sm font-medium text-ink/72 mb-5 flex-1">{impact}</p>

          {/* CTA */}
          <div className="flex items-center gap-1.5 font-sans text-xs text-ink/35 group-hover:text-ink/80 transition-colors duration-200 mt-auto">
            View case study
            <span className="inline-block group-hover:translate-x-2.5 transition-transform duration-300 delay-[35ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]">→</span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function Projects() {
  usePageMeta(
    'Work by Stephen Hurt',
    'Selected product and UX design case studies by Stephen Hurt, spanning design systems, UX research, and interaction design for 20M+ banking users.'
  )
  const [featured, ...rest] = projects

  return (
    <main className="min-h-screen bg-cream pt-28 pb-24 px-8 md:px-14">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex items-end justify-between gap-8"
        >
          <h1 className="font-display text-6xl md:text-8xl font-bold text-ink leading-none">
            Selected<br />Work
          </h1>
          <p className="font-sans text-sm text-ink/40 mb-2 shrink-0">{projects.length} projects</p>
        </motion.div>

        {/* Project grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          <FeaturedCard {...featured} />
          {rest.map((p, i) => (
            <ProjectCard key={p.href} {...p} index={i} />
          ))}
        </motion.div>
      </div>
    </main>
  )
}
