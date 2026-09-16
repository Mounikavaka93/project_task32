import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { products } from '../data/products'

const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [activeProduct, setActiveProduct] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [wishOpen, setWishOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [confettiKey, setConfettiKey] = useState(0)
  const [heartBurst, setHeartBurst] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [order, setOrder] = useState(null)

  const notify = useCallback((message, tone = 'cart') => {
    setToast({ id: Date.now(), message, tone })
  }, [])

  const addToCart = useCallback(
    (product, qty = 1) => {
      setCart((prev) => {
        const found = prev.find((item) => item.id === product.id)
        if (found) {
          return prev.map((item) =>
            item.id === product.id ? { ...item, qty: item.qty + qty } : item,
          )
        }
        return [...prev, { ...product, qty }]
      })
      setConfettiKey((key) => key + 1)
      notify(`${product.name} hopped into your cart`, 'cart')
    },
    [notify],
  )

  const updateQty = useCallback((id, qty) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty } : item))
        .filter((item) => item.qty > 0),
    )
  }, [])

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const openCheckout = useCallback(() => {
    if (!cart.length) {
      notify('Add a toy before checkout', 'wish')
      return
    }
    setOrder(null)
    setCartOpen(false)
    setCheckoutOpen(true)
  }, [cart.length, notify])

  const placeOrder = useCallback((details) => {
    setOrder(details)
    setCart([])
    setConfettiKey((key) => key + 1)
    notify('Order placed — receipt is ready', 'cart')
  }, [notify])

  const closeCheckout = useCallback(() => {
    setCheckoutOpen(false)
  }, [])

  const toggleWishlist = useCallback(
    (product, origin) => {
      setWishlist((prev) => {
        const exists = prev.some((item) => item.id === product.id)
        if (exists) {
          notify(`${product.name} left the wishlist`, 'wish')
          return prev.filter((item) => item.id !== product.id)
        }
        if (origin) setHeartBurst({ ...origin, id: Date.now() })
        notify(`${product.name} saved for later`, 'wish')
        return [...prev, product]
      })
    },
    [notify],
  )

  const isWished = useCallback(
    (id) => wishlist.some((item) => item.id === id),
    [wishlist],
  )

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const searchProducts = useCallback((query) => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    )
  }, [])

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      activeProduct,
      setActiveProduct,
      cartOpen,
      setCartOpen,
      wishOpen,
      setWishOpen,
      searchOpen,
      setSearchOpen,
      mobileOpen,
      setMobileOpen,
      toast,
      setToast,
      confettiKey,
      heartBurst,
      categoryFilter,
      setCategoryFilter,
      addToCart,
      updateQty,
      removeFromCart,
      toggleWishlist,
      isWished,
      cartCount,
      cartTotal,
      searchProducts,
      checkoutOpen,
      setCheckoutOpen,
      openCheckout,
      closeCheckout,
      order,
      setOrder,
      placeOrder,
    }),
    [
      cart,
      wishlist,
      activeProduct,
      cartOpen,
      wishOpen,
      searchOpen,
      mobileOpen,
      toast,
      confettiKey,
      heartBurst,
      categoryFilter,
      addToCart,
      updateQty,
      removeFromCart,
      toggleWishlist,
      isWished,
      cartCount,
      cartTotal,
      searchProducts,
      checkoutOpen,
      openCheckout,
      closeCheckout,
      order,
      placeOrder,
    ],
  )

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used inside ShopProvider')
  return ctx
}
