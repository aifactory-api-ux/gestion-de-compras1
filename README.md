# Gestión de Compras

Sistema de gestión de Planes Anual de Compras (PAC) con autenticación JWT y arquitectura de microservicios.

## Arquitectura

- **Backend**: Python 3.11, FastAPI, SQLAlchemy, PostgreSQL 15, Redis
  - `auth-service` (puerto 8001): Autenticación JWT
  - `pac-service` (puerto 8002): Gestión de PACs, Requerimientos, Items, Versiones, Órdenes de Compra
- **Frontend**: React 18, TypeScript, Axios, Zustand, MUI
- **Infraestructura**: Docker Compose, PostgreSQL, Redis

## Inicio Rápido

```bash
# Clonar el repositorio
git clone <repo-url>
cd gestion-compras

# Ejecutar con Docker Compose
chmod +x run.sh
./run.sh

# O manualmente
docker-compose up -d
```

## Servicios

| Servicio      | Puerto | Descripción                    |
|---------------|--------|--------------------------------|
| Frontend      | 3000   | Aplicación React               |
| Auth Service  | 8001   | Endpoints de autenticación     |
| PAC Service   | 8002   | Gestión de PAC y entidades     |
| PostgreSQL    | 5432   | Base de datos                  |
| Redis        | 6379   | Cache y sesiones              |

## Endpoints API

### Auth
- `POST /auth/login` - Iniciar sesión

### PAC
- `POST /pac` - Crear PAC
- `GET /pac/{id}` - Obtener PAC
- `GET /pac` - Listar PACs
- `PUT /pac/publicar` - Publicar PAC

### Requerimiento
- `POST /requerimiento` - Crear requerimiento
- `GET /requerimiento/{id}` - Obtener requerimiento
- `GET /requerimiento?pac_id={pac_id}` - Listar requerimientos

### Item
- `POST /item` - Crear item
- `GET /item/{id}` - Obtener item
- `GET /item?requerimiento_id={id}` - Listar items

### Versiones
- `GET /pac/{pac_id}/versiones` - Listar versiones

### Órdenes de Compra
- `GET /pac/{pac_id}/ordenes` - Listar órdenes

## Variables de Entorno

Ver `.env.example` para todas las variables disponibles.

## Desarrollo

```bash
# Backend
cd backend
pip install -r auth-service/requirements.txt
pip install -r pac-service/requirements.txt

# Frontend
cd frontend
npm install
npm run dev
```
