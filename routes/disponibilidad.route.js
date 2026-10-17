import express from "express";
import DisponibilidadController from "../controllers/disponibilidad.controller.js";

const router = express.Router();
const disponibilidadController = new DisponibilidadController();

// 1. Vistas (Definidas primero para que :id no capture "vista")
router.get("/vista", disponibilidadController.renderDisponibilidades);
router.get("/vista/:id", disponibilidadController.renderDisponibilidadById);

// 2. Rutas literales y específicas de API (antes de :id)
router.get(["/", "/api"], disponibilidadController.getAll);
router.post(["/", "/api"], disponibilidadController.create);
router.get(["/profesional/:profesionalId", "/api/profesional/:profesionalId"], disponibilidadController.getByProfesional);
router.get(["/dia/:dia", "/api/dia/:dia"], disponibilidadController.getByDia);

// 3. Rutas parametrizadas por :id (al final para evitar colisiones)
router.get(["/:id", "/api/:id"], disponibilidadController.getById);
router.put(["/:id", "/api/:id"], disponibilidadController.update);
router.delete(["/:id", "/api/:id"], disponibilidadController.delete);

export default router;