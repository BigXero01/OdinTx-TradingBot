import { motion } from 'framer-motion'
import type { Signal } from '@/utils/api'
import { TrendingUp, TrendingDown, Minus, Target, Shield } from 'lucide-react'

interface Props {
  signal: Signal
}

const actionConfig = {
  BUY: { color: 'text-bull', bg: 'bg-bull/10 border-bull/20', icon: TrendingUp },
  SELL: { color: 'text-bear', bg: 'bg-bear/10 border-bear/20', icon: TrendingDown },
  HOLD: { color: 'text-neutral', bg: 'bg-neutral/10 border-neutral/20', icon: Minus },
}

const strengthBadge = {
  STRONG: 'bg-brand/20 text-brand',
  MODERATE: 'bg-yellow-500/20 text-yellow-400',
  WEAK: 'bg-neutral/20 text-neutral',
}

export default function SignalCard({ signal }: Props) {
  const cfg = actionConfig[signal.action]
  const Icon = cfg.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-surface-card border rounded-2xl p-4 ${cfg.bg}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`font-bold text-lg ${cfg.color}`}>{signal.symbol.toUpperCase()}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${strengthBadge[signal.strength]}`}>
            {signal.strength}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 font-bold text-sm px-3 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
          <Icon size={14} />
          {signal.action}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3 text-center">
        <div className="bg-surface rounded-xl p-2">
          <p className="text-neutral text-xs mb-0.5">Entry</p>
          <p className="font-mono text-white text-sm font-semibold">${signal.price.toFixed(2)}</p>
        </div>
        <div className="bg-surface rounded-xl p-2">
          <p className="text-neutral text-xs mb-0.5 flex items-center justify-center gap-1"><Target size={10} />Target</p>
          <p className="font-mono text-bull text-sm font-semibold">${signal.target.toFixed(2)}</p>
        </div>
        <div className="bg-surface rounded-xl p-2">
          <p className="text-neutral text-xs mb-0.5 flex items-center justify-center gap-1"><Shield size={10} />Stop</p>
          <p className="font-mono text-bear text-sm font-semibold">${signal.stopLoss.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1 flex-wrap">
          {signal.reasons.slice(0, 3).map((r) => (
            <span key={r} className="text-xs bg-surface px-2 py-0.5 rounded-full text-neutral">{r}</span>
          ))}
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral">Confidence</p>
          <p className="font-semibold text-brand text-sm">{signal.confidence}%</p>
        </div>
      </div>
    </motion.div>
  )
}
