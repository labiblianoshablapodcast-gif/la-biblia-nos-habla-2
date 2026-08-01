# La Biblia Nos Habla 2.1 — Next.js

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


## Versión 2.1 — Biblia completa

- Los 66 libros y los 1,189 capítulos.
- Traducción Reina-Valera 1909, dominio público.
- Navegación por libro y capítulo.
- Búsqueda rápida de libros.
- Botones anterior/siguiente.
- Carga del texto desde eBible.org con caché diaria.
- Ruta API `/api/bible/status`.
- Fuente y licencia visibles.
- Fallback para abrir el capítulo en la fuente si falla la conexión.
- Panel Pastoral ampliado y preparado para Supabase.

### Fuente bíblica

Santa Biblia Reina-Valera 1909, dominio público:
`https://ebible.org/spaRV1909/`

El sitio obtiene el texto desde la fuente pública y no incluye traducciones modernas protegidas.


## Versión 2.2 — Preparada para Reina-Valera 1960

- RVR1960 establecida como versión oficial del proyecto.
- Eliminada la integración con Reina-Valera 1909.
- Conservados los 66 libros y 1,189 capítulos.
- Navegación completa por libro y capítulo.
- Integración preparada para API o licencia autorizada.
- Variables de entorno:
  - `RVR1960_API_URL`
  - `RVR1960_API_KEY`
- Ruta de comprobación:
  - `/api/bible/status`
- El sistema no distribuye texto protegido sin autorización.

### Configuración en Vercel

Cuando obtenga acceso autorizado:

1. Abra el proyecto en Vercel.
2. Entre a **Settings → Environment Variables**.
3. Añada `RVR1960_API_URL`.
4. Añada `RVR1960_API_KEY`.
5. Haga un nuevo deployment.

La página comenzará a mostrar automáticamente los versículos proporcionados por el servicio autorizado.


## Versión 2.3 — Seguimiento de nuevos creyentes
- Respuesta automática según la solicitud.
- Página de confirmación.
- Recursos para nuevos creyentes.
- Botón de WhatsApp preparado.
- Copia en Google Sheets preparada.

Variables en Vercel:
- NEXT_PUBLIC_WHATSAPP_NUMBER
- NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK


## Versión 2.4 — Biblioteca Bíblica RV1909

- Texto Reina-Valera 1909 de dominio público.
- Los 66 libros y 1,189 capítulos.
- Búsqueda por libro y referencia.
- Navegación anterior/siguiente y selector de capítulo.
- Favoritos por capítulo guardados en el dispositivo.
- Notas personales guardadas en el dispositivo.
- Última lectura y botón para continuar.
- Modo claro y oscuro.
- Tamaño de letra ajustable.
- Compartir versículos o copiarlos al portapapeles.
- Estructura preparada para cambiar a RVR1960 autorizada.
- Endpoint de estado: `/api/bible/status`.

### Importante

Favoritos, notas y última lectura se guardan actualmente en `localStorage`. Cuando conectemos Supabase y las cuentas de usuario, estos datos podrán sincronizarse entre iPhone, Mac y otros dispositivos.


## Versión 2.5 — Panel Pastoral y Supabase

Incluye:

- Login privado con Supabase Auth.
- Protección automática de todas las rutas `/admin`.
- Cierre de sesión.
- Panel con contadores en vivo.
- Páginas administrativas para:
  - Peticiones.
  - Predicaciones.
  - Devocionales.
  - Eventos.
  - Misiones.
- Esquema SQL ampliado.
- Row Level Security.
- Roles:
  - pastor
  - secretary
  - treasurer
  - media
  - member

## Configuración

### 1. Crear proyecto en Supabase

Entre a Supabase y cree un proyecto nuevo.

### 2. Ejecutar el esquema

Abra SQL Editor y ejecute:

`supabase-schema.sql`

### 3. Crear el usuario pastoral

En Authentication → Users, cree su usuario con correo y contraseña.

### 4. Asignar rol pastoral

Después de crear el usuario, ejecute en SQL Editor:

```sql
insert into public.profiles (id, full_name, role)
select id, 'Pastor Gilberto Maldonado', 'pastor'
from auth.users
where email='SU_CORREO_AQUI';
```

### 5. Añadir variables en Vercel

En Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Después haga Redeploy.

### 6. Entrar

Abra:

`/login`

Después de iniciar sesión será enviado al Panel Pastoral.


## Versión 2.6 — Seguimiento pastoral conectado

El formulario guarda solicitudes en Supabase, registra nuevos creyentes y mantiene FormSubmit para correo y respuesta automática.
