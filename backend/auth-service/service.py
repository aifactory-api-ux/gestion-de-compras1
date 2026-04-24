from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
import hashlib
import uuid

from backend.shared.config import JWT_SECRET, JWT_EXPIRE_MINUTES
from backend.shared.models import TokenResponse, LoginRequest, Usuario
from backend.shared.db import get_db_session, get_redis_client
from backend.shared import models

security = HTTPBearer()


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "jti": str(uuid.uuid4())})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm="HS256")
    return encoded_jwt


def decode_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Usuario:
    token = credentials.credentials
    payload = decode_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )
    redis_client = get_redis_client()
    user_data = redis_client.get(f"session:{user_id}")
    if user_data is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session not found or expired",
        )
    user_dict = eval(user_data)
    return Usuario(**user_dict)


class AuthService:
    def __init__(self):
        self.redis = get_redis_client()

    def authenticate_user(self, email: str, password: str) -> Optional[Usuario]:
        for db in get_db_session():
            usuario = db.query(models.Usuario).filter(models.Usuario.email == email).first()
            if usuario:
                if verify_password(password, usuario.hashed_password or ""):
                    return usuario
        return None

    def create_session(self, user: Usuario, token: str) -> None:
        session_key = f"session:{user.id}"
        self.redis.setex(session_key, JWT_EXPIRE_MINUTES * 60, str(user.model_dump()))

    def invalidate_session(self, user_id: int) -> None:
        session_key = f"session:{user_id}"
        self.redis.delete(session_key)


def get_auth_service() -> AuthService:
    return AuthService()
