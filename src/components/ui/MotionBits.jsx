import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function MagneticButton({ children, className = '', onClick, type = 'button' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 280, damping: 18 })
  const sy = useSpring(y, { stiffness: 280, damping: 18 })

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35)
  }

  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      whileTap={{ scale: 0.94 }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
    </motion.button>
  )
}

export function RippleButton({ children, className = '', onClick, type = 'button' }) {
  const ref = useRef(null)

  const spawnRipple = (e) => {
    const btn = ref.current
    const circle = document.createElement('span')
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    circle.style.cssText = `
      position:absolute;border-radius:999px;transform:scale(0);
      animation:ripple .7s ease-out;background:rgba(255,255,255,.55);
      width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;pointer-events:none;
    `
    btn.appendChild(circle)
    setTimeout(() => circle.remove(), 700)
    onClick?.(e)
  }

  return (
    <button
      ref={ref}
      type={type}
      onClick={spawnRipple}
      className={`relative overflow-hidden ${className}`}
    >
      <style>{`@keyframes ripple{to{transform:scale(2.4);opacity:0}}`}</style>
      <span className="relative z-10">{children}</span>
    </button>
  )
}

export function TiltCard({ children, className = '', intensity = 12 }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.transform = `perspective(900px) rotateX(${(py - 0.5) * -intensity}deg) rotateY(${(px - 0.5) * intensity}deg) scale3d(1.03,1.03,1.03)`
    const shine = el.querySelector('[data-shine]')
    if (shine) shine.style.backgroundPosition = `${px * 100}% ${py * 100}%`
  }

  const reset = () => {
    const el = ref.current
    el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)'
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`relative transform-gpu transition-transform duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
      <span data-shine className="pointer-events-none absolute inset-0 rounded-[inherit] tilt-shine opacity-0 transition-opacity duration-200 hover:opacity-100" />
    </div>
  )
}
