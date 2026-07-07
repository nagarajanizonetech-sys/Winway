from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt

SECRET_KEY = "your-secret-key-change-this-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# 🔥 Recommended: switch to argon2 (no 72-char limit)
pwd_context = CryptContext(
    schemes=["argon2", "bcrypt"],  # ✅ support both
    deprecated="auto"
)

# ✅ Safe verify function
def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        # truncate only for safety (argon2 doesn't need it, but keeps compatibility)
        plain_password = plain_password[:72]
        return pwd_context.verify(plain_password, hashed_password)
    except Exception:
        return False


# ✅ Safe hash function
def get_password_hash(password: str) -> str:
    password = password[:72]
    return pwd_context.hash(password)


# ✅ JWT Token
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt