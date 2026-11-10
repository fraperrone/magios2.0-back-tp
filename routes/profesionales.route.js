import express from "express";
import * as profesionalesController from "../controllers/profesionales.controller.js";

const router = express.Router();

// Redirecciones de compatibilidad hacia las rutas centralizadas de vistas (/vista/profesionales)
router.get("/vista", (req, res) => res.redirect("/vista/profesionales"));
router.get("/vista/:id", (req, res) => res.redirect(`/vista/profesionales/${req.params.id}`));

// Rutas de colección REST
router.get("/", profesionalesController.getProfesionales);
router.post("/", profesionalesController.createProfesional);

// Rutas parametrizadas por ID
router.get("/:id", profesionalesController.getProfesionalById);
router.put("/:id", profesionalesController.updateProfesional);
router.delete("/:id", profesionalesController.deleteProfesional);

// Compatibilidad para endpoints con sufijo legado /api
router.get("/api", profesionalesController.getProfesionales);
router.post("/api", profesionalesController.createProfesional);
router.get("/api/:id", profesionalesController.getProfesionalById);
router.put("/api/:id", profesionalesController.updateProfesional);
router.delete("/api/:id", profesionalesController.deleteProfesional);

export default router;