import { Router } from "express";
import healthController from "../Controllers/health.controller.js";

const router = Router();

router.get("/", healthController.getHealth);
router.get("/db", healthController.getDBhealth);
export default router;