# Project Handoff Document

## Welcome to Winway Computers!

This document provides everything you need to understand, maintain, and extend this project.

---

## 📋 Project Overview

**Winway Computers** is a full-stack web application for:

- 💼 Selling laptops and computers
- 🔧 Offering repair services
- 📧 Managing customer inquiries
- 🔐 Admin product management with JWT authentication

**Live Components:**

- Frontend: React + Vite + Tailwind CSS
- Backend: FastAPI + SQLAlchemy + PostgreSQL
- Database: PostgreSQL 12+

---

## 🎯 Key Features

### Public Features

✅ Browse laptops and services
✅ Submit inquiries
✅ Responsive light theme UI
✅ Smooth animations
✅ Mobile-friendly design

### Admin Features

✅ Secure JWT authentication
✅ Add/update/delete products
✅ Upload product images
✅ Protected admin dashboard
✅ View all customer inquiries

---

## 📚 Documentation

Start here based on your role:

| Role                   | Read First                          |
| ---------------------- | ----------------------------------- |
| **New Developer**      | QUICK_START.md → README.md          |
| **DevOps/Deployment**  | DEPLOYMENT.md                       |
| **Database Admin**     | README.md (Database section)        |
| **Frontend Developer** | frontend/README.md → QUICK_START.md |
| **Backend Developer**  | README.md → backend/routers/        |

---

## 🗂️ Project Structure Overview

```
winway/
├── README.md              ← Main documentation
├── QUICK_START.md         ← Get running in 5 min
├── DEPLOYMENT.md          ← Production guide
├── .gitignore             ← Git ignore rules
│
├── backend/               ← FastAPI application
│   ├── .venv/             ← Python virtual environment
│   ├── main.py            ← App entry point
│   ├── database.py        ← DB config (UPDATE DATABASE_URL HERE)
│   ├── init_db.py         ← DB initialization script
│   ├── models.py          ← SQLAlchemy models
│   ├── schemas.py         ← Pydantic request/response schemas
│   ├── crud.py            ← Database operations
│   ├── requirements.txt    ← Python dependencies
│   ├── setup.bat/sh       ← Auto setup scripts
│   ├── routers/           ← API endpoints
│   │   ├── admin.py       ← Admin login & protected routes
│   │   ├── products.py    ← Product CRUD endpoints
│   │   ├── services.py    ← Service endpoints
│   │   └── enquiries.py   ← Inquiry submission
│   ├── utils/
│   │   └── auth.py        ← JWT token handling
│   └── uploads/           ← Product images (generated at runtime)
│
├── frontend/              ← React + Vite application
│   ├── src/
│   │   ├── main.tsx       ← Entry point
│   │   ├── App.tsx        ← Routes & layout
│   │   ├── pages/         ← Page components
│   │   │   ├── Home.tsx   ← Homepage
│   │   │   ├── AdminLogin.tsx
│   │   │   └── AdminDashboard.tsx
│   │   ├── components/    ← Reusable UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── EnquiryModal.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── BrandMarquee.tsx
│   │   │   └── ProtectedRoute.tsx ← Auth guard
│   │   ├── services/
│   │   │   └── api.ts     ← Axios configuration
│   │   └── styles/
│   │       └── index.css
│   ├── package.json       ← Node dependencies
│   └── tailwind.config.js ← Tailwind configuration
│
└── .venv/                 ← Python virtual env (do not edit)
```

---

## 🚀 Getting Started

### Step 1: Clone/Download Project

The project structure is already set up!

### Step 2: Backend Setup (Choose one)

**Windows:**

```bash
cd backend
setup.bat
```

**macOS/Linux:**

```bash
cd backend
chmod +x setup.sh
./setup.sh
```

**Manual Setup:**

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate           # Windows
source .venv/bin/activate        # macOS/Linux
pip install -r requirements.txt
python init_db.py
```

### Step 3: Frontend Setup

```bash
cd frontend
npm install
```

### Step 4: Run Both

Terminal 1 - Backend:

```bash
cd backend
.venv\Scripts\activate
uvicorn main:app --reload
```

Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

Visit: http://localhost:5173

---

## 🔑 Important Credentials & Configuration

### Default Admin Account

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Change in production!**

### Database Configuration

**File:** `backend/database.py`

Update this line with your PostgreSQL credentials:

```python
DATABASE_URL = "postgresql://username:password@localhost:5432/winway"
```

### Environment Variables

Create `backend/.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/winway
JWT_SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
```

---

## 🛠️ Technology Stack

### Backend

| Package     | Version | Purpose          |
| ----------- | ------- | ---------------- |
| FastAPI     | 0.104.1 | Web framework    |
| Uvicorn     | 0.24.0  | ASGI server      |
| SQLAlchemy  | 2.0.23  | ORM              |
| PostgreSQL  | 12+     | Database         |
| Pydantic    | 2.5.2   | Data validation  |
| python-jose | 3.3.0   | JWT tokens       |
| Passlib     | 1.7.4   | Password hashing |

### Frontend

| Package       | Version | Purpose        |
| ------------- | ------- | -------------- |
| React         | 19.2.5  | UI library     |
| Vite          | 8.0.10  | Build tool     |
| Tailwind CSS  | 3.4.0   | Styling        |
| Axios         | 1.15.2  | HTTP client    |
| Framer Motion | 12.38.0 | Animations     |
| React Router  | 7.14.2  | Client routing |
| TypeScript    | 6.0.2   | Type safety    |

---

## 📱 API Endpoints

### Public Routes

```
GET  /products/              - Get all products
POST /enquiries/             - Submit inquiry
GET  /services/              - Get all services
```

### Admin Routes (Protected)

```
POST /admin/login            - Admin login (returns JWT)
POST /admin/products         - Create product
DELETE /admin/products/{id}  - Delete product
```

**Protected Route Headers:**

```
Authorization: Bearer {jwt_token}
```

### API Documentation

Visit: `http://localhost:8000/docs` (Swagger UI)

