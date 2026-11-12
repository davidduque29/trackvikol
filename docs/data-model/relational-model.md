# Modelo relacional — TrackVikol

Versión 0.1 · 2026-11-11 · Diseño lógico propuesto (PostgreSQL); **no es una migración ejecutada**.

| Tabla | PK | FK | Restricciones / propósito |
|---|---|---|---|
| users | id UUID | — | email UNIQUE NOT NULL |
| vehicle_types | id UUID | — | code UNIQUE NOT NULL; ejemplos CAR, MOTORCYCLE, SCOOTER, BICYCLE |
| vehicles | id UUID | owner_id → users; vehicle_type_id → vehicle_types | marca/modelo opcionales; año entre 1886 y 2100; estado |
| attribute_definitions | id UUID | vehicle_type_id → vehicle_types | UNIQUE(vehicle_type_id, code); tipo de dato y obligatoriedad |
| vehicle_attribute_values | id UUID | vehicle_id → vehicles; attribute_definition_id → attribute_definitions | UNIQUE(vehicle_id, attribute_definition_id); value JSONB |
| service_categories | id UUID | — | code UNIQUE |
| service_records | id UUID | vehicle_id → vehicles; category_id → service_categories | fecha, proveedor, descripción y lectura opcional |
| service_items | id UUID | service_record_id → service_records | quantity > 0; unit_price >= 0 |
| expenses | id UUID | vehicle_id → vehicles; service_record_id → service_records NULL | amount >= 0; currency ISO 4217 |
| documents | id UUID | vehicle_id → vehicles; service_record_id → service_records NULL; expense_id → expenses NULL | storage_key único; archivo privado |
| odometer_readings | id UUID | vehicle_id → vehicles | reading >= 0; unit IN ('km','mi') |

## Integridad
1. Todas las claves UUID se generan en la aplicación o BD; timestamps en UTC.
2. La pertenencia de `attribute_definition` al `vehicle_type` del vehículo se valida mediante lógica transaccional o trigger.
3. `service_record_id` en gastos y documentos debe referirse al **mismo vehículo** de la fila; lo mismo para `expense_id` en documentos. Validar con constraints compuestas o triggers.
4. Índices recomendados: `vehicles(owner_id)`, `service_records(vehicle_id, performed_on DESC)`, `expenses(vehicle_id, incurred_on DESC)`, `documents(vehicle_id)`, `odometer_readings(vehicle_id, recorded_on DESC)`.
5. Las placas y VIN pueden ser nulos y no deben ser globalmente únicos sin revisar país y reglas de negocio.
6. Archivos binarios fuera de la BD (storage privado); en `documents` solo metadatos y ruta interna. URLs temporales firmadas para descarga.
7. Autorización por propietario en cada consulta; si se utiliza Supabase/Postgres, evaluar RLS. Evitar exposición de datos entre usuarios.
8. Borrado lógico de vehículos y políticas de retención de documentos por definir.

## Ejemplo de extensibilidad
- CAR: combustible, transmisión, cilindraje.
- MOTORCYCLE: cilindraje, tipo de transmisión.
- SCOOTER: capacidad de batería, autonomía estimada.
- BICYCLE: tipo de bicicleta, número de velocidades.

Estos atributos se definen en `attribute_definitions` y sus valores en `vehicle_attribute_values`; los datos comunes siguen en `vehicles`.

## Próximo paso
Revisar reglas y generar migración SQL versionada (por ejemplo `db/migrations/V001__initial_schema.sql`) y pruebas de integridad antes de desplegar.
