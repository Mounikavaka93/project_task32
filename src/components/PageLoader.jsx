import { useEffect, useMemo } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'

const letters = [
  { ch: 'I', bg: 'from-candy to-coral', shadow: 'shadow-candy/50' },
  { ch: 'D', bg: 'from-sunny to-coral', shadow: 'shadow-sunny/50' },
  { ch: 'E', bg: 'from-sky to-mint', shadow: 'shadow-sky/50' },
  { ch: 'A', bg: 'from-mint to-sky', shadow: 'shadow-mint/50' },
  { ch: 'L', bg: 'from-coral to-candy', shadow: 'shadow-coral/50' },
  { ch: 'S', bg: 'from-lavender to-candy', shadow: 'shadow-lavender/50' },
]

const toys = [
  { emoji: '🧸', x: '8%', y: '18%', delay: 0.1, size: 'text-4xl' },
  { emoji: '🚀', x: '86%', y: '16%', delay: 0.25, size: 'text-3xl' },
  { emoji: '🪀', x: '12%', y: '78%', delay: 0.18, size: 'text-3xl' },
  { emoji: '🧩', x: '88%', y: '72%', delay: 0.32, size: 'text-4xl' },
  { emoji: '🎲', x: '6%', y: '48%', delay: 0.4, size: 'text-2xl' },
  { emoji: '🪁', x: '90%', y: '44%', delay: 0.22, size: 'text-3xl' },
  { emoji: '🎈', x: '22%', y: '12%', delay: 0.35, size: 'text-3xl' },
  { emoji: '⭐', x: '74%', y: '82%', delay: 0.15, size: 'text-2xl' },
]

const words = ['Imagination', 'Discovery', 'Education', 'Adventure', 'Love', 'Spark']

export function PageLoader({ onDone }) {
  const progress = useMotionValue(0)
  const percent = useTransform(progress, (v) => `${Math.round(v)}%`)
  const barWidth = useTransform(progress, (v) => `${v}%`)
  const knobLeft = useTransform(progress, (v) => `calc(${v}% - 8px)`)
  const sparks = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        left: `${4 + Math.random() * 92}%`,
        delay: Math.random() * 1.4,
        duration: 2.2 + Math.random() * 1.8,
        size: 4 + Math.random() * 8,
        color: ['#FF4D8D', '#FFC93C', '#3EC6FF', '#2EE6A6', '#8B7CFF'][i % 5],
      })),
    [],
  )

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const controls = animate(progress, 100, { duration: reduce ? 0.3 : 3.4, ease: [0.16, 1, 0.3, 1] })
    const t = setTimeout(onDone, reduce ? 450 : 4200)
    return () => {
      controls.stop()
      clearTimeout(t)
    }
  }, [onDone, progress])

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden bg-[#0d0624]"
      initial={{ clipPath: 'circle(160% at 50% 50%)', opacity: 1 }}
      exit={{
        clipPath: 'circle(0% at 50% 42%)',
        opacity: 0,
        filter: 'blur(12px)',
      }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        className="absolute -left-1/3 -top-1/3 h-[90vw] w-[90vw] rounded-full bg-[conic-gradient(from_120deg,#ff4d8d,#ffc93c,#3ec6ff,#2ee6a6,#8b7cff,#ff4d8d)] opacity-30 blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 h-[70vw] w-[70vw] rounded-full bg-[conic-gradient(from_0deg,#3ec6ff,#ff4d8d,#ffc93c,#3ec6ff)] opacity-25 blur-3xl"
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />

      {[0, 1, 2].map((ring) => (
        <motion.span
          key={ring}
          className="pointer-events-none absolute left-1/2 top-[42%] rounded-full border border-white/20"
          initial={{ width: 40, height: 40, x: '-50%', y: '-50%', opacity: 0.7 }}
          animate={{
            width: 180 + ring * 140,
            height: 180 + ring * 140,
            opacity: 0,
          }}
          transition={{ duration: 2.4, delay: ring * 0.28, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}

      {sparks.map((s) => (
        <motion.span
          key={s.id}
          className="absolute rounded-full"
          style={{ left: s.left, top: '-8%', width: s.size, height: s.size, background: s.color }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: '110vh', opacity: [0, 1, 1, 0], rotate: 180 }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      {toys.map((toy) => (
        <motion.span
          key={toy.emoji + toy.x}
          className={`absolute ${toy.size} drop-shadow-lg`}
          style={{ left: toy.x, top: toy.y }}
          initial={{ scale: 0, rotate: -40, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 1],
            rotate: [-20, 12, -8, 0],
            y: [0, -14, 0],
            opacity: 1,
          }}
          transition={{ delay: 0.15 + toy.delay, duration: 2.4, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        >
          {toy.emoji}
        </motion.span>
      ))}

      <div className="relative grid h-full place-items-center px-4">
        <div className="text-center">
          <motion.p
            className="mb-5 text-[11px] font-extrabold uppercase tracking-[0.45em] text-white/70"
            initial={{ opacity: 0, letterSpacing: '0.8em', y: -12 }}
            animate={{ opacity: 1, letterSpacing: '0.45em', y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Opening the toy box
          </motion.p>

          <div className="mx-auto mb-8 flex items-center justify-center gap-2 [perspective:900px] sm:gap-3">
            {letters.map((letter, i) => (
              <motion.span
                key={letter.ch}
                initial={{ rotateX: -90, y: 80, opacity: 0, scale: 0.6 }}
                animate={{
                  rotateX: 0,
                  y: [80, -22, 0],
                  opacity: 1,
                  scale: 1,
                  rotateZ: [0, i % 2 === 0 ? -6 : 6, 0],
                }}
                transition={{
                  delay: 0.28 + i * 0.12,
                  duration: 0.9,
                  type: 'spring',
                  stiffness: 240,
                  damping: 14,
                }}
                className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br font-display text-3xl font-bold text-white shadow-xl sm:h-[4.5rem] sm:w-[4.5rem] sm:text-4xl ${letter.bg} ${letter.shadow}`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{ delay: 1.4 + i * 0.08, duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {letter.ch}
                </motion.span>
              </motion.span>
            ))}
          </div>

          <div className="mb-7 flex flex-wrap items-center justify-center gap-2">
            {words.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 1.05 + i * 0.08, type: 'spring', stiffness: 180 }}
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/80 backdrop-blur-sm sm:text-xs"
              >
                {word}
              </motion.span>
            ))}
          </div>

          <div className="mx-auto w-full max-w-xs">
            <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.25em] text-white/50">
              <span>Play loading</span>
              <motion.span className="text-sunny">{percent}</motion.span>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-candy via-sunny to-mint"
                style={{ width: barWidth }}
              />
              <motion.span
                className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-[0_0_16px_#ffc93c]"
                style={{ left: knobLeft }}
              />
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-candy/30 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      />
    </motion.div>
  )
}
