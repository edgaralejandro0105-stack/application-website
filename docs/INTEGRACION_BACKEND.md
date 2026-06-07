# Arquitectura de Integración: Sitio Web Público a Backend y Panel Administrativo

Este documento detalla el diseño arquitectónico, las librerías utilizadas y la justificación técnica detrás de la integración en tiempo real entre el sitio web orientado al cliente y el sistema administrativo de La Casona.

---

## 1. Stack Tecnológico y Dependencias Clave

Durante esta implementación no fue necesario instalar dependencias radicalmente nuevas, ya que se hizo uso intensivo del ecosistema ya configurado. Sin embargo, se utilizaron las siguientes tecnologías y librerías fundamentales:

### Backend (`backend casona` - Node.js / Express / Sequelize)
* **`zod`**: Utilizado para la validación de esquemas (Schema Validation). Garantiza que el JSON recibido de internet tenga el formato y los tipos de datos correctos antes de tocar la lógica de base de datos.
* **`socket.io`**: Servidor de WebSockets. Emite los eventos de notificaciones en tiempo real al panel administrativo
* **`nodemailer`**: Gestiona el envío asíncrono de correos electrónicos transaccionales como medida de respaldo para alertar a los administradores.
* **`sequelize`**: ORM que permitió mapear lógicamente a los clientes, eventos y salones sin escribir SQL crudo, facilitando métodos como `findByPk` y `findOne`.

### Frontend Público (`application-website` - React / Vite)
* **`fetch` (Nativo)**: Utilizado para enviar el JSON asíncrono al backend. No se usó Axios para evitar sobrecargar el bundle de la landing page.
* **`framer-motion`**: Controla las transiciones visuales durante el proceso de cotización.

### Frontend Admin (`Frontend Casona` - React / Vite / Radix UI)
* **`socket.io-client`**: Permite al navegador conectarse persistentemente al backend y escuchar eventos tipo pub/sub (`new_reservation`).
* **`sonner`**: Librería de Toasts elegida por su alta performance y facilidad de configuración global.
* **`@radix-ui/react-popover`** y **`lucide-react`**: Utilizados para construir una interfaz de notificaciones moderna y accesible.

---

## 2. Diagrama de Arquitectura y Comunicación

La solución implementa una **Arquitectura Basada en Eventos (Event-Driven)** en combinación con una API RESTful estándar.

```mermaid
graph TD
    subgraph Web Pública (application-website)
        Form[Cotizador React] -- "POST /api/events/website\n(JSON data)" --> Gateway
    end

    subgraph Backend (Express + Node.js)
        Gateway[events.routes.js] --> Zod[Zod Validator]
        Zod --> Ctrl[eventController.js]
        Ctrl --> Svc[event.service.js]
        Ctrl -. "1. io.emit()" .-> Socket[Socket.io Server]
        Ctrl -. "2. sendEmail()" .-> Correo[Nodemailer]
    end

    subgraph DB (PostgreSQL)
        Svc -- "1. Busqueda/Creación" --> ClientTable[(Clients)]
        Svc -- "2. Resolución" --> VenueTable[(Venues)]
        Svc -- "3. Inserción" --> EventTable[(Events)]
    end

    subgraph Panel Administrativo (Frontend Casona)
        Socket -- "Websocket WSS" --> ClientSocket[socket.io-client]
        ClientSocket --> Bell[NotificationBell.jsx]
        Bell --> Toast[Sonner Toaster]
    end
```

---

## 3. Decisiones Arquitectónicas (Cómo y Por qué)

### 3.1. Separación de Endpoint (Capa de Adaptación)
**Decisión:** En lugar de modificar el endpoint genérico `POST /api/events` que espera UUIDs (`client_id`, `venue_id`), se creó un endpoint específico: `POST /api/events/website`.
**Por qué:** El endpoint genérico es ideal para el panel administrativo, donde ya se conocen las referencias foráneas. En cambio, el sitio web público solo conoce nombres textuales (Ej. "Salón", "Juan"). El nuevo endpoint actúa como un patrón "Adapter", traduciendo el lenguaje natural a lenguaje de base de datos sin contaminar la API principal.

### 3.2. Prevención de Errores por Referencias Circulares (WebSockets)
**Problema:** Al crear un evento, el ORM Sequelize retorna una instancia compleja llena de metadatos y métodos (referencias circulares). Intentar emitir esta instancia cruda mediante `socket.io` producía fallos silenciosos en la serialización a JSON.
**Solución:** Se implementó el llamado al método nativo `.toJSON()` sobre el modelo antes de enviarlo por WebSockets (`newEvent.toJSON()`). Esto extrae un objeto plano purificado de datos (Plain Old Javascript Object).

