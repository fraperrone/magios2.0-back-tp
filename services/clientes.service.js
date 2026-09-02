const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/clientes.json');

//Lee los clientes del archivo data/clientes.json
function readClientes() {
    return JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
}

//Edita/crea el/los cliente/s del archivo data/clientes.json
function writeClientes(clientes) {
    fs.writeFileSync(dataPath, JSON.stringify(clientes, null, 2));
}

// Devuelve todos los clientes
exports.getAll = () => readClientes();

// Busca un cliente por id
exports.getById = (id) => readClientes().find((c) => c.id === Number(id));

// Crea un cliente nuevo, generando un id que no esté en uso
exports.create = (data) => {
    const clientes = readClientes();
    let nextId = clientes.reduce((max, c) => Math.max(max, c.id), 0) + 1;
    while (clientes.some((c) => c.id === nextId)) nextId++;
    const cliente = { id: nextId, nombre: data.nombre, email: data.email, telefono: data.telefono };
    clientes.push(cliente);
    writeClientes(clientes);
    return cliente;
};

// Actualiza los datos de un cliente existente, mantiene el id original
exports.update = (id, data) => {
    const clientes = readClientes();
    const index = clientes.findIndex((c) => c.id === Number(id));
    if (index === -1) return null;
    clientes[index] = { ...clientes[index], ...data, id: clientes[index].id };
    writeClientes(clientes);
    return clientes[index];
};

// Elimina un cliente por id
exports.remove = (id) => {
    const clientes = readClientes();
    const index = clientes.findIndex((c) => c.id === Number(id));
    if (index === -1) return false;
    clientes.splice(index, 1);
    writeClientes(clientes);
    return true;
};
