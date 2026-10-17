import mongoose from "mongoose";
import Cancelacion from "../models/Cancelacion.model.js";

export const getAllCancelaciones = (populate = false) => {
  const query = Cancelacion.find().sort({ createdAt: -1 });
  if (populate) {
    query.populate({
      path: "id_turno",
      populate: [
        { path: "profesionalId" },
        { path: "clienteId" }
      ]
    });
  }
  return query;
};

export const getCancelacionById = async (id, populate = false) => {
  if (!mongoose.isObjectIdOrHexString(id)) return null;
  const query = Cancelacion.findById(id);
  if (populate) {
    query.populate({
      path: "id_turno",
      populate: [
        { path: "profesionalId" },
        { path: "clienteId" }
      ]
    });
  }
  return query;
};

export const getCancelacionByTurnoId = (turnoId) =>
  Cancelacion.findOne({ id_turno: turnoId });

export const createCancelacion = async (data) => {
  try {
    return await Cancelacion.create(data);
  } catch (error) {
    if (error.code === 11000) {
      const duplicateError = new Error("Ya existe una cancelación para este turno");
      duplicateError.status = 409;
      throw duplicateError;
    }
    throw error;
  }
};

export const deleteCancelacion = (id) => Cancelacion.findByIdAndDelete(id);
