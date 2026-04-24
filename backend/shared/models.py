from pydantic import BaseModel, EmailStr, condecimal
from datetime import date
from typing import List, Optional
from enum import Enum


class RolUsuario(str, Enum):
    USUARIO_PAC = "Usuario PAC"
    ADMIN_PAC = "Admin PAC"


class EstadoPAC(str, Enum):
    BORRADOR = "borrador"
    PUBLICADO = "publicado"
    CERRADO = "cerrado"


class EstadoOrden(str, Enum):
    PENDIENTE = "pendiente"
    APROBADA = "aprobada"
    RECHAZADA = "rechazada"


class Usuario(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    rol: str
    hashed_password: Optional[str] = None


class Organismo(BaseModel):
    id: int
    nombre: str
    rut: str


class PAC(BaseModel):
    id: int
    organismo_id: int
    usuario_id: int
    nombre: str
    fecha_creacion: date
    estado: str


class Requerimiento(BaseModel):
    id: int
    pac_id: int
    descripcion: str
    monto_estimado: condecimal(max_digits=15, decimal_places=2)
    moneda: str


class Item(BaseModel):
    id: int
    requerimiento_id: int
    codigo: str
    descripcion: str
    cantidad: int
    precio_unitario: condecimal(max_digits=15, decimal_places=2)


class VersionPAC(BaseModel):
    id: int
    pac_id: int
    version: int
    fecha: date
    cambios: str


class OrdenCompra(BaseModel):
    id: int
    numero_oc: str
    pac_id: int
    monto_transado: condecimal(max_digits=15, decimal_places=2)
    estado: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class PACCreate(BaseModel):
    organismo_id: int
    usuario_id: int
    nombre: str


class RequerimientoCreate(BaseModel):
    pac_id: int
    descripcion: str
    monto_estimado: condecimal(max_digits=15, decimal_places=2)
    moneda: str


class ItemCreate(BaseModel):
    requerimiento_id: int
    codigo: str
    descripcion: str
    cantidad: int
    precio_unitario: condecimal(max_digits=15, decimal_places=2)


class PACPublicarRequest(BaseModel):
    pac_id: int
    firma: str


class PACPublicarResponse(BaseModel):
    pac_id: int
    estado: str
