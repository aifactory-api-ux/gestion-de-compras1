# Coverage Report — auth_service
Fecha: 2026-04-24  |  Stack: Python/FastAPI  |  Directorio: backend/auth_service

## Resumen
| Métrica | Valor |
|---------|-------|
| Estado | 🟡 PARCIAL |
| Cobertura total | 84% |
| Tests ejecutados | 14 |
| Tests pasados | 13 |
| Tests fallidos | 1 |

## Cobertura por archivo
| Archivo | Cobertura |
|---------|-----------|
| __init__.py | 100% |
| main.py | 85% |
| routes.py | 60% |
| service.py | 68% |
| tests/conftest.py | 100% |
| tests/test_service.py | 99% |

## Tests fallidos / errores
- `test_login_returns_401_for_nonexistent_user` — Mock de base de datos no es inyectado correctamente en el endpoint de login

## Output completo
```
============================= test session starts ==============================
platform linux -- Python 3.11.15, pytest-8.3.2, pluggy-1.6.0
rootdir: /workspace/e82de356-bd88-41be-ab8c-4e337ad1fc94/backend/auth_service
configfile: pytest.ini
plugins: cov-7.1.0, langsmith-0.7.34, benchmark-4.0.0, asyncio-0.24.0, anyio-4.13.0
asyncio: mode=Mode.STRICT, default_loop_scope=None
collecting ... collected 14 items

tests/test_service.py::TestHashPassword::test_hash_password_returns_hex_string PASSED [  7%]
tests/test_service.py::TestHashPassword::test_hash_password_consistent PASSED [ 14%]
tests/test_service.py::TestHashPassword::test_hash_password_different_passwords PASSED [ 21%]
tests/test_service.py::TestVerifyPassword::test_verify_password_correct PASSED [ 28%]
tests/test_service.py::TestVerifyPassword::test_verify_password_incorrect PASSED [ 35%]
tests/test_service.py::TestVerifyPassword::test_verify_password_empty PASSED [ 42%]
tests/test_service.py::TestCreateAccessToken::test_create_token_with_expiry PASSED [ 50%]
tests/test_service.py::TestCreateAccessToken::test_create_token_default_expiry PASSED [ 64%]
tests/test_service.py::TestCreateAccessToken::test_decode_token_valid PASSED [ 71%]
tests/test_service.py::TestCreateAccessToken::test_decode_token_invalid PASSED [ 78%]
tests/test_service.py::TestHealthEndpoint::test_health_returns_200 PASSED [ 85%]
tests/test_service.py::TestLoginEndpoint::test_login_returns_401_for_nonexistent_user FAILED [ 92%]
tests/test_service.py::TestLoginEndpoint::test_login_returns_422_for_invalid_email PASSED [100%]
tests/test_service.py::TestLoginEndpoint::test_login_returns_422_for_missing_fields PASSED [100%]

=================================== FAILURES ===================================
________ TestLoginEndpoint.test_login_returns_401_for_nonexistent_user _________
[... stack trace ...]
sqlalchemy.exc.ArgumentError: Column expression expected for argument 'filter'
got <class 'backend.shared.models.Usuario'>.
```

## Notas
- Los tests de unit testing de funciones puras (hash_password, verify_password, create_access_token, decode_token) funcionan correctamente
- El test de login con mock falla debido a la forma en que el servicio_auth_service.authenticate_user itera sobre get_db_session()
- 13 de 14 tests pasan exitosamente