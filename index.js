import express from "express";
import dotenv from "dotenv";
import connectDB from "./mongo/client.js";
import handleErrors from "./middlewares/handleErrors.js";

// Importación de routers
import turnosRouter from "./routes/turnos.routes.js";
import cancelacionesRouter from "./routes/cancelaciones.route.js";
import profesionalesRouter from "./routes/profesionales.route.js";
import clientesRouter from "./routes/clientes.route.js";
import disponibilidadRouter from "./routes/disponibilidad.route.js";
import vistasRouter from "./routes/vistas.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración del motor de plantillas Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Middlewares para parseo de JSON y datos de formularios web
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos
app.use(express.static("public"));

// Ruta raíz
app.get("/", (req, res) => {
  res.render("home", { title: "Inicio - TurnoFlex" });
});

// ==========================================
// Rutas de Vistas UI (Prefijo /vista)
// ==========================================
app.use("/vista", vistasRouter);

// ==========================================
// Rutas de API REST (Prefijo /api)
// ==========================================
app.use("/api/turnos", turnosRouter);
app.use("/api/cancelaciones", cancelacionesRouter);
app.use("/api/profesionales", profesionalesRouter);
app.use("/api/clientes", clientesRouter);
app.use("/api/disponibilidades", disponibilidadRouter);

// ==========================================
// Rutas de compatibilidad hacia atrás
// ==========================================
app.use("/turnos", turnosRouter);
app.use("/cancelaciones", cancelacionesRouter);
app.use("/profesionales", profesionalesRouter);
app.use("/clientes", clientesRouter);
app.use("/disponibilidades", disponibilidadRouter);

// Middleware centralizado de manejo de errores
app.use(handleErrors);

// Conexión a MongoDB y arranque del servidor
await connectDB();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;

