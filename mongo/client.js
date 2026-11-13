import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

const connectDB = async () => {
  if (!mongoUri) {
    console.error(
      "MONGODB_URI no está configurada. Copia .env.example como .env y configura la URI de MongoDB.",
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error(
      "Error connecting to MongoDB:",
      error.name || "Unknown error",
      "- verify MONGODB_URI and database availability",
    );
    process.exit(1);
  }
};

export default connectDB;