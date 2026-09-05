const disponibilidadService = require('../services/disponibilidad.service');

const ERROR_MAP = {
  'PROFESIONAL_NO_EXISTE': 404,
  'DIA_INVALIDO': 400,
  'HORA_INVALIDA': 400,
  'SOLAPAMIENTO': 409
};

function handleError(res, error) {
  const status = ERROR_MAP[error.message] || 500;
  res.status(status).json({ error: error.message });
}

exports.getDisponibilidad = (req, res) => {
  try {
    const profesionalId = Number(req.params.id);
    const franjas = disponibilidadService.getByProfesional(profesionalId);
    res.json(franjas);
  } catch (error) {
    handleError(res, error);
  }
};

exports.createDisponibilidad = (req, res) => {
  try {
    const profesionalId = Number(req.params.id);
    const { diaSemana, horaInicio, horaFin } = req.body || {};
    const franja = disponibilidadService.create(profesionalId, { diaSemana, horaInicio, horaFin });
    res.status(201).json(franja);
  } catch (error) {
    handleError(res, error);
  }
};

exports.updateDisponibilidad = (req, res) => {
  try {
    const profesionalId = Number(req.params.id);
    const franjaId = Number(req.params.idFranja);
    const { diaSemana, horaInicio, horaFin } = req.body || {};
    const franja = disponibilidadService.update(franjaId, profesionalId, { diaSemana, horaInicio, horaFin });
    if (!franja) return res.status(404).json({ error: 'FRANJA_NO_ENCONTRADA' });
    res.json(franja);
  } catch (error) {
    handleError(res, error);
  }
};

exports.deleteDisponibilidad = (req, res) => {
  try {
    const profesionalId = Number(req.params.id);
    const franjaId = Number(req.params.idFranja);
    const eliminado = disponibilidadService.remove(franjaId, profesionalId);
    if (!eliminado) return res.status(404).json({ error: 'FRANJA_NO_ENCONTRADA' });
    res.status(204).send();
  } catch (error) {
    handleError(res, error);
  }
};