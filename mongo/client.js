import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

const connectDB = async () => {
  if (!mongoUri) {
    console.warn(
      "MONGODB_URI no está configurada. Continuando sin conexión a base de datos.",
    );
    return;
  }

  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.warn(
      "Error connecting to MongoDB:",
      error.name || "Unknown error",
      "- el servidor continúa en ejecución pero la base de datos no está disponible",
    );
  }
};

export default connectDB;