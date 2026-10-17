# Magios 2.0 – TurnoFlex

## Proyecto Backend – Segundo Parcial

TurnoFlex es una API REST desarrollada con Node.js y Express para gestionar profesionales, clientes y turnos de un centro de atención.

El proyecto busca resolver los problemas de la administración manual de turnos, como las reservas duplicadas, los conflictos de horarios y las dificultades para consultar o cancelar reservas.

La segunda etapa del desarrollo incorpora como objetivo la persistencia de datos mediante MongoDB y Mongoose, reemplazando el almacenamiento inicial en archivos JSON.

## Etapas de desarrollo del proyecto

El proyecto **Magios 2.0 – TurnoFlex** se desarrolló en distintas etapas, siguiendo los contenidos trabajados durante la cursada de Desarrollo Web Backend.

Cada etapa permitió ampliar las funcionalidades del sistema, mejorar su organización e incorporar nuevas herramientas para la gestión y persistencia de la información.

### Etapa 1 – Desarrollo inicial de la API REST (Primer Parcial)

En la primera entrega se desarrolló la estructura inicial del backend utilizando **Node.js y Express**.

El objetivo fue construir una API REST funcional para administrar profesionales, clientes y turnos, aplicando los conceptos de rutas, controladores, servicios y métodos HTTP.

**Trabajos realizados:**

- Configuración inicial del proyecto con Node.js y Express.
- Organización del código en rutas, controladores, servicios y modelos.
- Implementación de operaciones CRUD para profesionales y clientes.
- Desarrollo de funcionalidades para registrar, consultar y modificar turnos.
- Incorporación de validaciones de datos y reglas de negocio.
- Implementación de filtros de búsqueda.
- Manejo de errores mediante respuestas HTTP.
- Persistencia inicial de la información mediante archivos JSON.

**Resultado:** una primera versión funcional del backend, con endpoints para administrar las principales entidades del sistema.

### Etapa 2 – Integración de MongoDB (Segundo Parcial)

La segunda etapa tiene como objetivo evolucionar el backend inicial mediante la incorporación de una base de datos NoSQL.

Se trabaja con **MongoDB y Mongoose** para reemplazar la persistencia basada en archivos JSON y permitir que los datos se almacenen en colecciones.

**Trabajos correspondientes a esta etapa:**

- Configuración de la conexión entre Node.js y MongoDB.
- Incorporación de Mongoose al proyecto.
- Creación de esquemas y modelos para profesionales, clientes y turnos.
- Implementación de referencias entre documentos.
- Adaptación de las operaciones CRUD para utilizar MongoDB.
- Incorporación de operaciones asincrónicas mediante async/await.
- Adaptación de validaciones y reglas de negocio a la nueva persistencia.
- Revisión del manejo de errores y de las respuestas HTTP.
- Comprobación de la persistencia de datos después de reiniciar el servidor.

**Resultado esperado:** una API REST que conserve las funcionalidades de la primera entrega, utilizando MongoDB como sistema de almacenamiento.

### Etapa 3 – Pruebas, documentación y entrega final

La última etapa está destinada a comprobar el funcionamiento del proyecto y preparar el material necesario para su presentación.

**Actividades:**

- Pruebas de endpoints mediante Postman o Thunder Client.
- Verificación de operaciones CRUD.
- Pruebas de reservas duplicadas y conflictos de horarios.
- Comprobación de cancelaciones y cambios de estado.
- Revisión de las respuestas HTTP ante datos inválidos.
- Elaboración de la documentación técnica.
- Diseño del diagrama de funcionalidad del sistema.
- Actualización del README del repositorio.
- Preparación de un video explicativo del proyecto.
- Organización de los archivos y enlaces de la entrega final.

**Resultado esperado:** una versión documentada y verificada del backend, acompañada por las evidencias necesarias para su evaluación.

## Evolución tecnológica del proyecto

| Característica | Primera entrega | Segunda entrega |
|---|---|---|
| Entorno | Node.js | Node.js |
| Framework | Express | Express |
| Arquitectura | Modular | Modular |
| Persistencia | Archivos JSON | MongoDB |
| Modelos | Modelos JavaScript | Esquemas Mongoose |
| Operaciones CRUD | Sobre archivos JSON | Sobre MongoDB |
| Reglas de negocio | Validaciones iniciales | Validaciones adaptadas |
| Asincronismo | Implementación inicial | Async/await con Mongoose |
| Pruebas | Endpoints de la API | Endpoints y persistencia |
| Documentación | README inicial | README y documentación técnica |

## Integrantes y responsabilidades

