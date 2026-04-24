# SPEC.md

## 1. TECHNOLOGY STACK

- **Backend**
  - Python 3.11
  - FastAPI 0.95.2
  - Pydantic 1.10.7
  - SQLAlchemy 2.0.19
  - psycopg2-binary 2.9.6
  - Redis 4.5.5
  - uvicorn 0.22.0

- **Database**
  - PostgreSQL 15

- **Frontend**
  - React 18.2.0
  - TypeScript 5.1.3
  - Axios 1.4.0
  - React Router DOM 6.14.1
  - Zustand 4.3.9
  - MUI (Material UI) 5.13.7

- **Infrastructure**
  - Docker 24.0.2
  - Docker Compose 2.18.1

---

## 2. DATA CONTRACTS

### Python (Pydantic Models)

```python
from pydantic import BaseModel, EmailStr, condecimal
from datetime import date
from typing import List, Optional

class Usuario(BaseModel):
    id: int
    nombre: str
    email: EmailStr
    rol: str

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

class PACCreate(BaseModel):
    organismo_id: int
    usuario_id: int
    nombre: str

class RequerimientoCreate(BaseModel):
    pac_id: int
    descripcion: str
    monto_estimado: condecimal(max_digits=15, decimal_places=2)
    moneda: str

class PACPublicarRequest(BaseModel):
    pac_id: int
    firma: str  # base64 encoded signature

class PACPublicarResponse(BaseModel):
    pac_id: int
    estado: str
```

### TypeScript (Frontend Interfaces)

```typescript
export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
}

export interface Organismo {
  id: number;
  nombre: string;
  rut: string;
}

export interface PAC {
  id: number;
  organismo_id: number;
  usuario_id: number;
  nombre: string;
  fecha_creacion: string; // ISO date string
  estado: string;
}

export interface Requerimiento {
  id: number;
  pac_id: number;
  descripcion: string;
  monto_estimado: string; // decimal as string
  moneda: string;
}

export interface Item {
  id: number;
  requerimiento_id: number;
  codigo: string;
  descripcion: string;
  cantidad: number;
  precio_unitario: string; // decimal as string
}

export interface VersionPAC {
  id: number;
  pac_id: number;
  version: number;
  fecha: string; // ISO date string
  cambios: string;
}

export interface OrdenCompra {
  id: number;
  numero_oc: string;
  pac_id: number;
  monto_transado: string; // decimal as string
  estado: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface PACCreate {
  organismo_id: number;
  usuario_id: number;
  nombre: string;
}

export interface RequerimientoCreate {
  pac_id: number;
  descripcion: string;
  monto_estimado: string;
  moneda: string;
}

export interface PACPublicarRequest {
  pac_id: number;
  firma: string;
}

export interface PACPublicarResponse {
  pac_id: number;
  estado: string;
}
```

---

## 3. API ENDPOINTS

### Auth

- **POST /auth/login**
  - Request: `{ email: string, password: string }`
  - Response: `TokenResponse`

### PAC

- **POST /pac**
  - Request: `PACCreate`
  - Response: `{ id: number }`

- **GET /pac/{id}**
  - Response: `PAC`

- **GET /pac**
  - Response: `PAC[]`

- **PUT /pac/publicar**
  - Request: `PACPublicarRequest`
  - Response: `PACPublicarResponse`

### Requerimiento

- **POST /requerimiento**
  - Request: `RequerimientoCreate`
  - Response: `{ id: number }`

- **GET /requerimiento/{id}**
  - Response: `Requerimiento`

- **GET /requerimiento?pac_id={pac_id}**
  - Response: `Requerimiento[]`

### Item

- **POST /item**
  - Request: `{ requerimiento_id: number, codigo: string, descripcion: string, cantidad: number, precio_unitario: string }`
  - Response: `{ id: number }`

- **GET /item/{id}**
  - Response: `Item`

- **GET /item?requerimiento_id={requerimiento_id}**
  - Response: `Item[]`

### VersionPAC

- **GET /pac/{pac_id}/versiones**
  - Response: `VersionPAC[]`

### OrdenCompra

- **GET /pac/{pac_id}/ordenes**
  - Response: `OrdenCompra[]`

---

## 4. FILE STRUCTURE

### PORT TABLE

| Service             | Listening Port | Path                      |
|---------------------|---------------|---------------------------|
| auth-service        | 8001          | backend/auth-service/     |
| pac-service         | 8002          | backend/pac-service/      |

### SHARED MODULES

| Shared path         | Imported by services           |
|---------------------|-------------------------------|
| backend/shared/     | auth-service, pac-service     |

