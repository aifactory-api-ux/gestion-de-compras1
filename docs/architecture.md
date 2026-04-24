# Arquitectura del Sistema

## Diagrama de Componentes

```
┌──────────────────────────────────────────────────────────────┐
│                         Frontend                              │
│                    React 18 + MUI                             │
│                   Puerto: 3000                                │
└─────────────────────┬────────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│   Auth Service  │       │   PAC Service   │
│   FastAPI       │       │   FastAPI       │
│   Puerto: 8001  │       │   Puerto: 8002  │
└────────┬────────┘       └────────┬────────┘
         │                         │
         └────────────┬────────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│   PostgreSQL     │       │     Redis        │
│   Puerto: 5432   │       │   Puerto: 6379  │
└─────────────────┘       └─────────────────┘
```

## Servicios

### Auth Service (Puerto 8001)
- Autenticación de usuarios con JWT
- Gestión de sesiones en Redis
- Validación de credenciales

### PAC Service (Puerto 8002)
- CRUD de PACs
- Gestión de Requerimientos
- Gestión de Items
- Control de Versiones
- Órdenes de Compra

## Modelos de Datos

- **Usuario**: id, nombre, email, rol, hashed_password
- **Organismo**: id, nombre, rut
- **PAC**: id, organismo_id, usuario_id, nombre, fecha_creacion, estado
- **Requerimiento**: id, pac_id, descripcion, monto_estimado, moneda
- **Item**: id, requerimiento_id, codigo, descripcion, cantidad, precio_unitario
- **VersionPAC**: id, pac_id, version, fecha, cambios
- **OrdenCompra**: id, numero_oc, pac_id, monto_transado, estado

## Flujo de Autenticación

1. Usuario envía credentials a `/auth/login`
2. Auth Service valida y genera JWT
3. JWT almacenado en Redis con TTL
4. Frontend incluye JWT en headers de requests subsiguientes
5. PAC Service valida JWT en cada request protegida

## Tecnologías

- **Backend**: Python 3.11, FastAPI 0.95.2, SQLAlchemy 2.0.19, Pydantic 1.10.7
- **Frontend**: React 18.2.0, TypeScript 5.1.3, Zustand 4.3.9, MUI 5.13.7
- **Base de Datos**: PostgreSQL 15
- **Cache**: Redis 7
- **Contenedores**: Docker 24.0.2, Docker Compose 2.18.1
