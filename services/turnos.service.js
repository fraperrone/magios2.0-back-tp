import mongoose from "mongoose";
import Turno from "../models/Turno.model.js";

export const getAllTurnos = (filters = {}, populate = false) => {
  const query = Turno.find(filters).sort({ fecha: 1, hora: 1 });
  if (populate) {
    query.populate("profesionalId").populate("clienteId");
  }
  return query;
};

export const getTurnoById = async (id, populate = false) => {
  if (!mongoose.isObjectIdOrHexString(id)) return null;
  const query = Turno.findById(id);
  if (populate) {
    query.populate("profesionalId").populate("clienteId");
  }
  return query;
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
