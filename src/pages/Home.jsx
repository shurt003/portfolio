import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useNavTheme } from '../contexts/NavTheme'
import RivePiece from '../components/RivePiece'

const HeroRings = lazy(() => import('../components/HeroRings'))

/* ── Palette ─────────────────────────────────────────────────────────── */
const BG   = '#F5F0E8'
const INK  = '#1C2322'
const BLUE = '#2B59C3'
const DARK = '#0D0F14'
const DIM  = 'rgba(28,35,34,0.68)'   // ≥4.5:1 on BG cream (0.6 measured 4.1:1, failed AA)

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

/* ── Main ────────────────────────────────────────────────────────────── */
export default function Home() {
  const { setIsDark } = useNavTheme()
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })
  const { scrollY } = useScroll()
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 120], [1, 0])
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

        {/* max-w-5xl: the h1 at its 6rem clamp cap is ~920px wide; 4xl (896px) forced a wrap on wide screens */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
          <motion.p
            className="font-sans text-sm uppercase tracking-[0.25em] mb-7"
            style={{ color: DIM }}
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Stephen Hurt, Product Designer
          </motion.p>

          <h1
            className="font-display font-black tracking-tight mb-8"
            style={{
              fontSize: 'clamp(2.8rem, 6.5vw, 6rem)',
              lineHeight: 1.04,
              color: INK,
            }}
          >
            {[
              <>Designing what</>,
              <><span style={{ color: BLUE, whiteSpace: 'nowrap' }}>22 million</span> people tap</>,
            ].map((line, i) => (
              /* Masked line reveal: the wrapper clips, the inner line rises.
                 Padding + negative margin keep descenders out of the clip. */
              <span
                key={i}
                className="block overflow-hidden"
                style={{ paddingBottom: '0.12em', marginBottom: '-0.12em' }}
              >
                <motion.span
                  className="block"
                  initial={{ y: '112%' }}
                  animate={heroInView ? { y: '0%' } : {}}
                  transition={{ duration: 1.0, delay: 0.15 + i * 0.1, ease: [0.19, 1, 0.22, 1] }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            className="font-sans text-lg md:text-xl leading-relaxed max-w-xl mb-12"
            style={{ color: DIM }}
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            I'm a product and interaction designer at Q2. Before UX, I spent ten years in motion design.
          </motion.p>

          <div className="flex gap-12 md:gap-16">
            {[
              ['$8M', 'Deal won by one screen'],
              ['500+', 'Financial institutions'],
              ['12yr', 'Design career'],
            ].map(([value, label], i) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <Stat value={value} label={label} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Scroll indicator ─────────────────────────────────────── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 2.0 }}
            className="relative w-[2px] h-12 overflow-hidden"
            style={{ backgroundColor: 'transparent' }}
          >
            <motion.div
              className="absolute top-0 left-0 w-full"
              style={{ height: '40%', background: 'rgba(28,35,34,0.5)' }}
              animate={{ y: ['0%', '250%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.3 }}
            />
          </motion.div>
        </motion.div>
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
                <p className="font-sans text-xs uppercase tracking-[0.25em] mb-5" style={{ color: 'rgba(255,255,255,0.55)' }}>
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
                  At Q2, my work runs from product features to the component system that every product on the platform is built from — banking software used by 22 million people across 500+ financial institutions.
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

      {/* ── Motion Lab teaser ────────────────────────────────────────── */}
      <section className="px-6 md:px-14 lg:px-20 pt-20 md:pt-32 pb-20 md:pb-32">
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
