import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Netlify handles form submission when deployed
    setSent(true)
  }

  return (
    <main className="min-h-screen bg-cream pt-28 pb-24 px-8 md:px-14">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <p className="font-sans text-xs tracking-widest uppercase text-ink/50 mb-3">Contact</p>
          <h1 className="font-display text-5xl md:text-6xl font-bold text-ink leading-tight">
            Let's talk.
          </h1>
          <p className="font-sans text-base text-ink/60 mt-4">
            Open to new opportunities, collaborations, or just a good conversation about design.
          </p>
        </motion.div>

        {sent ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="bg-sage/20 border border-sage/40 rounded-2xl p-10 text-center"
          >
            <div className="text-4xl mb-4">👋</div>
            <h2 className="font-display text-2xl font-bold text-ink mb-2">Message sent!</h2>
            <p className="font-sans text-base text-ink/60">I'll get back to you soon.</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit}
            name="contact"
            method="POST"
            data-netlify="true"
            className="space-y-6"
          >
            <input type="hidden" name="form-name" value="contact" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-sans text-xs tracking-widest uppercase text-ink/50 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-ink/20 rounded-xl px-4 py-3 font-sans text-base text-ink placeholder-ink/30 focus:outline-none focus:border-periwinkle transition-colors duration-200"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block font-sans text-xs tracking-widest uppercase text-ink/50 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-transparent border border-ink/20 rounded-xl px-4 py-3 font-sans text-base text-ink placeholder-ink/30 focus:outline-none focus:border-periwinkle transition-colors duration-200"
                  placeholder="you@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block font-sans text-xs tracking-widest uppercase text-ink/50 mb-2">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={6}
                value={form.message}
                onChange={handleChange}
                className="w-full bg-transparent border border-ink/20 rounded-xl px-4 py-3 font-sans text-base text-ink placeholder-ink/30 focus:outline-none focus:border-periwinkle transition-colors duration-200 resize-none"
                placeholder="What's on your mind?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-ink text-cream font-sans text-sm font-600 py-4 rounded-full hover:bg-ink/80 transition-colors duration-200"
            >
              Send Message →
            </button>
          </motion.form>
        )}

        {/* Alternate contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-16 pt-10 border-t border-ink/10"
        >
          <p className="font-sans text-sm text-ink/50 mb-4">Or find me on</p>
          <a
            href="https://www.linkedin.com/in/schurt/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-base font-500 text-ink hover:text-periwinkle transition-colors duration-200 border-b border-ink/20 hover:border-periwinkle pb-0.5"
          >
            LinkedIn →
          </a>
        </motion.div>
      </div>
    </main>
  )
}
