# Quick Start Guide

Get Winway Computers up and running in 5 minutes!

## Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

---

## 🚀 Quick Setup (Windows)

### Backend Setup

```bash
cd backend
setup.bat
```

This will:

- Create Python virtual environment
- Install dependencies
- Initialize database
- Seed admin user (username: `admin`, password: `admin123`)

### Frontend Setup

```bash
cd frontend
npm install
```

---

## 🚀 Quick Setup (macOS/Linux)

### Backend Setup

```bash
cd backend
chmod +x setup.sh
./setup.sh
```

### Frontend Setup

```bash
cd frontend
npm install
```

---

## ▶️ Running the Application

### Terminal 1 - Backend

```bash
cd backend
.venv\Scripts\activate          # Windows
source venv/bin/activate        # macOS/Linux
uvicorn main:app --reload
```

✅ Backend: `http://localhost:8000`
📚 Docs: `http://localhost:8000/docs`

### Terminal 2 - Frontend

```bash
cd frontend
npm run dev
```

✅ Frontend: `http://localhost:5173`

---

## 🔐 Default Credentials

**Admin Login:**

- Username: `admin`
- Password: `admin123`

⚠️ Change these in production!

---

## 📝 Common Tasks

### Add Product

1. Go to `http://localhost:5173/admin/login`
2. Login with admin credentials
3. Click "Add Product"
4. Fill in details and upload image

### View API Documentation

Visit `http://localhost:8000/docs` for interactive Swagger UI

### Reset Database

```bash
cd backend
python init_db.py
```

---

## ❌ Troubleshooting

### "Port 8000 already in use"

```bash
uvicorn main:app --port 8001 --reload
```

### "Connection to database failed"

Check if PostgreSQL is running and database exists:

```sql
CREATE DATABASE winway;
```

### "Module not found" (Frontend)

```bash
cd frontend
rm -rf node_modules
npm install
```

---

## 📚 Full Documentation

See `README.md` for complete setup and deployment guide

---

**Ready to start?** Run setup scripts and you'll be up in minutes! 🎉
