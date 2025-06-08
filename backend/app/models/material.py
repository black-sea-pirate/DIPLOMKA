from sqlalchemy import Integer, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

class Material(Base):
    __tablename__ = "materials"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    filename:  Mapped[str] = mapped_column(String)
    status:    Mapped[str] = mapped_column(String, default="uploaded")
    owner_id:  Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