- **Franco Perrone Rey:** estructura general del backend, configuración de Express, rutas y controladores.
- **David Fernando Giannoni:** gestión de profesionales y clientes, operaciones CRUD y validaciones.
- **Carlos Sebastian Gauto Martina:** integración de MongoDB y Mongoose, modelos y lógica de reservas.
- **Damián Gorosito:** documentación técnica, diagramas, descripción de endpoints, registro de pruebas y preparación de la entrega final.

El trabajo se organiza de manera colaborativa, con responsabilidades distribuidas entre los integrantes y revisiones conjuntas para integrar las distintas partes del sistema.

## Tecnologías utilizadas

- **Node.js:** ejecución de JavaScript en el servidor.
- **Express:** desarrollo de la API REST.
- **MongoDB:** base de datos NoSQL para la persistencia de información, prevista para la segunda entrega.
- **Mongoose:** definición de esquemas y modelos para MongoDB, prevista para la segunda entrega.
- **Pug:** plantilla utilizada para la ruta de inicio.
- **Postman o Thunder Client:** pruebas de los endpoints.
- **Git y GitHub:** control de versiones y repositorio del proyecto.

## Instalación y ejecución

### Requisitos

- Node.js y npm.
- MongoDB instalado y funcionando, una vez integrada la segunda entrega.
- Un editor de código, como Visual Studio Code.

### Instalación de dependencias

Clonar el repositorio:

`git clone https://github.com/fraperrone/magios2.0-back-tp.git`

Ingresar a la carpeta del proyecto:

`cd magios2.0-back-tp`

Instalar dependencias:

`npm install`

### Configuración de MongoDB

Una vez implementada la conexión, configurar la URI de MongoDB según el archivo de configuración del proyecto.

Ejemplo de conexión local:

`mongodb://127.0.0.1:27017/turnoflex`

No publicar contraseñas ni archivos con credenciales reales en GitHub.

### Iniciar el servidor

`node index.js`

Para utilizar Nodemon:

`npx nodemon index.js`

La API se encuentra disponible en:

`http://localhost:3000`

## Arquitectura del proyecto

El backend está organizado en módulos que separan las distintas responsabilidades:

- **Rutas:** definen los endpoints y métodos HTTP.
- **Controladores:** procesan las solicitudes y generan las respuestas.
- **Servicios:** administran las operaciones y reglas de negocio.
- **Modelos:** representan los datos del sistema.
- **Middlewares:** procesan solicitudes y administran errores.

La segunda etapa requiere adaptar las operaciones de persistencia para trabajar con MongoDB mediante Mongoose y async/await.

## Modelo de datos

El sistema contempla tres entidades principales.

### Profesional

Representa a una persona que brinda atención. Sus datos incluyen nombre, apellido, correo electrónico, teléfono, especialidad y matrícula.

### Cliente

Representa a una persona que solicita turnos. Sus datos incluyen nombre, correo electrónico y teléfono.

### Turno

Representa una reserva asociada a un profesional y un cliente. Contiene fecha, hora y estado.
El esquema Mongoose usa referencias a `Profesional` y `Cliente`, valida los formatos de fecha y hora y restringe los estados permitidos. Los índices impiden reservas activas duplicadas por profesional o cliente.

Los estados permitidos son:

- `reservado`
- `cancelado`
- `atendido`

En la segunda entrega, las relaciones entre turnos, profesionales y clientes deben implementarse mediante referencias a documentos de MongoDB.

## Endpoints de la API

Todas las solicitudes que envían datos deben utilizar `Content-Type: application/json`.

### Profesionales

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/profesionales` | Consultar profesionales |
| GET | `/profesionales/:id` | Consultar por ID |
| POST | `/profesionales` | Registrar profesional |
| PUT | `/profesionales/:id` | Modificar profesional |
| DELETE | `/profesionales/:id` | Eliminar profesional |

Ejemplo de solicitud POST:

```json
{
  "nombre": "Laura",
  "apellido": "Gómez",
  "email": "laura.gomez@mail.com",
  "telefono": "1122334455",
  "especialidad": "Clínica",
  "matricula": "MP-90001"
}
```

### Clientes

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/clientes` | Consultar clientes |
| GET | `/clientes/:id` | Consultar por ID |
| POST | `/clientes` | Registrar cliente |
| PUT | `/clientes/:id` | Modificar cliente |
| DELETE | `/clientes/:id` | Eliminar cliente |

Ejemplo de solicitud POST:

```json
{
  "nombre": "Ana Martínez",
  "email": "ana.martinez@mail.com",
  "telefono": "1122334466"
}
```

### Turnos

