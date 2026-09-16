import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { categories } from '../data/products'
import { Logo } from './ui/Brand'
import { Container } from './ui/Container'
import { animateScroll } from '../utils/scroll'

const footerLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Shop', href: '#shop' },
  { label: 'Categories', href: '#categories' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-navy pt-16 text-white">
      <div className="blob absolute -left-10 top-0 h-48 w-48 bg-candy/20" />
      <Container className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
            Toys with a spine of story. Built for tiny hands, giant adventures, and play that lasts.
          </p>
          <div className="mt-4 flex gap-2">
            <Social href="#" label="Instagram">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </Social>
            <Social href="#" label="Facebook">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M14 9h3V6h-3c-1.7 0-3 1.5-3 3.3V12H9v3h2v7h3v-7h2.6l.4-3H14V9.4c0-.2.2-.4.5-.4z" />
              </svg>
            </Social>
            <Social href="#" label="YouTube">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                <path d="M23 12.2s0-3.2-.4-4.6c-.2-.9-.9-1.6-1.8-1.8C19.2 5.4 12 5.4 12 5.4s-7.2 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.6c.2.9.9 1.6 1.8 1.8 1.6.4 8.8.4 8.8.4s7.2 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.6.4-4.6zM9.8 15.5v-6.6l6.3 3.3-6.3 3.3z" />
              </svg>
            </Social>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold">Quick links</h4>
          <ul className="mt-3 space-y-2 text-sm font-bold text-white/70">
            {footerLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} className="hover:text-sunny">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold">Toy categories</h4>
          <ul className="mt-3 space-y-2 text-sm font-bold text-white/70">
            {categories.map((c) => (
              <li key={c.id}>
                <a href="#shop" className="hover:text-sunny">
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg font-bold">We take</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Visa', 'Mastercard', 'UPI', 'PayPal', 'GPay'].map((p) => (
              <span key={p} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-wide">
                {p}
              </span>
            ))}
          </div>
        </div>
      </Container>
      <div className="relative mt-12 w-full border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs font-bold text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} IDEALS Toys. Play with purpose.</p>
          <p>Made for kids. Designed for grown-up delight.</p>
        </Container>
      </div>
    </footer>
  )
}

export function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => animateScroll(0)}
          className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-sunny to-coral text-navy shadow-xl"
          initial={{ y: 80, opacity: 0, scale: 0.6 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0 }}
          whileHover={{ y: -6, rotate: -8 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="absolute -top-2 text-lg">🎈</span>
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

function Social({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:bg-candy"
    >
      {children}
    </a>
  )
}
