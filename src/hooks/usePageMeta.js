import { useEffect } from 'react'

/*
  usePageMeta — sets a unique document <title> and meta description for a route,
  and restores the previous values on unmount. Lightweight alternative to
  react-helmet for a small SPA. Call once at the top of a page component:

    usePageMeta('Q2 Component Library — Stephen Hurt', 'How I reframed …')
*/
export default function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title
    if (title) document.title = title

    let metaEl = document.querySelector('meta[name="description"]')
    let createdMeta = false
    let prevDesc = null
    if (description) {
      if (!metaEl) {
        metaEl = document.createElement('meta')
        metaEl.setAttribute('name', 'description')
        document.head.appendChild(metaEl)
        createdMeta = true
      } else {
        prevDesc = metaEl.getAttribute('content')
      }
      metaEl.setAttribute('content', description)
    }

    return () => {
      document.title = prevTitle
      if (metaEl) {
        if (createdMeta) metaEl.remove()
        else if (prevDesc !== null) metaEl.setAttribute('content', prevDesc)
      }
    }
  }, [title, description])
}
