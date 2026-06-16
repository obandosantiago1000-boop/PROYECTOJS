# 🚀 Sistema de Gestión: Proyectos, Usuarios y Rutas

> Una aplicación web dinámica orientada a la manipulación del DOM, componentes modulares y persistencia de datos.

---

## 📝 Descripción del Proyecto

Este proyecto es una plataforma interactiva diseñada para la administración de diversas entidades, integrando funcionalidades de gestión avanzada del DOM, *Web Components* personalizados y persistencia mediante `localStorage`.

---

## 🛠️ Tecnologías y Herramientas

| Categoría     | Tecnologías |
| ------------- | ----------- |
| **Frontend**  | HTML5, CSS3, JavaScript (ES6+) |
| **Componentes** | *Web Components* (`customElements`, `Shadow DOM`) |
| **Persistencia** | `localStorage` |
| **Servicios** | *OpenWeatherMap API* (integración asíncrona) |

---

## ⚡ Funcionalidades Clave

### 1. Manipulación Dinámica del DOM
- Registro de nuevos proyectos mediante formularios con opciones para insertar al inicio, al final o en posiciones específicas.
- Gestión avanzada: reemplazo del primer proyecto, eliminación con `removeChild`, vaciado total de listas.
- Navegación por la jerarquía del DOM para consultar cantidad de elementos, identificar nodos padre/hermanos y verificar el primer o último proyecto.

### 2. Componentes Web y Estructura
- Implementación de componentes personalizados (`ArticleCard`, `ConductorCard`) con *Shadow DOM* para encapsular estilos y estructura.
- Los componentes gestionan estados de edición y eliminación, emitiendo eventos personalizados para notificar cambios.

### 3. Lógica de Negocio y Seguridad
- **Gestión de Rutas:** Filtrado de estudiantes asignados a rutas específicas según "Zona" y "Jornada", con actualizaciones automáticas.
- **Control de Acceso:** Entrada de contraseñas mediante `prompt` para navegar entre módulos o realizar ediciones protegidas.
- **Integración API:** Obtención y visualización de información climática en tiempo real para Ipiales usando `fetch` y `async/await`.

---

## 📊 Persistencia de Datos
- Toda la información (proyectos, estudiantes, conductores) se sincroniza con el almacenamiento local del navegador.
- Las ediciones o eliminaciones actualizan el estado persistente, garantizando integridad en futuras sesiones.

---
# Capturas del proyecto

![Captura 1](/PROYECTOJS/capturas/1.png)
![Captura 2](/PROYECTOJS/capturas/2.png)
![Captura 3](/PROYECTOJS/capturas/3.png)
![Captura 4](/PROYECTOJS/capturas/4.png)
![Captura 5](/PROYECTOJS/capturas/5.png)
![Captura 6](/PROYECTOJS/capturas/6.png)
![Captura 7](/PROYECTOJS/capturas/7.png)

