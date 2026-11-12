# Supabase — TrackVikol

Proyecto: `zryhmxqfibkiebbrhpzg` (organización Nova, región `sa-east-1`).

## Modelo inicial (aplicado en Supabase)
- `vehicles`: vehículos por propietario.
- `maintenance_records`: historial de servicios.
- `maintenance_items`: repuestos, mano de obra y otros conceptos.
- `invoices`: facturas y referencias a archivos.
- `reminders`: recordatorios.

Todas las tablas tienen RLS habilitado y políticas de propietario basadas en `auth.uid()`. Las claves de relaciones incluyen `owner_id` para impedir asociar registros de distintos propietarios.

## Facturas: diseño definitivo

La tabla `public.invoices` incluye:
- `id uuid`, `owner_id uuid`, `maintenance_id uuid`.
- `invoice_number text`, `issued_on date`, `amount numeric(14,2)`.
- `storage_path text`: ruta relativa en Storage; **no** es una URL pública.
- `mime_type text`: tipo MIME del archivo.
- `original_filename text`: nombre original mostrado al usuario.
- `file_size_bytes bigint`: tamaño real en bytes (restricción >= 0).
- `created_at timestamptz`.

Bucket privado: `vehicle-documents`. Máximo 10 MiB por objeto. Tipos permitidos: JPEG, PNG, WebP, PDF.

Convención propuesta para archivos: `<auth-user-uuid>/<vehicle-uuid>/<invoice-uuid>.<extension>`.
El primer segmento debe coincidir con `auth.uid()`; así lo exigen las políticas de Storage. Evitar incluir nombres, placas o datos personales en las rutas.

## Flujo de carga pendiente de integrar en la interfaz
1. Autenticar al usuario en Supabase Auth.
2. Registrar mantenimiento y conceptos en PostgreSQL.
3. Generar UUID de factura y ruta de archivo.
4. Subir archivo al bucket privado con el token del usuario.
5. Insertar fila en `invoices` con `storage_path`, `original_filename`, `file_size_bytes` y `mime_type`.
6. En caso de fallo en el paso 5, eliminar el objeto recién subido o registrar un reintento de limpieza.
7. Para consultar, solicitar URL firmada de corta duración tras validar permisos.

No usar `service_role` en el navegador. Solo usar clave publicable y políticas RLS. No asumir que los datos locales de demostración están sincronizados.

## Validación
- Migración `initial_vehicle_management_schema` aplicada.
- Migración `invoice_file_metadata` aplicada.
- Verificación SQL confirmó los campos `original_filename`, `file_size_bytes` y `storage_path`.
- Asesor de seguridad Supabase: sin advertencias en la revisión ejecutada.
