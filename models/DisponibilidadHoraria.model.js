import mongoose from "mongoose";

const disponibilidadHorariaSchema = new mongoose.Schema({
  profesionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profesional",
    required: true
  },
  dia: {
    type: String,
    required: true,
    enum: ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"]
  },
  horaInicio: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/
  },
  horaFin: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

disponibilidadHorariaSchema.index(
  { profesionalId: 1, dia: 1, horaInicio: 1, horaFin: 1 },
  { unique: true }
);

export default mongoose.model("DisponibilidadHoraria", disponibilidadHorariaSchema);