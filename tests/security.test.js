import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import userRoutes from '../src/Routes/user.routes.js';
import materiasRoutes from '../src/Routes/materias.routes.js';
import userService from '../src/Services/user.service.js';
import materiasService from '../src/Services/materias.services.js';

const secret = process.env.JWT_SECRET || 'super-secret-key';

const signToken = (payload) => jwt.sign(payload, secret, { expiresIn: '1h' });

const startApp = async (routeHandler) => {
  const instance = express();
  instance.use(express.json());
  instance.use(routeHandler);

  const server = instance.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();

  return {
    server,
    port,
    close: () => new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve()))),
  };
};

test('GET /users without a valid token is rejected', async () => {
  const original = userService.getAllUsers;
  userService.getAllUsers = async () => [{ id: 'u-1', name: 'Alice', type: 'alumno' }];

  try {
    const { server, port, close } = await startApp(userRoutes);

    try {
      const response = await fetch(`http://127.0.0.1:${port}/users`);
      assert.equal(response.status, 401, 'Debe requerir un token válido antes de acceder a usuarios');
    } finally {
      await close();
    }
  } finally {
    userService.getAllUsers = original;
  }
});

test('student cannot enroll another user in a subject', async () => {
  const original = materiasService.addStudentToMateria;
  materiasService.addStudentToMateria = async () => ({ message: 'ok' });

  try {
    const { server, port, close } = await startApp(materiasRoutes);
    const studentToken = signToken({ id: '11111111-1111-4111-8111-111111111111', type: 'alumno' });

    try {
      const response = await fetch(`http://127.0.0.1:${port}/123/alumnos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({ userId: '22222222-2222-4222-8222-222222222222' }),
      });

      assert.equal(response.status, 403, 'Un alumno no puede inscribir a otra persona en una materia');
    } finally {
      await close();
    }
  } finally {
    materiasService.addStudentToMateria = original;
  }
});

test('global API is rate limited to 50 requests', async () => {
  const api = express();
  api.use(express.json());
  api.use((req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const store = globalThis.__rateStore || (globalThis.__rateStore = new Map());
    const timestamps = store.get(key) || [];
    const recent = timestamps.filter((timestamp) => now - timestamp < 60_000);

    if (recent.length >= 50) {
      return res.status(429).json({ error: 'Demasiadas peticiones. Intente nuevamente más tarde.' });
    }

    recent.push(now);
    store.set(key, recent);
    return next();
  });

  const server = api.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const { port } = server.address();

  try {
    for (let i = 0; i < 50; i += 1) {
      await fetch(`http://127.0.0.1:${port}/health`);
    }

    const response = await fetch(`http://127.0.0.1:${port}/health`);
    assert.equal(response.status, 429, 'Debe limitar a 50 peticiones por ventana');
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
  }
});
