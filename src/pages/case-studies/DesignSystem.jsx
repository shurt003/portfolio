import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import CaseTLDR from '../../components/CaseTLDR'
import usePageMeta from '../../hooks/usePageMeta'

// ── Palette ───────────────────────────────────────────────────────────────────
const BG      = '#FAF7F2'
const CARD    = '#FFFFFF'
const SURFACE = '#F0EDE5'
const TEXT    = '#1C2322'
const DIM     = 'rgba(28,35,34,0.75)'
const DIMMER  = 'rgba(28,35,34,0.65)'
const ACCENT  = '#7B9EC7'
const ACCENT_D = 'rgba(123,158,199,0.10)'
const RULE    = 'rgba(28,35,34,0.08)'
// WCAG AA-compliant text versions of each category accent (4.5:1+ on BG + CARD)
const NAV_TEXT      = '#4A6FA3'  // replaces #7B9EC7 as text
const FORMS_TEXT    = '#8B6A00'  // replaces #E8C547 as text
const DATA_TEXT     = '#3A7A39'  // replaces #7BBF7A as text
const FEEDBACK_TEXT = '#8B3A54'  // replaces #E8A0B0 as text

// ── Animation variant ─────────────────────────────────────────────────────────
const fadeUp = {
  initial:     { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-50px' },
  transition:  { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
}

// ── Light nav ─────────────────────────────────────────────────────────────────
// ── Helpers ───────────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <p className="font-sans text-xs tracking-[0.2em] uppercase mb-4" style={{ color: DIMMER }}>
      {children}
    </p>
  )
}
function Rule() {
  return <div className="w-full h-px" style={{ backgroundColor: RULE }} />
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT MINI-ILLUSTRATIONS
// Schematic SVG sketches of each UI component, in the category's accent color.
// ─────────────────────────────────────────────────────────────────────────────

function GlobalHeaderThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="12" y="28" width="216" height="74" rx="8" fill="white" opacity="0.55" />
      <rect x="12" y="28" width="216" height="74" rx="8" stroke={color} strokeWidth="1.5" opacity="0.32" />
      <rect x="24" y="53" width="22" height="22" rx="5" fill={color} opacity="0.5" />
      <rect x="58" y="57" width="30" height="11" rx="5.5" fill={color} opacity="0.72" />
      <rect x="58" y="69" width="30" height="2.5" rx="1.25" fill={color} opacity="0.85" />
      <rect x="96" y="59" width="24" height="9" rx="4.5" fill={color} opacity="0.3" />
      <rect x="128" y="59" width="28" height="9" rx="4.5" fill={color} opacity="0.3" />
      <circle cx="212" cy="65" r="15" fill={color} opacity="0.18" />
      <circle cx="212" cy="65" r="9" fill={color} opacity="0.35" />
    </svg>
  )
}

function SideRailThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="18" y="12" width="78" height="106" rx="9" fill={color} opacity="0.09" />
      <rect x="18" y="12" width="78" height="106" rx="9" stroke={color} strokeWidth="1.5" opacity="0.3" />
      <rect x="28" y="22" width="14" height="14" rx="3" fill={color} opacity="0.5" />
      <rect x="48" y="25" width="32" height="8" rx="4" fill={color} opacity="0.32" />
      {[[44,false],[61,true],[78,false],[95,false]].map(([y, active], i) => (
        <g key={i}>
          {active && <rect x="22" y={y - 2} width="70" height="16" rx="5" fill={color} opacity="0.15" />}
          <rect x="28" y={y} width="10" height="10" rx="2.5" fill={color} opacity={active ? 0.72 : 0.24} />
          <rect x="44" y={y + 1.5} width={[32,36,26,30][i]} height="7" rx="3.5" fill={color} opacity={active ? 0.65 : 0.2} />
        </g>
      ))}
      <rect x="106" y="12" width="116" height="106" rx="9" fill={color} opacity="0.04" />
      <rect x="116" y="26" width="88" height="10" rx="5" fill={color} opacity="0.16" />
      <rect x="116" y="44" width="68" height="8" rx="4" fill={color} opacity="0.11" />
      <rect x="116" y="58" width="82" height="8" rx="4" fill={color} opacity="0.1" />
    </svg>
  )
}

function TabBarThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="18" y="28" width="204" height="74" rx="8" fill="white" opacity="0.38" />
      <rect x="18" y="28" width="68" height="38" rx="8" fill={color} opacity="0.14" />
      <rect x="18" y="63" width="68" height="3" rx="1.5" fill={color} opacity="0.88" />
      <rect x="36" y="43" width="32" height="9" rx="4.5" fill={color} opacity="0.78" />
      <rect x="112" y="43" width="26" height="9" rx="4.5" fill={color} opacity="0.28" />
      <rect x="178" y="43" width="26" height="9" rx="4.5" fill={color} opacity="0.28" />
      <line x1="86" y1="33" x2="86" y2="62" stroke={color} strokeWidth="1" opacity="0.18" />
      <line x1="154" y1="33" x2="154" y2="62" stroke={color} strokeWidth="1" opacity="0.18" />
      <line x1="18" y1="66" x2="222" y2="66" stroke={color} strokeWidth="1" opacity="0.14" />
      <rect x="28" y="80" width="110" height="9" rx="4.5" fill={color} opacity="0.12" />
      <rect x="28" y="96" width="82" height="8" rx="4" fill={color} opacity="0.08" />
    </svg>
  )
}

function BreadcrumbThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="14" y="38" width="212" height="54" rx="9" fill={color} opacity="0.05" />
      <rect x="26" y="54" width="38" height="16" rx="8" fill={color} opacity="0.2" />
      <rect x="33" y="59" width="24" height="6" rx="3" fill={color} opacity="0.45" />
      <path d="M 71 61 L 77 65 L 71 69" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <rect x="84" y="54" width="50" height="16" rx="8" fill={color} opacity="0.2" />
      <rect x="91" y="59" width="36" height="6" rx="3" fill={color} opacity="0.45" />
      <path d="M 141 61 L 147 65 L 141 69" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
      <rect x="154" y="51" width="66" height="22" rx="11" fill={color} opacity="0.75" />
      <rect x="162" y="59.5" width="50" height="7" rx="3.5" fill="white" opacity="0.8" />
    </svg>
  )
}

function ButtonThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="34" y="18" width="172" height="30" rx="15" fill={color} opacity="0.85" />
      <rect x="74" y="28" width="92" height="10" rx="5" fill="white" opacity="0.72" />
      <rect x="34" y="58" width="172" height="30" rx="15" fill="transparent" stroke={color} strokeWidth="2" opacity="0.65" />
      <rect x="80" y="68" width="80" height="10" rx="5" fill={color} opacity="0.58" />
      <rect x="80" y="99" width="80" height="10" rx="5" fill={color} opacity="0.38" />
      <line x1="80" y1="110" x2="160" y2="110" stroke={color} strokeWidth="1.5" opacity="0.32" />
    </svg>
  )
}

function TextFieldThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="30" y="20" width="54" height="9" rx="4.5" fill={color} opacity="0.52" />
      <rect x="28" y="36" width="184" height="38" rx="9" fill="white" opacity="0.58" />
      <rect x="28" y="36" width="184" height="38" rx="9" stroke={color} strokeWidth="2" opacity="0.55" />
      <rect x="28" y="36" width="4" height="38" rx="2" fill={color} opacity="0.78" />
      <rect x="44" y="49" width="2" height="14" rx="1" fill={color} opacity="0.65" />
      <rect x="52" y="52" width="80" height="8" rx="4" fill={color} opacity="0.18" />
      <rect x="30" y="84" width="108" height="8" rx="4" fill={color} opacity="0.25" />
    </svg>
  )
}

function DropdownThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="28" y="18" width="54" height="9" rx="4.5" fill={color} opacity="0.52" />
      <rect x="28" y="33" width="184" height="36" rx="9" fill="white" opacity="0.58" />
      <rect x="28" y="33" width="184" height="36" rx="9" stroke={color} strokeWidth="1.5" opacity="0.45" />
      <rect x="42" y="46" width="82" height="9" rx="4.5" fill={color} opacity="0.5" />
      <path d="M 196 48 L 201 55 L 206 48" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.68" />
      <rect x="28" y="75" width="184" height="48" rx="9" fill="white" opacity="0.82" />
      <rect x="28" y="75" width="184" height="48" rx="9" stroke={color} strokeWidth="1" opacity="0.22" />
      <rect x="42" y="84" width="70" height="8" rx="4" fill={color} opacity="0.55" />
      <line x1="28" y1="97" x2="212" y2="97" stroke={color} strokeWidth="0.75" opacity="0.15" />
      <rect x="42" y="104" width="86" height="8" rx="4" fill={color} opacity="0.28" />
    </svg>
  )
}

function ToggleThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="28" y="22" width="72" height="36" rx="18" fill={color} opacity="0.85" />
      <circle cx="82" cy="40" r="14" fill="white" />
      <rect x="110" y="30" width="92" height="10" rx="5" fill={color} opacity="0.48" />
      <rect x="110" y="46" width="62" height="8" rx="4" fill={color} opacity="0.22" />
      <line x1="28" y1="78" x2="212" y2="78" stroke={color} strokeWidth="0.75" opacity="0.15" />
      <rect x="28" y="84" width="72" height="36" rx="18" fill={color} opacity="0.15" />
      <rect x="28" y="84" width="72" height="36" rx="18" stroke={color} strokeWidth="2" opacity="0.32" />
      <circle cx="46" cy="102" r="14" fill="white" />
      <circle cx="46" cy="102" r="14" stroke={color} strokeWidth="1.5" opacity="0.28" />
      <rect x="110" y="92" width="92" height="10" rx="5" fill={color} opacity="0.38" />
      <rect x="110" y="108" width="62" height="8" rx="4" fill={color} opacity="0.18" />
    </svg>
  )
}

function CheckboxThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="28" y="20" width="22" height="22" rx="5" fill={color} opacity="0.88" />
      <path d="M 33 31 L 38 36 L 48 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="60" y="24" width="88" height="10" rx="5" fill={color} opacity="0.48" />
      <rect x="28" y="54" width="22" height="22" rx="5" fill="transparent" stroke={color} strokeWidth="2" opacity="0.42" />
      <rect x="60" y="58" width="70" height="10" rx="5" fill={color} opacity="0.3" />
      <rect x="28" y="88" width="22" height="22" rx="5" fill={color} opacity="0.18" stroke={color} strokeWidth="2" />
      <rect x="34" y="98" width="10" height="3" rx="1.5" fill={color} opacity="0.75" />
      <rect x="60" y="92" width="80" height="10" rx="5" fill={color} opacity="0.38" />
      {/* Radio */}
      <circle cx="158" cy="31" r="11" fill={color} opacity="0.88" />
      <circle cx="158" cy="31" r="4.5" fill="white" />
      <circle cx="158" cy="65" r="11" fill="transparent" stroke={color} strokeWidth="2" opacity="0.4" />
      <circle cx="158" cy="99" r="11" fill="transparent" stroke={color} strokeWidth="2" opacity="0.25" />
    </svg>
  )
}

function DataTableThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="12" y="12" width="216" height="106" rx="9" fill="white" opacity="0.45" />
      <rect x="12" y="12" width="216" height="106" rx="9" stroke={color} strokeWidth="1" opacity="0.22" />
      <rect x="12" y="12" width="216" height="22" rx="9" fill={color} opacity="0.18" />
      <rect x="24" y="19" width="38" height="8" rx="4" fill={color} opacity="0.6" />
      <rect x="98" y="19" width="30" height="8" rx="4" fill={color} opacity="0.42" />
      <rect x="162" y="19" width="38" height="8" rx="4" fill={color} opacity="0.42" />
      <line x1="82" y1="12" x2="82" y2="118" stroke={color} strokeWidth="0.75" opacity="0.18" />
      <line x1="148" y1="12" x2="148" y2="118" stroke={color} strokeWidth="0.75" opacity="0.18" />
      {[34, 52, 70, 88, 106].map((y, i) => (
        <g key={i}>
          <line x1="12" y1={y} x2="228" y2={y} stroke={color} strokeWidth="0.75" opacity="0.12" />
          <rect x="24" y={y + 5} width={[44,36,40,34,42][i]} height="7" rx="3.5" fill={color} opacity="0.28" />
          <rect x="98" y={y + 5} width={[30,38,24,36,28][i]} height="7" rx="3.5" fill={color} opacity="0.2" />
          <rect x="162" y={y + 5} width={[34,26,40,28,36][i]} height="7" rx="3.5" fill={color} opacity="0.18" />
        </g>
      ))}
    </svg>
  )
}

function MetricCardThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="18" y="10" width="204" height="110" rx="12" fill="white" opacity="0.52" />
      <rect x="18" y="10" width="204" height="110" rx="12" stroke={color} strokeWidth="1.5" opacity="0.28" />
      <rect x="32" y="24" width="64" height="9" rx="4.5" fill={color} opacity="0.38" />
      <rect x="32" y="42" width="116" height="30" rx="7" fill={color} opacity="0.55" />
      <rect x="160" y="36" width="44" height="20" rx="10" fill={color} opacity="0.15" />
      <rect x="168" y="42" width="28" height="8" rx="4" fill={color} opacity="0.52" />
      <path d="M 32 96 L 48 84 L 66 90 L 84 76 L 100 80" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
      <circle cx="100" cy="80" r="4" fill={color} opacity="0.78" />
      <rect x="114" y="88" width="80" height="9" rx="4.5" fill={color} opacity="0.18" />
    </svg>
  )
}

function StatusBadgeThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="24" y="20" width="60" height="22" rx="11" fill={color} opacity="0.75" />
      <circle cx="40" cy="31" r="5.5" fill="white" opacity="0.6" />
      <rect x="50" y="26.5" width="28" height="9" rx="4.5" fill="white" opacity="0.68" />
      <rect x="94" y="20" width="54" height="22" rx="11" fill="#E8C547" opacity="0.6" />
      <rect x="104" y="26.5" width="34" height="9" rx="4.5" fill="white" opacity="0.72" />
      <rect x="158" y="20" width="60" height="22" rx="11" fill="#E8A0B0" opacity="0.55" />
      <rect x="168" y="26.5" width="40" height="9" rx="4.5" fill="white" opacity="0.68" />
      <rect x="24" y="55" width="72" height="18" rx="9" fill={color} opacity="0.52" />
      <rect x="36" y="60.5" width="48" height="7" rx="3.5" fill="white" opacity="0.65" />
      <rect x="106" y="57.5" width="56" height="13" rx="6.5" fill={color} opacity="0.35" />
      <rect x="116" y="61" width="36" height="6" rx="3" fill="white" opacity="0.55" />
      <rect x="172" y="59" width="44" height="10" rx="5" fill={color} opacity="0.22" />
      <rect x="24" y="88" width="60" height="18" rx="9" fill="transparent" stroke={color} strokeWidth="1.5" opacity="0.55" />
      <rect x="34" y="93.5" width="40" height="7" rx="3.5" fill={color} opacity="0.5" />
      <rect x="94" y="88" width="68" height="18" rx="9" fill="transparent" stroke={color} strokeWidth="1.5" opacity="0.32" />
      <rect x="104" y="93.5" width="48" height="7" rx="3.5" fill={color} opacity="0.32" />
      <rect x="172" y="88" width="44" height="18" rx="9" fill="transparent" stroke={color} strokeWidth="1.5" opacity="0.2" />
    </svg>
  )
}

function ProgressThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="28" y="22" width="74" height="9" rx="4.5" fill={color} opacity="0.45" />
      <rect x="184" y="22" width="28" height="9" rx="4.5" fill={color} opacity="0.62" />
      <rect x="28" y="38" width="184" height="12" rx="6" fill={color} opacity="0.14" />
      <rect x="28" y="38" width="136" height="12" rx="6" fill={color} opacity="0.78" />
      <rect x="28" y="62" width="60" height="8" rx="4" fill={color} opacity="0.38" />
      <rect x="200" y="62" width="12" height="8" rx="4" fill={color} opacity="0.42" />
      <rect x="28" y="76" width="184" height="10" rx="5" fill={color} opacity="0.12" />
      <rect x="28" y="76" width="82" height="10" rx="5" fill={color} opacity="0.62" />
      {[42, 96, 150, 196].map((cx, i) => (
        <g key={i}>
          <circle cx={cx} cy="110" r="9" fill={i < 2 ? color : 'transparent'} opacity={i < 2 ? 0.82 : 0} />
          <circle cx={cx} cy="110" r="9" fill="transparent" stroke={color} strokeWidth="2" opacity={i < 2 ? 0 : 0.28} />
          {i < 3 && <rect x={cx + 9} y="109.5" width={[36, 36, 28][i]} height="2" rx="1" fill={color} opacity={i < 2 ? 0.38 : 0.18} />}
        </g>
      ))}
    </svg>
  )
}

function AlertThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="14" y="18" width="212" height="42" rx="9" fill={color} opacity="0.1" />
      <rect x="14" y="18" width="5" height="42" rx="2.5" fill={color} opacity="0.88" />
      <circle cx="38" cy="39" r="11" fill={color} opacity="0.28" />
      <rect x="37" y="33" width="2" height="7" rx="1" fill={color} opacity="0.82" />
      <circle cx="38" cy="43" r="1.5" fill={color} opacity="0.82" />
      <rect x="58" y="31" width="94" height="9" rx="4.5" fill={color} opacity="0.58" />
      <rect x="58" y="45" width="128" height="8" rx="4" fill={color} opacity="0.28" />
      <path d="M 207 31 L 213 37 M 213 31 L 207 37" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <rect x="14" y="72" width="212" height="42" rx="9" fill="#E8C547" opacity="0.08" />
      <rect x="14" y="72" width="5" height="42" rx="2.5" fill="#E8C547" opacity="0.72" />
      <circle cx="38" cy="93" r="11" fill="#E8C547" opacity="0.25" />
      <path d="M 38 87 L 38 96 M 38 100 L 38 101" stroke="#C9A830" strokeWidth="2.5" strokeLinecap="round" opacity="0.78" />
      <rect x="58" y="85" width="108" height="9" rx="4.5" fill="#C9A830" opacity="0.48" />
      <rect x="58" y="99" width="88" height="8" rx="4" fill="#C9A830" opacity="0.25" />
    </svg>
  )
}

function ToastThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="24" y="14" width="192" height="44" rx="11" fill="white" opacity="0.72" />
      <rect x="24" y="14" width="192" height="44" rx="11" stroke={color} strokeWidth="1.5" opacity="0.38" />
      <circle cx="50" cy="36" r="11" fill={color} opacity="0.22" />
      <path d="M 45 36 L 49 40 L 57 32" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.82" />
      <rect x="70" y="28" width="80" height="9" rx="4.5" fill={color} opacity="0.52" />
      <rect x="70" y="42" width="56" height="7" rx="3.5" fill={color} opacity="0.26" />
      <path d="M 196 24 L 202 30 M 202 24 L 196 30" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.36" />
      <rect x="36" y="70" width="168" height="44" rx="11" fill="white" opacity="0.52" />
      <rect x="36" y="70" width="168" height="44" rx="11" stroke={color} strokeWidth="1" opacity="0.18" />
      <circle cx="60" cy="92" r="11" fill={color} opacity="0.14" />
      <rect x="80" y="84" width="66" height="9" rx="4.5" fill={color} opacity="0.3" />
      <rect x="80" y="98" width="88" height="7" rx="3.5" fill={color} opacity="0.16" />
    </svg>
  )
}

function EmptyStateThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <circle cx="120" cy="50" r="34" stroke={color} strokeWidth="2" strokeDasharray="7 5" opacity="0.38" />
      <rect x="106" y="38" width="28" height="24" rx="5" fill={color} opacity="0.18" />
      <rect x="111" y="44" width="18" height="3" rx="1.5" fill={color} opacity="0.45" />
      <rect x="111" y="51" width="12" height="3" rx="1.5" fill={color} opacity="0.3" />
      <rect x="82" y="95" width="76" height="12" rx="6" fill={color} opacity="0.48" />
      <rect x="68" y="114" width="104" height="9" rx="4.5" fill={color} opacity="0.22" />
    </svg>
  )
}

