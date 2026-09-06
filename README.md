# BioMind Web

Sitio web independiente. La página de presentación está en `index.html`;
el acceso y los paneles se sirven desde `/app/`.

## Abrir

```sh
npm start
```

Abrir http://127.0.0.1:4173/app/ para ver el diseño adaptado.

## Editar el diseño web

Los archivos editables están en `ui/`. Esta copia pertenece exclusivamente a
la web y no importa archivos del proyecto móvil.

- `ui/features/auth/components/AuthScreen.tsx`: acceso adaptable, con ilustración y formulario en dos columnas para escritorio.
- `ui/features/`: pantallas por rol, con los colores, tipografías e imágenes originales.
- `ui/components/ResponsiveGrid.tsx`: distribución de tarjetas según el ancho.
- `ui/features/workspace/components/WorkspaceBottomBar.tsx`: navegación.

Después de editar:

```sh
npm run build
```

Si no están instaladas las dependencias: `npm --prefix ui ci`.
El contenido compilado queda en `app/`. La presentación se conserva.
La compilación no carga archivos .env del proyecto móvil.

Las cuentas y los datos usan el mismo proyecto Firebase. Las pantallas conservan
las capacidades y datos de ejemplo existentes en el diseño de referencia.
El asistente requiere configurar Gemini por separado.
