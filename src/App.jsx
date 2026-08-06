import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { NavThemeProvider } from './contexts/NavTheme'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Work from './pages/Work'
import About from './pages/About'
import Contact from './pages/Contact'
import MotionLab from './pages/MotionLab'
import MessagingRedesign from './pages/case-studies/MessagingRedesign'
import MagicSignal from './pages/case-studies/MagicSignal'
import Validation from './pages/case-studies/Validation'
import Interstitial from './pages/case-studies/Interstitial'
import AlertsRedesign from './pages/case-studies/AlertsRedesign'
import DesignSystem from './pages/case-studies/DesignSystem'
import Q2Clarity from './pages/case-studies/Q2Clarity'
import BrandIdentityTokens from './pages/case-studies/BrandIdentityTokens'
import CaseStudyGate from './components/CaseStudyGate'

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
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Projects page retired: old links land on the Work page */}
          <Route path="/projects" element={<Navigate to="/work" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/motion-lab" element={<MotionLab />} />
          {/* Case studies (and the Work index) sit behind a shared cosmetic password gate */}
          <Route element={<CaseStudyGate />}>
            <Route path="/work" element={<Work />} />
            <Route path="/messaging-redesign" element={<MessagingRedesign />} />
            <Route path="/magic-signal" element={<MagicSignal />} />
            <Route path="/validation" element={<Validation />} />
            <Route path="/interstitial" element={<Interstitial />} />
            <Route path="/alerts-redesign" element={<AlertsRedesign />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/q2-clarity" element={<Q2Clarity />} />
            {/* thrive Money page retired in favor of Q2 Clarity: old links land on the new study */}
            <Route path="/enhanced-money-hub" element={<Navigate to="/q2-clarity" replace />} />
            <Route path="/brand-identity-tokens" element={<BrandIdentityTokens />} />
          </Route>
        </Routes>
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
