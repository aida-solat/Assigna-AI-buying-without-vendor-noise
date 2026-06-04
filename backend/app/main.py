"""Assigna — B2B Solution Assignment Engine.

FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router

app = FastAPI(
    title="Assigna",
    description="B2B Solution Assignment Engine — Evidence-scored vendor matching",
    version="0.2.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Lock down in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "name": "Assigna",
        "version": "0.2.0",
        "description": "B2B Solution Assignment Engine",
        "docs": "/docs",
    }
