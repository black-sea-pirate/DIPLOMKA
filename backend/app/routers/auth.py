from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import verify_password, create_token
from app.schemas.user import TokenOut

router = APIRouter(prefix="/auth", tags=["auth"])

async def get_db():
    async with SessionLocal() as session:
        yield session

@router.post("/login", response_model=TokenOut)
async def login(email: str, password: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).where(User.email == email))
    user = res.scalar_one_or_none()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=401, detail="invalid credentials")
    token = create_token({"sub": str(user.id), "role": user.role})
    return {"token": token, "role": user.role}
