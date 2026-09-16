import { motion, useScroll, useSpring } from 'framer-motion'

export function WaveDivider({ flip = false, from = '#fff8f0', to = '#fff8f0' }) {
  return (
    <div className={`relative h-12 w-full overflow-hidden sm:h-16 ${flip ? 'rotate-180' : ''}`} style={{ background: from }}>
      <svg className="absolute inset-x-0 bottom-0 h-full w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
        <path
          fill={to}
          d="M0,32 C180,80 360,0 540,32 C720,64 900,8 1080,36 C1260,64 1380,16 1440,28 L1440,80 L0,80 Z"
        />
        <path
          fill={to}
          opacity="0.45"
          d="M0,48 C200,8 380,72 560,40 C740,8 920,64 1100,36 C1280,8 1380,48 1440,40 L1440,80 L0,80 Z"
        />
      </svg>
    </div>
  )
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 24, restDelta: 0.001 })
  return (
    <motion.div
      className="fixed left-0 top-0 z-[100] h-1.5 origin-left bg-gradient-to-r from-candy via-sunny to-sky"
      style={{ scaleX }}
    />
  )
}
