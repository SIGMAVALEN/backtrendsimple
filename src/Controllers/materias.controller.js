import materiasService from "../Services/materias.services.js";
import { esAlumno, esProfesor } from "../security/auth.js";

class MateriasController {
  async getAllMaterias(req, res) {
    try {
      const materias = await materiasService.getAllMaterias();
      res.json(materias);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMateriaById(req, res) {
    try {
      const materia = await materiasService.getMateriaById(req.params.id);
      if (!materia) {
        return res.status(404).json({ error: "Materia no encontrada" });
      }

      res.json(materia);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /materias/code/:code
   * Alternativa al UUID: buscar una materia por su código corto.
   */
  async getMateriaByCode(req, res) {
    try {
      const materia = await materiasService.getMateriaByCode(req.params.code);
      if (!materia) {
        return res.status(404).json({ error: "Materia no encontrada" });
      }

      res.json(materia);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createMateria(req, res) {
    try {
      const materia = await materiasService.createMateria(req.body);
      res.status(201).json(materia);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateMateria(req, res) {
    try {
      const materia = await materiasService.updateMateria(req.params.id, req.body);
      if (!materia) {
        return res.status(404).json({ error: "Materia no encontrada" });
      }

      res.json(materia);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteMateria(req, res) {
    try {
      const result = await materiasService.deleteMateria(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Solo un profesor llega hasta acá (ver middleware 'soloProfesor' en la ruta).
   * Si no se manda userId en el body, se asume que el profesor se está
   * agregando a sí mismo (usando el id que ya viene en su token).
   */
  async addProfessorToMateria(req, res) {
    try {
      const userId = req.body.userId ?? req.user.id;
      const result = await materiasService.addProfessorToMateria(req.params.id, userId);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeProfessorFromMateria(req, res) {
    try {
      const result = await materiasService.removeProfessorFromMateria(req.params.id, req.params.userId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMateriaProfessors(req, res) {
    try {
      const professors = await materiasService.listMateriaProfessors(req.params.id);
      res.json(professors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Esta ruta NO pasa por 'soloProfesor': tanto alumnos como profesores
   * pueden llegar acá. Reglas:
   *  - Alumno: solo puede anotarse a sí mismo. No hace falta mandar userId
   *    en el body, se usa el id del token. Si manda un userId distinto al
   *    propio, se rechaza.
   *  - Profesor: puede anotar a cualquier alumno pasando userId en el body.
   */
  async addStudentToMateria(req, res) {
    try {
      const solicitante = req.user;
      const userId = req.body.userId ?? solicitante.id;

      if (esAlumno(solicitante.type) && userId !== solicitante.id) {
        return res.status(403).json({ error: "Un alumno solo puede anotarse a sí mismo" });
      }

      if (!esAlumno(solicitante.type) && !esProfesor(solicitante.type)) {
        return res.status(403).json({ error: "Rol no autorizado" });
      }

      const result = await materiasService.addStudentToMateria(req.params.id, userId);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Mismo criterio que addStudentToMateria: el alumno se puede dar de baja
   * a sí mismo, el profesor puede dar de baja a cualquiera.
   */
  async removeStudentFromMateria(req, res) {
    try {
      const solicitante = req.user;
      const targetUserId = req.params.userId;

      if (esAlumno(solicitante.type) && targetUserId !== solicitante.id) {
        return res.status(403).json({ error: "Un alumno solo puede darse de baja a sí mismo" });
      }

      const result = await materiasService.removeStudentFromMateria(req.params.id, targetUserId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getMateriaStudents(req, res) {
    try {
      const students = await materiasService.listMateriaStudents(req.params.id);
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new MateriasController();
