import express from "express";
import * as profesionalesController from "../controllers/profesionales.controller.js";

const router = express.Router();

// 1. Vistas (Definidas primero para que :id no capture "vista")
router.get("/vista", profesionalesController.renderProfesionales);
router.get("/vista/:id", profesionalesController.renderProfesionalById);

// 2. Rutas de colección (raíz)
router.get(["/", "/api"], profesionalesController.getProfesionales);
router.post(["/", "/api"], profesionalesController.createProfesional);

// 3. Rutas parametrizadas por :id (al final para evitar colisiones)
router.get(["/:id", "/api/:id"], profesionalesController.getProfesionalById);
router.put(["/:id", "/api/:id"], profesionalesController.updateProfesional);
router.delete(["/:id", "/api/:id"], profesionalesController.deleteProfesional);

export default router;