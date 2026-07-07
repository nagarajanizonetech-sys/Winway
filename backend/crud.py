from sqlalchemy.orm import Session
import models, schemas

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Product).offset(skip).limit(limit).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product_data: dict):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not db_product:
        return None
    for key, value in product_data.items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_services(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Service).offset(skip).limit(limit).all()

def create_service(db: Session, service: schemas.ServiceCreate):
    db_service = models.Service(**service.model_dump())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

def create_enquiry(db: Session, enquiry: schemas.EnquiryCreate):
    db_enquiry = models.Enquiry(**enquiry.model_dump())
    db.add(db_enquiry)
    db.commit()
    db.refresh(db_enquiry)
    return db_enquiry


def get_active_hero_section(db: Session):
    return db.query(models.HeroSection).filter(models.HeroSection.is_active == True).first()


def get_all_hero_sections(db: Session):
    return db.query(models.HeroSection).order_by(models.HeroSection.created_at.desc()).all()


def create_hero_section(db: Session, hero: schemas.HeroSectionCreate, image_url: str, image_position: str):
    if hero.is_active:
        # Resolve single active constraint: set other active slides to False
        db.query(models.HeroSection).filter(models.HeroSection.is_active == True).update({"is_active": False})
    
    db_hero = models.HeroSection(
        **hero.model_dump(),
        image_url=image_url,
        image_position=image_position
    )
    db.add(db_hero)
    db.commit()
    db.refresh(db_hero)
    return db_hero


def update_hero_section(db: Session, hero_id: int, update_data: dict):
    db_hero = db.query(models.HeroSection).filter(models.HeroSection.id == hero_id).first()
    if not db_hero:
        return None
    
    if update_data.get("is_active"):
        # Resolve single active constraint: set other active slides to False
        db.query(models.HeroSection).filter(
            models.HeroSection.is_active == True
        ).filter(models.HeroSection.id != hero_id).update({"is_active": False})
    
    for key, value in update_data.items():
        setattr(db_hero, key, value)
    
    db.commit()
    db.refresh(db_hero)
    return db_hero

