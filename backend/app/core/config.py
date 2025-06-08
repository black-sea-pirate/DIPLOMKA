from pydantic import BaseSettings
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()                      # читаем .env

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 60

settings = Settings()              # импортируешь и используешь
