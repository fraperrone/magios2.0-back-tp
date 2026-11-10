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
import { getToken } from "./auth/getToken.js";
import { logout } from "./auth/logout.js";
import { authMiddleware } from "./auth/authMiddleware.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

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

// Middleware para cookies
app.use(cookieParser());

// ==========================================
// Rutas de Autenticación y Sesión
// ==========================================
app.get("/", (req, res) => {
  // Si ya tiene sesión válida, redirigir a /home
  const token = req.cookies?.token;
  if (token && process.env.JWT_SECRET) {
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.redirect("/home");
    } catch {
      // Token inválido o expirado, muestra pantalla de login
    }
  }
  res.render("login");
});

app.post("/login", getToken);
app.get("/logout", logout);
app.post("/logout", logout);

app.get("/home", authMiddleware, (req, res) => {
  res.render("home", { title: "Inicio - TurnoFlex" });
});

// ==========================================
// Rutas de Vistas UI (Prefijo unificado /vista)
// ==========================================
app.use("/vista", authMiddleware, vistasRouter);

// ==========================================
// Rutas de API REST (Prefijo unificado /api)
// ==========================================
app.use("/api", authMiddleware);
app.post("/api/logout", logout);
app.get("/api/logout", logout);
app.use("/api/turnos", turnosRouter);
app.use("/api/cancelaciones", cancelacionesRouter);
app.use("/api/profesionales", profesionalesRouter);
app.use("/api/clientes", clientesRouter);
app.use("/api/disponibilidades", disponibilidadRouter);

// ==========================================
// Rutas de compatibilidad hacia atrás
// ==========================================
app.use("/turnos", authMiddleware, turnosRouter);
app.use("/cancelaciones", authMiddleware, cancelacionesRouter);
app.use("/profesionales", authMiddleware, profesionalesRouter);
app.use("/clientes", authMiddleware, clientesRouter);
app.use("/disponibilidades", authMiddleware, disponibilidadRouter);

// Middleware para manejar caídas o desconexión de MongoDB con respuesta controlada
app.use((err, req, res, next) => {
  if (
    err.name === "MongooseError" ||
    err.name === "MongoNetworkError" ||
    err.name === "MongooseServerSelectionError" ||
    err.message?.includes("buffering timed out")
  ) {
    console.warn("[TurnoFlex] Base de datos no conectada:", err.message);
    if (req.method === "GET") {
      if (req.accepts("html") && !req.path.startsWith("/api")) {
        return res.render("home", {
          title: "TurnoFlex",
          error: "Base de datos desconectada. Configure MONGODB_URI en .env para persistencia completa."
        });
      }
      return res.json(req.path.endsWith("s") || req.path.endsWith("s/") ? [] : {});
    }
    return res.status(503).json({ error: "Servicio temporalmente no disponible (base de datos desconectada)" });
  }
  next(err);
});

// Middleware centralizado de manejo de errores
app.use(handleErrors);

// Conexión a MongoDB y arranque del servidor
await connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
});

export default app;
