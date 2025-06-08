from pydantic import BaseModel, EmailStr

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    class Config: orm_mode = True

class TokenOut(BaseModel):
    token: str
    role: str
