import materiasService from "../Services/materias.services.js";

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

  async addProfessorToMateria(req, res) {
    try {
      const result = await materiasService.addProfessorToMateria(req.params.id, req.body.userId);
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

  async addStudentToMateria(req, res) {
    try {
      const result = await materiasService.addStudentToMateria(req.params.id, req.body.userId);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async removeStudentFromMateria(req, res) {
    try {
      const result = await materiasService.removeStudentFromMateria(req.params.id, req.params.userId);
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
