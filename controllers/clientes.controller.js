// controllers/clientes.controller.js

const clientesService = require('../services/clientes.service');

// Obtener todos los clientes
exports.getClientes = (req, res) => {
  res.json(clientesService.getAll());
};

// Obtener un cliente por ID
exports.getClienteById = (req, res) => {
  const cliente = clientesService.getById(req.params.id);
  if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
  res.json(cliente);
};

// Crear un nuevo cliente
exports.createCliente = (req, res) => {
  const { nombre, email, telefono } = req.body;
  if (!nombre || !email || !telefono) {
    return res.status(400).json({ message: "Faltan datos: nombre, email, telefono" });
  }
  const cliente = clientesService.create({ nombre, email, telefono });
  res.status(201).json(cliente);
};

// Actualizar un cliente existente
exports.updateCliente = (req, res) => {
  const cliente = clientesService.update(req.params.id, req.body);
  if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
  res.json(cliente);
};

// Eliminar un cliente
exports.deleteCliente = (req, res) => {
  const eliminado = clientesService.remove(req.params.id);
  if (!eliminado) return res.status(404).json({ message: "Cliente no encontrado" });
  res.status(204).send();
};
