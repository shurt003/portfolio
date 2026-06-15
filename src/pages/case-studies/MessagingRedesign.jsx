import { useRef } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import NextProjectLink from '../../components/NextProjectLink'
import CaseTLDR from '../../components/CaseTLDR'
import usePageMeta from '../../hooks/usePageMeta'

const ACCENT = '#E8C547'

// ─── Utilities ───────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="font-sans text-xs tracking-widest uppercase text-ink/40 mb-3">
      {children}
    </p>
  )
}

// ─── Section (formerly collapsible) ──────────────────────────────────────────
function CollapsibleSection({ sectionLabel, title, children }) {
  return (
    <FadeIn>
      <section>
        <SectionLabel>{sectionLabel}</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight mb-3">
          {title}
        </h2>
        <div className="border-b border-ink/10 mt-2 mb-8" />
        {children}
      </section>
    </FadeIn>
  )
}

// ─── Metric Card ─────────────────────────────────────────────────────────────
function MetricCard({ value, label, sub }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-ink/8 px-6 py-8 text-center">
      <div
        className="font-display text-5xl font-bold leading-none mb-2"
        style={{ color: ACCENT }}
      >
        {value}
      </div>
      <div className="font-sans text-sm font-semibold text-ink/80 mb-1">{label}</div>
      {sub && <div className="font-sans text-xs text-ink/45 leading-snug">{sub}</div>}
    </div>
  )
}

// ─── Decision Callout ─────────────────────────────────────────────────────────
function DecisionCallout({ before, after, rationale }) {
  return (
    <div className="bg-white rounded-2xl border border-ink/8 overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-ink/8">
        <div className="p-6">
          <p className="font-sans text-[10px] uppercase tracking-widest text-blush mb-3">Before</p>
          <p className="font-display text-lg font-bold text-ink/50 line-through leading-snug">{before}</p>
        </div>
        <div className="p-6" style={{ backgroundColor: ACCENT + '0d' }}>
          <p className="font-sans text-[10px] uppercase tracking-widest mb-3" style={{ color: ACCENT }}>After</p>
          <p className="font-display text-lg font-bold text-ink leading-snug">{after}</p>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-ink/8 bg-ink/[0.015]">
        <span className="font-sans text-[10px] font-semibold uppercase tracking-widest text-ink/40">Rationale → </span>
        <span className="font-sans text-sm text-ink/70">{rationale}</span>
      </div>
    </div>
  )
}

