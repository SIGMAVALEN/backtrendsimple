import { Router } from "express";
import authController from "../Controllers/auth.controller.js";

const router = Router();

// Estas dos rutas son las únicas de toda la API que NO requieren token,
// porque son justamente las que lo generan.
router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
