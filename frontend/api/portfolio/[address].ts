import type { VercelRequest, VercelResponse } from '@vercel/node'

const TON_API = 'https://tonapi.io/v2'

const MOCK = [
  { symbol: 'TON',  name: 'Toncoin', amount: 150.5, valueUsd: 1175.91, change24h:  5.12, image: 'https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png' },
  { symbol: 'USDT', name: 'Tether',  amount: 500.0, valueUsd:  500.00, change24h:  0.01, image: 'https://assets.coingecko.com/coins/images/325/small/Tether.png' },
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120')

  const { address } = req.query
  if (!address || typeof address !== 'string' || address.length < 10) {
    return res.status(400).json({ error: 'Invalid address' })
  }

  try {
    const r = await fetch(`${TON_API}/accounts/${address}/jettons`, {
      signal: AbortSignal.timeout(8000),
    })
    if (!r.ok) throw new Error(`tonapi ${r.status}`)

    const { balances = [] }: { balances: any[] } = await r.json()

    const assets = balances.slice(0, 10).flatMap((j) => {
      try {
        const meta = j.jetton ?? {}
        const amount = Number(j.balance ?? 0) / 10 ** (meta.decimals ?? 9)
        return [{ symbol: meta.symbol ?? '?', name: meta.name ?? 'Unknown', amount: +amount.toFixed(4), valueUsd: 0, change24h: 0, image: meta.image ?? '' }]
      } catch { return [] }
    })

    return res.json(assets.length ? assets : MOCK)
  } catch {
    return res.json(MOCK)
  }
}
