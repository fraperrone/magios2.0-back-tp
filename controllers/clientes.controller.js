// controllers/clientes.controller.js

import * as clientesService from "../services/clientes.service.js";


// Obtener todos los clientes
export const getClientes = async (req, res) => {
  res.json(await clientesService.getAll());
};

// Obtener un cliente por ID
export const getClienteById = async (req, res) => {
  const cliente = await clientesService.getById(req.params.id);
  if (!cliente) {
    const err = new Error("Cliente no encontrado");
    err.status = 404;
    throw err;
  }
  res.json(cliente);
};

// Crear un nuevo cliente
export const createCliente = async (req, res) => {
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
export const updateCliente = async (req, res) => {
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
export const deleteCliente = async (req, res) => {
  const eliminado = await clientesService.remove(req.params.id);
  if (!eliminado){
    const err = new Error("Cliente no encontrado");
    err.cause = 404;
    throw err;
  }
    
  res.status(204).send();
};

// parte de vistas
// controlador de vistas para clientes

export const renderClientes = async (req, res) => {
  const clientes = await clientesService.getAll();
  res.render("clientes", { clientes });
}

// mostrar por id

export const renderClienteById = async (req, res) => {
  const cliente = await clientesService.getById(req.params.id);
  res.render("cliente-detalle", { cliente });
}