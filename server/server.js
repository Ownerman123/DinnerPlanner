import express from "express";
import db from "./config/connection.js";
import path from "path";
import api from "./controllers/api/index.js";
import cors from "cors";


const PORT = process.env.PORT || 3001;
const mainUrl = process.env.MAIN_URL || 'http://localhost:5173';
const app = express();
const corsOptions = {
  origin: mainUrl,
  optionsSuccessStatus: 200

}


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/api',cors(corsOptions), api);

try {
    await db();
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
     
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }