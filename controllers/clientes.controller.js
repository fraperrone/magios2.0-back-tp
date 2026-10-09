// controllers/clientes.controller.js

const clientesService = require('../services/clientes.service');

const validarId = (id) => /^\d+$/.test(String(id));
const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validarCliente = (data) => {
  const { nombre, email, telefono } = data || {};
  return typeof nombre === 'string' && nombre.trim()
    && typeof email === 'string' && emailValido(email)
    && typeof telefono === 'string' && telefono.trim();
};

// Obtener todos los clientes
exports.getClientes = async (req, res) => {
  res.json(await clientesService.getAll());
};

// Obtener un cliente por ID
exports.getClienteById = async (req, res) => {
  if (!validarId(req.params.id)) {
    return res.status(400).json({ message: 'El ID del cliente debe ser un número entero' });
  }
  const cliente = await clientesService.getById(req.params.id);
  if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
  res.json(cliente);
};

// Crear un nuevo cliente
exports.createCliente = async (req, res) => {
  const { nombre, email, telefono } = req.body || {};
  if (!validarCliente({ nombre, email, telefono })) {
    return res.status(400).json({
      message: 'nombre, email y telefono son obligatorios; email debe tener un formato válido'
    });
  }
  try {
    const cliente = await clientesService.create({ nombre: nombre.trim(), email: email.trim(), telefono: telefono.trim() });
    res.status(201).json(cliente);
  } catch (error) {
    res.status(500).json({ message: 'No se pudo crear el cliente' });
  }
};

// Actualizar un cliente existente
exports.updateCliente = async (req, res) => {
  if (!validarId(req.params.id)) {
    return res.status(400).json({ message: 'El ID del cliente debe ser un número entero' });
  }
  if (!validarCliente(req.body)) {
    return res.status(400).json({
      message: 'nombre, email y telefono son obligatorios; email debe tener un formato válido'
    });
  }
  const cliente = await clientesService.update(req.params.id, {
    nombre: req.body.nombre.trim(),
    email: req.body.email.trim(),
    telefono: req.body.telefono.trim()
  });
  if (!cliente) return res.status(404).json({ message: "Cliente no encontrado" });
  res.json(cliente);
};

// Eliminar un cliente
exports.deleteCliente = async (req, res) => {
  if (!validarId(req.params.id)) {
    return res.status(400).json({ message: 'El ID del cliente debe ser un número entero' });
  }
  const eliminado = await clientesService.remove(req.params.id);
  if (!eliminado) return res.status(404).json({ message: "Cliente no encontrado" });
  res.status(204).send();
};
