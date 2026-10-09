const mongoose = require("mongoose");
const Cliente = require("./models/Cliente.model");
const fs = require("fs");
require("dotenv").config();

filePath = "./data/clientes.json"; // Ruta al archivo JSON

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB Atlas");

    // Leer archivo JSON
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    // Insertar en la colección
    await Cliente.insertMany(data);
    console.log("Datos importados correctamente");

    mongoose.connection.close();
  } catch (err) {
    console.error("Error importando:", err);
  }
};

run();
