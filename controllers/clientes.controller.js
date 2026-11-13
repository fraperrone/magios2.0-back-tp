// controllers/clientes.controller.js

import * as clientesService from "../services/clientes.service.js";

const idValido = (id) => /^[0-9a-fA-F]{24}$/.test(String(id));

// Obtener todos los clientes
export const getClientes = async (req, res) => {
  res.json(await clientesService.getAll());
};

// Obtener un cliente por ID
export const getClienteById = async (req, res) => {
  if (!idValido(req.params.id)) {
    return res.status(400).json({ message: "El ID del cliente debe ser un ObjectId válido" });
  }

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
    if (error.code === 11000) {
      const campo = Object.keys(error.keyPattern || error.keyValue || {})[0] || "dato";
      return res.status(409).json({ message: `El ${campo} ya está en uso` });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    const err = new Error("Error al crear el cliente");
    err.status = 500;
    throw err;
  }
};

// Actualizar un cliente existente
export const updateCliente = async (req, res) => {
  if (!idValido(req.params.id)) {
    return res.status(400).json({ message: "El ID del cliente debe ser un ObjectId válido" });
  }

  try {
    const cliente = await clientesService.update(req.params.id, {
      nombre: req.body.nombre.trim(),
      email: req.body.email.trim(),
      telefono: req.body.telefono.trim(),
    });

    if (!cliente) {
      const err = new Error("Cliente no encontrado");
      err.status = 404;
      throw err;
    }

    res.json(cliente);
  } catch (error) {
    if (error.code === 11000) {
      const campo = Object.keys(error.keyPattern || error.keyValue || {})[0] || "dato";
      return res.status(409).json({ message: `El ${campo} ya está en uso` });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    throw error;
  }
};

// Eliminar un cliente
export const deleteCliente = async (req, res) => {
  if (!idValido(req.params.id)) {
    return res.status(400).json({ message: "El ID del cliente debe ser un ObjectId válido" });
  }

  const eliminado = await clientesService.remove(req.params.id);
  if (!eliminado){
    const err = new Error("Cliente no encontrado");
    err.status = 404;
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