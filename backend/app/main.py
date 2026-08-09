from fastapi import FastAPI

from app.api.v1.routes.health import router as health_router
from app.api.v1.routes.users import router as users_router
from app.api.v1.routes.auth import router as auth_router
from app.api.v1.routes.incidents import router as incidents_router

app = FastAPI(
    title="SOC Buddy AI API",
    version="1.0.0",
    description="AI-powered Security Operations Center Copilot"
)

app.include_router(
    health_router,
    prefix="/api/v1",
    tags=["Health"]
)

app.include_router(
    users_router,
    prefix="/api/v1"
)

app.include_router(
    auth_router,
    prefix="/api/v1"
)

app.include_router(
    incidents_router,
    prefix="/api/v1"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to SOC Buddy AI 🚀"
    }