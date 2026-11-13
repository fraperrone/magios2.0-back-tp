import { test, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import {
  createCliente,
  getClienteById,
  updateCliente,
  deleteCliente,
} from "../controllers/clientes.controller.js";
import { validarDatos } from "../middlewares/validacionesClientes.js";
import Cliente from "../models/Cliente.model.js";

// Base separada y descartable: nunca usar process.env.MONGODB_URI acá
const MONGO_TEST = "mongodb://127.0.0.1:27017/turnosdb_test_cli";

const clienteBase = {
  nombre: "Juan Perez",
  email: "juan.perez@mail.com",
  telefono: "1122334455",
};

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
    send() {
      return this;
    },
  };
}

before(async () => {
  await mongoose.connect(MONGO_TEST);
  await mongoose.connection.dropDatabase();
  await Cliente.init();
});

beforeEach(async () => {
  await Cliente.deleteMany({});
});

after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

test("POST crea un cliente (201)", async () => {
  const res = crearRespuesta();
  await createCliente({ body: clienteBase }, res);

  assert.equal(res.statusCode, 201);
  assert.ok(res.body._id);
  assert.equal(res.body.email, clienteBase.email);
});

test("POST rechaza email duplicado (409)", async () => {
  await createCliente({ body: clienteBase }, crearRespuesta());

  const res = crearRespuesta();
  await createCliente(
    { body: { ...clienteBase, telefono: "1122334466" } },
    res
  );

  assert.equal(res.statusCode, 409);
  assert.match(res.body.message, /email.*en uso/);
});

test("POST rechaza teléfono duplicado (409)", async () => {
  await createCliente({ body: clienteBase }, crearRespuesta());

  const res = crearRespuesta();
  await createCliente(
    { body: { ...clienteBase, email: "otro@mail.com" } },
    res
  );

  assert.equal(res.statusCode, 409);
  assert.match(res.body.message, /telefono.*en uso/);
});

test("El middleware rechaza datos faltantes o de tipo incorrecto (400)", () => {
  const casos = [
    {},
    { nombre: 123, email: "ana@mail.com", telefono: "1122334455" },
    { nombre: "   ", email: "ana@mail.com", telefono: "1122334455" },
    { nombre: "Ana", email: "no-es-email", telefono: "1122334455" },
    { nombre: "Ana", email: "ana@mail.com", telefono: "123" },
  ];

  for (const body of casos) {
    const res = crearRespuesta();
    let nextLlamado = false;

    validarDatos({ body }, res, () => {
      nextLlamado = true;
    });

    assert.equal(res.statusCode, 400, JSON.stringify(body));
    assert.equal(nextLlamado, false);
  }
});

test("El middleware normaliza espacios (trim)", () => {
  const req = {
    body: {
      nombre: "  Ana  ",
      email: " ana@mail.com ",
      telefono: " 1122334455 ",
    },
  };
  const res = crearRespuesta();
  let nextLlamado = false;

  validarDatos(req, res, () => {
    nextLlamado = true;
  });

  assert.equal(nextLlamado, true);
  assert.deepEqual(req.body, {
    nombre: "Ana",
    email: "ana@mail.com",
    telefono: "1122334455",
  });
});

test("GET devuelve 400 si el ID no es válido", async () => {
  const res = crearRespuesta();
  await getClienteById({ params: { id: "no-es-un-id" } }, res);

  assert.equal(res.statusCode, 400);
});

test("GET devuelve 404 si el cliente no existe", async () => {
  await assert.rejects(
    () => getClienteById({ params: { id: "64b000000000000000000000" } }, crearRespuesta()),
    (error) => error.status === 404
  );
});

test("PUT actualiza un cliente existente (200)", async () => {
  const resAlta = crearRespuesta();
  await createCliente({ body: clienteBase }, resAlta);

  const res = crearRespuesta();
  await updateCliente(
    {
      params: { id: String(resAlta.body._id) },
      body: { ...clienteBase, nombre: "Juan Actualizado" },
    },
    res
  );

  assert.equal(res.statusCode, 200);
  assert.equal(res.body.nombre, "Juan Actualizado");
});

test("PUT rechaza email duplicado (409)", async () => {
  await createCliente({ body: clienteBase }, crearRespuesta());

  await createCliente(
    {
      body: {
        nombre: "Otro",
        email: "otro@mail.com",
        telefono: "1122334466",
      },
    },
    crearRespuesta()
  );

  const cliente = await Cliente.findOne({ email: clienteBase.email });

  const res = crearRespuesta();
  await updateCliente(
    {
      params: { id: String(cliente._id) },
      body: { ...clienteBase, email: "otro@mail.com" },
    },
    res
  );

  assert.equal(res.statusCode, 409);
  assert.match(res.body.message, /email.*en uso/);
});

test("PUT devuelve 404 si el cliente no existe", async () => {
  await assert.rejects(
    () =>
      updateCliente(
        { params: { id: "64b000000000000000000000" }, body: clienteBase },
        crearRespuesta()
      ),
    (error) => error.status === 404
  );
});

test("DELETE devuelve 404 si el cliente no existe", async () => {
  await assert.rejects(
    () => deleteCliente({ params: { id: "64b000000000000000000000" } }, crearRespuesta()),
    (error) => error.status === 404
  );
});

test("DELETE elimina un cliente existente (204)", async () => {
  const resAlta = crearRespuesta();
  await createCliente({ body: clienteBase }, resAlta);

  const res = crearRespuesta();
  await deleteCliente(
    { params: { id: String(resAlta.body._id) } },
    res
  );

  assert.equal(res.statusCode, 204);
});