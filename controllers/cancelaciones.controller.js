import * as cancelacionesService from "../services/cancelaciones.service.js";
import * as turnosService from "../services/turnos.service.js";

const validarId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id));
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

const fechaValida = (fecha) => {
  if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaParseada = new Date(Date.UTC(anio, mes - 1, dia));
  return fechaParseada.getUTCFullYear() === anio
    && fechaParseada.getUTCMonth() === mes - 1
    && fechaParseada.getUTCDate() === dia;
};

// API: GET /api/cancelaciones
export const getCancelaciones = async (req, res) => {
  try {
    const cancelaciones = await cancelacionesService.getAllCancelaciones();
    return res.status(200).json(cancelaciones);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener las cancelaciones" });
  }
};

// API: GET /api/cancelaciones/:id (Endpoint faltante)
export const getCancelacionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validarId(id)) {
      return res.status(400).json({ message: "El ID de la cancelación debe ser un ObjectId válido" });
    }

    const cancelacion = await cancelacionesService.getCancelacionById(id, true);
    if (!cancelacion) {
      return res.status(404).json({ message: "Cancelación no encontrada" });
    }

    return res.status(200).json(cancelacion);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al obtener la cancelación" });
  }
};

// API: POST /api/cancelaciones
export const createCancelacion = async (req, res) => {
  try {
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

    const turno = await turnosService.getTurnoById(id_turno);
    if (!turno) {
      return res.status(404).json({ message: "Turno no encontrado" });
    }
    if (turno.estado === "cancelado") {
      return res.status(400).json({ message: "El turno ya está cancelado" });
    }

    const cancelacionExistente = await cancelacionesService.getCancelacionByTurnoId(id_turno);
    if (cancelacionExistente) {
      return res.status(400).json({ message: "Ya existe una cancelación para este turno" });
    }

    const newCancelacion = await cancelacionesService.createCancelacion({
      id_turno,
      motivo: motivoSaneado,
      fecha_cancelacion,
      hora_cancelacion
    });

    let turnoCancelado;
    try {
      turnoCancelado = await turnosService.cancelTurno(id_turno);
    } catch (error) {
      await cancelacionesService.deleteCancelacion(newCancelacion._id);
      throw error;
    }

    if (!turnoCancelado) {
      await cancelacionesService.deleteCancelacion(newCancelacion._id);
      return res.status(404).json({ message: "Turno no encontrado" });
    }

    return res.status(201).json(newCancelacion);
  } catch (error) {
    console.error(error);
    const status = error.status || (error.name === "ValidationError" ? 400 : 500);
    return res.status(status).json({ message: error.message || "Error al crear la cancelación" });
  }
};

// Vistas Pug: GET /vista/cancelaciones
export const renderCancelaciones = async (req, res) => {
  try {
    const { error, success } = req.query;
    const [cancelaciones, turnosReservados] = await Promise.all([
      cancelacionesService.getAllCancelaciones(true),
      turnosService.getAllTurnos({ estado: "reservado" }, true)
    ]);

    return res.render("cancelaciones", {
      title: "Gestión de Cancelaciones",
      cancelaciones,
      turnosReservados,
      error,
      success
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("cancelaciones", {
      title: "Gestión de Cancelaciones",
      cancelaciones: [],
      turnosReservados: [],
      error: "Error interno al cargar cancelaciones"
    });
  }
};

// Vistas Pug: GET /vista/cancelaciones/:id
export const renderCancelacionDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!validarId(id)) {
      return res.status(400).render("cancelaciones", {
        title: "Gestión de Cancelaciones",
        error: "El ID de la cancelación no es válido"
      });
    }

    const cancelacion = await cancelacionesService.getCancelacionById(id, true);
    if (!cancelacion) {
      return res.status(404).render("cancelaciones", {
        title: "Gestión de Cancelaciones",
        error: "Cancelación no encontrada"
      });
    }

    return res.render("cancelacion-detalle", {
      title: `Detalle de Cancelación - ${cancelacion._id}`,
      cancelacion
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("cancelaciones", {
      title: "Gestión de Cancelaciones",
      error: "Error interno al cargar la cancelación"
    });
  }
};

// Vistas Pug: POST /vista/cancelaciones (Procesa alta desde formulario web)
export const crearCancelacionDesdeVista = async (req, res) => {
  try {
    const { id_turno, motivo, fecha_cancelacion, hora_cancelacion } = req.body || {};

    if (!id_turno || !fecha_cancelacion || !hora_cancelacion) {
      return res.redirect(`/vista/cancelaciones?error=${encodeURIComponent("id_turno, fecha_cancelacion y hora_cancelacion son obligatorios")}`);
    }

    const motivoSaneado = sanitizarMotivoCancelacion(motivo);
    if (motivoSaneado.length < MOTIVO_MIN_LENGTH || motivoSaneado.length > MOTIVO_MAX_LENGTH) {
      return res.redirect(`/vista/cancelaciones?error=${encodeURIComponent(`El motivo debe tener entre ${MOTIVO_MIN_LENGTH} y ${MOTIVO_MAX_LENGTH} caracteres`)}`);
    }

    if (!validarId(id_turno)) {
      return res.redirect(`/vista/cancelaciones?error=${encodeURIComponent("id_turno debe ser un ObjectId válido")}`);
    }
    if (!fechaValida(fecha_cancelacion) || typeof hora_cancelacion !== "string" || !horaValida.test(hora_cancelacion)) {
      return res.redirect(`/vista/cancelaciones?error=${encodeURIComponent("fecha_cancelacion y hora_cancelacion deben tener formatos válidos")}`);
    }

    const turno = await turnosService.getTurnoById(id_turno);
    if (!turno) {
      return res.redirect(`/vista/cancelaciones?error=${encodeURIComponent("Turno no encontrado")}`);
    }
    if (turno.estado === "cancelado") {
      return res.redirect(`/vista/cancelaciones?error=${encodeURIComponent("El turno ya está cancelado")}`);
    }

    const cancelacionExistente = await cancelacionesService.getCancelacionByTurnoId(id_turno);
    if (cancelacionExistente) {
      return res.redirect(`/vista/cancelaciones?error=${encodeURIComponent("Ya existe una cancelación para este turno")}`);
    }

    const newCancelacion = await cancelacionesService.createCancelacion({
      id_turno,
      motivo: motivoSaneado,
      fecha_cancelacion,
      hora_cancelacion
    });

    try {
      await turnosService.cancelTurno(id_turno);
    } catch (error) {
      await cancelacionesService.deleteCancelacion(newCancelacion._id);
      throw error;
    }

    return res.redirect(`/vista/cancelaciones?success=${encodeURIComponent("Cancelación registrada exitosamente")}`);
  } catch (error) {
    console.error(error);
    const msg = error.message || "Error al crear la cancelación";
    return res.redirect(`/vista/cancelaciones?error=${encodeURIComponent(msg)}`);
  }
};