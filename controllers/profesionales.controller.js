
const profesionalesService = require('../services/profesionales.service');

// Obtener todos los profesionales
exports.getProfesionales = (req, res) => {
  res.json(profesionalesService.getAll());
};

// Obtener un profesional por ID
exports.getProfesionalById = (req, res) => {
  const profesional = profesionalesService.getById(req.params.id);
  if (!profesional) {
    return res.status(404).json({ message: "Profesional no encontrado" });
  }
  res.json(profesional);
};

// Crear un nuevo profesional
exports.createProfesional = (req, res) => {
  const profesional = profesionalesService.create(req.body);
  res.status(201).json(profesional);
};

// Actualizar un profesional existente
exports.updateProfesional = (req, res) => {
  const profesional = profesionalesService.update(req.params.id, req.body);
  if (!profesional) {
    return res.status(404).json({ message: "Profesional no encontrado" });
  }
  res.json(profesional);
};

// Eliminar un profesional
exports.deleteProfesional = (req, res) => {
  const profesional = profesionalesService.delete(req.params.id);
  if (!profesional) {
    return res.status(404).json({ message: "Profesional no encontrado" });
  }
  res.json({ message: "Profesional eliminado" });
};
