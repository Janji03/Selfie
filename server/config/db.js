import mongoose from "mongoose";
import config from "./config.js";

// Funzione per connettersi al database
const connectDB = async () => {
  try {
    await mongoose.connect(config.dbURI, {});
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
