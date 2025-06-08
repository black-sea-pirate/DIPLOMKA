from datetime import datetime, timedelta
from passlib.hash import bcrypt
from jose import jwt
from app.core.config import settings

ALGO = "HS256"

def hash_password(pwd: str) -> str:
    return bcrypt.hash(pwd)

def verify_password(pwd: str, hashed: str) -> bool:
    return bcrypt.verify(pwd, hashed)

def create_token(data: dict, expires_minutes: int = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes or settings.JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=ALGO)

def decode_token(token: str):
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGO])
