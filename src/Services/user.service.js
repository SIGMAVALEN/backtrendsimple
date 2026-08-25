import { pool } from "../database.js";

class UserService {
  async getAllUsers() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }

  async getUserById(id) {
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    return result.rows[0];
  }

  /**
   * Busca un usuario por email, para no tener que usar el UUID en el request.
   */
  async getUserByEmail(email) {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    return result.rows[0];
  }

  /**
   * Crea un usuario. Si se pasa un "id" (por ejemplo, el que ya viene en el
   * token emitido por el sistema de auth), se respeta ese id en vez de dejar
   * que la DB genere uno nuevo. Esto evita duplicar usuarios entre el
   * proveedor de auth y esta tabla local.
   */
  async createUser(user) {
    const { id, name, email, type } = user;

    const result = id
      ? await pool.query(
          `INSERT INTO users (id, name, email, type)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO UPDATE
             SET name = EXCLUDED.name,
                 email = EXCLUDED.email,
                 type = EXCLUDED.type,
                 updated_at = now()
           RETURNING *`,
          [id, name, email, type]
        )
      : await pool.query(
          "INSERT INTO users (name, email, type) VALUES ($1, $2, $3) RETURNING *",
          [name, email, type]
        );

    return result.rows[0];
  }

  async updateUser(id, user) {
    const { name, email, type } = user;

    const result = await pool.query(
      `UPDATE users
       SET name = COALESCE($1, name),
           email = COALESCE($2, email),
           type = COALESCE($3, type),
           updated_at = now()
       WHERE id = $4
       RETURNING *`,
      [name, email, type, id]
    );

    return result.rows[0];
  }

  async deleteUser(id) {
    await pool.query(
      "DELETE FROM users WHERE id = $1",
      [id]
    );

    return { message: "User deleted" };
  }
}

export default new UserService();
