from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

import models
from database import engine
from routers import products, services, enquiries, admin, hero

# Initialize database and default admin
from init_db import init_db
try:
    init_db()
except Exception as e:
    print(f"Database initialization failed: {e}")

try:
    import migrate_hero
    migrate_hero.migrate()
except Exception as e:
    print(f"Migration failed: {e}")

app = FastAPI(title="Winway Computers API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads and herosection directories exist
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
UPLOAD_HERO_DIR = os.path.join(UPLOAD_DIR, "herosection")
if not os.path.exists(UPLOAD_HERO_DIR):
    os.makedirs(UPLOAD_HERO_DIR)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(products.router)
app.include_router(services.router)
app.include_router(enquiries.router)
app.include_router(admin.router)
app.include_router(hero.router)

@app.get("/")
def root():
    return {"message": "Welcome to Winway Computers API"}

@app.get("/health")
def health_check():
    """Lightweight health check endpoint for keep-alive pings."""
    return {"status": "ok"}
