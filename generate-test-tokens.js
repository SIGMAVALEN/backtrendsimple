// generate-test-tokens.js
// En condiciones normales los tokens los genera la propia API
// (POST /auth/register o POST /auth/login) — para eso NO hace falta
// este script, `requests.http` los captura solo desde las respuestas.
//
// Este script solo sirve para los dos casos de seguridad que, a propósito,
// la API nunca te va a dar: un token vencido y un token firmado con una
// clave incorrecta. Se usan para probar que 'comp' los rechaza (403).
//
// Uso: node generate-test-tokens.js
// IMPORTANTE: el JWT_SECRET usado acá tiene que ser el mismo que tengas
// en tu .env, si no cambia el resultado esperado del test del token "falso".

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_dev_key_2026";
const ALUMNO_ID = "22222222-2222-4222-8222-222222222222";

// Token ya vencido, para probar el caso "Token inválido o expirado"
const expiredToken = jwt.sign(
  { id: ALUMNO_ID, name: "Juan Pérez", email: "juan.perez@demo.com", type: "alumno" },
  JWT_SECRET,
  { expiresIn: "-10s" }
);

// Token con formato válido pero firmado con OTRA clave (simula un token
// falsificado / emitido por otro sistema)
const fakeSignedToken = jwt.sign(
  { id: ALUMNO_ID, name: "Falso Profesor", email: "hacker@demo.com", type: "profesor" },
  "clave_incorrecta_para_probar_seguridad",
  { expiresIn: "365d" }
);

console.log("JWT_SECRET usado:", JWT_SECRET);
console.log("");
console.log("@expiredToken =", expiredToken);
console.log("");
console.log("@fakeSignedToken =", fakeSignedToken);
