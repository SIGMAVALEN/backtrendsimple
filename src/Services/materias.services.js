import { pool } from "../database.js";

class MateriasService {
  async getAllMaterias() {
    const result = await pool.query(
      `SELECT id, name, code, description, created_at, updated_at
       FROM materias
       ORDER BY name`
    );

    return result.rows;
  }

  async getMateriaById(id) {
    const result = await pool.query(
      `SELECT id, name, code, description, created_at, updated_at
       FROM materias
       WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }

  async createMateria(materia) {
    const { name, code, description } = materia;

    const result = await pool.query(
      `INSERT INTO materias (name, code, description)
       VALUES ($1, $2, $3)
       RETURNING id, name, code, description, created_at, updated_at`,
      [name, code, description]
    );

    return result.rows[0];
  }

  async updateMateria(id, materia) {
    const { name, code, description } = materia;

    const result = await pool.query(
      `UPDATE materias
       SET name = COALESCE($1, name),
           code = COALESCE($2, code),
           description = COALESCE($3, description),
           updated_at = now()
       WHERE id = $4
       RETURNING id, name, code, description, created_at, updated_at`,
      [name, code, description, id]
    );

    return result.rows[0];
  }

  async deleteMateria(id) {
    await pool.query("DELETE FROM materias WHERE id = $1", [id]);

    return { message: "Materia eliminada" };
  }

  async addProfessorToMateria(materiaId, userId) {
    const userResult = await pool.query(
      "SELECT id, type FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rowCount === 0) {
      throw new Error("Usuario no encontrado");
    }

    const userType = String(userResult.rows[0].type || "").trim().toLowerCase();
    const allowedTypes = ["profesor", "professor", "teacher", "docente"];

    if (!allowedTypes.includes(userType)) {
      throw new Error("El usuario debe ser un profesor para dictar una materia");
    }

    const result = await pool.query(
      `INSERT INTO materia_profesores (materia_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (materia_id, user_id) DO NOTHING
       RETURNING materia_id, user_id`,
      [materiaId, userId]
    );

    if (result.rowCount === 0) {
      return { message: "El profesor ya dicta esta materia", materiaId, userId };
    }

    return { message: "Profesor agregado a la materia", materiaId, userId };
  }

  async removeProfessorFromMateria(materiaId, userId) {
    await pool.query(
      `DELETE FROM materia_profesores
       WHERE materia_id = $1 AND user_id = $2`,
      [materiaId, userId]
    );

    return { message: "Profesor quitado de la materia", materiaId, userId };
  }

  async listMateriaProfessors(materiaId) {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.type
       FROM materia_profesores mp
       JOIN users u ON u.id = mp.user_id
       WHERE mp.materia_id = $1
       ORDER BY u.name`,
      [materiaId]
    );

    return result.rows;
  }

  async addStudentToMateria(materiaId, userId) {
    const userResult = await pool.query(
      "SELECT id, type FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rowCount === 0) {
      throw new Error("Usuario no encontrado");
    }

    const userType = String(userResult.rows[0].type || "").trim().toLowerCase();
    const allowedTypes = ["alumno", "student", "alumn", "estudiante"];

    if (!allowedTypes.includes(userType)) {
      throw new Error("El usuario debe ser un alumno para cursar una materia");
    }

    const result = await pool.query(
      `INSERT INTO materia_alumnos (materia_id, user_id)
       VALUES ($1, $2)
       ON CONFLICT (materia_id, user_id) DO NOTHING
       RETURNING materia_id, user_id`,
      [materiaId, userId]
    );

    if (result.rowCount === 0) {
      return { message: "El alumno ya cursa esta materia", materiaId, userId };
    }

    return { message: "Alumno agregado a la materia", materiaId, userId };
  }

  async removeStudentFromMateria(materiaId, userId) {
    await pool.query(
      `DELETE FROM materia_alumnos
       WHERE materia_id = $1 AND user_id = $2`,
      [materiaId, userId]
    );

    return { message: "Alumno quitado de la materia", materiaId, userId };
  }

  async listMateriaStudents(materiaId) {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.type
       FROM materia_alumnos ma
       JOIN users u ON u.id = ma.user_id
       WHERE ma.materia_id = $1
       ORDER BY u.name`,
      [materiaId]
    );

    return result.rows;
  }
}

export default new MateriasService();
