import { useState } from 'react'
import { motion } from 'framer-motion'

/*
  MotionLabIntro — a brief entrance curtain that plays when you land on the
  Motion Lab page. A dark panel covers the viewport with the "Motion Lab"
  wordmark, then wipes up to reveal the page — a small transition flourish
  fitting for a motion-design showcase.
*/
export default function MotionLabIntro() {
  const [show, setShow] = useState(true)
  if (!show) return null

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex flex-col items-center justify-center"
      style={{ backgroundColor: '#0D0F14' }}
      initial={{ y: 0 }}
      animate={{ y: '-100%' }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.75 }}
      onAnimationComplete={() => setShow(false)}
    >
      <motion.span
        className="font-display font-black text-white"
        style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', letterSpacing: '-0.01em' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        Motion Lab
      </motion.span>
      {/* Fixed-width box; draw it in with scaleX (a transform) so it never
          reflows the layout and the wordmark above stays perfectly still. */}
      <motion.span
        className="block h-px mt-5"
        style={{ width: 162, transformOrigin: 'center', backgroundColor: 'rgba(255,255,255,0.4)' }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      />
    </motion.div>
  )
}
