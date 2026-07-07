from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean
from database import Base
from datetime import datetime

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    processor = Column(String, nullable=False)
    ram = Column(String, nullable=False)
    storage = Column(String, nullable=False)
    display = Column(String, nullable=False)
    graphics = Column(String, nullable=False)
    price = Column(Float, nullable=True)
    image_url = Column(String, nullable=True)


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    icon = Column(String)


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    phone = Column(String, nullable=True)
    product_name = Column(String, nullable=True)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)


class HeroSection(Base):
    __tablename__ = "hero_sections"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(Text, nullable=False)
    subtitle = Column(Text, nullable=False)
    button_text = Column(String, nullable=False)
    button_link = Column(String, nullable=False)
    image_url = Column(String, nullable=False)
    image_position = Column(String, nullable=False)  # "right", "center", "left"
    is_active = Column(Boolean, default=True)
    tag = Column(String, nullable=True)
    processor = Column(String, nullable=True)
    ram = Column(String, nullable=True)
    storage = Column(String, nullable=True)
    display = Column(String, nullable=True)
    graphics = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)