import mongoose from "mongoose";
import DisponibilidadService from "../services/disponibilidad.service.js";

const disponibilidadService = new DisponibilidadService();

const DIAS_VALIDOS = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];
const esObjectIdValido = (id) => mongoose.isValidObjectId(id);

const responderError = (res, error) => {
  if (error && error.status) {
    return res.status(error.status).json({ error: error.message });
  }
  if (error && error.code === 11000) {
    return res.status(400).json({ error: "Ya existe esa disponibilidad para el profesional en ese día y horario" });
  }
  return res.status(500).json({ error: error.message });
};

class DisponibilidadController {

  // Obtener todas las disponibilidades
  async getAll(req, res) {
    try {
      res.status(200).json(await disponibilidadService.getAll());
    } catch (error) {
      responderError(res, error);
    }
  }

  // Obtener disponibilidad por ID
  async getById(req, res) {
    if (!esObjectIdValido(req.params.id)) {
      return res.status(400).json({ error: "ID no válido" });
    }
    try {
      const disponibilidad = await disponibilidadService.getById(req.params.id);
      if (!disponibilidad) {
        return res.status(404).json({ error: "Disponibilidad no encontrada" });
      }
      res.status(200).json(disponibilidad);
    } catch (error) {
      responderError(res, error);
    }
  }

  // Obtener disponibilidades por profesional
  async getByProfesional(req, res) {
    if (!esObjectIdValido(req.params.profesionalId)) {
      return res.status(400).json({ error: "profesionalId no válido" });
    }
    try {
      res.status(200).json(await disponibilidadService.getByProfesional(req.params.profesionalId));
    } catch (error) {
      responderError(res, error);
    }
  }

  // Obtener disponibilidades por día
  async getByDia(req, res) {
    const { dia } = req.params;
    if (!dia || !DIAS_VALIDOS.includes(String(dia).toLowerCase())) {
      return res.status(400).json({ error: "Día inválido. Use: lunes, martes, miercoles, jueves, viernes, sabado, domingo" });
    }
    try {
      res.status(200).json(await disponibilidadService.getByDia(dia));
    } catch (error) {
      responderError(res, error);
    }
  }

  // Crear nueva disponibilidad
  async create(req, res) {
    try {
      const { profesionalId, dia, horaInicio, horaFin } = req.body;

      if (!profesionalId || !dia || !horaInicio || !horaFin) {
        return res.status(400).json({
          error: "Todos los campos son requeridos: profesionalId, dia, horaInicio, horaFin"
        });
      }
      if (!esObjectIdValido(profesionalId)) {
        return res.status(400).json({ error: "profesionalId no válido" });
      }
      if (!DIAS_VALIDOS.includes(String(dia).toLowerCase())) {
        return res.status(400).json({ error: "Día inválido. Use: lunes, martes, miercoles, jueves, viernes, sabado, domingo" });
      }

      const nuevaDisponibilidad = await disponibilidadService.create({
        profesionalId,
        dia,
        horaInicio,
        horaFin
      });

      res.status(201).json(nuevaDisponibilidad);
    } catch (error) {
      responderError(res, error);
    }
  }

  // Actualizar disponibilidad
  async update(req, res) {
    if (!esObjectIdValido(req.params.id)) {
      return res.status(400).json({ error: "ID no válido" });
    }
    try {
      const { id } = req.params;
      const { profesionalId, dia, horaInicio, horaFin, activo } = req.body;

      if (profesionalId !== undefined && !esObjectIdValido(profesionalId)) {
        return res.status(400).json({ error: "profesionalId no válido" });
      }
      if (dia !== undefined && !DIAS_VALIDOS.includes(String(dia).toLowerCase())) {
        return res.status(400).json({ error: "Día inválido. Use: lunes, martes, miercoles, jueves, viernes, sabado, domingo" });
      }

      const updateData = {};
      if (profesionalId !== undefined) updateData.profesionalId = profesionalId;
      if (dia !== undefined) updateData.dia = dia;
      if (horaInicio !== undefined) updateData.horaInicio = horaInicio;
      if (horaFin !== undefined) updateData.horaFin = horaFin;
      if (activo !== undefined) updateData.activo = activo;

      const disponibilidadActualizada = await disponibilidadService.update(id, updateData);
      if (!disponibilidadActualizada) {
        return res.status(404).json({ error: "Disponibilidad no encontrada" });
      }

      res.status(200).json(disponibilidadActualizada);
    } catch (error) {
      responderError(res, error);
    }
  }

  // Eliminar disponibilidad
  async delete(req, res) {
    if (!esObjectIdValido(req.params.id)) {
      return res.status(400).json({ error: "ID no válido" });
    }
    try {
      const eliminada = await disponibilidadService.delete(req.params.id);
      if (!eliminada) {
        return res.status(404).json({ error: "Disponibilidad no encontrada" });
      }
      res.status(200).json({
        message: "Disponibilidad eliminada correctamente",
        disponibilidad: eliminada
      });
    } catch (error) {
      responderError(res, error);
    }
  }

  
  // Vistas
  async renderDisponibilidades(req, res) {
    const disponibilidades = await disponibilidadService.getAll();
    res.render("disponibilidades", { disponibilidades });
  }

  async renderDisponibilidadById(req, res) {
    const disponibilidad = await disponibilidadService.getById(req.params.id);
    res.render("disponibilidad-detalle", { disponibilidad });
  }
}

export default DisponibilidadController;