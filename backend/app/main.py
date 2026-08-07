from fastapi import FastAPI

app = FastAPI(
    title="SOC Buddy AI API",
    description="AI-powered Security Operations Center Copilot",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "Welcome to SOC Buddy AI 🚀",
        "status": "running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }