// controllers/clientes.controller.js

const clientesService = require("../services/clientes.service");


// Obtener todos los clientes
exports.getClientes = async (req, res) => {
  res.json(await clientesService.getAll());
};

// Obtener un cliente por ID
exports.getClienteById = async (req, res) => {
  const cliente = await clientesService.getById(req.params.id);
  if (!cliente) {
    const err = new Error("Cliente no encontrado");
    err.status = 404;
    throw err;
  }
  res.json(cliente);
};

// Crear un nuevo cliente
exports.createCliente = async (req, res) => {
  const { nombre, email, telefono } = req.body || {};
  try {
    const cliente = await clientesService.create({
      nombre: nombre.trim(),
      email: email.trim(),
      telefono: telefono.trim(),
    });
    res.status(201).json(cliente);
  } catch (error) {
    const err = new Error("Error al crear el cliente");
    err.status = 500;
    throw err;
  }
};

// Actualizar un cliente existente
exports.updateCliente = async (req, res) => {
  const cliente = await clientesService.update(req.params.id, {
    nombre: req.body.nombre.trim(),
    email: req.body.email.trim(),
    telefono: req.body.telefono.trim(),
  });
  if (!cliente){
    const err = new Error("Cliente no encontrado");
    err.stack = 404;
    throw err;
  }
    
  res.json(cliente);
};

// Eliminar un cliente
exports.deleteCliente = async (req, res) => {
  const eliminado = await clientesService.remove(req.params.id);
  if (!eliminado){
    const err = new Error("Cliente no encontrado");
    err.cause = 404;
    throw err;
  }
    
  res.status(204).send();
};