// ─── Task Flow: Send Message ──────────────────────────────────────────────────
function SendMessageFlow() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const nodeStyle = { fill: '#fff', stroke: '#1A1A1A', strokeWidth: 1.5 }
  const termStyle = { fill: '#1A1A1A' }
  const diamondStyle = { fill: '#E8C547', stroke: '#1A1A1A', strokeWidth: 1.5 }
  const labelStyle = { fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fill: '#1A1A1A', textAnchor: 'middle', dominantBaseline: 'central' }
  const termLabelStyle = { fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fill: '#F5F0E8', textAnchor: 'middle', dominantBaseline: 'central' }
  const edgeLabelStyle = { fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fill: '#1A1A1A66', textAnchor: 'middle', dominantBaseline: 'central' }

  const nodes = [
    { id: 'home',       x: 60,   y: 90,  w: 80,  h: 36, type: 'term',    label: 'Home' },
    { id: 'inbox',      x: 200,  y: 90,  w: 108, h: 36, type: 'rect',    label: ['Inbox /','Msg Center'] },
    { id: 'new',        x: 350,  y: 90,  w: 104, h: 36, type: 'rect',    label: 'New Message' },
    { id: 'recipient',  x: 500,  y: 90,  w: 108, h: 36, type: 'rect',    label: ['Select','Recipient'] },
    { id: 'subject',    x: 650,  y: 90,  w: 104, h: 36, type: 'rect',    label: ['Write','Subject'] },
    { id: 'message',    x: 800,  y: 90,  w: 104, h: 36, type: 'rect',    label: ['Write','Message'] },
    { id: 'attach_q',   x: 960,  y: 90,  w: 56,  h: 56, type: 'diamond', label: ['Attach','File?'] },
    { id: 'send',       x: 1120, y: 90,  w: 104, h: 36, type: 'term',    label: 'Send Message' },
    { id: 'attach',     x: 960,  y: 210, w: 104, h: 36, type: 'rect',    label: 'Attach File' },
    { id: 'back',       x: 865,  y: 210, w: 68,  h: 30, type: 'term',    label: 'Cancel' },
    { id: 'draft_q',    x: 765,  y: 210, w: 56,  h: 56, type: 'diamond', label: ['Save','Draft?'] },
    { id: 'draft_saved',x: 625,  y: 210, w: 100, h: 36, type: 'rect',    label: 'Draft Saved' },
  ]
  const nMap = Object.fromEntries(nodes.map(n => [n.id, n]))
  function rx(n) { return n.type === 'term' ? n.h / 2 : 6 }

  // Timing constants
  const NODE_DUR = 0.2
  const ARROW_DUR = 0.28
  const STEP = 0.55 // node + gap + arrow + gap per step

  // Main path delays: home → inbox → new → recipient → subject → message → attach_q → send
  const mainSeq = ['home','inbox','new','recipient','subject','message','attach_q','send']
  const nodeDelay  = (i) => i * STEP
  const arrowDelay = (i) => i * STEP + NODE_DUR + 0.05
  const branchStart = mainSeq.length * STEP + 0.2

  function nodeAnim(delay) {
    return {
      initial: { opacity: 0, scale: 0.75 },
      animate: isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.75 },
      transition: { duration: NODE_DUR, delay, ease: [0.22, 1, 0.36, 1] },
    }
  }
  function arrowAnim(delay) {
    return {
      initial: { pathLength: 0, opacity: 0 },
      animate: isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
      transition: { pathLength: { duration: ARROW_DUR, delay, ease: 'easeInOut' }, opacity: { duration: 0.01, delay } },
    }
  }
  function branchArrowAnim(delay) {
    return {
      initial: { opacity: 0 },
      animate: isInView ? { opacity: 0.55 } : { opacity: 0 },
      transition: { duration: 0.35, delay },
    }
  }
  function labelAnim(delay) {
    return {
      initial: { opacity: 0 },
      animate: isInView ? { opacity: 1 } : { opacity: 0 },
      transition: { duration: 0.2, delay },
    }
  }

  function renderNode(n, delay) {
    const anim = nodeAnim(delay)
    if (n.type === 'diamond') {
      const hw = n.w / 2, hh = n.h / 2
      const pts = `${n.x},${n.y - hh} ${n.x + hw},${n.y} ${n.x},${n.y + hh} ${n.x - hw},${n.y}`
      const lines = Array.isArray(n.label) ? n.label : [n.label]
      return (
        <motion.g key={n.id} style={{ transformOrigin: `${n.x}px ${n.y}px` }} {...anim}>
          <polygon points={pts} style={diamondStyle} />
          {lines.length === 1
            ? <text x={n.x} y={n.y} style={labelStyle}>{lines[0]}</text>
            : lines.map((l, i) => <text key={i} x={n.x} y={n.y + (i === 0 ? -7 : 7)} style={labelStyle}>{l}</text>)
          }
        </motion.g>
      )
    }
    const style = n.type === 'term' ? termStyle : nodeStyle
    const labelS = n.type === 'term' ? termLabelStyle : labelStyle
    const lines = Array.isArray(n.label) ? n.label : [n.label]
    return (
      <motion.g key={n.id} style={{ transformOrigin: `${n.x}px ${n.y}px` }} {...anim}>
        <rect x={n.x - n.w / 2} y={n.y - n.h / 2} width={n.w} height={n.h} rx={rx(n)} style={style} />
        {lines.length === 1
          ? <text x={n.x} y={n.y} style={labelS}>{lines[0]}</text>
          : lines.map((l, i) => <text key={i} x={n.x} y={n.y + (i === 0 ? -7 : 7)} style={labelS}>{l}</text>)
        }
      </motion.g>
    )
  }

  return (
    <div className="overflow-x-auto" ref={ref}>
      <svg viewBox="0 0 1220 270" style={{ minWidth: 800, width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <marker id="arr-send" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 7 3, 0 6" fill="#1A1A1A" />
          </marker>
        </defs>

        {/* Flow label */}
        <motion.text x={16} y={16}
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fill: '#1A1A1A99', fontWeight: 600, dominantBaseline: 'hanging' }}
          {...labelAnim(0.1)}
        >SEND MESSAGE</motion.text>

        {/* Main path nodes */}
        {mainSeq.map((id, i) => renderNode(nMap[id], nodeDelay(i)))}

        {/* Branch nodes */}
        {renderNode(nMap.draft_q,    branchStart)}
        {renderNode(nMap.draft_saved,branchStart + 0.15)}
        {renderNode(nMap.attach,     branchStart)}
        {renderNode(nMap.back,       branchStart + 0.15)}

        {/* Main flow arrows */}
        {[
          ['home','inbox'], ['inbox','new'], ['new','recipient'],
          ['recipient','subject'], ['subject','message'], ['message','attach_q'],
        ].map(([a, b], i) => {
          const f = nMap[a], t = nMap[b]
          return (
            <motion.line key={`${a}-${b}`}
              x1={f.x + f.w / 2} y1={f.y}
              x2={t.type === 'diamond' ? t.x - t.w / 2 : t.x - t.w / 2} y2={t.y}
              stroke="#1A1A1A" strokeWidth={1.5} markerEnd="url(#arr-send)"
              {...arrowAnim(arrowDelay(i))}
            />
          )
        })}

        {/* attach_q → Send (No) */}
        <motion.line
          x1={nMap.attach_q.x + nMap.attach_q.w / 2} y1={nMap.attach_q.y}
          x2={nMap.send.x - nMap.send.w / 2} y2={nMap.send.y}
          stroke="#1A1A1A" strokeWidth={1.5} markerEnd="url(#arr-send)"
          {...arrowAnim(arrowDelay(6))}
        />
        <motion.text
          x={(nMap.attach_q.x + nMap.attach_q.w / 2 + nMap.send.x - nMap.send.w / 2) / 2}
          y={nMap.attach_q.y - 10} style={edgeLabelStyle}
          {...labelAnim(arrowDelay(6) + 0.2)}
        >No</motion.text>

        {/* Branch: Write Message → (Back) → Save Draft? */}
        <motion.line
          x1={nMap.message.x} y1={nMap.message.y + nMap.message.h / 2}
          x2={nMap.draft_q.x} y2={nMap.draft_q.y - nMap.draft_q.h / 2}
          stroke="#1A1A1A" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#arr-send)"
          {...branchArrowAnim(branchStart + 0.05)}
        />
        <motion.text
          x={(nMap.message.x + nMap.draft_q.x) / 2 - 16}
          y={(nMap.message.y + nMap.message.h / 2 + nMap.draft_q.y - nMap.draft_q.h / 2) / 2}
          style={edgeLabelStyle} {...labelAnim(branchStart + 0.25)}
        >Back</motion.text>

        {/* Branch: Save Draft? → Draft Saved (points left) */}
        <motion.line
          x1={nMap.draft_q.x - nMap.draft_q.w / 2} y1={nMap.draft_q.y}
          x2={nMap.draft_saved.x + nMap.draft_saved.w / 2} y2={nMap.draft_saved.y}
          stroke="#1A1A1A" strokeWidth={1.5} markerEnd="url(#arr-send)"
          {...branchArrowAnim(branchStart + 0.2)}
        />
        <motion.text
          x={(nMap.draft_q.x - nMap.draft_q.w / 2 + nMap.draft_saved.x + nMap.draft_saved.w / 2) / 2}
          y={nMap.draft_q.y - 10} style={edgeLabelStyle}
          {...labelAnim(branchStart + 0.35)}
        >Yes</motion.text>

        {/* Branch: attach_q → Attach File (Yes, down) */}
        <motion.line
          x1={nMap.attach_q.x} y1={nMap.attach_q.y + nMap.attach_q.h / 2}
          x2={nMap.attach.x} y2={nMap.attach.y - nMap.attach.h / 2}
          stroke="#1A1A1A" strokeWidth={1.5} markerEnd="url(#arr-send)"
          {...branchArrowAnim(branchStart + 0.05)}
        />
        <motion.text
          x={nMap.attach_q.x + 14}
          y={(nMap.attach_q.y + nMap.attach_q.h / 2 + nMap.attach.y - nMap.attach.h / 2) / 2}
          style={edgeLabelStyle} {...labelAnim(branchStart + 0.25)}
        >Yes</motion.text>

        {/* Branch: Attach File → Back */}
        <motion.line
          x1={nMap.attach.x - nMap.attach.w / 2} y1={nMap.attach.y}
          x2={nMap.back.x + nMap.back.w / 2} y2={nMap.back.y}
          stroke="#1A1A1A" strokeWidth={1.5} markerEnd="url(#arr-send)"
          {...branchArrowAnim(branchStart + 0.2)}
        />

        {/* Branch: Back → Write Message (curved, dashed) */}
        <motion.path
          d={`M${nMap.back.x},${nMap.back.y - nMap.back.h / 2} C${nMap.back.x},${nMap.back.y - 60} ${nMap.message.x},${nMap.message.y + 60} ${nMap.message.x},${nMap.message.y + nMap.message.h / 2}`}
          fill="none" stroke="#1A1A1A" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#arr-send)"
          {...branchArrowAnim(branchStart + 0.3)}
        />

        {/* Branch: Attach File → Send Message */}
        <motion.path
          d={`M${nMap.attach.x + nMap.attach.w / 2},${nMap.attach.y} L${nMap.send.x},${nMap.attach.y} L${nMap.send.x},${nMap.send.y + nMap.send.h / 2}`}
          fill="none" stroke="#1A1A1A" strokeWidth={1.5} markerEnd="url(#arr-send)"
          {...branchArrowAnim(branchStart + 0.25)}
        />
      </svg>
    </div>
  )
}

