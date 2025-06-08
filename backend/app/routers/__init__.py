from fastapi import APIRouter
from .auth import router as auth_router
from .materials import router as materials_router   # пока пустой

router = APIRouter()
router.include_router(auth_router)
router.include_router(materials_router)