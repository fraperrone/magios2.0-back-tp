import mongoose from "mongoose";

const validarId = (id) => mongoose.isObjectIdOrHexString(id);
const horaValida = /^([01]\d|2[0-3]):[0-5]\d$/;
const MOTIVO_MIN_LENGTH = 5;
const MOTIVO_MAX_LENGTH = 300;

export const sanitizarMotivoCancelacion = (motivo) => {
  if (typeof motivo !== "string") return "";
  return motivo
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

export const fechaValida = (fecha) => {
  if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaParseada = new Date(Date.UTC(anio, mes - 1, dia));
  return fechaParseada.getUTCFullYear() === anio
    && fechaParseada.getUTCMonth() === mes - 1
    && fechaParseada.getUTCDate() === dia;
};

export const validarDatosCancelacion = (req, res, next) => {
  const { id_turno, motivo, fecha_cancelacion, hora_cancelacion } = req.body || {};

  if (!id_turno || !fecha_cancelacion || !hora_cancelacion) {
    return res.status(400).json({ message: "id_turno, fecha_cancelacion y hora_cancelacion son obligatorios" });
  }

  const motivoSaneado = sanitizarMotivoCancelacion(motivo);
  if (motivoSaneado.length < MOTIVO_MIN_LENGTH || motivoSaneado.length > MOTIVO_MAX_LENGTH) {
    return res.status(400).json({
      message: `El motivo debe tener entre ${MOTIVO_MIN_LENGTH} y ${MOTIVO_MAX_LENGTH} caracteres`
    });
  }

  if (!validarId(id_turno)) {
    return res.status(400).json({ message: "id_turno debe ser un ObjectId válido" });
  }

  if (!fechaValida(fecha_cancelacion) || typeof hora_cancelacion !== "string" || !horaValida.test(hora_cancelacion)) {
    return res.status(400).json({ message: "fecha_cancelacion y hora_cancelacion deben tener formatos válidos" });
  }

  req.body.motivo = motivoSaneado;
  next();
};

export const validarIdCancelacion = (req, res, next) => {
  const { id } = req.params;
  if (!validarId(id)) {
    return res.status(400).json({ message: "El ID de la cancelación debe ser un ObjectId válido" });
  }
  next();
};

export { validarId, horaValida, MOTIVO_MIN_LENGTH, MOTIVO_MAX_LENGTH };

