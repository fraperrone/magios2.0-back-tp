import express from "express";
import * as clientesController from "../controllers/clientes.controller.js";
import * as validacionesClientes from "../middlewares/validacionesClientes.js";

const router = express.Router();

// 1. Vistas (Definidas primero para que :id no capture "vista")
router.get("/vista", clientesController.renderClientes);
router.get("/vista/:id", clientesController.renderClienteById);

// 2. Rutas de colección (raíz)
router.get(["/", "/api"], clientesController.getClientes);
router.post(["/", "/api"], validacionesClientes.validarDatos, clientesController.createCliente);

// 3. Rutas parametrizadas por :id (al final para evitar colisiones)
router.get(["/:id", "/api/:id"], clientesController.getClienteById);
router.put(["/:id", "/api/:id"], validacionesClientes.validarDatos, clientesController.updateCliente);
router.delete(["/:id", "/api/:id"], clientesController.deleteCliente);

export default router;