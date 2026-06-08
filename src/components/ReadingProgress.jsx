import { useScroll, useSpring, motion } from 'framer-motion'

export default function ReadingProgress({ color = '#7B9EC7' }) {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })

  return (
    <motion.div
      style={{ scaleX, backgroundColor: color, transformOrigin: 'left' }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[51]"
    />
  )
}
