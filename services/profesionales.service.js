import Profesional from "../models/Profesional.model.js";

const error = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

const esDuplicado = (e) => e && e.code === 11000;
const esIdInvalido = (e) => e && e.name === "CastError";

// Devuelve todos los profesionales
export const getAll = async () => {
  return await Profesional.find().sort({ apellido: 1, nombre: 1 });
};

// Busca un profesional por id
export const getById = async (id) => {
  try {
    return await Profesional.findById(id);
  } catch (e) {
    if (esIdInvalido(e)) return null;
    throw e;
  }
};

// Crea un profesional nuevo
export const create = async (data) => {
  try {
    const profesional = new Profesional(data);
    return await profesional.save();
  } catch (e) {
    if (esDuplicado(e)) {
      throw error(409, "La matrícula o el email ya están en uso por otro profesional");
    }
    throw e;
  }
};

// Actualiza los datos de un profesional existente
export const update = async (id, data) => {
  try {
    return await Profesional.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  } catch (e) {
    if (esDuplicado(e)) {
      throw error(409, "La matrícula o el email ya están en uso por otro profesional");
    }
    if (esIdInvalido(e)) {
      return null;
    }
    throw e;
  }
};

// Elimina un profesional por id
export const remove = async (id) => {
  try {
    return await Profesional.findByIdAndDelete(id);
  } catch (e) {
    return null;
  }
};