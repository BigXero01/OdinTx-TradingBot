import httpx
from loguru import logger
from app.core.config import get_settings
from app.models.schemas import MarketTicker

COINGECKO_BASE = "https://api.coingecko.com/api/v3"
TRACKED_IDS = "bitcoin,ethereum,the-open-network,solana,binancecoin,toncoin"


async def fetch_tickers() -> list[MarketTicker]:
    settings = get_settings()
    headers = {}
    if settings.coingecko_api_key:
        headers["x-cg-pro-api-key"] = settings.coingecko_api_key

    url = f"{COINGECKO_BASE}/coins/markets"
    params = {
        "vs_currency": "usd",
        "ids": TRACKED_IDS,
        "order": "market_cap_desc",
        "per_page": 20,
        "page": 1,
        "sparkline": False,
        "price_change_percentage": "24h",
    }

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(url, params=params, headers=headers)
            resp.raise_for_status()
            raw = resp.json()
        except Exception as exc:
            logger.warning(f"CoinGecko fetch failed: {exc}. Using mock data.")
            return _mock_tickers()

    return [
        MarketTicker(
            id=c["id"],
            symbol=c["symbol"],
            name=c["name"],
            price=c["current_price"],
            change24h=c.get("price_change_percentage_24h") or 0,
            volume24h=c.get("total_volume") or 0,
            marketCap=c.get("market_cap") or 0,
            image=c.get("image", ""),
        )
        for c in raw
    ]


def _mock_tickers() -> list[MarketTicker]:
    return [
        MarketTicker(id="bitcoin", symbol="btc", name="Bitcoin", price=67_420.0, change24h=2.34,
                     volume24h=28_500_000_000, marketCap=1_320_000_000_000,
                     image="https://assets.coingecko.com/coins/images/1/small/bitcoin.png"),
        MarketTicker(id="ethereum", symbol="eth", name="Ethereum", price=3_540.0, change24h=-0.87,
                     volume24h=14_200_000_000, marketCap=425_000_000_000,
                     image="https://assets.coingecko.com/coins/images/279/small/ethereum.png"),
        MarketTicker(id="the-open-network", symbol="ton", name="Toncoin", price=7.82, change24h=5.12,
                     volume24h=380_000_000, marketCap=19_500_000_000,
                     image="https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png"),
        MarketTicker(id="solana", symbol="sol", name="Solana", price=172.0, change24h=3.21,
                     volume24h=3_800_000_000, marketCap=80_000_000_000,
                     image="https://assets.coingecko.com/coins/images/4128/small/solana.png"),
        MarketTicker(id="binancecoin", symbol="bnb", name="BNB", price=593.0, change24h=-1.05,
                     volume24h=1_900_000_000, marketCap=89_000_000_000,
                     image="https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png"),
    ]
