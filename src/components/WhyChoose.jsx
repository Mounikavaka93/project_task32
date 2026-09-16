import { motion } from 'framer-motion'
import { whyChoose } from '../data/products'
import { SectionTitle } from './ui/Brand'
import { ShieldCheck, Award, Truck, GraduationCap, Smile } from 'lucide-react'
import { Container } from './ui/Container'

const icons = [ShieldCheck, Award, Truck, GraduationCap, Smile]

export function WhyChoose() {
  return (
    <section id="about" className="relative w-full bg-cream py-16 sm:py-20 lg:py-24">
      <Container>
        <SectionTitle
          eyebrow="Why IDEALS"
          title="The six letters behind"
          highlight="every toy box."
          copy="Imagination, Discovery, Education, Adventure, Love, Spark — that’s the checklist, not a slogan."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((item, i) => {
            const Icon = icons[i]
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-md"
              >
                <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${item.accent} text-white shadow-lg`}>
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-ink/40">
                  {item.letter} · {item.word}
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-navy">{item.title}</h3>
                <p className="mt-2 max-w-md leading-relaxed text-ink/65">{item.text}</p>
                <span className="pointer-events-none absolute -right-4 -top-6 font-display text-8xl font-bold text-navy/5">
                  {item.letter}
                </span>
              </motion.article>
            )
          })}
          <motion.article
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[28px] bg-navy p-6 text-white"
          >
            <p className="text-xs font-black uppercase tracking-[0.25em] text-sunny">S · Spark</p>
            <h3 className="mt-2 font-display text-2xl font-bold">The extra letter we live for</h3>
            <p className="mt-2 text-white/70">
              Spark is the giggle after the box is open. If a toy doesn’t create it, we don’t ship it.
            </p>
          </motion.article>
        </div>
      </Container>
    </section>
  )
}
