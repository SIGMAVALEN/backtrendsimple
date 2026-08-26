import { Router } from "express";
import materiasController from "../Controllers/materias.controller.js";
import { comp, soloProfesor } from "../security/auth.js";

const router = Router();

// Cualquier ruta de materias requiere estar autenticado.
router.use(comp);

// --- Lectura: alumnos y profesores por igual ---
router.get("/", materiasController.getAllMaterias);
router.get("/code/:code", materiasController.getMateriaByCode);

// --- Escritura de materias: solo profesores ---
router.post("/", soloProfesor, materiasController.createMateria);

// --- Profesores de una materia: gestionarlos es cosa de profesores ---
router.get("/:id/profesores", materiasController.getMateriaProfessors);
router.post("/:id/profesores", soloProfesor, materiasController.addProfessorToMateria);
router.delete("/:id/profesores/:userId", soloProfesor, materiasController.removeProfessorFromMateria);

// --- Alumnos de una materia: solo lectura para usuarios autenticados ---
router.get("/:id/alumnos", materiasController.getMateriaStudents);

// La inscripción y baja de alumnos es administración de materia: solo profesores.
router.post("/:id/alumnos", soloProfesor, materiasController.addStudentToMateria);
router.delete("/:id/alumnos/:userId", soloProfesor, materiasController.removeStudentFromMateria);

router.get("/:id", materiasController.getMateriaById);
router.put("/:id", soloProfesor, materiasController.updateMateria);
router.delete("/:id", soloProfesor, materiasController.deleteMateria);

export default router;