### FILE TREE

```
.
├── docker-compose.yml                # Multi-service orchestration
├── .env.example                     # Template for environment variables
├── .gitignore                       # Git ignore rules
├── README.md                        # Project documentation
├── run.sh                           # Root startup script
├── backend/
│   ├── shared/                      # Shared Pydantic models, utils
│   │   ├── models.py                # All Pydantic models
│   │   ├── db.py                    # DB connection helpers
│   │   └── __init__.py
│   ├── auth-service/
│   │   ├── main.py                  # FastAPI app entrypoint (EXPOSE 8001)
│   │   ├── routes.py                # Auth endpoints
│   │   ├── service.py               # Auth logic
│   │   ├── Dockerfile               # Auth service Dockerfile (EXPOSE 8001)
│   │   ├── requirements.txt         # Python dependencies
│   │   └── __init__.py
│   ├── pac-service/
│   │   ├── main.py                  # FastAPI app entrypoint (EXPOSE 8002)
│   │   ├── routes.py                # PAC, requerimiento, item, version, orden endpoints
│   │   ├── service.py               # PAC business logic
│   │   ├── Dockerfile               # PAC service Dockerfile (EXPOSE 8002)
│   │   ├── requirements.txt         # Python dependencies
│   │   └── __init__.py
├── frontend/
│   ├── public/
│   │   ├── index.html               # HTML entrypoint
│   ├── src/
│   │   ├── main.tsx                 # React entrypoint
│   │   ├── App.tsx                  # Main app component
│   │   ├── api/
│   │   │   ├── auth.ts              # Auth API client
│   │   │   ├── pac.ts               # PAC API client
│   │   │   ├── requerimiento.ts     # Requerimiento API client
│   │   │   ├── item.ts              # Item API client
│   │   │   ├── orden.ts             # OrdenCompra API client
│   │   │   └── version.ts           # VersionPAC API client
│   │   ├── hooks/
│   │   │   ├── useAuth.ts           # Auth state hook
│   │   │   ├── usePAC.ts            # PAC state hook
│   │   │   ├── useRequerimiento.ts  # Requerimiento state hook
│   │   │   ├── useItem.ts           # Item state hook
│   │   │   └── useOrden.ts          # OrdenCompra state hook
│   │   ├── components/
│   │   │   ├── LoginForm.tsx        # Login form
│   │   │   ├── PACList.tsx          # PAC list
│   │   │   ├── PACForm.tsx          # PAC creation form
│   │   │   ├── RequerimientoList.tsx# Requerimiento list
│   │   │   ├── RequerimientoForm.tsx# Requerimiento form
│   │   │   ├── ItemList.tsx         # Item list
│   │   │   ├── ItemForm.tsx         # Item form
│   │   │   ├── OrdenList.tsx        # OrdenCompra list
│   │   │   └── VersionList.tsx      # VersionPAC list
│   │   ├── types/
│   │   │   ├── models.ts            # All TypeScript interfaces
│   │   ├── utils/
│   │   │   ├── apiClient.ts         # Axios instance
│   │   └── routes/
│   │       ├── index.tsx            # App routes
│   ├── Dockerfile                   # Frontend Dockerfile
│   ├── .env.example                 # Frontend env vars template
│   └── README.md                    # Frontend documentation
```

---

## 5. ENVIRONMENT VARIABLES

### .env.example (root/backend/frontend)

| Name                        | Type    | Description                                         | Example Value                |
|-----------------------------|---------|-----------------------------------------------------|------------------------------|
| POSTGRES_HOST               | string  | PostgreSQL host                                     | db                           |
| POSTGRES_PORT               | int     | PostgreSQL port                                     | 5432                         |
| POSTGRES_DB                 | string  | PostgreSQL database name                            | gestion_compras              |
| POSTGRES_USER               | string  | PostgreSQL user                                     | compras_user                 |
| POSTGRES_PASSWORD           | string  | PostgreSQL password                                 | supersecret                  |
| REDIS_HOST                  | string  | Redis host                                          | redis                        |
| REDIS_PORT                  | int     | Redis port                                          | 6379                         |
| JWT_SECRET                  | string  | JWT signing secret                                  | myjwtsecret                  |
| JWT_EXPIRE_MINUTES          | int     | JWT expiration in minutes                           | 60                           |
| BACKEND_AUTH_URL            | string  | Auth service base URL (frontend)                    | http://localhost:8001        |
| BACKEND_PAC_URL             | string  | PAC service base URL (frontend)                     | http://localhost:8002        |
| REACT_APP_API_URL           | string  | Frontend API base URL                               | http://localhost:8002        |
| NODE_ENV                    | string  | Node environment (frontend)                         | development                  |

