@echo off
REM Setup script for Winway Backend (Windows)
echo.
echo ====================================
echo Winway Backend Setup Script
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

echo [1/5] Python found: 
python --version
echo.

REM Create virtual environment
echo [2/5] Creating virtual environment...
if exist .venv (
    echo Virtual environment already exists
) else (
    python -m venv .venv
    echo Virtual environment created
)
echo.

REM Activate virtual environment
echo [3/5] Activating virtual environment...
call .venv\Scripts\activate.bat
echo Virtual environment activated
echo.

REM Install dependencies
echo [4/5] Installing Python dependencies...
pip install -q -r requirements.txt
echo Dependencies installed
echo.

REM Initialize database
echo [5/5] Database setup...
echo.
echo IMPORTANT: Make sure PostgreSQL is running and database 'winway' exists
echo.
echo To create the database, run in PostgreSQL:
echo   CREATE DATABASE winway;
echo.
echo Enter 'y' to initialize the database and seed admin user, or 'n' to skip:
set /p init_db="Initialize database? (y/n): "

if /i "%init_db%"=="y" (
    python init_db.py
    echo.
    echo Database initialized!
    echo Default credentials:
    echo   Username: admin
    echo   Password: admin123
) else (
    echo Skipped database initialization
)

echo.
echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Next steps:
echo 1. Update DATABASE_URL in database.py with your PostgreSQL credentials
echo 2. Run: uvicorn main:app --reload
echo 3. Visit: http://localhost:8000
echo 4. API docs: http://localhost:8000/docs
echo.
pause
