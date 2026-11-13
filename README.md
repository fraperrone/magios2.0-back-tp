# Magios 2.0 – TurnoFlex

TurnoFlex es una API REST desarrollada con Node.js y Express para gestionar profesionales, clientes y turnos de un centro de atención.

El proyecto busca resolver los problemas de la administración manual de turnos, como las reservas duplicadas, los conflictos de horarios y las dificultades para consultar o cancelar reservas.

## Evolución tecnológica del proyecto (Matriz de 3 entregas)

| Característica | Primera entrega | Segunda entrega | Tercera entrega (Final) |
|---|---|---|---|
| **Entorno** | Node.js | Node.js | Node.js |
| **Framework** | Express | Express | Express |
| **Arquitectura** | Modular (MVC) | Modular (MVC) | Modular estricto (Separación API / Vistas) |
| **Persistencia** | Archivos JSON locales | MongoDB (Mongoose) | MongoDB Atlas (Cloud) |
| **Modelos** | Modelos JavaScript | Esquemas Mongoose | Esquemas Mongoose validados |
| **Seguridad** | Ninguna | Ninguna | Autenticación JWT, cookies, protección de rutas |
| **Roles de usuario** | N/A | N/A | Roles diferenciados (ej. `admin`, `operador`) |
| **Operaciones** | CRUD sobre JSON | CRUD sobre MongoDB | CRUD sobre MongoDB Atlas |
| **Interfaz (UI)** | Ninguna | Ninguna | Vistas dinámicas con Pug + Vista 404 |
| **Deploy** | Local | Local | Render.com |
| **Carga inicial** | N/A | N/A | Script automatizado (`seed.js`) |
| **Testing** | Postman local | Postman local | Tests automatizados (`npm test` 8/8) |

## Despliegue en Producción (Deploy)

El proyecto se encuentra desplegado y accesible públicamente:
- **Hosting del servidor:** https://magios2-0-back-tp.onrender.com

### Rutas principales en Render:
- **Acceso a la interfaz web (Login):** `https://magios2-0-back-tp.onrender.com/vista/login`
- **URL Base de la API (Endpoints de datos):** `https://magios2-0-back-tp.onrender.com/api`

**Credenciales de acceso (Prueba):**
- **Usuario (Admin):** `admin`
- **Contraseña:** `admin1234`

## Arquitectura y Rutas

El backend está organizado separando estrictamente la provisión de datos de las interfaces de usuario:
- **Endpoints de datos (API REST):** Todas las rutas que retornan o manipulan datos en formato JSON están bajo el prefijo `/api` (ej. `/api/turnos`, `/api/profesionales`).
- **Interfaces de usuario (Vistas):** Las rutas que devuelven HTML renderizado por el servidor mediante **Pug** se agrupan bajo el prefijo `/vista` (ej. `/vista/login`).
- **Manejo de errores (404):** Se incluye una vista 404 personalizada para manejar cualquier solicitud a URLs inexistentes de forma amigable.

## Modelo de datos

El sistema contempla tres entidades principales (usando `ObjectId` de Mongoose):

- **Profesional:** Nombre, apellido, correo, teléfono, especialidad y matrícula.
- **Cliente:** Nombre, correo electrónico y teléfono.
- **Turno:** Reserva que asocia a un profesional y un cliente en una fecha y hora.
    - *Estados permitidos:* `reservado`, `cancelado`, `atendido`.
- **Cancelaciones (Entidad anexa):** Un registro que guarda el motivo (5 a 300 caracteres) y la fecha de cancelación de un turno sin eliminar el registro original.

## Reglas de negocio principales

1. Un profesional no puede tener dos turnos reservados en el mismo horario.
2. Un cliente no puede reservar dos turnos iguales en el mismo horario.
3. Solo pueden reservarse horarios disponibles.
4. La cancelación de un turno modifica su estado, pero no elimina su registro en la base de datos.
5. Las reservas deben asociarse obligatoriamente a IDs existentes de profesionales y clientes en MongoDB.

## Instalación y ejecución local

### Requisitos

- Node.js y npm.
- Un editor de código (ej. VS Code).

### Pasos

1. Clonar el repositorio:
   ```bash
   git clone [https://github.com/fraperrone/magios2.0-back-tp.git](https://github.com/fraperrone/magios2.0-back-tp.git)