import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { NavThemeProvider } from './contexts/NavTheme'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import MotionLab from './pages/MotionLab'
import CaseStudyGate from './components/CaseStudyGate'

/* Everything behind the gate is loaded on demand rather than bundled into the
   entry chunk. Two reasons: an anonymous visitor to the homepage no longer
   downloads the full text of every case study, and the gated content ends up in
   its own files, which is what makes blocking it at the edge possible. */
const Work                  = lazy(() => import('./pages/Work'))
const MagicSignal           = lazy(() => import('./pages/case-studies/MagicSignal'))
const Q2Clarity             = lazy(() => import('./pages/case-studies/Q2Clarity'))
const Q2CodeAgents          = lazy(() => import('./pages/case-studies/Q2CodeAgents'))
const BrandIdentityTokensV2 = lazy(() => import('./pages/case-studies/BrandIdentityTokensV2'))
const BrandIdentityTokens   = lazy(() => import('./pages/case-studies/BrandIdentityTokens'))

// Footer height as a CSS custom property so the spacer and footer stay in sync
const FOOTER_CSS = `
  :root {
    --footer-h: 180px;
  }
  @media (min-width: 640px) {
    :root { --footer-h: 140px; }
  }
  @media (min-width: 768px) {
    :root { --footer-h: 110px; }
  }
`

function AppContent() {

  return (
    <>
      <style>{FOOTER_CSS}</style>
      <ScrollToTop />

      {/* Content sits above the fixed footer via z-10 + solid bg */}
      <div className="relative z-10 bg-[#F5F0E8]">
        <Nav />
        {/* Only the lazy routes below suspend; the public pages render immediately
            and never hit this fallback. Cream matches the page ground so a slow
            chunk fetch reads as a pause rather than a white flash. */}
        <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#F5F0E8' }} />}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Projects page retired: old links land on the Work page */}
          <Route path="/projects" element={<Navigate to="/work" replace />} />
          {/* Retired case studies: old links land on the Work page */}
          {['/interstitial', '/messaging-redesign', '/validation', '/alerts-redesign', '/design-system'].map((path) => (
            <Route key={path} path={path} element={<Navigate to="/work" replace />} />
          ))}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/motion-lab" element={<MotionLab />} />
          {/* Case studies (and the Work index) sit behind the shared password gate */}
          <Route element={<CaseStudyGate />}>
            <Route path="/work" element={<Work />} />
            <Route path="/magic-signal" element={<MagicSignal />} />
            <Route path="/q2-clarity" element={<Q2Clarity />} />
            <Route path="/q2code-agents" element={<Q2CodeAgents />} />
            <Route path="/brand-identity-tokens-v2" element={<BrandIdentityTokensV2 />} />
            {/* thrive Money page retired in favor of Q2 Clarity: old links land on the new study */}
            <Route path="/enhanced-money-hub" element={<Navigate to="/q2-clarity" replace />} />
            <Route path="/brand-identity-tokens" element={<BrandIdentityTokens />} />
          </Route>
        </Routes>
        </Suspense>
      </div>

      <div style={{ height: 'var(--footer-h)' }} />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <NavThemeProvider>
          <AppContent />
        </NavThemeProvider>
      </BrowserRouter>
    </MotionConfig>
  )
}
