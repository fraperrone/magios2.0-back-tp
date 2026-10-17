import mongoose from "mongoose";
import * as profesionalesService from "../services/profesionales.service.js";

const esObjectIdValido = (id) => mongoose.isValidObjectId(id);
const validarProfesional = (data) => {
  const campos = ['nombre', 'apellido', 'email', 'telefono', 'especialidad', 'matricula']
  return data && campos.every((campo) => typeof data[campo] === 'string' && data[campo].trim())
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
}

// Obtener todos los profesionales
export const getProfesionales = async (req, res) => {
  try {
    res.json(await profesionalesService.getAll())
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Obtener un profesional por ID
export const getProfesionalById = async (req, res) => {
  if (!esObjectIdValido(req.params.id)) {
    return res.status(400).json({ message: 'El ID del profesional no es válido' })
  }
  try {
    const profesional = await profesionalesService.getById(req.params.id)
    if (!profesional) {
      return res.status(404).json({ message: 'Profesional no encontrado' })
    }
    res.json(profesional)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Crear un nuevo profesional
export const createProfesional = async (req, res) => {
  if (!validarProfesional(req.body)) {
    return res.status(400).json({
      message: 'nombre, apellido, email, telefono, especialidad y matricula son obligatorios; email debe ser válido'
    })
  }
  try {
    const profesional = await profesionalesService.create(req.body)
    res.status(201).json(profesional)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message })
    }
    res.status(500).json({ message: error.message })
  }
}

// Actualizar un profesional existente
export const updateProfesional = async (req, res) => {
  if (!esObjectIdValido(req.params.id)) {
    return res.status(400).json({ message: 'El ID del profesional no es válido' })
  }
  if (!validarProfesional(req.body)) {
    return res.status(400).json({
      message: 'nombre, apellido, email, telefono, especialidad y matricula son obligatorios; email debe ser válido'
    })
  }
  try {
    const profesional = await profesionalesService.update(req.params.id, req.body)
    if (!profesional) {
      return res.status(404).json({ message: 'Profesional no encontrado' })
    }
    res.json(profesional)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'La matrícula o el email ya están en uso por otro profesional' })
    }
    if (error.status) {
      return res.status(error.status).json({ message: error.message })
    }
    res.status(500).json({ message: error.message })
  }
}

// Eliminar un profesional
export const deleteProfesional = async (req, res) => {
  if (!esObjectIdValido(req.params.id)) {
    return res.status(400).json({ message: 'El ID del profesional no es válido' })
  }
  try {
    const profesional = await profesionalesService.remove(req.params.id)
    if (!profesional) {
      return res.status(404).json({ message: 'Profesional no encontrado' })
    }
    res.json({ message: 'Profesional eliminado' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Vistas
export const renderProfesionales = async (req, res) => {
  const profesionales = await profesionalesService.getAll();
  res.render("profesionales", { profesionales });
}

export const renderProfesionalById = async (req, res) => {
  const profesional = await profesionalesService.getById(req.params.id);
  res.render("profesional-detalle", { profesional });
}