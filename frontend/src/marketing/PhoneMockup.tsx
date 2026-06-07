import { motion } from 'framer-motion'

const COINS = [
  { sym: 'BTC', name: 'Bitcoin', glyph: '₿', price: '$67,420', chg: '+2.34%', up: true, bg: 'bg-[#F7931A]' },
  { sym: 'ETH', name: 'Ethereum', glyph: 'Ξ', price: '$3,540', chg: '-0.87%', up: false, bg: 'bg-[#627EEA]' },
  { sym: 'TON', name: 'Toncoin', glyph: '◎', price: '$7.82', chg: '+5.12%', up: true, bg: 'bg-[#0098EA]' },
]

export default function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px]">
      <div className="rounded-[40px] border border-surface-border bg-[#050505] p-3 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
        <div className="relative overflow-hidden rounded-[30px] border border-surface-border bg-surface">
          {/* Notch */}
          <div className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-surface-border" />

          <div className="px-3 pb-3 pt-7">
            {/* App bar */}
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-sm font-bold text-white">OdinTx</span>
              <span className="h-2 w-2 rounded-full bg-bull pulse-glow" />
            </div>

            {/* Price rows */}
            <div className="space-y-2">
              {COINS.map((c) => (
                <div key={c.sym} className="flex items-center gap-2.5 rounded-xl border border-surface-border bg-surface-card p-2.5">
                  <span className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-white ${c.bg}`}>{c.glyph}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-white">{c.name}</p>
                    <p className="text-[10px] uppercase text-neutral">{c.sym}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-semibold text-white">{c.price}</p>
                    <p className={`text-[10px] font-medium ${c.up ? 'text-bull' : 'text-bear'}`}>{c.chg}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Signal card */}
            <div className="mt-2.5 rounded-xl border border-bull/20 bg-bull/10 p-3">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white">BTC/USDT</span>
                <span className="rounded-full bg-bull/20 px-2 py-0.5 text-[10px] font-bold text-bull">▲ BUY</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { l: 'Entry', v: '$67,420', c: 'text-white' },
                  { l: 'Target', v: '$72,813', c: 'text-bull' },
                  { l: 'Stop', v: '$64,049', c: 'text-bear' },
                ].map((b) => (
                  <div key={b.l} className="rounded-lg bg-surface p-1.5 text-center">
                    <p className="text-[9px] text-neutral">{b.l}</p>
                    <p className={`font-mono text-[10px] font-semibold ${b.c}`}>{b.v}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-center text-[10px] font-semibold text-brand">88% confidence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Glow */}
      <motion.div
        className="absolute -inset-8 -z-10 rounded-full bg-brand/20 blur-3xl"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
