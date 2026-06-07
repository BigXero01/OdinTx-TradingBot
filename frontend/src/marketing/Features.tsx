import { BarChart3, Link2, Gem, Crosshair, BellRing, Gift } from 'lucide-react'
import Reveal from './Reveal'

const FEATURES = [
  { icon: BarChart3, title: 'Technical Analysis', desc: 'RSI, MACD, and momentum indicators computed on live OHLCV data. No noise — just clear signals.' },
  { icon: Link2, title: 'On-Chain Intel', desc: 'TON wallet portfolio tracking and jetton balances via tonapi.io, updated in real time.' },
  { icon: Gem, title: 'TON Native', desc: 'Connect your TON wallet with TonConnect. Track on-chain holdings alongside your signal feed.' },
  { icon: Crosshair, title: 'TP / SL Levels', desc: 'Every signal ships with a precise entry, take-profit, and stop-loss. No guesswork required.' },
  { icon: BellRing, title: 'Instant Alerts', desc: 'Signal notifications delivered directly in Telegram. No third-party app ever needed.' },
  { icon: Gift, title: 'Free Forever', desc: 'Core signals are free. No subscription, no credit card. Built for the TON community.' },
]

export default function Features() {
  return (
    <section id="features" className="px-5 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">Features</p>
          <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Everything in one place
          </h2>
          <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-neutral">
            No separate apps, no email alerts, no dashboards to manage — it all lives inside Telegram.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => {
            const Icon = f.icon
            return (
              <Reveal
                key={f.title}
                delay={(i % 3) * 0.08}
                className="rounded-2xl border border-surface-border bg-surface-card p-6 transition-colors hover:border-brand/40"
              >
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand">
                  <Icon size={22} />
                </span>
                <h3 className="mb-1.5 font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-neutral">{f.desc}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
