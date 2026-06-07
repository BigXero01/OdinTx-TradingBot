from fastapi import APIRouter
from app.models.schemas import MarketTicker
from app.services.market_data import fetch_tickers

router = APIRouter(prefix="/market", tags=["market"])


@router.get("/tickers", response_model=list[MarketTicker])
async def get_tickers():
    return await fetch_tickers()
