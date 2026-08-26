import { Router } from "express";
import userController from "../Controllers/user.controller.js";
import { comp, soloProfesor } from "../security/auth.js";

const router = Router();

// Toda la gestión de usuarios requiere autenticación real.
router.get("/", comp, userController.getAllUsers);
router.get("/email/:email", comp, userController.getUserByEmail);
router.get("/:id", comp, userController.getUserById);

// El alta "normal" de un usuario es POST /auth/register (no requiere token
// porque es lo que lo genera). Esta ruta acá es para que un PROFESOR dé de
// alta usuarios administrativamente (por ejemplo, cargar alumnos a mano).
router.post("/", comp, soloProfesor, userController.createUser);

router.put("/:id", comp, soloProfesor, userController.updateUser);
router.delete("/:id", comp, soloProfesor, userController.deleteUser);

export default router;
