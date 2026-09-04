const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/profesionales.json');

//Lee los profesionales del archivo data/profesionales.json
function readProfesionales() {
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

//Edita/crea el/los profesional/es del archivo data/profesionales.json
function writeProfesionales(profesionales) {
    fs.writeFileSync(dataPath, JSON.stringify(profesionales, null, 2));
}

// Devuelve todos los profesionales
exports.getAll = () => readProfesionales();

// Busca un profesional por id
exports.getById = (id) => readProfesionales().find((p) => p.id === Number(id));

// Crea un profesional nuevo, generando un id que no esté en uso
exports.create = (data) => {
    const profesionales = readProfesionales();
    let nextId = profesionales.reduce((max, p) => Math.max(max, p.id), 0) + 1;
    while (profesionales.some((p) => p.id === nextId)) nextId++;
    const profesional = { id: nextId, nombre: data.nombre, email: data.email, telefono: data.telefono };
    profesionales.push(profesional);
    writeProfesionales(profesionales);
    return profesional;
};

// Actualiza los datos de un profesional existente, mantiene el id original
exports.update = (id, data) => {
    const profesionales = readProfesionales();
    const index = profesionales.findIndex((p) => p.id === Number(id));
    if (index === -1) return null;
    profesionales[index] = { ...profesionales[index], ...data, id: profesionales[index].id };
    writeProfesionales(profesionales);
    return profesionales[index];
};

exports.delete = (id) => {
    const profesionales = readProfesionales();
    const index = profesionales.findIndex((p) => p.id === Number(id));
    if (index === -1) return null;
    const [deleted] = profesionales.splice(index, 1);
    writeProfesionales(profesionales);
    return deleted;
};