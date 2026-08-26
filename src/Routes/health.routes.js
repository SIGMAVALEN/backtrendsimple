import { Router } from "express";
import healthController from "../Controllers/health.controller.js";
import { comp } from "../security/auth.js";

const router = Router();

router.get("/", healthController.getHealth);
router.get("/db", comp, healthController.getDBhealth);
export default router;