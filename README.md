# Winway Computers - Full Stack Application

A modern e-commerce platform for laptop sales, repairs, and IT services built with FastAPI and React.

## Tech Stack

### Backend

- **Framework**: FastAPI 0.104.1
- **Server**: Uvicorn 0.24.0
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy 2.0.23
- **Authentication**: JWT (python-jose)
- **Password Hashing**: Passlib with bcrypt

### Frontend

- **Framework**: React 19.2.5
- **Build Tool**: Vite 8.0.10
- **Styling**: Tailwind CSS 3.4.0
- **UI Components**: Lucide React
- **Animation**: Framer Motion
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## Project Structure

```
winway/
├── backend/
│   ├── main.py                 # FastAPI app entry point
│   ├── database.py             # Database connection config
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic schemas
│   ├── crud.py                 # Database operations
│   ├── init_db.py              # Database initialization & seeding
│   ├── requirements.txt         # Python dependencies
│   ├── routers/                # API route handlers
│   │   ├── admin.py            # Admin endpoints
│   │   ├── products.py         # Product endpoints
│   │   ├── services.py         # Service endpoints
│   │   └── enquiries.py        # Enquiry endpoints
│   ├── utils/                  # Utilities
│   │   └── auth.py             # Authentication utilities
│   └── uploads/                # Product images
│
├── frontend/
│   ├── src/
│   │   ├── main.tsx            # Entry point
│   │   ├── App.tsx             # App component
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx        # Homepage
│   │   │   ├── AdminLogin.tsx  # Admin login
│   │   │   └── AdminDashboard.tsx  # Admin panel
│   │   ├── components/         # Reusable components
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ServiceCard.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── EnquiryModal.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── services/           # API services
│   │   │   └── api.ts          # Axios configuration
│   │   └── styles/             # Global styles
│   ├── package.json
│   └── tailwind.config.js
│
└── .venv/                      # Python virtual environment

```

## Prerequisites

- **Python 3.8+**
- **Node.js 16+** (with npm)
- **PostgreSQL 12+**

## Setup Instructions

### 1. Backend Setup

#### Create and Activate Virtual Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (Windows)
python -m venv .venv
.venv\Scripts\activate

# Create virtual environment (macOS/Linux)
python3 -m venv .venv
source .venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Database

1. **Create PostgreSQL Database**

   ```sql
   CREATE DATABASE winway;
   ```

2. **Set Database URL** in `backend/database.py`:

   ```python
   DATABASE_URL = "postgresql://username:password@localhost:5432/winway"
   ```

3. **Initialize Database & Seed Admin User**

   ```bash
   python init_db.py
   ```

   **Default Admin Credentials:**
   - Username: `admin`
   - Password: `admin123`

#### Run Backend Server

```bash
# With auto-reload for development
uvicorn main:app --reload

# Production
uvicorn main:app --host 0.0.0.0 --port 8000
```

Backend runs on: `http://localhost:8000`
API Docs: `http://localhost:8000/docs` (Swagger UI)

### 2. Frontend Setup

#### Install Dependencies

```bash
# Navigate to frontend directory
cd frontend

# Install npm packages
npm install
```

#### Run Development Server

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

#### Build for Production

```bash
npm run build
```

Output: `frontend/dist/`

## API Endpoints

### Public Endpoints

- `GET /products/` - Get all products
- `POST /enquiries/` - Submit an enquiry

### Admin Endpoints (Protected)

- `POST /admin/login` - Admin login
- `POST /admin/products` - Create product
- `DELETE /admin/products/{id}` - Delete product

### Service Endpoints

- `GET /services/` - Get all services

## Authentication

- **JWT Token** stored in browser `localStorage.adminToken`
- **Token** sent via `Authorization: Bearer {token}` header
- **Protected routes** require valid token in header

## Default Admin Credentials

After running `init_db.py`:

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change credentials in production!**

## Environment Variables

### Backend (.env or hardcoded in database.py)

```
DATABASE_URL=postgresql://username:password@localhost:5432/winway
JWT_SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
```

### Frontend (api.ts)

```
VITE_API_URL=http://localhost:8000
```

## Key Features

✨ **Public Features:**

- **Luxury User Interface**: Beautiful, responsive layout with tailored HSL colors, modern typography, and smooth micro-animations.
- **Smooth Anchor Navigation**: Full page navigation (Home, Services, Products, Contact) featuring smooth-scrolling animations.
- **Header Scroll Spy**: A dynamic header helper that automatically highlights the active menu link corresponding to the section in view.
- **Browse Laptops & Services**: Dynamic inventory display featuring quick details and image gallery sliders.
- **Seamless Enquiries**: Quick and easy enquiry form to submit device and service queries directly.

🔐 **Admin Features:**

- **Secure Login**: Secure JWT-based admin authentication featuring password visibility toggling (eye button).
- **Hero Banner Configurator**: Create, edit, and delete luxury storefront hero banners. Supports a quick-link selector to populate slide properties automatically from an uploaded product.
- **Inventory Manager**: Add, edit, delete laptop products and upload multiple product showcase photos.
- **Enquiry Manager**: Review and track storefront user enquiries in a unified, password-protected dashboard.

## Database Models

### User

- id, username, hashed_password, is_admin

### Product

- id, name, description, price, image_url, created_at

### Service

- id, name, description

### Enquiry

- id, name, email, message, created_at

## File Upload

Product images are stored in `backend/uploads/` directory with UUID-based filenames.

## Troubleshooting

### Backend Issues

**Port 8000 already in use:**

```bash
uvicorn main:app --port 8001 --reload
```

**Database connection error:**

- Verify PostgreSQL is running
- Check DATABASE_URL in `database.py`
- Ensure database exists: `CREATE DATABASE winway;`

**Missing argon2 error:**

```bash
pip install argon2-cffi
```

### Frontend Issues

**Port 5173 already in use:**

```bash
npm run dev -- --port 5174
```

**Module not found:**

```bash
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

1. Start PostgreSQL server
2. Activate virtual environment: `.venv\Scripts\activate`
3. Start backend: `uvicorn main:app --reload`
4. In new terminal, start frontend: `npm run dev`
5. Open `http://localhost:5173`

## Production Deployment

### Backend

```bash
# Build and run with gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

### Frontend

```bash
npm run build
# Serve dist/ folder with nginx or CDN
```

## Security Notes

- ⚠️ Change JWT_SECRET_KEY in production
- ⚠️ Use environment variables for sensitive data
- ⚠️ Enable HTTPS in production
- ⚠️ Set secure CORS policies
- ⚠️ Update default admin credentials

## License

MIT

## Support

For issues or questions, contact: support@winway.com

---

**Last Updated**: July 3, 2026
