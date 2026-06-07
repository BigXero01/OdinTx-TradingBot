from pydantic import BaseModel
from typing import Literal


class MarketTicker(BaseModel):
    id: str
    symbol: str
    name: str
    price: float
    change24h: float
    volume24h: float
    marketCap: float
    image: str


class Signal(BaseModel):
    id: str
    coin: str
    symbol: str
    action: Literal["BUY", "SELL", "HOLD"]
    strength: Literal["STRONG", "MODERATE", "WEAK"]
    price: float
    target: float
    stopLoss: float
    confidence: int
    reasons: list[str]
    timestamp: str


class PortfolioAsset(BaseModel):
    symbol: str
    name: str
    amount: float
    valueUsd: float
    change24h: float
    image: str
