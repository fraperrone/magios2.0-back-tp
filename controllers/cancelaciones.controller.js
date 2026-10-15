

import * as cancelacionesService from "../services/cancelaciones.service.js";
import * as turnosService from "../services/turnos.service.js";

const validarId = (id) => /^[0-9a-fA-F]{24}$/.test(String(id));
const horaValida = /^([01]\d|2[0-3]):[0-5]\d$/;
const MOTIVO_MIN_LENGTH = 5;
const MOTIVO_MAX_LENGTH = 300;

export const sanitizarMotivoCancelacion = (motivo) => {
    if (typeof motivo !== 'string') return '';
    return motivo
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
};

const fechaValida = (fecha) => {
    if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
    const [anio, mes, dia] = fecha.split('-').map(Number);
    const fechaParseada = new Date(Date.UTC(anio, mes - 1, dia));
    return fechaParseada.getUTCFullYear() === anio
        && fechaParseada.getUTCMonth() === mes - 1
        && fechaParseada.getUTCDate() === dia;
};


export const getCancelaciones = async (req, res) => {
    try {
        const cancelaciones = await cancelacionesService.getAllCancelaciones();
        return res.json(cancelaciones);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener las cancelaciones' });
    }
};

export const createCancelacion = async (req, res) => {
    try {
        const { id_turno, motivo, fecha_cancelacion, hora_cancelacion } = req.body || {};
        if (!id_turno || !fecha_cancelacion || !hora_cancelacion) {
            return res.status(400).json({ message: 'id_turno, fecha_cancelacion y hora_cancelacion son obligatorios' });
        }

        const motivoSaneado = sanitizarMotivoCancelacion(motivo);
        if (motivoSaneado.length < MOTIVO_MIN_LENGTH || motivoSaneado.length > MOTIVO_MAX_LENGTH) {
            return res.status(400).json({
                message: `El motivo debe tener entre ${MOTIVO_MIN_LENGTH} y ${MOTIVO_MAX_LENGTH} caracteres`
            });
        }

        if (!validarId(id_turno)) {
            return res.status(400).json({ message: 'id_turno debe ser un ObjectId válido' });
        }
        if (!fechaValida(fecha_cancelacion) || typeof hora_cancelacion !== 'string' || !horaValida.test(hora_cancelacion)) {
            return res.status(400).json({ message: 'fecha_cancelacion y hora_cancelacion deben tener formatos válidos' });
        }

        const turno = await turnosService.getTurnoById(id_turno);
        if (!turno) {
            return res.status(404).json({ message: 'Turno no encontrado' });
        }
        // si turno ya esta cancelado, no se puede cancelar
        if (turno.estado === 'cancelado') {
            return res.status(400).json({ message: 'El turno ya está cancelado' });
        }

        const cancelacionExistente = await cancelacionesService.getCancelacionByTurnoId(id_turno);
        if (cancelacionExistente) {
            return res.status(400).json({ message: 'Ya existe una cancelación para este turno' });
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
            return res.status(404).json({ message: 'Turno no encontrado' });
        }

        return res.status(201).json(newCancelacion);
    }
    catch (error) {
        console.error(error);
        const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
        return res.status(status).json({ message: error.message || 'Error al crear la cancelación' });
    }
};