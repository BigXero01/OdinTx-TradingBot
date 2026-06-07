const TICKS = [
  { sym: 'BTC', price: '$67,420', chg: '+2.34%', up: true },
  { sym: 'ETH', price: '$3,540', chg: '-0.87%', up: false },
  { sym: 'TON', price: '$7.82', chg: '+5.12%', up: true },
  { sym: 'SOL', price: '$172.00', chg: '+3.21%', up: true },
  { sym: 'BNB', price: '$593.00', chg: '-1.05%', up: false },
  { sym: 'USDT', price: '$1.000', chg: '+0.01%', up: true },
]

export default function Ticker() {
  const items = [...TICKS, ...TICKS]
  return (
    <div className="overflow-hidden border-b border-surface-border bg-[#0d0d0d] py-2.5" aria-hidden="true">
      <div className="flex w-max items-center gap-12 ticker-track">
        {items.map((t, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="flex items-center gap-2 font-mono text-xs whitespace-nowrap">
              <span className="font-semibold text-neutral">{t.sym}</span>
              <span className="text-white/90">{t.price}</span>
              <span className={t.up ? 'text-bull' : 'text-bear'}>{t.chg}</span>
            </div>
            <span className="h-1 w-1 rounded-full bg-surface-border" />
          </div>
        ))}
      </div>
    </div>
  )
}
