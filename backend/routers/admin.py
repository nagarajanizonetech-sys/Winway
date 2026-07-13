from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import timedelta
import os
import uuid
from PIL import Image
import io

import models, schemas, crud
from database import get_db
from utils import auth
from utils.cloudinary import upload_to_cloudinary, delete_from_cloudinary

router = APIRouter(prefix="/admin", tags=["admin"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/login")

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = auth.jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise credentials_exception
    except auth.JWTError:
        raise credentials_exception

    admin = db.query(models.AdminUser).filter(models.AdminUser.username == username).first()
    if not admin:
        raise credentials_exception

    return admin


@router.post("/login", response_model=schemas.Token)
def login_for_access_token(
    username: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    admin = db.query(models.AdminUser).filter(
        models.AdminUser.username == username
    ).first()

    if not admin or not auth.verify_password(password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": admin.username},
        expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/products", response_model=schemas.Product)
async def create_product_with_image(
    name: str = Form(...),
    processor: str = Form(...),
    ram: str = Form(...),
    storage: str = Form(...),
    display: str = Form(...),
    graphics: str = Form(...),
    price: float = Form(None),
    images: list[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    image_url = None

    if images:
        uploaded_urls = []
        for img in images:
            if img.filename:
                secure_url = upload_to_cloudinary(img, folder="winway/products")
                if secure_url:
                    uploaded_urls.append(secure_url)
        
        if uploaded_urls:
            image_url = ",".join(uploaded_urls)

    product_data = schemas.ProductCreate(
        name=name,
        processor=processor,
        ram=ram,
        storage=storage,
        display=display,
        graphics=graphics,
        price=price,
        image_url=image_url
    )

    return crud.create_product(db, product_data)


@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}


@router.put("/products/{product_id}", response_model=schemas.Product)
async def update_product_with_image(
    product_id: int,
    name: str = Form(...),
    processor: str = Form(...),
    ram: str = Form(...),
    storage: str = Form(...),
    display: str = Form(...),
    graphics: str = Form(...),
    price: float = Form(None),
    images: list[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = {
        "name": name,
        "processor": processor,
        "ram": ram,
        "storage": storage,
        "display": display,
        "graphics": graphics,
        "price": price,
    }

    if images:
        uploaded_urls = []
        for img in images:
            if img.filename:
                secure_url = upload_to_cloudinary(img, folder="winway/products")
                if secure_url:
                    uploaded_urls.append(secure_url)
        
        if uploaded_urls:
            if product.image_url:
                for old_url in product.image_url.split(","):
                    delete_from_cloudinary(old_url.strip())
            update_data["image_url"] = ",".join(uploaded_urls)

    db_product = crud.update_product(db, product_id, update_data)
    return db_product


@router.post("/hero-section", response_model=schemas.HeroSection)
async def create_hero_section_endpoint(
    title: str = Form(...),
    subtitle: str = Form(...),
    button_text: str = Form(...),
    button_link: str = Form(...),
    tag: str = Form("Special Offer"),
    processor: str = Form(None),
    ram: str = Form(None),
    storage: str = Form(None),
    display: str = Form(None),
    graphics: str = Form(None),
    is_active: bool = Form(True),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    if not image or not image.filename:
        raise HTTPException(status_code=400, detail="Image file is required")

    # 1. Read image to perform Pillow analysis
    image_bytes = await image.read()
    try:
        img = Image.open(io.BytesIO(image_bytes))
        width, height = img.size
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file structure")

    # 2. Determine auto alignment based on dimensions
    if width > height:
        image_position = "right"
    elif height > width:
        image_position = "center"
    else:
        image_position = "left"

    # 3. Upload file directly to Cloudinary
    image_url = upload_to_cloudinary(image_bytes, folder="winway/herosection")
    if not image_url:
        raise HTTPException(status_code=500, detail="Failed to upload image to Cloudinary")

    hero_data = schemas.HeroSectionCreate(
        title=title,
        subtitle=subtitle,
        button_text=button_text,
        button_link=button_link,
        tag=tag,
        processor=processor,
        ram=ram,
        storage=storage,
        display=display,
        graphics=graphics,
        is_active=is_active
    )

    return crud.create_hero_section(db, hero_data, image_url, image_position)


@router.put("/hero-section/{hero_id}", response_model=schemas.HeroSection)
async def update_hero_section_endpoint(
    hero_id: int,
    title: str = Form(...),
    subtitle: str = Form(...),
    button_text: str = Form(...),
    button_link: str = Form(...),
    tag: str = Form(None),
    processor: str = Form(None),
    ram: str = Form(None),
    storage: str = Form(None),
    display: str = Form(None),
    graphics: str = Form(None),
    is_active: bool = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    hero = db.query(models.HeroSection).filter(models.HeroSection.id == hero_id).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero section not found")

    update_data = {
        "title": title,
        "subtitle": subtitle,
        "button_text": button_text,
        "button_link": button_link,
        "is_active": is_active,
    }

    if tag is not None:
        update_data["tag"] = tag
    if processor is not None:
        update_data["processor"] = processor
    if ram is not None:
        update_data["ram"] = ram
    if storage is not None:
        update_data["storage"] = storage
    if display is not None:
        update_data["display"] = display
    if graphics is not None:
        update_data["graphics"] = graphics

    if image and image.filename:
        # 1. Read and analyze
        image_bytes = await image.read()
        try:
            img = Image.open(io.BytesIO(image_bytes))
            width, height = img.size
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid image file structure")

        # 2. Alignment Position
        if width > height:
            update_data["image_position"] = "right"
        elif height > width:
            update_data["image_position"] = "center"
        else:
            update_data["image_position"] = "left"

        # 3. Upload new file directly to Cloudinary
        new_image_url = upload_to_cloudinary(image_bytes, folder="winway/herosection")
        if not new_image_url:
            raise HTTPException(status_code=500, detail="Failed to upload image to Cloudinary")

        # 4. Clean up old image from Cloudinary and disk
        if hero.image_url:
            delete_from_cloudinary(hero.image_url)
            try:
                old_filename = hero.image_url.split("/")[-1]
                UPLOAD_HERO_DIR = os.path.join("uploads", "herosection")
                old_file_path = os.path.join(UPLOAD_HERO_DIR, old_filename)
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)
            except Exception as ex:
                print(f"Failed to delete old image file: {ex}")

        update_data["image_url"] = new_image_url

    db_hero = crud.update_hero_section(db, hero_id, update_data)
    return db_hero


@router.delete("/hero-section/{hero_id}")
def delete_hero_section_endpoint(
    hero_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin)
):
    hero = db.query(models.HeroSection).filter(models.HeroSection.id == hero_id).first()
    if not hero:
        raise HTTPException(status_code=404, detail="Hero section not found")

    # Clean up image from Cloudinary and disk
    if hero.image_url:
        delete_from_cloudinary(hero.image_url)
        try:
            old_filename = hero.image_url.split("/")[-1]
            UPLOAD_HERO_DIR = os.path.join("uploads", "herosection")
            file_path = os.path.join(UPLOAD_HERO_DIR, old_filename)
            if os.path.exists(file_path):
                os.remove(file_path)
        except Exception as ex:
            print(f"Failed to delete image on Hero delete: {ex}")

    db.delete(hero)
    db.commit()

    return {"message": "Hero section deleted successfully"}