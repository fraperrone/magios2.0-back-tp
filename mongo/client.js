const dotenv = require("dotenv");

dotenv.config();

const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI;

console.log("MongoDB URI:", mongoUri); // Log the MongoDB URI for debugging

const connectDB = async () => {
  await mongoose
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
