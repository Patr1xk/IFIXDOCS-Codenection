from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
from dotenv import load_dotenv
import os

from api.routes import docs, ai, parsing, maintenance, onboarding, multilingual, visualizations
from core.config import settings

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="SmartDocs - Intelligent Documentation Assistant",
    description="AI-powered documentation tool that simplifies writing, speeds up reading, and makes maintenance easy",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(docs.router, prefix="/api/docs", tags=["Documentation"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI Services"])
app.include_router(parsing.router, prefix="/api/parsing", tags=["Code Parsing"])
app.include_router(maintenance.router, prefix="/api/maintenance", tags=["Maintenance"])
app.include_router(onboarding.router, prefix="/api/onboarding", tags=["Onboarding"])
app.include_router(multilingual.router, prefix="/api/multilingual", tags=["Multilingual"])
app.include_router(visualizations.router, prefix="/api/visualizations", tags=["Visualizations"])

# Health check endpoint
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "SmartDocs Backend"}

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "SmartDocs API",
        "version": "1.0.0",
        "docs": "/api/docs"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