---

## 🔐 Authentication Flow

1. **Admin Login**
   - Submit username/password to `/admin/login`
   - Receive JWT token
   - Store token in `localStorage.adminToken`

2. **Protected Requests**
   - Include header: `Authorization: Bearer {token}`
   - Frontend automatically adds this in `api.ts`

3. **Token Expiration**
   - Tokens expire after 24 hours (configurable)
   - User must log in again

---

## 📦 Database Schema

### Users Table

```sql
id | username | hashed_password | is_admin | created_at
```

### Products Table

```sql
id | name | description | price | image_url | created_at
```

### Services Table

```sql
id | name | description
```

### Enquiries Table

```sql
id | name | email | message | created_at
```

---

## 🐛 Common Issues & Solutions

### Issue: "Port 8000 already in use"

**Solution:**

```bash
uvicorn main:app --port 8001 --reload
```

### Issue: "Cannot connect to database"

**Solution:**

1. Verify PostgreSQL is running
2. Check DATABASE_URL in `database.py`
3. Ensure database `winway` exists:
   ```sql
   CREATE DATABASE winway;
   ```

### Issue: "Module not found" (Frontend)

**Solution:**

```bash
cd frontend
rm -rf node_modules
npm install
```

### Issue: "401 Unauthorized"

**Solution:**

- Verify JWT token is in `localStorage.adminToken`
- Token may have expired (log in again)
- Check `Authorization` header format in requests

### Issue: "Image upload not working"

**Solution:**

1. Ensure `uploads/` directory exists: `backend/uploads/`
2. Check file permissions
3. Verify form includes `Content-Type: multipart/form-data`

---

## 📈 Development Workflow

### Adding a New Feature

1. **Backend (API)**
   - Add model in `models.py`
   - Add schema in `schemas.py`
   - Add CRUD in `crud.py`
   - Add routes in `routers/`

2. **Frontend (UI)**
   - Create component in `components/`
   - Add page in `pages/` if needed
   - Use Axios in `services/api.ts` for API calls
   - Add route in `App.tsx` if needed

3. **Testing**
   - Test API in Swagger UI: `http://localhost:8000/docs`
   - Test UI in browser: `http://localhost:5173`
   - Check console for errors

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Update `JWT_SECRET_KEY` in backend
- [ ] Change default admin credentials
- [ ] Set production `DATABASE_URL`
- [ ] Enable HTTPS/SSL
- [ ] Update CORS origins
- [ ] Set `ENVIRONMENT=production`
- [ ] Configure backups
- [ ] Set up monitoring
- [ ] Test thoroughly

See `DEPLOYMENT.md` for full guide.

---

## 💡 Code Quality Standards

### Backend

- Use type hints
- Follow PEP 8
- Add docstrings to functions
- Use meaningful variable names

### Frontend

- Use TypeScript for type safety
- Functional components with hooks
- Meaningful component names
- Proper prop typing

---

## 🔗 Useful Links

- **API Docs:** http://localhost:8000/docs
- **Frontend:** http://localhost:5173
- **PostgreSQL:** https://www.postgresql.org/
- **FastAPI:** https://fastapi.tiangolo.com/
- **React:** https://react.dev/
- **Tailwind CSS:** https://tailwindcss.com/

---

## 📞 Support & Maintenance

### Regular Tasks

- Weekly: Check error logs
- Monthly: Update dependencies
- Quarterly: Security audit
- Yearly: Performance review

### Updating Dependencies

Backend:

```bash
pip list --outdated
pip install --upgrade package-name
```

Frontend:

```bash
npm outdated
npm update
```

---

## 🎓 Learning Resources

- FastAPI: https://fastapi.tiangolo.com/
- React: https://react.dev/
- PostgreSQL: https://www.postgresql.org/docs/
- Tailwind: https://tailwindcss.com/docs
- Axios: https://axios-http.com/

---

## ✅ Final Checklist

- [ ] Read README.md
- [ ] Run setup script
- [ ] Backend runs without errors
- [ ] Frontend runs without errors
- [ ] Can log in with admin/admin123
- [ ] Can view products page
- [ ] Can add a product (admin)
- [ ] Understand database structure
- [ ] Know how to deploy (see DEPLOYMENT.md)

---

## 🎉 You're Ready!

You now have everything needed to:

- ✅ Run the project locally
- ✅ Understand the codebase
- ✅ Make changes and improvements
- ✅ Deploy to production
- ✅ Maintain the application

**Next Steps:**

1. Run QUICK_START.md
2. Explore the codebase
3. Make your first change
4. Deploy when ready

Good luck! 🚀

---

**Questions?** Check the README.md or DEPLOYMENT.md

**Last Updated:** May 2, 2026