// ─── Task Flow: Read/Reply Message ────────────────────────────────────────────
function ReadReplyFlow() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const nodeStyle = { fill: '#fff', stroke: '#1A1A1A', strokeWidth: 1.5 }
  const termStyle = { fill: '#1A1A1A' }
  const diamondStyle = { fill: '#E8C547', stroke: '#1A1A1A', strokeWidth: 1.5 }
  const labelStyle = { fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fill: '#1A1A1A', textAnchor: 'middle', dominantBaseline: 'central' }
  const termLabelStyle = { fontFamily: 'Space Grotesk, sans-serif', fontSize: 11, fill: '#F5F0E8', textAnchor: 'middle', dominantBaseline: 'central' }
  const edgeLabelStyle = { fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fill: '#1A1A1A66', textAnchor: 'middle', dominantBaseline: 'central' }

  const nodes = [
    { id: 'home',       x: 60,   y: 90,  w: 80,  h: 36, type: 'term',    label: 'Home' },
    { id: 'inbox',      x: 200,  y: 90,  w: 108, h: 36, type: 'rect',    label: ['Inbox /','Msg Center'] },
    { id: 'view',       x: 350,  y: 90,  w: 104, h: 36, type: 'rect',    label: 'View Message' },
    { id: 'read',       x: 490,  y: 90,  w: 100, h: 36, type: 'rect',    label: 'Read Message' },
    { id: 'reply',      x: 635,  y: 90,  w: 104, h: 36, type: 'rect',    label: 'Write Reply' },
    { id: 'attach_q',   x: 790,  y: 90,  w: 56,  h: 56, type: 'diamond', label: ['Attach','File?'] },
    { id: 'send',       x: 950,  y: 90,  w: 104, h: 36, type: 'term',    label: 'Send Message' },
    { id: 'attach',     x: 830,  y: 210, w: 104, h: 36, type: 'rect',    label: 'Attach File' },
    { id: 'back',       x: 700,  y: 210, w: 68,  h: 30, type: 'term',    label: 'Cancel' },
    { id: 'draft_q',    x: 600,  y: 210, w: 56,  h: 56, type: 'diamond', label: ['Save','Draft?'] },
    { id: 'draft_saved',x: 460,  y: 210, w: 100, h: 36, type: 'rect',    label: 'Draft Saved' },
  ]
  const nMap = Object.fromEntries(nodes.map(n => [n.id, n]))
  function rx(n) { return n.type === 'term' ? n.h / 2 : 6 }

  const NODE_DUR = 0.2
  const ARROW_DUR = 0.28
  const STEP = 0.55

  const mainSeq = ['home','inbox','view','read','reply','attach_q','send']
  const nodeDelay  = (i) => i * STEP
  const arrowDelay = (i) => i * STEP + NODE_DUR + 0.05
  const branchStart = mainSeq.length * STEP + 0.2

  function nodeAnim(delay) {
    return {
      initial: { opacity: 0, scale: 0.75 },
      animate: isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.75 },
      transition: { duration: NODE_DUR, delay, ease: [0.22, 1, 0.36, 1] },
    }
  }
  function arrowAnim(delay) {
    return {
      initial: { pathLength: 0, opacity: 0 },
      animate: isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 },
      transition: { pathLength: { duration: ARROW_DUR, delay, ease: 'easeInOut' }, opacity: { duration: 0.01, delay } },
    }
  }
  function branchArrowAnim(delay) {
    return {
      initial: { opacity: 0 },
      animate: isInView ? { opacity: 0.55 } : { opacity: 0 },
      transition: { duration: 0.35, delay },
    }
  }
  function labelAnim(delay) {
    return {
      initial: { opacity: 0 },
      animate: isInView ? { opacity: 1 } : { opacity: 0 },
      transition: { duration: 0.2, delay },
    }
  }

  function renderNode(n, delay) {
    const anim = nodeAnim(delay)
    if (n.type === 'diamond') {
      const hw = n.w / 2, hh = n.h / 2
      const pts = `${n.x},${n.y - hh} ${n.x + hw},${n.y} ${n.x},${n.y + hh} ${n.x - hw},${n.y}`
      const lines = Array.isArray(n.label) ? n.label : [n.label]
      return (
        <motion.g key={n.id} style={{ transformOrigin: `${n.x}px ${n.y}px` }} {...anim}>
          <polygon points={pts} style={diamondStyle} />
          {lines.length === 1
            ? <text x={n.x} y={n.y} style={labelStyle}>{lines[0]}</text>
            : lines.map((l, i) => <text key={i} x={n.x} y={n.y + (i === 0 ? -7 : 7)} style={labelStyle}>{l}</text>)
          }
        </motion.g>
      )
    }
    const style = n.type === 'term' ? termStyle : nodeStyle
    const labelS = n.type === 'term' ? termLabelStyle : labelStyle
    const lines = Array.isArray(n.label) ? n.label : [n.label]
    return (
      <motion.g key={n.id} style={{ transformOrigin: `${n.x}px ${n.y}px` }} {...anim}>
        <rect x={n.x - n.w / 2} y={n.y - n.h / 2} width={n.w} height={n.h} rx={rx(n)} style={style} />
        {lines.length === 1
          ? <text x={n.x} y={n.y} style={labelS}>{lines[0]}</text>
          : lines.map((l, i) => <text key={i} x={n.x} y={n.y + (i === 0 ? -7 : 7)} style={labelS}>{l}</text>)
        }
      </motion.g>
    )
  }

  return (
    <div className="overflow-x-auto" ref={ref}>
      <svg viewBox="0 0 1060 270" style={{ minWidth: 700, width: '100%', height: 'auto', display: 'block' }}>
        <defs>
          <marker id="arr-rr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 7 3, 0 6" fill="#1A1A1A" />
          </marker>
        </defs>

        {/* Flow label */}
        <motion.text x={16} y={16}
          style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 10, fill: '#1A1A1A99', fontWeight: 600, dominantBaseline: 'hanging' }}
          {...labelAnim(0.1)}
        >READ / REPLY MESSAGE</motion.text>

        {/* Main path nodes */}
        {mainSeq.map((id, i) => renderNode(nMap[id], nodeDelay(i)))}

        {/* Branch nodes */}
        {renderNode(nMap.draft_q,    branchStart)}
        {renderNode(nMap.draft_saved,branchStart + 0.15)}
        {renderNode(nMap.attach,     branchStart)}
        {renderNode(nMap.back,       branchStart + 0.15)}

        {/* Main flow arrows */}
        {[
          ['home','inbox'], ['inbox','view'], ['view','read'],
          ['read','reply'], ['reply','attach_q'],
        ].map(([a, b], i) => {
          const f = nMap[a], t = nMap[b]
          return (
            <motion.line key={`${a}-${b}`}
              x1={f.x + f.w / 2} y1={f.y}
              x2={t.type === 'diamond' ? t.x - t.w / 2 : t.x - t.w / 2} y2={t.y}
              stroke="#1A1A1A" strokeWidth={1.5} markerEnd="url(#arr-rr)"
              {...arrowAnim(arrowDelay(i))}
            />
          )
        })}

        {/* attach_q → Send (No) */}
        <motion.line
          x1={nMap.attach_q.x + nMap.attach_q.w / 2} y1={nMap.attach_q.y}
          x2={nMap.send.x - nMap.send.w / 2} y2={nMap.send.y}
          stroke="#1A1A1A" strokeWidth={1.5} markerEnd="url(#arr-rr)"
          {...arrowAnim(arrowDelay(5))}
        />
        <motion.text
          x={(nMap.attach_q.x + nMap.attach_q.w / 2 + nMap.send.x - nMap.send.w / 2) / 2}
          y={nMap.attach_q.y - 10} style={edgeLabelStyle}
          {...labelAnim(arrowDelay(5) + 0.2)}
        >No</motion.text>

        {/* Branch: Write Reply → (Back) → Save Draft? */}
        <motion.line
          x1={nMap.reply.x} y1={nMap.reply.y + nMap.reply.h / 2}
          x2={nMap.draft_q.x} y2={nMap.draft_q.y - nMap.draft_q.h / 2}
          stroke="#1A1A1A" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#arr-rr)"
          {...branchArrowAnim(branchStart + 0.05)}
        />
        <motion.text
          x={(nMap.reply.x + nMap.draft_q.x) / 2 - 16}
          y={(nMap.reply.y + nMap.reply.h / 2 + nMap.draft_q.y - nMap.draft_q.h / 2) / 2}
          style={edgeLabelStyle} {...labelAnim(branchStart + 0.25)}
        >Back</motion.text>

        {/* Branch: Save Draft? → Draft Saved (points left) */}
        <motion.line
          x1={nMap.draft_q.x - nMap.draft_q.w / 2} y1={nMap.draft_q.y}
          x2={nMap.draft_saved.x + nMap.draft_saved.w / 2} y2={nMap.draft_saved.y}
          stroke="#1A1A1A" strokeWidth={1.5} markerEnd="url(#arr-rr)"
          {...branchArrowAnim(branchStart + 0.2)}
        />
        <motion.text
          x={(nMap.draft_q.x - nMap.draft_q.w / 2 + nMap.draft_saved.x + nMap.draft_saved.w / 2) / 2}
          y={nMap.draft_q.y - 10} style={edgeLabelStyle}
          {...labelAnim(branchStart + 0.35)}
        >Yes</motion.text>

        {/* Branch: attach_q → Attach File (Yes, down) */}
        <motion.line
          x1={nMap.attach_q.x} y1={nMap.attach_q.y + nMap.attach_q.h / 2}
          x2={nMap.attach.x} y2={nMap.attach.y - nMap.attach.h / 2}
          stroke="#1A1A1A" strokeWidth={1.5} markerEnd="url(#arr-rr)"
          {...branchArrowAnim(branchStart + 0.05)}
        />
        <motion.text
          x={nMap.attach_q.x + 14}
          y={(nMap.attach_q.y + nMap.attach_q.h / 2 + nMap.attach.y - nMap.attach.h / 2) / 2}
          style={edgeLabelStyle} {...labelAnim(branchStart + 0.25)}
        >Yes</motion.text>

        {/* Branch: Attach File → Back */}
        <motion.line
          x1={nMap.attach.x - nMap.attach.w / 2} y1={nMap.attach.y}
          x2={nMap.back.x + nMap.back.w / 2} y2={nMap.back.y}
          stroke="#1A1A1A" strokeWidth={1.5} markerEnd="url(#arr-rr)"
          {...branchArrowAnim(branchStart + 0.2)}
        />

        {/* Branch: Back → Write Reply (curved, dashed) */}
        <motion.path
          d={`M${nMap.back.x},${nMap.back.y - nMap.back.h / 2} C${nMap.back.x},${nMap.back.y - 60} ${nMap.reply.x},${nMap.reply.y + 60} ${nMap.reply.x},${nMap.reply.y + nMap.reply.h / 2}`}
          fill="none" stroke="#1A1A1A" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#arr-rr)"
          {...branchArrowAnim(branchStart + 0.3)}
        />

        {/* Branch: Attach File → Send Message */}
        <motion.path
          d={`M${nMap.attach.x + nMap.attach.w / 2},${nMap.attach.y} L${nMap.send.x},${nMap.attach.y} L${nMap.send.x},${nMap.send.y + nMap.send.h / 2}`}
          fill="none" stroke="#1A1A1A" strokeWidth={1.5} markerEnd="url(#arr-rr)"
          {...branchArrowAnim(branchStart + 0.25)}
        />
      </svg>
    </div>
  )
}

