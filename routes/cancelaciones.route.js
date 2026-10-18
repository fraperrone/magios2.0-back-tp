import express from "express";
import * as cancelacionesController from "../controllers/cancelaciones.controller.js";
import {
  validarDatosCancelacion,
  validarIdCancelacion
} from "../middlewares/validacionesCancelaciones.js";

const router = express.Router();

// GET /api/cancelaciones (listar todas)
router.get("/", cancelacionesController.getCancelaciones);

// GET /api/cancelaciones/:id (detalle de cancelación)
router.get("/:id", validarIdCancelacion, cancelacionesController.getCancelacionById);

// POST /api/cancelaciones (registrar cancelación)
router.post("/", validarDatosCancelacion, cancelacionesController.createCancelacion);

export default router;