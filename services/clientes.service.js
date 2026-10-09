const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/clientes.json');


// modificamos con mongoose para que se conecte a la base de datos y no al archivo json
const cliente = require('../models/Cliente.model');


// Devuelve todos los clientes
exports.getAll = async () => {
    return await cliente.find();
}

// Busca un cliente por id
exports.getById = async (id) => {
    return await cliente.findById(id);
}

// Crea un cliente nuevo, generando un id que no esté en uso
exports.create = async (data) => {
    const newCliente = await cliente.create(data);
    return newCliente;
};

// Actualiza los datos de un cliente existente, mantiene el id original
exports.update = async (id, data) => {
    const updatedCliente = await cliente.findByIdAndUpdate(id, data, { new: true });
    return updatedCliente;
};

// Elimina un cliente por id
exports.remove = async (id) => {
    const deletedCliente = await cliente.findByIdAndDelete(id);
    return deletedCliente;
};
   
