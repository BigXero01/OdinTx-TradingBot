import { Radio, BrainCircuit, Target, Bell } from 'lucide-react'
import Reveal from './Reveal'

const STEPS = [
  {
    num: '01', icon: Radio, title: 'Live Market Data',
    desc: 'Price, volume, and order flow fetched every 30 seconds from CoinGecko and TON chain data.',
  },
  {
    num: '02', icon: BrainCircuit, title: 'AI Analysis',
    desc: 'RSI, MACD, and momentum scoring across 14-day OHLCV windows. Weighted signal score computed.',
  },
  {
    num: '03', icon: Target, title: 'Signal Generated',
    desc: 'BUY / SELL / HOLD with entry price, take-profit target, stop-loss, and confidence score.',
  },
  {
    num: '04', icon: Bell, title: 'Telegram Alert',
    desc: 'Signal pushed to your Telegram instantly. Open the Mini App for full detail and portfolio view.',
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="border-t border-surface-border px-5 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">How it works</p>
          <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            From data to decision in seconds
          </h2>
          <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-neutral">
            OdinTx fetches live OHLCV data, runs it through a multi-indicator engine, and
            delivers a clear signal directly to your Telegram.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-surface-border bg-surface-border md:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal key={s.num} delay={i * 0.08} className="bg-surface-card p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                    <Icon size={20} />
                  </span>
                  <span className="font-mono text-sm text-neutral">{s.num}</span>
                </div>
                <h3 className="mb-1.5 font-semibold text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed text-neutral">{s.desc}</p>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
