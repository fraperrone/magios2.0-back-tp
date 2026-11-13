import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import dotenv from "dotenv";
import mongoose from "mongoose";
import {
  createProfesional,
  updateProfesional,
  getProfesionalById,
  deleteProfesional
} from "../controllers/profesionales.controller.js";
import DisponibilidadController from "../controllers/disponibilidad.controller.js";
import Profesional from "../models/Profesional.model.js";
import Disponibilidad from "../models/DisponibilidadHoraria.model.js";

dotenv.config();

const disponibilidadController = new DisponibilidadController();

// Base de prueba separada para no tocar los datos reales
const MONGO_TEST = "mongodb://127.0.0.1:27017/turnosdb_test_prof";

const profesionalDePrueba = {
  nombre: "Ana",
  apellido: "Torres",
  email: "ana.torres@turnoflex.com",
  telefono: "11-5555-0101",
  especialidad: "Kinesiologia",
  matricula: "KT-0001"
};

let profesionalId;
let franjaId;

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
    }
  };
}

before(async () => {
  await mongoose.connect(MONGO_TEST);
  await mongoose.connection.dropDatabase();
  await Profesional.init();
  await Disponibilidad.init();
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test("POST crea un profesional (201)", async () => {
  const res = crearRespuesta();
  await createProfesional({ body: profesionalDePrueba }, res);

  assert.equal(res.statusCode, 201);
  assert.ok(res.body._id);
  assert.equal(res.body.matricula, "KT-0001");
  profesionalId = String(res.body._id);
});

test("POST rechaza email o matrícula repetida (409)", async () => {
  const res = crearRespuesta();
  await createProfesional({ body: profesionalDePrueba }, res);

  assert.equal(res.statusCode, 409);
  assert.match(res.body.message, /en uso/);
});

test("PUT actualiza el profesional (200)", async () => {
  const res = crearRespuesta();
  await updateProfesional(
    { params: { id: profesionalId }, body: { ...profesionalDePrueba, telefono: "11-5555-0199" } },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.telefono, "11-5555-0199");
});

test("GET devuelve 404 si el profesional no existe", async () => {
  const res = crearRespuesta();
  await getProfesionalById({ params: { id: "64b000000000000000000000" } }, res);

  assert.equal(res.statusCode, 404);
  assert.match(res.body.message, /no encontrado/);
});

test("POST crea una franja horaria (201)", async () => {
  const res = crearRespuesta();
  await disponibilidadController.create(
    {
      body: {
        profesionalId,
        dia: "lunes",
        horaInicio: "09:00",
        horaFin: "13:00"
      }
    },
    res
  );

  assert.equal(res.statusCode, 201);
  assert.ok(res.body._id);
  assert.equal(res.body.dia, "lunes");
  franjaId = String(res.body._id);
});

test("POST rechaza una franja solapada (400)", async () => {
  const res = crearRespuesta();
  await disponibilidadController.create(
    {
      body: {
        profesionalId,
        dia: "lunes",
        horaInicio: "11:00",
        horaFin: "15:00"
      }
    },
    res
  );

  assert.equal(res.statusCode, 400);
  assert.match(res.body.error, /solapa/);
});

test("GET lista las franjas del lunes (200)", async () => {
  const res = crearRespuesta();
  await disponibilidadController.getByDia({ params: { dia: "lunes" } }, res);

  assert.equal(res.statusCode, 200);
  assert.ok(Array.isArray(res.body));
  assert.equal(res.body.length, 1);
  assert.equal(res.body[0].dia, "lunes");
});

test("DELETE limpia la franja y el profesional de prueba (200)", async () => {
  const resFranja = crearRespuesta();
  await disponibilidadController.delete({ params: { id: franjaId } }, resFranja);
  assert.equal(resFranja.statusCode, 200);

  const resProfesional = crearRespuesta();
  await deleteProfesional({ params: { id: profesionalId } }, resProfesional);
  assert.equal(resProfesional.statusCode, 200);
});
