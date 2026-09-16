import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { MagneticButton, RippleButton } from './ui/MotionBits'
import { Container } from './ui/Container'
import { scrollToSection } from '../utils/scroll'

const orbitToys = [
  { emoji: '🧸', delay: '0s', r: '165px', d: '16s' },
  { emoji: '🚀', delay: '-4s', r: '200px', d: '22s' },
  { emoji: '🪀', delay: '-8s', r: '140px', d: '13s' },
  { emoji: '🧩', delay: '-2s', r: '220px', d: '26s' },
  { emoji: '🎲', delay: '-10s', r: '185px', d: '19s' },
  { emoji: '🪁', delay: '-6s', r: '155px', d: '15s' },
]

const heading = ['Tiny hands.', 'Giant adventures.']

export function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 140])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section id="home" ref={ref} className="relative w-full overflow-hidden mesh-hero pt-24 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 play-grid opacity-70" />
      <div className="blob absolute -left-24 top-24 h-72 w-72 bg-candy/25" />
      <div className="blob blob-delay absolute right-[-80px] top-40 h-80 w-80 bg-sky/25" />
      <span className="sparkle absolute left-[12%] top-36 text-2xl">✦</span>
      <span className="sparkle absolute right-[18%] top-28 text-sunny delay-200">★</span>

      <motion.div style={{ y, opacity }} className="relative pb-16 sm:pb-20 lg:pb-10">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-navy shadow-sm backdrop-blur"
          >
            <Sparkles className="h-4 w-4 text-sunny" />
            Play season is on · up to 40% off
          </motion.div>

          <h1 className="font-display text-4xl font-bold leading-[1.05] text-navy sm:text-6xl lg:text-7xl">
            {heading.map((line, li) => (
              <span key={line} className="block overflow-hidden">
                {line.split('').map((ch, i) => (
                  <motion.span
                    key={`${li}-${i}`}
                    className={`inline-block ${ch === ' ' ? 'w-3' : ''}`}
                    initial={{ y: '110%', rotate: 8 }}
                    animate={{ y: '0%', rotate: 0 }}
                    transition={{ delay: 0.35 + li * 0.18 + i * 0.03, type: 'spring', stiffness: 260, damping: 18 }}
                  >
                    {ch}
                  </motion.span>
                ))}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-ink/70"
          >
            IDEALS is the colorful playground that never closes — premium toys for imagination,
            discovery, education, adventure, love, and spark.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <RippleButton
              onClick={() => scrollToSection('shop')}
              className="btn-rainbow pulse-glow rounded-full bg-gradient-to-r from-candy via-coral to-sunny px-7 py-3.5 font-extrabold text-white shadow-lg shadow-candy/30"
            >
              Shop Now
            </RippleButton>
            <MagneticButton
              onClick={() => scrollToSection('categories')}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-extrabold text-navy shadow-md"
            >
              Explore Toys <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm font-extrabold text-navy"
          >
            <Stat n="12k+" l="Happy kids" />
            <Stat n="800+" l="Play-tested toys" />
            <Stat n="4.9" l="Parent rating" />
          </motion.div>
        </div>

        <div className="relative mx-auto h-[380px] w-full max-w-[420px] sm:h-[460px]">
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-sunny via-peach to-candy shadow-2xl shadow-candy/30 sm:h-80 sm:w-80" />
          <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-8 border-white shadow-xl sm:h-60 sm:w-60">
            <motion.img
              src="/images/hero.jpg"
              alt="Colorful toys"
              className="h-full w-full object-cover"
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/90 font-display text-sm font-bold text-navy shadow-lg backdrop-blur sm:h-28 sm:w-28">
            <span className="text-candy">Play</span>
            Planet
          </div>
          {orbitToys.map((toy) => (
            <span
              key={toy.emoji}
              className="orbit absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl bg-white text-2xl shadow-lg"
              style={{ animationDelay: toy.delay, '--orbit-r': toy.r, '--orbit-d': toy.d }}
            >
              {toy.emoji}
            </span>
          ))}
        </div>
        </Container>
      </motion.div>

      <div className="relative w-full overflow-hidden border-y border-navy/5 bg-navy py-3 text-white">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap px-6 text-sm font-extrabold uppercase tracking-[0.25em]">
          {Array.from({ length: 2 }).map((_, loop) => (
            <div key={loop} className="flex gap-10">
              {['Imagination', 'Discovery', 'Education', 'Adventure', 'Love', 'Spark', 'Safe Play', 'STEM Fun'].map(
                (word) => (
                  <span key={`${loop}-${word}`} className="flex items-center gap-10">
                    {word} <span className="text-sunny">●</span>
                  </span>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stat({ n, l }) {
  return (
    <div>
      <div className="font-display text-2xl text-candy">{n}</div>
      <div className="text-xs uppercase tracking-wider text-ink/50">{l}</div>
    </div>
  )
}
