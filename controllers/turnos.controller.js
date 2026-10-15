import mongoose from "mongoose";
import * as profesionalesService from "../services/profesionales.service.js";
import * as clientesService from "../services/clientes.service.js";
import * as turnosService from "../services/turnos.service.js";
import DisponibilidadService from "../services/disponibilidad.service.js";

const disponibilidadService = new DisponibilidadService();
const estadosValidos = ["reservado", "cancelado", "atendido"];
const horaValida = /^([01]\d|2[0-3]):[0-5]\d$/;
const diasSemana = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

const fechaValida = (fecha) => {
  if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaParseada = new Date(Date.UTC(anio, mes - 1, dia));
  return fechaParseada.getUTCFullYear() === anio
    && fechaParseada.getUTCMonth() === mes - 1
    && fechaParseada.getUTCDate() === dia;
};

const idMongoValido = (id) => mongoose.isObjectIdOrHexString(id);
const conflictoDuplicado = (error) => error?.code === 11000;

// API: GET /api/turnos
export const obtenerTurnos = async (req, res) => {
  try {
    const { profesionalId, clienteId, fecha, estado } = req.query;
    const filters = {};

    if (profesionalId !== undefined) {
      if (!idMongoValido(profesionalId)) {
        return res.status(400).json({ error: "profesionalId debe ser un ObjectId válido" });
      }
      filters.profesionalId = profesionalId;
    }
    if (clienteId !== undefined) {
      if (!idMongoValido(clienteId)) {
        return res.status(400).json({ error: "clienteId debe ser un ObjectId válido" });
      }
      filters.clienteId = clienteId;
    }
    if (fecha !== undefined) {
      if (!fechaValida(fecha)) {
        return res.status(400).json({ error: "fecha debe tener el formato YYYY-MM-DD y ser válida" });
      }
      filters.fecha = fecha;
    }
    if (estado !== undefined) {
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: "estado debe ser reservado, cancelado o atendido" });
      }
      filters.estado = estado;
    }

    const turnos = await turnosService.getAllTurnos(filters);
    return res.status(200).json(turnos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener los turnos" });
  }
};

// API: GET /api/turnos/:id (Endpoint faltante)
export const obtenerTurnoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!idMongoValido(id)) {
      return res.status(400).json({ error: "El ID del turno debe ser un ObjectId válido" });
    }

    const turno = await turnosService.getTurnoById(id, true);
    if (!turno) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    return res.status(200).json(turno);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al obtener el turno" });
  }
};

// API: POST /api/turnos
export const crearTurno = async (req, res) => {
  try {
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

    if (!await profesionalesService.getById(profesionalId)) {
      return res.status(404).json({ error: "El profesional indicado no existe" });
    }
    if (!await clientesService.getById(clienteId)) {
      return res.status(404).json({ error: "El cliente indicado no existe" });
    }

    const dia = diasSemana[new Date(`${fecha}T00:00:00.000Z`).getUTCDay()];
    const disponibilidades = await disponibilidadService.getByProfesional(profesionalId);
    const tieneDisponibilidad = disponibilidades.some((franja) =>
      franja.activo !== false
      && franja.dia === dia
      && franja.horaInicio <= hora
      && hora < franja.horaFin
    );
    if (!tieneDisponibilidad) {
      return res.status(400).json({ error: "El profesional no tiene disponibilidad en ese horario" });
    }

    if (await turnosService.getReservedByProfessional(profesionalId, fecha, hora)) {
      return res.status(409).json({ error: "El profesional ya tiene un turno reservado en ese horario" });
    }
    if (await turnosService.getReservedByClient(clienteId, fecha, hora)) {
      return res.status(409).json({ error: "El cliente ya tiene un turno reservado a esa hora" });
    }

    const turno = await turnosService.createTurno({
      profesionalId,
      clienteId,
      fecha,
      hora,
      estado: "reservado"
    });

    return res.status(201).json({
      mensaje: "Turno reservado exitosamente",
      turno
    });
  } catch (error) {
    console.error(error);
    if (conflictoDuplicado(error)) {
      return res.status(409).json({ error: "El turno se superpone con una reserva existente" });
    }
    return res.status(500).json({ error: "Error interno al reservar el turno" });
  }
};

