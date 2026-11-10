import express from "express";
import * as clientesController from "../controllers/clientes.controller.js";
import * as validacionesClientes from "../middlewares/validacionesClientes.js";

const router = express.Router();

// Redirecciones de compatibilidad hacia las rutas centralizadas de vistas (/vista/clientes)
router.get("/vista", (req, res) => res.redirect("/vista/clientes"));
router.get("/vista/:id", (req, res) => res.redirect(`/vista/clientes/${req.params.id}`));

// Rutas de colección REST
router.get("/", clientesController.getClientes);
router.post("/", validacionesClientes.validarDatos, clientesController.createCliente);

// Rutas parametrizadas por ID
router.get("/:id", clientesController.getClienteById);
router.put("/:id", validacionesClientes.validarDatos, clientesController.updateCliente);
router.delete("/:id", clientesController.deleteCliente);

// Compatibilidad para endpoints con sufijo legado /api
router.get("/api", clientesController.getClientes);
router.post("/api", validacionesClientes.validarDatos, clientesController.createCliente);
router.get("/api/:id", clientesController.getClienteById);
router.put("/api/:id", validacionesClientes.validarDatos, clientesController.updateCliente);
router.delete("/api/:id", clientesController.deleteCliente);

export default router;