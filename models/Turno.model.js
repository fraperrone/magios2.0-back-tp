import mongoose from "mongoose";

const fechaValida = (fecha) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const fechaParseada = new Date(Date.UTC(anio, mes - 1, dia));
  return fechaParseada.getUTCFullYear() === anio
    && fechaParseada.getUTCMonth() === mes - 1
    && fechaParseada.getUTCDate() === dia;
};

const turnoSchema = new mongoose.Schema({
  profesionalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profesional",
    required: true
  },
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true
  },
  fecha: {
    type: String,
    required: true,
    validate: {
      validator: fechaValida,
      message: "fecha debe tener el formato YYYY-MM-DD y ser válida"
    }
  },
  hora: {
    type: String,
    required: true,
    match: /^([01]\d|2[0-3]):([0-5]\d)$/
  },
  estado: {
    type: String,
    enum: ["reservado", "cancelado", "atendido"],
    default: "reservado",
    required: true
  }
}, {
  timestamps: true
});

turnoSchema.index(
  { profesionalId: 1, fecha: 1, hora: 1 },
  {
    unique: true,
    partialFilterExpression: { estado: "reservado" }
  }
);

turnoSchema.index(
  { clienteId: 1, fecha: 1, hora: 1 },
  {
    unique: true,
    partialFilterExpression: { estado: "reservado" }
  }
);

export default mongoose.model("Turno", turnoSchema);
