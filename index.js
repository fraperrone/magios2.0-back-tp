const express = require("express");
const app = express();
const profesionalesRouter = require("./routes/profesionales.route");


app.set("view engine", "pug");
app.set("views", "./views");

// Middleware para parsear JSON
app.use(express.json());

// Ruta básica
app.get("/", (req, res) => {
  res.render("home", { title: "Home Page" });
});

app.use('/profesionales', profesionalesRouter);

// Puerto de escucha
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
