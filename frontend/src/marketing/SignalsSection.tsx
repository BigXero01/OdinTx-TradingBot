import { TrendingUp, TrendingDown } from 'lucide-react'
import Reveal from './Reveal'

interface DemoSignal {
  sym: string
  name: string
  glyph: string
  glyphBg: string
  action: 'BUY' | 'SELL'
  strength: string
  entry: string
  target: string
  stop: string
  tags: string[]
  confidence: number
}

const SIGNALS: DemoSignal[] = [
  {
    sym: 'BTC', name: 'Bitcoin', glyph: '₿', glyphBg: 'bg-[#F7931A]',
    action: 'BUY', strength: 'STRONG', entry: '$67,420', target: '$72,813', stop: '$64,049',
    tags: ['RSI Oversold', 'MACD Bullish'], confidence: 88,
  },
  {
    sym: 'ETH', name: 'Ethereum', glyph: 'Ξ', glyphBg: 'bg-[#627EEA]',
    action: 'SELL', strength: 'MODERATE', entry: '$3,540', target: '$3,292', stop: '$3,681',
    tags: ['RSI Overbought', 'MACD Bearish'], confidence: 74,
  },
  {
    sym: 'TON', name: 'Toncoin', glyph: '◎', glyphBg: 'bg-[#0098EA]',
    action: 'BUY', strength: 'STRONG', entry: '$7.82', target: '$8.44', stop: '$7.42',
    tags: ['Momentum', 'MACD Bullish'], confidence: 82,
  },
]

function SignalCard({ s, delay }: { s: DemoSignal; delay: number }) {
  const isBuy = s.action === 'BUY'
  const accent = isBuy ? 'text-bull' : 'text-bear'
  const ring = isBuy ? 'border-bull/20 bg-bull/[0.04]' : 'border-bear/20 bg-bear/[0.04]'
  const pill = isBuy ? 'bg-bull/15 text-bull' : 'bg-bear/15 text-bear'

  return (
    <Reveal delay={delay} className={`rounded-2xl border p-5 ${ring}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold text-white ${s.glyphBg}`}>{s.glyph}</span>
          <div>
            <p className="font-bold text-white">{s.sym}</p>
            <p className="text-xs text-neutral">{s.name}</p>
          </div>
        </div>
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${pill}`}>
          {isBuy ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {s.action} · {s.strength}
        </span>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        {[
          { l: 'Entry', v: s.entry, c: 'text-white' },
          { l: 'Target', v: s.target, c: 'text-bull' },
          { l: 'Stop', v: s.stop, c: 'text-bear' },
        ].map((b) => (
          <div key={b.l} className="rounded-xl bg-surface p-2.5 text-center">
            <p className="mb-0.5 text-[11px] text-neutral">{b.l}</p>
            <p className={`font-mono text-sm font-semibold ${b.c}`}>{b.v}</p>
          </div>
        ))}
      </div>

      <div className="flex items-end justify-between">
        <div className="flex flex-wrap gap-1.5">
          {s.tags.map((t) => (
            <span key={t} className="rounded-full bg-surface px-2 py-0.5 text-[11px] text-neutral">{t}</span>
          ))}
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold ${accent}`}>{s.confidence}%</p>
          <p className="text-[11px] text-neutral">confidence</p>
        </div>
      </div>
    </Reveal>
  )
}

export default function SignalsSection() {
  return (
    <section id="signals" className="px-5 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">Signal Engine</p>
          <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Real-time AI signals
          </h2>
          <p className="mt-3 max-w-2xl text-pretty leading-relaxed text-neutral">
            Every signal includes a precise entry, take-profit target, stop-loss, and a
            confidence score computed from multiple technical indicators.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {SIGNALS.map((s, i) => (
            <SignalCard key={s.sym} s={s} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}
