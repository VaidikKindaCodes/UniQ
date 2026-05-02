import express from "express";
import cors from "cors"; 
import healthRouter from "./routes/health.js";
import apiRouter from "./routes/index.js";
import { env } from "./config/env.js";

const app = express();

const allowedOrigins = [
  env.FRONTEND_URL,
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS origin denied: ${origin}`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// basic middleware
app.use(express.json());

// Main routes
app.use("/api", apiRouter);
app.use("/health", healthRouter);

export default app;
