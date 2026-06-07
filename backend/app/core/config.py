from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    telegram_bot_token: str = ""
    telegram_webapp_url: str = "http://localhost:5173"
    coingecko_api_key: str = ""
    ton_api_key: str = ""
    ton_network: str = "mainnet"
    redis_url: str = "redis://localhost:6379"
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    cors_origins: list[str] = ["http://localhost:5173"]

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()
