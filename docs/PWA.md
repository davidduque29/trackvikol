# TrackVikol como PWA

## Instalación

- **iPhone (Safari):** abrir https://davidduque29.github.io/trackvikol/ → Compartir → Añadir a pantalla de inicio → Añadir.
- **Android (Chrome):** abrir el mismo enlace → menú ⋮ → Instalar aplicación o Añadir a pantalla de inicio.

## Arquitectura

- `public/manifest.webmanifest`: identidad, pantalla de inicio y modo standalone.
- `public/sw.js`: service worker limitado al subdirectorio de Pages, caché del shell y recursos compilados, con navegación network-first.
- `src/main.tsx`: registro solo en producción.
- `index.html`: metadatos de iOS y manifest.

## Alcance y limitaciones

- Instalación desde HTTPS, icono SVG y ejecución standalone en dispositivos compatibles.
- La interfaz visitada previamente puede abrir sin conexión, siempre que sus recursos hayan sido almacenados en caché.
- El registro de mantenimientos usa localStorage; **no hay sincronización, almacenamiento en nube ni notificaciones push**.
- En iOS puede requerirse icono PNG para presentación óptima; se añadirá como mejora.
- El service worker no intercepta solicitudes de terceros ni mutaciones HTTP.
- Para probar cambios de despliegue, abrir online y recargar; la caché se renueva por versión.

## Validación

1. CI en verde.
2. GitHub Pages publicado desde main.
3. DevTools → Application → Manifest y Service Workers sin errores.
4. Instalar en iPhone y Android; comprobar pantalla completa.
5. Abrir una vez online y luego comprobar el inicio offline.
