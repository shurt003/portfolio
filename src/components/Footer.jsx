import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer
      className="fixed bottom-0 inset-x-0 z-0 overflow-hidden"
      style={{ height: 'var(--footer-h)', backgroundColor: '#0D0F14' }}
    >
      <div className="h-full flex items-center px-6 md:px-14 lg:px-20 max-w-[1400px] mx-auto w-full">
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
          <p className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            © 2026 Stephen Hurt. Designed & built in Austin, TX.
          </p>
          <div className="flex gap-8">
            {[
              { label: 'Work', href: '/work' },
              { label: 'Motion Lab', href: '/motion-lab' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ].map(link => (
              <Link
                key={link.label}
                to={link.href}
                className="font-sans text-sm transition-opacity duration-200 hover:opacity-70"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
