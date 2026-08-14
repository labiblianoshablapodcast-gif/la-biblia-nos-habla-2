# La Biblia Nos Habla 2.0 — Versión 8.0

Una entrega web adaptable y lista para Vercel, centrada en la nueva página **El Pastor**. Incluye portada, biografía, reconocimiento pastoral, línea del tiempo, galería con filtros y visor, sección de recursos y formulario de oración.

## Preparación de las fotos

Las fotografías entregadas ya están integradas en `public/images/`. Revise [`public/images/README.md`](public/images/README.md) si desea sustituir alguna.

## Publicar

1. Instale las dependencias con `npm install`.
2. Compruebe la compilación con `npm run build`.
3. Importe la carpeta en Vercel o suba estos archivos a su repositorio conectado. Vercel detectará Vite automáticamente.

## Supabase

Ejecute una vez [`supabase/002_version_8_pastor_gallery.sql`](supabase/002_version_8_pastor_gallery.sql) en Supabase SQL Editor. Crea el catálogo de la galería y el almacenamiento público de fotos. Revise la política de administradores antes de ejecutar en producción: el SQL usa el rol `authenticated` como valor compatible por defecto.

## Integración con la versión 7.1

Este proyecto se preparó como entrega independiente porque la carpeta recibida no contenía el código de la versión 7.1. Al contar con ese proyecto, copie los archivos de `src/`, `public/images/`, `supabase/` y `vercel.json` según corresponda, y conecte los enlaces de Multimedia, Biblia, Misiones y Oración a las rutas ya existentes de la 7.1.
