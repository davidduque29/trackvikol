# TrackVikol

**Toda la historia de tu vehículo, en un solo lugar.**

TrackVikol es una plataforma modular para organizar la información de carros, motos, patinetas y bicicletas. Esta primera entrega es una **interfaz de demostración**: aún no tiene autenticación, almacenamiento permanente, adjuntos ni integración con Supabase.

## Estado del proyecto

**Fase:** base inicial de la aplicación (v0.1.0).

Incluye:
- Dashboard responsive con indicadores y estado del garaje.
- Navegación por vehículos, mantenimientos, documentos, recordatorios y gastos.
- Datos ficticios identificados como demostración.
- Registro temporal de vehículos (durante la sesión, sin persistencia).
- Catálogo de tipos por adaptadores configurables en código.
- Pruebas unitarias iniciales del contrato de adaptadores.
- Workflow de GitHub Actions para build y pruebas.

**No incluye todavía:** login, base de datos, carga de facturas, CRUD persistente, recordatorios automáticos, panel de administración editable ni despliegue verificado en Pages.

## Tecnologías
React 19, TypeScript, Vite, Vitest y Lucide React. La persistencia futura se evaluará con Supabase (PostgreSQL + RLS + Storage).

## Iniciar en local

Requiere Node.js 20.19+ o 22.12+.

```bash
npm install
npm run dev
```

Validación:
```bash
npm run test
npm run build
```

## Arquitectura

```text
src/
  domain/
    vehicle.ts       # Modelo de dominio
    adapters.ts      # Contratos y configuración por tipo
    format.ts        # Formatos de fecha, moneda y números
  data/
    demo.ts          # Datos ficticios de demostración
  App.tsx            # Interfaz y flujo inicial
  styles.css         # Diseño responsive
```

Los adaptadores por tipo se mantienen separados del núcleo de vehículos. La distinción entre tipo, propulsión y capacidades permitirá incorporar nuevos tipos sin multiplicar combinaciones innecesarias.

## Próximas etapas
1. Definición de requisitos y flujos de usuario.
2. Persistencia, autenticación y políticas RLS.
3. CRUD completo de vehículos y mantenimientos.
4. Adjuntos seguros: facturas y documentos.
5. Recordatorios por fecha y kilometraje.
6. Configuración administrativa de tipos y campos.
7. Pruebas de seguridad, accesibilidad y despliegue.

La información mostrada en la demo **no corresponde a registros reales del usuario**.
