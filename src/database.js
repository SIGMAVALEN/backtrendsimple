//database
import { Pool } from "pg";
import dotenv from 'dotenv';
dotenv.config(); // Esto solo sirve para tu entorno local

export const config = {
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbPort: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 6543,
};
export const initializeDatabase = async () => {
  await pool.query(`
    create table if not exists users (
      id uuid primary key default gen_random_uuid(),
      email text not null unique,
      name text,
      type text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    

    create table materias (
      id uuid primary key default gen_random_uuid(),
      name text not null,
      code text unique,
      description text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    );

    create table materia_profesores (
      materia_id uuid not null references materias (id) on delete cascade,
      user_id uuid not null references users (id) on delete cascade,
      created_at timestamptz not null default now(),
      primary key (materia_id, user_id)
    );

    create table materia_alumnos (
      materia_id uuid not null references materias (id) on delete cascade,
      user_id uuid not null references users (id) on delete cascade,
      created_at timestamptz not null default now(),
      primary key (materia_id, user_id)
    );
  `);
};

initializeDatabase().catch((error) => {
  console.error("Database initialization failed:", error.message);
});