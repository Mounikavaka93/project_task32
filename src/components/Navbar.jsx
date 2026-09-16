import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { navLinks } from '../data/products'
import { useShop } from '../context/ShopContext'
import { Logo } from './ui/Brand'

export function Navbar() {
  const {
    cartCount,
    wishlist,
    setCartOpen,
    setWishOpen,
    setSearchOpen,
    mobileOpen,
    setMobileOpen,
  } = useShop()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed inset-x-0 top-0 z-50 w-full"
      >
        <div
          className={`w-full transition-all duration-500 ${
            scrolled
              ? 'bg-white/90 shadow-lg shadow-navy/10 backdrop-blur-xl'
              : 'bg-transparent'
          }`}
        >
          <div className="mx-auto flex h-[72px] w-full max-w-[1400px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="relative rounded-full px-4 py-2 text-sm font-extrabold text-navy/80 transition hover:text-candy"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <IconBtn label="Search" onClick={() => setSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </IconBtn>
            <IconBtn label="Wishlist" onClick={() => setWishOpen(true)} count={wishlist.length} tone="candy">
              <Heart className="h-5 w-5" />
            </IconBtn>
            <IconBtn label="Cart" onClick={() => setCartOpen(true)} count={cartCount} bounce>
              <ShoppingBag className="h-5 w-5" />
            </IconBtn>
            <button
              type="button"
              className="ml-1 grid h-11 w-11 place-items-center rounded-2xl bg-navy text-white lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-navy/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu overlay"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="absolute right-0 top-0 flex h-full w-[84%] max-w-sm flex-col overflow-hidden bg-cream p-6"
            >
              <div className="blob absolute -right-16 -top-10 h-40 w-40 bg-candy/30" />
              <div className="blob blob-delay absolute -bottom-10 -left-10 h-44 w-44 bg-sky/30" />
              <div className="relative flex items-center justify-between">
                <Logo />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-white shadow"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="relative mt-10 flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setMobileOpen(false)}
                    initial={{ x: 40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.08 * i }}
                    className="rounded-2xl bg-white px-5 py-4 font-display text-2xl font-bold text-navy shadow-sm"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function IconBtn({ children, onClick, label, count = 0, tone = 'navy', bounce = false }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.06 }}
      whileTap={{ scale: 0.9 }}
      animate={bounce && count > 0 ? { scale: [1, 1.18, 1] } : { scale: 1 }}
      className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white text-navy shadow-sm"
    >
      {children}
      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-black text-white ${
              tone === 'candy' ? 'bg-candy' : 'bg-navy'
            }`}
          >
            {count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
