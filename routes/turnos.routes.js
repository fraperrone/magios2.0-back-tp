import express from "express";
import * as turnosController from "../controllers/turnos.controller.js";
import {
  validarDatosTurno,
  validarFiltrosTurno,
  validarIdTurno,
  validarEstadoTurno
} from "../middlewares/validacionesTurnos.js";

const router = express.Router();

// GET /api/turnos (con filtros opcionales por query: profesionalId, clienteId, fecha, estado)
router.get("/", validarFiltrosTurno, turnosController.obtenerTurnos);

// GET /api/turnos/:id (detalle de turno)
router.get("/:id", validarIdTurno, turnosController.obtenerTurnoPorId);

// POST /api/turnos (crear turno)
router.post("/", validarDatosTurno, turnosController.crearTurno);

// PATCH /api/turnos/:id/estado (cambiar estado del turno)
router.patch("/:id/estado", validarIdTurno, validarEstadoTurno, turnosController.cambiarEstado);

// PUT /api/turnos/:id (compatibilidad para cambiar estado)
router.put("/:id", validarIdTurno, validarEstadoTurno, turnosController.cambiarEstado);

// DELETE /api/turnos/:id (eliminar turno)
router.delete("/:id", validarIdTurno, turnosController.eliminarTurno);

export default router;
