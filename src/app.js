//configuración de express
import express from "express";
import cors from "cors";
import morgan from "morgan";
import healthRoutes from "./Routes/health.routes.js";
import userRoutes from "./Routes/user.routes.js";
import materiasRoutes from "./Routes/materias.routes.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/users", userRoutes);
app.use("/materias", materiasRoutes);

export default app;
