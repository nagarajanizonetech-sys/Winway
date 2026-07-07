# Deployment Guide

Guide for deploying Winway Computers to production.

## Pre-Deployment Checklist

- [ ] Update JWT_SECRET_KEY in backend
- [ ] Change default admin credentials
- [ ] Configure production database
- [ ] Set environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Update API URL in frontend

---

## Backend Deployment

### 1. Update Configuration

Update `backend/database.py`:

```python
DATABASE_URL = "postgresql://prod_user:strong_password@db.example.com:5432/winway_prod"
```

Update `backend/main.py` CORS settings:

```python
origins = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

### 2. Generate Strong JWT Secret

```python
import secrets
secret_key = secrets.token_urlsafe(32)
print(secret_key)
```

Set in environment:

```bash
export JWT_SECRET_KEY="your-generated-secret"
```

### 3. Deploy with Gunicorn

Install Gunicorn:

```bash
pip install gunicorn
```

Run in production:

```bash
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

Or with systemd service:

```ini
[Unit]
Description=Winway Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/winway/backend
Environment="DATABASE_URL=postgresql://..."
Environment="JWT_SECRET_KEY=..."
ExecStart=/var/www/winway/backend/venv/bin/gunicorn -w 4 -b 127.0.0.1:8000 main:app
Restart=always

[Install]
WantedBy=multi-user.target
```

---

## Frontend Deployment

### 1. Build for Production

```bash
cd frontend
npm run build
```

Output: `frontend/dist/`

### 2. Update API URL

In `frontend/src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: "https://api.yourdomain.com",
});
```

### 3. Deploy Static Files

#### Option A: Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/winway/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### Option B: Vercel (Recommended for Frontend)

1. Push to GitHub
2. Connect to Vercel
3. Set environment: `VITE_API_URL=https://api.yourdomain.com`
4. Deploy

#### Option C: AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Database Setup

### Create Production Database

```bash
# Connect to PostgreSQL server
psql -U postgres

# Create database and user
CREATE DATABASE winway_prod;
CREATE USER winway_user WITH PASSWORD 'strong_password_here';
GRANT ALL PRIVILEGES ON DATABASE winway_prod TO winway_user;
```

### Initialize Schema

```bash
# From backend directory
python init_db.py
```

### Enable Backups

```bash
# Daily backup script
#!/bin/bash
BACKUP_DIR="/backups/winway"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U winway_user winway_prod > $BACKUP_DIR/winway_$TIMESTAMP.sql
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }

    # ... rest of nginx config
}
```

---

## Monitoring & Maintenance

### Application Logs

Backend:

```bash
# Systemd logs
journalctl -u winway-backend -f

# Docker logs
docker logs -f winway-backend
```

### Database Monitoring

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('winway_prod'));

-- Check active connections
SELECT * FROM pg_stat_activity WHERE datname = 'winway_prod';
```

### Uptime Monitoring

Services to use:

- Uptime Robot (free tier available)
- New Relic (APM)
- DataDog
- Sentry (error tracking)

---

## Performance Optimization

### Backend

- Enable gzip compression
- Use connection pooling
- Add database indexes
- Cache responses where applicable

### Frontend

- Enable CDN for static assets
- Optimize images
- Lazy load components
- Minify CSS/JS

---

## Security Best Practices

✅ Enable HTTPS
✅ Use strong passwords
✅ Keep dependencies updated
✅ Set security headers
✅ Enable CORS properly
✅ Use environment variables
✅ Regular backups
✅ Monitor logs for suspicious activity

### Add Security Headers

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

---

## Docker Deployment (Optional)

### Docker Compose

```yaml
version: "3.8"

services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: winway_prod
      POSTGRES_USER: winway_user
      POSTGRES_PASSWORD: strong_password
    volumes:
      - db_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://winway_user:strong_password@db:5432/winway_prod
      JWT_SECRET_KEY: your-secret-key
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  db_data:
```

Deploy:

```bash
docker-compose up -d
```

---

## Rollback Procedure

1. Keep previous version built
2. Update nginx/systemd to point to previous version
3. Restore database backup if needed
4. Test thoroughly before attempting again

---

## Support & Troubleshooting

### Common Issues

**502 Bad Gateway**

- Check if backend is running
- Check Gunicorn logs
- Verify nginx proxy settings

**Database Connection Error**

- Verify DATABASE_URL
- Check PostgreSQL is running
- Verify firewall rules

**CORS Errors**

- Add domain to CORS origins
- Check frontend API URL
- Verify headers in responses

---

## Post-Deployment

1. Run smoke tests
2. Monitor error logs
3. Check application performance
4. Verify backups are working
5. Document any custom configurations
6. Set up monitoring alerts

---

For questions or issues, contact: devops@winway.com
