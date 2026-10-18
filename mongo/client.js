const dotenv = require("dotenv");

dotenv.config();

const mongoose = require("mongoose");

// si no tiene el archivo .env, conecta a mongodb://localhost:27017/

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/turnosdb"; // Default URI if not provided in .env

console.log("MongoDB URI:", mongoUri); // Log the MongoDB URI for debugging

const connectDB = async () => {
   mongoose
    .connect(mongoUri)
    .then(() => {
      console.log("Connected to MongoDB successfully");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    });
};

module.exports = connectDB;
