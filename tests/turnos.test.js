import assert from "node:assert/strict";
import { test } from "node:test";
import mongoose from "mongoose";
import { cambiarEstado, crearTurno, obtenerTurnos } from "../controllers/turnos.controller.js";
import { createCancelacion, sanitizarMotivoCancelacion } from "../controllers/cancelaciones.controller.js";
import Cancelacion from "../models/Cancelacion.model.js";
import Turno from "../models/Turno.model.js";

const crearTurnoValido = (overrides = {}) => new Turno({
  profesionalId: new mongoose.Types.ObjectId(),
  clienteId: new mongoose.Types.ObjectId(),
  fecha: "2026-10-15",
  hora: "14:00",
  estado: "reservado",
  ...overrides
});

const crearResponse = () => ({
  statusCode: 200,
  body: undefined,
  status(code) {
    this.statusCode = code;
    return this;
  },
  json(body) {
    this.body = body;
    return this;
  }
});

test("El esquema valida una reserva y sus referencias", async () => {
  const turno = crearTurnoValido();

  await turno.validate();
  assert.equal(Turno.schema.path("profesionalId").options.ref, "Profesional");
  assert.equal(Turno.schema.path("clienteId").options.ref, "Cliente");
});

test("El esquema rechaza fecha, hora y estado inválidos", async () => {
  for (const [field, value] of [
    ["fecha", "2026-02-30"],
    ["hora", "25:99"],
    ["estado", "pendiente"]
  ]) {
    await assert.rejects(
      crearTurnoValido({ [field]: value }).validate(),
      (error) => Boolean(error.errors[field])
    );
  }
});

test("El esquema protege las reservas activas contra duplicados", () => {
  const reservationIndexes = Turno.schema.indexes().filter(([, options]) =>
    options.unique && options.partialFilterExpression?.estado === "reservado"
  );

  assert.equal(reservationIndexes.length, 2);
});

test("El esquema de cancelación referencia un turno y valida motivo, fecha y hora", async () => {
  const cancelacion = new Cancelacion({
    id_turno: new mongoose.Types.ObjectId(),
    motivo: "No puede asistir",
    fecha_cancelacion: "2026-10-14",
    hora_cancelacion: "10:30"
  });

  await cancelacion.validate();
  assert.equal(Cancelacion.schema.path("id_turno").options.ref, "Turno");

  for (const [field, value] of [
    ["motivo", "No"],
    ["motivo", "x".repeat(301)],
    ["fecha_cancelacion", "2026-02-30"],
    ["hora_cancelacion", "25:99"]
  ]) {
    const invalidCancelacion = new Cancelacion({
      id_turno: new mongoose.Types.ObjectId(),
      motivo: "No puede asistir",
      fecha_cancelacion: "2026-10-14",
      hora_cancelacion: "10:30",
      [field]: value
    });
    await assert.rejects(
      invalidCancelacion.validate(),
      (error) => Boolean(error.errors[field])
    );
  }
});

test("Las rutas de turnos rechazan identificadores inválidos antes de consultar MongoDB", async () => {
  let res = crearResponse();
  await crearTurno({
    body: { profesionalId: "bad", clienteId: "bad", fecha: "2026-10-15", hora: "14:00" }
  }, res);
  assert.equal(res.statusCode, 400);

  res = crearResponse();
  await obtenerTurnos({ query: { profesionalId: "bad" } }, res);
  assert.equal(res.statusCode, 400);

  res = crearResponse();
  await cambiarEstado({ params: { id: "bad" }, body: { estado: "cancelado" } }, res);
  assert.equal(res.statusCode, 400);
});

test("La ruta de cancelación rechaza identificadores que no sean ObjectId", async () => {
  const res = crearResponse();
  await createCancelacion({
    body: {
      id_turno: "bad",
      motivo: "No puede asistir",
      fecha_cancelacion: "2026-10-14",
      hora_cancelacion: "10:30"
    }
  }, res);

  assert.equal(res.statusCode, 400);
});

test("La cancelación rechaza motivos vacíos, demasiado cortos, largos o no textuales", async () => {
  for (const motivo of ["   ", "No", "x".repeat(301), 123]) {
    const res = crearResponse();
    await createCancelacion({
      body: {
        id_turno: "6ad001bcc14fce39aaf3d274",
        motivo,
        fecha_cancelacion: "2026-10-14",
        hora_cancelacion: "10:30"
      }
    }, res);

    assert.equal(res.statusCode, 400);
    assert.match(res.body.message, /entre 5 y 300 caracteres/);
  }
});

test("El motivo de cancelación se sanea como texto y conserva hasta 300 caracteres", () => {
  assert.equal(sanitizarMotivoCancelacion("  No puede\n\t asistir \u0000"), "No puede asistir");
  assert.equal(sanitizarMotivoCancelacion("x".repeat(300)).length, 300);
  assert.equal(sanitizarMotivoCancelacion(null), "");
});
