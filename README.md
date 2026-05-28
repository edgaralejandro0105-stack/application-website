# La Casona - Aplicación y Sitio Web

Este es el repositorio del sitio web y aplicación para **La Casona**, un proyecto moderno construido con [React](https://reactjs.org/) y [Vite](https://vitejs.dev/), diseñado para ofrecer una experiencia de usuario fluida, dinámica y altamente atractiva.

## 🚀 Características Principales

El proyecto está dividido en componentes modulares, permitiendo una fácil escalabilidad y mantenimiento:

- **Sección Hero (Inicio)**: La primera impresión visual del sitio web con llamadas a la acción (CTAs).
- **Áreas**: Información detallada sobre los distintos espacios disponibles en La Casona.
- **Productos & Servicios**: Catálogo de productos y servicios ofrecidos.
- **Galería**: Muestra visual de eventos, instalaciones y experiencias.
- **Planificador de Eventos (Planner)**: Interfaz diseñada para ayudar a los usuarios a planificar y organizar eventos.

## 🛠 Tecnologías Utilizadas

- **Framework**: React 19
- **Bundler**: Vite
- **Estilos**: Tailwind CSS
- **Iconografía**: Lucide React
- **Linter**: ESLint

## 📁 Estructura del Proyecto

El código fuente se encuentra organizado dentro de la carpeta `src/`:

```plaintext
src/
├── assets/         # Imágenes, iconos y otros archivos estáticos.
├── components/     # Componentes reutilizables de UI (Botones, Tarjetas, Footer, Navbar).
├── sections/       # Secciones principales de la página (Hero, Áreas, Galería, etc.).
├── App.jsx         # Componente principal que unifica todas las secciones.
├── main.jsx        # Punto de entrada de la aplicación React.
└── index.css       # Estilos globales y configuración de Tailwind CSS.
```

## ⚙️ Instalación y Ejecución

Sigue estos pasos para ejecutar el proyecto en tu entorno local:

1. **Clonar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd application-website
   ```

2. **Instalar las dependencias:**
   Asegúrate de tener Node.js instalado, luego ejecuta:
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Esto levantará el proyecto localmente (generalmente en `http://localhost:5173/`).

4. **Construir para producción:**
   ```bash
   npm run build
   ```
   Los archivos optimizados para producción se generarán en la carpeta `dist/`.

## 📜 Scripts Disponibles

En el directorio del proyecto, puedes ejecutar los siguientes comandos:

- `npm run dev`: Inicia el servidor de desarrollo Vite.
- `npm run build`: Construye la aplicación para producción.
- `npm run preview`: Sirve la carpeta construida de forma local para probar la versión de producción.
- `npm run lint`: Ejecuta el linter (ESLint) para verificar problemas en el código.