Para ver los pasos detallados de configuración y cada caso de prueba en Postman, consulta el [Instructivo de pruebas de turnos](./POSTMAN-TURNOS.md).

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/turnos` | Consultar turnos |
| POST | `/turnos` | Registrar reserva |
| PATCH | `/turnos/:id/estado` | Modificar estado |
| PUT | `/turnos/:id` | Modificar estado (ruta compatible) |
| GET | `/cancelaciones` | Consultar cancelaciones |
| POST | `/cancelaciones` | Cancelar un turno registrando el motivo y la fecha/hora de cancelación |

Ejemplo de solicitud POST:

```json
{
  "profesionalId": "507f1f77bcf86cd799439011",
  "clienteId": "507f1f77bcf86cd799439012",
  "fecha": "2026-10-15",
  "hora": "14:00"
}
```

`profesionalId` y `clienteId` deben ser ObjectId existentes en MongoDB. Los identificadores numéricos de `data/turnos.json` pertenecen a la primera entrega y no se importan automáticamente.

Ejemplo de cancelación:

`PATCH /turnos/:id/estado`

```json
{
  "estado": "cancelado"
}
```

Para registrar también los datos de la cancelación, `POST /cancelaciones` recibe:

```json
{
  "id_turno": "507f1f77bcf86cd799439013",
  "motivo": "El paciente no puede asistir",
  "fecha_cancelacion": "2026-10-14",
  "hora_cancelacion": "10:30"
}
```

Los registros de cancelación se persisten en MongoDB mediante el modelo Mongoose `Cancelacion`, relacionado con `Turno` por `id_turno`. Cada turno puede tener un único registro de cancelación; los motivos se guardan saneados y deben tener entre 5 y 300 caracteres. El archivo `data/cancelaciones.json` queda como dato legado y ya no es utilizado por la API.

### Filtros de consulta

El endpoint `GET /turnos` permite filtrar por:

- Profesional: `/turnos?profesionalId=507f1f77bcf86cd799439011`
- Cliente y estado: `/turnos?clienteId=507f1f77bcf86cd799439012&estado=reservado`
- Fecha: `/turnos?fecha=2026-10-15`

Los datos de turnos nuevos se guardan en MongoDB mediante el esquema Mongoose.

## Reglas de negocio

El sistema debe respetar las siguientes reglas:

1. Un profesional no puede tener dos turnos reservados en el mismo horario.
2. Un cliente no puede reservar dos turnos iguales.
3. Solo pueden reservarse horarios disponibles.
4. Los turnos admiten los estados reservado, cancelado y atendido.
5. La cancelación modifica el estado del turno sin eliminar su registro.
6. Las reservas deben relacionarse con profesionales y clientes existentes.

## Validaciones y respuestas HTTP

La API valida campos obligatorios, tipos de datos, formatos de correo electrónico, fechas, horarios y estados permitidos.

Las respuestas HTTP utilizadas son:

| Código | Significado |
|---|---|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 204 | Eliminación exitosa |
| 400 | Datos inválidos |
| 404 | Recurso inexistente |
| 409 | Conflicto de reserva |
| 500 | Error interno del servidor |

Ejemplo de respuesta de error:

```json
{
  "error": "El profesional indicado no existe"
}
```

## Pruebas del sistema

Las pruebas se realizan mediante Postman o Thunder Client.

Casos principales:

1. Registrar un profesional.
2. Registrar un cliente.
3. Consultar profesionales y clientes.
4. Reservar un turno disponible.
5. Intentar registrar un turno duplicado.
6. Intentar reservar con un profesional inexistente.
7. Consultar turnos mediante filtros.
8. Cancelar un turno.
9. Enviar datos inválidos.
10. Verificar la persistencia de datos después de reiniciar el servidor.

Las evidencias y resultados de las pruebas se incorporan a la documentación técnica final.

## Documentación complementaria

- **Documentación técnica en PDF:** [Agregar enlace]
- **Diagrama de funcionalidad:** [Agregar enlace]
- **Video de presentación:** [Agregar enlace]
- **Documento de entrega:** [Agregar enlace de Google Drive]

## Bibliografía

Material proporcionado por el docente:

- MongoDB – Ejemplos de Colecciones.
- MongoDB – Operaciones CRUD v3.
- Anotaciones clases 2 de MongoDB.
- MongoDB – Operadores Básicos Genérico.

Documentación oficial de las tecnologías utilizadas:

- https://nodejs.org/
- https://expressjs.com/
- https://www.mongodb.com/docs/
- https://mongoosejs.com/docs/

## Repositorio

https://github.com/fraperrone/magios2.0-back-tp
