import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import config from "./config/config.js";

const app = express();

connectDB();

// Middlewares
app.use(express.json());
app.use(cors());


const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
