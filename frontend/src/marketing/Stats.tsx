import Reveal from './Reveal'

const STATS = [
  { num: '5+', desc: 'Tracked Assets' },
  { num: '30s', desc: 'Refresh Rate' },
  { num: '3', desc: 'Signal Indicators' },
  { num: 'Free', desc: 'Always Free' },
]

export default function Stats() {
  return (
    <section className="border-y border-surface-border bg-surface-card/40">
      <div className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-y divide-surface-border md:grid-cols-4 md:divide-y-0">
        {STATS.map((s, i) => (
          <Reveal key={s.desc} delay={i * 0.06} className="p-6 text-center">
            <p className="text-3xl font-extrabold text-brand md:text-4xl">{s.num}</p>
            <p className="mt-1 text-sm text-neutral">{s.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
