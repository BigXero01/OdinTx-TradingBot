import { motion } from 'framer-motion'
import { Zap, RefreshCw } from 'lucide-react'
import { useSignals } from '@/hooks/useMarketData'
import SignalCard from '@/components/SignalCard'

const FILTER_OPTS = ['ALL', 'BUY', 'SELL', 'HOLD'] as const
type Filter = (typeof FILTER_OPTS)[number]

import { useState } from 'react'

export default function Signals() {
  const { data, isLoading, isFetching, refetch } = useSignals()
  const [filter, setFilter] = useState<Filter>('ALL')

  const filtered = data?.filter((s) => filter === 'ALL' || s.action === filter) ?? []

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-brand" />
          <h1 className="text-xl font-bold text-white">AI Signals</h1>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 rounded-full bg-surface-card border border-surface-border text-neutral hover:text-white transition-colors"
        >
          <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide">
        {FILTER_OPTS.map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              filter === opt
                ? 'bg-brand text-black'
                : 'bg-surface-card border border-surface-border text-neutral hover:text-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-surface-card border border-surface-border rounded-2xl h-36 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-neutral py-16">
          <Zap size={40} className="mx-auto mb-3 opacity-30" />
          <p>No {filter === 'ALL' ? '' : filter} signals right now</p>
        </div>
      ) : (
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        >
          {filtered.map((signal) => (
            <SignalCard key={signal.id} signal={signal} />
          ))}
        </motion.div>
      )}
    </div>
  )
}
