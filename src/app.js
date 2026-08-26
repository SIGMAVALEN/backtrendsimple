//configuración de express
import express from "express";
import cors from "cors";
import morgan from "morgan";
import healthRoutes from "./Routes/health.routes.js";
import userRoutes from "./Routes/user.routes.js";
import materiasRoutes from "./Routes/materias.routes.js";
import authRoutes from "./Routes/auth.routes.js";

const app = express();
const requestStore = new Map();

const rateLimiter = (req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.headers["x-forwarded-for"] || "unknown";
  const timestamps = requestStore.get(key) || [];
  const recent = timestamps.filter((timestamp) => now - timestamp < 60_000);

  if (recent.length >= 50) {
    return res.status(429).json({ error: "Demasiadas peticiones. Intente nuevamente más tarde." });
  }

  recent.push(now);
  requestStore.set(key, recent);
  return next();
};

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(rateLimiter);

app.use("/auth", authRoutes);
app.use("/health", healthRoutes);
app.use("/users", userRoutes);
app.use("/materias", materiasRoutes);

export default app;
