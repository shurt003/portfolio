import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* Anything lazy-loaded from these paths is private and must not be readable
   without a session cookie. Emitting those chunks under /assets/gated/ lets the
   edge middleware block them with one prefix rule instead of a list of
   filenames that someone has to remember to update. Add a new case study and it
   is covered automatically. */
const GATED_SOURCES = ['/pages/case-studies/', '/pages/Work.jsx']

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        chunkFileNames(chunk) {
          const id = chunk.facadeModuleId || ''
          const gated = GATED_SOURCES.some((frag) => id.includes(frag))
          return gated ? 'assets/gated/[name]-[hash].js' : 'assets/[name]-[hash].js'
        },
      },
    },
  },
})
