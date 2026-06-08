import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import NextProjectLink from './NextProjectLink'

export default function CaseStudyLayout({
  title,
  subtitle,
  tags = [],
  accent = '#7B9EC7',
  overview,
  sections = [],
  nextProject,
}) {
  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <section
        className="pt-28 pb-20 px-8 md:px-14 relative overflow-hidden"
        style={{ borderBottom: `3px solid ${accent}` }}
      >
        {/* Background accent blob */}
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ backgroundColor: accent }}
        />

        <div className="max-w-5xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((t) => (
                <span
                  key={t}
                  className="font-sans text-xs px-3 py-1 rounded-full border text-ink/60"
                  style={{ borderColor: `${accent}60` }}
                >
                  {t}
                </span>
              ))}
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-ink leading-tight mb-4">
              {title}
            </h1>
            <p className="font-sans text-lg md:text-xl text-ink/60 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      {overview && (
        <section className="px-8 md:px-14 py-16 border-b border-ink/10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
            >
              {overview.map((item) => (
                <div key={item.label}>
                  <p className="font-sans text-xs tracking-widest uppercase text-ink/40 mb-2">
                    {item.label}
                  </p>
                  <p className="font-sans text-base text-ink/80 leading-relaxed">{item.value}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Sections */}
      <article className="px-8 md:px-14 py-16">
        <div className="max-w-5xl mx-auto space-y-24">
          {sections.map((section, i) => (
            <motion.section
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {section.label && (
                <p className="font-sans text-xs tracking-widest uppercase text-ink/40 mb-3">
                  {section.label}
                </p>
              )}
              {section.heading && (
                <h2 className="font-display text-2xl md:text-3xl font-bold text-ink mb-5">
                  {section.heading}
                </h2>
              )}
              {section.body && (
                <div className="font-sans text-base text-ink/70 leading-relaxed space-y-4 max-w-3xl">
                  {Array.isArray(section.body)
                    ? section.body.map((para, j) => <p key={j}>{para}</p>)
                    : <p>{section.body}</p>}
                </div>
              )}
              {section.bullets && (
                <ul className="mt-5 space-y-3 max-w-3xl">
                  {section.bullets.map((b, j) => (
                    <li key={j} className="flex items-start gap-3 font-sans text-base text-ink/70">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accent }} />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              {section.impact && (
                <div
                  className="mt-8 rounded-2xl p-8 border"
                  style={{ borderColor: `${accent}40`, background: `${accent}10` }}
                >
                  <p className="font-sans text-xs tracking-widest uppercase text-ink/40 mb-3">Impact</p>
                  <p className="font-display text-xl md:text-2xl font-bold text-ink">{section.impact}</p>
                </div>
              )}
              {section.image && (
                <div className="mt-8 rounded-2xl overflow-hidden border border-ink/10">
                  <img
                    src={section.image}
                    alt={section.imageAlt || section.heading || ''}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              )}
              {section.images && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.images.map((img, j) => (
                    <div key={j} className="rounded-2xl overflow-hidden border border-ink/10">
                      <img
                        src={img.src}
                        alt={img.alt || ''}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
              {section.video && (
                <div className="mt-8 rounded-2xl overflow-hidden border border-ink/10 bg-ink/5">
                  <video
                    src={section.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-auto"
                  />
                </div>
              )}
              {section.vimeo && (
                <div className="mt-8 rounded-2xl overflow-hidden border border-ink/10 aspect-video">
                  <iframe
                    src={`https://player.vimeo.com/video/${section.vimeo}?autoplay=0&title=0&byline=0&portrait=0`}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={section.heading || 'Video'}
                  />
                </div>
              )}
              {section.videos && (
                <div className="mt-8 space-y-4">
                  {section.videos.map((vid, j) => (
                    <div key={j} className="rounded-2xl overflow-hidden border border-ink/10 bg-ink/5">
                      <video
                        src={vid.src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-auto"
                      />
                      {vid.caption && (
                        <p className="font-sans text-xs text-ink/40 px-4 py-2">{vid.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.section>
          ))}
        </div>
      </article>

      {/* Next project */}
      {nextProject && (
        <section className="px-8 md:px-14 py-20 border-t border-ink/10">
          <div className="max-w-5xl mx-auto">
            <p className="font-sans text-xs tracking-widest uppercase text-ink/40 mb-4">Next Project</p>
            <NextProjectLink to={nextProject.href} title={nextProject.title} />
          </div>
        </section>
      )}
    </main>
  )
}
