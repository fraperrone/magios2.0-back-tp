import mongoose from "mongoose";
import Turno from "../models/Turno.model.js";

export const getAllTurnos = (filters = {}) => {
  return Turno.find(filters).sort({ fecha: 1, hora: 1 });
};

export const getTurnoById = async (id) => {
  if (!mongoose.isObjectIdOrHexString(id)) return null;
  return Turno.findById(id);
};

export const getReservedByProfessional = (profesionalId, fecha, hora, excludeId) => {
  const filters = { profesionalId, fecha, hora, estado: "reservado" };
  if (excludeId) filters._id = { $ne: excludeId };
  return Turno.findOne(filters);
};

export const getReservedByClient = (clienteId, fecha, hora, excludeId) => {
  const filters = { clienteId, fecha, hora, estado: "reservado" };
  if (excludeId) filters._id = { $ne: excludeId };
  return Turno.findOne(filters);
};

export const createTurno = (data) => Turno.create(data);

export const updateTurno = async (id, data) => {
  if (!mongoose.isObjectIdOrHexString(id)) return null;
  return Turno.findByIdAndUpdate(id, data, { new: true, runValidators: true });
};

export const cancelTurno = (id) => updateTurno(id, { estado: "cancelado" });

export const deleteTurno = async (id) => {
  if (!mongoose.isObjectIdOrHexString(id)) return false;
  return Boolean(await Turno.findByIdAndDelete(id));
};
