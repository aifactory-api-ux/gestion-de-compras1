# Coverage Report — pac_service
Fecha: 2026-04-24  |  Stack: Python/FastAPI  |  Directorio: backend/pac_service

## Resumen
| Métrica | Valor |
|---------|-------|
| Estado | 🔴 CRÍTICO |
| Cobertura total | 49% |
| Tests ejecutados | 8 |
| Tests pasados | 1 |
| Tests fallidos | 7 |

## Cobertura por archivo
| Archivo | Cobertura |
|---------|-----------|
| __init__.py | 100% |
| main.py | 0% |
| routes.py | 0% |
| service.py | 55% |
| tests/test_service.py | 90% |

## Tests fallidos / errores
- `test_create_pac_returns_id` — El modelo Pydantic PAC requiere campo 'id' obligatorio, pero el código intenta crear una instancia sin id
- `test_get_pac_returns_none_for_nonexistent` — db.query(models.PAC) falla porque PAC es un Pydantic model, no un SQLAlchemy model
- `test_publicar_pac_raises_error_for_nonexistent` — Mismo problema con models.PAC usado como modelo SQLAlchemy
- `test_get_requerimiento_returns_none` — Mismo problema con models.Requerimiento
- `test_get_requerimientos_by_pac_returns_list` — Mismo problema
- `test_get_item_returns_none` — Mismo problema con models.Item
- `test_get_items_by_requerimiento_returns_list` — Mismo problema

## Problema fundamental
El código de servicio utiliza `db.query(models.PAC)` donde `models.PAC` es un Pydantic BaseModel, no un SQLAlchemy model. Esto causa errores de validación cuando se intenta usar los modelos como columnas SQLAlchemy.

## Notas
- Solo el test `test_get_all_pac_returns_list` pasa porque no intenta acceder a atributos del modelo
- Los tests fallidos revelan un problema de diseño: los modelos Pydantic se usan como si fueran modelos SQLAlchemy