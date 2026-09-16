import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Send } from 'lucide-react'
import { SectionTitle } from './ui/Brand'
import { RippleButton } from './ui/MotionBits'
import { Container } from './ui/Container'

const empty = { name: '', email: '', message: '', news: '' }

export function Newsletter() {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const [joined, setJoined] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validateContact = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Tell us what to call you'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'A real email helps us reply'
    if (form.message.trim().length < 8) next.message = 'A little more detail, please'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onContact = (e) => {
    e.preventDefault()
    if (!validateContact()) return
    setSent(true)
    setForm(empty)
  }

  const onNews = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.news)) {
      setErrors((er) => ({ ...er, news: 'Enter a valid email' }))
      return
    }
    setJoined(true)
    setErrors((er) => ({ ...er, news: '' }))
  }

  return (
    <section id="contact" className="relative w-full bg-peach/60 py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionTitle
          eyebrow="Stay in the loop"
          title="Write us. Wave at us."
          highlight="Play with us."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.form
            onSubmit={onContact}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[32px] bg-white p-6 shadow-xl shadow-navy/5 sm:p-8"
          >
            <h3 className="font-display text-2xl font-bold text-navy">Send a message</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Name" error={errors.name}>
                <input value={form.name} onChange={set('name')} placeholder="Ada Lovelace" />
              </Field>
              <Field label="Email" error={errors.email}>
                <input value={form.email} onChange={set('email')} placeholder="you@email.com" />
              </Field>
            </div>
            <Field label="Message" error={errors.message} className="mt-4">
              <textarea rows={4} value={form.message} onChange={set('message')} placeholder="Which toy sparked the idea?" />
            </Field>
            <RippleButton
              type="submit"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 font-extrabold text-white"
            >
              <Send className="h-4 w-4" /> {sent ? 'Message packed!' : 'Send message'}
            </RippleButton>
            {sent && <p className="mt-3 text-sm font-bold text-mint">Thanks — we’ll reply with extra stickers.</p>}
          </motion.form>

          <div className="flex flex-col gap-5">
            <motion.form
              onSubmit={onNews}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-[32px] bg-gradient-to-br from-candy to-lavender p-6 text-white sm:p-8"
            >
              <h3 className="font-display text-2xl font-bold">Playtime newsletter</h3>
              <p className="mt-2 text-sm text-white/80">New drops, rainy-day missions, and secret weekend codes.</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  value={form.news}
                  onChange={set('news')}
                  placeholder="Email for spark notes"
                  className="flex-1 rounded-full border-0 bg-white/20 px-5 py-3 text-white placeholder:text-white/70"
                />
                <button type="submit" className="rounded-full bg-white px-5 py-3 font-extrabold text-candy">
                  Join
                </button>
              </div>
              {errors.news && <p className="mt-2 text-sm font-bold text-sunny">{errors.news}</p>}
              {joined && <p className="mt-2 text-sm font-bold">You’re on the list. Confetti incoming.</p>}
            </motion.form>

            <div className="rounded-[32px] bg-navy p-6 text-white sm:p-8">
              <h3 className="font-display text-2xl font-bold">Visit / ping</h3>
              <ul className="mt-4 space-y-3 text-sm font-bold text-white/80">
                <li className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-sunny" /> 18 Playhouse Lane, Imagination District
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-mint" /> +1 (800) 555-PLAY
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-sky" /> hello@ideals.toys
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

function Field({ label, error, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-black uppercase tracking-widest text-ink/40">{label}</span>
      <div className="[&_input]:w-full [&_input]:rounded-2xl [&_input]:border-2 [&_input]:border-transparent [&_input]:bg-cream [&_input]:px-4 [&_input]:py-3 [&_input]:font-bold [&_input]:text-navy [&_input]:transition [&_input]:focus:border-candy [&_input]:focus:bg-white [&_textarea]:w-full [&_textarea]:rounded-2xl [&_textarea]:border-2 [&_textarea]:border-transparent [&_textarea]:bg-cream [&_textarea]:px-4 [&_textarea]:py-3 [&_textarea]:font-bold [&_textarea]:text-navy [&_textarea]:transition [&_textarea]:focus:border-candy [&_textarea]:focus:bg-white">
        {children}
      </div>
      {error && <span className="mt-1 block text-xs font-bold text-candy">{error}</span>}
    </label>
  )
}
