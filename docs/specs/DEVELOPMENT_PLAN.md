# DEVELOPMENT PLAN: Gestion de Compras1

## 1. ARCHITECTURE OVERVIEW

**Components:**
- **Backend:** Python 3.11, FastAPI, SQLAlchemy, Pydantic, PostgreSQL 15, Redis, Alembic migrations
  - **auth-service** (port 8001): User authentication (JWT), login endpoint
  - **pac-service** (port 8002): PAC, Requerimiento, Item, VersionPAC, OrdenCompra endpoints
  - **shared/**: Pydantic models, SQLAlchemy models, DB/Redis connection helpers, shared config
- **Frontend:** React 18, TypeScript, Axios, Zustand, MUI
  - Auth, PAC, Requerimiento, Item, OrdenCompra, VersionPAC modules
  - State management hooks, API clients, UI components, routing
- **Infrastructure:** Docker Compose, Dockerfiles per service, Redis, PostgreSQL, healthchecks, run.sh, .env.example

**Models (from SPEC.md):**
- Usuario, Organismo, PAC, Requerimiento, Item, VersionPAC, OrdenCompra, TokenResponse, PACCreate, RequerimientoCreate, PACPublicarRequest, PACPublicarResponse

**API Endpoints (from SPEC.md):**
- **Auth:** POST /auth/login
- **PAC:** POST /pac, GET /pac/{id}, GET /pac, PUT /pac/publicar
- **Requerimiento:** POST /requerimiento, GET /requerimiento/{id}, GET /requerimiento?pac_id={pac_id}
- **Item:** POST /item, GET /item/{id}, GET /item?requerimiento_id={requerimiento_id}
- **VersionPAC:** GET /pac/{pac_id}/versiones
- **OrdenCompra:** GET /pac/{pac_id}/ordenes

**Folder Structure (from SPEC.md):**
```
.
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
├── run.sh
├── backend/
│   ├── shared/
│   │   ├── models.py
│   │   ├── db.py
│   │   └── __init__.py
│   ├── auth-service/
│   │   ├── main.py
│   │   ├── routes.py
│   │   ├── service.py
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── __init__.py
│   ├── pac-service/
│   │   ├── main.py
│   │   ├── routes.py
│   │   ├── service.py
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── __init__.py
├── frontend/
│   ├── public/
│   │   ├── index.html
│   ├── src/
│   │   ├── main.tsx
│   │   ├── App.tsx
│   │   ├── api/
│   │   │   ├── auth.ts
│   │   │   ├── pac.ts
│   │   │   ├── requerimiento.ts
│   │   │   ├── item.ts
│   │   │   ├── orden.ts
│   │   │   └── version.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── usePAC.ts
│   │   │   ├── useRequerimiento.ts
│   │   │   ├── useItem.ts
│   │   │   └── useOrden.ts
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── PACList.tsx
│   │   │   ├── PACForm.tsx
│   │   │   ├── RequerimientoList.tsx
│   │   │   ├── RequerimientoForm.tsx
│   │   │   ├── ItemList.tsx
│   │   │   ├── ItemForm.tsx
│   │   │   ├── OrdenList.tsx
│   │   │   └── VersionList.tsx
│   │   ├── types/
│   │   │   ├── models.ts
│   │   ├── utils/
│   │   │   ├── apiClient.ts
│   │   └── routes/
│   │       ├── index.tsx
│   ├── Dockerfile
│   ├── .env.example
│   └── README.md
```

## 2. ACCEPTANCE CRITERIA

1. **End-to-end PAC Management:** A user can log in, create a PAC, add requerimientos and items, publish the PAC (with signature), and view the PAC summary, version history, and associated orders, all via the frontend UI and backend APIs.
2. **Data Integrity & Security:** All endpoints validate input/output against the shared models, enforce RBAC (Usuario PAC/Admin PAC), and require JWT authentication. No sensitive data is leaked in error responses.
3. **Zero-touch Deployment:** After cloning the repo and running `./run.sh`, all services (backend, frontend, DB, Redis) are healthy, and the web app is accessible at the documented URL, with all endpoints and UI features working as specified.

---

## TEAM SCOPE (MANDATORY — PARSED BY THE PIPELINE)

- **Role:** role-tl (technical_lead)
- **Role:** role-be (backend_developer)
- **Role:** role-fe (frontend_developer)
- **Role:** role-devops (devops_support)

---

## 3. EXECUTABLE ITEMS

---

### ITEM 1: Foundation — shared types, interfaces, DB schemas, config

**Goal:**  
Create all shared code and configuration for the project. This includes:
- All Pydantic and SQLAlchemy models for every entity (Usuario, Organismo, PAC, Requerimiento, Item, VersionPAC, OrdenCompra, TokenResponse, etc.)
- TypeScript interfaces for all frontend models
- Shared DB connection helpers (PostgreSQL, Redis)
- Shared config/environment validation for both Python and TypeScript
- Utility functions used by multiple modules
- Alembic migration for initial DB schema (tables, indexes, constraints)

**Files to create:**
- backend/shared/models.py — All Pydantic and SQLAlchemy models for every entity, enums for roles/statuses, and any shared validation logic.
- backend/shared/db.py — PostgreSQL and Redis connection helpers, session management, base class for SQLAlchemy.
- backend/shared/__init__.py
- backend/shared/config.py — Environment variable validation and shared constants for backend services.
- backend/shared/utils.py — Shared utility functions (e.g., currency formatting, date helpers).
- backend/shared/alembic.ini — Alembic config for DB migrations.
- backend/shared/alembic/env.py — Alembic environment setup.
- backend/shared/alembic/versions/0001_initial.py — Initial migration: creates all tables, indexes, constraints.
- frontend/src/types/models.ts — All TypeScript interfaces for entities (as per SPEC.md).
- frontend/src/utils/apiClient.ts — Axios instance with base URL, interceptors for JWT, error handling.
- frontend/src/utils/config.ts — Frontend environment variable validation and shared constants.

**Dependencies:** None

**Validation:**  
- Run `alembic upgrade head` in backend/shared/ to create all DB tables with correct schema.
- Import any model from backend/shared/models.py in both backend/auth-service and backend/pac-service without error.
- Import any interface from frontend/src/types/models.ts in frontend code without error.

**Role:** role-tl (technical_lead)

---

### ITEM 2: Auth Service — JWT login, session, RBAC

**Goal:**  
Implement the authentication microservice with:
- POST /auth/login endpoint (validates credentials, returns JWT)
- JWT creation/validation, session storage in Redis
- RBAC enforcement (Usuario PAC/Admin PAC)
- Healthcheck endpoint
- Structured logging, error handling, env validation

**Files to create:**
- backend/auth-service/main.py — FastAPI app entrypoint, includes /health endpoint.
- backend/auth-service/routes.py — Defines /auth/login endpoint, input/output validation.
- backend/auth-service/service.py — Auth logic: credential check, JWT creation, session management, RBAC.
- backend/auth-service/requirements.txt — All dependencies (FastAPI, SQLAlchemy, Pydantic, python-jose, redis, etc.).
- backend/auth-service/Dockerfile — Multi-stage build, non-root user, EXPOSE 8001, CMD: uvicorn main:app.
- backend/auth-service/__init__.py

**Dependencies:** Item 1

**Validation:**  
- `docker build` and `docker run` for auth-service completes with no errors.
- POST /auth/login returns a valid JWT for correct credentials, rejects invalid ones.
- /health endpoint returns status, service, version.

**Role:** role-be (backend_developer)

---

### ITEM 3: PAC Service — PAC, Requerimiento, Item, Version, OrdenCompra endpoints

**Goal:**  
Implement the PAC management microservice with:
- All PAC, Requerimiento, Item, VersionPAC, OrdenCompra endpoints as per SPEC.md:
  - POST /pac, GET /pac/{id}, GET /pac, PUT /pac/publicar
  - POST /requerimiento, GET /requerimiento/{id}, GET /requerimiento?pac_id={pac_id}
  - POST /item, GET /item/{id}, GET /item?requerimiento_id={requerimiento_id}
  - GET /pac/{pac_id}/versiones
  - GET /pac/{pac_id}/ordenes
- JWT authentication and RBAC on all endpoints
- Integration with Redis for caching/session
- Healthcheck endpoint
- Structured logging, error handling, env validation

**Files to create:**
- backend/pac-service/main.py — FastAPI app entrypoint, includes /health endpoint.
- backend/pac-service/routes.py — All endpoints as per SPEC.md, input/output validation.
- backend/pac-service/service.py — Business logic for PAC, Requerimiento, Item, VersionPAC, OrdenCompra.
- backend/pac-service/requirements.txt — All dependencies (FastAPI, SQLAlchemy, Pydantic, redis, etc.).
- backend/pac-service/Dockerfile — Multi-stage build, non-root user, EXPOSE 8002, CMD: uvicorn main:app.
- backend/pac-service/__init__.py

**Dependencies:** Item 1

**Validation:**  
- `docker build` and `docker run` for pac-service completes with no errors.
- All endpoints respond as per SPEC.md, with correct input/output validation.
- /health endpoint returns status, service, version.

**Role:** role-be (backend_developer)

---

### ITEM 4: Frontend — Core (types, API clients, hooks, main app, routing)

**Goal:**  
Implement the frontend core:
- All TypeScript interfaces (import from types/models.ts)
- API clients for all endpoints (auth, pac, requerimiento, item, orden, version)
- State management hooks (useAuth, usePAC, useRequerimiento, useItem, useOrden)
- Main app entry (main.tsx, App.tsx)
- App routing (routes/index.tsx)
- Axios instance with JWT, error handling

**Files to create:**
- frontend/src/main.tsx — React entrypoint.
- frontend/src/App.tsx — Main app component, layout, error boundary.
- frontend/src/api/auth.ts — Auth API client.
- frontend/src/api/pac.ts — PAC API client.
- frontend/src/api/requerimiento.ts — Requerimiento API client.
- frontend/src/api/item.ts — Item API client.
- frontend/src/api/orden.ts — OrdenCompra API client.
- frontend/src/api/version.ts — VersionPAC API client.
- frontend/src/hooks/useAuth.ts — Auth state hook (Zustand).
- frontend/src/hooks/usePAC.ts — PAC state hook.
- frontend/src/hooks/useRequerimiento.ts — Requerimiento state hook.
- frontend/src/hooks/useItem.ts — Item state hook.
- frontend/src/hooks/useOrden.ts — OrdenCompra state hook.
- frontend/src/routes/index.tsx — App routes (React Router DOM).

**Dependencies:** Item 1

**Validation:**  
- `npm run build` in frontend/ completes with no errors.
- All API clients and hooks import types from types/models.ts and connect to backend endpoints.
- App loads and routes render without error.

**Role:** role-fe (frontend_developer)

---

### ITEM 5: Frontend — UI Components (Login, PAC, Requerimiento, Item, Orden, Version)

**Goal:**  
Implement all UI components for user interaction:
- LoginForm.tsx: User login
- PACList.tsx: List PACs
- PACForm.tsx: Create/edit PAC
- RequerimientoList.tsx: List requerimientos
- RequerimientoForm.tsx: Create/edit requerimiento
- ItemList.tsx: List items
- ItemForm.tsx: Create/edit item
- OrdenList.tsx: List OrdenCompra
- VersionList.tsx: List VersionPAC

**Files to create:**
- frontend/src/components/LoginForm.tsx
- frontend/src/components/PACList.tsx
- frontend/src/components/PACForm.tsx
- frontend/src/components/RequerimientoList.tsx
- frontend/src/components/RequerimientoForm.tsx
- frontend/src/components/ItemList.tsx
- frontend/src/components/ItemForm.tsx
- frontend/src/components/OrdenList.tsx
- frontend/src/components/VersionList.tsx

**Dependencies:** Item 1

**Validation:**  
- All components render and function as per their contract, using hooks and API clients.
- User can log in, create/view PACs, requerimientos, items, view versions and orders.

**Role:** role-fe (frontend_developer)

---

### ITEM 6: Infrastructure & Deployment

**Goal:**  
Provide complete orchestration and documentation for local development and deployment:
- Docker Compose for all services (auth-service, pac-service, frontend, postgres, redis)
- Healthchecks and startup order (depends_on: service_healthy)
- .env.example with all required variables and descriptions
- .gitignore and .dockerignore for all relevant files
- run.sh script: validates Docker, builds, starts, waits for healthy, prints access URL
- README.md: setup, run, endpoints, troubleshooting
- docs/architecture.md: system diagram, component descriptions

**Files to create:**
- docker-compose.yml
- .env.example
- .gitignore
- .dockerignore
- run.sh
- README.md
- docs/architecture.md

**Dependencies:** Items 1–5

**Validation:**  
- `./run.sh` completes without errors.
- All services are healthy (`docker ps` shows healthy status).
- Web app accessible at documented URL, all endpoints and UI features work as specified.

**Role:** role-devops (devops_support)

---