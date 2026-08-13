from .auth import router as auth_router
from .analysis import router as analysis_router

__all__ = [
    "auth_router",
    "analysis_router",
]
