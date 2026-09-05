const fs = require('fs');
const path = require('path');
const profesionalesService = require('./profesionales.service');

const dataPath = path.join(__dirname, '../data/disponibilidad_horaria.json');


function readDisponibilidad() {
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    } catch {
        return [];
    }
}

function writeDisponibilidad(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

// Convierte una hora en formato "hh:mm" a minutos
function timeToMinutes(timeStr) {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
}

// Verifica si hay solapamiento entre franjas horarias
function haySolapamiento(franjas, diaSemana, horaInicio, horaFin, excludeId = null) {
    const inicio = timeToMinutes(horaInicio);
    const fin = timeToMinutes(horaFin);
    let haySolapamiento = false;

    for (const f of franjas) {
        if (f.id === excludeId) continue; // Ignora si es la misma franja
        if (f.diaSemana !== diaSemana) continue; // Si es diferente dia sigue comparando

        const fi = timeToMinutes(f.horaInicio);
        const ff = timeToMinutes(f.horaFin);

        if (inicio < ff && fi < fin) {
            haySolapamiento = true;
            break;
        }
    }
    return haySolapamiento;
}

// Devuelve todas las franjas horarias de profesional que coincide con la id
exports.getByProfesional = (profesionalId) => {
    return readDisponibilidad().filter(f => f.profesionalId === Number(profesionalId));
};

exports.create = (profesionalId, { diaSemana, horaInicio, horaFin }) => {
    // Validar profesional existe
    const prof = profesionalesService.getById(profesionalId);
    if (!prof) throw new Error('PROFESIONAL_NO_EXISTE');

    // Validar dia
    const dia = Number(diaSemana);
    if (!Number.isInteger(dia) || dia < 1 || dia > 7) throw new Error('DIA_INVALIDO');

    // Validar horas
    if (timeToMinutes(horaInicio) >= timeToMinutes(horaFin)) throw new Error('HORA_INVALIDA');

    // Validar solapamiento
    const todas = readDisponibilidad();
    if (haySolapamiento(todas, dia, horaInicio, horaFin)) throw new Error('SOLAPAMIENTO');

    // Busca id mas alto y le suma 1
    const nextId = todas.reduce((max, f) => Math.max(max, f.id), 0) + 1;

    const nueva = { id: nextId, profesionalId: Number(profesionalId), diaSemana: dia, horaInicio, horaFin };
    todas.push(nueva);
    writeDisponibilidad(todas);
    return nueva;
};

exports.update = (id, profesionalId, { diaSemana, horaInicio, horaFin }) => {
    const todas = readDisponibilidad();
    const index = todas.findIndex(f => f.id === Number(id) && f.profesionalId === Number(profesionalId));
    if (index === -1) return null;

    const dia = Number(diaSemana);
    if (!Number.isInteger(dia) || dia < 1 || dia > 7) throw new Error('DIA_INVALIDO');
    if (timeToMinutes(horaInicio) >= timeToMinutes(horaFin)) throw new Error('HORA_INVALIDA');
    if (haySolapamiento(todas, dia, horaInicio, horaFin, Number(id))) throw new Error('SOLAPAMIENTO');

    todas[index].diaSemana = dia;
    todas[index].horaInicio = horaInicio;
    todas[index].horaFin = horaFin;

    writeDisponibilidad(todas);
    return todas[index];
};

exports.remove = (id, profesionalId) => {
    const todas = readDisponibilidad();
    const index = todas.findIndex(f => f.id === Number(id) && f.profesionalId === Number(profesionalId));
    if (index === -1) return false; // No existe

    todas.splice(index, 1);
    writeDisponibilidad(todas);
    return true;
};