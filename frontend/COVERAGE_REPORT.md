# Coverage Report — frontend
Fecha: 2026-04-24  |  Stack: TypeScript/React/Vite  |  Directorio: frontend

## Resumen
| Métrica | Valor |
|---------|-------|
| Estado | 🔴 CRÍTICO |
| Cobertura total | N/A |
| Tests ejecutados | 0 |
| Tests pasados | 0 |
| Tests fallidos | 0 |

## Cobertura por archivo
| Archivo | Cobertura |
|---------|-----------|
| N/A | N/A |

## Tests fallidos / errores
- Instalación de dependencias de test falló debido a error ENOTEMPTY en npm
- Los paquetes jsdom y @vitest/coverage-v8 no pudieron ser instalados
- El test models.test.ts no pudo ejecutarse

## Problemas encontrados
1. npm install falla con errno -39 (ENOTEMPTY) al intentar instalar jsdom y @vitest/coverage-v8
2. El directorio node_modules tiene conflictos de símbolos de enlace (symlinks)

## Notas
- Los tests unitarios no pudieron ejecutarse debido a problemas con el gestor de paquetes npm
- La configuración de vitest en vite.config.ts está correcta pero no puede ejecutarse sin las dependencias