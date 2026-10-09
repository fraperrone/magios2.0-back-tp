const express = require("express");
const app = express();
const profesionalesRouter = require("./routes/profesionales.route");
const clientesRouter = require("./routes/clientes.route");
const turnosRouter = require("./routes/turnos.routes");
const disponibilidadRouter = require("./routes/disponibilidad.route");
const cancelacionesRouter = require("./routes/cancelaciones.route");
const connectDB = require("./mongo/client");
const handleErrors = require("./middlewares/handleErrors");

app.set("view engine", "pug");
app.set("views", "./views");

// conexion a mongodb

connectDB();

// Middleware para parsear JSON
app.use(express.json());

// Ruta básica
app.get("/", (req, res) => {
  res.render("home", { title: "Home Page" });
});

app.use("/profesionales", profesionalesRouter);
app.use("/clientes", clientesRouter);
app.use("/cancelaciones", cancelacionesRouter);
app.use("/turnos", turnosRouter);
app.use("/disponibilidades", disponibilidadRouter);


app.use(handleErrors);

// Puerto de escucha
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
