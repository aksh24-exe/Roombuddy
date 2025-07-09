import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/user.route.js";
import roomRoutes from "./routes/room.route.js";
import db from "./utils/db.js";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const allowedOrigins = ["http://127.0.0.1:5500", "http://localhost:5500"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, 'public')));

const PORT = process.env.PORT || 4000;

// app.get("/", (req, res) => {
//   res.send("Hello World");
// });

app.use("/api/v1/user", authRoutes);
app.use("/api/v1/room", roomRoutes);

db();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
