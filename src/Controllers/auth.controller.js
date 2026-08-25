import userService from "../Services/user.service.js";
import { crearToken, esProfesor, esAlumno } from "../security/auth.js";

class AuthController {
  /**
   * POST /auth/register
   * Crea el usuario en la DB y devuelve, ya generado, el token que va
   * a usar en el resto de la API. Este es el punto de entrada real para
   * que un profesor o alumno "nuevo" consiga su primer token.
   *
   * Nota: no hay contraseña porque la tabla `users` no la contempla.
   * Si en algún momento se necesita login con clave, hay que agregar
   * una columna `password_hash` y validar con bcrypt en /auth/login.
   */
  async register(req, res) {
    try {
      const { name, email, type } = req.body;

      if (!name || !email || !type) {
        return res.status(400).json({ error: "name, email y type son obligatorios" });
      }

      if (!esProfesor(type) && !esAlumno(type)) {
        return res.status(400).json({ error: "type debe ser 'profesor' o 'alumno'" });
      }

      const existente = await userService.getUserByEmail(email);
      if (existente) {
        return res.status(409).json({ error: "Ya existe un usuario con ese email" });
      }

      const user = await userService.createUser({ name, email, type });
      const token = crearToken({ id: user.id, name: user.name, email: user.email, type: user.type });

      res.status(201).json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * POST /auth/login
   * Dado un email ya registrado, emite un token nuevo para ese usuario.
   * (Simplificado: identifica por email, sin contraseña. Ver nota arriba.)
   */
  async login(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "email es obligatorio" });
      }

      const user = await userService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const token = crearToken({ id: user.id, name: user.name, email: user.email, type: user.type });
      res.json({ user, token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

export default new AuthController();
