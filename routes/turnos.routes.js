import express from "express";
import * as turnosController from "../controllers/turnos.controller.js";

const router = express.Router();

router.get('/', turnosController.obtenerTurnos);
router.post('/', turnosController.crearTurno);
router.patch('/:id/estado', turnosController.cambiarEstado);
router.put('/:id', turnosController.cambiarEstado);

export default router;
