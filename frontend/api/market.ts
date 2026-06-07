import type { VercelRequest, VercelResponse } from '@vercel/node'

const COINGECKO = 'https://api.coingecko.com/api/v3'
const IDS = 'bitcoin,ethereum,the-open-network,solana,binancecoin'

const MOCK = [
  { id: 'bitcoin',           symbol: 'btc', name: 'Bitcoin',   price: 67420,  change24h:  2.34, volume24h: 28_500_000_000, marketCap: 1_320_000_000_000, image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png' },
  { id: 'ethereum',          symbol: 'eth', name: 'Ethereum',  price: 3540,   change24h: -0.87, volume24h: 14_200_000_000, marketCap:   425_000_000_000, image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png' },
  { id: 'the-open-network',  symbol: 'ton', name: 'Toncoin',   price: 7.82,   change24h:  5.12, volume24h:    380_000_000, marketCap:    19_500_000_000, image: 'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png' },
  { id: 'solana',            symbol: 'sol', name: 'Solana',    price: 172,    change24h:  3.21, volume24h:  3_800_000_000, marketCap:    80_000_000_000, image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png' },
  { id: 'binancecoin',       symbol: 'bnb', name: 'BNB',       price: 593,    change24h: -1.05, volume24h:  1_900_000_000, marketCap:    89_000_000_000, image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png' },
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60')

  try {
    const key = process.env.COINGECKO_API_KEY
    const headers: Record<string, string> = key ? { 'x-cg-pro-api-key': key } : {}

    const r = await fetch(
      `${COINGECKO}/coins/markets?vs_currency=usd&ids=${IDS}&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h`,
      { headers, signal: AbortSignal.timeout(8000) },
    )

    if (!r.ok) throw new Error(`CoinGecko ${r.status}`)

    const raw: any[] = await r.json()
    const data = raw.map((c) => ({
      id: c.id, symbol: c.symbol, name: c.name,
      price: c.current_price,
      change24h: c.price_change_percentage_24h ?? 0,
      volume24h: c.total_volume ?? 0,
      marketCap: c.market_cap ?? 0,
      image: c.image ?? '',
    }))

    return res.json(data)
  } catch {
    return res.json(MOCK)
  }
}