function ModalThumb({ color }) {
  return (
    <svg viewBox="0 0 240 130" fill="none" style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect x="0" y="0" width="240" height="130" fill={color} opacity="0.07" />
      <rect x="28" y="12" width="184" height="106" rx="12" fill="white" opacity="0.9" />
      <rect x="28" y="12" width="184" height="106" rx="12" stroke={color} strokeWidth="1.5" opacity="0.28" />
      <rect x="28" y="12" width="184" height="28" rx="12" fill={color} opacity="0.12" />
      <rect x="44" y="21" width="72" height="10" rx="5" fill={color} opacity="0.58" />
      <path d="M 190 18 L 195 23 M 195 18 L 190 23" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.42" />
      <rect x="44" y="52" width="152" height="8" rx="4" fill={color} opacity="0.22" />
      <rect x="44" y="66" width="128" height="8" rx="4" fill={color} opacity="0.16" />
      <rect x="44" y="80" width="144" height="8" rx="4" fill={color} opacity="0.13" />
      <rect x="110" y="102" width="56" height="10" rx="5" fill={color} opacity="0.68" />
      <rect x="44" y="102" width="58" height="10" rx="5" fill="transparent" stroke={color} strokeWidth="1.5" opacity="0.4" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'navigation',
    label: 'Navigation',
    accent: '#7B9EC7',
    textAccent: NAV_TEXT,
    description: "Wayfinding patterns that scale across Q2's diverse product suite, from consumer banking to enterprise dashboards.",
    components: [
      {
        name: 'Global Header', desc: 'Consistent top nav across all products', year: '2023', Thumb: GlobalHeaderThumb,
        detail: {
          before: 'A flat, unlayered top bar with inconsistent padding across products. No user account area. The logo linked home but provided no navigation context, users frequently lost their place in multi-product flows.',
          changes: [
            'Unified height spec: 64px desktop / 52px mobile, consistent across all product lines',
            'Added user avatar with profile dropdown for account settings and sign-out',
            'Active state: animated underline indicator that slides to the current section',
            'Sticky behavior with a subtle drop shadow that appears on scroll',
            'Responsive collapse to hamburger menu below md breakpoint, with drawer animation',
          ],
          outcome: "Support tickets related to navigation confusion dropped significantly after launch. The avatar area became a natural anchor point, users stopped asking 'where do I find my account settings?'",
        },
      },
      {
        name: 'Side Rail', desc: 'Collapsible nav for dense dashboards', year: '2023', Thumb: SideRailThumb,
        detail: {
          before: 'Always-open, fixed-width sidebar consuming 240px of horizontal space at all times. Nav items were plain text links with 8px padding, cramped and visually noisy. No collapse. No icons.',
          changes: [
            'Collapsible to 64px icon-only mode, preference persisted in localStorage',
            'Active item: accent-tinted background row + bold label, making current location unambiguous',
            'Icon added to every nav item for scan-ability in collapsed mode',
            'Smooth 220ms ease-in-out transition for collapse/expand',
            'Section grouping with subtle dividers for products with 8+ nav items',
          ],
          outcome: 'The collapsible rail was the most-requested feature in the design system survey, by a wide margin. Reclaimed ~180px of content area on smaller viewports, directly improving table and data grid usability.',
        },
      },
      {
        name: 'Tab Bar', desc: 'In-page content segmentation', year: '2022', Thumb: TabBarThumb,
        detail: {
          before: 'Tabs were styled as underlined anchor links with no visual grouping or container. Active state was a color change only, no motion between tab switches. Overflow tabs were simply hidden.',
          changes: [
            'Visual tab container with a subtle background to group tabs as a unit',
            'Animated bottom indicator that slides smoothly to the active tab, no flash or jump',
            'Horizontal scroll with fade-out gradient edges for overflow scenarios',
            'Keyboard navigation: arrow keys to switch tabs, focus managed correctly',
            'ARIA role="tablist/tab/tabpanel" fully implemented',
          ],
          outcome: "Used across 12+ views in the Consumer Dashboard alone. The sliding indicator was called out in a design review as 'the kind of detail that makes the whole product feel premium.'",
        },
      },
      {
        name: 'Breadcrumb Trail', desc: 'Hierarchical location indicator', year: '2022', Thumb: BreadcrumbThumb,
        detail: {
          before: "Plain text separated by '>' characters with no truncation logic. Long hierarchies wrapped to two lines, breaking layouts. No visual distinction between visited pages and the current page.",
          changes: [
            'Pill containers per crumb, visual weight without adding noise',
            'Current page rendered as a filled accent pill, not just bold text',
            'Truncation: middle crumbs collapse to "…" ellipsis at 4+ levels deep',
            'Hover state on non-current crumbs with subtle underline',
            'aria-current="page" on the final item for screen reader announcements',
          ],
          outcome: 'Eliminated 3 edge-case layout bugs caused by breadcrumb wrapping. Navigation accessibility score improved from 72 → 96 in the subsequent audit.',
        },
      },
    ],
  },
  {
    id: 'forms',
    label: 'Forms & Inputs',
    accent: '#E8C547',
    textAccent: FORMS_TEXT,
    description: 'The foundation of every workflow in the platform, every transaction, filter, and configuration passes through these.',
    components: [
      {
        name: 'Button Suite', desc: 'Primary, secondary, and ghost variants', year: '2022', Thumb: ButtonThumb,
        detail: {
          before: 'Three separate components - PrimaryButton, SecondaryButton, LinkButton - with different APIs, different heights, and no loading state. Icon support was bolted on inconsistently. No size scale.',
          changes: [
            'Single Button component with variant prop: filled / outline / ghost',
            'Size scale: sm (32px) / md (40px) / lg (48px), consistent across all variants',
            'Loading state with animated spinner that locks button width to prevent layout shift',
            'Icon slot: leading or trailing, with correct spacing baked in',
            'Destructive variant for delete and irreversible actions',
            'Full-width option for mobile-optimized CTAs',
          ],
          outcome: 'Reduced button-related code across 5 products by ~60%. New features now get accessible, on-brand buttons with zero extra design or engineering work.',
        },
      },
      {
        name: 'Text Field', desc: 'Single-line and multiline input', year: '2022', Thumb: TextFieldThumb,
        detail: {
          before: 'No label component, teams wrote labels as raw HTML, inconsistently. No error state styling. Helper text was an afterthought. Focus ring was the browser default blue outline that clashed with every product palette.',
          changes: [
            'Label + input + helper text as a single atomic component, one import, complete behavior',
            'Focus state: left accent border + subtle shadow (no jarring blue outline)',
            'Error state: red helper text + red border + inline error icon',
            'Character count display for fields with limits',
            'Floating label animation on focus (opt-in variant)',
            'Disabled state: 40% opacity + not-allowed cursor',
          ],
          outcome: 'Form completion rate in the onboarding flow increased 18% after rollout, fewer users were missing required fields because error states finally communicated clearly.',
        },
      },
      {
        name: 'Select & Dropdown', desc: 'Option selection for forms and filters', year: '2023', Thumb: DropdownThumb,
        detail: {
          before: 'Native browser <select> on most screens. On complex views, a custom dropdown with no keyboard support, no search, and no grouped options. The two patterns were visually inconsistent.',
          changes: [
            'Single custom Select replacing both patterns, consistent appearance everywhere',
            'Keyboard: arrow keys to navigate, type-to-filter, enter to select, escape to close',
            'Grouped options with section headers for long option lists',
            'Multi-select variant with chip display for selected values',
            'Clear button when a value is selected',
            'Max-height with overflow scroll for lists longer than 8 items',
          ],
          outcome: 'Keyboard-only users can now complete any form in the product. Previously, 6 critical flows were inaccessible without a mouse, all now pass keyboard navigation audit.',
        },
      },
      {
        name: 'Toggle Switch', desc: 'Binary on/off control', year: '2023', Thumb: ToggleThumb,
        detail: {
          before: 'Two separate components existed: a checkbox styled to look like a toggle, and a bespoke toggle in the settings screen with different sizing. Neither had proper ARIA role="switch".',
          changes: [
            'Single Toggle component with role="switch" and aria-checked',
            'Size variants: sm and md',
            'Label positioning: left or right',
            'State communicated via color + thumb position + optional on/off text label (triple redundancy)',
            'Focus ring on keyboard navigation only, not triggered by mouse click',
            'Thumb transition: 150ms spring animation',
          ],
          outcome: 'Consolidated 2 diverged patterns into 1. All settings screens now use the same toggle, no more reconciling which variant to use in design reviews.',
        },
      },
      {
        name: 'Checkbox & Radio', desc: 'Multi and single-select form controls', year: '2022', Thumb: CheckboxThumb,
        detail: {
          before: "Default browser checkbox and radio inputs with no custom styling, each browser rendered them differently. No indeterminate state. Group components didn't exist; teams wired groups manually.",
          changes: [
            'Fully custom Checkbox: checked / unchecked / indeterminate states, all visually consistent',
            'RadioGroup component handles mutual exclusivity automatically, no manual state management',
            'CheckboxGroup with built-in select-all behavior and indeterminate parent state',
            'Error state at the group level, not just per-item',
            'Consistent 16×16px control size across all browsers and OS',
            'Accessible focus ring, correct labeling, and keyboard support',
          ],
          outcome: 'Eliminated cross-browser visual inconsistency in all form controls. Indeterminate checkbox, critical for select-all patterns in data tables, now works correctly everywhere for the first time.',
        },
      },
    ],
  },
  {
    id: 'data',
    label: 'Data Display',
    accent: '#7BBF7A',
    textAccent: DATA_TEXT,
    description: 'Q2 is a data-dense product, these components carry the information architecture across every major workflow.',
    components: [
      {
        name: 'Data Table', desc: 'Sortable, paginated tabular data', year: '2024', Thumb: DataTableThumb,
        detail: {
          before: 'Three different table implementations existed in the codebase, none with sticky headers. Sorting was client-side only with no visual feedback. Pagination was inconsistent across products. Column resizing was non-existent.',
          changes: [
            'Single Table component with composable column definitions',
            'Sticky header on scroll, critical for long data sets',
            'Sort indicator: directional arrow icon animates on click, supports multi-sort',
            'Pagination: page numbers + prev/next + configurable results-per-page',
            'Row selection with checkbox column + select-all with indeterminate state',
            'Empty state built directly into the component, no extra work needed',
            'Column resizing via drag handle',
          ],
          outcome: "Replaced all 3 legacy table implementations. The Data Table is now Q2's most-used component by line count, a single update propagates to every product simultaneously.",
        },
      },
      {
        name: 'Metric Card', desc: 'KPI display with trend indicators', year: '2023', Thumb: MetricCardThumb,
        detail: {
          before: 'No shared component. Each team built KPI cards from scratch, different font sizes, different padding, no consistent trend indicator. Comparing numbers across products felt like reading different newspapers.',
          changes: [
            'Shared MetricCard with value, label, and trend slot',
            'Trend indicator: animated number change on data refresh, directional arrow, color-coded delta',
            'Sparkline variant for time-series data (uses a lightweight SVG path)',
            'Loading skeleton state built in',
            'Compact variant for dense dashboard grid layouts',
          ],
          outcome: 'Used in 4 dashboard products. A single update to trend indicator logic rolls out everywhere simultaneously, the "one source of truth" that used to only exist as a principle.',
        },
      },
      {
        name: 'Status Badge', desc: 'Semantic labeling and state communication', year: '2022', Thumb: StatusBadgeThumb,
        detail: {
          before: 'Status was communicated entirely through color, no accessible alternative. No consistent size scale. Teams used ad-hoc colored <span> elements with inline styles. Screen readers announced nothing meaningful.',
          changes: [
            'Semantic variants: success / warning / error / info / neutral',
            'Size scale: sm / md / lg',
            'Optional leading icon per variant, status is never color-only',
            'Outline variant for lower-emphasis contexts',
            'Dot variant (icon-only) for compact table cell usage',
            'All color choices pass WCAG 4.5:1 contrast on cream background',
          ],
          outcome: "Status is now consistently communicated across all surfaces. Screen readers announce badge intent correctly, no more 'green text that says Active' with no semantic meaning.",
        },
      },
      {
        name: 'Progress Indicator', desc: 'Completion and loading visualization', year: '2023', Thumb: ProgressThumb,
        detail: {
          before: 'Each product had its own custom loading spinner, four different designs. Progress bars as a component did not exist. Step indicators for multi-step flows were all one-off builds.',
          changes: [
            'Linear progress bar: determinate (with value) and indeterminate (animated) modes',
            'Circular spinner replacing 4 diverged custom spinner implementations',
            'Step indicator for multi-step flows: completed / current / upcoming states with animation',
            'Skeleton loading component that replaces blank space during data fetch',
            'All variants respect prefers-reduced-motion',
          ],
          outcome: 'Standardized loading states across the product. In user testing, the skeleton component reduced perceived load time, users reported pages feeling faster even with identical network conditions.',
        },
      },
    ],
  },
  {
    id: 'feedback',
    label: 'Feedback & Overlays',
    accent: '#E8A0B0',
    textAccent: FEEDBACK_TEXT,
    description: 'The moments users need guidance, errors, confirmations, empty states, often the most overlooked in legacy systems.',
    components: [
      {
        name: 'Alert Banner', desc: 'Inline contextual messaging', year: '2023', Thumb: AlertThumb,
        detail: {
          before: 'Alert-like patterns existed but were plain divs with hardcoded background colors. No icon. No dismiss behavior. No consistent placement rules. Severity was communicated by color alone, failing accessibility from day one.',
          changes: [
            '4 severity variants: info / success / warning / error',
            'Left accent border + semantic icon per variant, severity is never color-only',
            'Dismissible with animated exit (height collapse + fade)',
            'Inline and full-width display modes for different contexts',
            'Action slot for a CTA button or link inside the alert',
          ],
          outcome: 'Error messaging in critical banking workflows now communicates severity clearly. Accessibility audit passed on first review, no color-only failure modes anywhere in the product.',
        },
      },
      {
        name: 'Toast Notification', desc: 'Ephemeral status feedback', year: '2023', Thumb: ToastThumb,
        detail: {
          before: "Custom toast implementation per product, one used React Hot Toast, one was custom-built, one used browser alert(). No shared pattern. No consistent positioning, duration, or style.",
          changes: [
            'Unified ToastQueue context provider, one integration, works across all products',
            '4 variants matching alert severity: success / error / warning / info',
            'Auto-dismiss with configurable duration, pauses on hover',
            'Action button slot for Undo patterns',
            'Stack behavior: max 3 visible, queues additional toasts',
            'Position: bottom-right by default, configurable per product',
          ],
          outcome: 'Eliminated 3 separate toast libraries from the codebase. Notifications are consistent, queueable, and accessible, all announced correctly to screen readers.',
        },
      },
      {
        name: 'Empty State', desc: 'Zero-data views with clear calls to action', year: '2024', Thumb: EmptyStateThumb,
        detail: {
          before: "Empty states were a universal afterthought, blank white space or plain 'No results.' text. No illustration. No action. Users arriving at an empty view had no guidance on what to do next.",
          changes: [
            'EmptyState component with illustration slot, heading, body, and action',
            '3 built-in illustration types: no-data / no-results / error',
            'Custom illustration slot for product-specific contexts',
            'Primary CTA button slot built in, the most common action for that empty state',
            'Consistent sizing and spacing regardless of parent container',
          ],
          outcome: "Empty states went from the most-complained-about experience in user research to a clear, actionable moment. Conversion from 'empty state → completing first action' improved 34%.",
        },
      },
      {
        name: 'Modal & Dialog', desc: 'Focused overlay for confirmations and forms', year: '2024', Thumb: ModalThumb,
        detail: {
          before: "Modal was implemented differently in every product. Some implementations didn't trap focus correctly. One couldn't be closed with Escape. None prevented background scroll. Destructive actions had no special treatment.",
          changes: [
            'Single Modal component with proper focus trap (focus-trap-react)',
            'Escape key dismissal + backdrop click dismissal, both handled correctly',
            'Background scroll lock on open',
            'Animated open/close: scale + fade, respects prefers-reduced-motion',
            'Size variants: sm / md / lg / full',
            'Confirmation Dialog variant with built-in two-button layout',
            'Alert Dialog for destructive actions, cancel-first button order per accessibility guidelines',
          ],
          outcome: 'All modal interactions now meet WCAG 2.1 AA. Focus management was the #1 accessibility failure in the previous audit, zero failures in that category after this rollout.',
        },
      },
    ],
  },
]

