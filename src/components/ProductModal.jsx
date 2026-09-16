import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { useShop } from '../context/ShopContext'
import { StarRating } from './ui/Brand'
import { RippleButton } from './ui/MotionBits'

export function ProductModal() {
  const { activeProduct, setActiveProduct, addToCart, toggleWishlist, isWished } = useShop()
  const [qty, setQty] = useState(1)

  useEffect(() => {
    setQty(1)
    document.body.style.overflow = activeProduct ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setActiveProduct(null)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [activeProduct, setActiveProduct])

  return (
    <AnimatePresence>
      {activeProduct && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close product details"
            className="absolute inset-0 bg-navy/50 backdrop-blur-md"
            onClick={() => setActiveProduct(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ y: 80, opacity: 0, scale: 0.94, rotateX: 8 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ y: 40, opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            className="relative grid max-h-[92vh] w-full max-w-4xl overflow-hidden overflow-y-auto rounded-t-[32px] bg-white shadow-2xl sm:rounded-[32px] lg:grid-cols-2"
          >
            <div className="relative min-h-[260px] overflow-hidden bg-peach">
              <motion.img
                key={activeProduct.image}
                src={activeProduct.image}
                alt={activeProduct.name}
                className="h-full w-full object-cover"
                initial={{ scale: 1.2, filter: 'blur(12px)' }}
                animate={{ scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.7 }}
              />
              <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black uppercase text-candy">
                {activeProduct.badge}
              </span>
            </div>
            <div className="relative p-6 sm:p-8">
              <button
                type="button"
                onClick={() => setActiveProduct(null)}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-cream"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <StarRating value={activeProduct.rating} size="md" />
              <p className="mt-2 text-xs font-bold uppercase tracking-widest text-ink/40">
                {activeProduct.reviews} parent reviews
              </p>
              <h3 className="mt-2 font-display text-3xl font-bold text-navy">{activeProduct.name}</h3>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="font-display text-3xl text-candy">${activeProduct.price.toFixed(2)}</span>
                {activeProduct.oldPrice && (
                  <span className="text-lg font-bold text-ink/30 line-through">
                    ${activeProduct.oldPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="mt-4 leading-relaxed text-ink/70">{activeProduct.description}</p>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center rounded-full bg-cream p-1">
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <motion.span key={qty} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-10 text-center font-black">
                    {qty}
                  </motion.span>
                  <button
                    type="button"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white"
                    onClick={() => setQty((q) => q + 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={(e) => toggleWishlist(activeProduct, { x: e.clientX, y: e.clientY })}
                  className={`grid h-12 w-12 place-items-center rounded-full ${
                    isWished(activeProduct.id) ? 'bg-candy text-white' : 'bg-cream text-navy'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`h-5 w-5 ${isWished(activeProduct.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              <RippleButton
                onClick={() => {
                  addToCart(activeProduct, qty)
                  setActiveProduct(null)
                }}
                className="mt-6 w-full rounded-full bg-gradient-to-r from-candy to-coral py-3.5 font-extrabold text-white shadow-lg shadow-candy/30"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <ShoppingBag className="h-4 w-4" /> Add {qty} to cart
                </span>
              </RippleButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