---

## 6. IMPORT CONTRACTS

### Backend

- `from backend.shared.models import Usuario, Organismo, PAC, Requerimiento, Item, VersionPAC, OrdenCompra, TokenResponse, PACCreate, RequerimientoCreate, PACPublicarRequest, PACPublicarResponse`
- `from backend.shared.db import get_db_session`
- `from backend.auth-service.routes import router as auth_router`
- `from backend.pac-service.routes import router as pac_router`
- `from backend.auth-service.service import authenticate_user, create_access_token`
- `from backend.pac-service.service import create_pac, get_pac, publicar_pac, create_requerimiento, get_requerimiento, create_item, get_item, get_versiones_pac, get_ordenes_pac`

### Frontend

- `import { Usuario, Organismo, PAC, Requerimiento, Item, VersionPAC, OrdenCompra, TokenResponse, PACCreate, RequerimientoCreate, PACPublicarRequest, PACPublicarResponse } from '../types/models'`
- `import { useAuth } from '../hooks/useAuth'`
- `import { usePAC } from '../hooks/usePAC'`
- `import { useRequerimiento } from '../hooks/useRequerimiento'`
- `import { useItem } from '../hooks/useItem'`
- `import { useOrden } from '../hooks/useOrden'`
- `import { login, logout } from '../api/auth'`
- `import { createPAC, getPAC, publicarPAC } from '../api/pac'`
- `import { createRequerimiento, getRequerimiento } from '../api/requerimiento'`
- `import { createItem, getItem } from '../api/item'`
- `import { getVersionesPAC } from '../api/version'`
- `import { getOrdenesPAC } from '../api/orden'`
- `import apiClient from '../utils/apiClient'`

---

## 7. FRONTEND STATE & COMPONENT CONTRACTS

### Shared State Primitives (Zustand Hooks)

- `useAuth() → { user: Usuario | null, token: string | null, loading: boolean, error: string | null, login: (email: string, password: string) => Promise<void>, logout: () => void }`
- `usePAC() → { pacs: PAC[], selectedPAC: PAC | null, loading: boolean, error: string | null, createPAC: (data: PACCreate) => Promise<number>, getPAC: (id: number) => Promise<void>, publicarPAC: (data: PACPublicarRequest) => Promise<PACPublicarResponse> }`
- `useRequerimiento() → { requerimientos: Requerimiento[], loading: boolean, error: string | null, createRequerimiento: (data: RequerimientoCreate) => Promise<number>, getRequerimientosByPAC: (pac_id: number) => Promise<void> }`
- `useItem() → { items: Item[], loading: boolean, error: string | null, createItem: (data: { requerimiento_id: number, codigo: string, descripcion: string, cantidad: number, precio_unitario: string }) => Promise<number>, getItemsByRequerimiento: (requerimiento_id: number) => Promise<void> }`
- `useOrden() → { ordenes: OrdenCompra[], loading: boolean, error: string | null, getOrdenesByPAC: (pac_id: number) => Promise<void> }`

### Reusable Components

- `LoginForm` props: `{ onSubmit: (email: string, password: string) => void, loading: boolean, error: string | null }`
- `PACList` props: `{ pacs: PAC[], onSelect: (id: number) => void, selectedPACId: number | null }`
- `PACForm` props: `{ onSubmit: (data: PACCreate) => void, loading: boolean }`
- `RequerimientoList` props: `{ requerimientos: Requerimiento[], onSelect: (id: number) => void, selectedRequerimientoId: number | null }`
- `RequerimientoForm` props: `{ onSubmit: (data: RequerimientoCreate) => void, loading: boolean }`
- `ItemList` props: `{ items: Item[], onSelect: (id: number) => void, selectedItemId: number | null }`
- `ItemForm` props: `{ onSubmit: (data: { requerimiento_id: number, codigo: string, descripcion: string, cantidad: number, precio_unitario: string }) => void, loading: boolean }`
- `OrdenList` props: `{ ordenes: OrdenCompra[] }`
- `VersionList` props: `{ versiones: VersionPAC[] }`

---

## 8. FILE EXTENSION CONVENTION

- **Frontend files use `.tsx` for all React components and hooks.**
- **The project is TypeScript-based (all files use `.ts`/`.tsx`).**
- **Entry point:** `/src/main.tsx` (as referenced in `public/index.html` via `<script src="/src/main.tsx">`)
- **No `.jsx` or plain `.js` files are used in the frontend.**
- **Backend files use `.py` exclusively.**