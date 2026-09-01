const express = require("express");
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta básica
app.get("/", (req, res) => {
  res.send("Servidor Express funcionando 🚀");
});

// Puerto de escucha
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
