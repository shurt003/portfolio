import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Toggle Widget (Crimson #B83030) ─────────────────────────────────────────
export function ToggleWidget() {
  const [on, setOn] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setOn(p => !p), 2400)
    return () => clearInterval(id)
  }, [])

  const TRACK_W = 200
  const TRACK_H = 88
  const THUMB_W = 92
  const PAD     = 8

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <motion.div
        onClick={() => setOn(p => !p)}
        animate={{ backgroundColor: on ? 'rgba(60,8,8,0.26)' : 'rgba(60,8,8,0.12)' }}
        transition={{ duration: 0.4 }}
        style={{
          width: TRACK_W, height: TRACK_H,
          borderRadius: TRACK_H / 2,
          position: 'relative', cursor: 'pointer', padding: PAD, flexShrink: 0,
        }}
      >
        <motion.div
          animate={{ x: on ? TRACK_W - THUMB_W - PAD * 2 : 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 32 }}
          style={{
            width: THUMB_W, height: TRACK_H - PAD * 2,
            borderRadius: (TRACK_H - PAD * 2) / 2,
            backgroundColor: 'rgba(60,8,8,0.68)',
            position: 'absolute', top: PAD,
          }}
        />
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, width: TRACK_W }}>
        {[160, 120, 140].map((w, i) => (
          <motion.div
            key={i}
            animate={{ opacity: on ? 0.38 : 0.18 }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
            style={{ height: 10, width: w, borderRadius: 5, backgroundColor: 'rgba(60,8,8,0.60)' }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Chat Widget (Salmon #E86868) — abstract bubbles that spring-expand ────────
const CHAT_PILLS = [
  { id: 'a', side: 'left',  width: 140, showAt: 400  },
  { id: 'b', side: 'right', width: 98,  showAt: 1700 },
  { id: 'c', side: 'left',  width: 168, showAt: 3100 },
  { id: 'd', side: 'right', width: 118, showAt: 4600 },
]
const CHAT_LOOP    = 8400
const EXIT_START   = 6000 // when staggered exit begins

export function ChatWidget() {
  const [visible, setVisible] = useState([])
  const timers = useRef([])

  useEffect(() => {
    function run() {
      setVisible([])
      timers.current.forEach(clearTimeout)
      timers.current = []

      // Enter — each pill springs in from below
      CHAT_PILLS.forEach(p => {
        timers.current.push(setTimeout(() => setVisible(prev => [...prev, p]), p.showAt))
      })

      // Exit — reverse order, each pill slides off in its own direction
      ;[...CHAT_PILLS].reverse().forEach((p, i) => {
        timers.current.push(
          setTimeout(() => setVisible(prev => prev.filter(x => x.id !== p.id)), EXIT_START + i * 150)
        )
      })

      timers.current.push(setTimeout(run, CHAT_LOOP))
    }
    run()
    return () => timers.current.forEach(clearTimeout)
  }, [])

  return (
    <motion.div layout style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 210 }}>
      <AnimatePresence>
        {visible.map(p => (
          <motion.div
            key={p.id}
            layout
            style={{ display: 'flex', justifyContent: p.side === 'left' ? 'flex-start' : 'flex-end' }}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              x: p.side === 'left' ? -44 : 44,
              scale: 0.86,
              transition: { duration: 0.28, ease: [0.4, 0, 0.8, 1] },
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          >
            <motion.div
              initial={{ width: 28 }}
              animate={{ width: p.width }}
              transition={{ delay: 0.16, type: 'spring', stiffness: 260, damping: 26 }}
              style={{
                height: 28, flexShrink: 0, borderRadius: 14,
                backgroundColor: p.side === 'left'
                  ? 'rgba(110,22,22,0.68)'
                  : 'rgba(110,22,22,0.22)',
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Skeleton Widget (Ice Blue #C8D8E6) — staggered spring wipe in/out ─────────
const SK_COLOR   = 'rgba(28,58,80,0.22)'
const SK_STAGGER = 120
const SK_HOLD    = 1800
const SK_LOOP    = 5600

const SK_ITEMS = [
  { id: 0, w: 44,  h: 44,  circle: true  },
  { id: 1, w: 108, h: 13,  circle: false },
  { id: 2, w: 74,  h: 10,  circle: false },
  { id: 3, w: 188, h: 11,  circle: false },
  { id: 4, w: 154, h: 11,  circle: false },
  { id: 5, w: 109, h: 11,  circle: false },
  { id: 6, w: 84,  h: 30,  circle: false, scaleFromCenter: true },
]

function SkelPill({ item, active }) {
  const { w, h, circle, scaleFromCenter } = item
  const spring = { type: 'spring', stiffness: 320, damping: 28 }

  if (circle || scaleFromCenter) {
    return (
      <motion.div
        style={{ width: w, height: h, borderRadius: circle ? '50%' : h / 2, backgroundColor: SK_COLOR, flexShrink: 0 }}
        animate={{ scale: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={spring}
      />
    )
  }
  return (
    <motion.div
      style={{ height: h, borderRadius: h / 2, backgroundColor: SK_COLOR, flexShrink: 0 }}
      animate={{ width: active ? w : 0, opacity: active ? 1 : 0 }}
      transition={spring}
    />
  )
}

export function SkeletonWidget() {
  const [activeIds, setActiveIds] = useState(new Set())
  const timers = useRef([])

  useEffect(() => {
    function run() {
      setActiveIds(new Set())
      timers.current.forEach(clearTimeout)
      timers.current = []

      // Stagger in — forward order
      SK_ITEMS.forEach((item, i) => {
        timers.current.push(
          setTimeout(() => setActiveIds(prev => new Set([...prev, item.id])), 500 + i * SK_STAGGER)
        )
      })

      const allInAt = 500 + (SK_ITEMS.length - 1) * SK_STAGGER + SK_HOLD

      // Stagger out — reverse order
      ;[...SK_ITEMS].reverse().forEach((item, i) => {
        timers.current.push(
          setTimeout(() => setActiveIds(prev => {
            const next = new Set(prev); next.delete(item.id); return next
          }), allInAt + i * SK_STAGGER)
        )
      })

      timers.current.push(setTimeout(run, SK_LOOP))
    }
    run()
    return () => timers.current.forEach(clearTimeout)
  }, [])

  const has = id => activeIds.has(id)

  return (
    <div style={{ width: 196 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <SkelPill item={SK_ITEMS[0]} active={has(0)} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flex: 1 }}>
          <SkelPill item={SK_ITEMS[1]} active={has(1)} />
          <SkelPill item={SK_ITEMS[2]} active={has(2)} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 18 }}>
        <SkelPill item={SK_ITEMS[3]} active={has(3)} />
        <SkelPill item={SK_ITEMS[4]} active={has(4)} />
        <SkelPill item={SK_ITEMS[5]} active={has(5)} />
      </div>
      <SkelPill item={SK_ITEMS[6]} active={has(6)} />
    </div>
  )
}

// ─── Toast Widget (Teal #2E7C82) — abstract notification pills ───────────────
const TOAST_PILLS = [
  { id: 't1', width: 200, showAt: 400,  dotColor: 'rgba(8,44,48,0.75)' },
  { id: 't2', width: 170, showAt: 1300, dotColor: 'rgba(8,44,48,0.75)' },
  { id: 't3', width: 185, showAt: 2200, dotColor: 'rgba(8,44,48,0.75)' },
]
const TOAST_VISIBLE = 4200  // each pill stays long enough to share the stack with all 3
const TOAST_LOOP    = 8000

export function ToastWidget() {
  const [toasts, setToasts] = useState([])
  const timers = useRef([])

  useEffect(() => {
    function run() {
      setToasts([])
      timers.current.forEach(clearTimeout)
      timers.current = []

      TOAST_PILLS.forEach(t => {
        const t1 = setTimeout(() => {
          setToasts(p => [...p, t])
          const t2 = setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), TOAST_VISIBLE)
          timers.current.push(t2)
        }, t.showAt)
        timers.current.push(t1)
      })

      timers.current.push(setTimeout(run, TOAST_LOOP))
    }
    run()
    return () => timers.current.forEach(clearTimeout)
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9, width: 210, alignItems: 'flex-start' }}>
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 48, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 48, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, width: t.width }}
          >
            <div style={{
              width: 22, height: 22, borderRadius: 11, flexShrink: 0,
              backgroundColor: t.dotColor,
            }} />
            <div style={{
              flex: 1, height: 22, borderRadius: 11,
              backgroundColor: 'rgba(8,44,48,0.18)',
            }} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
