import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NextProjectLink({ to, title }) {
  const [hovered, setHovered] = useState(false)
  const [origin, setOrigin] = useState('50% 50%')

  const handleMouseEnter = (e) => {
    const h3 = e.currentTarget.querySelector('h3')
    const rect = h3.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1)
    const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1)
    setOrigin(`${x}% ${y}%`)
    setHovered(true)
  }

  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      <h3 className="relative font-display text-3xl md:text-4xl font-bold">
        <span className="text-ink">{title}</span>
        <motion.span
          className="absolute inset-0 text-periwinkle pointer-events-none"
          animate={{ clipPath: hovered ? `circle(150% at ${origin})` : `circle(0% at ${origin})` }}
          transition={hovered ? { duration: 0.9, ease: [0.22, 1, 0.36, 1] } : { duration: 0 }}
          aria-hidden="true"
        >
          {title}
        </motion.span>
      </h3>
    </Link>
  )
}
