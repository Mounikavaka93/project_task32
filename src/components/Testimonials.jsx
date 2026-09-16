import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonials } from '../data/products'
import { SectionTitle, StarRating } from './ui/Brand'
import { Container } from './ui/Container'

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const next = () => setIndex((i) => (i + 1) % testimonials.length)
  const prev = () => setIndex((i) => (i - 1 + testimonials.length) % testimonials.length)

  useEffect(() => {
    const t = setInterval(next, 5200)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="relative w-full overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionTitle
          eyebrow="Parent notes"
          title="Stories from the"
          highlight="living room floor."
        />

        <div className="relative mx-auto mt-12 max-w-3xl">
          <div className="relative min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.article
                key={testimonials[index].id}
                initial={{ opacity: 0, x: 80, rotateY: -12 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: -80, rotateY: 12 }}
                transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                className="rounded-[32px] bg-cream p-6 shadow-xl shadow-navy/5 sm:p-10"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={testimonials[index].image}
                    alt={testimonials[index].name}
                    className="h-16 w-16 rounded-full object-cover ring-4 ring-white"
                  />
                  <div>
                    <h3 className="font-display text-xl font-bold text-navy">{testimonials[index].name}</h3>
                    <p className="text-sm font-bold text-ink/50">{testimonials[index].role}</p>
                    <StarRating value={testimonials[index].rating} />
                  </div>
                </div>
                <p className="mt-6 font-display text-2xl leading-snug text-navy sm:text-3xl">
                  “{testimonials[index].quote}”
                </p>
              </motion.article>
            </AnimatePresence>
          </div>
          <div className="mt-6 flex items-center justify-center gap-3">
            <RoundBtn onClick={prev} label="Previous review">
              <ChevronLeft className="h-5 w-5" />
            </RoundBtn>
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                aria-label={`Go to review ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 rounded-full transition-all ${i === index ? 'w-8 bg-candy' : 'w-2.5 bg-peach'}`}
              />
            ))}
            <RoundBtn onClick={next} label="Next review">
              <ChevronRight className="h-5 w-5" />
            </RoundBtn>
          </div>
        </div>
      </Container>
    </section>
  )
}

function RoundBtn({ children, onClick, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy text-white shadow-lg transition hover:scale-105 hover:bg-candy"
    >
      {children}
    </button>
  )
}
