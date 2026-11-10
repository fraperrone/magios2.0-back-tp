import express from "express";
import DisponibilidadController from "../controllers/disponibilidad.controller.js";

const router = express.Router();
const disponibilidadController = new DisponibilidadController();

// Redirecciones de compatibilidad hacia las rutas centralizadas de vistas (/vista/disponibilidades)
router.get("/vista", (req, res) => res.redirect("/vista/disponibilidades"));
router.get("/vista/:id", (req, res) => res.redirect(`/vista/disponibilidades/${req.params.id}`));

// Rutas de colección y filtros REST
router.get("/", disponibilidadController.getAll);
router.post("/", disponibilidadController.create);
router.get("/profesional/:profesionalId", disponibilidadController.getByProfesional);
router.get("/dia/:dia", disponibilidadController.getByDia);

// Rutas parametrizadas por ID
router.get("/:id", disponibilidadController.getById);
router.put("/:id", disponibilidadController.update);
router.delete("/:id", disponibilidadController.delete);

// Compatibilidad para endpoints con prefijo legado /api
router.get("/api", disponibilidadController.getAll);
router.post("/api", disponibilidadController.create);
router.get("/api/profesional/:profesionalId", disponibilidadController.getByProfesional);
router.get("/api/dia/:dia", disponibilidadController.getByDia);
router.get("/api/:id", disponibilidadController.getById);
router.put("/api/:id", disponibilidadController.update);
router.delete("/api/:id", disponibilidadController.delete);

export default router;