# Plan de Implementación: Portal del Cliente (Arquitectura Robusta)

Para garantizar un sistema escalable, profesional y duradero, construiremos el Portal del Cliente respaldado completamente por la base de datos, evitando cálculos temporales y permitiendo un control administrativo total.

## 1. Modelo de Datos para "Progreso de Preparativos" (Backend)
No calcularemos el progreso basado en fechas. En su lugar, crearemos un sistema real de control de hitos.

- **Nuevo Modelo (`EventMilestone`):**
  Crearemos una tabla en la base de datos que almacenará las tareas asociadas a un evento.
  - Campos: `milestone_id`, `event_id`, `title` (ej: "Prueba de Menú"), `description`, `status` (Pending, In Progress, Completed), `due_date`, `completed_at`.
- **Lógica de Creación:** Cuando un evento pase a estado `Confirmed`, el backend generará automáticamente la lista de hitos predeterminados (Reserva, Prueba de Menú, Playlist, Pago Final) en esta tabla.
- **Control Administrativo:** Esto te permitirá, en el futuro, ir al panel de administrador y marcar manualmente cuando un cliente haya completado la "Prueba de Menú", y esto se reflejará en tiempo real en el Portal del Cliente.

## 2. Autenticación Robusta del Cliente (Backend)
- **Nuevo Endpoint (`POST /api/client/login`):**
  Se encargará exclusivamente de los clientes (no del staff).
  Validará:
  1. Si el correo existe en la tabla `Clients`.
  2. Si la clave generada `(Inicial mayúscula + doc_id)` coincide con la solicitada.
- **Seguridad (JWT):** El endpoint devolverá un token firmado (`client_token`) para proteger las rutas del portal, asegurando que un cliente no pueda ver facturas o eventos de otro.

## 3. Integración en el Frontend (Portal)
- **Contexto de Sesión (`ClientAuthContext`):** Crearemos un estado global para saber si el cliente está logueado en la página web, persistiendo la sesión aunque recargue la pestaña.
- **Obtención de Datos Protegida:** Al entrar al `ClientPortal`, React consultará las rutas protegidas:
  - `GET /api/client/my-events` (Trae su evento activo y pasados).
  - `GET /api/client/my-events/:id/milestones` (Trae su progreso real desde BD).
  - `GET /api/client/my-invoices` (Trae los recibos pagados asociados).

## Open Questions

> [!IMPORTANT]
> **Alineación Final:**
> Esta arquitectura robusta requiere crear un nuevo archivo de modelo en el Backend (`EventMilestone`), hacer una pequeña migración (sincronización de Sequelize) y crear las rutas. 
> 
> ¿Estás de acuerdo con este enfoque estructural de crear la tabla de `EventMilestone` para que tengas control total sobre el progreso de cada cliente?

## Verification Plan
1. **Backend:** Creación del modelo `EventMilestone`, creación de los endpoints `/login`, `/my-events`, `/milestones`.
2. **Postman/Logs:** Probar que el login devuelve el token y que un evento confirmado genera los hitos.
3. **Frontend:** Programar la llamada a la API en el formulario flotante del Planificador. Validar inicio de sesión exitoso.
4. **Portal:** Pintar el portal de Luis Silva con datos reales extraídos de la API.
