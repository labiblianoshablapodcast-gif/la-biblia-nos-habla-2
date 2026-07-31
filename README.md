# La Biblia Nos Habla 2.0 — Next.js

Primera base profesional de la nueva Plataforma Ministerial.

## Incluye

- Next.js + TypeScript.
- Diseño adaptable.
- Página principal.
- Módulo Biblia completa preparado para una traducción autorizada.
- Biblioteca de predicaciones.
- Primeros Pasos con Jesús.
- Centro de Conexión.
- Misiones.
- Galería.
- Perfil pastoral.
- Prototipo del Panel Pastoral.
- Esquema inicial para Supabase.
- Enlace de WhatsApp.
- Formularios por correo.

## Importante: Biblia completa

El proyecto incluye los 66 libros y la navegación. Para publicar el texto completo debemos conectar:

1. Una traducción de dominio público, o
2. Una API/licencia autorizada por el propietario de la traducción.

No se incluyó una traducción protegida sin autorización.

## Ejecutar en la Mac

1. Instale Node.js 20 o más reciente.
2. Abra Terminal dentro de esta carpeta.
3. Ejecute:

```bash
npm install
npm run dev
```

4. Abra `http://localhost:3000`.

## Subir a GitHub

Se recomienda crear un repositorio nuevo:

`la-biblia-nos-habla-2`

Suba todo el contenido de esta carpeta. Luego importe ese repositorio en Vercel.

## Supabase

1. Cree un proyecto en Supabase.
2. Copie `.env.example` como `.env.local`.
3. Agregue las claves.
4. Ejecute `supabase-schema.sql` en SQL Editor.
5. Después se conectarán autenticación, recursos, oración, misiones y eventos.

## Próximos módulos

- Login real.
- Panel CRUD.
- Biblia completa con fuente autorizada.
- Carga de imágenes.
- Galería dinámica.
- Favoritos y progreso.
- Calendario.
- Reportes.
- Diezmos y ofrendas al final.
