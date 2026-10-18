import test from "node:test";
import assert from "node:assert";
import request from "supertest";
import app from "./index.js";

test("GET /api/clientes devuelve lista", async () => {
  const res = await request(app).get("/clientes/api");
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.body));
});


// Falta un campo obligatorio
test("POST /clientes/api sin telefono debe devolver error 400", async () => {
  const clienteIncompleto = {
    nombre: "Ana",
    email: "ana@test.com"
    // falta telefono
  };

  const res = await request(app).post("/clientes/api").send(clienteIncompleto);

  assert.strictEqual(res.status, 400);
  assert.match(res.body.message, /obligatorios/i);
});

// Email inválido
test("POST /clientes/api con email inválido debe devolver error 400", async () => {
  const clienteEmailMal = {
    nombre: "Luis",
    email: "correo-invalido",
    telefono: "1234567890"
  };

  const res = await request(app).post("/clientes/api").send(clienteEmailMal);

  assert.strictEqual(res.status, 400);
  assert.match(res.body.message, /email no es válido/i);
});

// Teléfono inválido
test("POST /clientes/api con teléfono inválido debe devolver error 400", async () => {
  const clienteTelMal = {
    nombre: "Pedro",
    email: "pedro@test.com",
    telefono: "12345" // menos de 10 dígitos
  };

  const res = await request(app).post("/clientes/api").send(clienteTelMal);

  assert.strictEqual(res.status, 400);
  assert.match(res.body.message, /telefono no es válido/i);
});
