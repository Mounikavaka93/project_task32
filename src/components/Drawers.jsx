import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { products } from '../data/products'
import { useShop } from '../context/ShopContext'
import { useEffect, useState } from 'react'

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, updateQty, removeFromCart, cartTotal, openCheckout } = useShop()
  return (
    <Drawer open={cartOpen} onClose={() => setCartOpen(false)} title="Your toy bag">
      {cart.length === 0 ? (
        <Empty text="Cart is a quiet playroom. Add something loud." />
      ) : (
        <div className="flex h-full flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-2xl bg-cream p-3">
                <img src={item.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-extrabold leading-tight text-navy">{item.name}</p>
                  <p className="text-sm font-bold text-candy">${item.price.toFixed(2)}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <button type="button" onClick={() => updateQty(item.id, item.qty - 1)} className="rounded-full bg-white p-1">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-black">{item.qty}</span>
                    <button type="button" onClick={() => updateQty(item.id, item.qty + 1)} className="rounded-full bg-white p-1">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <button type="button" onClick={() => removeFromCart(item.id)} aria-label="Remove">
                  <Trash2 className="h-4 w-4 text-ink/40" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-navy/10 pt-4">
            <div className="flex justify-between font-extrabold text-navy">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button type="button" onClick={openCheckout} className="mt-3 w-full rounded-full bg-candy py-3 font-extrabold text-white">
              Place order
            </button>
          </div>
        </div>
      )}
    </Drawer>
  )
}

export function WishlistDrawer() {
  const { wishOpen, setWishOpen, wishlist, addToCart, toggleWishlist } = useShop()
  return (
    <Drawer open={wishOpen} onClose={() => setWishOpen(false)} title="Saved for later">
      {wishlist.length === 0 ? (
        <Empty text="Tap a heart on a toy you love." />
      ) : (
        <div className="space-y-3">
          {wishlist.map((item) => (
            <div key={item.id} className="flex gap-3 rounded-2xl bg-cream p-3">
              <img src={item.image} alt="" className="h-16 w-16 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="font-extrabold text-navy">{item.name}</p>
                <p className="text-sm font-bold text-candy">${item.price.toFixed(2)}</p>
                <button
                  type="button"
                  onClick={() => addToCart(item)}
                  className="mt-1 text-xs font-black uppercase tracking-wide text-navy"
                >
                  Move to cart
                </button>
              </div>
              <button type="button" onClick={() => toggleWishlist(item)} className="text-candy">
                ♥
              </button>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  )
}

export function SearchModal() {
  const { searchOpen, setSearchOpen, searchProducts, setActiveProduct } = useShop()
  const [q, setQ] = useState('')
  const results = searchProducts(q)

  useEffect(() => {
    if (!searchOpen) setQ('')
  }, [searchOpen])

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div className="fixed inset-0 z-[80] grid place-items-start bg-navy/50 p-4 pt-24 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" className="absolute inset-0" aria-label="Close search" onClick={() => setSearchOpen(false)} />
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="relative mx-auto w-full max-w-2xl rounded-[28px] bg-white p-5 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search rainbows, robots, racers…"
                className="w-full rounded-2xl bg-cream px-4 py-3 font-bold text-navy"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-cream">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 max-h-80 space-y-2 overflow-y-auto">
              {(q ? results : products.slice(0, 5)).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setActiveProduct(p)
                    setSearchOpen(false)
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-cream"
                >
                  <img src={p.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                  <span className="font-extrabold text-navy">{p.name}</span>
                  <span className="ml-auto text-sm font-bold text-candy">${p.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Drawer({ open, onClose, title, children }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" className="absolute inset-0 bg-navy/40 backdrop-blur-sm" onClick={onClose} aria-label="Close drawer" />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="absolute right-0 top-0 flex h-full w-[88%] max-w-md flex-col bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-navy">{title}</h3>
              <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-cream" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Empty({ text }) {
  return <p className="mt-10 text-center font-bold text-ink/50">{text}</p>
}
