# Modelo entidad-relación — TrackVikol

Versión 0.1 · 2026-11-11 · Estado: propuesta, no implementada.

## Diagrama ER (Mermaid)

```mermaid
erDiagram
  USERS ||--o{ VEHICLES : owns
  VEHICLE_TYPES ||--o{ VEHICLES : classifies
  VEHICLE_TYPES ||--o{ ATTRIBUTE_DEFINITIONS : defines
  VEHICLES ||--o{ VEHICLE_ATTRIBUTE_VALUES : has
  ATTRIBUTE_DEFINITIONS ||--o{ VEHICLE_ATTRIBUTE_VALUES : describes
  VEHICLES ||--o{ SERVICE_RECORDS : receives
  SERVICE_CATEGORIES ||--o{ SERVICE_RECORDS : categorizes
  SERVICE_RECORDS ||--o{ SERVICE_ITEMS : contains
  VEHICLES ||--o{ EXPENSES : incurs
  SERVICE_RECORDS o|--o{ EXPENSES : may_generate
  VEHICLES ||--o{ DOCUMENTS : has
  SERVICE_RECORDS o|--o{ DOCUMENTS : may_attach
  EXPENSES o|--o{ DOCUMENTS : may_support
  VEHICLES ||--o{ ODOMETER_READINGS : logs

  USERS {
    uuid id PK
    text email UK
    text display_name
    timestamptz created_at
  }
  VEHICLE_TYPES {
    uuid id PK
    text code UK
    text name
    boolean active
  }
  VEHICLES {
    uuid id PK
    uuid owner_id FK
    uuid vehicle_type_id FK
    text nickname
    text brand
    text model
    int model_year
    text plate
    text vin
    text status
    timestamptz created_at
  }
  ATTRIBUTE_DEFINITIONS {
    uuid id PK
    uuid vehicle_type_id FK
    text code
    text label
    text data_type
    boolean required
  }
  VEHICLE_ATTRIBUTE_VALUES {
    uuid id PK
    uuid vehicle_id FK
    uuid attribute_definition_id FK
    jsonb value
  }
  SERVICE_CATEGORIES {
    uuid id PK
    text code UK
    text name
  }
  SERVICE_RECORDS {
    uuid id PK
    uuid vehicle_id FK
    uuid category_id FK
    date performed_on
    numeric odometer_value
    text description
    text provider_name
    timestamptz created_at
  }
  SERVICE_ITEMS {
    uuid id PK
    uuid service_record_id FK
    text description
    numeric quantity
    numeric unit_price
  }
  EXPENSES {
    uuid id PK
    uuid vehicle_id FK
    uuid service_record_id FK
    date incurred_on
    text category
    numeric amount
    char currency
    text description
  }
  DOCUMENTS {
    uuid id PK
    uuid vehicle_id FK
    uuid service_record_id FK
    uuid expense_id FK
    text document_type
    text storage_key
    text original_filename
    text mime_type
    timestamptz uploaded_at
  }
  ODOMETER_READINGS {
    uuid id PK
    uuid vehicle_id FK
    date recorded_on
    numeric reading
    text unit
  }
```

## Cardinalidades y decisiones
- Un usuario puede registrar muchos vehículos; cada vehículo tiene un propietario en la versión inicial.
- Un tipo de vehículo (carro, moto, patineta, bicicleta) define atributos propios sin crear una tabla nueva por tipo.
- Cada mantenimiento puede tener varios ítems, gastos asociados y soportes.
- Los gastos pueden existir sin mantenimiento (combustible, peajes, impuestos).
- Un documento pertenece a un vehículo y puede vincularse opcionalmente a un mantenimiento o gasto.
- Lecturas de kilometraje/distancia permiten trazabilidad; la unidad puede ser km o mi.
- La propiedad compartida, transferencias, recordatorios y proveedores normalizados quedan como evolución futura.

## Reglas pendientes de validar
Definir autenticación, permisos por usuario, catálogos de gastos, moneda predeterminada, tipos de documentos, vencimientos, privacidad de placas/VIN y política de archivos.
