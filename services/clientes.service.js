import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '../data/clientes.json');


// modificamos con mongoose para que se conecte a la base de datos y no al archivo json
import cliente from "../models/Cliente.model.js";


// Devuelve todos los clientes
export const getAll = async () => {
    return await cliente.find();
}

// Busca un cliente por id
export const getById = async (id) => {
    return await cliente.findById(id);
}

// Crea un cliente nuevo, generando un id que no esté en uso
export const create = async (data) => {
    const newCliente = await cliente.create(data);
    return newCliente;
};

// Actualiza los datos de un cliente existente, mantiene el id original
export const update = async (id, data) => {
    const updatedCliente = await cliente.findByIdAndUpdate(id, data, { new: true });
    return updatedCliente;
};

// Elimina un cliente por id
export const remove = async (id) => {
    const deletedCliente = await cliente.findByIdAndDelete(id);
    return deletedCliente;
};
   
