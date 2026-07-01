import { Router } from "express";
import materiasController from "../Controllers/materias.controller.js";

const router = Router();

router.get("/", materiasController.getAllMaterias);
router.post("/", materiasController.createMateria);

router.get("/:id/profesores", materiasController.getMateriaProfessors);
router.post("/:id/profesores", materiasController.addProfessorToMateria);
router.delete("/:id/profesores/:userId", materiasController.removeProfessorFromMateria);

router.get("/:id/alumnos", materiasController.getMateriaStudents);
router.post("/:id/alumnos", materiasController.addStudentToMateria);
router.delete("/:id/alumnos/:userId", materiasController.removeStudentFromMateria);

router.get("/:id", materiasController.getMateriaById);
router.put("/:id", materiasController.updateMateria);
router.delete("/:id", materiasController.deleteMateria);

export default router;
