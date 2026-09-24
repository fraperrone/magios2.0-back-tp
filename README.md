# Magios 2.0 - TurnoFlex

Backend de una API REST para gestionar turnos de un centro de atención. La
aplicación permite administrar profesionales, clientes y reservas, persistiendo
los datos en archivos JSON (en esta primera instancia no se utiliza MongoDB).

## Integrantes y responsabilidades

* **Franco Perrone Rey:** Desarrollador de estructura general de proyecto, de la entidad profesionales su CRUD, de las reglas especificas del negocio y pruebas/ queries en postman.
* **Carlos Sebastián Gauto Martina:** Programador de CRUD y lógica de la disponibilidad horaria y sus pruebas en Postman.
* **David Fernando Giannoni:** Programador de consultas con filtros, pruebas de integración y documentación.
* **Damian Gorosito:** Programador de CRUD y lógica del módulo de turnos, actualización de estados y sus pruebas en Postman.

## Tecnologías

- Node.js
- Express
- Pug para la ruta de inicio
- JSON como persistencia

## Instalación y ejecución

```bash
npm install
node index.js
```

Para ejecutar con recarga automática:

```bash
npx nodemon index.js
```

La API queda disponible en `http://localhost:3000`.

## Recursos y endpoints

Todos los cuerpos deben enviarse como `Content-Type: application/json`.

### Profesionales

| Método | URL | Descripción |
|---|---|---|
| GET | `/profesionales` | Lista profesionales. |
| GET | `/profesionales/:id` | Obtiene un profesional por ID. |
| POST | `/profesionales` | Crea un profesional. |
| PUT | `/profesionales/:id` | Reemplaza los datos de un profesional. |
| DELETE | `/profesionales/:id` | Elimina un profesional. |

Ejemplo de `POST /profesionales`:

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

| Método | URL | Descripción |
|---|---|---|
| GET | `/clientes` | Lista clientes. |
| GET | `/clientes/:id` | Obtiene un cliente por ID. |
| POST | `/clientes` | Crea un cliente. |
| PUT | `/clientes/:id` | Actualiza un cliente. |
| DELETE | `/clientes/:id` | Elimina un cliente. |

Ejemplo de `POST /clientes`:

```json
{
  "nombre": "Ana Martínez",
  "email": "ana.martinez@mail.com",
  "telefono": "1122334466"
}
```

### Turnos

| Método | URL | Descripción |
|---|---|---|
| GET | `/turnos` | Lista turnos. |
| POST | `/turnos` | Reserva un turno. |
| PATCH | `/turnos/:id/estado` | Cambia el estado del turno. |

Body de `POST /turnos`:

```json
{
  "profesionalId": 2,
  "clienteId": 1,
  "fecha": "2026-10-15",
  "hora": "14:00"
}
```

Body de `PATCH /turnos/1/estado`:

```json
{
  "estado": "cancelado"
}
```

Estados permitidos: `reservado`, `cancelado` y `atendido`.

## Consultas

El listado de turnos admite filtros combinables:

- `GET /turnos?profesionalId=2`
- `GET /turnos?clienteId=1&estado=reservado`
- `GET /turnos?fecha=2026-10-15`

También se pueden consultar recursos individuales con `GET
/profesionales/:id` y `GET /clientes/:id`.

## Validaciones y manejo de errores (punto 4)

- Se validan campos obligatorios, tipos de datos, formato de email, IDs,
  fechas reales (`YYYY-MM-DD`), horas (`HH:MM`) y estados permitidos.
- Al reservar se verifica que existan el profesional y el cliente relacionados.
- No se permiten turnos reservados superpuestos para un profesional ni dos
  turnos del mismo cliente en la misma fecha y hora.
- `400` indica datos o parámetros inválidos.
- `404` indica que el recurso o relación solicitada no existe.
- `409` indica conflicto con una regla de negocio.
- `500` indica un error interno y `204` confirma una eliminación exitosa.
- Las rutas inexistentes y los cuerpos JSON mal formados devuelven mensajes
  claros.

Ejemplo de error:

```json
{
  "error": "El profesional indicado no existe"
}
```

## Pruebas con Postman o Thunder Client

Pruebas mínimas sugeridas:

1. `POST /clientes` con datos válidos: debe responder `201`.
2. `POST /turnos` con IDs existentes: debe responder `201`.
3. Repetir el turno anterior: debe responder `409`.
4. `POST /turnos` con un ID inexistente: debe responder `404`.
5. `PATCH /turnos/1/estado` con `estado: "cancelado"`: debe responder `200`.
6. Enviar una fecha, email o estado inválido: debe responder `400`.

La evidencia de ejecución debe incorporarse a la entrega como captura de
Postman o Thunder Client mostrando la URL, método, body y respuesta.
