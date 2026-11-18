from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.routes.health import router as health_router
from app.api.v1.routes.users import router as users_router
from app.api.v1.routes.auth import router as auth_router
from app.api.v1.routes.incidents import router as incidents_router
from app.api.v1.routes.upload import router as upload_router
from app.api.v1.routes.password_reset import (
    router as password_reset_router,
)


app = FastAPI(
    title="SOC Buddy AI API",
    version="1.0.0",
    description="AI-powered Security Operations Center Copilot",
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# API ROUTES
# ============================================================

# Health
app.include_router(
    health_router,
    prefix="/api/v1",
    tags=["Health"],
)


# Users
app.include_router(
    users_router,
    prefix="/api/v1",
)


# Authentication / Login
app.include_router(
    auth_router,
    prefix="/api/v1",
)


# Password Reset
app.include_router(
    password_reset_router,
    prefix="/api/v1",
)


# Incidents
app.include_router(
    incidents_router,
    prefix="/api/v1",
)


# Security Log Upload & AI Analysis
app.include_router(
    upload_router,
    prefix="/api/v1",
)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Welcome to SOC Buddy AI 🚀",
        "status": "online",
        "version": "1.0.0",
    }