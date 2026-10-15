import express from "express";
import * as turnosController from "../controllers/turnos.controller.js";
import * as cancelacionesController from "../controllers/cancelaciones.controller.js";

const router = express.Router();

// --- Vistas de Turnos ---
// GET /vista/turnos (Lista con filtros y formulario de alta integrados)
router.get("/turnos", turnosController.renderTurnos);

// POST /vista/turnos (Procesa el formulario web de alta de turno)
router.post("/turnos", turnosController.crearTurnoDesdeVista);

// GET /vista/turnos/:id (Detalle de un turno)
router.get("/turnos/:id", turnosController.renderTurnoDetalle);

// POST /vista/turnos/:id/eliminar (Eliminar un turno desde la vista)
router.post("/turnos/:id/eliminar", turnosController.eliminarTurnoDesdeVista);


// --- Vistas de Cancelaciones ---
// GET /vista/cancelaciones (Lista y formulario de alta integrados)
router.get("/cancelaciones", cancelacionesController.renderCancelaciones);

// POST /vista/cancelaciones (Procesa el formulario web de registro de cancelación)
router.post("/cancelaciones", cancelacionesController.crearCancelacionDesdeVista);

// GET /vista/cancelaciones/:id (Detalle de una cancelación)
router.get("/cancelaciones/:id", cancelacionesController.renderCancelacionDetalle);

export default router;

