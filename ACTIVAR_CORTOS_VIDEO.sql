-- 60 Segundos de Fe — habilitar videos en el bucket existente site-media
-- Ejecutar una sola vez en Supabase > SQL Editor.

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  104857600,
  array[
    'image/jpeg','image/png','image/webp','image/heic','image/heif',
    'video/mp4','video/quicktime','video/webm'
  ]
)
on conflict (id) do update set
  public=excluded.public,
  file_size_limit=excluded.file_size_limit,
  allowed_mime_types=excluded.allowed_mime_types;

-- Las políticas existentes de site-media ya permiten a usuarios staff
-- subir, actualizar y eliminar archivos dentro de este bucket.
