import mongoose from "mongoose";

const fechaValida = (fecha) => {
  if (typeof fecha !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaParseada = new Date(Date.UTC(anio, mes - 1, dia));
  return fechaParseada.getUTCFullYear() === anio
    && fechaParseada.getUTCMonth() === mes - 1
    && fechaParseada.getUTCDate() === dia;
};

const cancelacionSchema = new mongoose.Schema({
  id_turno: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Turno",
    required: true,
    unique: true
  },
  motivo: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 300
  },
  fecha_cancelacion: {
    type: String,
    required: true,
    validate: {
      validator: fechaValida,
      message: "fecha_cancelacion debe tener el formato YYYY-MM-DD y ser válida"
    }
  },
  hora_cancelacion: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):[0-5]\d$/
  }
}, {
  timestamps: true
});

export default mongoose.model("Cancelacion", cancelacionSchema);