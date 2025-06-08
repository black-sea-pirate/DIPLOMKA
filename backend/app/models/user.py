from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int]      = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str]   = mapped_column(String, unique=True, index=True)
    password_hash: Mapped[str]
    role: Mapped[str]    = mapped_column(String)     # 'teacher' | 'student'
