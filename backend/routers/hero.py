from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import crud, schemas
from database import get_db

router = APIRouter(prefix="/hero-section", tags=["hero-section"])

@router.get("", response_model=schemas.HeroSection)
def read_active_hero_section(db: Session = Depends(get_db)):
    db_hero = crud.get_active_hero_section(db)
    if not db_hero:
        # Fallback to returning the latest slide if none is explicitly marked active
        all_slides = crud.get_all_hero_sections(db)
        if all_slides:
            return all_slides[0]
        raise HTTPException(status_code=404, detail="No active hero section found")
    return db_hero


@router.get("/all", response_model=list[schemas.HeroSection])
def read_all_hero_sections(db: Session = Depends(get_db)):
    return crud.get_all_hero_sections(db)
