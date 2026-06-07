import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import { usePortfolio } from '@/hooks/useMarketData'

export default function Portfolio() {
  const address = useTonAddress()
  const { data, isLoading } = usePortfolio(address)

  const totalValue = data?.reduce((acc, a) => acc + a.valueUsd, 0) ?? 0

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Wallet size={20} className="text-brand" />
          <h1 className="text-xl font-bold text-white">Portfolio</h1>
        </div>
        <TonConnectButton />
      </div>

      {!address ? (
        <div className="text-center py-16">
          <Wallet size={48} className="mx-auto mb-4 text-neutral opacity-40" />
          <p className="text-white font-semibold mb-2">Connect your TON wallet</p>
          <p className="text-neutral text-sm mb-6">View your on-chain portfolio and get personalized signals</p>
          <TonConnectButton />
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-brand/10 border border-brand/20 rounded-2xl p-5 mb-5 text-center"
          >
            <p className="text-neutral text-sm mb-1">Total Value</p>
            <p className="text-3xl font-bold text-white">
              ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </motion.div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-surface-card border border-surface-border rounded-2xl h-16 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {data?.map((asset) => (
                <div key={asset.symbol} className="bg-surface-card border border-surface-border rounded-2xl p-4 flex items-center gap-3">
                  <img src={asset.image} alt={asset.name} className="w-9 h-9 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white">{asset.name}</p>
                    <p className="text-neutral text-xs">{asset.amount} {asset.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-semibold text-white">
                      ${asset.valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className={`text-xs flex items-center justify-end gap-0.5 ${asset.change24h >= 0 ? 'text-bull' : 'text-bear'}`}>
                      {asset.change24h >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