// ─── Main ────────────────────────────────────────────────────────────────────
// ─── Competitive Analysis Matrix ──────────────────────────────────────────────
function CompetitiveMatrix() {
  const apps = ['Legacy Q2', 'iMessage', 'Gmail', 'Slack', 'WhatsApp']
  const criteria = [
    { label: 'Chat-style threading',         vals: [false, true,  false, true,  true  ] },
    { label: 'Visible read/unread state',    vals: [false, true,  true,  true,  true  ] },
    { label: 'In-thread reply action',       vals: [false, true,  true,  true,  true  ] },
    { label: 'Alert / message separation',   vals: [false, false, true,  true,  false ] },
    { label: 'Header-anchored compose',      vals: [false, true,  true,  true,  false ] },
    { label: 'Audit trail / compliance',     vals: [true,  false, false, false, false ] },
    { label: 'Encrypted / secure channel',   vals: [true,  true,  false, false, true  ] },
  ]
  const COL = [120, 88, 88, 88, 88, 88]
  const totalW = COL.reduce((a, b) => a + b, 0) + 24
  const ROW_H = 36, HEAD_H = 44, PAD = 12
  const H = HEAD_H + criteria.length * ROW_H + PAD * 2
  return (
    <div className="overflow-x-auto rounded-2xl border border-ink/10 bg-white">
      <svg viewBox={`0 0 ${totalW} ${H}`} style={{ minWidth: 480, width: '100%', height: 'auto', display: 'block' }}>
        {/* Header row */}
        <rect x={0} y={0} width={totalW} height={HEAD_H} fill={ACCENT + '18'} />
        {apps.map((app, ci) => {
          const x = COL.slice(0, ci + 1).reduce((a, b) => a + b, PAD)
          const isLegacy = ci === 0
          return (
            <text key={app} x={x + COL[ci + 1] / 2 - (ci === 0 ? COL[1] / 2 : 0)}
              y={HEAD_H / 2 + 4}
              fontFamily="system-ui,sans-serif" fontSize="10.5" fontWeight="700"
              fill={isLegacy ? '#E8A0B0' : 'rgba(26,26,26,0.7)'}
              textAnchor={ci === 0 ? 'start' : 'middle'}>
              {app}
            </text>
          )
        })}
        {/* Criteria rows */}
        {criteria.map((row, ri) => {
          const y = HEAD_H + ri * ROW_H
          const isEven = ri % 2 === 0
          return (
            <g key={ri}>
              {isEven && <rect x={0} y={y} width={totalW} height={ROW_H} fill="rgba(26,26,26,0.025)" />}
              <text x={PAD} y={y + ROW_H / 2 + 4}
                fontFamily="system-ui,sans-serif" fontSize="10.5" fill="rgba(26,26,26,0.65)">{row.label}</text>
              {row.vals.map((v, ci) => {
                const x = COL[0] + PAD + ci * COL[1] + COL[1] / 2
                return (
                  <text key={ci} x={x} y={y + ROW_H / 2 + 4}
                    fontFamily="system-ui,sans-serif" fontSize="13"
                    fill={v ? '#4CAF82' : 'rgba(26,26,26,0.2)'}
                    textAnchor="middle" dominantBaseline="middle">
                    {v ? '✓' : '-'}
                  </text>
                )
              })}
            </g>
          )
        })}
        {/* Column divider after label col */}
        <line x1={COL[0] + PAD / 2} y1={0} x2={COL[0] + PAD / 2} y2={H}
          stroke="rgba(26,26,26,0.08)" strokeWidth="1" />
        {/* Legacy Q2 column shading */}
        <rect x={COL[0] + PAD / 2} y={HEAD_H} width={COL[1]} height={H - HEAD_H}
          fill="#E8A0B010" />
        {/* New Q2 column highlight */}
        <rect x={COL[0] + PAD / 2 + COL[1]} y={0} width={0} height={0} fill="none" />
      </svg>
      <p className="font-sans text-[9.5px] text-ink/35 px-4 pb-3 leading-relaxed">
        Competitive audit against modern messaging conventions. Legacy Q2 met compliance requirements but failed on all core usability conventions. The redesign targeted the usability gap while preserving the compliance differentiators.
      </p>
    </div>
  )
}

