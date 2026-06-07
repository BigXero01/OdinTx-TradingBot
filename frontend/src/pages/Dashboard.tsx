import { motion } from 'framer-motion'
import { RefreshCw, Zap } from 'lucide-react'
import { useMarketData } from '@/hooks/useMarketData'
import PriceCard from '@/components/PriceCard'
import { useTelegramUser } from '@/hooks/useTelegramTheme'

export default function Dashboard() {
  const { data, isLoading, isFetching, refetch } = useMarketData()
  const user = useTelegramUser()

  const totalChange = data
    ? data.reduce((acc, t) => acc + t.change24h, 0) / data.length
    : 0

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-neutral text-sm">Welcome back,</p>
          <h1 className="text-xl font-bold text-white">{user?.first_name ?? 'Trader'}</h1>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 rounded-full bg-surface-card border border-surface-border text-neutral hover:text-white transition-colors"
        >
          <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Market summary banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-brand/10 border border-brand/20 rounded-2xl p-4 mb-5 flex items-center justify-between"
      >
        <div>
          <p className="text-xs text-neutral mb-1">Market Sentiment</p>
          <p className={`text-lg font-bold ${totalChange >= 0 ? 'text-bull' : 'text-bear'}`}>
            {totalChange >= 0 ? 'Bullish' : 'Bearish'} ({totalChange >= 0 ? '+' : ''}{totalChange.toFixed(2)}%)
          </p>
        </div>
        <Zap size={32} className="text-brand opacity-60" />
      </motion.div>

      <h2 className="text-sm font-semibold text-neutral uppercase tracking-widest mb-3">Live Prices</h2>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface-card border border-surface-border rounded-2xl p-4 h-[72px] animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          className="space-y-3"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {data?.map((ticker) => (
            <motion.div
              key={ticker.id}
              variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
            >
              <PriceCard ticker={ticker} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
