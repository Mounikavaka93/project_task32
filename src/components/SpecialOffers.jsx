import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Timer } from 'lucide-react'
import { RippleButton } from './ui/MotionBits'
import { Container } from './ui/Container'
import { scrollToSection } from '../utils/scroll'

const TARGET = new Date('2026-09-30T23:59:59')

function pad(n) {
  return String(n).padStart(2, '0')
}

function useCountdown(date) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, date.getTime() - now.getTime())
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)
  const secs = Math.floor((diff % 60000) / 1000)
  return { days, hours, mins, secs }
}

export function SpecialOffers() {
  const time = useCountdown(TARGET)

  return (
    <section className="relative w-full overflow-hidden bg-navy py-16 text-white sm:py-20 lg:py-24">
      <div className="blob absolute -left-20 top-10 h-64 w-64 bg-candy/30" />
      <div className="blob blob-delay absolute -right-10 bottom-0 h-72 w-72 bg-sky/25" />
      <span className="bob absolute left-[8%] top-16 text-4xl">🎈</span>
      <span className="bob absolute right-[12%] top-24 text-4xl" style={{ animationDelay: '-1.4s' }}>
        🧸
      </span>
      <span className="bob absolute bottom-16 left-[18%] text-3xl" style={{ animationDelay: '-2s' }}>
        ⭐
      </span>

      <Container className="relative grid items-center gap-10 lg:grid-cols-2">
        <div>
          <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-sunny">
            <Timer className="h-4 w-4" /> Seasonal spark sale
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
            Weekend wonder
            <span className="block text-sunny">drops in 3… 2… play.</span>
          </h2>
          <p className="mt-4 max-w-md text-white/70">
            Extra 25% off educational sets and all outdoor games. Timer is ticking on the frontend —
            grab the glow while it’s on.
          </p>
          <RippleButton
            onClick={() => scrollToSection('shop')}
            className="mt-8 rounded-full bg-gradient-to-r from-sunny to-coral px-8 py-3.5 font-extrabold text-navy shadow-lg"
          >
            Claim the offer
          </RippleButton>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {[
            ['Days', time.days],
            ['Hours', time.hours],
            ['Mins', time.mins],
            ['Secs', time.secs],
          ].map(([label, value]) => (
            <FlipDigit key={label} label={label} value={pad(value)} />
          ))}
        </div>
      </Container>

      <Container className="relative mt-12 grid gap-5 sm:grid-cols-2">
        <PromoCard
          title="Buy 2 plush, get a story cape free"
          copy="Soft toys aisle · while stocks last"
          gradient="from-candy to-lavender"
        />
        <PromoCard
          title="STEM kit bundle — save $18"
          copy="Robot + puzzle globe pairing"
          gradient="from-sky to-mint"
        />
      </Container>
    </section>
  )
}

function FlipDigit({ label, value }) {
  return (
    <div className="rounded-[24px] bg-white/10 p-3 text-center backdrop-blur">
      <div className="relative overflow-hidden rounded-2xl bg-white py-4 font-display text-2xl font-bold text-navy sm:py-5 sm:text-4xl">
        <motion.span key={value} initial={{ y: -28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="block">
          {value}
        </motion.span>
      </div>
      <p className="mt-2 text-[11px] font-extrabold uppercase tracking-widest text-white/60">{label}</p>
    </div>
  )
}

function PromoCard({ title, copy, gradient }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, rotate: -0.4 }}
      className={`rounded-[28px] bg-gradient-to-br ${gradient} p-6 shadow-xl`}
    >
      <h3 className="font-display text-2xl font-bold">{title}</h3>
      <p className="mt-2 text-sm font-bold text-white/80">{copy}</p>
    </motion.div>
  )
}
