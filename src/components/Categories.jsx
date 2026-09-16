import { motion } from 'framer-motion'
import { categories } from '../data/products'
import { useShop } from '../context/ShopContext'
import { SectionTitle } from './ui/Brand'
import { TiltCard } from './ui/MotionBits'
import { Container } from './ui/Container'
import { scrollToSection } from '../utils/scroll'

export function Categories() {
  const { setCategoryFilter } = useShop()

  const pick = (id) => {
    setCategoryFilter(id)
    scrollToSection('shop')
  }

  return (
    <section id="categories" className="relative w-full bg-cream py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionTitle
          eyebrow="Shop by world"
          title="Pick a playground,"
          highlight="any playground."
          copy="Six colorful aisles, one rule: if it doesn’t spark a story, it doesn’t make the shelf."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              type="button"
              onClick={() => pick(cat.id)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 140 }}
              className="group text-left"
            >
              <TiltCard className="overflow-hidden rounded-[28px] bg-white shadow-lg shadow-navy/5">
                <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${cat.color}`}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-navy">
                    {cat.tag}
                  </span>
                </div>
                <div className="flex items-end justify-between p-5">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-navy">{cat.name}</h3>
                    <p className="text-sm font-bold text-ink/50">{cat.count} play-tested picks</p>
                  </div>
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-navy text-lg text-white transition group-hover:rotate-12">
                    →
                  </span>
                </div>
              </TiltCard>
            </motion.button>
          ))}
        </div>
      </Container>
    </section>
  )
}
