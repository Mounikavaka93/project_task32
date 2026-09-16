import { motion } from 'framer-motion'
import { Heart, Eye, ShoppingBag } from 'lucide-react'
import { products, categories } from '../data/products'
import { useShop } from '../context/ShopContext'
import { SectionTitle, StarRating } from './ui/Brand'
import { Container } from './ui/Container'

const filters = ['All', ...categories.map((c) => c.id)]

export function FeaturedProducts() {
  const {
    categoryFilter,
    setCategoryFilter,
    addToCart,
    toggleWishlist,
    isWished,
    setActiveProduct,
  } = useShop()

  const visible =
    categoryFilter === 'All'
      ? products
      : products.filter((p) => p.category === categoryFilter)

  return (
    <section id="shop" className="relative w-full bg-white py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-peach/50 to-transparent" />
      <Container className="relative">
        <SectionTitle
          eyebrow="Featured shelf"
          title="Toys that don’t"
          highlight="collect dust."
          copy="Twelve crowd-pleasers with zoom-on-hover portraits, wishlist hearts, and one-tap cart magic."
        />

        <div className="mt-10 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {filters.map((id) => {
            const label = id === 'All' ? 'All toys' : categories.find((c) => c.id === id)?.name
            const active = categoryFilter === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => setCategoryFilter(id)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-extrabold transition ${
                  active ? 'bg-navy text-white shadow-lg' : 'bg-cream text-navy hover:bg-peach'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              wished={isWished(product.id)}
              onCart={() => addToCart(product)}
              onWish={(e) =>
                toggleWishlist(product, { x: e.clientX, y: e.clientY })
              }
              onOpen={() => setActiveProduct(product)}
            />
          ))}
        </motion.div>
      </Container>
    </section>
  )
}

function ProductCard({ product, index, wished, onCart, onWish, onOpen }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: (index % 4) * 0.07, type: 'spring', stiffness: 140 }}
      className="group relative flex flex-col overflow-hidden rounded-[28px] bg-cream shadow-md shadow-navy/5"
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden bg-peach">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-125"
          />
        </div>
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wide text-candy">
          {product.badge}
        </span>
        <button
          type="button"
          onClick={onWish}
          className={`absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full shadow transition ${
            wished ? 'bg-candy text-white' : 'bg-white text-navy hover:text-candy'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart className={`h-4 w-4 ${wished ? 'fill-current' : ''}`} />
        </button>
        <div className="absolute inset-x-3 bottom-3 flex translate-y-6 gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={onOpen}
            className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white py-2 text-xs font-extrabold text-navy"
          >
            <Eye className="h-3.5 w-3.5" /> Quick look
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <StarRating value={product.rating} />
        <h3 className="mt-2 font-display text-lg font-bold leading-snug text-navy">{product.name}</h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-extrabold text-candy">${product.price.toFixed(2)}</span>
          {product.oldPrice && (
            <span className="text-sm font-bold text-ink/40 line-through">${product.oldPrice.toFixed(2)}</span>
          )}
        </div>
        <button
          type="button"
          onClick={onCart}
          className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-navy py-2.5 text-sm font-extrabold text-white transition hover:scale-105 hover:bg-candy"
        >
          <ShoppingBag className="h-4 w-4" /> Add to Cart
        </button>
      </div>
    </motion.article>
  )
}