const STATS = [
  { value: '20',   label: 'Components Rebuilt' },
  { value: '6',    label: 'Teams Adopted' },
  { value: '20M+', label: 'Users Affected' },
  { value: '0',    label: 'Giant Initiatives Required' },
]

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

function ComponentTile({ name, desc, year, Thumb, color, textColor, onClick }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col w-full text-left p-0 appearance-none rounded-xl overflow-hidden border border-ink/[0.07] bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink/40"
      onClick={onClick}
      aria-label={`${name}: ${desc}. View before-and-after details.`}
    >
      {/* Illustration (decorative schematic) */}
      <div className="aspect-[16/9] relative overflow-hidden" style={{ backgroundColor: color + '16' }} aria-hidden="true">
        <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.04] p-3">
          <Thumb color={color} />
        </div>
      </div>
      {/* Info */}
      <div className="px-4 py-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-sans text-[13px] font-semibold text-ink leading-tight">{name}</p>
          <p className="font-sans text-xs text-ink/65 mt-0.5 leading-relaxed">{desc}</p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span
            className="font-sans text-[10px] font-bold tracking-widest"
            style={{ color: textColor }}
          >
            {year}
          </span>
          <span className="font-sans text-[9px] text-ink/65 tracking-wide">tap for details</span>
        </div>
      </div>
    </motion.button>
  )
}

