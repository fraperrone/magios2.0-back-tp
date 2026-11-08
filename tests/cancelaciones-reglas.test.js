import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { createCancelacion } from "../controllers/cancelaciones.controller.js";
import Turno from "../models/Turno.model.js";
import Cancelacion from "../models/Cancelacion.model.js";

const MONGO_TEST = "mongodb://127.0.0.1:27017/turnosdb_test_cancel";

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

const bodyCancelacion = (idTurno) => ({
  id_turno: String(idTurno),
  motivo: "Paciente no puede asistir",
  fecha_cancelacion: "2026-10-14",
  hora_cancelacion: "10:30",
});

before(async () => {
  await mongoose.connect(MONGO_TEST);
  await mongoose.connection.dropDatabase();
  await Promise.all([Turno.init(), Cancelacion.init()]);
});

beforeEach(async () => {
  await Promise.all([
    Cancelacion.deleteMany({}),
    Turno.deleteMany({}),
  ]);
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test("POST cancela un turno reservado (201)", async () => {
  const turno = await crearTurnoDoc("reservado");
  const res = crearRespuesta();

  await createCancelacion({ body: bodyCancelacion(turno._id) }, res);

  assert.equal(res.statusCode, 201);
  assert.equal(String(res.body.id_turno), String(turno._id));

  const turnoActualizado = await Turno.findById(turno._id);
  assert.equal(turnoActualizado.estado, "cancelado");
  assert.equal(
    await Cancelacion.countDocuments({ id_turno: turno._id }),
    1
  );
});

test("POST rechaza una cancelación duplicada (409)", async () => {
  const turno = await crearTurnoDoc("reservado");

  await Cancelacion.create({
    id_turno: turno._id,
    motivo: "Paciente no puede asistir",
    fecha_cancelacion: "2026-10-14",
    hora_cancelacion: "10:30",
  });

  const res = crearRespuesta();
  await createCancelacion({ body: bodyCancelacion(turno._id) }, res);

  assert.equal(res.statusCode, 409);
  assert.match(res.body.message, /Ya existe una cancelación/);
});

test("POST rechaza cancelar un turno ya cancelado (409)", async () => {
  const turno = await crearTurnoDoc("cancelado");
  const res = crearRespuesta();

  await createCancelacion({ body: bodyCancelacion(turno._id) }, res);

  assert.equal(res.statusCode, 409);
  assert.match(res.body.message, /ya está cancelado/);
});

test("POST rechaza cancelar un turno atendido (409)", async () => {
  const turno = await crearTurnoDoc("atendido");
  const res = crearRespuesta();

  await createCancelacion({ body: bodyCancelacion(turno._id) }, res);

  assert.equal(res.statusCode, 409);
  assert.match(res.body.message, /atendido/);
});

test("POST rechaza una segunda cancelación del mismo turno (409)", async () => {
  const turno = await crearTurnoDoc("reservado");

  await createCancelacion(
    { body: bodyCancelacion(turno._id) },
    crearRespuesta()
  );

  const res = crearRespuesta();
  await createCancelacion({ body: bodyCancelacion(turno._id) }, res);

  assert.equal(res.statusCode, 409);
});

test("POST devuelve 404 si el turno no existe", async () => {
  const res = crearRespuesta();

  await createCancelacion(
    { body: bodyCancelacion(new mongoose.Types.ObjectId()) },
    res
  );

  assert.equal(res.statusCode, 404);
});

test("POST devuelve 400 si id_turno no es válido", async () => {
  const res = crearRespuesta();

  await createCancelacion({ body: bodyCancelacion("no-es-id") }, res);

  assert.equal(res.statusCode, 400);
  assert.match(res.body.message, /ObjectId/);
});