// ─── Key Design Decisions ─────────────────────────────────────────────────────
function KeyDesignDecisions() {
  const decisions = [
    {
      num: '01',
      title: 'Tabbed inbox: Messages / Alerts / Drafts',
      considered: 'Flat unified list, all message types in one view, filtered by date',
      chose: 'Three-tab navigation separating human messages, system alerts, and drafts',
      why: 'A known compliance constraint shaped this: system-generated alerts (fraud notifications, account changes) carry a different legal status than human-initiated messages and must be acknowledged separately. The flat list was also the primary source of the "I missed a fraud alert" failure pattern. Tabs solve both problems, mental model clarity for users, and a defensible separation for audit purposes. The tab pattern also aligned with native platform conventions users already knew from Gmail and Slack.',
    },
    {
      num: '02',
      title: 'Thread-based layout over email inbox metaphor',
      considered: 'Retain email-style inbox: subject line list → full message view',
      chose: 'Chat-style thread layout: message bubbles with persistent context and inline reply',
      why: 'Competitive analysis against iMessage, WhatsApp, and Slack established that virtually all users have a deeply trained mental model around chat-style threading. Texting is universal, not generational. The email-inbox metaphor felt foreign immediately, before any interaction, a clear mismatch between the system and the real-world model users carry. Threading also removed the hidden-actions problem: in a chat layout, reply and archive affordances have natural spatial homes that require no discovery.',
    },
    {
      num: '03',
      title: 'Type-weight unread differentiation (not color alone)',
      considered: 'Color-only unread indicator, colored dot or colored row background',
      chose: 'Bold type weight for unread messages + secondary color indicator',
      why: 'WCAG 2.1 AA requires that information conveyed by color also be conveyed by another means. Color-only unread states fail for roughly 8% of users with color vision deficiency. Type-weight differentiation is accessible and faster to scan, the eye picks up weight contrast before you consciously read anything. It also avoided adding visual noise to an already busy list view.',
    },
  ]
  return (
    <div className="space-y-4">
      {decisions.map((d) => (
        <div key={d.num} className="bg-white rounded-2xl border border-ink/8 p-7 grid grid-cols-1 md:grid-cols-[56px_1fr] gap-5">
          <div className="font-display text-4xl font-bold leading-none" style={{ color: `${ACCENT}30` }}>{d.num}</div>
          <div>
            <p className="font-display text-lg font-bold text-ink mb-5">{d.title}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-sans text-[10px] uppercase tracking-widest text-ink/38 mb-2">Considered</p>
                <p className="font-sans text-sm text-ink/52 leading-relaxed">{d.considered}</p>
              </div>
              <div>
                <p className="font-sans text-[10px] uppercase tracking-widest mb-2" style={{ color: ACCENT }}>Chose</p>
                <p className="font-sans text-sm text-ink/70 leading-relaxed font-medium">{d.chose}</p>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-ink/6">
              <p className="font-sans text-[10px] uppercase tracking-widest text-ink/38 mb-2">Why</p>
              <p className="font-sans text-sm text-ink/58 leading-relaxed">{d.why}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


export default function MessagingRedesign() {
  usePageMeta(
    'Secure Messaging Redesign by Stephen Hurt',
    "Redesigning a bank's main secure messaging channel for 20M+ users: chat-style threading, compliance-safe alert separation, and accessible unread states, validated at a 92.9 SUS."
  )
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 800], ['0%', '-18%'])

  return (
    <main className="bg-cream">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-0 h-screen overflow-hidden flex flex-col justify-end">
          {/* Hero background image: inset-0 so it matches homepage pill proportions */}
          <div className="absolute inset-0" style={{
            backgroundImage: `url('/images/SecureMessaging/securemessagingbgheroimage.webp')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
          }} />
        <motion.div
          className="absolute pointer-events-none"
          style={{ y: bgY, top: '-20%', bottom: '-20%', left: 0, right: 0 }}
        >
          {/* Dark overlay for legibility */}
          <div className="absolute inset-0" style={{
            background: `linear-gradient(to right, rgba(10,15,30,0.88) 0%, rgba(10,15,30,0.60) 55%, rgba(10,15,30,0.25) 100%)`,
          }} />
        </motion.div>

        <div className="relative z-10 px-8 md:px-14 pb-16 md:pb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-2 mb-7"
          >
            {['UX Research', 'Enterprise SaaS', 'Q2'].map((t) => (
              <span
                key={t}
                className="font-sans text-xs px-3 py-1.5 rounded-full border"
                style={{ borderColor: `${ACCENT}60`, color: `${ACCENT}CC` }}
              >
                {t}
              </span>
            ))}
          </motion.div>
          <div className="overflow-hidden mb-5">
            <motion.h1
              initial={{ y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black leading-[0.88]"
              style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)', color: '#F5F0E8' }}
            >
              Secure Messaging
            </motion.h1>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-lg leading-relaxed max-w-xl"
            style={{ color: 'rgba(245,240,232,0.65)' }}
          >
            Redesigning the primary trust channel in Q2's mobile banking platform, improving usability and visual quality on a platform serving 20M+ users as part of a platform-wide modernization initiative.
          </motion.p>
        </div>
      </section>

      {/* ── Content covers the fixed hero as user scrolls ────────────────── */}
      <div className="relative z-10 bg-cream">

      {/* ── TL;DR ────────────────────────────────────────────────────────── */}
      <CaseTLDR
        colors={{ text: '#1C2322', dim: 'rgba(28,35,34,0.6)', accent: '#8A6D1A', surface: '#FFFFFF', rule: 'rgba(28,35,34,0.1)' }}
        summary={`Secure Messaging is one of the highest-trust channels between a bank and its customers, and it was one of the last screens still on a decade-old, email-style paradigm. I led the redesign to chat-style threading with compliance-safe alert separation and accessible unread states, grounded in competitive analysis and validated with banking customers, then shipped it on a platform serving 20M+ users with a directional 92.9 SUS from formative testing.`}
        stats={[
          { value: '92.9', label: 'SUS: excellent range (directional, n=6)' },
          { value: '8/10', label: 'Tasks at 100% completion (n=6)' },
          { value: '20M+', label: 'Platform reach (Q2 total banking users)' },
        ]}
      />

      {/* ── Overview ─────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-14 border-b border-ink/10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {[
                { label: 'Role', value: 'Lead Product Designer, sole designer on the feature; partnered with a UX Researcher who moderated the usability study' },
                { label: 'Scope', value: 'Competitive analysis, IA, UX, UI, prototyping, dev handoff' },
                { label: 'Platform', value: 'iOS & Android (mobile-first, responsive web parity)' },
                { label: 'Outcome', value: 'SUS 92.9 · VisAWI 6.1/7 (directional, n=6) · Shipped on a platform serving 20M+ users' },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-sans text-xs tracking-widest uppercase text-ink/40 mb-2">{item.label}</p>
                  <p className="font-sans text-sm text-ink/80 leading-relaxed">{item.value}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      <article className="px-8 md:px-14 py-16">
        <div className="max-w-5xl mx-auto space-y-28">

          {/* ── 01 Strategic Context ──────────────────────────────────────── */}
          <FadeIn>
            <section>
              <SectionLabel>01 - Strategic Context</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-6 leading-tight">
                Secure Messaging is the main channel between a bank and its customers, and a lot of trust rides on it.
              </h2>
              <div className="font-sans text-base text-ink/70 leading-relaxed space-y-4 max-w-3xl">
                <p>
                  In financial services, secure messaging is wrapped up in customer support, compliance, and trust all at once. It's where users raise concerns, dispute transactions, and ask for help on sensitive account matters. Done poorly, it chips away at customer confidence. Done well, it's something a bank can actually compete on.
                </p>
                <p>
                  Q2's platform was undergoing a large-scale modernization, moving from a legacy component library to a cohesive, modern design system. Secure Messaging was one of the last surfaces still running on the old paradigm, creating visible inconsistency on a platform serving 20M+ users. This redesign was about fixing the usability and bringing the screen in line with the new design system.
                </p>
              </div>

              <div
                className="mt-8 rounded-2xl p-7 border max-w-3xl"
                style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}0d` }}
              >
                <p className="font-sans text-xs uppercase tracking-widest text-ink/40 mb-3">Scope & Intent</p>
                <p className="font-display text-lg font-bold text-ink leading-snug mb-3">
                  The goal wasn't to reinvent messaging, it was to close the gap between what users already expect and what Q2 was giving them.
                </p>
                <p className="font-sans text-sm text-ink/60 leading-relaxed">
                  Users arrive at banking apps already shaped by iMessage, WhatsApp, and Gmail. Reinventing those conventions would have added friction, not removed it. On a screen this sensitive, the right call is to meet the expectations people already have, not fight them. The whole project was about closing the gap between what users expected and what the app actually did.
                </p>
              </div>
            </section>
          </FadeIn>

          {/* ── 02 The Problem State ──────────────────────────────────────── */}
          <FadeIn>
            <section>
              <SectionLabel>02 - Problem State</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-6 leading-tight">
                An interface that created friction at exactly the wrong moment
              </h2>

              <div className="flex flex-col md:flex-row gap-10 items-start">
                {/* Before image: portrait phone screen, contained at phone size */}
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                  <p className="font-sans text-[10px] uppercase tracking-widest text-blush font-semibold">Before State</p>
                  <div className="rounded-2xl overflow-hidden border border-ink/10 shadow-sm" style={{ maxWidth: '220px' }}>
                    <img
                      src="https://framerusercontent.com/images/zP0Q4pLSw7cbmwwt16RgW9vmV50.png"
                      alt="Legacy Secure Messaging UI - compose message screen showing the outdated interface"
                      className="w-full h-auto"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Problem annotations */}
                <div className="flex-1 space-y-4">
                  <p className="font-sans text-base text-ink/70 leading-relaxed mb-6">
                    The legacy UI had a handful of usability problems that fed into each other. None were dealbreakers on their own, but together they made the experience feel dated and out of step with the rest of the platform.
                  </p>
                  {[
                    {
                      label: 'Inbox metaphor mismatch',
                      body: 'Almost everyone expects chat-style threading now, since texting is universal. The old email-inbox layout felt dated and threw people off right away, regardless of age.',
                    },
                    {
                      label: 'Inbox and compose share one screen',
                      body: 'The message list and new-message creation lived on the same screen by default. The compose form was always present, so there was no dedicated "New Message" action and no clean inbox to scan or triage. Reading and composing were never separated.',
                    },
                    {
                      label: 'Confusing labels and controls',
                      body: 'The screen was labeled "Conversations" rather than the expected "Inbox," and a "Delete multiple" control sat above the list with no clear purpose or context. Unread messages were hard to distinguish from read ones at a glance.',
                    },
                    {
                      label: 'Platform design debt',
                      body: 'Inconsistent with every other modernized surface in the app. When a screen looks this dated, users assume the technology behind it is just as old, undermining confidence in an otherwise modern platform.',
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 bg-white rounded-xl border border-ink/8 p-5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: '#E8A0B0' }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-sans text-sm font-semibold text-ink mb-1">{item.label}</p>
                        <p className="font-sans text-sm text-ink/60 leading-relaxed">{item.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </FadeIn>

          {/* ── 03 Research Approach ──────────────────────────────────────── */}
          <CollapsibleSection
            sectionLabel="03 - Research Approach"
            title="Grounding the redesign in competitor patterns and the existing flows"
          >
            <div className="font-sans text-base text-ink/70 leading-relaxed space-y-4 max-w-3xl mb-10">
              <p>
                Rather than jumping straight to redesign, I started with two inputs: a competitive analysis of the messaging apps customers already use every day, and a task analysis of the legacy flows to see exactly where the experience broke down. Together they showed whether the problems were isolated interaction issues or symptoms of a deeper information-architecture and mental-model mismatch.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                {
                  method: 'Competitive Analysis',
                  framework: 'iMessage, Gmail, Slack, WhatsApp',
                  finding: 'Established baseline expectations for modern messaging conventions, particularly around threading, read states, and action affordances.',
                },
                {
                  method: 'Task Analysis',
                  framework: 'Two primary task flows mapped',
                  finding: "Mapping the Send Message flow showed it took 6 steps, each a place someone could drop off. The complexity wasn't just a UI problem, it was baked into the structure.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-ink/8 p-6">
                  <p
                    className="font-sans text-[10px] uppercase tracking-widest mb-1"
                    style={{ color: ACCENT }}
                  >
                    Method {i + 1}
                  </p>
                  <p className="font-display text-lg font-bold text-ink mb-1">{item.method}</p>
                  <p className="font-sans text-xs text-ink/40 mb-3">{item.framework}</p>
                  <p className="font-sans text-sm text-ink/70 leading-relaxed">{item.finding}</p>
                </div>
              ))}
            </div>

            {/* Competitive matrix */}
            <div>
              <p className="font-sans text-xs tracking-widest uppercase text-ink/40 mb-1">Competitive Analysis</p>
              <p className="font-sans text-sm text-ink/55 mb-5">How legacy Q2 messaging compared against modern messaging conventions</p>
              <CompetitiveMatrix />
            </div>

            {/* Per-app competitive synthesis */}
            <div className="mt-8">
              <p className="font-sans text-xs tracking-widest uppercase text-ink/40 mb-5">What each app specifically taught</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    app: 'iMessage',
                    lesson: 'Chat-style threading isn\'t a preference, it\'s a habit people already have. Everyone arrives knowing how to read and reply in a bubble layout, so anything different just makes them work harder on a screen where trust is everything.',
                  },
                  {
                    app: 'Gmail',
                    lesson: 'Header-anchored compose (the "Compose" button pinned top-left) made intent unambiguous. Users knew immediately how to start a new conversation. The pattern also proved that alert/message separation via labels was learnable and preferred over a flat unified inbox.',
                  },
                  {
                    app: 'Slack',
                    lesson: 'Unread state is a navigation affordance, not just a visual indicator. Slack\'s bold channel names let users triage priority at a glance without entering each thread. The same logic applies directly to secure messaging: scanning the inbox should answer the question "do I need to act?" before any tap.',
                  },
                  {
                    app: 'WhatsApp',
                    lesson: 'Read receipts and timestamp placement create a shared understanding of conversation state between sender and recipient. The legacy Q2 inbox gave neither party any confirmation the message had been seen, a significant trust gap in a financial context.',
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-xl border border-ink/8 p-5">
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: ACCENT }}>{item.app}</p>
                    <p className="font-sans text-sm text-ink/65 leading-relaxed">{item.lesson}</p>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* ── 04 Task Analysis ──────────────────────────────────────────── */}
          <CollapsibleSection
            sectionLabel="04 - Task Analysis"
            title="Mapping the critical paths before touching the UI"
          >
            <p className="font-sans text-base text-ink/60 leading-relaxed max-w-3xl mb-8">
              I mapped the two main task flows, Send Message and Read/Reply, to find where things got in the way and where people were likely to give up. The Send Message flow had two decision branches (Save Draft, Attach File) that the legacy UI didn't communicate clearly, which led to a lot of mistakes in testing.
            </p>
            <div className="space-y-3">
              <div className="rounded-2xl border border-ink/10 bg-white px-4 pt-5 pb-4">
                <SendMessageFlow />
              </div>
              <div className="rounded-2xl border border-ink/10 bg-white px-4 pt-5 pb-4">
                <ReadReplyFlow />
              </div>
            </div>
            <p className="font-sans text-xs text-ink/40 mt-3 leading-relaxed">
              Top: Send Message flow, 6 screens, 2 decision branches (Save Draft, Attach File). Bottom: Read/Reply flow, 5 screens, identical branching structure. Both flows share the same Save Draft and Attachment sub-patterns, informing a shared component solution.
            </p>
          </CollapsibleSection>

          {/* ── 05 Design Exploration ─────────────────────────────────────── */}
          <CollapsibleSection
            sectionLabel="05 - Design Exploration"
            title="Two lo-fi directions, one high-stakes decision"
          >
            <p className="font-sans text-base text-ink/60 leading-relaxed max-w-3xl mb-8">
              Rather than exploring stylistic variations in wireframes, the lo-fi phase focused on a single structural question: where does the Compose action live? That one choice drove everything after it, the hierarchy, the navigation, and how people understood where to start a new message.
            </p>

            <div className="rounded-2xl overflow-hidden border border-ink/10 mb-8">
              <img
                src="https://framerusercontent.com/images/ofCjtAUflXpATkYPjsOdf4BEeW4.png"
                alt="Lo-fi wireframes - two inbox design directions across 8 screens, testing FAB vs header-anchored compose affordance"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>

            <p className="font-sans text-xs text-ink/40 mb-8 leading-relaxed">
              Top row: Direction A, the header-anchored "New Message" button. Bottom row: Direction B, a floating action button (FAB) for compose. Both directions tested against 4 selection and bulk-action states.
            </p>

            <DecisionCallout
              before="Floating Action Button (FAB) for compose"
              after="Header-anchored 'New Message' button"
              rationale="A FAB would have collided with Glia, a third-party support extension some of our financial institutions deploy that already occupies the screen with its own floating action button. Adding a second FAB for compose would crowd the same corner and create competing floating affordances. Anchoring compose to the header sidesteps the conflict entirely and gives the action a clear, fixed home, consistent with native platform conventions (iOS Mail, Gmail)."
            />
          </CollapsibleSection>

          {/* ── 06b Key Design Decisions ──────────────────────────────────── */}
          <CollapsibleSection
            sectionLabel="Key Design Decisions"
            title="Three decisions that shaped the rest of the design"
          >
            <p className="font-sans text-base text-ink/60 leading-relaxed max-w-3xl mb-10">
              The lo-fi exploration answered the compose placement question. But three other structural decisions, each with real tradeoffs, determined whether this would be a surface-level refresh or a real improvement.
            </p>
            <KeyDesignDecisions />
          </CollapsibleSection>

          {/* ── 07 Final Design ───────────────────────────────────────────── */}
          <FadeIn>
            <section>
              <SectionLabel>06 - High-Fidelity Design</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3 leading-tight">
                The final screens
              </h2>
              <p className="font-sans text-base text-ink/60 leading-relaxed max-w-3xl mb-8">
                The final design resolved the core usability failures while meeting Q2's platform design system tokens, WCAG 2.1 AA accessibility requirements, and existing engineering constraints. Key decisions: tabbed navigation to separate Messages, Alerts, and Drafts (eliminating the alert/message conflation in the legacy UI); bold unread indicators anchored to type weight, not color alone (accessibility); and a persistent header-anchored compose button.
              </p>

              {/* Compliance constraint callout */}
              <div className="rounded-2xl border border-ink/10 bg-ink/[0.025] px-6 py-5 mb-10 max-w-3xl">
                <p className="font-sans text-xs uppercase tracking-widest text-ink/40 mb-3">How compliance shaped the architecture</p>
                <p className="font-sans text-sm text-ink/65 leading-relaxed mb-3">
                  A compliance constraint shaped the architecture from the start: in financial services, system-generated alerts (fraud notifications, account changes, security notices) carry a different legal status than human-initiated messages. Institutions need to be able to demonstrate that alerts were surfaced to users in a way that's distinct and auditable. A flat unified inbox, where a fraud notice and a support message live in the same date-sorted list, makes that defensibility impossible to guarantee.
                </p>
                <p className="font-sans text-sm text-ink/65 leading-relaxed">
                  Tabs solved both problems at once. The main UX failure from research (users missing fraud alerts in a noisy flat list) and the compliance requirement (provable, auditable alert separation) had the same answer. Because both pointed the same way, the tab decision was easy to defend internally, it wasn't a design preference, it was the only structure that handled both at once.
                </p>
              </div>

              {/* Final screens grid: inbox (2 tabs) + message thread */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start mb-5">

                {/* Inbox: Messages + Alerts tabs (takes 2 cols) */}
                <div className="md:col-span-2 rounded-2xl overflow-hidden border border-ink/10">
                  <img
                    src="https://framerusercontent.com/images/N3pHw4bLRjpReT7DP12M1jb5zw.png"
                    alt="High-fidelity inbox - Messages tab (left) and Alerts tab (right)"
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>

                {/* Final approved message thread: cropped to rightmost screen only */}
                <div
                  className="rounded-2xl overflow-hidden border border-ink/10"
                  style={{ aspectRatio: '876/1864' }}
                >
                  <img
                    src="https://framerusercontent.com/images/88YUQoETFOYmEKoNUaZzxipzI.png"
                    alt="Final approved message thread design"
                    className="w-full h-full"
                    style={{ objectFit: 'cover', objectPosition: 'right center' }}
                    loading="lazy"
                  />
                </div>

              </div>
              <p className="font-sans text-xs text-ink/40 leading-relaxed mb-10">
                Inbox: Messages tab and Alerts tab (left). Tabbed navigation replaces the legacy flat list; unread states use type-weight, not color alone. Message thread: final approved reply flow with chat-style layout and fully discoverable action affordances (right).
              </p>

              <div className="rounded-2xl border border-ink/10 bg-ink/[0.025] px-6 py-5 max-w-3xl">
                <p className="font-sans text-xs uppercase tracking-widest text-ink/40 mb-2">A note on visual styling</p>
                <p className="font-sans text-sm text-ink/65 leading-relaxed">
                  Q2's platform is fully white-labeled: every financial institution that ships on it applies their own brand tokens, colors, and typography on top of the base system. What you're seeing here is the intentionally neutral out-of-box state. The real design work is in how it behaves, how it's organized, and the components underneath, not the colors on top. A community bank in Montana and a credit union in California will each make this look like their own product.
                </p>
              </div>
            </section>
          </FadeIn>

          {/* ── 08 Validation ─────────────────────────────────────────────── */}
          <FadeIn>
            <section>
              <SectionLabel>07 - Usability Validation</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3 leading-tight">
                Moderated prototype testing against a structured 10-task protocol
              </h2>
              <p className="font-sans text-base text-ink/60 leading-relaxed max-w-3xl mb-8">
                Before engineering handoff, our UX Researcher moderated usability sessions with <strong className="text-ink/80">6 banking customers</strong> using a Figma prototype I built, recruited from Q2's existing customer base, all active users of online banking with no prior exposure to the redesigned interface. I observed every session and synthesized the findings into design changes. Six participants is Q2's standard sample for formative usability studies, consistent with Nielsen Norman Group's research showing that 5 participants surface approximately 85% of critical usability issues. Sessions used a think-aloud protocol, covering reading, replying, searching, deleting, managing alerts, and navigating to compose and drafts across 10 structured task scenarios. SUS and VisAWI were captured as directional benchmarks at the close of each session.
              </p>

              {/* Test doc: landscape (2904×1628) */}
              <div className="rounded-2xl overflow-hidden border border-ink/10 mb-10">
                <img
                  src="https://framerusercontent.com/images/fkBYScV70fH9B02zx5CdlpPgv8.png"
                  alt="Usability test task overview - 10 tasks covering inbox navigation, compose, reply, search, delete, and drafts"
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>

              {/* Metric cards: 2 only, participant count buried in text above */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <MetricCard
                  value="92.9"
                  label="SUS Score"
                  sub="System Usability Scale. 92.92 average, 'Excellent' range (above 80.3). 95% CI 81.6 to 100. Directional at n=6, not a powered estimate."
                />
                <MetricCard
                  value="6.1/7"
                  label="VisAWI Score"
                  sub="Visual Aesthetics of Websites Inventory. 6.1 average (95% CI 5.6 to 6.7), above Q2's internal threshold of 6."
                />
              </div>

              {/* Per-task results, full breakdown from the readout */}
              <div className="mb-10">
                <p className="font-sans text-xs tracking-widest uppercase text-ink/40 mb-1">Per-task results</p>
                <p className="font-sans text-sm text-ink/55 mb-4">Completion and single-ease (SEQ) across all 10 tasks, n=6</p>
                <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-ink/[0.03]">
                        <th className="font-sans text-[10px] uppercase tracking-widest text-ink/40 px-5 py-3">Task</th>
                        <th className="font-sans text-[10px] uppercase tracking-widest text-ink/40 px-5 py-3">Completion</th>
                        <th className="font-sans text-[10px] uppercase tracking-widest text-ink/40 px-5 py-3">SEQ (out of 7)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['1. Go to inbox', '100%', '6.7'],
                        ['2. View the message', '100%', '6.8'],
                        ['3. Reply with an attachment', '100%', '7.0'],
                        ['4. Search for a message', '100%', '6.8'],
                        ['5. Delete the message', '100%', '6.8'],
                        ['6. View alerts (find the Alerts tab)', '66.7%', '5.2'],
                        ['7. Delete all alerts', '100%', '6.7'],
                        ['8. Delete a few messages', '100%', '6.3'],
                        ['9. Contact support (new-message button)', '66.7%', '5.5'],
                        ['10. Find drafts', '100%', '6.5'],
                      ].map(([t, c, s], i) => {
                        const miss = c !== '100%'
                        return (
                          <tr key={i} className="border-t border-ink/8">
                            <td className="font-sans text-sm text-ink/75 px-5 py-3.5 align-top">{t}</td>
                            <td className="font-sans text-sm font-semibold px-5 py-3.5 align-top" style={{ color: miss ? '#B7791F' : '#1C2322' }}>{c}</td>
                            <td className="font-sans text-sm text-ink/60 px-5 py-3.5 align-top">{s}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="font-sans text-xs text-ink/40 mt-3 leading-relaxed">
                  8 of 10 tasks reached 100% completion. The two exceptions were navigation tasks: finding the Alerts tab and the new-message button.
                </p>
              </div>

              <div
                className="rounded-2xl p-7 border"
                style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}0d` }}
              >
                <p className="font-sans text-xs uppercase tracking-widest text-ink/40 mb-3">Validation Outcome</p>
                <p className="font-display text-xl font-bold text-ink leading-snug mb-3">
                  Eight of the ten tasks hit 100% completion with no assistance. The two that fell to 66.7% were both findability tasks: locating the Alerts tab and the new-message button.
                </p>
                <p className="font-sans text-sm text-ink/60 leading-relaxed max-w-2xl">
                  The SUS score of 92.9 placed the redesign in the "Excellent" category, well above the 68-point industry average and the 80-point threshold commonly considered "good." The VisAWI score confirmed that visual improvements mapped directly to perceived credibility and trustworthiness, meaningful signals in a financial services context. The intention is to supplement this with a longitudinal follow-up study post-launch to validate whether the mental model holds for low-frequency users over time.
                </p>
              </div>

              {/* What testing surfaced */}
              <div className="mt-10">
                <p className="font-sans text-xs tracking-widest uppercase text-ink/40 mb-4">What testing surfaced</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-ink/8 p-6">
                    <p className="font-sans text-sm font-semibold text-ink mb-2">Alerts were buried</p>
                    <p className="font-sans text-sm text-ink/60 leading-relaxed">
                      Two of six participants opened the global menu before finding the Alerts tab, and several said they expected alerts to surface on the home screen rather than inside the inbox. A signal that high-importance alerts may need more prominent placement.
                    </p>
                  </div>
                  <div className="bg-white rounded-2xl border border-ink/8 p-6">
                    <p className="font-sans text-sm font-semibold text-ink mb-2">"New Message" was hard to find</p>
                    <p className="font-sans text-sm text-ink/60 leading-relaxed">
                      When asked to contact support, two of six went to the menu instead of the new-message button. This directly informed the late decision to relabel the default action "Contact Us," clearer intent for a customer-to-bank channel (see the handoff note below).
                    </p>
                  </div>
                </div>
              </div>

              {/* Alternative alerts A/B */}
              <div className="mt-4 bg-white rounded-2xl border border-ink/8 p-6">
                <p className="font-sans text-sm font-semibold text-ink mb-2">Alert styling: an A/B the users settled</p>
                <p className="font-sans text-sm text-ink/60 leading-relaxed max-w-3xl">
                  The sessions also tested two versions of the Alerts tab: one with a warning-triangle icon on security and fraud alerts, one without. All six participants preferred the version with the icons. Without them, security alerts blended into routine notifications and didn't read as urgent, and one participant said the icon-less version "almost looked like the Messages page." The icon variant shipped.
                </p>
              </div>
            </section>
          </FadeIn>

          {/* ── 09 Dev Handoff ────────────────────────────────────────────── */}
          <CollapsibleSection
            sectionLabel="08 - Engineering Handoff"
            title="Spec documentation built for implementation speed and design fidelity"
          >
            <p className="font-sans text-base text-ink/60 leading-relaxed max-w-3xl mb-8">
              Handoff documentation covered component anatomy, spacing system, interactive states, and responsive breakpoint behavior. Each component was documented at the atomic level, cross-referenced to Q2's design system tokens to reduce engineering interpretation overhead and minimize back-and-forth during implementation.
            </p>

            {/* Dev handoff: extremely tall (5219×8906), contained in scrollable wrapper */}
            <div
              className="rounded-2xl overflow-hidden border border-ink/10"
              style={{ maxHeight: '700px', overflowY: 'auto' }}
            >
              <img
                src="https://framerusercontent.com/images/xfoK5UvV7HnWkoVwrJTQT4focs.png"
                alt="Full engineering handoff specification - component anatomy, spacing system, and interactive states documented at the atomic level"
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
            <p className="font-sans text-xs text-ink/40 mt-3 leading-relaxed">
              Scroll to view full spec document. Covers component anatomy (top) and spacing system (below) across all inbox and message-thread states.
            </p>

            <div className="rounded-2xl border border-ink/10 bg-ink/[0.025] px-6 py-5 max-w-3xl mt-6">
              <p className="font-sans text-xs uppercase tracking-widest text-ink/40 mb-2">A late copy decision</p>
              <p className="font-sans text-sm text-ink/65 leading-relaxed">
                Through design, the primary action read "New Message" (visible in the earlier wireframes). Shortly before handoff, the product owner and I changed the default label to "Contact Us." For a customer-to-bank channel, it states the intent more plainly than a generic compose verb. The label is customer-configurable, and "Contact Us" is simply the out-of-box default, which is why the shipped spec above shows it.
              </p>
            </div>
          </CollapsibleSection>

          {/* ── 10 Outcomes ───────────────────────────────────────────────── */}
          <FadeIn>
            <section>
              <SectionLabel>09 - Outcomes & Systems Impact</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-6 leading-tight">
                Shipped, and brought in line with the rest of the platform.
              </h2>

              <div className="font-sans text-base text-ink/70 leading-relaxed space-y-4 max-w-3xl mb-10">
                <p>
                  The shipped redesign replaced a surface that had gone largely untouched for over a decade, bringing this screen in line with the rest of Q2's modernized platform, which serves 20M+ banking users. Design took three months. Engineering delivery took five, with development balanced against a full product roadmap, the standard reality of enterprise SaaS.
                </p>
                <p>
                  The patterns established here (tabbed separation of alerts from messages, chat-style threading, and header-anchored compose) set a structural reference for how inbox-style surfaces in the platform should behave going forward.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                {[
                  {
                    label: 'Scale',
                    value: '20M+',
                    detail: 'Total banking users across Q2\'s client network; the redesign ships on this platform',
                  },
                  {
                    label: 'SUS Benchmark',
                    value: 'Excellent',
                    detail: 'Directional 92.9 SUS (n=6) sits in the excellent range against industry data sets; formative, not a powered estimate',
                  },
                  {
                    label: 'Dev Cycle',
                    value: '5 Mo.',
                    detail: 'Engineering delivery from design handoff to production, balanced against a full sprint roadmap',
                  },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-2xl border border-ink/8 p-6 text-center">
                    <p className="font-sans text-xs uppercase tracking-widest text-ink/40 mb-2">{item.label}</p>
                    <p className="font-display text-4xl font-bold mb-2" style={{ color: ACCENT }}>{item.value}</p>
                    <p className="font-sans text-xs text-ink/55 leading-snug">{item.detail}</p>
                  </div>
                ))}
              </div>
            </section>
          </FadeIn>

          {/* ── 11 Reflection ─────────────────────────────────────────────── */}
          <FadeIn>
            <section>
              <SectionLabel>10 - Reflection</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-6 leading-tight">
                What I'd dig into more next time
              </h2>

              <div className="font-sans text-base text-ink/70 leading-relaxed space-y-4 max-w-3xl mb-8">
                <p>
                  My pre-design research leaned heavily on competitive analysis and my own read of the flows. I'd want to front-load more generative user research earlier, particularly around how banking customers mentally model "secure" communication versus generic messaging, rather than relying on the validation round to confirm direction after the fact.
                </p>
                <p>
                  I'd also push harder on longitudinal validation. A single-session prototype test can tell you whether a design is navigable. It can't tell you whether the new mental model is durable over time, especially for infrequent users who might interact with Secure Messaging only once or twice a year.
                </p>
              </div>

              <div
                className="rounded-2xl p-7 border"
                style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}0d` }}
              >
                <p className="font-sans text-xs uppercase tracking-widest text-ink/40 mb-3">What I'd Do Differently</p>
                <ul className="space-y-3">
                  {[
                    'Involve compliance and accessibility stakeholders in the initial research brief, not as late-stage reviewers, but as constraint-definers who shape the problem space from day one',
                    'Run a longitudinal follow-up study 60-90 days post-launch: specifically tracking message thread abandonment rate, time-to-first-reply, and task completion confidence for users who interact with Secure Messaging fewer than four times per year, the segment most likely to lose the mental model between sessions',
                    'Document the pattern rationale in the design system, not just what the pattern is, but why it was chosen and under what conditions it should be deviated from, so future designers inherit the decision logic, not just the decision',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 font-sans text-sm text-ink/70 leading-snug">
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: ACCENT }}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </FadeIn>

        </div>
      </article>

      {/* ── Next Project ─────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-20 border-t border-ink/10">
        <div className="max-w-5xl mx-auto">
          <p className="font-sans text-xs tracking-widest uppercase text-ink/40 mb-4">Next Project</p>
          <NextProjectLink to="/interstitial" title="Interstitial" />
        </div>
      </section>

      </div>{/* end content-over-hero wrapper */}
    </main>
  )
}
