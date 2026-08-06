import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { hash, key } = useLocation()
  // key changes on every navigation (even to the same URL), so repeat clicks
  // on an anchor link still re-scroll to the target.
  useEffect(() => {
    if (hash) {
      // Let the destination page mount before scrolling to the anchor
      const t = setTimeout(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
      return () => clearTimeout(t)
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [key, hash])
  return null
}
