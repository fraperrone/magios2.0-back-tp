import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// si no tiene el archivo .env, conecta a mongodb://localhost:27017/turnosdb
const mongoUri = process.env.MONGODB_URI_ATLAS || "mongodb://localhost:27017/turnosdb";

const connectDB = async () => {
  try {
    console.log("intendado conectar a: " + mongoUri)
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;