// ─── Component detail modal ────────────────────────────────────────────────────
function ComponentModal({ comp, color, textColor, categoryLabel, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 pointer-events-none">
        <motion.div
          className="relative bg-white rounded-2xl w-full max-w-xl max-h-[88vh] overflow-y-auto shadow-2xl pointer-events-auto"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Illustration header */}
          <div
            className="aspect-[16/9] relative overflow-hidden rounded-t-2xl"
            style={{ backgroundColor: color + '1E' }}
          >
            <div className="absolute inset-0 p-6" aria-hidden="true">
              <comp.Thumb color={color} />
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-ink/50 hover:text-ink hover:bg-white transition-all duration-150 shadow-sm text-sm"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          {/* Accent bar */}
          <div className="h-[3px] w-full" style={{ backgroundColor: color }} />

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase"
                  style={{ color: textColor }}
                >
                  {categoryLabel}
                </span>
                <span className="text-ink/65">·</span>
                <span className="font-sans text-[11px] text-ink/65">{comp.year}</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-ink leading-tight">{comp.name}</h3>
              <p className="font-sans text-sm text-ink/65 mt-1">{comp.desc}</p>
            </div>

            {/* Before */}
            <div className="mb-6">
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-ink/65 mb-2">Before</p>
              <p className="font-sans text-sm text-ink/65 leading-relaxed">{comp.detail.before}</p>
            </div>

            {/* What changed */}
            <div className="mb-6">
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-ink/65 mb-3">What changed</p>
              <ul className="space-y-2.5">
                {comp.detail.changes.map((change, i) => (
                  <li key={i} className="flex items-start gap-3 font-sans text-sm text-ink/65 leading-relaxed">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[6px]"
                      style={{ backgroundColor: color }}
                    />
                    {change}
                  </li>
                ))}
              </ul>
            </div>

            {/* Outcome */}
            <div
              className="rounded-xl p-5 border"
              style={{ borderColor: color + '45', background: color + '0E' }}
            >
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-ink/65 mb-2">Outcome</p>
              <p className="font-sans text-sm text-ink/70 leading-relaxed">{comp.detail.outcome}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default function DesignSystem() {
  usePageMeta(
    'Q2 Component Library by Stephen Hurt',
    'How I reframed a decade of stalled UI modernization into a sprint-based practice: 20 accessible components, adopted across 6 teams, reaching 20M+ banking users.'
  )
  const [selected, setSelected] = useState(null)
  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 800], ['0%', '-18%'])

  return (
    <main style={{ backgroundColor: BG, color: TEXT }}>


      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-0 h-screen overflow-hidden flex flex-col justify-end">
        <motion.div
          className="absolute pointer-events-none"
          style={{ y: bgY, top: '-20%', bottom: '-20%', left: 0, right: 0 }}
        >
          {/* Placeholder background: hero image will be added here */}
          <div className="absolute inset-0" style={{ backgroundColor: BG }} />
          {/* Subtle periwinkle glow top-right */}
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse at 75% 25%, rgba(123,158,199,0.18) 0%, transparent 60%)`,
          }} />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-48" style={{
            background: `linear-gradient(to bottom, transparent, ${BG})`,
          }} />

          {/* Floating component sketch illustrations */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none hidden lg:block" aria-hidden="true">
            <motion.div
              className="absolute"
              style={{ top: '14%', right: '18%', width: 210 }}
              initial={{ opacity: 0, y: 20, rotate: -4 }}
              animate={{ opacity: 0.22, y: 0, rotate: -4 }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-xl overflow-hidden shadow-lg p-2" style={{ backgroundColor: CARD, border: `1px solid ${RULE}` }}>
                <DataTableThumb color="#7BBF7A" />
              </div>
            </motion.div>
            <motion.div
              className="absolute"
              style={{ top: '46%', right: '4%', width: 200 }}
              initial={{ opacity: 0, y: 20, rotate: 5 }}
              animate={{ opacity: 0.18, y: 0, rotate: 5 }}
              transition={{ duration: 1.1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-xl overflow-hidden shadow-lg p-2" style={{ backgroundColor: CARD, border: `1px solid ${RULE}` }}>
                <ButtonThumb color="#E8C547" />
              </div>
            </motion.div>
            <motion.div
              className="absolute"
              style={{ top: '24%', right: '1%', width: 215 }}
              initial={{ opacity: 0, y: 20, rotate: 3 }}
              animate={{ opacity: 0.15, y: 0, rotate: 3 }}
              transition={{ duration: 1.1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="rounded-xl overflow-hidden shadow-lg p-2" style={{ backgroundColor: CARD, border: `1px solid ${RULE}` }}>
                <GlobalHeaderThumb color="#7B9EC7" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        <div className="relative z-10 px-8 md:px-14 pb-16 md:pb-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap gap-2 mb-7"
          >
            {['Design Systems', 'Enterprise SaaS', 'Q2'].map(t => (
              <span key={t} className="font-sans text-xs px-3 py-1.5 rounded-full border"
                style={{ borderColor: `${ACCENT}50`, color: NAV_TEXT }}>{t}</span>
            ))}
          </motion.div>

          <div className="overflow-hidden mb-5">
            <motion.h1
              initial={{ y: '110%' }} animate={{ y: '0%' }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black leading-[0.88]"
              style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)', color: TEXT }}
            >
              Q2 Component<br />Library Refresh
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="font-sans text-lg leading-relaxed max-w-xl"
            style={{ color: DIM }}
          >
            A decade of failed modernization initiatives. The right diagnosis before the crisis hit. One reframe, zero to one, fast, that changed how Q2 thinks about visual quality.
          </motion.p>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-px h-12 overflow-hidden mx-auto">
            <motion.div className="w-full h-full" style={{ backgroundColor: DIMMER }}
              animate={{ y: ['-100%', '100%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.4 }} />
          </div>
        </motion.div>
      </section>

      <div className="relative z-10" style={{ backgroundColor: BG }}>

      {/* ── TL;DR ────────────────────────────────────────────────────────────── */}
      <CaseTLDR
        colors={{ text: TEXT, dim: DIM, accent: NAV_TEXT, surface: SURFACE, rule: RULE }}
        summary={`Every attempt to modernize Q2's UI had died as a giant initiative. I reframed it as "zero to one, one component per sprint," so visual and accessibility debt gets fixed incrementally, in regular sprints, instead of waiting on a dedicated initiative that never arrives. The model spread to the whole design team.`}
        stats={[
          { value: '20', label: 'Components rebuilt to a modern, accessible baseline' },
          { value: '6', label: 'Product teams adopted the model' },
          { value: '20M+', label: 'Users across 500+ institutions' },
          { value: '0', label: 'Big-bang initiatives, every fix ships in a sprint' },
        ]}
      />

      {/* ── OVERVIEW ─────────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 py-14 border-t border-b" style={{ borderColor: RULE }}>
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { label: 'Role',     value: 'Lead Product Designer - end-to-end' },
              { label: 'Scope',    value: '20 components across 4 categories' },
              { label: 'Platform', value: 'Enterprise SaaS - 5 product lines' },
              { label: 'Impact',   value: '20M+ users · $8.2M enterprise deal' },
            ].map(item => (
              <div key={item.label}>
                <p className="font-sans text-xs tracking-[0.18em] uppercase mb-3" style={{ color: DIMMER }}>{item.label}</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{item.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── THE STRATEGY ─────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 pt-28">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp}>
            <SectionLabel>The Strategy</SectionLabel>
            <h2 className="font-display font-black leading-[0.9] mt-2 mb-10"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', color: TEXT, maxWidth: '22ch' }}>
              Years of failed initiatives. One catalyst. One reframe.
            </h2>
          </motion.div>

          <motion.div {...fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-14 items-start mb-16">
            <div className="space-y-5" style={{ color: DIM }}>
              <p className="font-sans text-base leading-relaxed">
                I'd already identified the problem before the crisis hit. Every attempt to modernize the UI
                had been framed as a giant initiative, and giant initiatives die. They compete for roadmap space,
                get deprioritized when real bugs emerge, get shelved when quarterly priorities shift.
              </p>
              <p className="font-sans text-base leading-relaxed">
                After years of that cycle, components had accumulated serious visual debt, some untouched for close to a
                decade. I'd already made the case to leadership and gotten the green light to start. Then an incident gave the whole org a reason to finally care.
              </p>
            </div>

            {/* The trigger callout */}
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: CARD, border: `1px solid ${RULE}` }}>
              <div className="h-1 w-full" style={{ backgroundColor: '#E8A0B0' }} />
              <div className="p-7">
                <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: FEEDBACK_TEXT }}>The Full Story</p>
                <p className="font-display text-lg font-bold mb-4" style={{ color: TEXT }}>
                  I flagged the problem. The org picked the wrong solution. I used the moment anyway.
                </p>
                <p className="font-sans text-sm leading-relaxed mb-3" style={{ color: DIM }}>
                  The CTO presented the product in an enterprise sales demo and the prospects laughed at the UI. He walked out furious, with a mandate to fix it. The org landed on "aesthetic templates", new paint on a crumbling foundation.
                </p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>
                  I used the urgency to accelerate the component work that would make the templates credible. The house analogy: we have misshapen windows and a crumbling roof, my component work was the actual renovation.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Accessibility debt callout */}
          <motion.div {...fadeUp} className="rounded-2xl overflow-hidden mb-16" style={{ backgroundColor: CARD, border: `1px solid ${RULE}` }}>
            <div className="h-1 w-full" style={{ backgroundColor: '#E8A0B0' }} />
            <div className="p-7">
              <p className="font-sans text-[10px] font-bold tracking-[0.2em] uppercase mb-3" style={{ color: FEEDBACK_TEXT }}>Not Just Visual Debt</p>
              <p className="font-display text-lg font-bold mb-5" style={{ color: TEXT }}>
                Dozens of components had gone years without a visual refresh. The visual problems were obvious. The accessibility failures were worse.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { label: 'Color-only status', body: 'Status badges and alert components communicated severity through color alone. Screen readers announced nothing meaningful. Roughly 8% of users were receiving no semantic signal at all.' },
                  { label: 'Broken keyboard flows', body: '6 critical transaction flows were inaccessible without a mouse. Custom dropdowns had no keyboard support. Modal focus traps were missing or broken, a WCAG 2.1 AA failure category.' },
                  { label: 'Missing ARIA roles', body: 'Toggle switches had no role="switch". Tab bars had no role="tablist". Browser-default form controls rendered differently across every OS and browser with no accessible override.' },
                  { label: 'Unresolved for years', body: "These were known issues. They persisted because they got thrown in the 'modernize the UI' initiative pile along with everything else. The sprint model finally broke that cycle." },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ backgroundColor: SURFACE }}>
                    <p className="font-sans text-xs font-semibold mb-1.5" style={{ color: FEEDBACK_TEXT }}>{item.label}</p>
                    <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Three-act story */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px mb-20" style={{ backgroundColor: RULE }}>
            {[
              {
                num: '01',
                accent: '#7B9EC7',
                heading: 'The diagnosis, before the crisis',
                body: "I'd already identified the root problem and made the case to the Director and VP of Product. Every modernization attempt got absorbed into the same giant 'modernize the UI' initiative - which meant it never had a clear owner, never fit cleanly into a sprint, and sat in a shared backlog accumulating debt year after year.",
              },
              {
                num: '02',
                accent: '#E8C547',
                heading: 'The moment, and the move',
                body: "When the org convened after the CTO incident, they landed on an 'aesthetic templates' project, high visibility, wrong diagnosis. The templates could only look as good as the components underneath them. Rather than fighting the initiative, I used the urgency it created to move as fast as possible on the component work.",
              },
              {
                num: '03',
                accent: '#7BBF7A',
                heading: 'Zero to one, fast',
                body: "A component untouched for five or more years is effectively at zero. So the goal wasn't perfection, it was getting each component to a modern, credible baseline in a single sprint. I worked directly with the PM and developers throughout: every ticket grooming session, every sprint planning meeting, every daily standup. That visibility meant questions got answered in real time, so nothing stalled waiting on a design decision. One component, one sprint, done. That approach became the template other designers could follow without needing a separate initiative to justify it.",
              },
            ].map((act, i) => (
              <motion.div
                key={act.num}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-10" style={{ backgroundColor: BG }}
              >
                <p className="font-display text-5xl font-black mb-5" style={{ color: act.accent, opacity: 0.3 }}>{act.num}</p>
                <p className="font-display text-xl font-bold mb-3" style={{ color: TEXT }}>{act.heading}</p>
                <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{act.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Pull quote */}
          <motion.div {...fadeUp} className="pl-8 md:pl-10 max-w-2xl mb-4" style={{ borderLeft: `3px solid ${ACCENT}` }}>
            <p className="font-display font-black leading-tight mb-4"
              style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)', color: TEXT }}>
              "Zero to one. A component that hasn't been touched in five years is at zero."
            </p>
            <p className="font-sans text-sm leading-relaxed" style={{ color: DIMMER }}>
              The framing that drove the approach, not perfection, not a comprehensive system audit, just getting every component to a modern, credible baseline as fast as possible, without standing up a separate initiative to justify each one.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── COMPONENT SHOWCASE ───────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 pt-28">
        <div className="max-w-6xl mx-auto">
          <Rule />
          <div className="pt-20">
            <motion.div {...fadeUp}>
              <SectionLabel>Component Showcase</SectionLabel>
              <h2 className="font-display font-black leading-[0.9] mt-2 mb-5"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', color: TEXT }}>
                What was built.
              </h2>
            </motion.div>
            <motion.p {...fadeUp} className="font-sans text-base leading-relaxed mb-4 max-w-2xl" style={{ color: DIM }}>
              20 components across 4 categories, each taken from a legacy state to a modern baseline.
              Visual quality improvements, not interaction redesigns: the goal was to close a decade of visual debt
              as quickly as possible, working directly with developers in-sprint rather than through a separate modernization initiative.
            </motion.p>
            <motion.p {...fadeUp} className="font-sans text-xs leading-relaxed max-w-2xl mb-16 italic" style={{ color: DIMMER }}>
              Tap any component to see the before state, what changed, and the outcome.
            </motion.p>

            <div className="space-y-20">
              {CATEGORIES.map((cat, catIdx) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: cat.accent }} />
                    <div>
                      <h3 className="font-display font-black leading-tight mb-1"
                        style={{ fontSize: 'clamp(1.3rem, 2.2vw, 1.9rem)', color: TEXT }}>
                        {cat.label}
                      </h3>
                      <p className="font-sans text-sm max-w-xl leading-relaxed" style={{ color: DIM }}>{cat.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {cat.components.map((comp, i) => (
                      <motion.div
                        key={comp.name}
                        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <ComponentTile
                          {...comp}
                          color={cat.accent}
                          textColor={cat.textAccent}
                          onClick={() => setSelected({ comp, category: cat })}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── OUTCOMES ─────────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 pt-28">
        <div className="max-w-6xl mx-auto">
          <Rule />
          <div className="pt-20">
            <motion.div {...fadeUp}>
              <SectionLabel>Outcomes</SectionLabel>
              <h2 className="font-display font-black leading-[0.9] mt-2 mb-16"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', color: TEXT }}>
                What changed.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {[
                {
                  accent: '#7BBF7A',
                  heading: 'The CTO mandate, met',
                  body: "The work began because enterprise prospects were laughing at the UI in sales demos. The goal wasn't subtle, it was a product that could hold its own in front of demanding buyers. The UI is no longer the thing that stalls a conversation before it can get started.",
                },
                {
                  accent: '#7B9EC7',
                  heading: 'A new organizational model',
                  body: "Before this, fixing visual debt required VP approval, a six-month runway, and a project manager. The approach here changed how the org thinks about this category of work entirely. Visual debt is now treated like technical debt: addressed incrementally, in sprints. The model spread to every designer on the team.",
                },
                {
                  accent: '#E8C547',
                  heading: 'Accessibility failures finally resolved',
                  body: "Color-only status indicators, broken keyboard flows across 6 critical transactions, missing ARIA roles - these weren't new problems. They were known, documented, and deprioritized for years because fixing them required a dedicated initiative. The sprint model resolved them one component at a time. The modal alone went from the platform's top accessibility failure category to zero violations in a single audit cycle.",
                },
              ].map((item, i) => (
                <motion.div key={item.heading} {...fadeUp}
                  className="rounded-2xl p-8" style={{ backgroundColor: item.accent + '10', border: `1px solid ${item.accent}35` }}>
                  <h3 className="font-display text-xl font-bold mb-3" style={{ color: TEXT }}>{item.heading}</h3>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: DIM }}>{item.body}</p>
                </motion.div>
              ))}
            </div>

            {/* Stats grid */}
            <motion.div {...fadeUp} className="rounded-2xl p-8" style={{ backgroundColor: CARD, border: `1px solid ${RULE}` }}>
              <p className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase mb-6" style={{ color: DIMMER }}>By the numbers</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { value: '20',   label: 'Components rebuilt',      sub: 'From legacy baseline to modern, accessible standard' },
                  { value: '6',    label: 'Teams adopted',           sub: 'Automatic on Tecton upgrade. Every change was backwards-compatible and additive, so nothing breaks when a team upgrades.' },
                  { value: '20M+', label: 'Users affected',          sub: 'The UI they see in every session, across 500+ financial institutions' },
                  { value: '0',    label: 'Big-bang initiatives',    sub: 'Every improvement shipped in a regular sprint, with no separate initiative required' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display font-black mb-1" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: TEXT }}>{s.value}</p>
                    <p className="font-sans text-sm font-semibold mb-1" style={{ color: DIM }}>{s.label}</p>
                    <p className="font-sans text-xs leading-snug" style={{ color: DIMMER }}>{s.sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LIVING SYSTEM ────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 pb-10">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeUp} className="rounded-2xl p-8" style={{ backgroundColor: ACCENT_D, border: `1px solid ${ACCENT}35` }}>
            <p className="font-sans text-[10px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: NAV_TEXT }}>Still in progress</p>
            <p className="font-display text-xl font-bold mb-3" style={{ color: TEXT }}>20 components shipped. More in every sprint.</p>
            <p className="font-sans text-sm leading-relaxed max-w-2xl" style={{ color: DIM }}>
              This isn't a completed project - it's an ongoing practice. Every two-week sprint ships at least one updated component to production. The 20 components documented here represent the current state. The model is the point: visual and accessibility debt gets addressed continuously, not in a future initiative that never arrives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── NEXT PROJECT ─────────────────────────────────────────────────────── */}
      <section className="px-8 md:px-14 pt-28 pb-28">
        <div className="max-w-6xl mx-auto">
          <Rule />
          <motion.div {...fadeUp} className="pt-16">
            <Link to="/messaging-redesign" className="group inline-block mt-4">
              <p className="font-sans text-sm mb-2" style={{ color: DIMMER }}>Next project</p>
              <h3
                className="font-display font-black leading-[0.9] transition-opacity duration-300 group-hover:opacity-40"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)', color: TEXT }}
              >
                Secure Messaging
              </h3>
            </Link>
          </motion.div>
        </div>
      </section>

      </div>

      {/* ── Component detail modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {selected && (
          <ComponentModal
            key={selected.comp.name}
            comp={selected.comp}
            color={selected.category.accent}
            textColor={selected.category.textAccent}
            categoryLabel={selected.category.label}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

    </main>
  )
}
