import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { cambiarEstado, crearTurno } from "../controllers/turnos.controller.js";
import Turno from "../models/Turno.model.js";
import Profesional from "../models/Profesional.model.js";
import Cliente from "../models/Cliente.model.js";
import Disponibilidad from "../models/DisponibilidadHoraria.model.js";

const MONGO_TEST = "mongodb://127.0.0.1:27017/turnosdb_test_turnos";

function crearRespuesta() {
  return {
    statusCode: 200,
    body: null,
    status(codigo) {
      this.statusCode = codigo;
      return this;
    },
    json(datos) {
      this.body = datos;
      return this;
    },
  };
}

const crearTurnoDoc = (estado) =>
  Turno.create({
    profesionalId: new mongoose.Types.ObjectId(),
    clienteId: new mongoose.Types.ObjectId(),
    fecha: "2026-10-15",
    hora: "14:00",
    estado,
  });

const datosProfesional = {
  nombre: "Ana",
  apellido: "Torres",
  email: "ana.turnos@mail.com",
  telefono: "1155550101",
  especialidad: "Kinesiologia",
  matricula: "KT-9001",
};

const datosCliente = {
  nombre: "Juan",
  email: "juan.turnos@mail.com",
  telefono: "1122334455",
};

before(async () => {
  await mongoose.connect(MONGO_TEST);
  await mongoose.connection.dropDatabase();
  await Promise.all([
    Turno.init(),
    Profesional.init(),
    Cliente.init(),
    Disponibilidad.init(),
  ]);
});

beforeEach(async () => {
  await Promise.all([
    Turno.deleteMany({}),
    Profesional.deleteMany({}),
    Cliente.deleteMany({}),
    Disponibilidad.deleteMany({}),
  ]);
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test("PATCH permite reservado → atendido (200)", async () => {
  const turno = await crearTurnoDoc("reservado");
  const res = crearRespuesta();

  await cambiarEstado(
    { params: { id: String(turno._id) }, body: { estado: "atendido" } },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.turno.estado, "atendido");
});

test("PATCH rechaza reservado → cancelado (409)", async () => {
  const turno = await crearTurnoDoc("reservado");
  const res = crearRespuesta();

  await cambiarEstado(
    { params: { id: String(turno._id) }, body: { estado: "cancelado" } },
    res
  );

  assert.equal(res.statusCode, 409);
  assert.match(res.body.error, /POST \/api\/cancelaciones/);
});

test("PATCH rechaza cancelado → atendido (409)", async () => {
  const turno = await crearTurnoDoc("cancelado");
  const res = crearRespuesta();

  await cambiarEstado(
    { params: { id: String(turno._id) }, body: { estado: "atendido" } },
    res
  );

  assert.equal(res.statusCode, 409);
});

test("PATCH rechaza atendido → reservado (409)", async () => {
  const turno = await crearTurnoDoc("atendido");
  const res = crearRespuesta();

  await cambiarEstado(
    { params: { id: String(turno._id) }, body: { estado: "reservado" } },
    res
  );

  assert.equal(res.statusCode, 409);
});

test("PATCH rechaza reservado → reservado (409)", async () => {
  const turno = await crearTurnoDoc("reservado");
  const res = crearRespuesta();

  await cambiarEstado(
    { params: { id: String(turno._id) }, body: { estado: "reservado" } },
    res
  );

  assert.equal(res.statusCode, 409);
});

test("PATCH devuelve 404 si el turno no existe", async () => {
  const res = crearRespuesta();

  await cambiarEstado(
    { params: { id: "64b000000000000000000000" }, body: { estado: "atendido" } },
    res
  );

  assert.equal(res.statusCode, 404);
});

test("PATCH devuelve 400 si el ID no es válido", async () => {
  const res = crearRespuesta();

  await cambiarEstado(
    { params: { id: "no-es-id" }, body: { estado: "atendido" } },
    res
  );

  assert.equal(res.statusCode, 400);
});

test("POST rechaza turno si el profesional no tiene franjas (400)", async () => {
  const profesional = await Profesional.create(datosProfesional);
  const cliente = await Cliente.create(datosCliente);

  const res = crearRespuesta();
  await crearTurno(
    {
      body: {
        profesionalId: String(profesional._id),
        clienteId: String(cliente._id),
        fecha: "2026-10-15",
        hora: "14:00",
      },
    },
    res
  );

  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /disponibilidad/);
});

test("POST acepta turno dentro de una franja (201)", async () => {
  const profesional = await Profesional.create(datosProfesional);
  const cliente = await Cliente.create(datosCliente);

  await Disponibilidad.create({
    profesionalId: profesional._id,
    dia: "jueves",
    horaInicio: "13:00",
    horaFin: "15:00",
  });

  const res = crearRespuesta();
  await crearTurno(
    {
      body: {
        profesionalId: String(profesional._id),
        clienteId: String(cliente._id),
        fecha: "2026-10-15",
        hora: "14:00",
      },
    },
    res
  );

  assert.equal(res.statusCode, 201);
  assert.equal(res.body.turno.estado, "reservado");
});