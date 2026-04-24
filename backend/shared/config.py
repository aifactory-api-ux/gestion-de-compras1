import os
from typing import Optional

JWT_SECRET = os.getenv("JWT_SECRET", "myjwtsecret")
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))

BACKEND_AUTH_URL = os.getenv("BACKEND_AUTH_URL", "http://localhost:8001")
BACKEND_PAC_URL = os.getenv("BACKEND_PAC_URL", "http://localhost:8002")

SERVICE_VERSION = "1.0.0"

POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "gestion_compras")
POSTGRES_USER = os.getenv("POSTGRES_USER", "compras_user")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "supersecret")

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