// API: PATCH /api/turnos/:id/estado y PUT /api/turnos/:id
export const cambiarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body || {};

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: "Estado no válido. Use: reservado, cancelado o atendido" });
    }
    if (!idMongoValido(id)) {
      return res.status(400).json({ error: "El ID del turno debe ser un ObjectId válido" });
    }

    const turno = await turnosService.getTurnoById(id);
    if (!turno) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    if (estado === "reservado") {
      const [profesionalOcupado, clienteDuplicado] = await Promise.all([
        turnosService.getReservedByProfessional(turno.profesionalId, turno.fecha, turno.hora, id),
        turnosService.getReservedByClient(turno.clienteId, turno.fecha, turno.hora, id)
      ]);
      if (profesionalOcupado) {
        return res.status(409).json({ error: "El profesional ya tiene otro turno reservado en ese horario" });
      }
      if (clienteDuplicado) {
        return res.status(409).json({ error: "El cliente ya tiene otro turno reservado en ese horario" });
      }
    }

    const turnoActualizado = await turnosService.updateTurno(id, { estado });
    if (!turnoActualizado) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }
    return res.status(200).json({
      mensaje: `El turno cambió a estado: ${estado}`,
      turno: turnoActualizado
    });
  } catch (error) {
    console.error(error);
    if (conflictoDuplicado(error)) {
      return res.status(409).json({ error: "El turno se superpone con una reserva existente" });
    }
    return res.status(500).json({ error: "Error al actualizar el estado del turno" });
  }
};

// API: DELETE /api/turnos/:id (Endpoint faltante)
export const eliminarTurno = async (req, res) => {
  try {
    const { id } = req.params;
    if (!idMongoValido(id)) {
      return res.status(400).json({ error: "El ID del turno debe ser un ObjectId válido" });
    }

    const eliminado = await turnosService.deleteTurno(id);
    if (!eliminado) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al eliminar el turno" });
  }
};

