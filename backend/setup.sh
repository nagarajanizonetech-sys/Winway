#!/bin/bash

# Setup script for Winway Backend (macOS/Linux)

echo ""
echo "===================================="
echo "Winway Backend Setup Script"
echo "===================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

echo "[1/5] Python found:"
python3 --version
echo ""

# Create virtual environment
echo "[2/5] Creating virtual environment..."
if [ -d "venv" ]; then
    echo "Virtual environment already exists"
else
    python3 -m venv venv
    echo "Virtual environment created"
fi
echo ""

# Activate virtual environment
echo "[3/5] Activating virtual environment..."
source venv/bin/activate
echo "Virtual environment activated"
echo ""

# Install dependencies
echo "[4/5] Installing Python dependencies..."
pip install -q -r requirements.txt
echo "Dependencies installed"
echo ""

# Initialize database
echo "[5/5] Database setup..."
echo ""
echo "IMPORTANT: Make sure PostgreSQL is running and database 'winway' exists"
echo ""
echo "To create the database, run in PostgreSQL:"
echo "  CREATE DATABASE winway;"
echo ""
read -p "Initialize database and seed admin user? (y/n): " init_db

if [ "$init_db" = "y" ] || [ "$init_db" = "Y" ]; then
    python init_db.py
    echo ""
    echo "Database initialized!"
    echo "Default credentials:"
    echo "  Username: admin"
    echo "  Password: admin123"
else
    echo "Skipped database initialization"
fi

echo ""
echo "===================================="
echo "Setup Complete!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Update DATABASE_URL in database.py with your PostgreSQL credentials"
echo "2. Run: uvicorn main:app --reload"
echo "3. Visit: http://localhost:8000"
echo "4. API docs: http://localhost:8000/docs"
echo ""
