import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const initData = window.Telegram?.WebApp?.initDataUnsafe
  if (initData) {
    config.headers['X-Telegram-Init-Data'] = JSON.stringify(initData)
  }
  return config
})

export interface MarketTicker {
  id: string
  symbol: string
  name: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  image: string
}

export interface Signal {
  id: string
  coin: string
  symbol: string
  action: 'BUY' | 'SELL' | 'HOLD'
  strength: 'STRONG' | 'MODERATE' | 'WEAK'
  price: number
  target: number
  stopLoss: number
  confidence: number
  reasons: string[]
  timestamp: string
}

export interface PortfolioAsset {
  symbol: string
  name: string
  amount: number
  valueUsd: number
  change24h: number
  image: string
}

export const fetchMarket = () =>
  api.get<MarketTicker[]>('/market/tickers').then((r) => r.data)

export const fetchSignals = () =>
  api.get<Signal[]>('/signals').then((r) => r.data)

export const fetchPortfolio = (address: string) =>
  api.get<PortfolioAsset[]>(`/portfolio/${address}`).then((r) => r.data)