### 3.3. Resolución y Formateo de Rutas en el Cliente (CORS & WebSockets)
**Problema:** El cliente React (`Frontend Casona`) definía globalmente su API bajo la variable `VITE_API_URL=http://localhost:3000/api`. Si Socket.io intenta usar esa URL base, la petición WSS fallará, dado que el servidor expone sus WebSockets en el dominio raíz `/`, no en `/api`.
**Solución:** Se diseñó lógica de interceptación en el componente `NotificationBell.jsx` para sanitizar dinámicamente la URL, extrayendo el sufijo `/api` y garantizando que el apretón de manos (handshake) ocurra en la raíz correcta (`http://localhost:3000`).

### 3.4. Estado Centralizado para Notificaciones Visuales
**Decisión:** Para evitar el "Prop Drilling" y manejar los avisos emergentes sin importar la vista en la que esté el usuario, se montó el componente `<Toaster />` directamente en la raíz de la aplicación (`main.jsx`).
**Por qué:** Esto delega la responsabilidad visual del mensaje (toast) al Layout principal, permitiendo que un micro-componente (como la campana) pueda gatillar animaciones globales simplemente llamando al método singleton `toast.success()`.

---

## 4. Estructura de Base de Datos y Creación Temporal de Clientes

Dado que el cliente es fundamental para que el `Event` se inserte, el servicio web toma la siguiente estrategia heurística:

1. **Reconocimiento por Teléfono:** Se asume que el teléfono móvil sirve como clave secundaria de identidad en reservas iniciales.
2. **Auto-registro:** Si el cliente nunca se ha registrado, el backend descompone su "Nombre Completo" en `name` y `last_name` mediante manipulación de strings.
3. **Generación de ID Documental:** Para cumplir con la restricción `NOT NULL` de la columna de cédula/documento (`doc_id`), se autogenera un identificador transitorio: `WEB-` concatenado con una estampa temporal (Ej: `WEB-854132`). El administrador luego puede actualizarlo.

---

## 5. Consulta de Pre-reserva por Correo Electrónico (Nueva Funcionalidad)

Para permitir que el cliente consulte el estado de su pre-reserva de manera autónoma sin necesidad de contactar directamente a administración en primera instancia, se ha habilitado un flujo de consulta directa desde la web.

### 5.1. Flujo de Datos
1. **Cliente Web:** Ingresa su correo electrónico en la pestaña de "Consultar Estado" en el Planificador del sitio web (`application-website`).
2. **Petición API:** El frontend realiza una petición asíncrona `GET /api/events/website/status?email=<correo_cliente>`.
3. **Servicio Backend:** 
   - Limpia el parámetro del correo (normaliza a minúsculas y elimina espacios extras).
   - Busca al cliente por su correo en la tabla `clients`.
   - Si no lo encuentra, retorna un JSON `{ client: null, events: [] }` con estado 200 OK (esto previene exponer si un correo existe o no).
   - Si lo encuentra, recupera todos los eventos asociados con su `client_id` (incluyendo el nombre del salón mapeado desde la tabla `venues`).
4. **Respuesta y Formateo:** Retorna un objeto con la información simplificada y filtrada para proteger los datos internos de la empresa.
5. **UI en el Cliente:** Muestra un saludo personalizado con el nombre del cliente y un listado de sus pre-reservas con su tipo, salón, fecha (corrigiendo la zona horaria UTC a local para evitar saltos de día) y badges de estado coloreados según corresponda.

### 5.2. Especificación del Endpoint de Consulta
* **Método:** `GET`
* **Ruta:** `/api/events/website/status`
* **Query Params:**
  * `email` (String, obligatorio): El correo electrónico del cliente.
* **Ejemplo de Respuesta Exitosa (200 OK):**
  ```json
  {
    "client": {
      "name": "Juan",
      "last_name": "Pérez"
    },
    "events": [
      {
        "event_id": 42,
        "start_date": "2026-06-04T20:00:00.000Z",
        "end_date": "2026-06-05T03:00:00.000Z",
        "type_event": "Bodas",
        "status": "Pending",
        "venue": "Salón Principal"
      }
    ]
  }
  ```

