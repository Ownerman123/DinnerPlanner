import express from "express";
import db from "./config/connection.js";
import path from "path";
import authroutes from "./controllers/authentication/index.js";
import cors from "cors";


const PORT = process.env.PORT || 4001;
const mainUrl = process.env.MAIN_URL || 'http://localhost:5173';
const app = express();
const corsOptions = {
  origin: mainUrl,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH', 'OPTIONS'],
  optionsSuccessStatus: 200

}


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', cors(corsOptions), authroutes);

try {
  await db();
  app.listen(PORT, () => {
    console.log(`Auth server running on port ${PORT}!`);

  });
} catch (error) {
  console.error("Failed to connect to MongoDB", error);
  process.exit(1);
}