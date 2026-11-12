# Bitácora y manual de desarrollo — TrackVikol

**Inicio:** 2026-11-11 · **Versión:** 0.1 · **Estado:** diseño

## Objetivo
Documentar de forma incremental **qué se crea, por qué, dónde, cómo funciona, cómo se prueba y cómo se despliega**. Este manual será el registro de referencia para reproducir el desarrollo desde cero.

## Convenciones
- Cada cambio debe registrar fecha, etapa, objetivo, archivos afectados, decisiones, comandos, pruebas, resultado y próximos pasos.
- Distinguir siempre: **propuesto**, **implementado**, **probado** y **desplegado**.
- Registrar decisiones técnicas en `docs/decisions/` cuando tengan impacto arquitectónico.
- No almacenar claves, tokens, datos personales reales ni secretos en Git.
- Preferir cambios mediante rama + pull request + revisión antes de fusionar a `main`.

## Etapas previstas
| Etapa | Entregable | Estado |
|---|---|---|
| 0. Visión y alcance | Objetivos, actores, MVP y reglas de negocio | En definición |
| 1. Identidad visual | Logo, paleta, componentes | En definición |
| 2. Arquitectura y datos | ER, modelo relacional, decisiones técnicas | Documentado como propuesta |
| 3. Entorno y repositorio | Estructura, dependencias, configuración local | Pendiente |
| 4. Base de datos | Migraciones, integridad, seguridad | Pendiente |
| 5. Backend | API, servicios, adaptadores, pruebas | Pendiente |
| 6. Frontend | Pantallas, responsive, accesibilidad | Pendiente |
| 7. Integración y QA | Pruebas E2E, seguridad, rendimiento | Pendiente |
| 8. CI/CD y despliegue | Pipeline, entornos, rollback y monitoreo | Pendiente |
| 9. Evolución | Nuevos vehículos, reportes, recordatorios | Pendiente |

## Registro de cambios

### 2026-11-11 — Diseño inicial del dominio
**Objetivo:** permitir múltiples clases de vehículos y registrar mantenimientos, gastos, facturas y documentos.

**Artefactos creados:**
- `docs/data-model/entity-relationship.md`: diagrama ER en Mermaid.
- `docs/data-model/relational-model.md`: tablas, claves, integridad y extensibilidad.
- `docs/development-manual.md`: esta bitácora.
- `README.md`: índice de documentación y resumen del producto.

**Decisión:** usar un núcleo común `vehicles` con tipos configurables y atributos específicos por tipo, evitando una tabla de vehículos por categoría. Base de datos PostgreSQL como propuesta, aún no confirmada.

**Pruebas:** revisión documental; sin pruebas automatizadas ni base de datos desplegada.

**Pendientes:** aprobar alcance MVP, elegir stack y autenticación, precisar atributos y crear SQL inicial.

## Plantilla para futuras entradas

```md
### AAAA-MM-DD — Nombre del cambio
**Etapa / estado:**
**Objetivo:**
**Archivos creados o modificados:**
**Conceptos técnicos y decisiones:**
**Pasos y comandos reproducibles:**
**Configuración / variables (sin secretos):**
**Pruebas y evidencias:**
**Despliegue / rollback:**
**Problemas encontrados y solución:**
**Próximos pasos:**
```

## Guía futura para despliegue
Cuando se implemente CI/CD, documentar: disparadores (push/PR/manual), `.github/workflows/`, jobs, runners, secrets, artefactos de compilación, entorno de destino, URL, verificación y rollback. **Actualmente no se declara ningún pipeline configurado.**
