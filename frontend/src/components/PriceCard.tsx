import type { MarketTicker } from '@/utils/api'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Props {
  ticker: MarketTicker
}

function fmt(n: number, digits = 2) {
  return n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

function fmtCompact(n: number) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`
  return `$${fmt(n, 0)}`
}

export default function PriceCard({ ticker }: Props) {
  const up = ticker.change24h >= 0
  return (
    <div className="bg-surface-card border border-surface-border rounded-2xl p-4 flex items-center gap-3">
      <img src={ticker.image} alt={ticker.name} className="w-10 h-10 rounded-full" />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white truncate">{ticker.name}</p>
        <p className="text-neutral text-xs uppercase">{ticker.symbol}</p>
      </div>
      <div className="text-right">
        <p className="font-mono font-semibold text-white">${fmt(ticker.price)}</p>
        <p className={`text-xs font-medium flex items-center justify-end gap-0.5 ${up ? 'text-bull' : 'text-bear'}`}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {up ? '+' : ''}{fmt(ticker.change24h)}%
        </p>
        <p className="text-neutral text-xs">{fmtCompact(ticker.volume24h)}</p>
      </div>
    </div>
  )
}
