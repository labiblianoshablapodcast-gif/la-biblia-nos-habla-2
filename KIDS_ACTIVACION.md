# Activar el progreso privado de Estudio Kids

El piloto incluye las actividades de 4-6 y 7-10 años. Las historias animadas, quizzes y PDF funcionan sin cuenta. **Las cuentas y el guardado permanecen deshabilitados hasta instalar la configuración de Supabase.** No se ejecutó esta migración desde Codex ni se verificó el aislamiento en la base de datos real.

## Activación por el propietario

1. Abra el proyecto Supabase que ya usa el sitio (el mismo de los eventos).
2. En **SQL Editor → New query**, copie el contenido completo de `ACTIVAR_ESTUDIO_KIDS.sql` y pulse **Run**. No comparta claves ni contraseñas.
3. La última consulta debe mostrar: `rls_activo=true`, `rls_forzado=true`, `anon_puede_leer=false`, `anon_puede_escribir=false`, `politicas=4`.
4. En Authentication, confirme que el proveedor Email y el registro de usuarios estén habilitados. Se recomienda mantener la confirmación de correo activa. El correo de confirmación usa la configuración existente del proyecto; después de confirmarlo, el adulto vuelve a `/kids/padres` y entra con su contraseña.
5. Abra `/kids/padres`. La pantalla de activación pendiente debe cambiar al acceso de adulto. Si no cambia, recargue la página.

## Prueba obligatoria antes de invitar familias

- Use dos cuentas de adulto de prueba en navegadores separados. No utilice datos de menores.
- Cuenta A: complete un quiz, autorice el guardado y compruebe la puntuación en su espacio de padres. Recargue y compruebe que permanece.
- Cuenta B: su panel debe estar vacío. Debe ser imposible leer, actualizar o borrar una fila cuyo `parent_id` pertenece a A usando la sesión de B; compruébelo también con el cliente Supabase autenticado, no solo con la interfaz.
- Sin sesión: GET/POST/DELETE de `/api/kids/progreso` no deben permitir consultar ni modificar resultados. Las tablas no conceden permisos al rol `anon`.
- Cambie de grupo de edad y de explorador: se guardan por separado.
- Use la confirmación de borrado de A: elimina solo resultados Kids de A, no las cuentas ni otros estudios.
- Una cuenta de padre no debe poder entrar a `/admin`.

## Datos y límites

Solo se guarda el identificador de la cuenta del adulto, número de explorador, grupo de edad, lección, puntuación más reciente, fecha y versión del consentimiento. No se guardan nombres, fotos, cumpleaños, respuestas libres ni grabaciones de menores. No hay clasificación pública ni chat.

La cuenta de adulto usa Supabase Auth. Las políticas RLS restringen cada fila a `auth.uid() = parent_id`; los administradores técnicos de Supabase mantienen sus privilegios administrativos. La API verifica al usuario y calcula la puntuación; no usa la clave `service_role`.

La declaración de adulto no equivale a verificación de edad. El ministerio debe revisar su aviso de privacidad y sus procedimientos de autorización familiar antes de invitar menores a guardar progreso. No se afirma certificación de cumplimiento legal.

La historia es un motion comic original en SVG/CSS, no un archivo de video. “Escuchar escena” utiliza la voz disponible en el dispositivo. Se respeta la preferencia de movimiento reducido. Los PDF son de una página tamaño carta y se sirven desde la app.

Referencias técnicas: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [registro por correo](https://supabase.com/docs/reference/javascript/auth-signup).
