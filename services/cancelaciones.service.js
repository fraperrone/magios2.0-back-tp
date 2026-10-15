import mongoose from "mongoose";
import Cancelacion from "../models/Cancelacion.model.js";

export const getAllCancelaciones = () => Cancelacion.find().sort({ createdAt: -1 });

export const getCancelacionById = async (id) => {
  if (!mongoose.isObjectIdOrHexString(id)) return null;
  return Cancelacion.findById(id);
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
