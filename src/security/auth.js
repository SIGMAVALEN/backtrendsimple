// security/auth.js
import jwt from "jsonwebtoken";
import { config } from "../config.js";

/**
 * Tipos de usuario considerados "profesor" (normalizados en minúscula).
 * Se centraliza acá para no repetir la lista en cada service.
 */
export const TIPOS_PROFESOR = ["profesor", "professor", "teacher", "docente"];

/**
 * Tipos de usuario considerados "alumno".
 */
export const TIPOS_ALUMNO = ["alumno", "student", "alumn", "estudiante"];

const normalizarTipo = (valor) => String(valor || "").trim().toLowerCase();

export const esProfesor = (tipo) => TIPOS_PROFESOR.includes(normalizarTipo(tipo));
export const esAlumno = (tipo) => TIPOS_ALUMNO.includes(normalizarTipo(tipo));

/**
 * Genera un token usando jwtSecret.
 * payload debe incluir al menos { id, type } (o { id, role }).
 */
export const crearToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "24h" });
};

/**
 * Middleware 'comp': Verifica que exista el token y su autenticidad.
 * Si es válido, desencripta el payload, lo agrega a req.user y sigue.
 */
export const comp = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Acceso denegado. Token no proporcionado o formato inválido" });
    }

    const token = authHeader.split(" ")[1];

    // Se verifica el token con la clave secreta definida en config.js
    const decoded = jwt.verify(token, config.jwtSecret);

    // Normalizamos: el payload puede traer "type" o "role", dejamos ambos disponibles
    req.user = {
      ...decoded,
      id: decoded.id ?? decoded.sub,
      type: decoded.type ?? decoded.role,
    };

    next(); // Deriva a la ruta original
  } catch (error) {
    return res.status(403).json({ error: "Token inválido o expirado" });
  }
};

/**
 * Middleware 'soloProfesor': se usa DESPUÉS de 'comp'.
 * Corta la petición si el usuario autenticado no es profesor.
 * Los alumnos quedan así limitados a solo lectura (rutas GET) en materias.
 */
export const soloProfesor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Acceso denegado. Token no proporcionado" });
  }

  if (!esProfesor(req.user.type)) {
    return res.status(403).json({ error: "Solo un profesor puede realizar esta acción" });
  }

  next();
};
