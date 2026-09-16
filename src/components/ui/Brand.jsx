import { motion } from 'framer-motion'

export function Logo({ compact = false, light = false }) {
  return (
    <a href="#home" className="group flex items-center gap-2.5">
      <span className="relative grid h-11 w-11 place-items-center">
        <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-candy via-sunny to-sky shadow-lg shadow-candy/30 transition-transform duration-300 group-hover:rotate-6" />
        <span className="relative font-display text-xl font-bold text-white">I</span>
        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-mint sparkle" />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={`block font-display text-2xl font-bold tracking-tight ${light ? 'text-white' : 'text-navy'}`}>
            IDEALS
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-candy">
            Toys & Games
          </span>
        </span>
      )}
    </a>
  )
}

export function SectionTitle({ eyebrow, title, highlight, copy, align = 'center' }) {
  return (
    <div className={`w-full ${align === 'center' ? 'mx-auto max-w-3xl text-center' : 'text-left'}`}>
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-candy shadow-sm"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-sunny" />
        {eyebrow}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.08, type: 'spring', stiffness: 120 }}
        className="font-display text-3xl font-bold leading-tight text-navy sm:text-4xl lg:text-5xl"
      >
        {title}{' '}
        {highlight && <span className="shimmer-text">{highlight}</span>}
      </motion.h2>
      {copy && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.18 }}
          className="mt-4 text-base leading-relaxed text-ink/70 sm:text-lg"
        >
          {copy}
        </motion.p>
      )}
    </div>
  )
}

export function StarRating({ value, size = 'sm' }) {
  const full = Math.round(value)
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className={`${size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} ${
            i < full ? 'fill-sunny text-sunny' : 'fill-peach text-peach'
          }`}
        >
          <path d="M10 1.5l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.1 5.06 16.71l.94-5.5-4-3.9 5.53-.8L10 1.5z" />
        </svg>
      ))}
    </div>
  )
}
