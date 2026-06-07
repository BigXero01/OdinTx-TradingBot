from fastapi import APIRouter, HTTPException
import httpx
from app.models.schemas import PortfolioAsset

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

TON_API = "https://tonapi.io/v2"

MOCK_ASSETS = [
    PortfolioAsset(symbol="TON", name="Toncoin", amount=150.5, valueUsd=1175.91, change24h=5.12,
                   image="https://assets.coingecko.com/coins/images/17980/small/ton_symbol.png"),
    PortfolioAsset(symbol="USDT", name="Tether", amount=500.0, valueUsd=500.0, change24h=0.01,
                   image="https://assets.coingecko.com/coins/images/325/small/Tether.png"),
]


@router.get("/{address}", response_model=list[PortfolioAsset])
async def get_portfolio(address: str):
    if not address or len(address) < 10:
        raise HTTPException(status_code=400, detail="Invalid address")

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(f"{TON_API}/accounts/{address}/jettons")
            resp.raise_for_status()
            jettons = resp.json().get("balances", [])
        except Exception:
            return MOCK_ASSETS

    assets: list[PortfolioAsset] = []
    for j in jettons[:10]:
        try:
            metadata = j.get("jetton", {})
            balance = int(j.get("balance", 0)) / (10 ** metadata.get("decimals", 9))
            assets.append(PortfolioAsset(
                symbol=metadata.get("symbol", "?"),
                name=metadata.get("name", "Unknown"),
                amount=round(balance, 4),
                valueUsd=0.0,
                change24h=0.0,
                image=metadata.get("image", ""),
            ))
        except Exception:
            continue

    return assets or MOCK_ASSETS
