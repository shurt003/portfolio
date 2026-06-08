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

// ─── Finding Card ─────────────────────────────────────────────────────────────
function FindingCard({ number, heuristic, failure, severity }) {
  const severityColor = {
    Critical: '#E8A0B0',
    Major: ACCENT,
    Moderate: '#7B9EC7',
  }[severity] || ACCENT

  return (
    <div className="bg-white rounded-2xl border border-ink/8 p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-white text-sm flex-shrink-0"
          style={{ backgroundColor: severityColor }}
        >
          {number}
        </div>
        <span
          className="font-sans text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ backgroundColor: severityColor + '20', color: severityColor }}
        >
          {severity}
        </span>
      </div>
      <p className="font-sans text-[10px] uppercase tracking-widest text-ink/40 mb-1">{heuristic}</p>
      <p className="font-sans text-sm text-ink/75 leading-relaxed">{failure}</p>
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
    { id: 'back',       x: 820,  y: 210, w: 68,  h: 30, type: 'term',    label: 'Back' },
    { id: 'draft_q',    x: 200,  y: 210, w: 56,  h: 56, type: 'diamond', label: ['Save','Draft?'] },
    { id: 'draft_saved',x: 350,  y: 210, w: 100, h: 36, type: 'rect',    label: 'Draft Saved' },
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

        {/* Branch: Inbox → Save Draft? */}
        <motion.line
          x1={nMap.inbox.x} y1={nMap.inbox.y + nMap.inbox.h / 2}
          x2={nMap.draft_q.x} y2={nMap.draft_q.y - nMap.draft_q.h / 2}
          stroke="#1A1A1A" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#arr-send)"
          {...branchArrowAnim(branchStart + 0.05)}
        />
        <motion.text
          x={nMap.inbox.x + 14}
          y={(nMap.inbox.y + nMap.inbox.h / 2 + nMap.draft_q.y - nMap.draft_q.h / 2) / 2}
          style={edgeLabelStyle} {...labelAnim(branchStart + 0.25)}
        >Save Draft?</motion.text>

        {/* Branch: Save Draft? → Draft Saved */}
        <motion.line
          x1={nMap.draft_q.x + nMap.draft_q.w / 2} y1={nMap.draft_q.y}
          x2={nMap.draft_saved.x - nMap.draft_saved.w / 2} y2={nMap.draft_saved.y}
          stroke="#1A1A1A" strokeWidth={1.5} markerEnd="url(#arr-send)"
          {...branchArrowAnim(branchStart + 0.2)}
        />
        <motion.text
          x={(nMap.draft_q.x + nMap.draft_q.w / 2 + nMap.draft_saved.x - nMap.draft_saved.w / 2) / 2}
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
    { id: 'attach',     x: 790,  y: 210, w: 104, h: 36, type: 'rect',    label: 'Attach File' },
    { id: 'back',       x: 650,  y: 210, w: 68,  h: 30, type: 'term',    label: 'Back' },
    { id: 'draft_q',    x: 200,  y: 210, w: 56,  h: 56, type: 'diamond', label: ['Save','Draft?'] },
    { id: 'draft_saved',x: 350,  y: 210, w: 100, h: 36, type: 'rect',    label: 'Draft Saved' },
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

        {/* Branch: Inbox → Save Draft? */}
        <motion.line
          x1={nMap.inbox.x} y1={nMap.inbox.y + nMap.inbox.h / 2}
          x2={nMap.draft_q.x} y2={nMap.draft_q.y - nMap.draft_q.h / 2}
          stroke="#1A1A1A" strokeWidth={1.5} strokeDasharray="4 3" markerEnd="url(#arr-rr)"
          {...branchArrowAnim(branchStart + 0.05)}
        />
        <motion.text
          x={nMap.inbox.x + 14}
          y={(nMap.inbox.y + nMap.inbox.h / 2 + nMap.draft_q.y - nMap.draft_q.h / 2) / 2}
          style={edgeLabelStyle} {...labelAnim(branchStart + 0.25)}
        >Save Draft?</motion.text>

        {/* Branch: Save Draft? → Draft Saved */}
        <motion.line
          x1={nMap.draft_q.x + nMap.draft_q.w / 2} y1={nMap.draft_q.y}
          x2={nMap.draft_saved.x - nMap.draft_saved.w / 2} y2={nMap.draft_saved.y}
          stroke="#1A1A1A" strokeWidth={1.5} markerEnd="url(#arr-rr)"
          {...branchArrowAnim(branchStart + 0.2)}
        />
        <motion.text
          x={(nMap.draft_q.x + nMap.draft_q.w / 2 + nMap.draft_saved.x - nMap.draft_saved.w / 2) / 2}
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
// ─── Research Synthesis Map ───────────────────────────────────────────────────
function ResearchSynthesisMap() {
  const themes = [
    {
      label: 'Can\'t tell what\'s been read',
      pct: 1.0,
      quote: '"I open every message just to check if it\'s new. I can\'t tell from the list."',
    },
    {
      label: 'Can\'t find where to reply',
      pct: 0.88,
      quote: '"I scrolled all the way down looking for a reply button. I gave up and called."',
    },
    {
      label: 'Confused by email-style layout',
      pct: 0.75,
      quote: '"This feels like old email. I expected it to look like my texts."',
    },
    {
      label: 'Alerts mixed with messages',
      pct: 0.63,
      quote: '"I missed a fraud alert because I thought it was a promotional message."',
    },
  ]
  const W = 580, H = 280, PAD = 20, LABW = 188, BARX = LABW + PAD + 16, BARW = W - BARX - PAD - 56
  return (
    <div className="rounded-2xl border border-ink/10 bg-white overflow-hidden">
      <div className="px-6 pt-5 pb-2 border-b border-ink/8" style={{ background: `${ACCENT}10` }}>
        <p className="font-sans text-[10px] uppercase tracking-widest font-semibold text-ink/55">User Research - Theme Frequency</p>
        <p className="font-sans text-xs text-ink/40 mt-0.5">Synthesized from moderated sessions with banking customers</p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {themes.map((t, i) => {
          const y = PAD + i * 58 + 24
          const bw = BARW * t.pct
          return (
            <g key={i}>
              <text x={LABW} y={y - 2} textAnchor="end"
                fontFamily="system-ui,sans-serif" fontSize="11" fontWeight="600" fill="rgba(26,26,26,0.72)">{t.label}</text>
              <rect x={BARX} y={y - 10} width={BARW} height={16} rx="4" fill="rgba(26,26,26,0.05)" />
              <rect x={BARX} y={y - 10} width={bw} height={16} rx="4" fill={ACCENT} opacity="0.85" />
              <text x={BARX + bw + 7} y={y + 2}
                fontFamily="system-ui,sans-serif" fontSize="10" fontWeight="700" fill={ACCENT}>{Math.round(t.pct * 100)}%</text>
              <text x={BARX} y={y + 20}
                fontFamily="system-ui,sans-serif" fontSize="9.5" fontStyle="italic" fill="rgba(26,26,26,0.42)">{t.quote}</text>
            </g>
          )
        })}
        <text x={BARX} y={H - 8}
          fontFamily="system-ui,sans-serif" fontSize="8.5" fill="rgba(26,26,26,0.28)">
          Synthesized from moderated usability sessions · banking customer demographics · Q2 platform
        </text>
      </svg>
    </div>
  )
}

// ─── Competitive Analysis Matrix ──────────────────────────────────────────────
function CompetitiveMatrix() {
  const apps = ['Legacy Q2', 'iMessage', 'Gmail', 'Slack', 'WhatsApp']
  const criteria = [
    { label: 'Chat-style threading',         vals: [false, true,  true,  true,  true  ] },
    { label: 'Visible read/unread state',    vals: [false, true,  true,  true,  true  ] },
    { label: 'In-thread reply action',       vals: [false, true,  true,  true,  true  ] },
    { label: 'Alert / message separation',   vals: [false, false, true,  true,  false ] },
    { label: 'Header-anchored compose',      vals: [false, false, true,  true,  false ] },
    { label: 'Audit trail / compliance',     vals: [true,  false, false, false, false ] },
    { label: 'Encrypted / secure channel',   vals: [true,  false, false, false, true  ] },
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
      why: 'Stakeholder interviews surfaced a compliance requirement that system-generated alerts (fraud notifications, account changes) carry a different legal status than human-initiated messages and must be acknowledged separately. The flat list was also the primary source of the "I missed a fraud alert" failure pattern. Tabs solve both problems, mental model clarity for users, and a defensible separation for audit purposes. The tab pattern also aligned with native platform conventions users already knew from Gmail and Slack.',
    },
    {
      num: '02',
      title: 'Thread-based layout over email inbox metaphor',
      considered: 'Retain email-style inbox: subject line list → full message view',
      chose: 'Chat-style thread layout: message bubbles with persistent context and inline reply',
      why: 'Competitive analysis against iMessage, WhatsApp, and Slack established that virtually all users have a deeply trained mental model around chat-style threading - texting is universal, not generational. The email-inbox metaphor felt foreign immediately, before any interaction. The heuristic evaluation flagged this as a Critical violation (H2: Match Between System and Real World). Threading also eliminated the hidden-actions problem, in a chat layout, reply and archive affordances have natural spatial homes that require no discovery.',
    },
    {
      num: '03',
      title: 'Type-weight unread differentiation (not color alone)',
      considered: 'Color-only unread indicator, colored dot or colored row background',
      chose: 'Bold type weight for unread messages + secondary color indicator',
      why: 'WCAG 2.1 AA requires that information conveyed by color also be conveyed by another means. Color-only unread states fail for roughly 8% of users with color vision deficiency. Type-weight differentiation is both accessible and perceptually faster, weight contrast registers preattentively, before conscious reading begins. This also avoided adding visual noise to an already information-dense list view.',
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

// ─── Before / After Heuristic Baseline ───────────────────────────────────────
function HeuristicBaseline() {
  const rows = [
    { heuristic: 'H1 - Visibility of System Status', legacy: 'Critical', redesign: 'Resolved' },
    { heuristic: 'H2 - Match: System & Real World',  legacy: 'Critical', redesign: 'Resolved' },
    { heuristic: 'H3 - Recognition vs. Recall',      legacy: 'Major',    redesign: 'Resolved' },
    { heuristic: 'H4 - Aesthetic & Minimalist Design',legacy: 'Major',    redesign: 'Resolved' },
  ]
  const sevColor = { Critical: '#E8A0B0', Major: ACCENT, Resolved: '#4CAF82' }
  return (
    <div className="rounded-2xl border border-ink/10 overflow-hidden bg-white">
      <div className="grid grid-cols-3 bg-ink/[0.03] border-b border-ink/8">
        {['Heuristic', 'Legacy State', 'Redesign'].map((h) => (
          <div key={h} className="px-5 py-3">
            <p className="font-sans text-[10px] uppercase tracking-widest text-ink/40 font-semibold">{h}</p>
          </div>
        ))}
      </div>
      {rows.map((r, i) => (
        <div key={i} className={`grid grid-cols-3 border-b border-ink/6 ${i % 2 === 0 ? '' : 'bg-ink/[0.015]'}`}>
          <div className="px-5 py-4">
            <p className="font-sans text-sm text-ink/70">{r.heuristic}</p>
          </div>
          <div className="px-5 py-4 flex items-center">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ backgroundColor: sevColor[r.legacy] + '22', color: sevColor[r.legacy] }}>
              {r.legacy}
            </span>
          </div>
          <div className="px-5 py-4 flex items-center">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ backgroundColor: sevColor[r.redesign] + '22', color: sevColor[r.redesign] }}>
              ✓ {r.redesign}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Pattern Documentation ────────────────────────────────────────────────────
function PatternDocumentation() {
  const patterns = [
    {
      name: 'Tabbed Inbox Navigation',
      usage: 'Any feature area with multiple message or notification types requiring distinct user intent',
      rule: 'Separate human-initiated messages from system-generated alerts at the navigation level, never in a flat unified list',
      where: 'Applied to: Secure Messaging. Structural reference for future inbox-style feature areas.',
      color: ACCENT,
    },
    {
      name: 'Contextual Action Menu (Long-Press)',
      usage: 'List items where destructive or secondary actions (archive, delete, flag) exist',
      rule: 'Surface contextual actions via long-press on the item itself, not in a separate action bar or hidden behind a "..." menu that requires discovery',
      where: 'Applied to: Secure Messaging threads. A defined pattern for any list view where secondary actions exist.',
      color: '#7B9EC7',
    },
    {
      name: 'Header-Anchored Primary Action',
      usage: 'List views with a single dominant "create new object" action',
      rule: 'Anchor the compose/create action to the section header, not as a FAB. FABs create affordance ambiguity in list contexts (bulk action vs. new object)',
      where: 'Applied to: Secure Messaging compose. Replaces the FAB pattern across list-based create flows.',
      color: '#4CAF82',
    },
  ]
  return (
    <div className="space-y-4">
      {patterns.map((p, i) => (
        <div key={i} className="bg-white rounded-2xl border border-ink/8 overflow-hidden">
          <div className="px-6 py-4 flex items-center gap-3" style={{ borderLeft: `4px solid ${p.color}` }}>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-ink/40 mb-0.5">Pattern {i + 1}</p>
              <p className="font-display text-base font-bold text-ink">{p.name}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/6 border-t border-ink/6">
            <div className="px-5 py-4">
              <p className="font-sans text-[10px] uppercase tracking-widest text-ink/38 mb-2">When to use</p>
              <p className="font-sans text-sm text-ink/62 leading-relaxed">{p.usage}</p>
            </div>
            <div className="px-5 py-4">
              <p className="font-sans text-[10px] uppercase tracking-widest text-ink/38 mb-2">Design rule</p>
              <p className="font-sans text-sm text-ink/62 leading-relaxed">{p.rule}</p>
            </div>
            <div className="px-5 py-4">
              <p className="font-sans text-[10px] uppercase tracking-widest mb-2" style={{ color: p.color }}>Adopted in</p>
              <p className="font-sans text-sm text-ink/62 leading-relaxed">{p.where}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Alert Detail Screen mockup ──────────────────────────────────────────────
function AlertDetailScreen() {
  const blue  = '#1565C0'
  const dark  = '#1A1A1A'
  const gray  = '#8E8E93'
  const div   = '#E5E5EA'
  const aBg   = '#FFF8F2'
  const aStr  = '#C85000'
  const nrBg  = '#F2F2F7'

  return (
    <svg viewBox="0 0 390 830" xmlns="http://www.w3.org/2000/svg" style={{ background: 'white', display: 'block', width: '100%', height: '100%' }}>
      <rect width="390" height="830" fill="white"/>

      {/* ── Status Bar ──────────────────────────────────────────────── */}
      <text x="22" y="26" fontFamily="system-ui,-apple-system,sans-serif" fontSize="15" fontWeight="600" fill={dark}>9:41</text>
      <rect x="155" y="9" width="80" height="24" rx="12" fill={dark}/>
      <rect x="318" y="21" width="3" height="6"  rx="1" fill={dark}/>
      <rect x="323" y="19" width="3" height="8"  rx="1" fill={dark}/>
      <rect x="328" y="16" width="3" height="11" rx="1" fill={dark}/>
      <rect x="333" y="14" width="3" height="13" rx="1" fill={dark}/>
      <circle cx="350" cy="27" r="2" fill={dark}/>
      <path d="M345.5 23.5 Q350 19 354.5 23.5" stroke={dark} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M342 20.5 Q350 14 358 20.5"     stroke={dark} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <rect x="363" y="16" width="22" height="12" rx="3" stroke={dark} strokeWidth="1.5" fill="none"/>
      <rect x="386" y="19.5" width="2.5" height="5" rx="1.25" fill={dark}/>
      <rect x="364.5" y="17.5" width="16" height="9" rx="1.5" fill={dark}/>

      {/* ── Back Navigation ─────────────────────────────────────────── */}
      <path d="M15 57 L10 63 L15 69" stroke={blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="23" y="67" fontFamily="system-ui,-apple-system,sans-serif" fontSize="16" fill={blue}>Back to Inbox</text>

      {/* ── Title ───────────────────────────────────────────────────── */}
      <text x="16" y="107" fontFamily="system-ui,-apple-system,sans-serif" fontSize="34" fontWeight="700" fill={dark}>Alert</text>

      {/* ── Subject + Trash ─────────────────────────────────────────── */}
      <text x="16" y="136" fontFamily="system-ui,-apple-system,sans-serif" fontSize="16" fontWeight="600" fill={dark}>Security Alert: Password Changed</text>
      <line x1="362" y1="123" x2="375" y2="123" stroke={gray} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M364 123 L364.5 135 Q364.5 137 366.5 137 L370.5 137 Q372.5 137 372.5 135 L373 123" stroke={gray} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <path d="M366 121 L366 119 Q366 118 367 118 L370 118 Q371 118 371 119 L371 121" stroke={gray} strokeWidth="1.5" fill="none"/>

      {/* ── Date ────────────────────────────────────────────────────── */}
      <text x="16" y="156" fontFamily="system-ui,-apple-system,sans-serif" fontSize="13" fill={gray}>Created 1/25/2024</text>

      {/* ── Divider 1 ───────────────────────────────────────────────── */}
      <line x1="0" y1="170" x2="390" y2="170" stroke={div} strokeWidth="1"/>

      {/* ── Alert Source Header ─────────────────────────────────────── */}
      <path d="M30 213 L38 197 L46 213 Z" fill={aBg} stroke={aStr} strokeWidth="1.5" strokeLinejoin="round"/>
      <line x1="38" y1="203" x2="38" y2="208" stroke={aStr} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="38" cy="211" r="1" fill={aStr}/>
      <text x="56" y="203" fontFamily="system-ui,-apple-system,sans-serif" fontSize="14" fontWeight="600" fill={dark}>Security Alerts: Do Not Reply</text>
      <text x="56" y="219" fontFamily="system-ui,-apple-system,sans-serif" fontSize="13" fill={gray}>Automated Notification · 1/25/2024</text>

      {/* ── Divider 2 ───────────────────────────────────────────────── */}
      <line x1="16" y1="235" x2="374" y2="235" stroke={div} strokeWidth="0.5"/>

      {/* ── Alert Body ──────────────────────────────────────────────── */}
      <text fontFamily="system-ui,-apple-system,sans-serif" fontSize="15" fill={dark}>
        <tspan x="16" y="263">Your account password was successfully</tspan>
        <tspan x="16" dy="24">changed on Jan 25, 2024 at 9:41 AM.</tspan>
        <tspan x="16" dy="40">If you made this change, no further</tspan>
        <tspan x="16" dy="24">action is required.</tspan>
        <tspan x="16" dy="40">If you did not make this change, contact</tspan>
        <tspan x="16" dy="24">your bank immediately by calling the</tspan>
        <tspan x="16" dy="24">number on the back of your card, or</tspan>
        <tspan x="16" dy="24">by sending a message from your inbox.</tspan>
        <tspan x="16" dy="40">For your security, we will never ask for</tspan>
        <tspan x="16" dy="24">your password or PIN via this channel.</tspan>
      </text>

      {/* ── No-Reply Notice ─────────────────────────────────────────── */}
      <rect x="16" y="632" width="358" height="58" rx="10" fill={nrBg}/>
      <circle cx="36" cy="661" r="9" fill={gray} opacity="0.2"/>
      <text x="36" y="666" textAnchor="middle" fontFamily="system-ui,-apple-system,sans-serif" fontSize="12" fontWeight="700" fill={gray}>i</text>
      <text fontFamily="system-ui,-apple-system,sans-serif" fontSize="12" fill={gray}>
        <tspan x="52" y="655">This is an automated notification.</tspan>
        <tspan x="52" dy="17">You cannot reply to this alert.</tspan>
      </text>

      {/* ── Bottom Navigation ───────────────────────────────────────── */}
      <line x1="0" y1="760" x2="390" y2="760" stroke={div} strokeWidth="1"/>
      <rect x="0" y="760" width="390" height="70" fill="white"/>

      {/* HOME x=39 */}
      <path d="M31 799 L39 791 L47 799 L47 806 L43 806 L43 799.5 L35 799.5 L35 806 L31 806 Z" stroke={gray} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      <text x="39" y="821" textAnchor="middle" fontFamily="system-ui,-apple-system,sans-serif" fontSize="10" fill={gray}>HOME</text>

      {/* TRANSFER x=117 */}
      <path d="M111 793 L117 787 L123 793" stroke={gray} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="117" y1="787" x2="117" y2="801" stroke={gray} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M111 802 L117 808 L123 802" stroke={gray} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <text x="117" y="821" textAnchor="middle" fontFamily="system-ui,-apple-system,sans-serif" fontSize="10" fill={gray}>TRANSFER</text>

      {/* DEPOSIT CHECK x=195 */}
      <rect x="187" y="789" width="16" height="12" rx="2" stroke={gray} strokeWidth="1.5" fill="none"/>
      <path d="M190 795 L193 799 L200 792" stroke={gray} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <text x="195" y="813" textAnchor="middle" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" fill={gray}>DEPOSIT</text>
      <text x="195" y="823" textAnchor="middle" fontFamily="system-ui,-apple-system,sans-serif" fontSize="9.5" fill={gray}>CHECK</text>

      {/* INBOX x=273, active blue */}
      <rect x="265" y="789" width="16" height="12" rx="2" stroke={blue} strokeWidth="1.5" fill="none"/>
      <path d="M265 795 L273 801 L281 795" stroke={blue} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <text x="273" y="821" textAnchor="middle" fontFamily="system-ui,-apple-system,sans-serif" fontSize="10" fontWeight="600" fill={blue}>INBOX</text>

      {/* MENU x=351 */}
      <line x1="344" y1="792" x2="358" y2="792" stroke={gray} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="344" y1="797" x2="358" y2="797" stroke={gray} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="344" y1="802" x2="358" y2="802" stroke={gray} strokeWidth="1.5" strokeLinecap="round"/>
      <text x="351" y="821" textAnchor="middle" fontFamily="system-ui,-apple-system,sans-serif" fontSize="10" fill={gray}>MENU</text>
    </svg>
  )
}

export default function MessagingRedesign() {
  usePageMeta(
    'Secure Messaging Redesign by Stephen Hurt',
    "Redesigning a bank's primary trust surface for 20M+ users: chat-style threading, compliance-safe alert separation, and accessible unread states, validated at a 92.9 SUS."
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
            Redesigning the primary trust channel in Q2's mobile banking platform, improving usability and visual quality across 20M+ users as part of a platform-wide modernization initiative.
          </motion.p>
        </div>
      </section>

      {/* ── Content covers the fixed hero as user scrolls ────────────────── */}
      <div className="relative z-10 bg-cream">

      {/* ── TL;DR ────────────────────────────────────────────────────────── */}
      <CaseTLDR
        colors={{ text: '#1C2322', dim: 'rgba(28,35,34,0.6)', accent: '#8A6D1A', surface: '#FFFFFF', rule: 'rgba(28,35,34,0.1)' }}
        summary={`Secure Messaging is a bank's primary trust surface, and it was the last high-traffic screen still on a decade-old, email-style paradigm. I led the research and redesign to chat-style threading with compliance-safe alert separation and accessible unread states, then shipped to 20M+ users and validated at a 92.9 SUS, the top 4% of scores.`}
        stats={[
          { value: '92.9', label: 'SUS score: excellent, top 4%' },
          { value: '0', label: 'Task failures across 10 scenarios' },
          { value: '20M+', label: 'Banking users on the shipped surface' },
          { value: '3', label: 'Patterns documented into the system' },
        ]}
      />

      {/* ── Overview ─────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-14 border-b border-ink/10">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
              {[
                { label: 'Role', value: 'Lead Product Designer - sole designer on the feature' },
                { label: 'Scope', value: 'Heuristic evaluation, IA, UX, UI, prototyping, dev handoff' },
                { label: 'Platform', value: 'iOS & Android (mobile-first, responsive web parity)' },
                { label: 'Outcome', value: 'SUS 92.9 · VisAWI 6.1/7 · Shipped to 20M+ users' },
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
                Secure Messaging isn't just a feature, it's the primary trust surface between a bank and its customers.
              </h2>
              <div className="font-sans text-base text-ink/70 leading-relaxed space-y-4 max-w-3xl">
                <p>
                  In financial services, secure messaging sits at the intersection of customer support, compliance, and trust. It's where users escalate concerns, dispute transactions, and seek guidance on sensitive account matters. Done poorly, it erodes confidence in the institution. Done well, it becomes a competitive differentiator.
                </p>
                <p>
                  Q2's platform was undergoing a large-scale modernization, moving from a legacy component library to a cohesive, modern design system. Secure Messaging was one of the last high-traffic surfaces still running on the old paradigm, creating visible inconsistency for the 20M+ users who encountered it regularly. This redesign was both a usability imperative and a design system alignment exercise.
                </p>
              </div>

              <div
                className="mt-8 rounded-2xl p-7 border max-w-3xl"
                style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}0d` }}
              >
                <p className="font-sans text-xs uppercase tracking-widest text-ink/40 mb-3">Scope & Intent</p>
                <p className="font-display text-lg font-bold text-ink leading-snug mb-3">
                  The goal wasn't to reinvent messaging. It was to close the gap between what users already expect and what Q2 was delivering.
                </p>
                <p className="font-sans text-sm text-ink/60 leading-relaxed">
                  Users arrive at banking apps already shaped by iMessage, WhatsApp, and Gmail. Reinventing those conventions would have introduced friction, not reduced it. The right call on a trust-critical surface is to meet established mental models, not challenge them. This project was about eliminating the delta between user expectations and platform reality.
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
                    The legacy UI suffered from a cluster of interconnected usability failures. None were catastrophic in isolation, but together, they produced an experience that felt dated, unpredictable, and out of step with the platform users had come to expect.
                  </p>
                  {[
                    {
                      label: 'Inbox metaphor mismatch',
                      body: 'Virtually every user expects chat-style threading. Texting is universal. The email-inbox paradigm felt archaic and created immediate orientation confusion regardless of age.',
                    },
                    {
                      label: 'Hidden message actions',
                      body: 'Reply, archive, and delete were not discoverable from the thread view. Users could not complete core tasks without guidance.',
                    },
                    {
                      label: 'Broken visual hierarchy',
                      body: 'Flat typography and uniform spacing made scanning impossible. Unread states were visually indistinguishable at a glance.',
                    },
                    {
                      label: 'Platform design debt',
                      body: 'Inconsistent with every other modernized surface in the app, compounding distrust and increasing perceived complexity.',
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
            title="Multi-method research to triangulate failure modes before prescribing solutions"
          >
            <div className="font-sans text-base text-ink/70 leading-relaxed space-y-4 max-w-3xl mb-10">
              <p>
                Rather than relying on intuition or jumping to redesign, I ran a structured discovery sprint using four complementary methods. The goal was to identify whether observed usability failures were isolated interaction issues or symptomatic of deeper information architecture and mental model problems.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {[
                {
                  method: 'Heuristic Evaluation',
                  framework: "Nielsen's 10 Usability Heuristics",
                  finding: 'Identified 4 distinct violation clusters, with visibility of system status and match between system and real world as the highest-severity failures.',
                },
                {
                  method: 'Competitive Analysis',
                  framework: 'iMessage, Gmail, Slack, WhatsApp',
                  finding: 'Established baseline expectations for modern messaging conventions, particularly around threading, read states, and action affordances.',
                },
                {
                  method: 'Task Analysis',
                  framework: 'Two primary task flows mapped',
                  finding: "Revealed that Send Message required 6 discrete steps, each with a potential exit point. The flow's complexity wasn't just a UI problem; it was structural.",
                },
                {
                  method: 'Stakeholder Interviews',
                  framework: 'Product, Engineering, CX teams',
                  finding: 'Surfaced compliance and accessibility constraints that would shape the design solution, including WCAG 2.1 AA requirements and audit trail obligations.',
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

            {/* User voice synthesis */}
            <div className="mb-10">
              <p className="font-sans text-xs tracking-widest uppercase text-ink/40 mb-1">User Feedback - Moderated Sessions</p>
              <p className="font-sans text-sm text-ink/55 mb-5">Theme frequency from banking customer sessions, with representative verbatims</p>
              <ResearchSynthesisMap />
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
                    lesson: 'Chat-style threading isn\'t a preference. It\'s a trained behavior. Every user arrives already knowing how to read and reply in a bubble layout. Any deviation from this incurs onboarding cost on a surface where trust is the entire point.',
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
              I documented the two primary task flows in full, Send Message and Read/Reply, to expose where friction accumulated and where users were likely to abandon. The Send Message flow contained two decision branches (Save Draft, Attach File) that the legacy UI failed to communicate clearly, contributing to high error rates in testing.
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

          {/* ── 05 Key Findings ───────────────────────────────────────────── */}
          <CollapsibleSection
            sectionLabel="05 - Heuristic Findings"
            title="Four violation clusters, two of them critical"
          >
            <p className="font-sans text-base text-ink/60 leading-relaxed max-w-3xl mb-8">
              The heuristic evaluation surfaced failure modes across four distinct UX principles. Rather than treating these as a list of isolated bugs, I used them as design constraints, each violation mapped to a concrete design requirement in the brief.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FindingCard
                number="H1"
                heuristic="Visibility of System Status"
                failure="No read/unread differentiation at the inbox level. Users had no way to triage message priority without opening each thread individually."
                severity="Critical"
              />
              <FindingCard
                number="H2"
                heuristic="Match Between System & Real World"
                failure="The email-inbox metaphor conflicted with user mental models shaped by modern messaging apps. Thread-based navigation felt foreign and unmemorable."
                severity="Critical"
              />
              <FindingCard
                number="H3"
                heuristic="Recognition Rather Than Recall"
                failure="Reply, delete, and archive actions were hidden behind menus or unavailable from the thread view, requiring users to remember navigation paths they couldn't predict."
                severity="Major"
              />
              <FindingCard
                number="H4"
                heuristic="Aesthetic & Minimalist Design"
                failure="Visual density and lack of hierarchy made the inbox feel chaotic at scale. No clear separation between system alerts and human-initiated messages."
                severity="Major"
              />
            </div>
          </CollapsibleSection>

          {/* ── 06 Design Exploration ─────────────────────────────────────── */}
          <CollapsibleSection
            sectionLabel="06 - Design Exploration"
            title="Two lo-fi directions, one high-stakes decision"
          >
            <p className="font-sans text-base text-ink/60 leading-relaxed max-w-3xl mb-8">
              Rather than exploring stylistic variations in wireframes, the lo-fi phase focused on a single structural question: where does the Compose action live? This determined everything downstream, information hierarchy, navigation model, and the mental model for new-message intent.
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
              Top row: Direction A - floating action button (FAB) for compose. Bottom row: Direction B - header-anchored "New Message" button. Both directions tested against 4 selection and bulk-action states.
            </p>

            <DecisionCallout
              before="Floating Action Button (FAB) for compose"
              after="Header-anchored 'New Message' button"
              rationale="In list contexts, FABs create ambiguity about whether the action applies to selected items or initiates a new object. Users consistently misread the FAB as 'bulk action' rather than 'compose'. Anchoring the action to the header establishes clear spatial ownership over the compose intent, consistent with native platform conventions (iOS Mail, Gmail)."
            />
          </CollapsibleSection>

          {/* ── 06b Key Design Decisions ──────────────────────────────────── */}
          <CollapsibleSection
            sectionLabel="Key Design Decisions"
            title="Three decisions that shaped everything downstream"
          >
            <p className="font-sans text-base text-ink/60 leading-relaxed max-w-3xl mb-10">
              The lo-fi exploration answered the compose placement question. But three other structural decisions, each with real tradeoffs, determined whether the redesign would be a cosmetic refresh or a durable product improvement.
            </p>
            <KeyDesignDecisions />
          </CollapsibleSection>

          {/* ── 07 Final Design ───────────────────────────────────────────── */}
          <FadeIn>
            <section>
              <SectionLabel>07 - High-Fidelity Design</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3 leading-tight">
                Final screens: systematic, accessible, platform-aligned
              </h2>
              <p className="font-sans text-base text-ink/60 leading-relaxed max-w-3xl mb-8">
                The final design addressed all four heuristic violations while meeting Q2's platform design system tokens, WCAG 2.1 AA accessibility requirements, and existing engineering constraints. Key decisions: tabbed navigation to separate Messages, Alerts, and Drafts (eliminating the alert/message conflation in the legacy UI); bold unread indicators anchored to type weight, not color alone (accessibility); and a persistent header-anchored compose button.
              </p>

              {/* Compliance constraint callout */}
              <div className="rounded-2xl border border-ink/10 bg-ink/[0.025] px-6 py-5 mb-10 max-w-3xl">
                <p className="font-sans text-xs uppercase tracking-widest text-ink/40 mb-3">How compliance shaped the architecture</p>
                <p className="font-sans text-sm text-ink/65 leading-relaxed mb-3">
                  Stakeholder interviews with product, engineering, and compliance stakeholders surfaced a constraint that wasn't in the original brief: in financial services, system-generated alerts (fraud notifications, account changes, security notices) carry a different legal status than human-initiated messages. Institutions need to be able to demonstrate that alerts were surfaced to users in a way that's distinct and auditable. A flat unified inbox, where a fraud notice and a support message live in the same date-sorted list, makes that defensibility impossible to guarantee.
                </p>
                <p className="font-sans text-sm text-ink/65 leading-relaxed">
                  Tabs solved both problems simultaneously. The primary UX failure from research (users missing fraud alerts in a noisy flat list) and the compliance requirement (provable, auditable alert separation) had the same answer. That convergence made the tab decision easy to defend internally, it wasn't a design preference, it was the only architecture that satisfied both constraints at once.
                </p>
              </div>

              {/* Final screens grid: inbox (2 tabs) + message thread + alert detail */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start mb-5">

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

                {/* Alert detail screen: read-only, no reply affordance */}
                <div
                  className="rounded-2xl overflow-hidden border border-ink/10"
                  style={{ aspectRatio: '390/830' }}
                >
                  <AlertDetailScreen />
                </div>

              </div>
              <p className="font-sans text-xs text-ink/40 leading-relaxed mb-10">
                Inbox: Messages tab and Alerts tab (left). Tabbed navigation replaces the legacy flat list; unread states use type-weight, not color alone. Message thread: final approved reply flow with chat-style layout and fully discoverable action affordances (center). Alert detail: read-only view with no reply affordance, clearly differentiated from conversational messages (right).
              </p>

              <div className="rounded-2xl border border-ink/10 bg-ink/[0.025] px-6 py-5 max-w-3xl">
                <p className="font-sans text-xs uppercase tracking-widest text-ink/40 mb-2">A note on visual styling</p>
                <p className="font-sans text-sm text-ink/65 leading-relaxed">
                  Q2's platform is fully white-labeled: every financial institution that ships on it applies their own brand tokens, colors, and typography on top of the base system. What you're seeing here is the intentionally neutral out-of-box state. The design work lives in the interaction model, the information architecture, and the component system, not the surface palette. A community bank in Montana and a credit union in California will each make this look like their own product.
                </p>
              </div>
            </section>
          </FadeIn>

          {/* ── 08 Validation ─────────────────────────────────────────────── */}
          <FadeIn>
            <section>
              <SectionLabel>08 - Usability Validation</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3 leading-tight">
                Moderated prototype testing against a structured 10-task protocol
              </h2>
              <p className="font-sans text-base text-ink/60 leading-relaxed max-w-3xl mb-8">
                Before engineering handoff, I ran moderated usability sessions with <strong className="text-ink/80">6 banking customers</strong> using a Figma prototype, recruited from Q2's existing customer base, all active users of online banking with no prior exposure to the redesigned interface. Six participants is Q2's standard sample for formative usability studies, consistent with Nielsen Norman Group's research showing that 5 participants surface approximately 85% of critical usability issues. Sessions used a think-aloud protocol, covering composing, reading, replying, searching, deleting, and managing alerts across 10 structured task scenarios. SUS and VisAWI were captured as directional benchmarks at the close of each session.
              </p>

              {/* Heuristic baseline before/after */}
              <div className="mb-10">
                <p className="font-sans text-xs tracking-widest uppercase text-ink/40 mb-1">Heuristic Violation Status - Before & After</p>
                <p className="font-sans text-sm text-ink/55 mb-5">All four violations identified in the discovery sprint were resolved in the final design</p>
                <HeuristicBaseline />
              </div>

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
                  sub="System Usability Scale - 'Excellent' rating, top 4% of scores benchmarked against industry data"
                />
                <MetricCard
                  value="6.1/7"
                  label="VisAWI Score"
                  sub="Visual Aesthetics of Websites Inventory - strong alignment between design intent and user perception"
                />
              </div>

              <div
                className="rounded-2xl p-7 border"
                style={{ borderColor: `${ACCENT}40`, background: `${ACCENT}0d` }}
              >
                <p className="font-sans text-xs uppercase tracking-widest text-ink/40 mb-3">Validation Outcome</p>
                <p className="font-display text-xl font-bold text-ink leading-snug mb-3">
                  All 10 tasks completed without facilitator intervention. Zero task failures across all sessions.
                </p>
                <p className="font-sans text-sm text-ink/60 leading-relaxed max-w-2xl">
                  The SUS score of 92.9 placed the redesign in the "Excellent" category, well above the 68-point industry average and the 80-point threshold commonly considered "good." The VisAWI score confirmed that visual improvements mapped directly to perceived credibility and trustworthiness, meaningful signals in a financial services context. The intention is to supplement this with a longitudinal follow-up study post-launch to validate whether the mental model holds for low-frequency users over time.
                </p>
              </div>
            </section>
          </FadeIn>

          {/* ── 09 Dev Handoff ────────────────────────────────────────────── */}
          <CollapsibleSection
            sectionLabel="09 - Engineering Handoff"
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
          </CollapsibleSection>

          {/* ── 10 Outcomes ───────────────────────────────────────────────── */}
          <FadeIn>
            <section>
              <SectionLabel>10 - Outcomes & Systems Impact</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-6 leading-tight">
                Shipped. Scored. Used by millions.
              </h2>

              <div className="font-sans text-base text-ink/70 leading-relaxed space-y-4 max-w-3xl mb-10">
                <p>
                  The shipped redesign replaced a surface that had gone largely untouched for over a decade, bringing the primary trust channel for 20M+ active banking users in line with the rest of Q2's modernized platform. Design took three months. Engineering delivery took five - development was balanced against a full product roadmap, the standard reality of enterprise SaaS.
                </p>
                <p>
                  The patterns established here - tabbed separation of alerts from messages, chat-style threading, and header-anchored compose - set a structural reference for how inbox-style surfaces in the platform should behave going forward.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                {[
                  {
                    label: 'Scale',
                    value: '20M+',
                    detail: 'Active banking users across Q2\'s client network reached by the shipped redesign',
                  },
                  {
                    label: 'SUS Percentile',
                    value: 'Top 4%',
                    detail: 'SUS score of 92.9 benchmarked against industry-standard usability data sets',
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

              {/* Pattern documentation */}
              <p className="font-sans text-xs tracking-widest uppercase text-ink/40 mb-1">Pattern Documentation</p>
              <p className="font-sans text-sm text-ink/55 mb-6 max-w-3xl">
                The three patterns extracted from this redesign and formally documented in Q2's design system, including when to use them, the design rule, and which feature areas adopted them.
              </p>
              <PatternDocumentation />
            </section>
          </FadeIn>

          {/* ── 11 Reflection ─────────────────────────────────────────────── */}
          <FadeIn>
            <section>
              <SectionLabel>11 - Reflection</SectionLabel>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-6 leading-tight">
                What I'd pressure-test more rigorously next time
              </h2>

              <div className="font-sans text-base text-ink/70 leading-relaxed space-y-4 max-w-3xl mb-8">
                <p>
                  The research sprint was productive, but it was primarily expert-evaluation-led. I'd want to front-load more generative user research earlier, particularly around how banking customers mentally model "secure" communication versus generic messaging. The compliance constraints that surfaced late in stakeholder interviews should have been inputs to the research brief, not constraints discovered mid-design.
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
