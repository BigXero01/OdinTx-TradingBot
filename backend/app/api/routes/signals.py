from fastapi import APIRouter
from app.models.schemas import Signal
from app.services.signal_engine import generate_signals

router = APIRouter(prefix="/signals", tags=["signals"])


@router.get("", response_model=list[Signal])
async def get_signals():
    return await generate_signals()
