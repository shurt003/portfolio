import { motion } from 'framer-motion'

const FLOAT_CONFIGS = [
  { y: [-8, 8],   duration: 4.5, rotate: [-3, 3]  },
  { y: [-6, 10],  duration: 5.2, rotate: [2, -2]  },
  { y: [-10, 6],  duration: 3.8, rotate: [-2, 4]  },
  { y: [-7, 9],   duration: 4.1, rotate: [3, -3]  },
  { y: [-9, 7],   duration: 5.6, rotate: [-4, 2]  },
  { y: [-6, 8],   duration: 4.8, rotate: [2, -4]  },
]

// Shapes handle their own animations internally — no external continuous anim needed
const CONTINUOUS_ANIM = {}
const CONTINUOUS_TRANSITION = {}

// Unique entrance origin per cell — cells arrive from unique directions
const ENTRANCE = {
  0: { x: -60, y: -60, delay: 0    },
  1: { x: 0,   y: -80, delay: 0.07 },
  2: { x: 60,  y: -60, delay: 0.14 },
  3: { x: -40, y:  60, delay: 0.21 },
  5: { x: 60,  y:  60, delay: 0.28 },
}


export default function GridCell({
  bg, Shape, shapeColor, index,
  children, className = '',
  noFloat = false,
  scrollYProgress,
  style = {},
}) {
  const floatCfg = FLOAT_CONFIGS[index] ?? FLOAT_CONFIGS[0]
  const entrance  = ENTRANCE[index] ?? { x: 0, y: 30, delay: 0 }
  const contAnim  = CONTINUOUS_ANIM[index]
  const contTrans = CONTINUOUS_TRANSITION[index]

  const ShapeLayer = Shape ? (
    noFloat ? (
      <Shape color={shapeColor} scrollYProgress={scrollYProgress} />
    ) : (
      <motion.div
        animate={{ y: floatCfg.y, rotate: floatCfg.rotate }}
        transition={{
          y:      { repeat: Infinity, repeatType: 'reverse', duration: floatCfg.duration,       ease: 'easeInOut' },
          rotate: { repeat: Infinity, repeatType: 'reverse', duration: floatCfg.duration * 1.3, ease: 'easeInOut' },
        }}
      >
        <Shape color={shapeColor} scrollYProgress={scrollYProgress} />
      </motion.div>
    )
  ) : null

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: bg, ...style }}
      initial={{ opacity: 0, x: entrance.x, y: entrance.y }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.9, delay: entrance.delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Shape layer */}
      {ShapeLayer && (
        <div className="absolute inset-0 flex items-center justify-center">
          {contAnim ? (
            <motion.div animate={contAnim} transition={contTrans}>
              {ShapeLayer}
            </motion.div>
          ) : (
            ShapeLayer
          )}
        </div>
      )}

      {/* Content slot — for the text/CTA cell */}
      {children}
    </motion.div>
  )
}
