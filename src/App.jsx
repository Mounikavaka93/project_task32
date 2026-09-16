import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ShopProvider, useShop } from './context/ShopContext'
import { PageLoader } from './components/PageLoader'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Categories } from './components/Categories'
import { FeaturedProducts } from './components/FeaturedProducts'
import { ProductModal } from './components/ProductModal'
import { SpecialOffers } from './components/SpecialOffers'
import { WhyChoose } from './components/WhyChoose'
import { Testimonials } from './components/Testimonials'
import { Newsletter } from './components/Newsletter'
import { Footer, BackToTop } from './components/Footer'
import { CartDrawer, SearchModal, WishlistDrawer } from './components/Drawers'
import { Checkout } from './components/Checkout'
import { ConfettiBurst, HeartBurst, Toast } from './components/ui/Effects'
import { ScrollProgress, WaveDivider } from './components/ui/LayoutBits'
import { CursorGlow } from './components/CursorGlow'
import { scrollToSection } from './utils/scroll'

function Shell() {
  const { toast, setToast, confettiKey, heartBurst } = useShop()

  useEffect(() => {
    const onClick = (event) => {
      const link = event.target.closest('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')?.slice(1)
      if (!id) return
      event.preventDefault()
      scrollToSection(id)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="w-full overflow-x-hidden">
        <Hero />
        <WaveDivider from="#24165a" to="#fff8f0" />
        <Categories />
        <FeaturedProducts />
        <SpecialOffers />
        <WaveDivider from="#24165a" to="#fff8f0" />
        <WhyChoose />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
      <BackToTop />
      <ProductModal />
      <CartDrawer />
      <Checkout />
      <WishlistDrawer />
      <SearchModal />
      <ConfettiBurst burstKey={confettiKey} />
      <HeartBurst burst={heartBurst} />
      <Toast toast={toast} onDone={() => setToast(null)} />
    </>
  )
}

export default function App() {
  const [booting, setBooting] = useState(true)

  return (
    <ShopProvider>
      <AnimatePresence>{booting && <PageLoader key="loader" onDone={() => setBooting(false)} />}</AnimatePresence>
      <Shell />
    </ShopProvider>
  )
}
