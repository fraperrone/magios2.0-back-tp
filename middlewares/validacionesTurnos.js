import mongoose from "mongoose";

const estadosValidos = ["reservado", "cancelado", "atendido"];
const horaValida = /^([01]\d|2[0-3]):[0-5]\d$/;

const fechaValida = (fecha) => {
  if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaParseada = new Date(Date.UTC(anio, mes - 1, dia));
  return fechaParseada.getUTCFullYear() === anio
    && fechaParseada.getUTCMonth() === mes - 1
    && fechaParseada.getUTCDate() === dia;
};

const idMongoValido = (id) => mongoose.isObjectIdOrHexString(id);

export const validarDatosTurno = (req, res, next) => {
  const { profesionalId, clienteId, fecha, hora } = req.body || {};

  if (profesionalId === undefined || clienteId === undefined || !fecha || !hora) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  if (!idMongoValido(profesionalId) || !idMongoValido(clienteId)) {
    return res.status(400).json({ error: "profesionalId y clienteId deben ser ObjectId válidos" });
  }

  if (!fechaValida(fecha)) {
    return res.status(400).json({ error: "La fecha debe ser válida y tener el formato YYYY-MM-DD" });
  }

  if (typeof hora !== "string" || !horaValida.test(hora)) {
    return res.status(400).json({ error: "La hora debe tener el formato HH:MM" });
  }

  next();
};

export const validarFiltrosTurno = (req, res, next) => {
  const { profesionalId, clienteId, fecha, estado } = req.query || {};

  if (profesionalId !== undefined && !idMongoValido(profesionalId)) {
    return res.status(400).json({ error: "profesionalId debe ser un ObjectId válido" });
  }

  if (clienteId !== undefined && !idMongoValido(clienteId)) {
    return res.status(400).json({ error: "clienteId debe ser un ObjectId válido" });
  }

  if (fecha !== undefined && !fechaValida(fecha)) {
    return res.status(400).json({ error: "fecha debe tener el formato YYYY-MM-DD y ser válida" });
  }

  if (estado !== undefined && !estadosValidos.includes(estado)) {
    return res.status(400).json({ error: "estado debe ser reservado, cancelado o atendido" });
  }

  next();
};

export const validarIdTurno = (req, res, next) => {
  const { id } = req.params;
  if (!idMongoValido(id)) {
    return res.status(400).json({ error: "El ID del turno debe ser un ObjectId válido" });
  }
  next();
};

export const validarEstadoTurno = (req, res, next) => {
  const { estado } = req.body || {};
  if (!estado || !estadosValidos.includes(estado)) {
    return res.status(400).json({ error: "Estado no válido. Use: reservado, cancelado o atendido" });
  }
  next();
};

export { fechaValida, idMongoValido, horaValida, estadosValidos };

