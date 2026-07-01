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

  async createUser(user) {
    const { name, email, type } = user;

    const result = await pool.query(
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