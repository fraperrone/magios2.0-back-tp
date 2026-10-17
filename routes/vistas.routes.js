import express from "express";
import * as turnosController from "../controllers/turnos.controller.js";
import * as cancelacionesController from "../controllers/cancelaciones.controller.js";
import * as profesionalesController from "../controllers/profesionales.controller.js";
import * as clientesController from "../controllers/clientes.controller.js";
import DisponibilidadController from "../controllers/disponibilidad.controller.js";

const router = express.Router();
const disponibilidadController = new DisponibilidadController();

// --- Vistas de Turnos ---
router.get("/turnos", turnosController.renderTurnos);
router.post("/turnos", turnosController.crearTurnoDesdeVista);
router.get("/turnos/:id", turnosController.renderTurnoDetalle);
router.post("/turnos/:id/eliminar", turnosController.eliminarTurnoDesdeVista);

// --- Vistas de Cancelaciones ---
router.get("/cancelaciones", cancelacionesController.renderCancelaciones);
router.post("/cancelaciones", cancelacionesController.crearCancelacionDesdeVista);
router.get("/cancelaciones/:id", cancelacionesController.renderCancelacionDetalle);

// --- Vistas de Profesionales ---
router.get("/profesionales", profesionalesController.renderProfesionales);
router.get("/profesionales/:id", profesionalesController.renderProfesionalById);

// --- Vistas de Clientes ---
router.get("/clientes", clientesController.renderClientes);
router.get("/clientes/:id", clientesController.renderClienteById);

// --- Vistas de Disponibilidad ---
router.get("/disponibilidades", disponibilidadController.renderDisponibilidades);
router.get("/disponibilidades/:id", disponibilidadController.renderDisponibilidadById);

export default router;