// Vistas Pug: GET /vista/turnos
export const renderTurnos = async (req, res) => {
  try {
    const { profesionalId, clienteId, fecha, estado, error, success } = req.query;
    const filters = {};

    if (profesionalId && idMongoValido(profesionalId)) filters.profesionalId = profesionalId;
    if (clienteId && idMongoValido(clienteId)) filters.clienteId = clienteId;
    if (fecha && fechaValida(fecha)) filters.fecha = fecha;
    if (estado && estadosValidos.includes(estado)) filters.estado = estado;

    const [turnos, profesionales, clientes] = await Promise.all([
      turnosService.getAllTurnos(filters, true),
      profesionalesService.getAll(),
      clientesService.getAll()
    ]);

    return res.render("turnos", {
      title: "Gestión de Turnos",
      turnos,
      profesionales,
      clientes,
      filtros: req.query,
      error,
      success
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("turnos", {
      title: "Gestión de Turnos",
      turnos: [],
      profesionales: [],
      clientes: [],
      filtros: req.query,
      error: "Error interno al cargar los turnos"
    });
  }
};

// Vistas Pug: GET /vista/turnos/:id
export const renderTurnoDetalle = async (req, res) => {
  try {
    const { id } = req.params;
    if (!idMongoValido(id)) {
      return res.status(400).render("turnos", {
        title: "Gestión de Turnos",
        error: "El ID del turno no es válido"
      });
    }

    const turno = await turnosService.getTurnoById(id, true);
    if (!turno) {
      return res.status(404).render("turnos", {
        title: "Gestión de Turnos",
        error: "Turno no encontrado"
      });
    }

    return res.render("turno-detalle", {
      title: `Detalle de Turno - ${turno._id}`,
      turno
    });
  } catch (err) {
    console.error(err);
    return res.status(500).render("turnos", {
      title: "Gestión de Turnos",
      error: "Error interno al cargar el detalle del turno"
    });
  }
};

// Vistas Pug: POST /vista/turnos (Procesa el alta desde el formulario web)
export const crearTurnoDesdeVista = async (req, res) => {
  try {
    const { profesionalId, clienteId, fecha, hora } = req.body || {};

    if (!profesionalId || !clienteId || !fecha || !hora) {
      return res.redirect(`/vista/turnos?error=${encodeURIComponent("Todos los campos son obligatorios")}`);
    }
    if (!idMongoValido(profesionalId) || !idMongoValido(clienteId)) {
      return res.redirect(`/vista/turnos?error=${encodeURIComponent("profesionalId y clienteId deben ser ObjectId válidos")}`);
    }
    if (!fechaValida(fecha)) {
      return res.redirect(`/vista/turnos?error=${encodeURIComponent("La fecha debe ser válida y tener el formato YYYY-MM-DD")}`);
    }
    if (typeof hora !== "string" || !horaValida.test(hora)) {
      return res.redirect(`/vista/turnos?error=${encodeURIComponent("La hora debe tener el formato HH:MM")}`);
    }

    if (!await profesionalesService.getById(profesionalId)) {
      return res.redirect(`/vista/turnos?error=${encodeURIComponent("El profesional indicado no existe")}`);
    }
    if (!await clientesService.getById(clienteId)) {
      return res.redirect(`/vista/turnos?error=${encodeURIComponent("El cliente indicado no existe")}`);
    }

    const dia = diasSemana[new Date(`${fecha}T00:00:00.000Z`).getUTCDay()];
    const disponibilidades = await disponibilidadService.getByProfesional(profesionalId);
    const tieneDisponibilidad = disponibilidades.some((franja) =>
      franja.activo !== false
      && franja.dia === dia
      && franja.horaInicio <= hora
      && hora < franja.horaFin
    );
    if (!tieneDisponibilidad) {
      return res.redirect(`/vista/turnos?error=${encodeURIComponent("El profesional no tiene disponibilidad en ese horario")}`);
    }

    if (await turnosService.getReservedByProfessional(profesionalId, fecha, hora)) {
      return res.redirect(`/vista/turnos?error=${encodeURIComponent("El profesional ya tiene un turno reservado en ese horario")}`);
    }
    if (await turnosService.getReservedByClient(clienteId, fecha, hora)) {
      return res.redirect(`/vista/turnos?error=${encodeURIComponent("El cliente ya tiene un turno reservado a esa hora")}`);
    }

    await turnosService.createTurno({
      profesionalId,
      clienteId,
      fecha,
      hora,
      estado: "reservado"
    });

    return res.redirect(`/vista/turnos?success=${encodeURIComponent("Turno reservado exitosamente")}`);
  } catch (error) {
    console.error(error);
    const msg = conflictoDuplicado(error)
      ? "El turno se superpone con una reserva existente"
      : "Error interno al reservar el turno";
    return res.redirect(`/vista/turnos?error=${encodeURIComponent(msg)}`);
  }
};

// Vistas Pug: POST /vista/turnos/:id/eliminar
export const eliminarTurnoDesdeVista = async (req, res) => {
  try {
    const { id } = req.params;
    if (!idMongoValido(id)) {
      return res.redirect(`/vista/turnos?error=${encodeURIComponent("ID no válido")}`);
    }
    const eliminado = await turnosService.deleteTurno(id);
    if (!eliminado) {
      return res.redirect(`/vista/turnos?error=${encodeURIComponent("Turno no encontrado")}`);
    }
    return res.redirect(`/vista/turnos?success=${encodeURIComponent("Turno eliminado exitosamente")}`);
  } catch (err) {
    console.error(err);
    return res.redirect(`/vista/turnos?error=${encodeURIComponent("Error al eliminar el turno")}`);
  }
};
