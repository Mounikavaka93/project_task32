import { useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function ConfettiBurst({ burstKey }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 42 }).map((_, i) => ({
        id: `${burstKey}-${i}`,
        x: (Math.random() - 0.5) * 360,
        y: 80 + Math.random() * 220,
        r: Math.random() * 360,
        s: 0.5 + Math.random() * 0.9,
        color: ['#FF4D8D', '#FFC93C', '#3EC6FF', '#2EE6A6', '#8B7CFF', '#FF7A45'][i % 6],
        shape: i % 3,
      })),
    [burstKey],
  )

  if (!burstKey) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: '50vw', y: '42vh', opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: `calc(50vw + ${p.x}px)`, y: `calc(42vh + ${p.y}px)`, opacity: 0, rotate: p.r, scale: p.s }}
          transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
          className="absolute block"
          style={{
            width: p.shape === 0 ? 12 : 10,
            height: p.shape === 1 ? 18 : 10,
            borderRadius: p.shape === 2 ? 999 : 4,
            background: p.color,
          }}
        />
      ))}
    </div>
  )
}

export function HeartBurst({ burst }) {
  if (!burst) return null
  return (
    <AnimatePresence>
      <motion.div
        key={burst.id}
        className="pointer-events-none fixed z-[70]"
        style={{ left: burst.x, top: burst.y }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.9 }}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute text-xl"
            initial={{ x: 0, y: 0, scale: 0.4 }}
            animate={{
              x: Math.cos((i / 8) * Math.PI * 2) * 36,
              y: Math.sin((i / 8) * Math.PI * 2) * 36,
              scale: 1,
            }}
            transition={{ duration: 0.7 }}
          >
            ♥
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  )
}

export function Toast({ toast, onDone }) {
  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(onDone, 2400)
    return () => clearTimeout(t)
  }, [toast, onDone])

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0 }}
            className={`pointer-events-auto rounded-full px-5 py-3 font-extrabold text-white shadow-xl ${
              toast.tone === 'wish' ? 'bg-candy' : 'bg-navy'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
