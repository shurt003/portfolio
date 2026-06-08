import { motion } from 'framer-motion'

/*
  CaseTLDR — an outcome-first summary placed at the very top of a case study,
  right after the hero. It gives a skimming reader (e.g. a hiring manager
  scanning many portfolios) the punchline in ~10 seconds: a 2–3 sentence
  outcome summary plus the headline numbers, before the deep narrative below.

  Palette is passed in per page (`colors`) so the block matches each case
  study's own identity (light cream studies vs. the dark Magic Signal page).

  Props:
    summary  string   — 2–3 sentence outcome-first summary
    stats    array    — [{ value, label }] headline figures (4 reads best)
    colors   object   — { text, dim, accent, surface, rule }
*/
export default function CaseTLDR({ summary, stats = [], colors }) {
  const { text, dim, accent, surface, rule } = colors

  return (
    <section className="px-8 md:px-14 pt-14">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl px-7 md:px-10 py-8 md:py-9"
          style={{ backgroundColor: surface, border: `1px solid ${rule}` }}
        >
          <p className="font-sans text-xs font-bold tracking-[0.22em] uppercase mb-4" style={{ color: accent }}>
            TL;DR
          </p>

          <p
            className="font-sans text-lg md:text-xl leading-relaxed"
            style={{ color: text, maxWidth: '64ch' }}
          >
            {summary}
          </p>

          {stats.length > 0 && (
            <div
              className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-7 mt-9 pt-8"
              style={{ borderTop: `1px solid ${rule}` }}
            >
              {stats.map((s, i) => (
                <div key={i}>
                  <div
                    className="font-display font-black leading-none mb-2"
                    style={{ color: text, fontSize: 'clamp(1.5rem, 2.4vw, 2rem)' }}
                  >
                    {s.value}
                  </div>
                  <div className="font-sans text-xs leading-snug" style={{ color: dim }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
