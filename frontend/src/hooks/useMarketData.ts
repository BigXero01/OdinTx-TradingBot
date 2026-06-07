import { useQuery } from 'react-query'
import { fetchMarket, fetchSignals, fetchPortfolio } from '@/utils/api'

export function useMarketData() {
  return useQuery('market', fetchMarket, { refetchInterval: 30_000 })
}

export function useSignals() {
  return useQuery('signals', fetchSignals, { refetchInterval: 60_000 })
}

export function usePortfolio(address?: string) {
  return useQuery(['portfolio', address], () => fetchPortfolio(address!), {
    enabled: !!address,
    refetchInterval: 60_000,
  })
}
