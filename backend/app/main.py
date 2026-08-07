from fastapi import FastAPI
from app.api.v1.routes.health import router as health_router

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

@app.get("/")
def root():
    return {
        "message": "Welcome to SOC Buddy AI 🚀"
    }