import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { NavThemeProvider } from './contexts/NavTheme'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Projects from './pages/Projects'
import About from './pages/About'
import Contact from './pages/Contact'
import MotionLab from './pages/MotionLab'
import Orchestration from './pages/Orchestration'
import ConsumerDashboard from './pages/case-studies/ConsumerDashboard'
import MessagingRedesign from './pages/case-studies/MessagingRedesign'
import DesignSystem from './pages/case-studies/DesignSystem'
import MagicSignal from './pages/case-studies/MagicSignal'
import Validation from './pages/case-studies/Validation'
import Interstitial from './pages/case-studies/Interstitial'
import ClaudeCode from './pages/case-studies/ClaudeCode'
import CaseStudyGate from './components/CaseStudyGate'

// Footer height as a CSS custom property so the spacer and footer stay in sync
const FOOTER_CSS = `
  :root {
    --footer-h: 560px;
  }
  @media (min-width: 640px) {
    :root { --footer-h: 500px; }
  }
  @media (min-width: 768px) {
    :root { --footer-h: 460px; }
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
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/motion-lab" element={<MotionLab />} />
          {/* Unlisted concept page (not linked in nav) */}
          <Route path="/orchestration" element={<Orchestration />} />
          {/* Case studies sit behind a shared cosmetic password gate */}
          <Route element={<CaseStudyGate />}>
            <Route path="/consumer-dashboard" element={<ConsumerDashboard />} />
            <Route path="/messaging-redesign" element={<MessagingRedesign />} />
            <Route path="/design-system" element={<DesignSystem />} />
            <Route path="/magic-signal" element={<MagicSignal />} />
            <Route path="/validation" element={<Validation />} />
            <Route path="/interstitial" element={<Interstitial />} />
            <Route path="/claude-code" element={<ClaudeCode />} />
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
