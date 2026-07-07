from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ProductBase(BaseModel):
    name: str
    processor: str
    ram: str
    storage: str
    display: str
    graphics: str
    price: Optional[float] = None
    image_url: Optional[str] = None


class ProductCreate(ProductBase):
    pass


class Product(ProductBase):
    id: int

    class Config:
        from_attributes = True


class ServiceBase(BaseModel):
    title: str
    description: str
    icon: str


class ServiceCreate(ServiceBase):
    pass


class Service(ServiceBase):
    id: int

    class Config:
        from_attributes = True


class EnquiryBase(BaseModel):
    name: str
    email: EmailStr
    phone: str
    product_name: str
    message: str


class EnquiryCreate(EnquiryBase):
    pass


class Enquiry(EnquiryBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


class HeroSectionBase(BaseModel):
    title: str
    subtitle: str
    button_text: str
    button_link: str
    tag: Optional[str] = "Special Offer"
    processor: Optional[str] = None
    ram: Optional[str] = None
    storage: Optional[str] = None
    display: Optional[str] = None
    graphics: Optional[str] = None
    is_active: Optional[bool] = True


class HeroSectionCreate(HeroSectionBase):
    pass


class HeroSectionUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    button_text: Optional[str] = None
    button_link: Optional[str] = None
    tag: Optional[str] = None
    processor: Optional[str] = None
    ram: Optional[str] = None
    storage: Optional[str] = None
    display: Optional[str] = None
    graphics: Optional[str] = None
    is_active: Optional[bool] = None


class HeroSection(HeroSectionBase):
    id: int
    image_url: str
    image_position: str
    created_at: datetime

    class Config:
        from_attributes = True