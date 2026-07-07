import models
from database import SessionLocal, engine
from utils.auth import get_password_hash

def init_db():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if admin already exists
    admin = db.query(models.AdminUser).filter(models.AdminUser.username == "admin").first()
    if not admin:
        admin_user = models.AdminUser(
            username="admin",
            hashed_password=get_password_hash("admin123")
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created: admin / admin123")
    else:
        print("Admin user already exists.")
    db.close()

if __name__ == "__main__":
    init_db()
