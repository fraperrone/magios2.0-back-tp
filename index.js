const express = require("express");
const app = express();
const profesionalesRouter = require("./routes/profesionales.route");
const clientesRouter = require("./routes/clientes.route");
const turnosRouter = require("./routes/turnos.routes");
const disponibilidadRouter = require("./routes/disponibilidad.route");
const cancelacionesRouter = require("./routes/cancelaciones.route");

app.set("view engine", "pug");
app.set("views", "./views");

// Middleware para parsear JSON
app.use(express.json());

// Ruta básica
app.get("/", (req, res) => {
  res.render("home", { title: "Home Page" });
});

app.use('/profesionales', profesionalesRouter);
app.use('/clientes', clientesRouter);
app.use('/cancelaciones', cancelacionesRouter);
app.use('/turnos', turnosRouter);
app.use('/disponibilidades', disponibilidadRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ error: 'El body debe contener JSON válido' });
  }
  console.error(error);
  res.status(500).json({ error: 'Error interno del servidor' });
});




// Puerto de escucha
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
