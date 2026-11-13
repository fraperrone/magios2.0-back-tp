import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Cancelacion from './models/Cancelacion.model.js'
import Cliente from './models/Cliente.model.js'
import DisponibilidadHoraria from './models/DisponibilidadHoraria.model.js'
import Profesional from './models/Profesional.model.js'
import Turno from './models/Turno.model.js'

dotenv.config()

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const readData = (fileName) => JSON.parse(
  fs.readFileSync(path.join(rootDir, 'data', fileName), 'utf8'),
)
const objectId = () => new mongoose.Types.ObjectId()
const keyFor = (id) => String(id)

export const runSeed = async () => {
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    throw new Error('La variable MONGODB_URI no está configurada')
  }

  await mongoose.connect(mongoUri)

  try {
    const [profesionales, clientes, disponibilidades, turnos, cancelaciones] = [
      readData('profesionales.json'),
      readData('clientes.json'),
      readData('disponibilidad_horaria.json'),
      readData('turnos.json'),
      readData('cancelaciones.json'),
    ]

    const models = [
      Profesional,
      Cliente,
      DisponibilidadHoraria,
      Turno,
      Cancelacion,
    ]

    for (const model of models) {
      await model.deleteMany({})
    }

    const profesionalIds = new Map(
      profesionales.map(({ id }) => [keyFor(id), objectId()]),
    )
    const clienteIds = new Map(
      clientes.map(({ id }) => [keyFor(id), objectId()]),
    )
    const turnoIds = new Map(
      turnos.map(({ id }) => [keyFor(id), objectId()]),
    )
    const inserted = {
      profesionales: 0,
      clientes: 0,
      disponibilidades: 0,
      turnos: 0,
      cancelaciones: 0,
    }
    const omitted = {
      disponibilidades: 0,
      turnos: 0,
      cancelaciones: 0,
    }

    await Profesional.insertMany(profesionales.map(({ id, ...data }) => ({
      _id: profesionalIds.get(keyFor(id)),
      ...data,
    })))
    inserted.profesionales = profesionales.length

    await Cliente.insertMany(clientes.map(({ id, ...data }) => ({
      _id: clienteIds.get(keyFor(id)),
      ...data,
    })))
    inserted.clientes = clientes.length

    const disponibilidadDocs = disponibilidades.flatMap(({ id, profesionalId, ...data }) => {
      const profesionalObjectId = profesionalIds.get(keyFor(profesionalId))
      if (!profesionalObjectId) {
        console.warn(`WARNING: disponibilidad ${id} omitida: profesional ${profesionalId} inexistente`)
        omitted.disponibilidades += 1
        return []
      }

      return [{ _id: objectId(), profesionalId: profesionalObjectId, ...data }]
    })
    await DisponibilidadHoraria.insertMany(disponibilidadDocs)
    inserted.disponibilidades = disponibilidadDocs.length

    const turnoDocs = turnos.flatMap(({ id, profesionalId, clienteId, ...data }) => {
      const profesionalObjectId = profesionalIds.get(keyFor(profesionalId))
      const clienteObjectId = clienteIds.get(keyFor(clienteId))
      if (!profesionalObjectId || !clienteObjectId) {
        const missing = !profesionalObjectId
          ? `profesional ${profesionalId}`
          : `cliente ${clienteId}`
        console.warn(`WARNING: turno ${id} omitido: ${missing} inexistente`)
        omitted.turnos += 1
        return []
      }

      return [{
        _id: turnoIds.get(keyFor(id)),
        profesionalId: profesionalObjectId,
        clienteId: clienteObjectId,
        ...data,
      }]
    })
    await Turno.insertMany(turnoDocs)
    inserted.turnos = turnoDocs.length

    const cancelacionDocs = cancelaciones.flatMap(
      ({ id_cancelacion, id_turno, ...data }) => {
        const turnoObjectId = turnoIds.get(keyFor(id_turno))
        if (!turnoObjectId || !turnoDocs.some(({ _id }) => _id.equals(turnoObjectId))) {
          console.warn(`WARNING: cancelación ${id_cancelacion} omitida: turno ${id_turno} inexistente`)
          omitted.cancelaciones += 1
          return []
        }

        return [{ _id: objectId(), id_turno: turnoObjectId, ...data }]
      },
    )
    await Cancelacion.insertMany(cancelacionDocs)
    inserted.cancelaciones = cancelacionDocs.length

    console.log('Seed completado:')
    for (const [collection, count] of Object.entries(inserted)) {
      console.log(`  ${collection}: ${count} insertados`)
    }
    for (const [collection, count] of Object.entries(omitted)) {
      console.log(`  ${collection}: ${count} omitidos`)
    }
  } finally {
    await mongoose.disconnect()
  }
}

runSeed().catch((error) => {
  console.error('Error ejecutando el seed:', error.message)
  process.exitCode = 1
})


