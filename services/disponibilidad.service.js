import Disponibilidad from "../models/DisponibilidadHoraria.model.js";
import Profesional from "../models/Profesional.model.js";

const HORA_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const normalizarDia = (dia) => String(dia).trim().toLowerCase();

const error = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

class DisponibilidadService {
  // Obtener todas las disponibilidades
  async getAll() {
    return await Disponibilidad.find().sort({ profesionalId: 1, dia: 1, horaInicio: 1 });
  }

  // Obtener disponibilidad por ID
  async getById(id) {
    try {
      return await Disponibilidad.findById(id);
    } catch (e) {
      return null;
    }
  }

  // Obtener disponibilidades por profesional
  async getByProfesional(profesionalId) {
    return await Disponibilidad.find({ profesionalId }).sort({ dia: 1, horaInicio: 1 });
  }

  // Obtener disponibilidades por día
  async getByDia(dia) {
    return await Disponibilidad.find({ dia: normalizarDia(dia) }).sort({ horaInicio: 1 });
  }

  // Crear nueva disponibilidad
  async create(disponibilidadData) {
    const { profesionalId, dia, horaInicio, horaFin } = disponibilidadData;

    const profesional = await Profesional.findById(profesionalId).catch(() => null);
    if (!profesional) {
      throw error(404, "El profesional indicado no existe");
    }

    const diaNormalizado = normalizarDia(dia);

    if (!HORA_REGEX.test(horaInicio) || !HORA_REGEX.test(horaFin)) {
      throw error(400, "horaInicio y horaFin deben tener formato HH:MM");
    }
    if (!(horaInicio < horaFin)) {
      throw error(400, "horaInicio debe ser menor que horaFin");
    }

    const solapada = await Disponibilidad.findOne({
      profesionalId,
      dia: diaNormalizado,
      horaInicio: { $lt: horaFin },
      horaFin: { $gt: horaInicio }
    });
    if (solapada) {
      throw error(400, "La franja se solapa con otra disponibilidad del profesional en ese día");
    }

    try {
      const nueva = new Disponibilidad({
        profesionalId,
        dia: diaNormalizado,
        horaInicio,
        horaFin,
        activo: disponibilidadData.activo !== undefined ? disponibilidadData.activo : true
      });
      return await nueva.save();
    } catch (e) {
      if (e.code === 11000) {
        throw error(400, "Ya existe esa disponibilidad para el profesional en ese día y horario");
      }
      throw e;
    }
  }

  // Actualizar disponibilidad
  async update(id, updateData) {
    const actual = await this.getById(id);
    if (!actual) {
      throw error(404, "Disponibilidad no encontrada");
    }

    const dia = updateData.dia !== undefined ? normalizarDia(updateData.dia) : actual.dia;
    const horaInicio = updateData.horaInicio !== undefined ? updateData.horaInicio : actual.horaInicio;
    const horaFin = updateData.horaFin !== undefined ? updateData.horaFin : actual.horaFin;

    if (!HORA_REGEX.test(horaInicio) || !HORA_REGEX.test(horaFin)) {
      throw error(400, "horaInicio y horaFin deben tener formato HH:MM");
    }
    if (!(horaInicio < horaFin)) {
      throw error(400, "horaInicio debe ser menor que horaFin");
    }

    const solapada = await Disponibilidad.findOne({
      _id: { $ne: actual._id },
      profesionalId: actual.profesionalId,
      dia,
      horaInicio: { $lt: horaFin },
      horaFin: { $gt: horaInicio }
    });
    if (solapada) {
      throw error(400, "La franja se solapa con otra disponibilidad del profesional en ese día");
    }

    return await Disponibilidad.findByIdAndUpdate(
      id,
      { ...updateData, dia },
      { new: true, runValidators: true }
    );
  }

  // Eliminar disponibilidad
  async delete(id) {
    try {
      return await Disponibilidad.findByIdAndDelete(id);
    } catch (e) {
      return null;
    }
  }
}

export default DisponibilidadService;